import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { NARRATOR_VOICES, type NarratorVoice } from '@/data/content';
import { getGame, type Tier } from '@/data/games';
import { PlayerColors } from '@/constants/theme';

/**
 * Client-side app state. Everything here is mock and lives in AsyncStorage —
 * Phase 2 replaces the writes with API calls and keeps the same shape.
 *
 * Storage keys are namespaced so a stray key elsewhere cannot collide.
 */
const KEYS = {
  purchasedGames: 'genie:purchased_games',
  narratorVoice: 'genie:narrator_voice',
  autoplay: 'genie:autoplay_narration',
  notifications: 'genie:notification_settings',
  scores: 'genie:game_scores',
  basket: 'genie:basket',
  seenWelcome: 'genie:seen_welcome',
  currentGame: 'genie:current_game',
} as const;

export type NotificationSettings = {
  newReleases: boolean;
  gameUpdates: boolean;
  turnReminders: boolean;
  tipsAndTricks: boolean;
  promotions: boolean;
};

export type Player = { id: number; name: string; color: string; score: number };

/** A chosen package sitting in the basket. One per game. */
export type BasketItem = { gameId: string; tier: Tier; pricePence: number; unlocks: boolean };

export type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
};

export const USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@email.com',
  avatar: 'AR',
  memberSince: 'March 2024',
};

export const PAYMENT_METHODS = {
  cards: [
    { id: 1, type: 'Visa', last4: '4242', expires: '08/27', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8813', expires: '11/26', isDefault: false },
  ],
  billingHistory: [
    { game: 'Catan', date: '14 May 2026', amountPence: 899 },
    { game: 'Wingspan', date: '2 Mar 2026', amountPence: 899 },
  ],
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  newReleases: true,
  gameUpdates: true,
  turnReminders: true,
  tipsAndTricks: false,
  promotions: false,
};

const DEFAULT_PLAYERS: Player[] = [
  { id: 1, name: 'Player 1', color: PlayerColors[0], score: 0 },
  { id: 2, name: 'Player 2', color: PlayerColors[1], score: 0 },
  { id: 3, name: 'Player 3', color: PlayerColors[2], score: 0 },
];

type Store = {
  hydrated: boolean;

  purchasedGames: string[];
  isUnlocked: (gameId: string) => boolean;
  purchase: (gameId: string) => void;

  /** Basket is placeholder commerce — checkout reuses `purchase` to unlock. */
  basket: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (gameId: string) => void;
  basketTotalPence: number;
  checkout: () => void;

  narratorVoice: NarratorVoice;
  setNarratorVoice: (v: NarratorVoice) => void;
  autoplay: boolean;
  setAutoplay: (v: boolean) => void;

  notifications: NotificationSettings;
  setNotification: (key: keyof NotificationSettings, value: boolean) => void;

  /** Current game being played/viewed. Used across screens (How-to-Play, Scoring, etc.) */
  currentGame: string;
  setCurrentGame: (gameId: string) => void;

  players: Player[];
  adjustScore: (playerId: number, delta: number) => void;
  winnerId: number | null;
  declareWinner: () => void;
  resetScores: () => void;

  /** Toast text, or null. Set by `purchase`, cleared by the toast host. */
  toast: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
};

const StoreContext = createContext<Store | null>(null);

/** Reads a JSON value, falling back if absent or corrupt. */
async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

const write = (key: string, value: unknown) =>
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [purchasedGames, setPurchasedGames] = useState<string[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [narratorVoice, setVoiceState] = useState<NarratorVoice>('Kore');
  const [autoplay, setAutoplayState] = useState(true);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [currentGame, setCurrentGameState] = useState('pandemic');
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Hydrate once on mount. Until this lands, screens render defaults.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [games, cart, voice, auto, notifs, game, scores] = await Promise.all([
        // Catan and Wingspan are pre-owned so the shelf shows both states.
        read<string[]>(KEYS.purchasedGames, ['catan', 'wingspan']),
        read<BasketItem[]>(KEYS.basket, []),
        read<NarratorVoice>(KEYS.narratorVoice, 'Kore'),
        read<boolean>(KEYS.autoplay, true),
        read<NotificationSettings>(KEYS.notifications, DEFAULT_NOTIFICATIONS),
        read<string>(KEYS.currentGame, 'pandemic'),
        read<{ players: Player[]; winnerId: number | null }>(KEYS.scores, {
          players: DEFAULT_PLAYERS,
          winnerId: null,
        }),
      ]);
      if (cancelled) return;
      setPurchasedGames(games);
      setBasket(Array.isArray(cart) ? cart : []);
      setVoiceState(NARRATOR_VOICES.includes(voice) ? voice : 'Kore');
      setAutoplayState(auto);
      setNotifications({ ...DEFAULT_NOTIFICATIONS, ...notifs });
      setCurrentGameState(game);
      setPlayers(scores.players?.length ? scores.players : DEFAULT_PLAYERS);
      setWinnerId(scores.winnerId ?? null);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const purchase = useCallback((gameId: string) => {
    setPurchasedGames((prev) => {
      if (prev.includes(gameId)) return prev;
      const next = [...prev, gameId];
      write(KEYS.purchasedGames, next);
      return next;
    });
    setToast('✓ Purchased! Enjoy unlimited access.');
  }, []);

  const addToBasket = useCallback((item: BasketItem) => {
    setBasket((prev) => {
      // One package per game — a re-add swaps the tier.
      const next = [...prev.filter((i) => i.gameId !== item.gameId), item];
      write(KEYS.basket, next);
      return next;
    });
    setToast('✓ Added to basket');
  }, []);

  const removeFromBasket = useCallback((gameId: string) => {
    setBasket((prev) => {
      const next = prev.filter((i) => i.gameId !== gameId);
      write(KEYS.basket, next);
      return next;
    });
  }, []);

  const checkout = useCallback(() => {
    setBasket((prev) => {
      // Tiers that include instructions unlock the digital modes.
      const toUnlock = prev.filter((i) => i.unlocks).map((i) => i.gameId);
      if (toUnlock.length) {
        setPurchasedGames((owned) => {
          const next = Array.from(new Set([...owned, ...toUnlock]));
          write(KEYS.purchasedGames, next);
          return next;
        });
      }
      write(KEYS.basket, []);
      return [];
    });
    setToast('✓ Order placed — enjoy!');
  }, []);

  const setNarratorVoice = useCallback((v: NarratorVoice) => {
    setVoiceState(v);
    write(KEYS.narratorVoice, v);
  }, []);

  const setAutoplay = useCallback((v: boolean) => {
    setAutoplayState(v);
    write(KEYS.autoplay, v);
  }, []);

  const setNotification = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: value };
      write(KEYS.notifications, next);
      return next;
    });
  }, []);

  const setCurrentGame = useCallback((gameId: string) => {
    setCurrentGameState(gameId);
    write(KEYS.currentGame, gameId);
  }, []);

  const persistScores = useCallback((nextPlayers: Player[], nextWinner: number | null) => {
    write(KEYS.scores, { players: nextPlayers, winnerId: nextWinner });
  }, []);

  const adjustScore = useCallback(
    (playerId: number, delta: number) => {
      setPlayers((prev) => {
        const next = prev.map((p) =>
          // Scores floor at zero — the reference has no negative state.
          p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p,
        );
        persistScores(next, null);
        return next;
      });
      setWinnerId(null);
    },
    [persistScores],
  );

  const declareWinner = useCallback(() => {
    setPlayers((prev) => {
      const top = prev.reduce((best, p) => (p.score > best.score ? p : best), prev[0]);
      setWinnerId(top.id);
      persistScores(prev, top.id);
      return prev;
    });
  }, [persistScores]);

  const resetScores = useCallback(() => {
    setPlayers(DEFAULT_PLAYERS);
    setWinnerId(null);
    persistScores(DEFAULT_PLAYERS, null);
  }, [persistScores]);

  const value = useMemo<Store>(
    () => ({
      hydrated,
      purchasedGames,
      isUnlocked: (gameId: string) => purchasedGames.includes(gameId),
      purchase,
      basket,
      addToBasket,
      removeFromBasket,
      basketTotalPence: basket.reduce((sum, i) => sum + i.pricePence, 0),
      checkout,
      narratorVoice,
      setNarratorVoice,
      autoplay,
      setAutoplay,
      notifications,
      setNotification,
      currentGame,
      setCurrentGame,
      players,
      adjustScore,
      winnerId,
      declareWinner,
      resetScores,
      toast,
      showToast: setToast,
      clearToast: () => setToast(null),
    }),
    [
      hydrated, purchasedGames, purchase, basket, addToBasket, removeFromBasket, checkout,
      narratorVoice, setNarratorVoice, autoplay, setAutoplay, notifications, setNotification,
      currentGame, setCurrentGame, players, adjustScore, winnerId, declareWinner, resetScores, toast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}