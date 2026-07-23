import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, SecondaryButton, SectionLabel } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useStore, type Player } from '@/state/store';

/**
 * Scoring Assist. The winner announcement is the same screen with a banner on
 * top rather than a separate route, which is how the reference behaves — the
 * player rows stay visible and editable underneath.
 */
export default function ScoringScreen() {
  const { players, adjustScore, winnerId, declareWinner, resetScores } = useStore();
  const { openAskGenie } = useOverlays();

  const winner = players.find((p) => p.id === winnerId) ?? null;

  return (
    <View style={styles.root}>
      <ScreenHeader title="Scoring Assist" subtitle="Pandemic" />

      <ScrollView contentContainerStyle={styles.content}>
        {winner ? (
          <View style={styles.winnerCard}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.winnerLabel}>WINNER</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerBlurb}>
              Closest scores were {winner.name} and the runner-up. Genie double-checked the tiebreak
              — remaining cubes settle it.
            </Text>
          </View>
        ) : null}

        <SectionLabel style={{ marginTop: winner ? Spacing.five : 0 }}>Players</SectionLabel>

        {players.map((player) => (
          <PlayerRow
            key={player.id}
            player={player}
            isWinner={player.id === winnerId}
            onAdjust={(delta) => adjustScore(player.id, delta)}
          />
        ))}

        <SecondaryButton
          label={winner ? 'Recalculate winner' : 'Declare winner'}
          onPress={declareWinner}
          style={{ marginTop: Spacing.four }}
        />

        {winner ? (
          <Pressable onPress={resetScores} style={styles.reset}>
            <Text style={styles.resetText}>Start a new game</Text>
          </Pressable>
        ) : null}

        <View style={styles.infoPanel}>
          <GenieMark size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            Disagreement over points? Tap the mic and describe it — Genie cites the exact rule and
            settles it.
          </Text>
        </View>

        <Pressable onPress={() => openAskGenie('Pandemic')} style={styles.askLink}>
          <GenieMark size={16} />
          <Text style={styles.askLinkText}>Ask Genie</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function PlayerRow({
  player,
  isWinner,
  onAdjust,
}: {
  player: Player;
  isWinner: boolean;
  onAdjust: (delta: number) => void;
}) {
  return (
    <View style={[styles.playerRow, isWinner && styles.playerRowWinner]}>
      <View style={[styles.playerColor, { backgroundColor: player.color }]} />
      <Text style={styles.playerName} numberOfLines={2}>
        {player.name}
      </Text>

      <Pressable
        onPress={() => onAdjust(-1)}
        style={({ pressed }) => [styles.stepper, styles.stepperMinus, pressed && { opacity: 0.7 }]}>
        <Text style={styles.stepperMinusText}>–</Text>
      </Pressable>

      <Text style={styles.score}>{player.score}</Text>

      <Pressable
        onPress={() => onAdjust(1)}
        style={({ pressed }) => [styles.stepper, styles.stepperPlus, pressed && { opacity: 0.7 }]}>
        <Text style={styles.stepperPlusText}>+</Text>
      </Pressable>
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

  winnerCard: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.five,
    alignItems: 'center',
    ...Shadow.card,
  },
  trophy: { fontSize: 34 },
  winnerLabel: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.two,
  },
  winnerName: {
    fontFamily: Type.display,
    fontSize: 25,
    fontWeight: '700',
    color: Colors.onSecondary,
    marginTop: Spacing.one,
  },
  winnerBlurb: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    marginTop: Spacing.three,
  },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.three,
    ...Shadow.card,
  },
  playerRowWinner: { borderColor: Colors.primary, borderWidth: 1.5 },
  playerColor: { width: 5, height: 34, borderRadius: 3 },
  playerName: { flex: 1, fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },

  stepper: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  stepperMinus: { backgroundColor: Colors.backgroundInset },
  stepperMinusText: { fontSize: 19, fontWeight: '700', color: Colors.textSecondary, lineHeight: 22 },
  stepperPlus: { backgroundColor: Colors.secondary },
  stepperPlusText: { fontSize: 19, fontWeight: '700', color: Colors.onSecondary, lineHeight: 22 },
  score: {
    minWidth: 34,
    textAlign: 'center',
    fontFamily: Type.body,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
  },

  reset: { alignSelf: 'center', padding: Spacing.three },
  resetText: { fontFamily: Type.body, fontSize: 13.5, fontWeight: '600', color: Colors.textSecondary },

  infoPanel: {
    flexDirection: 'row',
    gap: Spacing.three,
    backgroundColor: Colors.backgroundInset,
    borderRadius: Radius.md,
    padding: Spacing.four,
    marginTop: Spacing.four,
  },
  infoText: {
    flex: 1,
    fontFamily: Type.body,
    fontSize: 12.5,
    lineHeight: 18,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },

  askLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  askLinkText: { fontFamily: Type.body, fontSize: 14, fontWeight: '700', color: Colors.primary },
});
