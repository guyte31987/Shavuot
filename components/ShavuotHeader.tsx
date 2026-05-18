"use client";
import { useEffect, useRef } from "react";

/**
 * ShavuotHeader — drop-in animated header.
 *
 * Usage:
 *   import { ShavuotHeader } from "@/components/ShavuotHeader";
 *   <ShavuotHeader title="Shavuot" strap="22 May · Hackney Wick · E9" />
 *
 * Requires:
 *   - "Cormorant Garamond" + "DM Mono" from Google Fonts (already loaded
 *     by app/layout.tsx in this project — if you move it elsewhere, add
 *     them to your <head>).
 *
 * Mobile-first. Default height 240px. Set `height` to override.
 */
export function ShavuotHeader({
  title = "Shavuot",
  strap = "22 May · Hackney Wick · E9",
  height = 240,
}: {
  title?: string;
  strap?: string;
  height?: number;
}) {
  const backMidRef = useRef<SVGGElement | null>(null);
  const frontRef   = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const backMid = backMidRef.current;
    const front   = frontRef.current;
    if (!backMid || !front) return;
    backMid.replaceChildren(); // idempotent (StrictMode re-runs)
    front.replaceChildren();

    const SVG_NS = "http://www.w3.org/2000/svg";
    const ROWS = [
      { count: 28, yJitter: [262, 282], scale: [0.5, 0.65], opacity: 0.6,  duration: 5.2, cls: "r-back",  target: backMid },
      { count: 22, yJitter: [296, 314], scale: [0.75, 0.95], opacity: 0.92, duration: 5.6, cls: "r-mid",   target: backMid },
      { count: 18, yJitter: [328, 344], scale: [1.0, 1.25], opacity: 1.0,  duration: 6.0, cls: "r-front", target: front   },
    ];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    ROWS.forEach((row) => {
      const rowG = document.createElementNS(SVG_NS, "g");
      rowG.setAttribute("class", "sh-row " + row.cls);
      rowG.setAttribute("opacity", String(row.opacity));
      const step = 1200 / row.count;

      for (let i = 0; i <= row.count; i++) {
        const x = -20 + i * step + rand(-step * 0.3, step * 0.3);
        const y = rand(row.yJitter[0], row.yJitter[1]);
        const s = rand(row.scale[0], row.scale[1]);
        const waveDelay = -(x / 1200) * row.duration * 0.85;
        const delay = (waveDelay + rand(-0.15, 0.15)).toFixed(2);
        const duration = (row.duration * rand(0.96, 1.04)).toFixed(2);

        const outer = document.createElementNS(SVG_NS, "g");
        outer.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`);

        const inner = document.createElementNS(SVG_NS, "g");
        inner.setAttribute("class", "sh-stalk");
        inner.style.animationDelay = delay + "s";
        inner.style.animationDuration = duration + "s";

        const use = document.createElementNS(SVG_NS, "use");
        use.setAttribute("href", "#sh-stalk-art");
        inner.appendChild(use);
        outer.appendChild(inner);
        rowG.appendChild(outer);
      }
      row.target.appendChild(rowG);
    });
  }, []);

  return (
    <header className="shavuot-header" style={{ height }}>
      <svg className="sh-svg" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <radialGradient id="sh-sun" cx="50%" cy="34%" r="55%">
            <stop offset="0%"  stopColor="#fff5d8" stopOpacity="0.85"/>
            <stop offset="45%" stopColor="#fff5d8" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#fff5d8" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="sh-grain" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#fadf90"/>
            <stop offset="55%"  stopColor="#e0a82a"/>
            <stop offset="100%" stopColor="#8a5a14"/>
          </linearGradient>

          <g id="sh-stalk-art">
            <path d="M0 30 C -2 70, 3 110, 0 158" fill="none" stroke="#8a5a14" strokeWidth="1.6" strokeLinecap="round"/>
            <ellipse cx="0" cy="14" rx="3.5" ry="9" fill="url(#sh-grain)" stroke="#8a5a14" strokeWidth="0.9"/>
            <line x1="0" y1="0" x2="0" y2="20" stroke="#8a5a14" strokeWidth="0.7" strokeLinecap="round"/>
            {[32, 46, 60, 74, 88].map((y, i) => {
              const rx = [6, 6.5, 7, 7, 6.5][i];
              const ry = [3.6, 3.8, 4, 4, 3.8][i];
              const dx = [-7, -8, -9, -9, -8][i];
              return (
                <g key={y}>
                  <ellipse cx={dx} cy={y} rx={rx} ry={ry} fill="url(#sh-grain)" stroke="#8a5a14" strokeWidth="0.9" transform={`rotate(-30 ${dx} ${y})`}/>
                  <ellipse cx={-dx} cy={y} rx={rx} ry={ry} fill="url(#sh-grain)" stroke="#8a5a14" strokeWidth="0.9" transform={`rotate(30 ${-dx} ${y})`}/>
                  <line x1="0" y1={y + 6} x2={dx - 5} y2={y - 10} stroke="#8a5a14" strokeWidth="0.7" strokeLinecap="round"/>
                  <line x1="0" y1={y + 6} x2={-dx + 5} y2={y - 10} stroke="#8a5a14" strokeWidth="0.7" strokeLinecap="round"/>
                </g>
              );
            })}
          </g>

          {/* Cat: a small tabby with green eyes, popping up from the wheat. */}
          <symbol id="sh-cat" viewBox="-50 -90 100 100" overflow="visible">
            <path d="M-30 -8 Q-32 -22 -22 -30 L22 -30 Q32 -22 30 -8 Z" fill="#9a7340"/>
            <g className="sh-cat-ear-l">
              <path d="M-26 -55 L-30 -82 L-12 -62 Z" fill="#8a6332" stroke="#3a2614" strokeWidth="0.8" strokeLinejoin="round"/>
              <path d="M-23 -60 L-25 -73 L-16 -63 Z" fill="#e8b890"/>
            </g>
            <g className="sh-cat-ear-r">
              <path d="M26 -55 L30 -82 L12 -62 Z" fill="#8a6332" stroke="#3a2614" strokeWidth="0.8" strokeLinejoin="round"/>
              <path d="M23 -60 L25 -73 L16 -63 Z" fill="#e8b890"/>
            </g>
            <ellipse cx="0" cy="-40" rx="30" ry="26" fill="#a87e4a" stroke="#3a2614" strokeWidth="0.9"/>
            <g stroke="#3a2614" strokeWidth="1.6" fill="none" strokeLinecap="round">
              <path d="M-10 -60 Q-8 -52 -5 -48"/>
              <path d="M-2 -60 Q-1 -52 1 -48"/>
              <path d="M10 -60 Q8 -52 5 -48"/>
              <path d="M-18 -54 Q-20 -48 -22 -44"/>
              <path d="M18 -54 Q20 -48 22 -44"/>
              <path d="M-22 -42 Q-26 -40 -28 -38"/>
              <path d="M22 -42 Q26 -40 28 -38"/>
            </g>
            <ellipse cx="-18" cy="-30" rx="10" ry="7" fill="#b88a52" opacity="0.6"/>
            <ellipse cx="18"  cy="-30" rx="10" ry="7" fill="#b88a52" opacity="0.6"/>
            <path d="M-13 -34 Q0 -22 13 -34 Q12 -22 0 -20 Q-12 -22 -13 -34 Z" fill="#f5e6d0"/>
            <ellipse cx="-12" cy="-44" rx="6.5" ry="7.5" fill="#f4ead0" stroke="#3a2614" strokeWidth="0.9"/>
            <ellipse cx="12"  cy="-44" rx="6.5" ry="7.5" fill="#f4ead0" stroke="#3a2614" strokeWidth="0.9"/>
            <ellipse cx="-12" cy="-44" rx="5.2" ry="6.8" fill="#7ac46a"/>
            <ellipse cx="12"  cy="-44" rx="5.2" ry="6.8" fill="#7ac46a"/>
            <ellipse cx="-12" cy="-44" rx="3.5" ry="5.6" fill="#3a6a2a"/>
            <ellipse cx="12"  cy="-44" rx="3.5" ry="5.6" fill="#3a6a2a"/>
            <ellipse cx="-12" cy="-44" rx="1.1" ry="5.4" fill="#1a1a1a"/>
            <ellipse cx="12"  cy="-44" rx="1.1" ry="5.4" fill="#1a1a1a"/>
            <circle cx="-13.5" cy="-46.5" r="1.4" fill="#ffffff"/>
            <circle cx="10.5"  cy="-46.5" r="1.4" fill="#ffffff"/>
            <path d="M-3 -30 L3 -30 L0 -26 Z" fill="#d68a8a" stroke="#3a2614" strokeWidth="0.7" strokeLinejoin="round"/>
            <path d="M0 -26 Q-3 -22 -6 -23" stroke="#3a2614" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <path d="M0 -26 Q3 -22 6 -23"   stroke="#3a2614" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
            <g stroke="#fbf3df" strokeWidth="0.9" strokeLinecap="round">
              <line x1="-10" y1="-26" x2="-32" y2="-30"/>
              <line x1="-10" y1="-24" x2="-32" y2="-22"/>
              <line x1="10"  y1="-26" x2="32"  y2="-30"/>
              <line x1="10"  y1="-24" x2="32"  y2="-22"/>
            </g>
            <rect className="sh-cat-eyelid" x="-18.5" y="-51.5" width="13" height="15" fill="#a87e4a"/>
            <rect className="sh-cat-eyelid" x="5.5"   y="-51.5" width="13" height="15" fill="#a87e4a"/>
          </symbol>

          <symbol id="sh-cloud" viewBox="0 0 200 80" overflow="visible">
            <g fill="#ffffff" opacity="0.95">
              <ellipse cx="44" cy="50" rx="28" ry="18"/>
              <ellipse cx="84" cy="36" rx="36" ry="24"/>
              <ellipse cx="120" cy="46" rx="30" ry="20"/>
              <ellipse cx="154" cy="52" rx="22" ry="14"/>
            </g>
          </symbol>
        </defs>

        <rect x="0" y="0" width="1200" height="360" fill="url(#sh-sun)"/>

        <g className="sh-cloud cl-a" style={{ animationDelay: "-10s" }}>
          <use href="#sh-cloud" x="-200" y="42" width="300" height="86"/>
        </g>
        <g className="sh-cloud cl-b" style={{ animationDelay: "-30s" }}>
          <use href="#sh-cloud" x="-200" y="18" width="340" height="96" opacity="0.85"/>
        </g>
        <g className="sh-cloud cl-c" style={{ animationDelay: "-50s" }}>
          <use href="#sh-cloud" x="-200" y="78" width="240" height="68" opacity="0.7"/>
        </g>

        <rect x="0" y="282" width="1200" height="80" fill="#dec488" opacity="0.55"/>

        {/* Back + mid wheat rows */}
        <g ref={backMidRef as any} />

        {/* Cats peeking up — sandwiched between mid and front wheat so
            the front stalks hide their bodies. */}
        <g className="sh-cat sh-cat-1" transform="translate(380 332)">
          <g className="sh-cat-pop"><use href="#sh-cat" width="100" height="100" x="-50" y="-90"/></g>
        </g>
        <g className="sh-cat sh-cat-2" transform="translate(600 336) scale(0.86)">
          <g className="sh-cat-pop"><use href="#sh-cat" width="100" height="100" x="-50" y="-90"/></g>
        </g>
        <g className="sh-cat sh-cat-3" transform="translate(820 330) scale(1.05)">
          <g className="sh-cat-pop"><use href="#sh-cat" width="100" height="100" x="-50" y="-90"/></g>
        </g>

        {/* Front wheat row — paints over the cats' lower halves */}
        <g ref={frontRef as any} />

        <rect x="0" y="344" width="1200" height="16" fill="#a8731a" opacity="0.22"/>
      </svg>

      {/* Butterflies */}
      <Butterfly cls="bf-1" body="#f4a8c8" outline="#7a3e9d" />
      <Butterfly cls="bf-2" body="#a8d8e8" outline="#3e6a8e" />
      <Butterfly cls="bf-3" body="#fadf90" outline="#a87618" />
      <Butterfly cls="bf-4" body="#f0b56a" outline="#a83a2a" />
      <Butterfly cls="bf-5" body="#c8e0a0" outline="#4a6526" />

      <div className="sh-title">
        <div className="word">{title}</div>
        {strap && <div className="strap">{strap}</div>}
      </div>

      <style>{CSS}</style>
    </header>
  );
}

function Butterfly({ cls, body, outline }: { cls: string; body: string; outline: string }) {
  return (
    <svg className={`sh-bf ${cls}`} viewBox="0 0 40 32" aria-hidden>
      <g className="wing">
        <path d="M20 16 C 8 4, 0 6, 4 16 C 0 26, 10 28, 20 16 Z" fill={body} stroke={outline} strokeWidth="0.8"/>
        <path d="M20 16 C 32 4, 40 6, 36 16 C 40 26, 30 28, 20 16 Z" fill={body} stroke={outline} strokeWidth="0.8"/>
        <circle cx="10" cy="13" r="1.2" fill={outline}/>
        <circle cx="30" cy="13" r="1.2" fill={outline}/>
      </g>
      <line x1="20" y1="6" x2="20" y2="24" stroke="#3a2614" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="20" y1="6" x2="17" y2="2" stroke="#3a2614" strokeWidth="1" strokeLinecap="round"/>
      <line x1="20" y1="6" x2="23" y2="2" stroke="#3a2614" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

const CSS = `
  .shavuot-header {
    position: relative;
    width: 100%;
    overflow: hidden;
    background:
      linear-gradient(180deg, #b9d8e8 0%, #d6e8ef 40%, #ecead0 78%, #f5e4b8 100%);
  }
  .shavuot-header .sh-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .shavuot-header .sh-title {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 0 24px;
    transform: translateY(-14%);
    pointer-events: none;
    z-index: 3;
  }
  .shavuot-header .sh-title .word {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 600; font-style: italic;
    color: #ffffff;
    line-height: 0.92;
    font-size: clamp(38px, 10vw, 68px);
    letter-spacing: -0.01em;
    text-shadow:
      0 2px 0 rgba(80, 50, 10, 0.2),
      0 8px 24px rgba(80, 50, 10, 0.28),
      0 0 1px rgba(255,255,255,0.5);
    -webkit-text-stroke: 1px rgba(168, 115, 26, 0.28);
    white-space: nowrap;
  }
  .shavuot-header .sh-title .strap {
    font-family: "DM Mono", monospace;
    font-weight: 600;
    font-size: clamp(14px, 3.4vw, 18px);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #ffffff;
    margin-top: 10px;
    padding: 6px 14px;
    background: rgba(122, 80, 20, 0.55);
    border-radius: 999px;
    text-shadow: 0 1px 0 rgba(80,50,10,0.35);
  }
  .shavuot-header .sh-stalk {
    transform-box: fill-box;
    transform-origin: 50% 95%;
    will-change: transform;
    animation-name: sh-sway;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  @keyframes sh-sway {
    0%   { transform: rotate(-2.5deg) translateX(0); }
    18%  { transform: rotate(0deg)    translateX(1px); }
    40%  { transform: rotate(4.5deg)  translateX(2px); }
    62%  { transform: rotate(2deg)    translateX(1px); }
    82%  { transform: rotate(-1deg)   translateX(0); }
    100% { transform: rotate(-2.5deg) translateX(0); }
  }
  .shavuot-header .sh-row { transform-origin: 0 100%; animation: sh-gust 7s ease-in-out infinite; }
  .shavuot-header .sh-row.r-mid   { animation-duration: 9s;  animation-delay: -2s; }
  .shavuot-header .sh-row.r-front { animation-duration: 11s; animation-delay: -1s; }
  @keyframes sh-gust {
    0%   { transform: translateX(0) skewX(0deg); }
    50%  { transform: translateX(8px) skewX(1deg); }
    100% { transform: translateX(0) skewX(0deg); }
  }
  .shavuot-header .sh-cloud { will-change: transform; }
  .shavuot-header .cl-a { animation: sh-drift-a 60s linear infinite; }
  .shavuot-header .cl-b { animation: sh-drift-b 80s linear infinite; }
  .shavuot-header .cl-c { animation: sh-drift-c 100s linear infinite; }
  @keyframes sh-drift-a { from { transform: translateX(-25%);} to { transform: translateX(125%);} }
  @keyframes sh-drift-b { from { transform: translateX(125%);} to { transform: translateX(-25%);} }
  @keyframes sh-drift-c { from { transform: translateX(-30%);} to { transform: translateX(130%);} }
  .shavuot-header .sh-bf {
    position: absolute; width: 28px; z-index: 2; will-change: transform;
  }
  .shavuot-header .sh-bf .wing { transform-origin: 50% 50%; animation: sh-flap 0.18s ease-in-out infinite alternate; }
  @keyframes sh-flap { from { transform: scaleX(1);} to { transform: scaleX(0.6);} }
  .shavuot-header .bf-1 { top: 22%; left: 16%; animation: sh-flit-1 13s ease-in-out infinite; }
  .shavuot-header .bf-2 { top: 16%; right: 18%; animation: sh-flit-2 17s ease-in-out infinite; width: 24px; }
  .shavuot-header .bf-3 { top: 44%; left: 6%;  animation: sh-flit-3 19s ease-in-out infinite; width: 22px; }
  .shavuot-header .bf-4 { top: 32%; right: 8%; animation: sh-flit-4 21s ease-in-out infinite; width: 26px; }
  .shavuot-header .bf-5 { top: 12%; left: 46%; animation: sh-flit-5 16s ease-in-out infinite; width: 20px; }
  @keyframes sh-flit-1 { 0%{transform:translate(0,0) rotate(-4deg)} 25%{transform:translate(40px,-20px) rotate(6deg)} 50%{transform:translate(90px,10px) rotate(-3deg)} 75%{transform:translate(30px,30px) rotate(4deg)} 100%{transform:translate(0,0) rotate(-4deg)} }
  @keyframes sh-flit-2 { 0%{transform:translate(0,0) rotate(3deg)} 33%{transform:translate(-50px,18px) rotate(-5deg)} 66%{transform:translate(-110px,-8px) rotate(4deg)} 100%{transform:translate(0,0) rotate(3deg)} }
  @keyframes sh-flit-3 { 0%{transform:translate(0,0) rotate(2deg)} 50%{transform:translate(80px,-50px) rotate(-5deg)} 100%{transform:translate(0,0) rotate(2deg)} }
  @keyframes sh-flit-4 { 0%{transform:translate(0,0) rotate(-2deg)} 50%{transform:translate(-70px,30px) rotate(4deg)} 100%{transform:translate(0,0) rotate(-2deg)} }
  @keyframes sh-flit-5 { 0%{transform:translate(0,0) rotate(4deg)} 50%{transform:translate(60px,40px) rotate(-4deg)} 100%{transform:translate(0,0) rotate(4deg)} }

  /* Cats peeking up from the wheat */
  .shavuot-header .sh-cat-pop {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: sh-cat-pop 13s cubic-bezier(.6,.05,.2,1) infinite;
    will-change: transform;
  }
  .shavuot-header .sh-cat-1 .sh-cat-pop { animation-delay: -0.5s; }
  .shavuot-header .sh-cat-2 .sh-cat-pop { animation-delay: -5.4s;  animation-duration: 15s; }
  .shavuot-header .sh-cat-3 .sh-cat-pop { animation-delay: -10.2s; animation-duration: 12s; }
  @keyframes sh-cat-pop {
    0%   { transform: translateY(82px) rotate(0deg); }
    4%   { transform: translateY(82px) rotate(0deg); }
    9%   { transform: translateY(-6px) rotate(-2deg); }
    12%  { transform: translateY(0)    rotate(0deg); }
    16%  { transform: translateY(0)    rotate(-7deg); }
    20%  { transform: translateY(0)    rotate(6deg); }
    24%  { transform: translateY(0)    rotate(-3deg); }
    26%  { transform: translateY(2px)  rotate(0deg); }
    32%  { transform: translateY(82px) rotate(0deg); }
    100% { transform: translateY(82px) rotate(0deg); }
  }
  .shavuot-header .sh-cat-ear-r { transform-box: fill-box; transform-origin: 50% 100%; animation: sh-cat-ear 4.7s ease-in-out infinite; }
  .shavuot-header .sh-cat-ear-l { transform-box: fill-box; transform-origin: 50% 100%; animation: sh-cat-ear 5.9s ease-in-out infinite -1.2s; }
  @keyframes sh-cat-ear {
    0%, 88%, 100% { transform: rotate(0); }
    91%           { transform: rotate(-14deg); }
    94%           { transform: rotate(0); }
  }
  .shavuot-header .sh-cat-eyelid {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    transform: scaleY(0);
    animation: sh-cat-blink 6.3s ease-in-out infinite;
  }
  .shavuot-header .sh-cat-2 .sh-cat-eyelid { animation-duration: 7.7s; animation-delay: -2.5s; }
  .shavuot-header .sh-cat-3 .sh-cat-eyelid { animation-duration: 5.4s; animation-delay: -4s; }
  @keyframes sh-cat-blink {
    0%, 92%, 100% { transform: scaleY(0); }
    95%           { transform: scaleY(1); }
    98%           { transform: scaleY(0); }
  }
`;
