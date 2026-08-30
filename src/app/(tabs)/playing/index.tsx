import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { SecondaryButton, SectionLabel } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { getFeaturesForGame, type Feature } from '@/data/content';
import { GAME_NAMES, getGame } from '@/data/games';
import { useStore } from '@/state/store';

export default function PlayingHubScreen() {
  const insets = useSafeAreaInsets();
  const { currentGame, isUnlocked, addToBasket } = useStore();
  const owned = isUnlocked(currentGame);
  const game = getGame(currentGame);
  const features = game ? getFeaturesForGame(game) : [];

  const handleFeatureTap = (feature: Feature) => {
    // Preview/About goes to a different route
    if (feature.key === 'about') return router.push(`/games/preview?id=${currentGame}`);
    
    // If feature is paid and not owned, do nothing (button is disabled)
    if (!feature.free && !owned) return;
    
    // Navigate to the feature screen
    if (feature.route) router.push(feature.route as never);
  };

  const handleUnlockAll = () => {
    // Navigate to game detail to purchase
    router.push(`/games/${currentGame}`);
  };

  const handleBack = () => {
    // Always go back to Games Catalogue (only in hub if game is owned)
    router.push('/games');
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={handleBack}
          hitSlop={10}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Select a Mode</Text>
          <Text style={styles.headerSubtitle}>{GAME_NAMES[currentGame] || currentGame}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <SectionLabel>How do you want to play?</SectionLabel>

        {features.map((feature) => {
          const locked = !feature.free && !owned;
          
          return (
            <Pressable
              key={feature.key}
              onPress={() => handleFeatureTap(feature)}
              disabled={locked}
              style={({ pressed }) => [
                styles.modeCard,
                locked && styles.modeCardLocked,
                pressed && !locked && { opacity: 0.85 },
              ]}>
              {/* Left accent stripe */}
              <View style={[styles.modeStripe, { backgroundColor: feature.accent }]} />

              {/* Content area */}
              <View style={styles.modeContent}>
                <Text style={[styles.modeTitle, locked && styles.modeTitleLocked]}>
                  {feature.title}
                </Text>
                
                <Text style={[styles.modeDescription, locked && styles.modeDescriptionLocked]}>
                  {feature.description}
                </Text>
              </View>

              {/* Right icon */}
              <View style={[styles.modeIcon, locked && styles.modeIconLocked]}>
                <Ionicons
                  name={locked ? 'lock-closed' : 'chevron-forward'}
                  size={18}
                  color={locked ? Colors.textTertiary : Colors.primary}
                />
              </View>
            </Pressable>
          );
        })}

        {/* Info text */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            Tap any mode to start. Use the mode switcher in each screen to jump between modes.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    backgroundColor: Colors.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSecondary,
  },
  headerSubtitle: {
    fontFamily: Type.body,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.half,
  },

  content: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.seven,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },

  modeCard: {
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
  modeCardLocked: {
    opacity: 0.6,
  },
  modeStripe: {
    width: 4,
    alignSelf: 'stretch',
  },

  modeContent: {
    flex: 1,
    padding: Spacing.four,
  },
  modeTitle: {
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.one,
  },
  modeTitleLocked: {
    color: Colors.textSecondary,
  },

  modeDescription: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  modeDescriptionLocked: {
    color: Colors.textTertiary,
  },

  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundInset,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  modeIconLocked: {
    backgroundColor: 'transparent',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    backgroundColor: Colors.backgroundInset,
    borderRadius: Radius.md,
    padding: Spacing.four,
    marginTop: Spacing.five,
  },
  infoText: {
    flex: 1,
    fontFamily: Type.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
});