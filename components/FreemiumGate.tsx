'use client';

interface Props {
  onDismiss: () => void;
}

export default function FreemiumGate({ onDismiss }: Props) {
  const handleMaybeLater = () => {
    // Dismiss for this session only
    try {
      sessionStorage.setItem('cloudpeek_gate_dismissed', '1');
    } catch {
      // ignore storage errors
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sky-900/40 backdrop-blur-sm"
        onClick={handleMaybeLater}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bounce-in bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-200">
        {/* Decorative sky header */}
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 pt-6 pb-8 text-center relative overflow-hidden">
          {/* Floating cloud decorations */}
          <span className="absolute top-2 left-3 text-3xl opacity-40 animate-bounce" style={{ animationDelay: '0s' }}>☁️</span>
          <span className="absolute top-4 right-5 text-2xl opacity-30 animate-bounce" style={{ animationDelay: '0.4s' }}>⛅</span>
          <span className="absolute bottom-2 left-8 text-xl opacity-25 animate-bounce" style={{ animationDelay: '0.8s' }}>🌤️</span>
          <div className="text-5xl mb-2">🌤️</div>
          <h2 className="text-2xl font-black text-white drop-shadow">You&apos;re a natural!</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sky-700 font-bold text-base text-center leading-relaxed">
            Create a free account to keep spotting clouds and save your collection!
          </p>

          {/* Perks */}
          <div className="space-y-2">
            {[
              { emoji: '☁️', text: 'Unlimited cloud scans' },
              { emoji: '🏅', text: 'Save your badges & collection' },
              { emoji: '🔥', text: 'Track your spotting streak' },
            ].map(perk => (
              <div key={perk.text} className="flex items-center gap-3 bg-sky-50 rounded-2xl px-4 py-2">
                <span className="text-xl">{perk.emoji}</span>
                <p className="text-sky-700 font-semibold text-sm">{perk.text}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <a
              href="/signup"
              className="block w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-lg text-center shadow-lg transition-all"
            >
              ✨ Sign Up Free
            </a>
            <button
              onClick={handleMaybeLater}
              className="w-full py-3 rounded-2xl text-sky-500 font-bold text-sm hover:bg-sky-50 active:scale-95 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
