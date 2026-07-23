import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OverlayProvider } from '@/components/overlays';
import { Colors } from '@/constants/theme';
import { StoreProvider } from '@/state/store';

/** GENIE is light-only, so the navigation theme is pinned rather than following the OS. */
const GenieTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.text,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={GenieTheme}>
        <StoreProvider>
          <OverlayProvider>
            {/* Light glyphs: the welcome photo and every header bar are dark. */}
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </OverlayProvider>
        </StoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
