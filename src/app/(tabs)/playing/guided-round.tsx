import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { useOverlays } from '@/components/overlays';
import { CircleButton, GenieMark, Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { GUIDED_ROUND } from '@/data/content';
import Ionicons from '@expo/vector-icons/Ionicons';

/** Full-bleed, dark, one step at a time — the most cinematic screen in the app. */
export default function GuidedRoundScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const { openAskGenie } = useOverlays();
  const step = GUIDED_ROUND[index];
  const isLast = index === GUIDED_ROUND.length - 1;

  return (
    <Artwork seed={`guided-${index}`} radius={0} style={styles.root}>
      <View style={[styles.overlay, { paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.four }]}>
        <View style={styles.top}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/playing'))}
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Guided First Round</Text>
          <View style={styles.back} />
        </View>

        {/* Progress dots, one per step. */}
        <View style={styles.dots}>
          {GUIDED_ROUND.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.center}>
          <Text style={styles.stepLabel}>
            STEP {index + 1} OF {GUIDED_ROUND.length}
          </Text>
          <Text style={styles.headline}>{step.headline}</Text>
          <Text style={styles.narration}>{step.narration}</Text>
        </View>

        <View>
          <View style={styles.statusRow}>
            <Waveform />
            <Text style={styles.statusText}>Now playing</Text>
          </View>

          <View style={styles.nav}>
            <CircleButton
              icon="chevron-back"
              onPress={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            />

            <Pressable
              onPress={() => openAskGenie('Pandemic')}
              style={({ pressed }) => [styles.askButton, pressed && { opacity: 0.8 }]}>
              <GenieMark size={17} color={Colors.textOnDark} />
              <Text style={styles.askText}>Ask Genie</Text>
            </Pressable>

            <CircleButton
              icon={isLast ? 'checkmark' : 'chevron-forward'}
              variant="primary"
              onPress={() =>
                isLast ? router.push('/playing/scoring') : setIndex((i) => i + 1)
              }
            />
          </View>
        </View>
      </View>
    </Artwork>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, borderRadius: 0 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,14,12,0.58)',
    paddingHorizontal: Layout.screenPadding,
    justifyContent: 'space-between',
  },

  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  back: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnDark,
  },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two, marginTop: Spacing.three },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 22, backgroundColor: Colors.primary },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stepLabel: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.textOnDarkMuted,
  },
  headline: {
    fontFamily: Type.display,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textOnDark,
    textAlign: 'center',
    marginTop: Spacing.three,
  },
  narration: {
    fontFamily: Type.body,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    marginTop: Spacing.four,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statusText: { fontFamily: Type.body, fontSize: 12.5, fontWeight: '600', color: Colors.primary },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.three },
  askButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: 48,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  askText: { fontFamily: Type.body, fontSize: 14.5, fontWeight: '700', color: Colors.textOnDark },
});
