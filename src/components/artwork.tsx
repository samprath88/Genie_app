import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Type } from '@/constants/theme';

/**
 * Stand-in for artwork we do not have yet — game box art, board photography and
 * the welcome photo. Renders a deterministic layered wash seeded from `seed`,
 * so a given game always looks the same across the shelf and its detail screen.
 *
 * REPLACE IN PHASE 2: swap the body for <Image source={...} /> once the real
 * assets land. Every caller already passes a stable `seed` (the game id), so
 * nothing else has to change.
 */

const SWATCHES = [
  ['#2C4A6B', '#1B2F45'],
  ['#7A3B2E', '#4A2119'],
  ['#3E5F4A', '#22392A'],
  ['#6B4A7A', '#3D2947'],
  ['#8A5A2B', '#553417'],
  ['#2F5F63', '#183538'],
  ['#7A2E3E', '#471821'],
  ['#4A5A2E', '#2A3418'],
];

/** Cheap stable string hash so the same seed always picks the same swatch. */
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type ArtworkProps = {
  seed: string;
  /** Shown centred when there is room — omit for small thumbnails. */
  label?: string;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  children?: React.ReactNode;
};

export function Artwork({ seed, label, style, radius = Radius.md, children }: ArtworkProps) {
  const h = hash(seed);
  const [base, deep] = SWATCHES[h % SWATCHES.length];

  return (
    <View style={[styles.root, { backgroundColor: base, borderRadius: radius }, style]}>
      {/* Two offset blooms fake the depth of a photograph without an image. */}
      <View
        style={[
          styles.bloom,
          {
            backgroundColor: deep,
            top: `${10 + (h % 25)}%`,
            left: `${-20 + (h % 30)}%`,
          },
        ]}
      />
      <View
        style={[
          styles.bloomLight,
          { top: `${40 + (h % 20)}%`, left: `${30 - (h % 25)}%` },
        ]}
      />

      {label ? (
        <View style={styles.labelWrap} pointerEvents="none">
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </View>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bloom: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 999,
    opacity: 0.85,
  },
  bloomLight: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  label: {
    fontFamily: Type.display,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
