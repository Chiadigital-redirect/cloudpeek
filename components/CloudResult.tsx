'use client';

import { useEffect, useRef, useState } from 'react';
import { recordSpot, type Rarity } from '@/lib/gameState';
import { useConfetti } from './useConfetti';

interface CloudData {
  cloudType: string;
  cloudId: string;
  emoji: string;
  description: string;
  funFacts: string[];
  rarity: Rarity;
  mood: string;
  found: boolean;
  message?: string;
}

interface Props {
  data: CloudData;
  imagePreview?: string;
  onReset: () => void;
  onStateChange: () => void;
}

const RARITY_CONFIG = {
  common:   { stars: '⭐',     label: 'Common',   bg: 'bg-green-100',  border: 'border-green-300',  text: 'text-green-700', points: 1 },
  uncommon: { stars: '⭐⭐',   label: 'Uncommon', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', points: 3 },
  rare:     { stars: '⭐⭐⭐', label: 'Rare!',    bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', points: 5 },
};

const MOOD_EMOJI: Record<string, string> = {
  fluffy: '😊', dramatic: '🎭', stormy: '😤', wispy: '🌬️',
  mysterious: '🔮', sleepy: '😴', angry: '😠', cheerful: '😄',
  magical: '✨', adventurous: '🗺️',
};

const CARD_BG     = ['bg-yellow-100', 'bg-pink-100', 'bg-green-100', 'bg-purple-100'];
const CARD_BORDER = ['border-yellow-300', 'border-pink-300', 'border-green-200', 'border-purple-200'];

export default function CloudResult({ data, onReset, onStateChange }: Props) {
  const { fire } = useConfetti();
  const [scorePopVisible, setScorePopVisible] = useState(false);
  const [scorePopValue, setScorePopValue] = useState(0);
  const [newBadges, setNewBadges] = useState<{ id: string; name: string; emoji: string; description: string }[]>([]);
  const [isNewDiscovery, setIsNewDiscovery] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !data.found) return;
    fired.current = true;

    const { newlyDiscovered, newBadges: badges, pointsEarned, updatedState } = recordSpot(data.cloudId, data.rarity);
    void updatedState;

    setIsNewDiscovery(newlyDiscovered);
    setScorePopValue(pointsEarned);
    setNewBadges(badges);

    if (newlyDiscovered) {
      fire(data.rarity);
    }

    // Show score pop
    setTimeout(() => {
      setScorePopVisible(true);
      setTimeout(() => setScorePopVisible(false), 1500);
    }, 600);

    onStateChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.found) {
    return (
      <div className="w-full max-w-sm mx-auto text-center space-y-6 shake">
        <div className="text-8xl">🌈</div>
        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-xl border-2 border-sky-200">
          <p className="text-sky-700 font-black text-xl">{data.message ?? "No cloud found!"}</p>
          <p className="text-sky-500 mt-2 font-semibold">Try a photo with more sky visible ☁️</p>
        </div>
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-black text-lg shadow-lg transition-all"
        >
          Try Another Photo 📷
        </button>
      </div>
    );
  }

  const rarityInfo = RARITY_CONFIG[data.rarity] ?? RARITY_CONFIG.common;
  const shareText = `I just spotted a ${data.cloudType} cloud ${data.emoji} using CloudPeek! 🌤️ It's ${rarityInfo.label} — ${data.rarity === 'rare' ? 'super rare!' : 'pretty cool!'} #CloudPeek #CloudSpotter`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => alert('Copied to clipboard! 📋')).catch(() => {});
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5 relative">

      {/* Score pop */}
      {scorePopVisible && (
        <div className="score-pop fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-yellow-400 text-white font-black text-4xl px-6 py-3 rounded-2xl shadow-2xl">
            +{scorePopValue} pts ⭐
          </div>
        </div>
      )}

      {/* New badge toasts */}
      {newBadges.map((badge, i) => (
        <div
          key={badge.id}
          className="badge-pulse fixed top-6 inset-x-4 z-50 mx-auto max-w-sm"
          style={{ top: `${1.5 + i * 5}rem`, animation: `bounceIn 0.5s ${i * 0.3}s both` }}
        >
          <div className="bg-yellow-400 text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 border-2 border-yellow-300">
            <span className="text-3xl">{badge.emoji}</span>
            <div>
              <p className="font-black text-sm">Badge Unlocked! 🎉</p>
              <p className="font-bold text-xs opacity-90">{badge.name} — {badge.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Hero card */}
      <div className="bounce-in bg-white/80 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
        {/* Cloud type header */}
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-6 text-center relative">
          {isNewDiscovery && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-black px-2 py-1 rounded-full">
              🆕 NEW!
            </div>
          )}
          <div className="text-7xl mb-2">{data.emoji}</div>
          <h2 className="text-3xl font-black text-white tracking-wide drop-shadow">{data.cloudType}</h2>
          <p className="text-sky-100 font-semibold mt-1 capitalize">Mood: {MOOD_EMOJI[data.mood] ?? '☁️'} {data.mood}</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Rarity badge */}
          <div className={`flex items-center gap-3 ${rarityInfo.bg} border-2 ${rarityInfo.border} rounded-2xl px-4 py-3`}>
            <span className="text-2xl">{rarityInfo.stars}</span>
            <div>
              <p className={`font-black ${rarityInfo.text}`}>{rarityInfo.label} Cloud</p>
              <p className="text-gray-500 text-xs font-semibold">+{rarityInfo.points} point{rarityInfo.points !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 font-semibold text-sm leading-relaxed">{data.description}</p>
        </div>
      </div>

      {/* Fun facts */}
      <div className="space-y-3">
        <h3 className="text-sky-700 font-black text-lg text-center">🔍 Fun Facts!</h3>
        {data.funFacts.map((fact, i) => (
          <div
            key={i}
            className={`bounce-in-${i + 1} ${CARD_BG[i]} border-2 ${CARD_BORDER[i]} rounded-2xl p-4 shadow-md`}
          >
            <p className="font-bold text-gray-700 text-sm leading-relaxed">
              <span className="text-xl mr-2">{'💡🌟🎯'[i]}</span>{fact}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 bounce-in-4">
        <button
          onClick={handleShare}
          className="py-4 rounded-2xl bg-pink-400 hover:bg-pink-300 active:scale-95 text-white font-black shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>📤</span> Share
        </button>
        <button
          onClick={onReset}
          className="py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-black shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span> Again!
        </button>
      </div>
    </div>
  );
}
