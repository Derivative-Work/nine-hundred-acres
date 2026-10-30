// Everything illustrated is SVG drawn here (brief, "Assets and licenses"): faceless pictogram people and the rally
// ground, the farmhouse photo card, the cobweb, the peace sign that becomes a power button, fireflies, the map card.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import maps from "../data/maps.json";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";

// A faceless flat pictogram figure (brief: people are faceless pictograms) holding a hand-lettered sign. 1970s
// detail lives in the silhouette: hair (long, afro, short with beard, headband, cap), an open jacket, a fringed vest or a
// striped knit, flared jeans or cords. `flip` (0..1) turns the sign to show its back; `gray` grays the hair.
const SKIN = ["#e8c9a4", "#c99a72", "#8d5a3b", "#f0d2b6", "#b07a52"];
const HAIR = ["#3b2617", "#6b4423", "#1f1a17", "#a8672f", "#4a3020"];
const GRAY_HAIR = ["#d6d3cc", "#bdbab3", "#e6e3dc"];
const SHIRT = ["#c96b4a", "#5f7f5a", "#b8963e", "#7a5c8f", "#4f6f8f", "#a34a3f", "#d9c9a3"];
const pick = <T,>(xs: T[], v: number) => xs[Math.floor(v * xs.length)];
export const Protester: React.FC<{ x: number; y: number; scale?: number; sign: string; back?: string; flip?: number; gray?: boolean; seed: string }> = ({
  x, y, scale = 1, sign, back = "", flip = 0, gray = false, seed,
}) => {
  const f = useCurrentFrame();
  const r = (k: string) => random(seed + k);
  const bob = Math.sin(f / 9 + r("") * 6) * 3;
  const skin = pick(SKIN, r("s")), hair = gray ? pick(GRAY_HAIR, r("h")) : pick(HAIR, r("h")), shirt = pick(SHIRT, r("c"));
  const style = Math.floor(r("st") * 5); // 0 long, 1 afro, 2 short + beard, 3 long + headband, 4 cap
  const top = Math.floor(r("t") * 3); // 0 open jacket over a tee, 1 fringed vest, 2 striped knit
  const jacket = pick(["#6b4a2f", "#4d5f7a", "#7d6a3a"], r("j"));
  const pants = pick(["#46607e", "#3d5470", "#7a5a3a"], r("p"));
  const sleeve = top === 0 ? jacket : shirt;
  const showBack = flip > 0.5;
  const squash = Math.abs(Math.cos(flip * Math.PI));
  const tilt = (r("r") - 0.5) * 8;
  const longHair = style === 0 || style === 3;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      {/* flared legs */}
      <path d="M -22 54 L -3 54 L -6 100 L -1 150 L -28 150 L -19 100 Z" fill={pants} />
      <path d="M 22 54 L 3 54 L 6 100 L 1 150 L 28 150 L 19 100 Z" fill={pants} />
      <path d="M -12 60 L -13 148 M 12 60 L 13 148" stroke="#00000022" strokeWidth={1.5} />
      {/* hair behind the head */}
      {longHair && <path d="M -20 -38 Q -25 -4 -17 8 L 17 8 Q 25 -4 20 -38 Z" fill={hair} />}
      {style === 1 && <circle cx={0} cy={-40} r={28} fill={hair} />}
      {/* torso */}
      <path d="M -25 -4 Q 0 -13 25 -4 L 27 58 L -27 58 Z" fill={shirt} />
      {top === 0 && <>
        <path d="M -25 -4 Q -12 -9 -8 -6 L -10 58 L -27 58 Z" fill={jacket} />
        <path d="M 25 -4 Q 12 -9 8 -6 L 10 58 L 27 58 Z" fill={jacket} />
        <path d="M -8 -6 L -14 14 M 8 -6 L 14 14" stroke="#00000033" strokeWidth={2} />
      </>}
      {top === 1 && <>
        <path d="M -25 -4 Q -14 -9 -9 -6 L -12 50 L -27 50 Z" fill="#a0703f" />
        <path d="M 25 -4 Q 14 -9 9 -6 L 12 50 L 27 50 Z" fill="#a0703f" />
        {Array.from({ length: 7 }, (_, k) => <line key={k} x1={-26 + k * 2.5} y1={50} x2={-27 + k * 2.5} y2={62} stroke="#a0703f" strokeWidth={1.4} />)}
        {Array.from({ length: 7 }, (_, k) => <line key={`r${k}`} x1={11 + k * 2.5} y1={50} x2={12 + k * 2.5} y2={62} stroke="#a0703f" strokeWidth={1.4} />)}
      </>}
      {top === 2 && [6, 18, 30, 42].map((yy) => <line key={yy} x1={-26} y1={yy} x2={26} y2={yy} stroke="#ffffff55" strokeWidth={4} />)}
      <rect x={-6} y={-20} width={12} height={12} fill={skin} />
      {/* head (faceless) and hair */}
      <circle cx={0} cy={-34} r={18} fill={skin} />
      {style === 2 && <path d="M -16 -32 Q -14 -12 0 -11 Q 14 -12 16 -32 Q 8 -24 0 -24 Q -8 -24 -16 -32 Z" fill={hair} />}
      {style === 4
        ? <><path d="M -19 -38 Q -18 -57 0 -56 Q 18 -57 19 -38 Z" fill={pick(["#8a3b2a", "#2f4a3a", "#c9a24a"], r("cap"))} />
            <path d="M -2 -41 L 30 -40 L 28 -35 L -2 -37 Z" fill="#00000055" /></>
        : <path d={style === 1 ? "M -18 -40 Q 0 -50 18 -40 Q 14 -54 0 -55 Q -14 -54 -18 -40 Z" : "M -19 -36 Q -18 -57 0 -55 Q 18 -57 19 -36 Q 10 -47 1 -46 Q -9 -47 -19 -36 Z"} fill={hair} />}
      {style === 3 && <rect x={-19} y={-46} width={38} height={5} rx={2} fill={pick(["#c94a3a", "#3a7ac9", "#d9a62a"], r("band"))} />}
      {/* arms raised to the pole */}
      <path d="M -22 0 L -31 -40" stroke={sleeve} strokeWidth={11} strokeLinecap="round" />
      <path d="M 22 0 L 27 -48" stroke={sleeve} strokeWidth={11} strokeLinecap="round" />
      <path d="M -31 -40 L -4 -80 M 27 -48 L 4 -98" stroke={skin} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={-62} x2={0} y2={-150} stroke="#8a6a48" strokeWidth={5} />
      <circle cx={-2} cy={-80} r={5.5} fill={skin} /><circle cx={2} cy={-98} r={5.5} fill={skin} />
      {/* the sign: corrugated cardboard, tape at the corners, marker lettering */}
      <g transform={`translate(0 -150) rotate(${tilt}) scale(${squash} 1)`}>
        <rect x={-74} y={-50} width={148} height={62} rx={3} fill={showBack ? "#f4ecd8" : "#e6d6b2"} stroke="#3a2a1a" strokeWidth={2} />
        {!showBack && [-38, -26, -14].map((yy) => <line key={yy} x1={-70} y1={yy} x2={70} y2={yy} stroke="#00000010" strokeWidth={3} />)}
        <rect x={-78} y={-54} width={18} height={8} fill="#f5f0dc" opacity={0.8} transform="rotate(-30 -69 -50)" />
        <rect x={60} y={-54} width={18} height={8} fill="#f5f0dc" opacity={0.8} transform="rotate(30 69 -50)" />
        <text x={0} y={-8} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={showBack ? 22 : 28} fill={showBack ? "#2a1d12" : pick(["#2a1d12", "#8a1f12", "#1f2f5a"], r("ink"))}
          transform={`rotate(${(r("tr") - 0.5) * 5})`}>{showBack ? back : sign}</text>
        {!showBack && r("u") < 0.5 && <path d="M -48 2 Q 0 6 48 0" stroke="#2a1d12" strokeWidth={2.5} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};

// A faceless head-and-shoulders figure for the rows behind the front line, some with a small placard or a raised fist.
const BackPerson: React.FC<{ x: number; y: number; s: number; seed: string; gray: boolean }> = ({ x, y, s, seed, gray }) => {
  const f = useCurrentFrame();
  const r = (k: string) => random(seed + k);
  const bob = Math.sin(f / 8 + r("") * 6) * 2;
  const hair = gray ? pick(GRAY_HAIR, r("h")) : pick(HAIR, r("h"));
  const kind = r("k");
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={0.92}>
      {kind < 0.25 && <><line x1={18} y1={0} x2={30} y2={-58} stroke={pick(SKIN, r("s"))} strokeWidth={7} strokeLinecap="round" />
        <circle cx={31} cy={-62} r={7} fill={pick(SKIN, r("s"))} /></>}
      {kind > 0.7 && <><line x1={0} y1={-20} x2={0} y2={-80} stroke="#8a6a48" strokeWidth={4} />
        <rect x={-34} y={-112} width={68} height={36} rx={2} fill="#e6d6b2" stroke="#3a2a1a" strokeWidth={1.5} transform={`rotate(${(r("t") - 0.5) * 10} 0 -94)`} />
        <text x={0} y={-88} textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize={gray ? 15 : 17} fill="#2a1d12" transform={`rotate(${(r("t") - 0.5) * 10} 0 -94)`}>{gray ? "…ok, fine" : "NO NUKES"}</text></>}
      {r("l") < 0.5 && <path d="M -16 -36 Q -20 -6 -13 4 L 13 4 Q 20 -6 16 -36 Z" fill={hair} />}
      <path d="M -28 40 Q -28 4 0 2 Q 28 4 28 40 Z" fill={pick(SHIRT, r("c"))} />
      <circle cx={0} cy={-26} r={16} fill={pick(SKIN, r("s"))} />
      <path d="M -17 -28 Q -16 -46 0 -45 Q 16 -46 17 -28 Q 8 -38 0 -37 Q -8 -38 -17 -28 Z" fill={hair} />
    </g>
  );
};

const towerPath = (cx: number, b: number, h: number, w: number) =>
  `M ${cx - w} ${b} C ${cx - 0.48 * w} ${b - 0.5 * h}, ${cx - 0.5 * w} ${b - 0.78 * h}, ${cx - 0.62 * w} ${b - h} L ${cx + 0.62 * w} ${b - h} ` +
  `C ${cx + 0.5 * w} ${b - 0.78 * h}, ${cx + 0.48 * w} ${b - 0.5 * h}, ${cx + w} ${b} Z`;

// The rally ground behind the crowd (960 x 560): an overcast sky, two generic cooling towers with steam on the far
// shore, a tree line, the chain-link fence, the lawn, and rows of people behind the front line. Drawn in plain color;
// the archival card does the sepia, grain and weave.
export const RallyGround: React.FC<{ gray?: boolean }> = ({ gray = false }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="rg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcc6cc" /><stop offset="1" stopColor="#eceee6" /></linearGradient>
        <linearGradient id="rg-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8d6cf" /><stop offset="0.6" stopColor="#b9b6ad" /><stop offset="1" stopColor="#97948b" /></linearGradient>
        <filter id="rg-soft"><feGaussianBlur stdDeviation="6" /></filter>
        <radialGradient id="rg-leak" cx="0.95" cy="0.1" r="0.6"><stop offset="0" stopColor="#ffb36b" stopOpacity="0.45" /><stop offset="1" stopColor="#ffb36b" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={960} height={560} fill="url(#rg-sky)" />
      {[[120, 70, 140], [520, 50, 180], [820, 90, 120]].map(([cx, cy, rx], k) => (
        <ellipse key={k} cx={cx + ((f * 0.15) % 40)} cy={cy} rx={rx} ry={22} fill="#f6f6f2" opacity={0.7} filter="url(#rg-soft)" />
      ))}
      {/* steam, then the towers */}
      {[[150, 105], [300, 140]].map(([cx, top], k) => Array.from({ length: 6 }, (_, q) => {
        const ph = ((f / 90 + q / 6 + k * 0.3) % 1);
        return <ellipse key={`${k}-${q}`} cx={cx + ph * 90} cy={top - 10 - ph * 70} rx={30 + ph * 40} ry={18 + ph * 22} fill="#fbfbf8"
          opacity={0.85 * (1 - ph)} filter="url(#rg-soft)" />;
      }))}
      <path d={towerPath(150, 300, 195, 70)} fill="url(#rg-tower)" />
      <path d={towerPath(300, 300, 160, 58)} fill="url(#rg-tower)" />
      <rect x={60} y={286} width={340} height={16} fill="#8d8a80" />
      {/* river, far shore trees */}
      <path d="M 0 300 Q 60 282 120 296 Q 180 278 250 294 Q 330 276 410 292 Q 480 274 560 290 Q 640 272 720 288 Q 800 270 880 286 Q 930 278 960 284 L 960 316 L 0 316 Z" fill="#5f6b48" />
      <rect y={312} width={960} height={12} fill="#9fb0b4" opacity={0.8} />
      {/* lawn and chain-link fence */}
      <rect y={322} width={960} height={238} fill={gray ? "#a7a68e" : "#93a064"} />
      <g opacity={0.55}>
        <line x1={0} y1={330} x2={960} y2={330} stroke="#6f6f68" strokeWidth={2} />
        <line x1={0} y1={372} x2={960} y2={372} stroke="#6f6f68" strokeWidth={2} />
        {Array.from({ length: 49 }, (_, k) => <path key={k} d={`M ${k * 20} 330 l 21 42 M ${k * 20} 372 l 21 -42`} stroke="#8a8a82" strokeWidth={0.8} />)}
        {Array.from({ length: 9 }, (_, k) => <line key={`p${k}`} x1={k * 120 + 20} y1={324} x2={k * 120 + 20} y2={374} stroke="#5f5f58" strokeWidth={4} />)}
      </g>
      {/* rows behind the front line */}
      {Array.from({ length: 14 }, (_, k) => <BackPerson key={`a${k}`} x={20 + k * 70 + (k % 2) * 12} y={372} s={0.7} seed={`ba${k}`} gray={gray} />)}
      {Array.from({ length: 12 }, (_, k) => <BackPerson key={`b${k}`} x={50 + k * 80} y={400} s={0.85} seed={`bb${k}`} gray={gray} />)}
      <rect width={960} height={560} fill="url(#rg-leak)" />
    </g>
  );
};

// The 1979 banner: a bedsheet between two poles, sagging a little, carried over the crowd.
export const RallyBanner: React.FC = () => (
  <g>
    <line x1={344} y1={36} x2={344} y2={360} stroke="#7a5a3a" strokeWidth={6} />
    <line x1={636} y1={36} x2={636} y2={360} stroke="#7a5a3a" strokeWidth={6} />
    <path d="M 344 42 Q 490 52 636 42 L 636 158 Q 490 170 344 158 Z" fill="#f1e6cf" stroke="#3a2a1a" strokeWidth={2.5} />
    <path d="M 380 50 Q 390 100 376 156 M 600 50 Q 588 104 602 160" stroke="#00000014" strokeWidth={6} fill="none" />
  </g>
);

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
