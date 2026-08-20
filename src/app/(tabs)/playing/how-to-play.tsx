import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/artwork';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { useOverlays } from '@/components/overlays';
import { ScreenHeader } from '@/components/screen-header';
import { GenieMark, Pill } from '@/components/ui';
import { Colors, Layout, Spacing } from '@/constants/theme';
import { useStore } from '@/state/store';

const GAME_NAMES: Record<string, string> = {
  pandemic: 'Pandemic',
  catan: 'Catan',
  ticket_to_ride: 'Ticket to Ride',
};

// Type definition for a section/tab
interface Section {
  id: string;
  title: string;
  content: string;
}

export default function HowToPlayScreen() {
  const { currentGame } = useStore();
  const [active, setActive] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const { openAskGenie } = useOverlays();

  // Fetch how-to-play content from backend
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${currentGame}/how-to-play`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend sections to match our Section type
        const transformedSections: Section[] = data.sections.map((s: any) => ({
          id: s.id,
          title: s.title,
          content: s.content,
        }));
        
        setSections(transformedSections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        console.error('Error fetching how-to-play:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentGame]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || sections.length === 0) {
    return (
      <View style={[styles.root, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load how-to-play content</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </View>
    );
  }

  const section = sections[active];
  const gameName = GAME_NAMES[currentGame] || currentGame;

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <ScreenHeader 
          title="How to Play" 
          subtitle={gameName}
          onBack={() => router.push('/playing')}
        />
        <Pressable 
          onPress={() => setShowModeSwitcher(true)}
          hitSlop={8}
          style={({ pressed }) => [styles.modeButton, pressed && { opacity: 0.7 }]}>
          <Ionicons name="swap-vertical" size={20} color={Colors.textOnDark} />
        </Pressable>
      </View>

      {/* Horizontal tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {sections.map((s, i) => (
          <Pill key={s.id} label={s.title} active={i === active} onPress={() => setActive(i)} />
        ))}
      </ScrollView>

      {/* Content area */}
      <ScrollView contentContainerStyle={styles.content}>
        <Artwork seed={`${currentGame}-how-to-play-${active}`} style={styles.hero} />

        <Text style={styles.sectionTitle}>{section.title}</Text>

        <Text style={styles.body}>{section.content}</Text>

        <Pressable
          onPress={() => openAskGenie(currentGame)}
          style={({ pressed }) => [styles.genieButton, pressed && { opacity: 0.7 }]}>
          <GenieMark size={20} color={Colors.onPrimary} />
          <Text style={styles.genieButtonText}>Ask about this</Text>
        </Pressable>
      </ScrollView>

      <ModeSwitcher 
        visible={showModeSwitcher} 
        onClose={() => setShowModeSwitcher(false)}
        currentMode="how-to-play"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Spacing.three,
    backgroundColor: Colors.secondary,
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  tabs: { gap: Spacing.two, paddingHorizontal: Layout.screenPadding, paddingVertical: Spacing.three },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.seven,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { width: '100%', height: 190, borderRadius: 8, marginBottom: Spacing.four },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.three,
  },
  body: {
    fontFamily: 'System',
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: Spacing.five,
  },
  genieButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  genieButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.two,
  },
  errorDetail: {
    fontFamily: 'System',
    fontSize: 14,
    color: Colors.textSecondary,
  },
});