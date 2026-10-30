// The explainer's annotation layer: leader-line labels, stat tiles and a pointer cursor. Each takes the absolute frame
// it appears on (`at`) and draws itself on from there.
import React from "react";
import { interpolate, spring } from "remotion";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";
import { useFrame } from "../shots/kit";
import { Body, Emoji } from "./type";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A label at (x, y) with a leader line to the point (tx, ty), drawn on over 12 frames from `at`.
export const Note: React.FC<{ at: number; x: number; y: number; tx: number; ty: number; children: React.ReactNode; until?: number }> = ({
  at, x, y, tx, ty, children, until = Infinity,
}) => {
  const t = useTheme();
  const F = useFrame();
  if (F < at || F > until + 10) return null;
  const draw = interpolate(F, [at, at + 12], [0, 1], clamp) * (Number.isFinite(until) ? interpolate(F, [until, until + 10], [1, 0], clamp) : 1);
  const ex = x + (tx - x) * draw, ey = y + (ty - y) * draw;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={t.c.muted} strokeWidth={2} strokeDasharray="5 5" />
        <circle cx={tx} cy={ty} r={7} fill="none" stroke={t.c.accentA} strokeWidth={2.5} opacity={draw > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tx < x ? 0 : -100}%, -50%)`, opacity: draw,
        padding: "6px 14px", borderRadius: 10, background: alpha(t.c.card, 0.95), border: `1px solid ${t.c.border}`, whiteSpace: "nowrap" }}>
        <Body size={22} mono>{children}</Body>
      </div>
    </>
  );
};

// A stat tile: a big value over a small label; numbers can tick up from 0.
export const Stat: React.FC<{ at: number; label: string; value: string | number; tick?: number; emoji?: string; style?: React.CSSProperties }> = ({
  at, label, value, tick = 0, emoji, style,
}) => {
  const t = useTheme();
  const F = useFrame();
  const s = spring({ frame: F - at, fps: 30, config: t.spring });
  if (F < at) return null;
  const shown = typeof value === "number" ? Math.round(value * interpolate(F, [at, at + tick], [tick ? 0 : 1, 1], clamp)).toLocaleString("en-US") : value;
  return (
    <div style={{ minWidth: 190, padding: "14px 20px", borderRadius: t.radius * 0.75, background: alpha(t.c.card, 0.92), border: `1px solid ${t.c.border}`,
      opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 14}px)`, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {emoji && <Emoji name={emoji} size={30} />}
        <Body size={40} mono style={{ fontWeight: 700, color: t.c.text }}>{shown}</Body>
      </div>
      <Body size={18} mono muted style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</Body>
    </div>
  );
};

// A pointer cursor gliding between keyframes [frame, x, y, click?]; a click shows a ripple.
export const Cursor: React.FC<{ keys: [number, number, number, boolean?][] }> = ({ keys }) => {
  const F = useFrame();
  if (F < keys[0][0] - 8 || F > keys[keys.length - 1][0] + 30) return null;
  const fr = keys.map((k) => k[0]);
  const ease = (v: number[]) => interpolate(F, fr, v, { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const x = keys.length > 1 ? ease(keys.map((k) => k[1])) : keys[0][1];
  const y = keys.length > 1 ? ease(keys.map((k) => k[2])) : keys[0][2];
  const click = keys.find((k) => k[3] && F >= k[0] && F < k[0] + 14);
  const r = click ? interpolate(F - click[0], [0, 14], [6, 40]) : 0;
  const fade = interpolate(F, [keys[0][0] - 8, keys[0][0], keys[keys.length - 1][0] + 20, keys[keys.length - 1][0] + 30], [0, 1, 1, 0], clamp);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: fade, overflow: "visible" }}>
      {click && <circle cx={x} cy={y} r={r} fill="none" stroke="#ffffff" strokeWidth={3} opacity={1 - r / 40} />}
      <path d={`M ${x} ${y} l 0 30 l 8 -7 l 6 13 l 5 -2 l -6 -13 l 11 0 Z`} fill="#fff" stroke="#000" strokeWidth={1.5}
        transform={click && F - click[0] < 4 ? `translate(${x} ${y}) scale(0.9) translate(${-x} ${-y})` : undefined} />
    </svg>
  );
};

// A row of stat tiles at a fixed place on screen.
export const StatRow: React.FC<{ x: number; y: number; children: React.ReactNode; column?: boolean }> = ({ x, y, children, column }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: column ? "column" : "row", gap: 14 }}>{children}</div>
);
