import { DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OverlayProvider } from '@/components/overlays';
import { Colors } from '@/constants/theme';
import { StoreProvider } from '@/state/store';

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
            <StatusBar style="light" />
            <Slot />
          </OverlayProvider>
        </StoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}