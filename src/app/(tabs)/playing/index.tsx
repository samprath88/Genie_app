import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { NARRATION } from '@/data/content';
import { getGame } from '@/data/games';
import { useStore } from '@/state/store';

/** The active-game board with Genie's narration overlay. */
export default function PlayingScreen() {
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useStore();
  const [paused, setPaused] = useState(false);

  const game = getGame('pandemic')!;
  const owned = isUnlocked(game.id);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed={`${game.id}-board`} radius={0} style={styles.board}>
          <View style={[styles.overlay, { paddingTop: insets.top + Spacing.two }]}>
            <Pressable
              onPress={() => router.push('/games')}
              hitSlop={10}
              style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
              <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
            </Pressable>

            <View>
              <Text style={styles.headline}>{NARRATION.headline}</Text>

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
                {/* UI placeholder — toggles label only until audio lands in Phase 2. */}
                <Pressable
                  onPress={() => setPaused((p) => !p)}
                  style={({ pressed }) => [styles.pauseButton, pressed && { opacity: 0.8 }]}>
                  <Ionicons
                    name={paused ? 'play' : 'pause'}
                    size={14}
                    color={Colors.onPrimary}
                  />
                  <Text style={styles.pauseText}>
                    {paused ? 'Resume narration' : 'Pause narration'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push(owned ? '/playing/how-to-play' : '/games/pandemic')}
                  style={({ pressed }) => [styles.learnButton, pressed && { opacity: 0.8 }]}>
                  <Text style={styles.learnText}>Learn to play ›</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Artwork>

        <View style={styles.jump}>
          {[
            { label: 'How to Play', route: '/playing/how-to-play', icon: 'book-outline' },
            { label: 'Setup Guide', route: '/playing/setup-guide', icon: 'construct-outline' },
            { label: 'Guided Round', route: '/playing/guided-round', icon: 'compass-outline' },
            { label: 'Scoring Assist', route: '/playing/scoring', icon: 'trophy-outline' },
          ].map((item) => (
            <Pressable
              key={item.route}
              onPress={() => router.push((owned ? item.route : '/games/pandemic') as never)}
              style={({ pressed }) => [styles.jumpItem, pressed && { opacity: 0.8 }]}>
              <Ionicons
                name={item.icon as React.ComponentProps<typeof Ionicons>['name']}
                size={18}
                color={Colors.text}
              />
              <Text style={styles.jumpLabel}>{item.label}</Text>
              {!owned ? <Ionicons name="lock-closed" size={13} color={Colors.textTertiary} /> : null}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.six, maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },

  board: { minHeight: 560, borderRadius: 0, justifyContent: 'flex-start' },
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

  headline: {
    fontFamily: Type.display,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginBottom: Spacing.four,
  },

  narrationCard: {
    backgroundColor: 'rgba(20,12,10,0.72)',
    borderRadius: Radius.md,
    padding: Spacing.four,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  statusText: { fontFamily: Type.body, fontSize: 12, fontWeight: '600', color: Colors.primary },
  narrationBody: {
    fontFamily: Type.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: Colors.textOnDarkMuted,
  },

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

  jump: { padding: Layout.screenPadding, gap: Spacing.two },
  jumpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.four,
    height: 50,
  },
  jumpLabel: { flex: 1, fontFamily: Type.body, fontSize: 15, fontWeight: '600', color: Colors.text },
});
