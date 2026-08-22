import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { Waveform } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { getGame } from '@/data/games';
import { useStore } from '@/state/store';
import { useGameImages } from '@/hooks/useGameImages';

const API_BASE = 'http://192.168.1.101:8000';

interface IntroData {
  title: string;
  content: string;
}

/**
 * "What's It All About" — the free hook. Fetches intro from backend and displays
 * cover image. Same as the Playing screen's narration but reachable before purchase.
 */
export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useStore();
  const [paused, setPaused] = useState(false);
  const [intro, setIntro] = useState<IntroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const game = getGame(id) ?? getGame('pandemic')!;
  const owned = isUnlocked(game.id);
  const { images } = useGameImages(game.id);

  // Fetch intro from backend
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/games/${game.id}/intro`);

        if (!response.ok) {
          throw new Error(`Failed to load intro: ${response.status}`);
        }

        const data = await response.json();
        setIntro(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load intro');
        console.error('Error fetching intro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntro();
  }, [game.id]);

  const coverImage = images?.theme?.cover?.url;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <Artwork seed={`${game.id}-board`} radius={0} style={styles.board} />
        )}

        <View style={[styles.overlay, { paddingTop: insets.top + Spacing.two }]}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace(`/games/${game.id}`))}
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
          </Pressable>

          <View>
            <Text style={styles.tag}>WHAT'S IT ALL ABOUT</Text>
            <Text style={styles.headline}>{game.name}</Text>

            {loading ? (
              <View style={styles.narrationCard}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : error ? (
              <View style={styles.narrationCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : intro ? (
              <View style={styles.narrationCard}>
                <View style={styles.statusRow}>
                  <Waveform />
                  <Text style={styles.statusText}>
                    {paused ? 'Paused · Genie standing by' : 'Playing intro narration'}
                  </Text>
                </View>
                <Text style={styles.narrationBody}>{intro.content}</Text>
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={() => setPaused((p) => !p)}
                style={({ pressed }) => [styles.pauseButton, pressed && { opacity: 0.8 }]}>
                <Ionicons name={paused ? 'play' : 'pause'} size={14} color={Colors.onPrimary} />
                <Text style={styles.pauseText}>{paused ? 'Resume narration' : 'Pause narration'}</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push(owned ? '/playing/how-to-play' : (`/games/${game.id}` as never))}
                style={({ pressed }) => [styles.learnButton, pressed && { opacity: 0.8 }]}>
                <Text style={styles.learnText}>Learn to play ›</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },
  board: { flex: 1, minHeight: 640, borderRadius: 0, justifyContent: 'flex-start' },
  heroImage: { width: '100%', height: 320, borderRadius: 0 },
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
  tag: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: Colors.textOnDarkMuted,
    marginBottom: Spacing.two,
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
    minHeight: 120,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  statusText: {
    fontFamily: Type.body,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  narrationBody: {
    fontFamily: Type.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: Colors.textOnDarkMuted,
  },
  errorText: {
    fontFamily: Type.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: Colors.error || '#ff6b6b',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
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
  pauseText: {
    fontFamily: Type.body,
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  learnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  learnText: {
    fontFamily: Type.body,
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
});
