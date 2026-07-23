import { Redirect } from 'expo-router';

// Launch straight into the tab shell with Home selected.
export default function Index() {
  return <Redirect href="/home" />;
}
