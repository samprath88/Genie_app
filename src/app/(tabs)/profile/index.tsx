import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Artwork } from '@/components/artwork';
import { Card, ListRow, Pill, SectionLabel, Toggle } from '@/components/ui';
import { Colors, Layout, Radius, Spacing, Type } from '@/constants/theme';
import { GAME_INTERESTS, NARRATOR_VOICES } from '@/data/content';
import { GAMES, priceLabel } from '@/data/games';
import { useTabBarClearance } from '@/hooks/useTabBarClearance';
import { USER, useStore } from '@/state/store';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarClearance = useTabBarClearance();
  const {
    purchasedGames, resetPurchases, narratorVoice, setNarratorVoice, autoplay, setAutoplay,
    interests, toggleInterest, showToast,
  } = useStore();

  const owned = GAMES.filter((g) => purchasedGames.includes(g.id));

  // Placeholder — no auth yet, so this just returns to Home with a toast and
  // leaves the mock data intact. Phase 2 clears the session here.
  const signOut = () => {
    showToast('Signed out');
    router.replace('/home');
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
      <Artwork seed="profile-table" radius={0} style={[styles.banner, { paddingTop: insets.top }]}>
        <View style={styles.bannerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER.avatar}</Text>
          </View>
          <Text style={styles.name}>{USER.name}</Text>
          <Text style={styles.meta}>
            Member since {USER.memberSince.split(' ')[1]} · {purchasedGames.length} games owned
          </Text>
        </View>
      </Artwork>

      <View style={styles.body}>
        <SectionLabel>Voice &amp; narration</SectionLabel>
        <Card>
          <View style={styles.fieldHead}>
            <Ionicons name="musical-notes" size={16} color={Colors.text} />
            <Text style={styles.fieldLabel}>Narrator voice</Text>
          </View>
          <View style={styles.voices}>
            {NARRATOR_VOICES.map((voice) => (
              <Pill
                key={voice}
                label={voice}
                active={narratorVoice === voice}
                onPress={() => setNarratorVoice(voice)}
                style={{ flex: 1 }}
              />
            ))}
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.fieldHead}>
              <Ionicons name="play-circle" size={16} color={Colors.text} />
              <Text style={styles.fieldLabel}>Autoplay narration</Text>
            </View>
            <Toggle value={autoplay} onValueChange={setAutoplay} />
          </View>
        </Card>

        <SectionLabel style={styles.sectionSpacer}>Account</SectionLabel>
        <Card padded={false}>
          <ListRow
            title="Account details"
            ionicon="person"
            iconTint="#E7DFF2"
            iconColor="#7A5EA8"
            onPress={() => router.push('/profile/account')}
          />
          <ListRow
            title="Payment methods"
            ionicon="card"
            iconTint="#CBDCEF"
            iconColor="#2F6DB5"
            onPress={() => router.push('/profile/payment')}
          />
          <ListRow
            title="Notifications"
            ionicon="notifications"
            iconTint="#F2DFC4"
            iconColor="#C79A3E"
            onPress={() => router.push('/profile/notifications')}
          />
          <ListRow
            title="Help & support"
            ionicon="help-circle"
            iconTint="#CFE3CB"
            iconColor="#4E7B4E"
            onPress={() => router.push('/profile/help')}
            last
          />
        </Card>

        <SectionLabel style={styles.sectionSpacer}>Your games</SectionLabel>
        {owned.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              Nothing unlocked yet. Anything you buy shows up here.
            </Text>
          </Card>
        ) : (
          <Card padded={false}>
            {owned.map((game, i) => (
              <Pressable
                key={game.id}
                onPress={() => router.push(`/games/${game.id}`)}
                style={({ pressed }) => [
                  styles.gameRow,
                  i < owned.length - 1 && styles.gameRowBorder,
                  pressed && { opacity: 0.8 },
                ]}>
                <Artwork seed={game.id} style={styles.gameThumb} radius={Radius.sm} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameMeta}>{game.categories.join(' · ')}</Text>
                </View>
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>UNLOCKED</Text>
                </View>
              </Pressable>
            ))}
          </Card>
        )}

        <SectionLabel style={styles.sectionSpacer}>Game interests</SectionLabel>
        <Card>
          <Text style={styles.interestsHint}>
            Tell Genie what you like — this shapes which games get recommended to you.
          </Text>
          <View style={styles.interests}>
            {GAME_INTERESTS.map((tag) => (
              <Pill
                key={tag}
                label={tag}
                active={interests.includes(tag)}
                onPress={() => toggleInterest(tag)}
              />
            ))}
          </View>
        </Card>

        <SectionLabel style={styles.sectionSpacer}>Testing</SectionLabel>
        <Card padded={false}>
          <ListRow
            title="Reset purchases"
            description="Locks every game again, for testing the unlock flow"
            ionicon="refresh"
            iconTint="#F2DFC4"
            iconColor="#C79A3E"
            onPress={resetPurchases}
            last
          />
        </Card>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.7 }]}>
          <Ionicons name="log-out-outline" size={18} color={Colors.secondary} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { maxWidth: Layout.maxContentWidth, width: '100%', alignSelf: 'center' },

  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.five,
    height: Layout.buttonHeight,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  signOutText: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.secondary },

  banner: { minHeight: 190, justifyContent: 'flex-end', padding: Layout.screenPadding },
  bannerCard: {
    backgroundColor: Colors.overlay,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Type.body, fontSize: 21, fontWeight: '700', color: Colors.onPrimary },
  name: {
    fontFamily: Type.body,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginTop: Spacing.three,
  },
  meta: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textOnDarkMuted, marginTop: 2 },

  body: { padding: Layout.screenPadding },
  sectionSpacer: { marginTop: Spacing.five },

  fieldHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  fieldLabel: { fontFamily: Type.body, fontSize: 14.5, fontWeight: '600', color: Colors.text },
  voices: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  emptyText: { fontFamily: Type.body, fontSize: 13.5, color: Colors.textSecondary },

  interestsHint: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textSecondary, marginBottom: Spacing.three },
  interests: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },

  gameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  gameRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  gameThumb: { width: 40, height: 50 },
  gameName: { fontFamily: Type.body, fontSize: 15, fontWeight: '700', color: Colors.text },
  gameMeta: { fontFamily: Type.body, fontSize: 12.5, color: Colors.textSecondary, marginTop: 1 },
  unlockedBadge: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  unlockedText: {
    fontFamily: Type.body,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.text,
  },
});
