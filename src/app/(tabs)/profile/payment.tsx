import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Card, SectionLabel } from '@/components/ui';
import { CardBrandColors, Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { formatPrice } from '@/data/games';
import { PAYMENT_METHODS, useStore } from '@/state/store';

export default function PaymentMethodsScreen() {
  const { showToast } = useStore();

  return (
    <View style={styles.root}>
      <ScreenHeader title="Payment methods" subtitle="Cards & billing" />

      <ScrollView contentContainerStyle={styles.content}>
        <SectionLabel>Your cards</SectionLabel>

        {PAYMENT_METHODS.cards.map((card) => (
          <View
            key={card.id}
            style={[styles.card, { backgroundColor: CardBrandColors[card.type] ?? Colors.secondary }]}>
            <View style={styles.cardTop}>
              <Text style={styles.cardBrand}>{card.type}</Text>
              {card.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>DEFAULT</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
            <Text style={styles.cardExpiry}>Expires {card.expires}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => showToast('Add payment method — coming in the next build')}
          style={({ pressed }) => [styles.addCard, pressed && { opacity: 0.7 }]}>
          <Text style={styles.addCardText}>+ Add payment method</Text>
        </Pressable>

        <SectionLabel style={{ marginTop: Spacing.five }}>Billing history</SectionLabel>
        <Card padded={false}>
          {PAYMENT_METHODS.billingHistory.map((entry, i) => (
            <View
              key={entry.game}
              style={[
                styles.historyRow,
                i < PAYMENT_METHODS.billingHistory.length - 1 && styles.historyBorder,
              ]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyGame}>{entry.game}</Text>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
              <Text style={styles.historyAmount}>{formatPrice(entry.amountPence)}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
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

  card: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    minHeight: 118,
    justifyContent: 'space-between',
    ...Shadow.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardBrand: { fontFamily: Type.body, fontSize: 16, fontWeight: '700', color: Colors.textOnDark },
  defaultBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  defaultText: { fontFamily: Type.body, fontSize: 9, fontWeight: '700', letterSpacing: 0.7, color: Colors.text },
  cardNumber: {
    fontFamily: Type.body,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textOnDark,
    marginTop: Spacing.four,
  },
  cardExpiry: { fontFamily: Type.body, fontSize: 12, color: Colors.textOnDarkMuted, marginTop: Spacing.two },

  addCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: 'center',
  },
  addCardText: { fontFamily: Type.body, fontSize: 14, fontWeight: '600', color: Colors.textSecondary },

  historyRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.four },
  historyBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  historyGame: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },
  historyDate: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textSecondary, marginTop: 2 },
  historyAmount: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },
});
