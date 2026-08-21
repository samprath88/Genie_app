import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Shadow, Spacing, Type } from '@/constants/theme';

interface ModeSwitcherProps {
  visible: boolean;
  onClose: () => void;
  currentMode: string;
}

export function ModeSwitcher({ visible, onClose, currentMode }: ModeSwitcherProps) {
  const modes = [
    { key: 'how-to-play', title: 'How to Play', route: '/playing/how-to-play' },
    { key: 'setup-guide', title: 'Setup Guide', route: '/playing/setup-guide' },
    { key: 'guided-round', title: 'First Round', route: '/playing/guided-round' },
    { key: 'scoring', title: 'Scoring Assist', route: '/playing/scoring' },
  ];

  const handleModePress = (route: string) => {
    if (route) {
      router.push(route as never);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Switch Mode</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>
          {modes.map((mode) => {
            const isActive = mode.key === currentMode;
            return (
              <Pressable
                key={mode.key}
                onPress={() => handleModePress(mode.route)}
                disabled={isActive}
                style={({ pressed }) => [
                  styles.modeRow,
                  isActive && styles.modeRowActive,
                  pressed && !isActive && { opacity: 0.7 },
                ]}>
                <Text style={[styles.modeName, isActive && styles.modeNameActive]}>
                  {mode.title}
                </Text>
                {isActive && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
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
    paddingBottom: 20,
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
});