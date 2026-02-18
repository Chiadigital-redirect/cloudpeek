'use client';

import { getBadgeDefs, type GameState } from '@/lib/gameState';

interface Props {
  state: GameState;
  onClose?: () => void;
}

export default function BadgesPanel({ state, onClose }: Props) {
  const defs = getBadgeDefs();
  const unlockedCount = defs.filter(b => state.badges[b.id]).length;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur rounded-3xl p-4 shadow-lg border-2 border-yellow-200 flex items-center justify-between">
        <h2 className="font-black text-yellow-700 text-lg">🏅 Badges</h2>
        <div className="flex items-center gap-2">
          <span className="font-black text-yellow-600 text-sm bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-full">
            {unlockedCount}/{defs.length}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close badges"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600 font-black text-lg transition-all active:scale-90"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {defs.map(badge => {
          const unlocked = !!state.badges[badge.id];
          return (
            <div
              key={badge.id}
              className={`
                flex items-center gap-4 rounded-2xl p-4 border-2 shadow-md transition-all
                ${unlocked
                  ? 'bg-yellow-50 border-yellow-300 shadow-yellow-100'
                  : 'bg-gray-100 border-gray-200 opacity-60'}
              `}
            >
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0
                  ${unlocked ? 'bg-yellow-200' : 'bg-gray-200 grayscale'}
                `}
              >
                {badge.emoji}
              </div>
              <div className="min-w-0">
                <p className={`font-black text-sm ${unlocked ? 'text-yellow-800' : 'text-gray-400'}`}>
                  {badge.name}
                  {unlocked && <span className="ml-2 text-yellow-500">✓</span>}
                </p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{badge.description}</p>
              </div>
              {!unlocked && (
                <span className="text-2xl ml-auto flex-shrink-0">🔒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
