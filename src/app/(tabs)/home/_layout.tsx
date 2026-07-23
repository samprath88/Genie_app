import { Stack } from 'expo-router';

// Nested stack so future Home views can push on top of the welcome screen.
export default function HomeStack() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
