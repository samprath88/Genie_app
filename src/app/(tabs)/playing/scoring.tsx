import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModeSwitcher } from '@/components/ModeSwitcher';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, SecondaryButton, SectionLabel } from '@/components/ui';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useStore, type Player } from '@/state/store';

interface ScoreField {
  key: string;
  label: string;
  type: 'number' | 'boolean' | 'select';
  value: number | boolean | string;
  min?: number;
  max?: number;
  options?: string[];
  help?: string;
}

interface PlayerScore {
  player_name: string;
  [key: string]: any;
}

export default function ScoringScreen() {
  const { players, resetScores, currentGame } = useStore();
  const { openAskGenie } = useOverlays();

  const [template, setTemplate] = useState<{ playerFields?: ScoreField[]; scoreFields?: ScoreField[] } | null>(null);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [calculatedScores, setCalculatedScores] = useState<{ [playerId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/scoring/template`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setTemplate(data);

        const initialScores = players.map((p) => ({
          player_name: p.name,
          ...Object.fromEntries(data.scoreFields?.map((f: ScoreField) => [f.key, 0]) || []),
        }));
        setPlayerScores(initialScores);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
        console.error('Error fetching template:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [currentGame, players]);

  const handleScoreChange = (playerIndex: number, fieldKey: string, value: any) => {
    const updated = [...playerScores];
    updated[playerIndex][fieldKey] = value;
    setPlayerScores(updated);
  };

  const handleDeclareWinner = async () => {
    try {
      const scores = [];
      for (let i = 0; i < players.length; i++) {
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/scoring/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game: currentGame,
            player_data: playerScores[i],
          }),
        });

        if (!response.ok) {
          throw new Error(`Scoring failed for ${players[i].name}`);
        }

        const data = await response.json();
        scores.push({ playerId: players[i].id, total: data.total });
      }

      const winner = scores.reduce((max, curr) => (curr.total > max.total ? curr : max));
      const scoreMap = Object.fromEntries(scores.map((s) => [s.playerId, s.total]));
      setCalculatedScores(scoreMap);

      console.log('Winner:', winner);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate scores');
      console.error('Error calculating scores:', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !template) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load scoring template</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </View>
    );
  }

  const winnerEntry = Object.entries(calculatedScores).sort((a, b) => b[1] - a[1])[0];
  const winnerIdFromScores = winnerEntry?.[0];
  const winner = winnerIdFromScores ? players.find((p) => p.id === winnerIdFromScores) : null;

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <ScreenHeader 
          title="Scoring Assist" 
          subtitle={currentGame}
          onBack={() => router.push('/playing')}
        />
        <Pressable 
          onPress={() => setShowModeSwitcher(true)}
          hitSlop={8}
          style={({ pressed }) => [styles.modeButton, pressed && { opacity: 0.7 }]}>
          <Ionicons name="swap-vertical" size={20} color={Colors.textOnDark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {winner ? (
          <View style={styles.winnerCard}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={styles.winnerLabel}>WINNER</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>{calculatedScores[winner.id]} points</Text>
          </View>
        ) : null}

        <SectionLabel style={{ marginTop: winner ? Spacing.five : 0 }}>Players</SectionLabel>

        {players.map((player, idx) => (
          <View
            key={player.id}
            style={[styles.playerCard, winner?.id === player.id ? styles.playerCardWinner : undefined]}>
            <View style={[styles.playerColor, { backgroundColor: player.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.playerName}>{player.name}</Text>

              {template.scoreFields?.map((field) => (
                <View key={field.key} style={styles.scoreField}>
                  <Text style={styles.scoreLabel}>{field.label}</Text>
                  {field.type === 'number' ? (
                    <View style={styles.numberInput}>
                      <Pressable
                        onPress={() =>
                          handleScoreChange(
                            idx,
                            field.key,
                            Math.max(field.min ?? 0, (playerScores[idx][field.key] as number) - 1)
                          )
                        }
                        style={styles.inputButton}>
                        <Text style={styles.inputButtonText}>−</Text>
                      </Pressable>
                      <Text style={styles.inputValue}>{playerScores[idx][field.key]}</Text>
                      <Pressable
                        onPress={() =>
                          handleScoreChange(
                            idx,
                            field.key,
                            Math.min(field.max ?? 999, (playerScores[idx][field.key] as number) + 1)
                          )
                        }
                        style={styles.inputButton}>
                        <Text style={styles.inputButtonText}>+</Text>
                      </Pressable>
                    </View>
                  ) : field.type === 'boolean' ? (
                    <Pressable
                      onPress={() => handleScoreChange(idx, field.key, !playerScores[idx][field.key])}
                      style={[
                        styles.toggle,
                        playerScores[idx][field.key] ? styles.toggleActive : undefined,
                      ]}>
                      <Text style={styles.toggleText}>{playerScores[idx][field.key] ? '✓' : ' '}</Text>
                    </Pressable>
                  ) : null}
                  {field.help && <Text style={styles.fieldHelp}>{field.help}</Text>}
                </View>
              ))}
            </View>

            {Object.keys(calculatedScores).length > 0 && (
              <View style={styles.totalScore}>
                <Text style={styles.totalScoreValue}>{calculatedScores[player.id] ?? 0}</Text>
              </View>
            )}
          </View>
        ))}

        <SecondaryButton
          label={winner ? 'Recalculate' : 'Calculate scores'}
          onPress={handleDeclareWinner}
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
            Disagreement over points? Tap the mic and describe it — Genie cites the exact rule and settles it.
          </Text>
        </View>

        <Pressable onPress={() => openAskGenie(currentGame)} style={styles.askLink}>
          <GenieMark size={16} />
          <Text style={styles.askLinkText}>Ask Genie</Text>
        </Pressable>
      </ScrollView>

      <ModeSwitcher 
        visible={showModeSwitcher} 
        onClose={() => setShowModeSwitcher(false)}
        currentMode="scoring"
      />
    </View>
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
  },

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
  winnerScore: {
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSecondary,
    marginTop: Spacing.two,
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.three,
    ...Shadow.card,
  },
  playerCardWinner: { borderColor: Colors.primary, borderWidth: 1.5 },
  playerColor: { width: 5, height: 80, borderRadius: 3 },
  playerName: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: Spacing.two },

  scoreField: { marginBottom: Spacing.two },
  scoreLabel: { fontFamily: Type.body, fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  numberInput: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputButtonText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  inputValue: { minWidth: 24, textAlign: 'center', fontFamily: Type.body, fontSize: 14, fontWeight: '700', color: Colors.text },

  toggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundInset,
  },
  toggleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleText: { fontSize: 16, fontWeight: '700', color: Colors.text },

  fieldHelp: { fontFamily: Type.body, fontSize: 11, color: Colors.textTertiary, marginTop: 2 },

  totalScore: { alignItems: 'flex-end' },
  totalScoreValue: { fontFamily: Type.display, fontSize: 20, fontWeight: '700', color: Colors.primary },

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