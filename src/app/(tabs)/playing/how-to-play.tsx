import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/artwork';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, Pill, Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing } from '@/constants/theme';
import { GAME_NAMES } from '@/data/games';
import { useGameImages } from '@/hooks/useGameImages';
import { useNarration } from '@/hooks/useNarration';
import { useTabBarClearance } from '@/hooks/useTabBarClearance';
import { useStore } from '@/state/store';

interface Section {
  id: string;
  title: string;
  content: string;
}

export default function HowToPlayScreen() {
  const { section: sectionParam } = useLocalSearchParams<{ section?: string }>();
  const tabBarClearance = useTabBarClearance();
  const { currentGame, autoplay } = useStore();
  const { images } = useGameImages(currentGame);
  const [active, setActive] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const { openAskGenie } = useOverlays();
  const narration = useNarration();

  useEffect(() => {
    if (!sectionParam || !sections.length) return;
    const idx = sections.findIndex((s) => s.id === sectionParam);
    if (idx >= 0) setActive(idx);
  }, [sectionParam, sections]);

  useFocusEffect(
    useCallback(() => {
      const text = sections[active]?.content;
      if (autoplay && text) {
        narration.play(text);
      }
      return () => narration.stop();
      // Section/autoplay changes should (re)start narration while focused;
      // losing focus always stops it, via the cleanup below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections, active, autoplay]),
  );

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/how-to-play`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformedSections: Section[] = data.sections.map((s: any) => ({
          id: s.id,
          title: s.title,
          content: s.content,
        }));
        
        setSections(transformedSections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        console.error('Error fetching how-to-play:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentGame]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || sections.length === 0) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load how-to-play content</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </View>
    );
  }

  const section = sections[active];
  const gameName = GAME_NAMES[currentGame] || currentGame;
  const coverImage = images?.theme?.cover?.url;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="How to Play"
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {sections.map((s, i) => (
          <Pill key={s.id} label={s.title} active={i === active} onPress={() => setActive(i)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
        {coverImage ? (
          <Image 
            source={{ uri: coverImage }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <Artwork seed={`${currentGame}-how-to-play-${active}`} style={styles.hero} />
        )}

        <Text style={styles.sectionTitle}>{section.title}</Text>

        <Pressable
          onPress={() =>
            narration.playing ? narration.stop() : narration.play(section.content)
          }
          style={({ pressed }) => [styles.narrationRow, pressed && { opacity: 0.7 }]}>
          {narration.playing ? (
            <Waveform color={Colors.primary} height={14} />
          ) : (
            <Ionicons name="volume-medium-outline" size={16} color={Colors.textSecondary} />
          )}
          <Text style={styles.narrationText}>
            {narration.playing ? 'Now playing automatically' : 'Tap to hear this section'}
          </Text>
        </Pressable>

        <Text style={styles.body}>{section.content}</Text>

        <Pressable
          onPress={() => openAskGenie(currentGame)}
          style={({ pressed }) => [styles.genieButton, pressed && { opacity: 0.7 }]}>
          <GenieMark size={20} color={Colors.onPrimary} />
          <Text style={styles.genieButtonText}>Ask about this</Text>
        </Pressable>
      </ScrollView>

      <ModeSwitcher 
        visible={showModeSwitcher} 
        onClose={() => setShowModeSwitcher(false)}
        currentMode="how-to-play"
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

  tabs: { gap: Spacing.two, paddingHorizontal: Layout.screenPadding, paddingVertical: Spacing.three },
  content: {
    padding: Layout.screenPadding,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { width: '100%', height: 190, borderRadius: 8, marginBottom: Spacing.four },
  heroImage: { width: '100%', height: 240, borderRadius: 8, marginBottom: Spacing.four },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.three,
  },
  narrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  narrationText: { fontFamily: 'System', fontSize: 12.5, fontWeight: '600', color: Colors.textSecondary },
  body: {
    fontFamily: 'System',
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: Spacing.five,
  },
  genieButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  genieButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.two,
  },
  errorDetail: {
    fontFamily: 'System',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});