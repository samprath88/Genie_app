import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

import { Palette } from '@/constants/theme';

/**
 * Vector stand-in for the GENIE brand mark — a genie lamp with a rising flame,
 * washed in the wine→gold brand gradient. Crisp at any size and, unlike an
 * emoji, renders identically on every platform.
 *
 * REPLACE IN PHASE 2: drop the real logo into assets/images/genie-logo.png and
 * swap this body for <Image source={...} />. `size` and callers stay the same.
 */
export function GenieLogo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="genieGrad" x1="0.1" y1="0.1" x2="0.9" y2="0.95">
          <Stop offset="0" stopColor={Palette.wine} />
          <Stop offset="0.55" stopColor={Palette.wineDeep} />
          <Stop offset="1" stopColor={Palette.camel} />
        </LinearGradient>
      </Defs>

      {/* Foot and base */}
      <Ellipse cx="60" cy="103" rx="30" ry="6" fill="url(#genieGrad)" />
      <Path d="M40 96 Q60 103 80 96 L74 90 Q60 95 46 90 Z" fill="url(#genieGrad)" />

      {/* Lamp body */}
      <Path
        d="M26 80 Q23 60 46 55 Q60 52 76 57 Q101 63 96 79 Q92 90 60 90 Q33 90 26 80 Z"
        fill="url(#genieGrad)"
      />

      {/* Spout */}
      <Path d="M92 68 L114 61 L109 73 L94 76 Z" fill="url(#genieGrad)" />

      {/* Lid and knob */}
      <Path d="M48 55 Q60 44 72 55 Q60 51 48 55 Z" fill="url(#genieGrad)" />
      <Circle cx="60" cy="46" r="4.5" fill="url(#genieGrad)" />

      {/* Rising flame / genie wisp */}
      <Path
        d="M60 42 C49 32 58 18 60 12 C62 18 71 30 63 40 C70 36 68 26 63 22 C74 30 68 44 60 42 Z"
        fill="url(#genieGrad)"
      />
    </Svg>
  );
}
