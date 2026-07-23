/**
 * GENIE design system — values sampled from the reference prototype screens.
 *
 * `Palette` is the raw extracted set. `Colors` maps it to semantic roles, and
 * screens should only ever reference `Colors`. If the real design files land
 * later and a tone is off, correct it here once and every screen follows.
 *
 * The app is light-only (warm cream), with dark burgundy header bars.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  /** Warm pinkish cream — the app background on every screen. */
  cream: '#F5EDE7',
  /** A half-step deeper than cream, for inset info panels. */
  creamDeep: '#EFE4DC',
  /** Card surfaces: near-white but still warm. */
  card: '#FDFAF7',

  /** The signature deep wine. Header bars, primary text, primary-dark CTA. */
  wine: '#6B1B1E',
  /** Bottom of the header gradient, and pressed states on wine. */
  wineDeep: '#4E1215',

  /** Peach-gold. The main CTA fill and the active-tab accent. */
  camel: '#D9A86B',
  /** Lighter camel for active pills and icon tiles. */
  camelSoft: '#EBD9C2',

  /** Muted sage, used for tags and one of the support icon tiles. */
  sage: '#A8C4A2',

  /** Secondary copy — muted gray-brown. */
  taupe: '#8A7A72',
  /** Tertiary / inactive. */
  taupeLight: '#B9A79E',

  /** Hairlines and card edges. */
  border: '#E5D8CF',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Colors = {
  background: Palette.cream,
  backgroundInset: Palette.creamDeep,
  surface: Palette.card,

  /** Body and heading text on light surfaces. */
  text: Palette.wine,
  textSecondary: Palette.taupe,
  textTertiary: Palette.taupeLight,
  /** Text sitting on wine or on a photo. */
  textOnDark: Palette.white,
  textOnDarkMuted: 'rgba(255,255,255,0.78)',

  /** Dark burgundy header bar. */
  header: Palette.wine,
  headerDeep: Palette.wineDeep,

  /** Peach-gold primary CTA; text on it is wine, not white. */
  primary: Palette.camel,
  onPrimary: Palette.wine,
  primarySoft: Palette.camelSoft,

  /** Wine CTA (Purchase now, Declare winner); text on it is white. */
  secondary: Palette.wine,
  onSecondary: Palette.white,

  accentSage: Palette.sage,
  border: Palette.border,

  /** Scrim behind modals. */
  scrim: 'rgba(35,16,14,0.55)',
  /** Translucent overlay panels that sit on photography. */
  overlay: 'rgba(46,24,22,0.55)',
} as const;

/** Per-player identity colors used by Scoring Assist. */
export const PlayerColors = ['#2F6DB5', '#E0A33E', '#4E7B4E', '#7B4E7B'] as const;

/** Card brand fills on the Payment methods screen. */
export const CardBrandColors: Record<string, string> = {
  Visa: '#2C5F94',
  Mastercard: Palette.wine,
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
})!;

/** Display headings in the reference are a serif; body copy is not. */
export const Type = {
  display: Fonts.serif,
  body: Fonts.sans,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Subtle, used sparingly — cards and modals only. */
export const Shadow = {
  card: {
    shadowColor: Palette.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  modal: {
    shadowColor: Palette.black,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
} as const;

export const Layout = {
  screenPadding: Spacing.four,
  buttonHeight: 48,
  tabBarHeight: 58,
  maxContentWidth: 720,
} as const;
