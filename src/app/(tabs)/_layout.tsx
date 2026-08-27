import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabButton({
  icon,
  label,
  accessibilityState,
  onPress,
  style,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
} & any) {
  const focused = accessibilityState?.selected ?? false;

  return (
    <Pressable onPress={onPress} style={[style, styles.button]}>
      <View style={[styles.item, focused && styles.itemActive]}>
        <Ionicons name={icon} size={20} color={focused ? Colors.text : Colors.textSecondary} />
        <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Layout.tabBarHeight + insets.bottom,
          paddingTop: Spacing.one,
          paddingBottom: insets.bottom,
        },
      }}>
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarButton: (props) => <TabButton {...props} icon="cube-outline" label="Games" />,
        }}
      />
      <Tabs.Screen
        name="playing"
        options={{
          title: 'Playing',
          tabBarButton: (props) => (
            <TabButton {...props} icon="play-circle-outline" label="Playing" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: (props) => (
            <TabButton {...props} icon="person-circle-outline" label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  button: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
  },
  itemActive: { backgroundColor: Colors.primarySoft },
  label: {
    fontFamily: Type.body,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  labelActive: { fontWeight: '700', color: Colors.text },
});
