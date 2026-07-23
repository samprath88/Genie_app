import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';

/**
 * The three top-level destinations. Each tab owns a nested Stack, so detail
 * screens push *inside* the tab and the bar stays visible — which is what the
 * reference shows on every sub-screen.
 *
 * The active tab is a filled pill behind the icon, matching the prototype.
 */
function TabIcon({
  name,
  focused,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  // The navigator hands back ColorValue; Ionicons only accepts a plain string.
  color: ColorValue;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={20} color={color as string} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Layout.tabBarHeight,
          paddingTop: Spacing.one,
        },
        tabBarLabelStyle: {
          fontFamily: Type.body,
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: (props) => <TabIcon name="home-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: (props) => <TabIcon name="grid" {...props} />,
        }}
      />
      <Tabs.Screen
        name="playing"
        options={{
          title: 'Playing',
          tabBarIcon: (props) => <TabIcon name="play-circle-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => <TabIcon name="person-outline" {...props} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  iconWrapActive: { backgroundColor: Colors.primarySoft },
});
