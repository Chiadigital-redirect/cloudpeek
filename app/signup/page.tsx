import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="text-6xl">🌤️</div>
        <h1 className="text-3xl font-black text-sky-700">
          Cloud<span className="text-blue-500">Peek</span>
        </h1>
        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-xl border-2 border-sky-200 space-y-3">
          <h2 className="font-black text-sky-700 text-xl">Sign Up Coming Soon!</h2>
          <p className="text-sky-600 font-semibold text-sm leading-relaxed">
            Accounts are on the way! We&apos;re setting up cloud storage (pun intended 😄)
            so you can save your collection across devices.
          </p>
          <div className="space-y-2 pt-2">
            {[
              { emoji: '☁️', text: 'Unlimited scans' },
              { emoji: '🏅', text: 'Persistent badges & collection' },
              { emoji: '🔥', text: 'Cross-device streak tracking' },
              { emoji: '🌍', text: 'Community leaderboard' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 bg-sky-50 rounded-2xl px-4 py-2 text-left">
                <span className="text-lg">{f.emoji}</span>
                <p className="text-sky-700 font-semibold text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/"
          className="block w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-lg shadow-lg text-center"
        >
          ← Back to CloudPeek
        </Link>
      </div>
    </div>
  );
}
