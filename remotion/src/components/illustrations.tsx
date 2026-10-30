// Everything illustrated is SVG drawn here (brief, "Assets and licenses"): faceless pictogram people, the farmhouse
// photo card, the cobweb, the peace sign that becomes a power button, fireflies, the map card.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import maps from "../data/maps.json";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";

// A faceless pictogram figure holding a hand-lettered sign. `flip` (0..1) turns the sign to show its back.
export const Protester: React.FC<{ x: number; y: number; scale?: number; sign: string; back?: string; flip?: number; gray?: boolean; seed: string }> = ({
  x, y, scale = 1, sign, back = "", flip = 0, gray = false, seed,
}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 9 + random(seed) * 6) * 3;
  const body = ["#c96b4a", "#5f7f5a", "#b8963e", "#7a5c8f", "#4f6f8f"][Math.floor(random(seed + "c") * 5)];
  const showBack = flip > 0.5;
  const squash = Math.abs(Math.cos(flip * Math.PI));
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      <rect x={-22} y={-10} width={44} height={70} rx={20} fill={body} />
      <circle cx={0} cy={-34} r={20} fill="#e2c9a6" />
      {gray ? <path d="M -20 -38 Q 0 -66 20 -38 Q 18 -50 0 -54 Q -18 -50 -20 -38 Z" fill="#cfcfcf" />
        : <path d="M -20 -38 Q 0 -62 20 -38 Q 14 -50 0 -52 Q -14 -50 -20 -38 Z" fill="#5a3b28" />}
      <line x1={-14} y1={0} x2={-10} y2={-78} stroke="#e2c9a6" strokeWidth={8} strokeLinecap="round" />
      <line x1={14} y1={0} x2={10} y2={-78} stroke="#e2c9a6" strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={-70} x2={0} y2={-150} stroke="#8a6a48" strokeWidth={5} />
      <g transform={`translate(0 -150) scale(${squash} 1)`}>
        <rect x={-74} y={-50} width={148} height={62} rx={4} fill={showBack ? "#f1e6cf" : "#fbf4e2"} stroke="#3a2a1a" strokeWidth={2} />
        <text x={0} y={-8} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={showBack ? 22 : 26} fill="#2a1d12"
          transform={`rotate(${(random(seed + "r") - 0.5) * 6})`}>{showBack ? back : sign}</text>
      </g>
    </g>
  );
};

// The farmhouse in granddad.jpg: a small illustrated "photo" (house, barn, field rows, sky), not a real photo.
// granddad.jpg: an old family snapshot of the farm, faded warm, with grain and a vignette. A white farmhouse with a
// porch, a red gambrel barn and silo, a windmill, a tree with a tire swing, a fence line, and corn running to the
// horizon. Generic: no real place, no people.
const CORN_ROWS = Array.from({ length: 8 }, (_, r) => r);
export const Farmhouse: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={width * 0.68} viewBox="0 0 300 204">
    <defs>
      <linearGradient id="fh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9cbd9" /><stop offset="1" stopColor="#e6ecd8" /></linearGradient>
      <linearGradient id="fh-field" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8e9a4f" /><stop offset="1" stopColor="#5f6a2c" /></linearGradient>
      <radialGradient id="fh-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#2a1a08" stopOpacity="0.55" /></radialGradient>
      <filter id="fh-grain" x="0" y="0" width="1" height="1">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0.35 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    {/* sky, sun and clouds */}
    <rect width={300} height={204} fill="url(#fh-sky)" />
    <circle cx={248} cy={34} r={14} fill="#f8ecc0" />
    {[[60, 30, 1], [150, 22, 0.8], [210, 50, 0.6]].map(([x, y, k], i) => (
      <g key={i} fill="#fbf8ef" opacity={0.85}>
        <ellipse cx={x} cy={y} rx={22 * k} ry={6 * k} /><ellipse cx={x - 10 * k} cy={y - 4 * k} rx={10 * k} ry={7 * k} /><ellipse cx={x + 8 * k} cy={y - 5 * k} rx={12 * k} ry={8 * k} />
      </g>
    ))}
    {/* far tree line and hills */}
    <path d="M 0 112 Q 40 100 80 108 T 160 104 T 240 106 T 300 102 L 300 124 L 0 124 Z" fill="#8fa37a" />
    {Array.from({ length: 26 }, (_, k) => <circle key={k} cx={k * 12 + 4} cy={108 + ((k * 37) % 7) - 2} r={5 + ((k * 13) % 4)} fill="#6f8a5c" />)}
    {/* field */}
    <rect y={118} width={300} height={86} fill="url(#fh-field)" />
    {/* windmill */}
    <g stroke="#6d6a62" strokeWidth={1.2}>
      <path d="M 268 120 L 274 70 L 280 120 M 270 104 L 278 104 M 271 88 L 277 88" fill="none" />
      {Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * Math.PI * 2; return <line key={k} x1={274} y1={68} x2={274 + 11 * Math.cos(a)} y2={68 + 11 * Math.sin(a)} />; })}
      <path d="M 274 68 L 290 66 L 290 72 Z" fill="#8a877e" />
    </g>
    {/* barn and silo */}
    <rect x={232} y={58} width={22} height={66} fill="#c9c3b4" /><path d="M 232 58 Q 243 44 254 58 Z" fill="#8f8a80" />
    {[70, 82, 94, 106].map((y) => <line key={y} x1={232} y1={y} x2={254} y2={y} stroke="#a9a397" strokeWidth={0.8} />)}
    <path d="M 160 124 L 160 82 L 170 64 L 196 54 L 222 64 L 232 82 L 232 124 Z" fill="#a33f2f" />
    <path d="M 157 83 L 169 63 L 196 52 L 223 63 L 235 83" fill="none" stroke="#5e2219" strokeWidth={3} />
    {Array.from({ length: 13 }, (_, k) => <line key={k} x1={163 + k * 5.5} y1={84} x2={163 + k * 5.5} y2={124} stroke="#8a3326" strokeWidth={0.7} />)}
    <rect x={186} y={64} width={20} height={14} fill="#f1e6cf" /><rect x={188} y={66} width={16} height={10} fill="#5c2a20" />
    <rect x={180} y={96} width={32} height={28} fill="#f1e6cf" />
    <rect x={182} y={98} width={28} height={26} fill="#a33f2f" />
    <path d="M 182 98 L 210 124 M 210 98 L 182 124" stroke="#f1e6cf" strokeWidth={2} />
    {/* tree with a tire swing */}
    <rect x={132} y={84} width={5} height={40} fill="#5b4330" />
    <path d="M 137 96 L 148 90" stroke="#5b4330" strokeWidth={2.5} />
    {[[134, 76, 16], [122, 84, 11], [146, 82, 12], [134, 64, 12]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#4f6b3a" : "#5d7a44"} />)}
    <line x1={146} y1={91} x2={146} y2={110} stroke="#3a2f25" strokeWidth={0.8} />
    <ellipse cx={146} cy={113} rx={3.5} ry={4.5} fill="none" stroke="#2b2622" strokeWidth={2.2} />
    {/* farmhouse: siding, porch, gable window, chimney */}
    <rect x={98} y={56} width={7} height={16} fill="#8b4a3a" />
    <rect x={40} y={80} width={80} height={46} fill="#f2ece0" />
    {Array.from({ length: 9 }, (_, k) => <line key={k} x1={40} y1={84 + k * 5} x2={120} y2={84 + k * 5} stroke="#d8cfbd" strokeWidth={0.6} />)}
    <path d="M 34 82 L 80 50 L 126 82 Z" fill="#5a4a44" />
    <path d="M 54 82 L 80 64 L 106 82 Z" fill="#f2ece0" />
    <rect x={74} y={68} width={12} height={10} fill="#9fc4d6" stroke="#fff" strokeWidth={1.5} />
    {[48, 66, 98].map((x) => <g key={x}><rect x={x} y={88} width={12} height={14} fill="#9fc4d6" stroke="#fff" strokeWidth={1.5} /><line x1={x + 6} y1={88} x2={x + 6} y2={102} stroke="#fff" strokeWidth={1} /></g>)}
    <path d="M 36 106 L 124 106 L 120 100 L 40 100 Z" fill="#6c5a50" />
    {[42, 58, 74, 102, 118].map((x) => <rect key={x} x={x} y={106} width={2} height={20} fill="#fff" />)}
    <rect x={84} y={108} width={12} height={18} fill="#6b4b33" />
    <rect x={36} y={124} width={88} height={3} fill="#cfc6b4" />
    {/* fence and mailbox */}
    <path d="M 0 136 L 128 132 M 0 142 L 128 138" stroke="#d8cfbd" strokeWidth={1.2} />
    {Array.from({ length: 9 }, (_, k) => <rect key={k} x={2 + k * 15.5} y={130 - k * 0.5} width={2.5} height={16} fill="#cbbfa8" />)}
    <rect x={20} y={120} width={2} height={18} fill="#5b4330" /><rect x={14} y={114} width={14} height={8} rx={3} fill="#9aa1a6" />
    {/* corn rows from the foreground to the horizon */}
    {CORN_ROWS.map((r) => {
      const y = 204 - r * r * 0.62 - r * 1.5, sc = 1 - r * 0.075, n = 9 + r * 3;
      return (
        <g key={r} opacity={0.6 + 0.4 * sc}>
          {Array.from({ length: n }, (_, k) => {
            const x = 128 + (k / (n - 1) - 0.5) * (360 * sc + 40) + ((r * 7 + k * 3) % 5);
            const h = 26 * sc;
            return <g key={k} stroke={k % 3 ? "#5f7a2e" : "#6f8b36"} strokeWidth={1.6 * sc} fill="none" strokeLinecap="round">
              <path d={`M ${x} ${y} L ${x} ${y - h}`} />
              <path d={`M ${x} ${y - h * 0.45} q ${-7 * sc} ${-4 * sc} ${-10 * sc} ${2 * sc} M ${x} ${y - h * 0.65} q ${7 * sc} ${-4 * sc} ${10 * sc} ${2 * sc}`} />
              {(k + r) % 4 === 0 && <ellipse cx={x + 1.5 * sc} cy={y - h * 0.55} rx={1.4 * sc} ry={3.5 * sc} fill="#d9b44a" stroke="none" />}
            </g>;
          })}
        </g>
      );
    })}
    {/* the print: warm fade, grain, vignette, a light leak and a crease */}
    <rect width={300} height={204} fill="#f3d8a0" opacity={0.2} />
    <rect width={300} height={204} filter="url(#fh-grain)" opacity={0.5} />
    <rect width={300} height={204} fill="url(#fh-vig)" />
    <rect x={250} width={50} height={204} fill="#ff9a50" opacity={0.08} />
    <path d="M 0 150 Q 120 140 300 160" stroke="#fffaf0" strokeWidth={0.8} opacity={0.35} fill="none" />
  </svg>
);

export const Cobweb: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, right: 0 }}>
    {[0, 22, 45, 68, 90].map((a) => {
      const r = (a * Math.PI) / 180;
      return <line key={a} x1={100} y1={0} x2={100 - 100 * Math.cos(r)} y2={100 * Math.sin(r)} stroke="#ffffff55" strokeWidth={1} />;
    })}
    {[25, 45, 65, 85].map((d) => (
      <path key={d} d={[0, 22, 45, 68, 90].map((a, k) => {
        const r = (a * Math.PI) / 180;
        return `${k ? "Q" + (100 - d * 0.8 * Math.cos(r - 0.2)) + " " + d * 0.8 * Math.sin(r - 0.2) + " " : "M"}${100 - d * Math.cos(r)} ${d * Math.sin(r)}`;
      }).join(" ")} fill="none" stroke="#ffffff44" strokeWidth={1} />
    ))}
  </svg>
);

// A generic peace symbol (circle, vertical stroke, two diagonals) that morphs into a power symbol as `morph` goes 0 → 1:
// the circle opens at the top and the diagonals fold up into the vertical stroke.
export const PeaceToPower: React.FC<{ size: number; morph: number; color: string }> = ({ size, morph, color }) => {
  const gap = 1 + morph * 69; // degrees of the circle's opening at the top (never 0: an arc with equal ends draws nothing)
  const a0 = ((-90 + gap / 2) * Math.PI) / 180, a1 = ((270 - gap / 2) * Math.PI) / 180;
  const arc = `M ${50 + 40 * Math.cos(a0)} ${50 + 40 * Math.sin(a0)} A 40 40 0 1 1 ${50 + 40 * Math.cos(a1)} ${50 + 40 * Math.sin(a1)}`;
  const fold = 45 * (1 - morph);
  const leg = (s: number) => {
    const r = ((90 + s * fold) * Math.PI) / 180;
    return `M 50 ${50 + 0 * morph} L ${50 + 40 * Math.cos(r) * (1 - morph)} ${50 + 40 * Math.sin(r) * (1 - morph)}`;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d={arc} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
      <line x1={50} y1={10 + morph * 0} x2={50} y2={90 - morph * 40} stroke={color} strokeWidth={9} strokeLinecap="round" />
      {morph < 1 && <path d={`${leg(1)} ${leg(-1)}`} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none" />}
    </svg>
  );
};

// Fireflies: small glowing dots blinking at the status-dot rate (there is no firefly emoji, so they are drawn).
export const Fireflies: React.FC<{ n: number; w: number; h: number; opacity?: number }> = ({ n, w, h, opacity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {Array.from({ length: n }, (_, k) => {
        const on = Math.sin(f / 7 + random(`dot${k}`) * 20) > 0;
        const x = random(`ffx${k}`) * w + 12 * Math.sin(f / 40 + k), y = random(`ffy${k}`) * h + 8 * Math.cos(f / 33 + k);
        return <circle key={k} cx={x} cy={y} r={5} fill="#f8f08a" opacity={on ? 1 : 0.15} style={{ filter: "drop-shadow(0 0 8px #f8f08a)" }} />;
      })}
    </svg>
  );
};

// The map card: Natural Earth state outlines. `view` is [x, y, w, h] in map units (interpolate it to zoom and pan;
// the same instance pans from Iowa to Memphis). `hi` names the highlighted state; pins drop with `pin` (0..1).
export const MapView: React.FC<{ view: number[]; width: number; height: number; hi?: string; pins?: { name: string; drop: number }[] }> = ({
  view, width, height, hi, pins = [],
}) => {
  const t = useTheme();
  const k = view[2] / width; // map units per pixel, so strokes and pins stay the same size on screen
  return (
    <svg width={width} height={height} viewBox={view.join(" ")}>
      {Object.entries(maps.states).map(([name, d]) => (
        <path key={name} d={d} fill={name === hi ? alpha(t.c.accentA, 0.28) : "#ffffff0d"} stroke={name === hi ? t.c.accentA : "#ffffff40"}
          strokeWidth={(name === hi ? 2.2 : 1) * k} />
      ))}
      {pins.map(({ name, drop }) => {
        const [x, y] = (maps.pins as Record<string, number[]>)[name];
        if (drop <= 0) return null;
        const lift = (1 - drop) * 60 * k;
        return (
          <g key={name} transform={`translate(${x} ${y - lift})`} opacity={Math.min(1, drop * 2)}>
            <path d={`M 0 0 C ${-14 * k} ${-18 * k}, ${-14 * k} ${-38 * k}, 0 ${-38 * k} C ${14 * k} ${-38 * k}, ${14 * k} ${-18 * k}, 0 0 Z`} fill={t.c.accentB} />
            <circle cx={0} cy={-26 * k} r={5 * k} fill="#fff" />
            <text x={18 * k} y={-24 * k} fontFamily="Inter" fontWeight={600} fontSize={30 * k} fill={t.c.text}>{name.replace("Memphis, TN", "South Memphis, TN")}</text>
          </g>
        );
      })}
    </svg>
  );
};
export const MAP_BOX = maps.viewBox;
export const MAP_PINS = maps.pins as Record<string, number[]>;
