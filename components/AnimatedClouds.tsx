'use client';
// Decorative floating clouds + sun in the background

const CLOUDS = [
  { size: 90,  top: '8%',  duration: 35, delay: 0,    opacity: 0.7, dir: 'left'  },
  { size: 60,  top: '18%', duration: 50, delay: 8,    opacity: 0.5, dir: 'right' },
  { size: 120, top: '5%',  duration: 60, delay: 20,   opacity: 0.4, dir: 'left'  },
  { size: 50,  top: '30%', duration: 42, delay: 5,    opacity: 0.35, dir: 'left' },
  { size: 80,  top: '70%', duration: 55, delay: 15,   opacity: 0.3, dir: 'right' },
  { size: 40,  top: '80%', duration: 38, delay: 3,    opacity: 0.25, dir: 'left' },
];

function CloudSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ opacity }} aria-hidden>
      <ellipse cx="50" cy="45" rx="45" ry="18" fill="white" />
      <ellipse cx="35" cy="35" rx="25" ry="20" fill="white" />
      <ellipse cx="60" cy="32" rx="28" ry="22" fill="white" />
      <ellipse cx="50" cy="30" rx="20" ry="18" fill="white" />
    </svg>
  );
}

function SunSVG() {
  return (
    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 pointer-events-none select-none" aria-hidden>
      {/* Rays */}
      <div className="absolute inset-0 sun-spin">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-yellow-300/60 rounded-full origin-bottom"
            style={{
              left: '50%',
              top: 0,
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              transformOrigin: '50% 64px',
            }}
          />
        ))}
      </div>
      {/* Body */}
      <div className="absolute inset-8 rounded-full bg-yellow-300/80 shadow-lg shadow-yellow-200" />
    </div>
  );
}

export default function AnimatedClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <SunSVG />
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className={c.dir === 'left' ? 'cloud-float-left' : 'cloud-float-right'}
          style={{
            position: 'absolute',
            top: c.top,
            animationDuration: `${c.duration}s`,
            animationDelay: `${-c.delay}s`,
            // start mid-screen so there's no empty gap at load
            transform: c.dir === 'left' ? `translateX(${110 - (c.delay / c.duration) * 140}vw)` : `translateX(${(c.delay / c.duration) * 140 - 30}vw)`,
          }}
        >
          <CloudSVG size={c.size} opacity={c.opacity} />
        </div>
      ))}
    </div>
  );
}
