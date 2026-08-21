import Ionicons from '@expo/vector-icons/Ionicons';
import {
  AudioModule,
  RecordingPresets,
  createAudioPlayer,
  setAudioModeAsync,
  useAudioRecorder,
  type AudioPlayer,
} from 'expo-audio';
import { File, Paths } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Body, GenieMark, Muted, Waveform,
} from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { DEFAULT_ANSWER, type QA } from '@/data/content';
import { useStore } from '@/state/store';

/**
 * Hosts the Ask Genie sheet and the toast, so any screen can open them without
 * threading state through navigation params. (Purchase is a basket flow on the
 * game detail screen, not a modal.)
 */

/**
 * Backend base URL. Must match the PC's WiFi IP — verify with `ipconfig`.
 * See API_CONTRACT → Base URL.
 */
const API_BASE = 'http://192.168.1.101:8000';

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

/* -------------------------------------------------------- ask genie modal -- */

function AskGenieModal({ gameName, onClose }: { gameName: string | null; onClose: () => void }) {
  const [question, setQuestion] = useState('');
  const [exchange, setExchange] = useState<QA>({ question: '', answer: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);

  // expo-audio recorder. This is a hook, so it must be called before any early
  // return — do not move it below the `if (!gameName)` guard.
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // The player is created fresh per answer (each one is a different MP3), so it
  // lives in a ref rather than state — we never render from it directly.
  const playerRef = useRef<AudioPlayer | null>(null);

  // Reset to empty exchange when the sheet is opened
  useEffect(() => {
    if (gameName) {
      setExchange({ question: '', answer: '' });
      setQuestion('');
      setError(null);
      setPlaying(false);
      setRecording(false);
    }
  }, [gameName]);

  // Release the audio player when this component unmounts
  useEffect(() => {
    return () => {
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []);

  if (!gameName) return null;

  const playAnswer = async (text: string) => {
    try {
      setPlaying(true);
      setError(null);

      // Release any player from a previous answer before making a new one
      playerRef.current?.remove();
      playerRef.current = null;

      const response = await expoFetch(`${API_BASE}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      // API_CONTRACT: /speak returns raw MP3 bytes (audio/mpeg). It is NOT JSON
      // and there is no `uri` field. Write the bytes to a cache file, play that.
      const bytes = await response.bytes();
      const file = new File(Paths.cache, `genie-answer-${Date.now()}.mp3`);
      file.write(bytes);

      const player = createAudioPlayer({ uri: file.uri });
      playerRef.current = player;

      player.addListener('playbackStatusUpdate', (status: any) => {
        if (status?.didJustFinish) setPlaying(false);
      });

      player.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      setPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);

      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone permission denied');
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      // Stop/release any previous recording session before preparing a new one
      try {
        await recorder.stop();
      } catch (e) {
        // Ignore if not currently recording
        console.log('Previous recording stopped');
      }

      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setRecording(false);

      const uri = recorder.uri;
      if (!uri) {
        setError('Failed to get recording');
        return;
      }

      setLoading(true);

      // API_CONTRACT: /transcribe expects multipart/form-data with a file field
      // named exactly "audio". Do NOT set Content-Type by hand — fetch has to
      // generate the multipart boundary itself.
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

      // API_CONTRACT: the response field is `transcript`, not `text`.
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

      const gameKey = gameName.toLowerCase().replace(/\s+/g, '_');
      console.log('Asking Genie:', { game: gameKey, question: trimmed });

      // API_CONTRACT: `game` is required in the body as well as the path.
      // `mode` must be "qa" — underscores only, no hyphens.
      const response = await expoFetch(`${API_BASE}/games/${gameKey}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameKey,
          question: trimmed,
          mode: 'qa',
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      setExchange({
        question: trimmed,
        answer: data.answer || DEFAULT_ANSWER,
      });
      setQuestion('');

      // Automatically play audio after getting answer
      await playAnswer(data.answer || DEFAULT_ANSWER);
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
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetScrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.sheet, styles.askSheet]}>
          <View style={styles.grabber} />

          <View style={styles.askHeader}>
            <GenieMark size={26} />
            <View style={{ flex: 1, marginLeft: Spacing.three }}>
              <Text style={styles.askTitle}>Ask Genie</Text>
              <Muted style={{ fontSize: 12 }}>{gameName} · voice or type</Muted>
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

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {/* Audio playback indicator */}
                    {playing && (
                      <View style={styles.speakingRow}>
                        <Waveform />
                        <Text style={styles.speakingText}>Playing audio...</Text>
                      </View>
                    )}

                    {!playing && exchange.answer && (
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

          <View style={styles.askInputRow}>
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
  );
}

/* ------------------------------------------------------------------ toast -- */

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

  unlockHero: { height: 150, borderRadius: 0 },
  sheetClose: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { padding: Spacing.five },

  unlockTitle: { fontFamily: Type.display, fontSize: 25, fontWeight: '700', color: Colors.text },

  checklist: { marginTop: Spacing.five, gap: Spacing.three },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkText: { flex: 1, fontFamily: Type.body, fontSize: 14, lineHeight: 20 },
  checkTextBold: { fontWeight: '700', color: Colors.text },
  checkTextMuted: { color: Colors.textSecondary },

  price: {
    fontFamily: Type.display,
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  priceFine: { textAlign: 'center', fontSize: 12, marginTop: Spacing.one },

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