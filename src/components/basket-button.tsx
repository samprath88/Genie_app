import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Type } from '@/constants/theme';
import { useStore } from '@/state/store';

/**
 * Top-right basket control with a live item-count badge. Sits on dark headers
 * and photo overlays, so it defaults to the translucent-light treatment.
 */
export function BasketButton({ onDark = true }: { onDark?: boolean }) {
  const { basket } = useStore();
  const count = basket.length;

  return (
    <Pressable
      onPress={() => router.push('/games/basket')}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: onDark ? 'rgba(255,255,255,0.16)' : Colors.surface },
        pressed && { opacity: 0.7 },
      ]}>
      <Ionicons name="bag-handle-outline" size={18} color={onDark ? Colors.textOnDark : Colors.text} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: Type.body, fontSize: 10, fontWeight: '800', color: Colors.onPrimary },
});
