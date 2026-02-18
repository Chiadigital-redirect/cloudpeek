'use client';

import { CLOUD_TYPES, type GameState } from '@/lib/gameState';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  state: GameState;
  clerkId?: string;
  onClose?: () => void;
}

const RARITY_COLOR: Record<string, string> = {
  common:   'bg-green-100  border-green-300  text-green-700',
  uncommon: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  rare:     'bg-purple-100 border-purple-300 text-purple-700',
};

const RARITY_GLOW: Record<string, string> = {
  common:   'shadow-green-200',
  uncommon: 'shadow-yellow-200',
  rare:     'shadow-purple-300',
};

/** Build a discovered map from Convex scans */
function buildDiscoveredFromScans(
  scans: Array<{ cloudType: string; cloudId?: string | null; scannedAt: number }>
): Record<string, { discoveredAt: number; count: number }> {
  const discovered: Record<string, { discoveredAt: number; count: number }> = {};

  for (const scan of scans) {
    // Prefer cloudId (exact match); fall back to matching by cloud name
    const cloudId =
      scan.cloudId ??
      CLOUD_TYPES.find(
        c => c.name.toLowerCase() === scan.cloudType.toLowerCase()
      )?.id;

    if (!cloudId) continue;

    if (discovered[cloudId]) {
      discovered[cloudId].count += 1;
      // Keep earliest discoveredAt
      if (scan.scannedAt < discovered[cloudId].discoveredAt) {
        discovered[cloudId].discoveredAt = scan.scannedAt;
      }
    } else {
      discovered[cloudId] = { discoveredAt: scan.scannedAt, count: 1 };
    }
  }

  return discovered;
}

export default function CloudCollection({ state, clerkId, onClose }: Props) {
  // Query Convex when user is signed in; skip (pass "skip") when not
  const convexScans = useQuery(
    api.scans.getUserScans,
    clerkId ? { clerkId } : 'skip'
  );

  // Determine discovered source
  const discovered: Record<string, { discoveredAt: number; count: number }> = (() => {
    if (clerkId) {
      // Signed-in: use Convex data (may be undefined while loading)
      if (!convexScans) return {}; // loading state — show empty
      return buildDiscoveredFromScans(convexScans);
    }
    // Signed-out: use localStorage state
    return state?.discovered ?? {};
  })();

  const total  = CLOUD_TYPES.length;
  const found  = Object.keys(discovered).length;
  const pct    = Math.round((found / total) * 100);
  const isLoading = clerkId && convexScans === undefined;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">

      {/* Header + progress */}
      <div className="bg-white/70 backdrop-blur rounded-3xl p-4 shadow-lg border-2 border-sky-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-sky-700 text-lg">☁️ Cloud Collection</h2>
          <div className="flex items-center gap-2">
            <span className="font-black text-sky-600 text-sm bg-sky-100 border border-sky-300 px-3 py-1 rounded-full">
              {isLoading ? '…' : `${found}/${total}`}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close collection"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 font-black text-lg transition-all active:scale-90"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-4 bg-sky-100 rounded-full overflow-hidden border border-sky-200">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-sky-500 font-semibold mt-1 text-right">
          {isLoading ? 'Loading your collection…' : `${pct}% collected`}
        </p>
      </div>

      {/* Grid of cloud cards */}
      <div className="grid grid-cols-3 gap-3">
        {CLOUD_TYPES.map(cloud => {
          const isFound = !!discovered[cloud.id];
          const count   = discovered[cloud.id]?.count ?? 0;
          const rarityClass = RARITY_COLOR[cloud.rarity];
          const glowClass   = RARITY_GLOW[cloud.rarity];

          return (
            <div key={cloud.id} className="card-flip-container" style={{ height: 110 }}>
              <div className={`card-flip-inner ${isFound ? 'flipped' : ''}`}>

                {/* Front (locked / silhouette) */}
                <div className="card-face bg-gray-200 border-2 border-gray-300 p-2">
                  <div className="text-4xl grayscale opacity-30">☁️</div>
                  <p className="text-gray-400 text-xs font-bold mt-1">???</p>
                </div>

                {/* Back (discovered!) */}
                <div className={`card-back card-face border-2 ${rarityClass} shadow-md ${glowClass} p-2 text-center`}>
                  <div className="text-3xl">{cloud.emoji}</div>
                  <p className="text-xs font-black mt-1 leading-tight">{cloud.name}</p>
                  {count > 1 && (
                    <p className="text-xs opacity-60 font-semibold">×{count}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && found === total && (
        <div className="bounce-in bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-4 text-center shadow-xl">
          <p className="text-white font-black text-xl">👑 CLOUD MASTER! 👑</p>
          <p className="text-yellow-100 font-semibold text-sm mt-1">You collected every cloud type!</p>
        </div>
      )}
    </div>
  );
}
