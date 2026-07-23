import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/artwork';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { CircleButton, GenieMark, Pill, Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { SETUP_STEPS } from '@/data/content';

/** Step-by-step physical setup. Dark body, matching the reference. */
export default function SetupGuideScreen() {
  const [index, setIndex] = useState(0);
  const { openAskGenie } = useOverlays();
  const step = SETUP_STEPS[index];

  return (
    <View style={styles.root}>
      <ScreenHeader title="Setup Guide" subtitle="Pandemic" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {SETUP_STEPS.map((s, i) => (
          <Pill key={s.tab} label={s.tab} active={i === index} onPress={() => setIndex(i)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed={`pandemic-setup-${index}`} style={styles.hero} />

        <Text style={styles.stepLabel}>
          Step {index + 1} of {SETUP_STEPS.length} · {step.title}
        </Text>

        <View style={styles.panel}>
          <View style={styles.statusRow}>
            <Waveform />
            <Text style={styles.statusText}>Now playing automatically</Text>
          </View>
          <Text style={styles.instruction}>{step.content}</Text>
        </View>

        <Pressable
          onPress={() => openAskGenie('Pandemic')}
          style={({ pressed }) => [styles.genieButton, pressed && { opacity: 0.8 }]}>
          <GenieMark size={30} color={Colors.onPrimary} />
        </Pressable>

        <View style={styles.nav}>
          <CircleButton
            icon="chevron-back"
            variant="soft"
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          />
          <CircleButton
            icon="chevron-forward"
            variant="primary"
            onPress={() => setIndex((i) => Math.min(SETUP_STEPS.length - 1, i + 1))}
            disabled={index === SETUP_STEPS.length - 1}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  tabs: { gap: Spacing.two, padding: Layout.screenPadding },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.six,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { width: '100%', height: 190 },

  stepLabel: {
    fontFamily: Type.body,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: Spacing.four,
  },

  panel: {
    backgroundColor: Colors.backgroundInset,
    borderRadius: Radius.md,
    padding: Spacing.four,
    marginTop: Spacing.three,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  statusText: { fontFamily: Type.body, fontSize: 12.5, fontWeight: '600', color: Colors.primary },
  instruction: { fontFamily: Type.body, fontSize: 15, lineHeight: 23, color: Colors.text },

  genieButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Spacing.five,
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.five,
  },
});
