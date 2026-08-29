import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModeSwitcher } from '@/components/ModeSwitcher';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, SecondaryButton, SectionLabel, Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { GAME_NAMES } from '@/data/games';
import { useGameImages } from '@/hooks/useGameImages';
import { useNarration } from '@/hooks/useNarration';
import { useTabBarClearance } from '@/hooks/useTabBarClearance';
import { useStore } from '@/state/store';

interface GuidedStep {
  title: string;
  content: string;
}

export default function GuidedRoundScreen() {
  const tabBarClearance = useTabBarClearance();
  const { currentGame, autoplay } = useStore();
  const { images } = useGameImages(currentGame);
  const { openAskGenie } = useOverlays();
  const [steps, setSteps] = useState<GuidedStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const narration = useNarration();

  useFocusEffect(
    useCallback(() => {
      const text = steps[activeStep]?.content;
      if (autoplay && text) {
        narration.play(text);
      }
      return () => narration.stop();
      // Step/autoplay changes should (re)start narration while focused;
      // losing focus always stops it, via the cleanup below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps, activeStep, autoplay]),
  );

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/first-round`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedSteps: GuidedStep[] = data.steps.map((s: any) => ({
          title: s.title || 'Step',
          content: s.instruction || s.content || '',
        }));
        
        setSteps(transformedSteps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load guided round');
        console.error('Error fetching guided round:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, [currentGame]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || steps.length === 0) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load guided first round</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </View>
    );
  }

  const step = steps[activeStep];
  const gameName = GAME_NAMES[currentGame] || currentGame;
  const firstRoundImage = images?.theme?.first_round?.url;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Guided First Round"
        subtitle={gameName}
        onBack={() => router.push('/playing')}
        right={
          <Pressable
            onPress={() => setShowModeSwitcher(true)}
            hitSlop={20}
            style={({ pressed }) => [styles.modeButton, pressed && { opacity: 0.7 }]}>
            <Ionicons name="swap-vertical" size={18} color={Colors.textOnDark} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
        {firstRoundImage && (
          <Image 
            source={{ uri: firstRoundImage }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        <SectionLabel>Walking through your first turn</SectionLabel>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((activeStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.stepCounter}>
          Step {activeStep + 1} of {steps.length}
        </Text>

        <View style={styles.card}>
          <Text style={styles.stepTitle}>{step.title}</Text>

          <Pressable
            onPress={() =>
              narration.playing ? narration.stop() : narration.play(step.content)
            }
            style={({ pressed }) => [styles.narrationRow, pressed && { opacity: 0.7 }]}>
            {narration.playing ? (
              <Waveform color={Colors.primary} height={14} />
            ) : (
              <Ionicons name="volume-medium-outline" size={16} color={Colors.textSecondary} />
            )}
            <Text style={styles.narrationText}>
              {narration.playing ? 'Now playing automatically' : 'Tap to hear this step'}
            </Text>
          </Pressable>

          <Text style={styles.stepContent}>{step.content}</Text>
        </View>

        <View style={styles.buttonRow}>
          <SecondaryButton
            label="← Back"
            onPress={() => setActiveStep((i) => Math.max(0, i - 1))}
            disabled={activeStep === 0}
            style={styles.navButton}
          />
          <SecondaryButton
            label="Next →"
            onPress={() => setActiveStep((i) => Math.min(steps.length - 1, i + 1))}
            disabled={activeStep === steps.length - 1}
            style={styles.navButton}
          />
        </View>

        <Pressable 
          onPress={() => openAskGenie(currentGame)}
          style={({ pressed }) => [styles.infoPanel, pressed && { opacity: 0.7 }]}>
          <GenieMark size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            Need clarification? Ask Genie any questions about this step.
          </Text>
        </Pressable>
      </ScrollView>

      <ModeSwitcher 
        visible={showModeSwitcher} 
        onClose={() => setShowModeSwitcher(false)}
        currentMode="guided-round"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  
  modeButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: Layout.screenPadding,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },

  heroImage: { width: '100%', height: 240, borderRadius: 8, marginBottom: Spacing.four },

  progressBar: {
    height: 4,
    backgroundColor: Colors.backgroundInset,
    borderRadius: 2,
    marginTop: Spacing.four,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },

  stepCounter: {
    fontFamily: Type.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.two,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.four,
    marginTop: Spacing.four,
  },
  stepTitle: {
    fontFamily: Type.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.two,
  },
  narrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  narrationText: { fontFamily: Type.body, fontSize: 12.5, fontWeight: '600', color: Colors.textSecondary },
  stepContent: {
    fontFamily: Type.body,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.text,
    flexWrap: 'wrap',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.five,
  },
  navButton: {
    flex: 1,
  },

  infoPanel: {
    flexDirection: 'row',
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
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },

  errorText: {
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.two,
  },
  errorDetail: {
    fontFamily: Type.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});