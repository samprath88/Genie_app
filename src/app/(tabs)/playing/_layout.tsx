import { Stack } from 'expo-router';

// Screens render their own <ScreenHeader />, so the navigator draws none.
export default function PlayingStack() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
