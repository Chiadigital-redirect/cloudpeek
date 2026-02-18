'use client';

export default function LoadingCloud() {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="relative cloud-bob">
        {/* Cloud body */}
        <svg width="120" height="80" viewBox="0 0 120 80" aria-hidden>
          <ellipse cx="60" cy="60" rx="54" ry="22" fill="white" opacity="0.95" />
          <ellipse cx="42" cy="46" rx="30" ry="25" fill="white" opacity="0.95" />
          <ellipse cx="72" cy="40" rx="34" ry="28" fill="white" opacity="0.95" />
          <ellipse cx="60" cy="38" rx="24" ry="22" fill="white" opacity="0.95" />
        </svg>

        {/* Sparkles */}
        <span className="sparkle   absolute -top-3 left-4  text-yellow-400 text-xl">✨</span>
        <span className="sparkle-2 absolute -top-2 right-4 text-pink-400  text-lg">⭐</span>
        <span className="sparkle-3 absolute top-1  left-1/2 text-sky-400  text-sm">💫</span>

        {/* Rain drops */}
        {[30, 50, 70, 90].map((x, i) => (
          <div
            key={i}
            className="rain-drop absolute bottom-0 w-1 h-3 rounded-full bg-sky-400"
            style={{ left: x, animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>

      <div className="text-center space-y-1">
        <p className="text-2xl font-black text-sky-700 tracking-wide">Peeking at your cloud…</p>
        <p className="text-sky-500 font-semibold text-sm">The AI meteorologist is thinking ☁️</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-sky-400"
            style={{ animation: `cloudBob 1s ${i * 0.2}s ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
