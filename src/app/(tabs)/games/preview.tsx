import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { NARRATION } from '@/data/content';
import { getGame } from '@/data/games';
import { useStore } from '@/state/store';

/**
 * "What's It All About" — the free hook. Same narration board as the Playing
 * screen, but reachable before purchase. "Learn to play" nudges owners into the
 * mode screens and everyone else back to the package picker.
 */
export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useStore();
  const [paused, setPaused] = useState(false);

  const game = getGame(id) ?? getGame('pandemic')!;
  const owned = isUnlocked(game.id);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed={`${game.id}-board`} radius={0} style={styles.board}>
          <View style={[styles.overlay, { paddingTop: insets.top + Spacing.two }]}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace(`/games/${game.id}`))}
              hitSlop={10}
              style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
              <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
            </Pressable>

            <View>
              <Text style={styles.tag}>WHAT'S IT ALL ABOUT</Text>
              <Text style={styles.headline}>Why {game.name} owns your table tonight</Text>

              <View style={styles.narrationCard}>
                <View style={styles.statusRow}>
                  <Waveform />
                  <Text style={styles.statusText}>
                    {paused ? 'Paused · Genie standing by' : NARRATION.status}
                  </Text>
                </View>
                <Text style={styles.narrationBody}>{NARRATION.body}</Text>
              </View>

              <View style={styles.actions}>
                {/* UI placeholder — audio playback lands in Phase 2. */}
                <Pressable
                  onPress={() => setPaused((p) => !p)}
                  style={({ pressed }) => [styles.pauseButton, pressed && { opacity: 0.8 }]}>
                  <Ionicons name={paused ? 'play' : 'pause'} size={14} color={Colors.onPrimary} />
                  <Text style={styles.pauseText}>{paused ? 'Resume narration' : 'Pause narration'}</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push(owned ? '/playing/how-to-play' : (`/games/${game.id}` as never))}
                  style={({ pressed }) => [styles.learnButton, pressed && { opacity: 0.8 }]}>
                  <Text style={styles.learnText}>Learn to play ›</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Artwork>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },

  board: { flex: 1, minHeight: 640, borderRadius: 0, justifyContent: 'flex-start' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18,26,38,0.45)',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.five,
    justifyContent: 'space-between',
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tag: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: Colors.textOnDarkMuted,
    marginBottom: Spacing.two,
  },
  headline: {
    fontFamily: Type.display,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginBottom: Spacing.four,
  },

  narrationCard: { backgroundColor: 'rgba(20,12,10,0.72)', borderRadius: Radius.md, padding: Spacing.four },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  statusText: { fontFamily: Type.body, fontSize: 12, fontWeight: '600', color: Colors.primary },
  narrationBody: { fontFamily: Type.body, fontSize: 13.5, lineHeight: 21, color: Colors.textOnDarkMuted },

  actions: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.four },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  pauseText: { fontFamily: Type.body, fontSize: 13.5, fontWeight: '700', color: Colors.onPrimary },
  learnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  learnText: { fontFamily: Type.body, fontSize: 13.5, fontWeight: '700', color: Colors.textOnDark },
});
