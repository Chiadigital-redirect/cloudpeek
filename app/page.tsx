'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { loadState, type GameState } from '@/lib/gameState';

// Dynamic imports (avoid SSR for client-only components)
const AnimatedClouds  = dynamic(() => import('@/components/AnimatedClouds'),  { ssr: false });
const CloudCamera     = dynamic(() => import('@/components/CloudCamera'),      { ssr: false });
const CloudResult     = dynamic(() => import('@/components/CloudResult'),      { ssr: false });
const LoadingCloud    = dynamic(() => import('@/components/LoadingCloud'),     { ssr: false });
const CloudCollection = dynamic(() => import('@/components/CloudCollection'), { ssr: false });
const BadgesPanel     = dynamic(() => import('@/components/BadgesPanel'),     { ssr: false });
const StatsBar        = dynamic(() => import('@/components/StatsBar'),        { ssr: false });

type Tab    = 'identify' | 'collect' | 'badges';
type Phase  = 'idle' | 'preview' | 'loading' | 'result';

export default function HomePage() {
  const [tab,          setTab]         = useState<Tab>('identify');
  const [phase,        setPhase]       = useState<Phase>('idle');
  const [imageBase64,  setImageBase64] = useState<string>('');
  const [cloudData,    setCloudData]   = useState<Record<string, unknown> | null>(null);
  const [error,        setError]       = useState<string>('');
  const [gameState,    setGameState]   = useState<GameState | null>(null);

  // Load game state on mount
  useEffect(() => {
    setGameState(loadState());
  }, []);

  const refreshState = useCallback(() => {
    setGameState(loadState());
  }, []);

  const handleImageReady = useCallback((base64: string) => {
    setImageBase64(base64);
    setPhase('preview');
    setCloudData(null);
    setError('');
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!imageBase64) return;
    setPhase('loading');
    setError('');

    try {
      const res = await fetch('/api/identify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();
      setCloudData(data);
      setPhase('result');
    } catch {
      setError('Uh oh! Something went wrong. Please try again 🌧️');
      setPhase('preview');
    }
  }, [imageBase64]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setCloudData(null);
    setImageBase64('');
    setError('');
  }, []);

  const navItems: { id: Tab; label: string; emoji: string }[] = [
    { id: 'identify', label: 'Peek!',      emoji: '🔍' },
    { id: 'collect',  label: 'Collection', emoji: '☁️' },
    { id: 'badges',   label: 'Badges',     emoji: '🏅' },
  ];

  return (
    <div className="relative min-h-dvh flex flex-col">
      {/* Background */}
      <AnimatedClouds />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-dvh">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="pt-safe pt-4 px-4 pb-2 text-center">
          <h1 className="text-4xl font-black text-sky-700 drop-shadow-sm tracking-tight">
            Cloud<span className="text-blue-500">Peek</span> 🌤️
          </h1>
          <p className="text-sky-600 font-semibold text-sm mt-0.5">
            Point at the sky &amp; discover your cloud!
          </p>
        </header>

        {/* ── Stats bar (always visible) ───────────────────────────────────── */}
        {gameState && (
          <div className="px-4 py-2">
            <StatsBar state={gameState} onTabChange={t => setTab(t)} />
          </div>
        )}

        {/* ── Tab nav ──────────────────────────────────────────────────────── */}
        <nav className="px-4 py-2">
          <div className="max-w-sm mx-auto bg-white/50 backdrop-blur rounded-2xl p-1 flex gap-1 border border-white/80 shadow">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`
                  flex-1 py-2 rounded-xl font-black text-sm transition-all
                  ${tab === item.id
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-sky-600 hover:bg-white/60'}
                `}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 px-4 pb-8 overflow-y-auto no-scrollbar">

          {/* IDENTIFY TAB */}
          {tab === 'identify' && (
            <div className="max-w-sm mx-auto space-y-4 pt-2">

              {phase === 'idle' && (
                <>
                  <CloudCamera onImageReady={handleImageReady} />

                  {/* How it works */}
                  <div className="bg-white/60 backdrop-blur rounded-3xl p-4 border border-white shadow-md">
                    <h3 className="font-black text-sky-700 mb-2">How it works 🌈</h3>
                    <ol className="space-y-1.5 text-sm font-semibold text-gray-600">
                      <li className="flex gap-2"><span className="text-sky-400">1.</span> Take a photo of the sky</li>
                      <li className="flex gap-2"><span className="text-sky-400">2.</span> AI identifies the cloud</li>
                      <li className="flex gap-2"><span className="text-sky-400">3.</span> Collect it &amp; earn points!</li>
                    </ol>
                  </div>
                </>
              )}

              {phase === 'preview' && (
                <div className="space-y-4">
                  <CloudCamera onImageReady={handleImageReady} />
                  {error && (
                    <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-3 text-center text-red-700 font-bold text-sm">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={handleIdentify}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    🔍 Identify This Cloud!
                  </button>
                </div>
              )}

              {phase === 'loading' && <LoadingCloud />}

              {phase === 'result' && cloudData && (
                <CloudResult
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data={cloudData as any}
                  imagePreview={imageBase64}
                  onReset={handleReset}
                  onStateChange={refreshState}
                />
              )}
            </div>
          )}

          {/* COLLECTION TAB */}
          {tab === 'collect' && gameState && (
            <div className="pt-2">
              <CloudCollection state={gameState} />
            </div>
          )}

          {/* BADGES TAB */}
          {tab === 'badges' && gameState && (
            <div className="pt-2">
              <BadgesPanel state={gameState} />
            </div>
          )}
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="px-4 pb-safe pb-4 pt-2 text-center">
          <p className="text-sky-500/70 text-xs font-semibold">
            ☁️ There are 10 main types of clouds! Can you find them all? · CloudPeek 🌤️
          </p>
        </footer>
      </div>
    </div>
  );
}
