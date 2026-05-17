export function Hero() {
  return (
    <header className="hero">
      <div className="hero-scene">
        <svg
          viewBox="0 0 900 420"
          preserveAspectRatio="xMidYMid slice"
          className="hero-svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#a7d8f5" />
              <stop offset="55%" stopColor="#d4ecf9" />
              <stop offset="100%" stopColor="#fef7e0" />
            </linearGradient>
            <linearGradient id="hill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f6c64a" />
              <stop offset="100%" stopColor="#d4942b" />
            </linearGradient>
            <linearGradient id="sun" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="100%" stopColor="#f4b740" />
            </linearGradient>
            <g id="wheat-stalk">
              <line x1="0" y1="-10" x2="0" y2="-110" stroke="#a96a14" strokeWidth="2" strokeLinecap="round" />
              {[...Array(7)].map((_, i) => {
                const y = -22 - i * 12;
                return (
                  <g key={i} fill="#f0b13a" stroke="#8a5a14" strokeWidth="1">
                    <ellipse cx="-7" cy={y} rx="7" ry="4" transform={`rotate(-30 -7 ${y})`} />
                    <ellipse cx="7" cy={y} rx="7" ry="4" transform={`rotate(30 7 ${y})`} />
                  </g>
                );
              })}
              <g stroke="#8a5a14" strokeWidth="1" strokeLinecap="round">
                {[...Array(6)].map((_, i) => {
                  const y = -28 - i * 12;
                  return (
                    <g key={i}>
                      <line x1="0" y1={y} x2="-14" y2={y - 12} />
                      <line x1="0" y1={y} x2="14" y2={y - 12} />
                    </g>
                  );
                })}
              </g>
            </g>
            <symbol id="cloud" viewBox="0 0 120 50">
              <g fill="#ffffff" stroke="#cfe7f5" strokeWidth="1.5">
                <ellipse cx="30" cy="32" rx="22" ry="14" />
                <ellipse cx="55" cy="24" rx="26" ry="18" />
                <ellipse cx="85" cy="32" rx="22" ry="14" />
              </g>
            </symbol>
          </defs>

          <rect width="900" height="420" fill="url(#sky)" />

          {/* Sun */}
          <circle cx="730" cy="120" r="46" fill="url(#sun)" opacity="0.95" />
          <circle cx="730" cy="120" r="58" fill="#fff3b0" opacity="0.25" />

          {/* Clouds */}
          <use href="#cloud" x="60" y="60" width="160" height="60" />
          <use href="#cloud" x="320" y="40" width="190" height="70" />
          <use href="#cloud" x="560" y="80" width="150" height="55" />
          <use href="#cloud" x="120" y="180" width="120" height="44" opacity="0.85" />

          {/* Distant hills */}
          <path d="M0 320 Q 220 250 450 300 T 900 290 L 900 420 L 0 420 Z" fill="#9fc97d" opacity="0.55" />
          <path d="M0 350 Q 250 290 500 330 T 900 340 L 900 420 L 0 420 Z" fill="url(#hill)" />

          {/* Foreground wheat field — back row */}
          {[40, 130, 220, 310, 400, 490, 580, 670, 760, 850].map((x, i) => (
            <g key={`b${i}`} transform={`translate(${x} 390) scale(0.7) rotate(${(i % 2 ? -4 : 4)})`}>
              <use href="#wheat-stalk" />
            </g>
          ))}
          {/* Foreground wheat field — front row, taller */}
          {[0, 80, 170, 260, 350, 440, 530, 620, 710, 800, 880].map((x, i) => (
            <g key={`f${i}`} transform={`translate(${x} 420) scale(${0.95 + (i % 3) * 0.1}) rotate(${(i % 2 ? -6 : 6)})`}>
              <use href="#wheat-stalk" />
            </g>
          ))}
        </svg>

        <div className="hero-text">
          <div className="hero-banner">
            <svg viewBox="0 0 520 110" className="banner-svg" aria-hidden>
              <defs>
                <linearGradient id="ribbon" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#fff6df" />
                </linearGradient>
              </defs>
              {/* Tails */}
              <polygon points="10,40 40,30 40,80 10,70" fill="#e7c97a" />
              <polygon points="510,40 480,30 480,80 510,70" fill="#e7c97a" />
              <polygon points="0,55 40,40 40,70 0,55" fill="#c79c3c" />
              <polygon points="520,55 480,40 480,70 520,55" fill="#c79c3c" />
              {/* Main */}
              <path
                d="M 30 18 Q 260 0 490 18 L 490 92 Q 260 110 30 92 Z"
                fill="url(#ribbon)"
                stroke="#1a1a1a"
                strokeWidth="2"
              />
            </svg>
            <div className="banner-text">
              <span className="banner-heb">חג שבועות שמח</span>
            </div>
          </div>

          <h1 className="wordart">
            <span data-text="Shavuot Dinner">Shavuot Dinner</span>
          </h1>
        </div>
      </div>

      <p className="tagline">Friday · May 22 · 7:30 PM</p>
    </header>
  );
}
