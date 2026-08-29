import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { GenieLogo } from '@/components/genie-logo';
import { GenieMark, PrimaryButton } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';

/**
 * Home / welcome — the app's entry screen, shown before the tabbed app.
 * Kept intentionally simple for the foundation build.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* REPLACE IN PHASE 2: the reference uses a photo of people mid-game.
          Until then, a watermark logo keeps this reading as a designed hero. */}
      <Artwork seed="welcome-table" style={[styles.hero, { paddingTop: insets.top }]} radius={0}>
        <View style={styles.heroWatermark} pointerEvents="none">
          <GenieLogo size={104} />
        </View>
      </Artwork>

      <View style={[styles.panel, { paddingBottom: insets.bottom + Spacing.five }]}>
        <View style={styles.brand}>
          <GenieMark size={30} />
          <Text style={styles.wordmark}>GENIE</Text>
        </View>

        <Text style={styles.headline}>
          Skip to the{'\n'}
          <Text style={styles.headlineAccent}>good part.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Leave the rulebook closed. Genie teaches any game, answers any questions, and keeps score
          — so you just play.
        </Text>

        <PrimaryButton label="Get started" onPress={() => router.replace('/games')} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hero: { flex: 1, minHeight: 200 },
  heroWatermark: { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.9 },

  panel: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.five,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
  },

  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  wordmark: { fontFamily: Type.body, fontSize: 19, fontWeight: '700', letterSpacing: 5, color: Colors.text },

  headline: {
    fontFamily: Type.display,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.six,
  },
  headlineAccent: { color: Colors.primary },

  subtitle: {
    fontFamily: Type.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.four,
  },

  cta: { marginTop: Spacing.six },
});
