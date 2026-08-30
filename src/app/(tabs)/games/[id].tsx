import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { BasketButton } from '@/components/basket-button';
import { SecondaryButton, SectionLabel } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { getFeaturesForGame, type Feature } from '@/data/content';
import { formatPrice, getGame, getPackages, priceLabel, type Tier } from '@/data/games';
import { useStore } from '@/state/store';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isUnlocked, addToBasket, setCurrentGame } = useStore();

  const game = getGame(id);

  // Set current game in global state when this game is viewed
  useEffect(() => {
    if (game) setCurrentGame(game.id);
  }, [game, setCurrentGame]);
  
  const [selected, setSelected] = useState<Tier>('bundle');

  if (!game) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>That game isn't on the shelf.</Text>
      </View>
    );
  }

  const owned = isUnlocked(game.id);
  const features = getFeaturesForGame(game);
  const packages = getPackages(game);
  const chosen = packages.find((p) => p.tier === selected)!;

  const onFeaturePress = (feature: Feature) => {
    // The free hook flows into the preview/narration screen. Locked modes need
    // a package; free-but-unlocked modes jump straight to their screen.
    if (feature.key === 'about') return router.push(`/games/preview?id=${game.id}`);
    if (!feature.free && !owned) return; // choose a package below to unlock
    if (feature.route) router.push(feature.route as never);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed={game.id} radius={0} style={styles.hero}>
          <View style={[styles.heroOverlay, { paddingTop: insets.top + Spacing.two }]}>
            <View style={styles.heroTop}>
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/games'))}
                hitSlop={10}
                style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
                <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
              </Pressable>
              <BasketButton />
            </View>

            <View style={styles.heroText}>
              <Text style={styles.heroCategory}>{game.categories.join(' · ').toUpperCase()}</Text>
              <Text style={styles.heroTitle}>{game.name}</Text>
              <Text style={styles.heroTagline}>{game.tagline}</Text>
              <Text style={styles.heroPrice}>{owned ? 'Owned' : priceLabel(game)}</Text>
            </View>
          </View>
        </Artwork>

        <View style={styles.body}>
          <SectionLabel>Everything Genie can do</SectionLabel>

          {features.map((feature) => {
            const locked = !feature.free && !owned;
            return (
              <Pressable
                key={feature.key}
                onPress={() => onFeaturePress(feature)}
                style={({ pressed }) => [styles.feature, pressed && { opacity: 0.85 }]}>
                <View style={[styles.featureStripe, { backgroundColor: feature.accent }]} />
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, locked && styles.lockedText]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, locked && styles.lockedText]}>
                    {feature.description}
                  </Text>
                  
                </View>
                <View style={[styles.featureIcon, locked && styles.featureIconLocked]}>
                  <Ionicons
                    name={locked ? 'lock-closed' : 'volume-medium'}
                    size={15}
                    color={locked ? Colors.textSecondary : Colors.onPrimary}
                  />
                </View>
              </Pressable>
            );
          })}

          {owned ? (
            <SecondaryButton
              label="Start playing"
              onPress={() => router.push('/playing')}
              style={{ marginTop: Spacing.five }}
            />
          ) : (
            <>
              <SectionLabel style={styles.packagesLabel}>Choose your package</SectionLabel>

              {packages.map((pkg) => {
                const active = pkg.tier === selected;
                return (
                  <Pressable
                    key={pkg.tier}
                    onPress={() => setSelected(pkg.tier)}
                    style={[styles.package, active && styles.packageActive]}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <Ionicons name="checkmark" size={13} color={Colors.onSecondary} /> : null}
                    </View>

                    <View style={styles.packageText}>
                      <View style={styles.packageTitleRow}>
                        <Text style={styles.packageTitle}>{pkg.title}</Text>
                        {pkg.bestValue ? (
                          <View style={styles.bestValue}>
                            <Text style={styles.bestValueText}>BEST VALUE</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.packageSubtitle}>{pkg.subtitle}</Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.packagePrice}>{formatPrice(pkg.pricePence)}</Text>
                        {pkg.strikePence ? (
                          <Text style={styles.strike}>{formatPrice(pkg.strikePence)}</Text>
                        ) : null}
                        {pkg.savePence ? (
                          <Text style={styles.save}>Save {formatPrice(pkg.savePence)}</Text>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })}

              <SecondaryButton
                label={`Add to basket · ${formatPrice(chosen.pricePence)}`}
                onPress={() =>
                  addToBasket({
                    gameId: game.id,
                    tier: chosen.tier,
                    pricePence: chosen.pricePence,
                    unlocks: chosen.unlocks,
                  })
                }
                style={{ marginTop: Spacing.five }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.seven, maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  missingText: { fontFamily: Type.body, color: Colors.textSecondary },

  hero: { minHeight: 260, borderRadius: 0, justifyContent: 'flex-start' },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28,14,12,0.42)',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.four,
    justifyContent: 'space-between',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { marginTop: Spacing.five },
  heroCategory: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textOnDarkMuted,
  },
  heroTitle: {
    fontFamily: Type.display,
    fontSize: 34,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginTop: Spacing.one,
  },
  heroTagline: {
    fontFamily: Type.body,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.two,
  },
  heroPrice: {
    fontFamily: Type.body,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: Spacing.three,
  },

  body: { padding: Layout.screenPadding, paddingTop: Spacing.five },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    ...Shadow.card,
  },
  featureStripe: { width: 4, alignSelf: 'stretch' },
  featureText: { flex: 1, padding: Spacing.four },
  featureTitle: { fontFamily: Type.body, fontSize: 16, fontWeight: '700', color: Colors.text },
  featureDescription: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginTop: Spacing.one,
  },
  lockedText: { color: Colors.textTertiary },
  freeLabel: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.primary,
    marginTop: Spacing.two,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.four,
  },
  featureIconLocked: { backgroundColor: Colors.backgroundInset },

  packagesLabel: { marginTop: Spacing.six },
  package: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    ...Shadow.card,
  },
  packageActive: { borderColor: Colors.secondary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  packageText: { flex: 1 },
  packageTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  packageTitle: { fontFamily: Type.body, fontSize: 16, fontWeight: '700', color: Colors.text },
  bestValue: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  bestValueText: {
    fontFamily: Type.body,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: Colors.onPrimary,
  },
  packageSubtitle: {
    fontFamily: Type.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.two, marginTop: Spacing.three },
  packagePrice: { fontFamily: Type.body, fontSize: 18, fontWeight: '800', color: Colors.text },
  strike: {
    fontFamily: Type.body,
    fontSize: 13,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  save: { fontFamily: Type.body, fontSize: 12.5, fontWeight: '700', color: '#4E7B4E' },
});