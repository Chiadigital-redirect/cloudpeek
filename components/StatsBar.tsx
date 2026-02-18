'use client';

import { CLOUD_TYPES, type GameState } from '@/lib/gameState';

interface Props {
  state: GameState;
  onTabChange?: (tab: 'collect' | 'badges') => void;
}

export default function StatsBar({ state, onTabChange }: Props) {
  const found = Object.keys(state.discovered).length;
  const total = CLOUD_TYPES.length;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white/70 backdrop-blur rounded-3xl shadow-lg border-2 border-white/80 px-4 py-3 grid grid-cols-3 gap-2">

        {/* Score */}
        <div className="text-center">
          <p className="text-2xl font-black text-yellow-500">{state.totalScore}</p>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Points</p>
        </div>

        {/* Collection — tappable */}
        <button
          onClick={() => onTabChange?.('collect')}
          className="text-center hover:opacity-80 active:scale-95 transition-all"
        >
          <p className="text-2xl font-black text-sky-500">{found}<span className="text-gray-400 font-bold text-lg">/{total}</span></p>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Clouds</p>
        </button>

        {/* Streak */}
        <div className="text-center">
          <p className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
            {state.streak > 0 && <span className="flame">🔥</span>}
            {state.streak}
          </p>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Day Streak</p>
        </div>
      </div>
    </div>
  );
}
