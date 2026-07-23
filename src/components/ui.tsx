import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { GenieLogo } from '@/components/genie-logo';
import { Colors, Layout, Radius, Shadow, Spacing, Type } from '@/constants/theme';

/* ------------------------------------------------------------------ text -- */

export function Display({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.display, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

/** Letterspaced uppercase section label: "PLAYERS", "YOUR CARDS". */
export function SectionLabel({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionLabel, style]}>{children.toUpperCase()}</Text>;
}

/* --------------------------------------------------------------- surfaces -- */

export function Card({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  return <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>;
}

/** Scrolling page body with the standard 16px gutter and tab-bar clearance. */
export function Screen({
  children,
  style,
  scroll = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
}) {
  if (!scroll) return <View style={[styles.screen, style]}>{children}</View>;
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.screenContent, style]}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

/* ---------------------------------------------------------------- buttons -- */

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

/** Peach-gold fill, wine text. The default call to action. */
export function PrimaryButton({ label, onPress, disabled, style, icon }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles.buttonPrimary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {icon ? <Ionicons name={icon} size={18} color={Colors.onPrimary} style={styles.buttonIcon} /> : null}
      <Text style={[styles.buttonLabel, { color: Colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

/** Wine fill, white text. Purchase now / Declare winner. */
export function SecondaryButton({ label, onPress, disabled, style, icon }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles.buttonSecondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {icon ? <Ionicons name={icon} size={18} color={Colors.onSecondary} style={styles.buttonIcon} /> : null}
      <Text style={[styles.buttonLabel, { color: Colors.onSecondary }]}>{label}</Text>
    </Pressable>
  );
}

/** Wine outline, transparent fill. Continue with preview. */
export function OutlineButton({ label, onPress, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles.buttonOutline, pressed && styles.pressed, style]}>
      <Text style={[styles.buttonLabel, { color: Colors.text }]}>{label}</Text>
    </Pressable>
  );
}

/** Circular icon button used by the guided round and scoring steppers. */
export function CircleButton({
  icon,
  onPress,
  variant = 'outline',
  size = 48,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  variant?: 'outline' | 'primary' | 'secondary' | 'soft';
  size?: number;
  disabled?: boolean;
}) {
  const fill =
    variant === 'primary' ? Colors.primary
    : variant === 'secondary' ? Colors.secondary
    : variant === 'soft' ? Colors.backgroundInset
    : 'transparent';
  const tint =
    variant === 'primary' ? Colors.onPrimary
    : variant === 'secondary' ? Colors.onSecondary
    : Colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: fill,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: Colors.border,
        },
        styles.center,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Ionicons name={icon} size={size * 0.42} color={tint} />
    </Pressable>
  );
}

/* -------------------------------------------------------- pills & toggles -- */

export function Pill({
  label,
  active,
  onPress,
  style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        active ? styles.pillActive : styles.pillInactive,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.pillLabel, active ? styles.pillLabelActive : styles.pillLabelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Toggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: Colors.secondary, false: Colors.border }}
      thumbColor={Colors.surface}
      ios_backgroundColor={Colors.border}
    />
  );
}

/** Row with a title, optional description, and a chevron. */
export function ListRow({
  title,
  description,
  icon,
  ionicon,
  iconTint,
  iconColor,
  onPress,
  right,
  last,
}: {
  title: string;
  description?: string;
  /** Emoji glyph fallback. Prefer `ionicon` — emoji render inconsistently. */
  icon?: string;
  ionicon?: React.ComponentProps<typeof Ionicons>['name'];
  iconTint?: string;
  iconColor?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.listRow, !last && styles.listRowBorder, pressed && styles.pressed]}>
      {ionicon ? (
        <View style={[styles.iconTile, { backgroundColor: iconTint ?? Colors.primarySoft }]}>
          <Ionicons name={ionicon} size={18} color={iconColor ?? Colors.text} />
        </View>
      ) : icon ? (
        <View style={[styles.iconTile, { backgroundColor: iconTint ?? Colors.primarySoft }]}>
          <Text style={styles.iconTileGlyph}>{icon}</Text>
        </View>
      ) : null}

      <View style={styles.listRowText}>
        <Text style={styles.listRowTitle}>{title}</Text>
        {description ? <Text style={styles.listRowDescription}>{description}</Text> : null}
      </View>

      {right ?? <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />}
    </Pressable>
  );
}

/** The bar-graph glyph the reference uses to mean "audio is playing". */
export function Waveform({ color = Colors.primary, height = 16 }: { color?: string; height?: number }) {
  const bars = [0.45, 0.8, 0.35, 1, 0.6, 0.9, 0.4, 0.75, 0.5];
  return (
    <View style={[styles.waveform, { height }]}>
      {bars.map((scale, i) => (
        <View
          key={i}
          style={{
            width: 2.5,
            height: height * scale,
            borderRadius: 2,
            backgroundColor: color,
            marginRight: 2,
          }}
        />
      ))}
    </View>
  );
}

/** The genie brand mark — a real vector logo, not an emoji (see GenieLogo). */
export function GenieMark({ size = 28 }: { size?: number; color?: string }) {
  return <GenieLogo size={size} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  screenContent: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.seven,
    maxWidth: Layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },

  display: {
    fontFamily: Type.display,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  body: { fontFamily: Type.body, fontSize: 15, lineHeight: 22, color: Colors.text },
  muted: { fontFamily: Type.body, fontSize: 13, lineHeight: 19, color: Colors.textSecondary },
  sectionLabel: {
    fontFamily: Type.body,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: Colors.textSecondary,
    marginBottom: Spacing.three,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  cardPadded: { padding: Spacing.four },

  button: {
    height: Layout.buttonHeight,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: { backgroundColor: Colors.primary },
  buttonSecondary: { backgroundColor: Colors.secondary },
  buttonOutline: { borderWidth: 1.5, borderColor: Colors.secondary },
  buttonLabel: { fontFamily: Type.body, fontSize: 15.5, fontWeight: '700' },
  buttonIcon: { marginRight: Spacing.two },

  pill: {
    paddingHorizontal: Spacing.four,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillInactive: { backgroundColor: Colors.surface, borderColor: Colors.border },
  pillLabel: { fontFamily: Type.body, fontSize: 13.5, fontWeight: '600' },
  pillLabelActive: { color: Colors.onPrimary },
  pillLabelInactive: { color: Colors.textSecondary },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  listRowText: { flex: 1 },
  listRowTitle: { fontFamily: Type.body, fontSize: 15, fontWeight: '600', color: Colors.text },
  listRowDescription: {
    fontFamily: Type.body,
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  iconTile: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  iconTileGlyph: { fontSize: 17 },

  waveform: { flexDirection: 'row', alignItems: 'center' },

  center: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.4 },
});
