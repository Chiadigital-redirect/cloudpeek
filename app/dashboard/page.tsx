'use client';

import { useUser, UserButton, SignOutButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const RARITY_CONFIG = {
  common:   { stars: '⭐',     label: 'Common',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  uncommon: { stars: '⭐⭐',   label: 'Uncommon', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  rare:     { stars: '⭐⭐⭐', label: 'Rare!',    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const { user } = useUser();
  const scans = useQuery(
    api.scans.getUserScans,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const totalPoints = scans?.reduce((sum, s) => sum + s.points, 0) ?? 0;
  const uniqueTypes = new Set(scans?.map(s => s.cloudType) ?? []).size;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-200 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b-2 border-sky-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-sky-700">
            Cloud<span className="text-blue-500">Peek</span> 🌤️
          </Link>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Welcome card */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-5 shadow-xl border-2 border-sky-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">👋</div>
            <div>
              <h2 className="text-xl font-black text-sky-700">
                Welcome back, {user?.firstName ?? 'Cloud Spotter'}!
              </h2>
              <p className="text-sky-500 font-semibold text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center bg-sky-50 rounded-2xl p-3 border border-sky-100">
              <p className="text-2xl font-black text-sky-700">{scans?.length ?? '…'}</p>
              <p className="text-xs text-sky-500 font-bold">Total Scans</p>
            </div>
            <div className="text-center bg-blue-50 rounded-2xl p-3 border border-blue-100">
              <p className="text-2xl font-black text-blue-700">{uniqueTypes || '…'}</p>
              <p className="text-xs text-blue-500 font-bold">Cloud Types</p>
            </div>
            <div className="text-center bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
              <p className="text-2xl font-black text-yellow-700">{totalPoints || '…'}</p>
              <p className="text-xs text-yellow-500 font-bold">Total Points</p>
            </div>
          </div>
        </div>

        {/* Scan history */}
        <div>
          <h3 className="text-sky-700 font-black text-lg mb-3 px-1">☁️ Your Scan History</h3>

          {scans === undefined && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3 animate-bounce">☁️</div>
              <p className="text-sky-600 font-bold">Loading your clouds…</p>
            </div>
          )}

          {scans?.length === 0 && (
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 text-center shadow-xl border-2 border-sky-200">
              <div className="text-6xl mb-3">🔭</div>
              <h4 className="text-sky-700 font-black text-lg mb-2">No scans yet!</h4>
              <p className="text-sky-500 font-semibold text-sm mb-4">
                Head outside and point your camera at the sky to start your collection!
              </p>
              <Link
                href="/"
                className="inline-block py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black shadow-lg"
              >
                🔍 Start Peeking!
              </Link>
            </div>
          )}

          {scans && scans.length > 0 && (
            <div className="space-y-3">
              {scans.map((scan) => {
                const rarity = scan.rarity as keyof typeof RARITY_CONFIG;
                const rarityInfo = RARITY_CONFIG[rarity] ?? RARITY_CONFIG.common;
                return (
                  <div
                    key={scan._id}
                    className={`bg-white/90 backdrop-blur rounded-2xl p-4 shadow-md border-2 ${rarityInfo.border} flex items-center gap-4`}
                  >
                    <div className="text-4xl">{scan.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sky-700 truncate">{scan.cloudType}</p>
                      <p className={`text-xs font-bold ${rarityInfo.color}`}>
                        {rarityInfo.stars} {rarityInfo.label}
                      </p>
                      <p className="text-gray-400 text-xs font-semibold mt-0.5">
                        {formatDate(scan.scannedAt)}
                      </p>
                    </div>
                    <div className={`text-center ${rarityInfo.bg} rounded-xl px-3 py-2`}>
                      <p className="font-black text-sky-700 text-lg">+{scan.points}</p>
                      <p className="text-sky-500 text-xs font-bold">pts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sign out button */}
        <div className="pt-2 pb-6">
          <SignOutButton redirectUrl="/">
            <button className="w-full py-3 rounded-2xl border-2 border-sky-200 text-sky-500 font-bold text-sm hover:bg-sky-50 transition-all">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </main>
    </div>
  );
}
