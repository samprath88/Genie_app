import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Card, ListRow, Toggle } from '@/components/ui';
import { Colors, Layout, Spacing } from '@/constants/theme';
import { useStore, type NotificationSettings } from '@/state/store';

const ROWS: { key: keyof NotificationSettings; title: string; description: string }[] = [
  { key: 'newReleases', title: 'New releases', description: 'When new games arrive' },
  { key: 'gameUpdates', title: 'Game updates', description: 'Rule clarifications & fixes' },
  { key: 'turnReminders', title: 'Turn reminders', description: "A nudge when it's your turn" },
  { key: 'tipsAndTricks', title: 'Tips & tricks', description: 'Strategy notes from Genie' },
  { key: 'promotions', title: 'Promotions', description: 'Offers and bundles' },
];

export default function NotificationsScreen() {
  const { notifications, setNotification } = useStore();

  return (
    <View style={styles.root}>
      <ScreenHeader title="Notifications" subtitle="Choose what we send" />

      <ScrollView contentContainerStyle={styles.content}>
        <Card padded={false}>
          {ROWS.map((row, i) => (
            <ListRow
              key={row.key}
              title={row.title}
              description={row.description}
              last={i === ROWS.length - 1}
              right={
                <Toggle
                  value={notifications[row.key]}
                  onValueChange={(v) => setNotification(row.key, v)}
                />
              }
            />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.seven,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
});
