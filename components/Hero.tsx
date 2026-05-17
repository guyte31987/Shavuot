export function Hero() {
  return (
    <header className="hero">
      <div className="hero-hebrew" aria-hidden>שָׁבוּעוֹת</div>
      <h1 className="wordart">
        <span data-text="Shavuot Dinner">Shavuot Dinner</span>
      </h1>
      <div className="hero-wheat" aria-hidden>
        <svg viewBox="0 0 220 40" width="220" height="40">
          <g fill="none" stroke="#c9a23a" strokeWidth="1.4" strokeLinecap="round">
            <line x1="110" y1="6" x2="110" y2="36" />
            {[...Array(6)].map((_, i) => {
              const y = 10 + i * 4;
              return (
                <g key={i}>
                  <path d={`M110 ${y} q -8 -4 -14 -2`} />
                  <path d={`M110 ${y} q  8 -4  14 -2`} />
                </g>
              );
            })}
          </g>
          <g stroke="#c9a23a" strokeWidth="1" opacity="0.6">
            <line x1="10" y1="22" x2="90" y2="22" />
            <line x1="130" y1="22" x2="210" y2="22" />
          </g>
          <g fill="#c9a23a" opacity="0.7">
            <circle cx="6" cy="22" r="2" />
            <circle cx="214" cy="22" r="2" />
          </g>
        </svg>
      </div>
      <p className="tagline">Friday · May 22 · 7:30 PM</p>
    </header>
  );
}
