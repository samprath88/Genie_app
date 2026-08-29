/**
 * Hand-written copy for the Pandemic vertical slice, plus the shared support
 * content. Everything here is served by `GET /api/game/{id}/hints` in Phase 2;
 * screens read it through the helpers at the bottom so the swap is contained.
 */

export type FeatureKey = 'about' | 'how-to-play' | 'setup' | 'guided-round' | 'scoring';

export type Feature = {
  key: FeatureKey;
  title: string;
  description: string;
  /** Free features are readable without unlocking the game. */
  free: boolean;
  /** Left accent stripe on the feature card. */
  accent: string;
  route?: string;
};

export const FEATURES: Feature[] = [
  {
    key: 'about',
    title: "What's It All About",
    description: 'The free hook — why this game is worth your evening.',
    free: true,
    accent: '#D9A86B',
  },
  {
    key: 'how-to-play',
    title: 'How to Play',
    description: 'Sectioned mechanics overview with jump-menu. Ask Anything embedded.',
    free: false,
    accent: '#6B1B1E',
    route: '/playing/how-to-play',
  },
  {
    key: 'setup',
    title: 'Setup Guide',
    description: 'Granular physical setup, step by step. Ask Anything embedded.',
    free: false,
    accent: '#2F6DB5',
    route: '/playing/setup-guide',
  },
  {
    key: 'guided-round',
    title: 'Guided First Round',
    description: 'A full turn walked through live. Ask Anything embedded.',
    free: false,
    accent: '#D9A86B',
    route: '/playing/guided-round',
  },
  {
    key: 'scoring',
    title: 'Scoring Assist',
    description: 'Tracking, winner call and dispute mediation. Ask Anything embedded.',
    free: false,
    accent: '#4E7B4E',
    route: '/playing/scoring',
  },
];

/** Checklist shown inside the unlock modal. */
export const UNLOCK_CHECKLIST = [
  { title: 'How to Play', detail: 'sectioned mechanics overview' },
  { title: 'Setup Guide', detail: 'granular physical setup steps' },
  { title: 'Guided First Round', detail: 'a full turn walked through live' },
  { title: 'Scoring Assist', detail: 'tracking, winner call & dispute mediation' },
  { title: 'Ask Anything', detail: 'embedded in every single mode' },
];

export const NARRATION = {
  headline: 'Why Pandemic owns your table tonight',
  status: 'Now playing · Genie narrating',
  body:
    'Ninety intense minutes where four specialists race a spreading plague across the globe. ' +
    'Every turn is a shared gamble — treat the fire in front of you, or gather the cards for a ' +
    'cure. When you win, you win as a team. When you lose, you lose by a single, agonising card. ' +
    'Tonight, Genie sets it up, teaches it in minutes, and keeps the tension high.',
};

export type HowToPlayTab = { title: string; heading: string; content: string };

export const HOW_TO_PLAY: HowToPlayTab[] = [
  {
    title: 'Your Goal',
    heading: 'Your Goal',
    content:
      'Discover cures for all four diseases before any of the three doom clocks runs out. ' +
      'You win — or lose — together, as one team.',
  },
  {
    title: 'Core Mechanics',
    heading: 'Core Mechanics',
    content:
      'Four actions per turn, then draw two player cards, then infect new cities. ' +
      'Every role bends one rule in your favour — the Medic treats a whole city at once, ' +
      'the Dispatcher moves other people around the board.',
  },
  {
    title: 'How to Win',
    heading: 'How to Win',
    content:
      'Collect five matching city cards and cure that colour at any research station. ' +
      'Cure all four colours and the whole table wins together.',
  },
  {
    title: 'How to Lose',
    heading: 'How to Lose',
    content:
      'Three ways, and all of them hurt. Run out of player cards, run out of disease cubes ' +
      'of any one colour, or trigger an eighth outbreak. Watch all three clocks at once.',
  },
];

export type SetupStep = { tab: string; title: string; content: string };

export const SETUP_STEPS: SetupStep[] = [
  {
    tab: 'Board Placement',
    title: 'Board Placement',
    content:
      'Set the board in the centre where everyone can reach it. Put the outbreak marker on 0 ' +
      'and the infection-rate marker on the leftmost "2". Place a research station in Atlanta — ' +
      'your team starts there.',
  },
  {
    tab: 'Card Distribution',
    title: 'Card Distribution',
    content:
      'Shuffle the player deck and deal by headcount: four cards each for two players, three ' +
      'each for three, two each for four. Set the epidemic cards aside for now — they go in ' +
      'after the opening hands.',
  },
  {
    tab: 'Pawn Placement',
    title: 'Pawn Placement',
    content:
      'Deal one role card per player and put every pawn in Atlanta. Flip the top nine infection ' +
      'cards: three cities get three cubes, three get two, three get one. The board starts ' +
      'already burning.',
  },
];

export type GuidedStep = { headline: string; narration: string };

export const GUIDED_ROUND: GuidedStep[] = [
  {
    headline: 'The board is live',
    narration:
      'Nine cities already show disease cubes. Take a breath — your opening turn sets the tempo. ' +
      "I'll narrate every decision with you.",
  },
  {
    headline: 'Four actions, no more',
    narration:
      'Move, treat, build, share or cure. Spend all four or bank none — unused actions vanish at ' +
      'the end of your turn, so there is no reason to hold back.',
  },
  {
    headline: 'Treat what is burning',
    narration:
      'Three cubes in one city is one bad flip away from an outbreak. Clear the worst stack ' +
      'first, even when the cure cards are tempting.',
  },
  {
    headline: 'Draw two, brace yourself',
    narration:
      'Take two player cards. If an epidemic surfaces, the infection rate climbs and a fresh ' +
      'city takes three cubes immediately. This is where runs unravel.',
  },
  {
    headline: 'Infect, and pass along',
    narration:
      'Flip infection cards equal to the current rate and place a cube on each city named. ' +
      'Then the turn passes. You survived the first round — now do it seven more times.',
  },
];

export type QA = { question: string; answer: string };

export const QA_DATABASE: QA[] = [
  {
    question: 'How many actions do I get each turn?',
    answer:
      'Four actions per turn — move, treat a disease, build a research station, share a card, ' +
      'or discover a cure. Mix and match them however the outbreak demands, then draw and infect.',
  },
  {
    question: 'What happens during an outbreak?',
    answer:
      'When a city would take a fourth cube it outbreaks instead. Every connected city gains one ' +
      'cube, the outbreak marker advances, and chains can cascade. Eight outbreaks ends the game.',
  },
  {
    question: 'Can I trade cards with another player?',
    answer:
      'Only the card matching the city you are both standing in, and both of you must be there. ' +
      'The Researcher ignores that restriction and can hand over any card.',
  },
  {
    question: 'How do I discover a cure?',
    answer:
      'Stand at any research station and discard five cards of one colour. The Scientist needs ' +
      'only four. Curing does not remove cubes — it just stops that colour getting worse.',
  },
];

export const DEFAULT_ANSWER =
  'Good question. In the full build I answer from the live rulebook for this game — for now ' +
  'try one of the sample questions above and I will read the exact rule aloud.';

export const FAQ: QA[] = [
  {
    question: 'How do I unlock a game?',
    answer: 'Open any game and tap Unlock. One payment gives you every mode for that game, for life.',
  },
  {
    question: 'Can Genie teach a game I already own?',
    answer:
      'Yes — unlock it here and Genie guides setup, rules, and scoring alongside your physical copy.',
  },
  {
    question: 'Does narration work offline?',
    answer:
      'Once a game is unlocked its narration is cached on your device, so setup and rules keep ' +
      'working without a signal. Ask Anything needs a connection.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Within 14 days of purchase, provided you have not completed a guided round. Reach us from ' +
      'Help & support and we will sort it.',
  },
];

export type SupportOption = {
  title: string;
  description: string;
  /** Ionicons glyph name. */
  icon: string;
  tint: string;
  iconColor: string;
};

export const SUPPORT_OPTIONS: SupportOption[] = [
  { title: 'Chat with Genie', description: 'Instant answers, any game', icon: 'chatbubble-ellipses', tint: '#EBD9C2', iconColor: '#C79A3E' },
  { title: 'Request a rulebook', description: "We'll teach a new game for you", icon: 'book', tint: '#CBDCEF', iconColor: '#2F6DB5' },
  { title: 'Email support', description: 'We reply within 24 hours', icon: 'mail', tint: '#CFE3CB', iconColor: '#4E7B4E' },
  { title: 'Report a problem', description: 'Something not working right?', icon: 'warning', tint: '#F2DFC4', iconColor: '#C79A3E' },
];

export const NARRATOR_VOICES = ['Kore', 'Roger', 'Tara'] as const;
export type NarratorVoice = (typeof NARRATOR_VOICES)[number];

/** Used to tailor future game recommendations — purely preference, no gameplay effect. */
export const GAME_INTERESTS = [
  'Co-op', 'Competitive', 'Strategy', 'Party', 'Family', 'Solo', 'Casual', 'Complex',
] as const;
export type GameInterest = (typeof GAME_INTERESTS)[number];
