import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Radius, Spacing, Type } from '@/constants/theme';

/**
 * The deep-burgundy bar used by every sub-screen: circular back button on the
 * left, centred title with an optional subtitle beneath.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  const back = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) return router.back();
    // Cold deep-link with no history — fall back to a sensible root.
    router.replace('/profile');
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <Pressable onPress={back} hitSlop={10} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Ionicons name="chevron-back" size={20} color={Colors.textOnDark} />
      </Pressable>

      <View style={styles.titleWrap} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Balances the back button so the title stays optically centred. */}
      {right ?? <View style={styles.back} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: Type.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  subtitle: {
    fontFamily: Type.body,
    fontSize: 12.5,
    color: Colors.textOnDarkMuted,
    marginTop: 1,
  },
  pressed: { opacity: 0.7 },
});
