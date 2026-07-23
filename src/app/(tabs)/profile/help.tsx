import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { Card, GenieMark, ListRow, SectionLabel } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { FAQ, SUPPORT_OPTIONS } from '@/data/content';
import { useStore } from '@/state/store';

export default function HelpScreen() {
  const { openAskGenie } = useOverlays();
  const { showToast } = useStore();
  const [expanded, setExpanded] = useState<number | null>(0);

  const onOption = (title: string) => {
    if (title === 'Chat with Genie') return openAskGenie('GENIE');
    showToast(`${title} — coming in the next build`);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Help & support" subtitle="We're here for you" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => openAskGenie('GENIE')}
          style={({ pressed }) => [styles.askInput, pressed && { opacity: 0.8 }]}>
          <GenieMark size={17} color={Colors.textSecondary} />
          <Text style={styles.askPlaceholder}>Ask Genie for help...</Text>
        </Pressable>

        <Card padded={false} style={{ marginTop: Spacing.four }}>
          {SUPPORT_OPTIONS.map((option, i) => (
            <ListRow
              key={option.title}
              title={option.title}
              description={option.description}
              ionicon={option.icon as React.ComponentProps<typeof Ionicons>['name']}
              iconTint={option.tint}
              iconColor={option.iconColor}
              onPress={() => onOption(option.title)}
              last={i === SUPPORT_OPTIONS.length - 1}
            />
          ))}
        </Card>

        <SectionLabel style={{ marginTop: Spacing.five }}>Popular questions</SectionLabel>
        <Card padded={false}>
          {FAQ.map((item, i) => {
            const open = expanded === i;
            return (
              <Pressable
                key={item.question}
                onPress={() => setExpanded(open ? null : i)}
                style={[styles.faqRow, i < FAQ.length - 1 && styles.faqBorder]}>
                <View style={styles.faqHead}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={Colors.textTertiary}
                  />
                </View>
                {open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
              </Pressable>
            );
          })}
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

  askInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.four,
  },
  askPlaceholder: { fontFamily: Type.body, fontSize: 14, color: Colors.textTertiary },

  faqRow: { padding: Spacing.four },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  faqQuestion: { flex: 1, fontFamily: Type.body, fontSize: 14.5, fontWeight: '700', color: Colors.text },
  faqAnswer: {
    fontFamily: Type.body,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginTop: Spacing.two,
  },
});
