import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/artwork';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, Pill } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { HOW_TO_PLAY } from '@/data/content';

export default function HowToPlayScreen() {
  const [active, setActive] = useState(0);
  const { openAskGenie } = useOverlays();
  const tab = HOW_TO_PLAY[active];

  return (
    <View style={styles.root}>
      <ScreenHeader title="How to Play" subtitle="Pandemic" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}>
        {HOW_TO_PLAY.map((t, i) => (
          <Pill key={t.title} label={t.title} active={i === active} onPress={() => setActive(i)} />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed="pandemic-board" style={styles.hero} />
        <Text style={styles.heading}>{tab.heading}</Text>
        <Text style={styles.body}>{tab.content}</Text>
      </ScrollView>

      {/* Ask Anything, embedded — the spec requires it on every mode screen. */}
      <View style={styles.askBar}>
        <Pressable
          onPress={() => openAskGenie('Pandemic')}
          style={({ pressed }) => [styles.askInput, pressed && { opacity: 0.8 }]}>
          <GenieMark size={16} color={Colors.textSecondary} />
          <Text style={styles.askPlaceholder}>Ask Genie anything...</Text>
        </Pressable>
        <Pressable
          onPress={() => openAskGenie('Pandemic')}
          style={({ pressed }) => [styles.askMic, pressed && { opacity: 0.8 }]}>
          <Ionicons name="mic" size={18} color={Colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  tabs: { gap: Spacing.two, padding: Layout.screenPadding },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.six,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { width: '100%', height: 170 },
  heading: {
    fontFamily: Type.display,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.five,
  },
  body: {
    fontFamily: Type.body,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.text,
    marginTop: Spacing.three,
  },

  askBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Layout.screenPadding,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  askInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 44,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.four,
  },
  askPlaceholder: { fontFamily: Type.body, fontSize: 14, color: Colors.textTertiary },
  askMic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
