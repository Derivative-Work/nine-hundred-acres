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
export const Farmhouse: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={width * 0.68} viewBox="0 0 300 204">
    <rect width={300} height={204} fill="#cfe3ec" />
    <circle cx={240} cy={40} r={18} fill="#f6e3a6" />
    <rect y={120} width={300} height={84} fill="#9c8a4e" />
    {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M ${-40 + k * 45} 204 L ${120 + k * 12} 120`} stroke="#7d6c3b" strokeWidth={4} />)}
    <rect x={50} y={80} width={70} height={50} fill="#efe8da" />
    <path d="M 44 82 L 85 52 L 126 82 Z" fill="#7b3a2a" />
    <rect x={78} y={104} width={14} height={26} fill="#6b4b33" />
    <rect x={58} y={92} width={12} height={12} fill="#9fc4d6" /><rect x={100} y={92} width={12} height={12} fill="#9fc4d6" />
    <rect x={160} y={70} width={70} height={60} fill="#a33f2f" />
    <path d="M 154 72 L 195 44 L 236 72 Z" fill="#7a2c22" />
    <rect x={185} y={98} width={20} height={32} fill="#f1e6cf" />
    <rect width={300} height={204} fill="#f3d8a0" opacity={0.18} />
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
  const gap = morph * 70; // degrees of the circle's opening at the top
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
