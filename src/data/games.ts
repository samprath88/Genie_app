export type Category = 'Co-op' | 'Strategy' | 'Family' | 'Abstract';

export type Game = {
  id: string;
  name: string;
  categories: Category[];
  rating: number;
  /** Pence, so prices stay exact. Rendered via `formatPrice`. */
  pricePence: number;
  /** Some cards read "from £8.99" rather than a flat price. */
  priceFrom: boolean;
  tagline: string;
};

export const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

export const priceLabel = (game: Game) =>
  `${game.priceFrom ? 'from ' : ''}${formatPrice(game.pricePence)}`;

/** The four games with hand-written copy, shown at the top of the shelf. */
const FEATURED: Game[] = [
  {
    id: 'pandemic',
    name: 'Pandemic',
    categories: ['Co-op', 'Strategy'],
    rating: 4.6,
    pricePence: 899,
    priceFrom: true,
    tagline: 'Four diseases threaten the world. Cure them together — or lose together.',
  },
  {
    id: 'catan',
    name: 'Catan',
    categories: ['Strategy'],
    rating: 4.7,
    pricePence: 899,
    priceFrom: false,
    tagline: 'Trade, build and settle an island that never gives you quite enough wood.',
  },
  {
    id: 'ticket_to_ride',
    name: 'Ticket to Ride',
    categories: ['Family'],
    rating: 4.8,
    pricePence: 699,
    priceFrom: true,
    tagline: 'Claim railway routes across a continent before someone takes yours.',
  },
  {
    id: 'wingspan',
    name: 'Wingspan',
    categories: ['Strategy'],
    rating: 4.9,
    pricePence: 899,
    priceFrom: false,
    tagline: 'Attract a wildlife preserve of birds, each with its own chain reaction.',
  },
];

/**
 * The rest of the 124-game shelf. Generated rather than typed out by hand —
 * these exist to prove scrolling, filtering and search at realistic volume, and
 * they are replaced wholesale by `GET /api/games` in Phase 2.
 */
const FILLER_NAMES = [
  'Azul', 'Carcassonne', 'Splendor', 'Codenames', '7 Wonders', 'Dominion', 'Scythe',
  'Terraforming Mars', 'Gloomhaven', 'Spirit Island', 'Root', 'Everdell', 'Brass',
  'Agricola', 'Puerto Rico', 'Power Grid', 'Race for the Galaxy', 'Patchwork',
  'Sagrada', 'Kingdomino', 'Sushi Go', 'Love Letter', 'Hanabi', 'The Crew',
  'Forbidden Island', 'Forbidden Desert', 'Flash Point', 'Robinson Crusoe',
  'Mysterium', 'Dixit', 'Cascadia', 'Calico', 'Wavelength', 'Just One',
  'Concordia', 'Viticulture', 'Great Western Trail', 'Barrage', 'Teotihuacan',
  'Lost Ruins of Arnak', 'Dune Imperium', 'Ark Nova', 'Wingspan Oceania',
  'Clank', 'Quacks of Quedlinburg', 'Century Spice Road', 'Jaipur', 'Targi',
  'Hive', 'Onitama', 'Santorini', 'Tak', 'Go', 'Blokus', 'Ingenious',
  'Ticket to Ride Europe', 'Small World', 'Takenoko', 'Tokaido', 'Bohnanza',
  'Camel Up', 'King of Tokyo', 'Machi Koro', 'Star Realms', 'Marvel Champions',
  'Arkham Horror', 'Eldritch Horror', 'Descent', 'Betrayal at House on the Hill',
  'Dead of Winter', 'Zombicide', 'Nemesis', 'Blood Rage', 'Rising Sun',
  'Inis', 'Cyclades', 'Kemet', 'Chaos in the Old World', 'Twilight Struggle',
  'Pax Pamir', 'Oath', 'John Company', 'Hegemony', 'Res Arcana',
  'Wingspan Asia', 'Cartographers', 'Welcome To', 'Silver & Gold', 'Railroad Ink',
  'Micro Macro', 'Paleo', 'Sleeping Gods', 'Chronicles of Crime', 'Detective',
  'Sherlock Holmes', 'Exit The Game', 'Unlock', 'Escape the Curse', 'Decrypto',
  'So Clover', 'The Mind', 'Skull', 'Coup', 'Resistance', 'Secret Hitler',
  'One Night Werewolf', 'Deception', 'Chameleon', 'Herd Mentality', 'Wits & Wagers',
  'Photosynthesis', 'Tapestry', 'Clans of Caledonia', 'Anachrony', 'Gaia Project',
  'Underwater Cities', 'Maracaibo', 'Endeavor', 'Furnace', 'Beyond the Sun',
];

const CATEGORY_CYCLE: Category[][] = [
  ['Strategy'],
  ['Family'],
  ['Co-op'],
  ['Abstract'],
  ['Strategy', 'Family'],
  ['Co-op', 'Strategy'],
];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');

const FILLER: Game[] = FILLER_NAMES.map((name, i) => ({
  id: slugify(name),
  name,
  categories: CATEGORY_CYCLE[i % CATEGORY_CYCLE.length],
  // Deterministic so the shelf looks identical on every launch.
  rating: Number((3.9 + ((i * 7) % 11) / 10).toFixed(1)),
  pricePence: [499, 699, 899, 1099][i % 4],
  priceFrom: i % 3 === 0,
  tagline: `${name} — Genie teaches setup, rules and scoring alongside your copy.`,
}));

export const GAMES: Game[] = [...FEATURED, ...FILLER];

export const getGame = (id: string) => GAMES.find((g) => g.id === id);

export const FILTERS: ('All' | Category)[] = ['All', 'Co-op', 'Strategy', 'Family', 'Abstract'];

/* --------------------------------------------------------------- packages -- */

export type Tier = 'bundle' | 'instructions' | 'board';

export type Package = {
  tier: Tier;
  title: string;
  subtitle: string;
  pricePence: number;
  /** Struck-through original, shown on the bundle only. */
  strikePence?: number;
  savePence?: number;
  bestValue?: boolean;
  /** Whether buying this tier unlocks the digital Genie modes. */
  unlocks: boolean;
};

// Placeholder pricing — the physical price and bundle saving are flat for now
// and get refined in Phase 2. The digital price is the game's own shelf price.
const BOARD_PENCE = 3999;
const BUNDLE_SAVING_PENCE = 399;

export function getPackages(game: Game): Package[] {
  const instructions = game.pricePence;
  const strike = BOARD_PENCE + instructions;
  return [
    {
      tier: 'bundle',
      title: 'Complete Bundle',
      subtitle: 'Physical board game + the full Genie instruction package.',
      pricePence: strike - BUNDLE_SAVING_PENCE,
      strikePence: strike,
      savePence: BUNDLE_SAVING_PENCE,
      bestValue: true,
      unlocks: true,
    },
    {
      tier: 'instructions',
      title: 'Instructions Only',
      subtitle: 'Every Genie mode — guided play, scoring & Ask Anything.',
      pricePence: instructions,
      unlocks: true,
    },
    {
      tier: 'board',
      title: 'Board Game Only',
      subtitle: 'The physical board game, shipped to your door.',
      pricePence: BOARD_PENCE,
      unlocks: false,
    },
  ];
}
