// ─── CloudPeek Game State (localStorage) ─────────────────────────────────────

export const CLOUD_TYPES = [
  { id: 'cumulus',        name: 'Cumulus',        emoji: '⛅', rarity: 'common',   points: 1 },
  { id: 'cumulonimbus',   name: 'Cumulonimbus',   emoji: '⛈️', rarity: 'rare',     points: 5 },
  { id: 'stratus',        name: 'Stratus',         emoji: '🌫️', rarity: 'common',   points: 1 },
  { id: 'stratocumulus',  name: 'Stratocumulus',   emoji: '🌥️', rarity: 'common',   points: 1 },
  { id: 'altocumulus',    name: 'Altocumulus',     emoji: '🌤️', rarity: 'uncommon', points: 3 },
  { id: 'altostratus',    name: 'Altostratus',     emoji: '☁️', rarity: 'uncommon', points: 3 },
  { id: 'cirrus',         name: 'Cirrus',          emoji: '🌬️', rarity: 'uncommon', points: 3 },
  { id: 'cirrocumulus',   name: 'Cirrocumulus',    emoji: '🔵', rarity: 'rare',     points: 5 },
  { id: 'cirrostratus',   name: 'Cirrostratus',    emoji: '🌙', rarity: 'rare',     points: 5 },
  { id: 'nimbostratus',   name: 'Nimbostratus',    emoji: '🌧️', rarity: 'uncommon', points: 3 },
  { id: 'fog',            name: 'Fog / Mist',      emoji: '🌁', rarity: 'common',   points: 1 },
  { id: 'contrails',      name: 'Contrails',       emoji: '✈️', rarity: 'common',   points: 1 },
] as const;

export type CloudId = typeof CLOUD_TYPES[number]['id'];
export type Rarity = 'common' | 'uncommon' | 'rare';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}

export interface GameState {
  discovered: Record<string, { discoveredAt: number; count: number }>;
  totalScore: number;
  badges: Record<string, boolean>;
  streak: number;
  lastSpotDate: string | null; // ISO date string YYYY-MM-DD
}

const BADGE_DEFS = [
  { id: 'first_cloud',    name: 'First Cloud!',        emoji: '🌟', description: 'Spotted your very first cloud' },
  { id: 'storm_chaser',   name: 'Storm Chaser',        emoji: '⛈️', description: 'Found a mighty Cumulonimbus' },
  { id: 'head_in_clouds', name: 'Head in the Clouds',  emoji: '🤩', description: 'Discovered 5 different cloud types' },
  { id: 'cloud_master',   name: 'Cloud Master',        emoji: '👑', description: 'Collected all 12 cloud types!' },
  { id: 'rare_hunter',    name: 'Rare Hunter',         emoji: '💎', description: 'Found your first rare cloud' },
  { id: 'streak_3',       name: 'Three-Day Spotter',   emoji: '🔥', description: 'Cloud-spotted 3 days in a row' },
  { id: 'streak_7',       name: 'Week of Clouds',      emoji: '🌈', description: 'Cloud-spotted 7 days in a row' },
];

const STORAGE_KEY = 'cloudpeek_game';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function loadState(): GameState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as GameState;
  } catch {
    return defaultState();
  }
}

function defaultState(): GameState {
  return {
    discovered: {},
    totalScore: 0,
    badges: {},
    streak: 0,
    lastSpotDate: null,
  };
}

export function saveState(state: GameState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Returns { newlyDiscovered, newBadges, pointsEarned, updatedState } */
export function recordSpot(cloudId: string, rarity: Rarity): {
  newlyDiscovered: boolean;
  newBadges: typeof BADGE_DEFS;
  pointsEarned: number;
  updatedState: GameState;
} {
  const state = loadState();

  // ── Points ─────────────────────────────────────────────────────────────────
  const pointMap: Record<Rarity, number> = { common: 1, uncommon: 3, rare: 5 };
  const pointsEarned = pointMap[rarity] ?? 1;

  // ── Discovery ──────────────────────────────────────────────────────────────
  const newlyDiscovered = !state.discovered[cloudId];
  if (newlyDiscovered) {
    state.discovered[cloudId] = { discoveredAt: Date.now(), count: 1 };
  } else {
    state.discovered[cloudId].count += 1;
  }
  state.totalScore += pointsEarned;

  // ── Streak ─────────────────────────────────────────────────────────────────
  const todayStr = today();
  if (state.lastSpotDate === todayStr) {
    // already spotted today — streak unchanged
  } else if (state.lastSpotDate === yesterday()) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastSpotDate = todayStr;

  // ── Badges ─────────────────────────────────────────────────────────────────
  const prevBadges = { ...state.badges };

  const discoveredCount = Object.keys(state.discovered).length;

  if (discoveredCount >= 1)  state.badges['first_cloud'] = true;
  if (state.discovered['cumulonimbus']) state.badges['storm_chaser'] = true;
  if (discoveredCount >= 5)  state.badges['head_in_clouds'] = true;
  if (discoveredCount >= 12) state.badges['cloud_master'] = true;
  if (rarity === 'rare')     state.badges['rare_hunter'] = true;
  if (state.streak >= 3)     state.badges['streak_3'] = true;
  if (state.streak >= 7)     state.badges['streak_7'] = true;

  const newBadges = BADGE_DEFS.filter(b => state.badges[b.id] && !prevBadges[b.id]);

  saveState(state);
  return { newlyDiscovered, newBadges, pointsEarned, updatedState: state };
}

export function getBadgeDefs() {
  return BADGE_DEFS;
}

export function getCloudById(id: string) {
  return CLOUD_TYPES.find(c => c.id === id);
}
