import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Layout } from '@/constants/theme';

/**
 * Bottom padding for scrollable content that sits under the persistent tab
 * bar: the bar's actual on-screen height (which itself varies by device via
 * the safe-area inset), plus the same breathing room used at any other
 * screen edge.
 */
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return Layout.tabBarHeight + insets.bottom + Layout.screenPadding;
}
