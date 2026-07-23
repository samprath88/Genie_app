import { Stack } from 'expo-router';

// Screens render their own <ScreenHeader />, so the navigator draws none.
export default function ProfileStack() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
