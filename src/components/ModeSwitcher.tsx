import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useStore } from '@/state/store';

interface ModeSwitcherProps {
  visible: boolean;
  onClose: () => void;
  currentMode: string;
}

export function ModeSwitcher({ visible, onClose, currentMode }: ModeSwitcherProps) {
  const insets = useSafeAreaInsets();
  const { currentGame, isUnlocked } = useStore();
  const owned = isUnlocked(currentGame);

  const modes = [
    { key: 'intro', title: "What's It All About", route: `/games/preview?id=${currentGame}`, free: true },
    { key: 'how-to-play', title: 'How to Play', route: '/playing/how-to-play', free: false },
    { key: 'setup-guide', title: 'Setup Guide', route: '/playing/setup-guide', free: false },
    { key: 'guided-round', title: 'First Round', route: '/playing/guided-round', free: false },
    { key: 'scoring', title: 'Scoring Assist', route: '/playing/scoring', free: false },
  ];

  const handleModePress = (route: string, locked: boolean) => {
    if (locked || !route) return;
    router.push(route as never);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.five }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Switch Mode</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>
          {modes.map((mode) => {
            const isActive = mode.key === currentMode;
            const locked = !mode.free && !owned;
            return (
              <Pressable
                key={mode.key}
                onPress={() => handleModePress(mode.route, locked)}
                disabled={isActive || locked}
                style={({ pressed }) => [
                  styles.modeRow,
                  isActive && styles.modeRowActive,
                  pressed && !isActive && !locked && { opacity: 0.7 },
                ]}>
                <Text
                  style={[
                    styles.modeName,
                    isActive && styles.modeNameActive,
                    locked && styles.modeNameLocked,
                  ]}>
                  {mode.title}
                </Text>
                {isActive ? (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                ) : locked ? (
                  <Ionicons name="lock-closed" size={16} color={Colors.textTertiary} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: Colors.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    ...Shadow.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Type.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  modeRowActive: {
    backgroundColor: Colors.backgroundInset,
  },
  modeName: {
    flex: 1,
    fontFamily: Type.body,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  modeNameActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  modeNameLocked: {
    color: Colors.textTertiary,
  },
});
