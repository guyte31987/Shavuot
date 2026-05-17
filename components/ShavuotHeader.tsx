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
  const fieldRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.replaceChildren(); // idempotent (StrictMode re-runs)

    const SVG_NS = "http://www.w3.org/2000/svg";
    const ROWS = [
      { count: 28, yJitter: [262, 282], scale: [0.5, 0.65], opacity: 0.6,  duration: 5.2, cls: "r-back" },
      { count: 22, yJitter: [296, 314], scale: [0.75, 0.95], opacity: 0.92, duration: 5.6, cls: "r-mid"  },
      { count: 18, yJitter: [328, 344], scale: [1.0, 1.25], opacity: 1.0,  duration: 6.0, cls: "r-front"},
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
      field.appendChild(rowG);
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
        <g ref={fieldRef as any} />
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
    font-size: clamp(56px, 17vw, 100px);
    letter-spacing: -0.01em;
    text-shadow:
      0 2px 0 rgba(80, 50, 10, 0.2),
      0 8px 24px rgba(80, 50, 10, 0.28),
      0 0 1px rgba(255,255,255,0.5);
    -webkit-text-stroke: 1px rgba(168, 115, 26, 0.28);
  }
  .shavuot-header .sh-title .strap {
    font-family: "DM Mono", monospace;
    font-weight: 500;
    font-size: clamp(10px, 2.6vw, 13px);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    margin-top: 12px;
    text-shadow: 0 1px 0 rgba(80,50,10,0.22);
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
`;
