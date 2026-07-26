import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { FEATURES, type Feature } from '@/data/content';
import { useStore } from '@/state/store';

interface ModeSwitcherProps {
  visible: boolean;
  onClose: () => void;
  currentMode: string; // e.g., 'how-to-play', 'scoring', 'setup-guide', 'guided-round', 'about'
}

export function ModeSwitcher({ visible, onClose, currentMode }: ModeSwitcherProps) {
  const { currentGame, isUnlocked } = useStore();
  const owned = isUnlocked(currentGame);

  const handleModePress = (feature: Feature) => {
    if (feature.key === currentMode) {
      // Already on this mode, just close
      onClose();
      return;
    }

    const locked = !feature.free && !owned;
    if (locked) return; // Can't switch to locked mode

    // Navigate to the feature
    if (feature.route) {
      router.push(feature.route as never);
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

          {FEATURES.map((feature) => {
            const isActive = feature.key === currentMode;
            const locked = !feature.free && !owned;

            return (
              <Pressable
                key={feature.key}
                onPress={() => handleModePress(feature)}
                disabled={locked || isActive}
                style={({ pressed }) => [
                  styles.modeRow,
                  isActive && styles.modeRowActive,
                  locked && styles.modeRowLocked,
                  pressed && !locked && !isActive && { opacity: 0.7 },
                ]}>
                {/* Icon */}
                <View style={[styles.modeIcon, { backgroundColor: feature.accent }]} />

                {/* Text */}
                <Text style={[styles.modeName, isActive && styles.modeNameActive, locked && styles.modeNameLocked]}>
                  {feature.title}
                </Text>

                {/* Right indicator */}
                <View style={styles.modeRight}>
                  {isActive && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
                  {locked && <Ionicons name="lock-closed" size={16} color={Colors.textTertiary} />}
                  {!isActive && !locked && <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />}
                </View>
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
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  modeRowActive: {
    backgroundColor: Colors.backgroundInset,
  },
  modeRowLocked: {
    opacity: 0.5,
  },

  modeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
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

  modeRight: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});