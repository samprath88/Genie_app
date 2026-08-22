import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/artwork';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { CircleButton, GenieMark, Pill, Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { useStore } from '@/state/store';
import { useGameImages } from '@/hooks/useGameImages';

const GAME_NAMES: Record<string, string> = {
  pandemic: 'Pandemic',
  catan: 'Catan',
  ticket_to_ride: 'Ticket to Ride',
};

interface SetupStep {
  title: string;
  content: string;
}

interface ComponentImage {
  label: string;
  url: string;
}

// Find the most mentioned component in step text
function findTopComponentMatch(
  stepText: string,
  components: Record<string, any>
): ComponentImage | null {
  if (!components || Object.keys(components).length === 0) {
    return null;
  }

  let topMatch: { component: string; count: number; image: ComponentImage } | null = null;

  Object.entries(components).forEach(([componentKey, componentData]) => {
    if (!componentData.keywords || componentData.keywords.length === 0) return;

    let keywordCount = 0;

    componentData.keywords.forEach((keyword: string) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = stepText.match(regex);
      if (matches) {
        keywordCount += matches.length;
      }
    });

    if (keywordCount > 0 && (!topMatch || keywordCount > topMatch.count)) {
      topMatch = {
        component: componentKey,
        count: keywordCount,
        image: {
          label: componentData.label,
          url: componentData.url,
        },
      };
    }
  });

  return topMatch?.image || null;
}

export default function SetupGuideScreen() {
  const { currentGame } = useStore();
  const { images } = useGameImages(currentGame);
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState<SetupStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const [relatedImage, setRelatedImage] = useState<ComponentImage | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const { openAskGenie } = useOverlays();

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/setup`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedSteps: SetupStep[] = data.steps.map((s: any) => ({
          title: s.title || `Step`,
          content: s.content || s.instruction || '',
        }));
        
        setSteps(transformedSteps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load setup steps');
        console.error('Error fetching setup steps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, [currentGame]);

  // Update component image when step changes
  useEffect(() => {
    if (steps.length > 0 && images?.components) {
      const currentStep = steps[index];
      const stepText = `${currentStep.title} ${currentStep.content}`;
      const topMatch = findTopComponentMatch(stepText, images.components);
      setRelatedImage(topMatch);
    }
  }, [index, steps, images]);

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
        <Text style={styles.errorText}>Failed to load setup guide</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </View>
    );
  }

  const step = steps[index];
  const gameName = GAME_NAMES[currentGame] || currentGame;
  const setupImage = images?.theme?.setup?.url;

  return (
    <>
      <View style={styles.root}>
        <View style={styles.headerRow}>
          <ScreenHeader 
            title="Setup Guide" 
            subtitle={gameName}
            onBack={() => router.push('/playing')}
          />
          <Pressable 
            onPress={() => setShowModeSwitcher(true)}
            hitSlop={20}
            style={({ pressed }) => [styles.modeButton, pressed && { opacity: 0.7 }]}>
            <Ionicons name="swap-vertical" size={20} color={Colors.onPrimary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {steps.map((s, i) => (
            <Pill key={i} label={`Step ${i + 1}`} active={i === index} onPress={() => setIndex(i)} />
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.content}>
          {setupImage ? (
            <Image 
              source={{ uri: setupImage }} 
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <Artwork seed={`${currentGame}-setup-${index}`} style={styles.hero} />
          )}

          <Text style={styles.stepLabel}>
            Step {index + 1} of {steps.length} · {step.title}
          </Text>

          <View style={styles.panel}>
            <View style={styles.statusRow}>
              <Waveform />
              <Text style={styles.statusText}>Now playing automatically</Text>
            </View>
            <Text style={styles.instruction}>{step.content}</Text>
          </View>

          {relatedImage && (
            <Pressable
              onPress={() => setShowImageModal(true)}
              style={styles.relatedImageCard}>
              <Image 
                source={{ uri: relatedImage.url }} 
                style={styles.relatedImageThumbnail}
                resizeMode="cover"
              />
              <View style={styles.relatedImageLabel}>
                <Text style={styles.relatedImageLabelText}>{relatedImage.label}</Text>
                <Ionicons name="expand" size={14} color={Colors.textSecondary} />
              </View>
            </Pressable>
          )}

          <Pressable
            onPress={() => openAskGenie(currentGame)}
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
              onPress={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
              disabled={index === steps.length - 1}
            />
          </View>
        </ScrollView>

        <ModeSwitcher 
          visible={showModeSwitcher} 
          onClose={() => setShowModeSwitcher(false)}
          currentMode="setup-guide"
        />
      </View>

      {/* Full-screen image modal */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <View style={styles.imageModalScrim}>
          <Pressable 
            style={StyleSheet.absoluteFill} 
            onPress={() => setShowImageModal(false)} 
          />
          
          {relatedImage && (
            <View style={styles.imageModalContainer}>
              <Pressable 
                style={styles.imageCloseButton}
                onPress={() => setShowImageModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
              
              <Image 
                source={{ uri: relatedImage.url }} 
                style={styles.imageModalImage}
                resizeMode="contain"
              />
              
              <Text style={styles.imageModalLabel}>{relatedImage.label}</Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Spacing.three,
    backgroundColor: Colors.secondary,
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  
  tabs: { gap: Spacing.two, padding: Layout.screenPadding },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.six,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { width: '100%', height: 190 },
  heroImage: { width: '100%', height: 240, borderRadius: 8, marginBottom: Spacing.four },
  
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
  
  relatedImageCard: {
    marginTop: Spacing.four,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  relatedImageThumbnail: {
    width: '100%',
    height: 160,
  },
  relatedImageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: Colors.backgroundInset,
  },
  relatedImageLabelText: {
    fontFamily: Type.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },

  imageModalScrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  imageCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.three,
    padding: Spacing.two,
  },
  imageModalImage: {
    width: '100%',
    height: 400,
  },
  imageModalLabel: {
    fontFamily: Type.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onPrimary,
    marginTop: Spacing.three,
    textAlign: 'center',
  },
  
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
