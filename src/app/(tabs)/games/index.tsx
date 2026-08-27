import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { BasketButton } from '@/components/basket-button';
import { Pill } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { FILTERS, priceLabel, type Category, type Game } from '@/data/games';
import { useStore } from '@/state/store';

const API_BASE = 'http://192.168.1.101:8000';

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/games`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const transformedGames = data.games.map((g: any) => ({
          id: g.key,
          name: g.displayName,
          rating: g.rating || 0,
          price: g.price || 0,
          categories: [g.category || 'Strategy'],
          image: g.thumbnail,
        }));

        setGames(transformedGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      const matchesFilter = filter === 'All' || g.categories.includes(filter);
      const matchesQuery = !q || g.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter, games]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load games</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={results}
        keyExtractor={(g) => g.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.list, { paddingBottom: Layout.tabBarHeight + 10 }]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Artwork seed="games-shelf" radius={0} style={[styles.banner, { paddingTop: insets.top }]}>
              <View style={styles.bannerInner}>
                <View style={styles.bannerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bannerTitle}>Games</Text>
                    <Text style={styles.bannerSubtitle}>Browse the shelf · pick a game to buy</Text>
                  </View>
                  <BasketButton />
                </View>

                <View style={styles.search}>
                  <Ionicons name="search" size={16} color={Colors.textOnDarkMuted} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search games, designers..."
                    placeholderTextColor={Colors.textOnDarkMuted}
                    style={styles.searchInput}
                  />
                </View>
              </View>
            </Artwork>

            <View style={styles.filters}>
              {FILTERS.map((f) => (
                <Pill key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
              ))}
            </View>

            <Text style={styles.resultCount}>
              {filter === 'All' && !query
                ? `Showing all ${games.length} games`
                : `${results.length} game${results.length === 1 ? '' : 's'}`}
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No games match that search.</Text>}
        renderItem={({ item }) => <GameCard game={item} owned={isUnlocked(item.id)} />}
      />
    </View>
  );
}

function GameCard({ game, owned }: { game: Game; owned: boolean }) {
  const [imageLoading, setImageLoading] = useState(true);
  const coverImageUrl = `${API_BASE}/games/${game.id}/images`;

  const getCoverImage = async () => {
    try {
      const response = await fetch(coverImageUrl);
      if (response.ok) {
        const data = await response.json();
        return data.theme?.cover?.url || null;
      }
    } catch (err) {
      console.error('Error fetching cover image:', err);
    }
    return null;
  };

  return (
    <Pressable
      onPress={() => router.push(`/games/${game.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <GameCardImage gameId={game.id} gameName={game.name} />

      <View style={styles.tag}>
        <Text style={styles.tagText}>{game.categories[0].toUpperCase()}</Text>
      </View>

      <View style={styles.rating}>
        <Ionicons name="star" size={10} color={Colors.primary} />
        <Text style={styles.ratingText}>{game.rating.toFixed(1)}</Text>
      </View>

      {owned ? (
        <View style={styles.ownedBadge}>
          <Ionicons name="checkmark" size={13} color={Colors.onPrimary} />
        </View>
      ) : null}

      <View style={styles.cardMeta}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {game.name}
        </Text>
        <View style={styles.cardBottom}>
          <Text style={styles.cardPrice}>{owned ? 'Owned' : priceLabel(game)}</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
        </View>
      </View>
    </Pressable>
  );
}

function GameCardImage({ gameId, gameName }: { gameId: string; gameName: string }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        const response = await fetch(`${API_BASE}/games/${gameId}/images`);
        if (response.ok) {
          const data = await response.json();
          setCoverUrl(data.theme?.cover?.url || null);
        }
      } catch (err) {
        console.error(`Error fetching cover for ${gameId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverImage();
  }, [gameId]);

  if (loading) {
    return (
      <View style={[styles.cardArt, styles.cardArtPlaceholder]}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }

  if (coverUrl) {
    return (
      <Image
        source={{ uri: coverUrl }}
        style={styles.cardArt}
        resizeMode="cover"
      />
    );
  }

  return (
    <Artwork seed={gameId} label={gameName} style={styles.cardArt} />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  list: { maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },
  column: { gap: Spacing.three, paddingHorizontal: Layout.screenPadding },

  banner: { paddingBottom: Spacing.four, minHeight: 150 },
  bannerInner: { paddingHorizontal: Layout.screenPadding, paddingTop: Spacing.four },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    borderRadius: Radius.md,
    padding: Spacing.three,
  },
  bannerTitle: { fontFamily: Type.display, fontSize: 27, fontWeight: '700', color: Colors.textOnDark },
  bannerSubtitle: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textOnDarkMuted, marginTop: 1 },
  bookmark: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    height: 42,
    marginTop: Spacing.three,
  },
  searchInput: { flex: 1, fontFamily: Type.body, fontSize: 14, color: Colors.textOnDark },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.four,
  },
  resultCount: {
    fontFamily: Type.body,
    fontSize: 12.5,
    color: Colors.textSecondary,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  empty: {
    fontFamily: Type.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.six,
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

  card: {
    flex: 1,
    marginBottom: Spacing.four,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.card,
  },
  cardArt: { width: '100%', aspectRatio: 4 / 5, borderRadius: 0 },
  cardArtPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.backgroundInset },

  tag: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    backgroundColor: 'rgba(30,16,14,0.72)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  tagText: { fontFamily: Type.body, fontSize: 9, fontWeight: '700', letterSpacing: 0.6, color: Colors.textOnDark },

  rating: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(30,16,14,0.72)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  ratingText: { fontFamily: Type.body, fontSize: 10.5, fontWeight: '700', color: Colors.textOnDark },

  ownedBadge: {
    position: 'absolute',
    bottom: Spacing.two,
    right: Spacing.two,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardMeta: { padding: Spacing.three },
  cardTitle: { fontFamily: Type.body, fontSize: 14.5, fontWeight: '700', color: Colors.text },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardPrice: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textSecondary },
});