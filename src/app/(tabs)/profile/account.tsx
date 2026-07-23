import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Card } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { USER, useStore } from '@/state/store';

const MASKED_PASSWORD = '•'.repeat(10);

export default function AccountDetailsScreen() {
  const { showToast } = useStore();

  const fields = [
    { label: 'Full name', value: USER.name },
    { label: 'Email', value: USER.email },
    { label: 'Password', value: MASKED_PASSWORD },
    { label: 'Member since', value: USER.memberSince },
  ];

  // Editing forms arrive in Phase 2; for now the affordance acknowledges the tap.
  const notYet = (what: string) => showToast(`${what} — coming in the next build`);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Account details" subtitle="Manage your profile" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER.avatar}</Text>
          </View>
          <Pressable
            onPress={() => notYet('Change photo')}
            style={({ pressed }) => [styles.changePhoto, pressed && { opacity: 0.8 }]}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </Pressable>
        </View>

        <Card padded={false}>
          {fields.map((field, i) => (
            <View
              key={field.label}
              style={[styles.field, i < fields.length - 1 && styles.fieldBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>{field.label.toUpperCase()}</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
              <Pressable onPress={() => notYet(`Edit ${field.label.toLowerCase()}`)} hitSlop={8}>
                <Text style={styles.edit}>Edit</Text>
              </Pressable>
            </View>
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

  avatarBlock: { alignItems: 'center', paddingVertical: Spacing.five },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Type.body, fontSize: 26, fontWeight: '700', color: Colors.onPrimary },
  changePhoto: {
    marginTop: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  changePhotoText: { fontFamily: Type.body, fontSize: 13.5, fontWeight: '700', color: Colors.text },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  fieldLabel: {
    fontFamily: Type.body,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
  },
  fieldValue: { fontFamily: Type.body, fontSize: 15.5, color: Colors.text, marginTop: 3 },
  edit: { fontFamily: Type.body, fontSize: 14, fontWeight: '700', color: Colors.primary },
});
