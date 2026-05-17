type Props = { size?: number; className?: string };

const stroke = "#1a1a1a";

export function Sunflower({ size = 48, className }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = 50 + Math.cos(a) * 26;
          const y = 50 + Math.sin(a) * 26;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="10"
              ry="6"
              fill="#f5c542"
              transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="14" fill="#6b3a14" />
        <circle cx="50" cy="50" r="14" fill="url(#sf-dots)" opacity="0.6" />
      </g>
      <defs>
        <pattern id="sf-dots" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#3a1f0a" />
        </pattern>
      </defs>
    </svg>
  );
}

export function CheeseWedge({ size = 48, className }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <path d="M10 70 L90 70 L70 35 Z" fill="#f5d76e" />
        <path d="M10 70 L90 70 L90 78 L10 78 Z" fill="#e0b94c" />
        <circle cx="40" cy="60" r="4" fill="#fff8d6" />
        <circle cx="58" cy="55" r="3" fill="#fff8d6" />
        <circle cx="68" cy="62" r="3.5" fill="#fff8d6" />
      </g>
    </svg>
  );
}

export function MilkJug({ size = 48, className }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <path d="M35 32 L35 28 Q35 24 40 24 L60 24 Q65 24 65 28 L65 32 Q72 36 72 50 L72 82 Q72 88 66 88 L34 88 Q28 88 28 82 L28 50 Q28 36 35 32 Z" fill="#ffffff" />
        <rect x="38" y="40" width="24" height="20" rx="2" fill="#a7d8f5" />
        <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2c6e49" stroke="none">חלב</text>
      </g>
    </svg>
  );
}

export function Pomegranate({ size = 48, className }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <circle cx="50" cy="58" r="30" fill="#b03a48" />
        <path d="M50 28 Q52 18 60 14 Q56 22 56 28" fill="#2c6e49" />
        <path d="M50 28 Q48 18 40 14 Q44 22 44 28" fill="#2c6e49" />
        <path d="M44 28 L48 22 L52 22 L56 28 L52 32 L48 32 Z" fill="#7a2530" />
        <g fill="#f5c542" stroke="none">
          <circle cx="42" cy="55" r="2" />
          <circle cx="50" cy="50" r="2" />
          <circle cx="58" cy="55" r="2" />
          <circle cx="46" cy="65" r="2" />
          <circle cx="54" cy="65" r="2" />
          <circle cx="50" cy="72" r="2" />
        </g>
      </g>
    </svg>
  );
}

export function Cow({ size = 56, className }: Props) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={size} className={className} aria-hidden>
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <ellipse cx="60" cy="60" rx="40" ry="22" fill="#ffffff" />
        <ellipse cx="92" cy="42" rx="18" ry="16" fill="#ffffff" />
        <circle cx="88" cy="38" r="2" fill="#1a1a1a" stroke="none" />
        <ellipse cx="100" cy="50" rx="4" ry="3" fill="#ffc0cb" />
        <path d="M78 28 Q82 22 86 28" fill="none" />
        <path d="M100 28 Q104 22 108 28" fill="none" />
        <line x1="44" y1="80" x2="44" y2="92" />
        <line x1="56" y1="80" x2="56" y2="92" />
        <line x1="68" y1="80" x2="68" y2="92" />
        <line x1="80" y1="80" x2="80" y2="92" />
        <g fill="#1a1a1a" stroke="none">
          <ellipse cx="45" cy="55" rx="6" ry="4" />
          <ellipse cx="70" cy="65" rx="8" ry="5" />
          <ellipse cx="55" cy="70" rx="5" ry="3" />
        </g>
      </g>
    </svg>
  );
}
