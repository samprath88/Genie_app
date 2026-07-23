import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { BasketButton } from '@/components/basket-button';
import { Pill } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { FILTERS, GAMES, priceLabel, type Category, type Game } from '@/data/games';
import { useStore } from '@/state/store';

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Category>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((g) => {
      const matchesFilter = filter === 'All' || g.categories.includes(filter);
      const matchesQuery = !q || g.name.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <View style={styles.root}>
      <FlatList
        data={results}
        keyExtractor={(g) => g.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.list, { paddingBottom: Spacing.seven }]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            {/* Translucent panel over artwork, as in the reference. */}
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
                ? `Showing all ${GAMES.length} games`
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
  return (
    <Pressable
      onPress={() => router.push(`/games/${game.id}`)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <Artwork seed={game.id} label={game.name} style={styles.cardArt}>
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
      </Artwork>

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
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
  // 4:5 portrait, matching the reference cards.
  cardArt: { width: '100%', aspectRatio: 4 / 5, borderRadius: 0 },

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
