interface ComponentImage {
  label: string;
  url: string;
}

import Ionicons from '@expo/vector-icons/Ionicons';
import { AudioStudioModule, useAudioRecorder as useAudioStudioRecorder } from '@siteed/audio-studio';
import { setAudioModeAsync } from 'expo-audio';
import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Body, GenieMark, Muted, Waveform,
} from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { DEFAULT_ANSWER, type QA } from '@/data/content';
import { GAME_NAMES } from '@/data/games';
import { useGameImages } from '@/hooks/useGameImages';
import { stopAllNarration, useNarration } from '@/hooks/useNarration';
import { useStore } from '@/state/store';

const API_BASE = 'http://192.168.1.101:8000';

interface ComponentImage {
  label: string;
  url: string;
}

type Overlays = {
  openAskGenie: (gameName: string) => void;
};

const OverlayContext = createContext<Overlays | null>(null);

export function useOverlays() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlays must be used inside <OverlayProvider>');
  return ctx;
}

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [askGenieFor, setAskGenieFor] = useState<string | null>(null);
  const value = useMemo<Overlays>(() => ({ openAskGenie: setAskGenieFor }), []);

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <AskGenieModal gameName={askGenieFor} onClose={() => setAskGenieFor(null)} />
      <Toast />
    </OverlayContext.Provider>
  );
}

// Find the most mentioned component in the answer text
function findTopComponentMatch(
  answer: string,
  components: Record<string, any>
): ComponentImage | null {
  if (!components || Object.keys(components).length === 0) {
    return null;
  }

  let topMatch: { component: string; count: number; image: ComponentImage } | null = null;

  Object.entries(components).forEach(([componentKey, componentData]) => {
    if (!componentData.keywords || componentData.keywords.length === 0) return;

    let keywordCount = 0;

    // Count keyword matches in answer (case-insensitive, whole words only)
    componentData.keywords.forEach((keyword: string) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = answer.match(regex);
      if (matches) {
        keywordCount += matches.length;
      }
    });

    // Keep track of component with most keyword hits
    if (keywordCount > 0 && (!topMatch || keywordCount > topMatch.count)) {
      topMatch = {
        component: componentKey,
        count: keywordCount,
        image: {
          label: componentData.label || '',
          url: componentData.url || '',
        },
      };
    }
  });

  return topMatch?.image || null;
}

function AskGenieModal({ gameName, onClose }: { gameName: string | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const gameToLoad = gameName || '';
  const { images } = useGameImages(gameToLoad);
  const [question, setQuestion] = useState('');
  const [exchange, setExchange] = useState<QA>({ question: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [relatedImage, setRelatedImage] = useState<ComponentImage | null>(null) as any;
  const [showImageModal, setShowImageModal] = useState(false);

  const { startRecording: startAudioStudioRecording, stopRecording: stopAudioStudioRecording } =
    useAudioStudioRecorder();
  const narration = useNarration();

  useEffect(() => {
    if (gameName) {
      setExchange({ question: '', answer: '' });
      setQuestion('');
      setError(null);
      // Whatever's narrating — this modal's own answer audio, or a screen behind
      // it — should stop the moment Ask Genie opens, since voice input is on offer.
      stopAllNarration();
      setRecording(false);
      setRelatedImage(null);
      setShowImageModal(false);
    }
    // Reopening for a different game/question should reset — not on every narration state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName]);

  if (!gameName) return null;

  const playAnswer = (text: string) => narration.play(text);

  const startRecording = async () => {
    try {
      setError(null);
      const { status } = await AudioStudioModule.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Microphone permission denied');
        return;
      }

      // Shared iOS audio session category — governs recording regardless of
      // which native module (this one, or expo-audio for playback) initiates it.
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      // Records LINEAR16 mono WAV directly at the sample rate Google STT
      // wants, so the backend no longer needs to transcode AAC before sending it.
      await startAudioStudioRecording({
        sampleRate: 16000,
        channels: 1,
        encoding: 'pcm_16bit',
        output: { primary: { enabled: true } },
      });
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await stopAudioStudioRecording();
      setRecording(false);

      const uri = result?.fileUri;
      if (!uri) {
        setError('Failed to get recording');
        return;
      }

      setLoading(true);

      const audioFile = new File(uri);
      const form = new FormData();
      form.append('audio', audioFile as any);

      const response = await expoFetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Transcription failed: ${response.status} — ${detail}`);
      }

      const data = await response.json();
      const transcript: string = data.transcript ?? '';

      if (transcript) {
        setQuestion(transcript);
        await ask(transcript);
      } else {
        setError('Could not transcribe audio. Try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error transcribing:', err);
      setError(err instanceof Error ? err.message : 'Failed to transcribe');
      setRecording(false);
      setLoading(false);
    }
  };

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError(null);
      setRelatedImage(null);

      const gameKey = gameName.toLowerCase().replace(/\s+/g, '_');
      console.log('Asking Genie:', { game: gameKey, question: trimmed });

      const response = await expoFetch(`${API_BASE}/games/${gameKey}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameKey,
          question: trimmed,
          mode: 'qa',
          provider: 'deepseek',
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const answer = data.answer || DEFAULT_ANSWER;

      setExchange({
        question: trimmed,
        answer,
      });

      // Find the top component match in the answer
      if (images && images.components) {
        const topMatch = findTopComponentMatch(answer, images.components);
        if (topMatch) {
          setRelatedImage(topMatch);
        }
      }

      setQuestion('');
      await playAnswer(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
      console.error('Error asking Genie:', err);
      setExchange({
        question: trimmed,
        answer: DEFAULT_ANSWER,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal visible transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.sheetScrim}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          <View style={[styles.sheet, styles.askSheet]}>
            <View style={styles.grabber} />

            <View style={styles.askHeader}>
              <GenieMark size={26} />
              <View style={{ flex: 1, marginLeft: Spacing.three }}>
                <Text style={styles.askTitle}>Ask Genie</Text>
                <Muted style={{ fontSize: 12 }}>
                  {GAME_NAMES[gameName] || gameName} · voice or type
                </Muted>
              </View>
              <Pressable onPress={onClose} hitSlop={8} style={styles.askClose}>
                <Ionicons name="close" size={18} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.askBody} keyboardShouldPersistTaps="handled">
              {exchange.question && (
                <View style={styles.questionBubble}>
                  <Text style={styles.questionText}>{exchange.question}</Text>
                </View>
              )}

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>Getting answer...</Text>
                </View>
              ) : (
                <>
                  {exchange.answer && (
                    <>
                      <Body style={{ marginTop: Spacing.four }}>{exchange.answer}</Body>

                      {relatedImage && (
                        <Pressable
                          onPress={() => setShowImageModal(true)}
                          style={styles.relatedImageCard}>
                          <Image 
                            source={{ uri: relatedImage.url }} 
                            style={styles.relatedImageThumbnail}
                            resizeMode="cover"
                          />
                          <View style={styles.relatedImageLabel}>
                            <Text style={styles.relatedImageLabelText} numberOfLines={1}>
                              {relatedImage.label}
                            </Text>
                            <Ionicons name="expand" size={14} color={Colors.textSecondary} />
                          </View>
                        </Pressable>
                      )}

                      {(error || narration.error) && (
                        <Text style={styles.errorText}>{error || narration.error}</Text>
                      )}

                      {narration.playing && (
                        <View style={styles.speakingRow}>
                          <Waveform />
                          <Text style={styles.speakingText}>Playing audio...</Text>
                        </View>
                      )}

                      {!narration.playing && exchange.answer && (
                        <Pressable
                          onPress={() => playAnswer(exchange.answer)}
                          style={({ pressed }) => [styles.playButton, pressed && { opacity: 0.7 }]}>
                          <Ionicons name="volume-high" size={16} color={Colors.onPrimary} />
                          <Text style={styles.playButtonText}>Play audio</Text>
                        </Pressable>
                      )}
                    </>
                  )}

                  {!exchange.answer && !loading && (
                    <Text style={styles.emptyState}>Ask me anything about the rules!</Text>
                  )}

                  {!exchange.answer && !loading && error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}
                </>
              )}
            </ScrollView>

            <View style={[styles.askInputRow, { paddingBottom: insets.bottom + Spacing.four }]}>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Type your question..."
                placeholderTextColor={Colors.textTertiary}
                style={styles.askInput}
                returnKeyType="send"
                onSubmitEditing={() => ask(question)}
                editable={!loading && !recording}
              />
              <Pressable
                onPress={() => ask(question)}
                disabled={loading}
                style={({ pressed }) => [styles.sendButton, (pressed || loading) && { opacity: 0.7 }]}>
                <Ionicons name="arrow-up" size={18} color={Colors.onPrimary} />
              </Pressable>
              <Pressable
                onPress={recording ? stopRecording : startRecording}
                disabled={loading}
                style={({ pressed }) => [
                  styles.micButton,
                  recording && styles.micButtonActive,
                  (pressed || loading) && { opacity: 0.7 },
                ]}>
                <Ionicons name={recording ? 'stop' : 'mic'} size={18} color={Colors.onPrimary} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full-screen image modal */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <View style={styles.imageModalScrim}>
          <Pressable 
            style={StyleSheet.absoluteFill} 
            onPress={() => setShowImageModal(false)} 
          />
          
          {relatedImage && (
            <View style={styles.imageModalContainer}>
              <Pressable 
                style={styles.imageCloseButton}
                onPress={() => setShowImageModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
              
              <Image 
                source={{ uri: relatedImage.url }} 
                style={styles.imageModalImage}
                resizeMode="contain"
              />
              
              <Text style={styles.imageModalLabel}>{relatedImage.label}</Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

function Toast() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <View style={styles.toastWrap} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.toastText}>{toast}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetScrim: { flex: 1, backgroundColor: Colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '92%',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    overflow: 'hidden',
    ...Shadow.modal,
  },

  askSheet: { paddingTop: Spacing.two },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },

  askHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  askTitle: { fontFamily: Type.body, fontSize: 16, fontWeight: '700', color: Colors.text },
  askClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.backgroundInset,
    alignItems: 'center',
    justifyContent: 'center',
  },

  askBody: { paddingHorizontal: Spacing.four, minHeight: 120 },

  questionBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  questionText: { fontFamily: Type.body, fontSize: 14, fontWeight: '600', color: Colors.onSecondary },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  loadingText: {
    fontFamily: Type.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.three,
  },

  emptyState: {
    fontFamily: Type.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.four,
  },

  relatedImageCard: {
    width: 160,
    alignSelf: 'flex-start',
    marginTop: Spacing.four,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  relatedImageThumbnail: {
    width: 160,
    height: 160,
  },
  relatedImageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: Colors.backgroundInset,
  },
  relatedImageLabelText: {
    flex: 1,
    marginRight: Spacing.one,
    fontFamily: Type.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },

  imageModalScrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  imageCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.three,
    padding: Spacing.two,
  },
  imageModalImage: {
    width: '100%',
    height: 400,
  },
  imageModalLabel: {
    fontFamily: Type.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onPrimary,
    marginTop: Spacing.three,
    textAlign: 'center',
  },

  speakingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.four },
  speakingText: { fontFamily: Type.body, fontSize: 12.5, fontStyle: 'italic', color: Colors.primary },

  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    marginTop: Spacing.four,
  },
  playButtonText: {
    fontFamily: Type.body,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onPrimary,
  },

  errorText: {
    fontFamily: Type.body,
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.three,
  },

  askInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  askInput: {
    flex: 1,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.four,
    fontFamily: Type.body,
    fontSize: 14,
    color: Colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: Colors.secondary,
  },

  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: Layout.tabBarHeight + 24, alignItems: 'center' },
  toast: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.pill,
    ...Shadow.modal,
  },
  toastText: { fontFamily: Type.body, fontSize: 14, fontWeight: '600', color: Colors.onSecondary },
});
