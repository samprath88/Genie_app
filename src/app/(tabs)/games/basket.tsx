import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Card, SecondaryButton } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { formatPrice, getGame, getPackages } from '@/data/games';
import { useStore } from '@/state/store';

const TIER_LABEL: Record<string, string> = {
  bundle: 'Complete Bundle',
  instructions: 'Instructions Only',
  board: 'Board Game Only',
};

export default function BasketScreen() {
  const { basket, removeFromBasket, basketTotalPence, checkout } = useStore();

  const onCheckout = () => {
    checkout();
    router.replace('/games');
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Basket" subtitle={`${basket.length} item${basket.length === 1 ? '' : 's'}`} />

      {basket.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bag-handle-outline" size={40} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>Your basket is empty.</Text>
          <Pressable onPress={() => router.replace('/games')} style={styles.browse}>
            <Text style={styles.browseText}>Browse the shelf</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Card padded={false}>
            {basket.map((item, i) => {
              const game = getGame(item.gameId);
              const pkg = game ? getPackages(game).find((p) => p.tier === item.tier) : undefined;
              return (
                <View
                  key={item.gameId}
                  style={[styles.row, i < basket.length - 1 && styles.rowBorder]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowGame}>{game?.name ?? item.gameId}</Text>
                    <Text style={styles.rowTier}>{TIER_LABEL[item.tier]}</Text>
                    {pkg && !pkg.unlocks ? (
                      <Text style={styles.rowNote}>Physical item · no Genie modes</Text>
                    ) : null}
                  </View>
                  <Text style={styles.rowPrice}>{formatPrice(item.pricePence)}</Text>
                  <Pressable onPress={() => removeFromBasket(item.gameId)} hitSlop={8} style={styles.remove}>
                    <Ionicons name="close" size={16} color={Colors.textSecondary} />
                  </Pressable>
                </View>
              );
            })}
          </Card>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(basketTotalPence)}</Text>
          </View>

          <SecondaryButton
            label={`Checkout · ${formatPrice(basketTotalPence)}`}
            onPress={onCheckout}
            style={{ marginTop: Spacing.four }}
          />
          <Text style={styles.fine}>
            Placeholder checkout — no payment is taken. Instruction packages unlock instantly.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.seven,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.six },
  emptyText: { fontFamily: Type.body, fontSize: 15, color: Colors.textSecondary },
  browse: {
    marginTop: Spacing.two,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
  },
  browseText: { fontFamily: Type.body, fontSize: 14, fontWeight: '700', color: Colors.onPrimary },

  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.four },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowGame: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },
  rowTier: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textSecondary, marginTop: 1 },
  rowNote: { fontFamily: Type.body, fontSize: 11.5, fontStyle: 'italic', color: Colors.textTertiary, marginTop: 2 },
  rowPrice: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },
  remove: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.backgroundInset,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  totalLabel: { fontFamily: Type.body, fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  totalValue: { fontFamily: Type.display, fontSize: 24, fontWeight: '800', color: Colors.text },

  fine: {
    fontFamily: Type.body,
    fontSize: 11.5,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.three,
  },
});
