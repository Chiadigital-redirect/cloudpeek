import { useCallback } from 'react';

export function useConfetti() {
  const fire = useCallback(async (rarity: string = 'common') => {
    // Dynamic import to avoid SSR issues
    const confetti = (await import('canvas-confetti')).default;

    const count  = rarity === 'rare' ? 300 : rarity === 'uncommon' ? 180 : 100;
    const spread = rarity === 'rare' ? 120 : 90;
    const colors =
      rarity === 'rare'
        ? ['#FFD700', '#FF69B4', '#00BFFF', '#7CFC00', '#FF4500']
        : rarity === 'uncommon'
        ? ['#87CEEB', '#ADD8E6', '#FFB6C1', '#98FB98']
        : ['#87CEEB', '#FFF9C4', '#E0F0FF'];

    const origin = { x: 0.5, y: 0.6 };

    confetti({ particleCount: Math.floor(count / 2), spread, origin, colors, startVelocity: 35 });
    setTimeout(() => {
      confetti({ particleCount: Math.floor(count / 2), spread, origin, colors, startVelocity: 25, scalar: 1.2 });
    }, 150);

    if (rarity === 'rare') {
      // Extra burst for rare!
      setTimeout(() => {
        confetti({ particleCount: 60, spread: 160, origin: { x: 0.2, y: 0.5 }, colors, startVelocity: 20 });
        confetti({ particleCount: 60, spread: 160, origin: { x: 0.8, y: 0.5 }, colors, startVelocity: 20 });
      }, 400);
    }
  }, []);

  return { fire };
}
