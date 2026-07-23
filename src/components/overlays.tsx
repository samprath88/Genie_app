import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
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
import { DEFAULT_ANSWER, QA_DATABASE, type QA } from '@/data/content';
import { useStore } from '@/state/store';

/**
 * Hosts the Ask Genie sheet and the toast, so any screen can open them without
 * threading state through navigation params. (Purchase is a basket flow on the
 * game detail screen, not a modal.)
 */

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
  const [exchange, setExchange] = useState<QA>(QA_DATABASE[0]);

  // Reset to the sample exchange each time the sheet is reopened.
  useEffect(() => {
    if (gameName) {
      setExchange(QA_DATABASE[0]);
      setQuestion('');
    }
  }, [gameName]);

  if (!gameName) return null;

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const match = QA_DATABASE.find((qa) =>
      qa.question.toLowerCase().includes(trimmed.toLowerCase().slice(0, 12)),
    );
    setExchange(match ?? { question: trimmed, answer: DEFAULT_ANSWER });
    setQuestion('');
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
            <View style={styles.questionBubble}>
              <Text style={styles.questionText}>{exchange.question}</Text>
            </View>

            <Body style={{ marginTop: Spacing.four }}>{exchange.answer}</Body>

            {/* UI placeholder — no audio is wired until Phase 2. */}
            <View style={styles.speakingRow}>
              <Waveform />
              <Text style={styles.speakingText}>Speaking the answer aloud</Text>
            </View>

            <Muted style={{ marginTop: Spacing.five, marginBottom: Spacing.two }}>Try asking</Muted>
            {QA_DATABASE.slice(1).map((qa) => (
              <Pressable
                key={qa.question}
                onPress={() => setExchange(qa)}
                style={({ pressed }) => [styles.suggestion, pressed && { opacity: 0.7 }]}>
                <Text style={styles.suggestionText}>{qa.question}</Text>
              </Pressable>
            ))}
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
            />
            <Pressable
              onPress={() => ask(question)}
              style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.7 }]}>
              <Ionicons name="arrow-up" size={18} color={Colors.onPrimary} />
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
  askBody: { paddingHorizontal: Spacing.four },

  questionBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
  },
  questionText: { fontFamily: Type.body, fontSize: 14, fontWeight: '600', color: Colors.onSecondary },

  speakingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.four },
  speakingText: { fontFamily: Type.body, fontSize: 12.5, fontStyle: 'italic', color: Colors.primary },

  suggestion: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.two,
  },
  suggestionText: { fontFamily: Type.body, fontSize: 13.5, color: Colors.text },

  askInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
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
