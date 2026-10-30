// The explainer's furniture: callouts, toasts, checklists, the restore overlay, karaoke captions, the hum, the cord
// and the tile grid.
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";
import { Card, GradientFill } from "./surface";
import { Body, Emoji, Icon } from "./type";

export const Callout: React.FC<{ title?: string; children: React.ReactNode; width?: number }> = ({
  title = "Key insight", children, width = 640,
}) => {
  const t = useTheme();
  return (
    <div style={{ position: "relative", width, borderRadius: t.radius, padding: 3 }}>
      <GradientFill style={{ borderRadius: t.radius }} />
      <div style={{ position: "relative", borderRadius: t.radius - 3, background: t.c.card, padding: "26px 32px", overflow: "hidden" }}>
        {t.marble > 0 && <GradientFill style={{ borderRadius: t.radius - 3, opacity: 0.22 * t.marble }} />}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <Emoji name="bulb" size={34} />
          <Body size={22} style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: t.c.accentA }}>{title}</Body>
          <Emoji name="sparkles" size={26} style={{ marginLeft: "auto" }} />
        </div>
        <Body size={38} style={{ position: "relative", fontWeight: 600 }}>{children}</Body>
      </div>
    </div>
  );
};

export const Toast: React.FC<{ children: React.ReactNode; tone?: "success" | "error"; icon?: string }> = ({
  children, tone = "success", icon,
}) => {
  const t = useTheme();
  const col = tone === "success" ? t.c.success : t.c.error;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderRadius: t.radius * 0.75,
      background: t.c.card, border: `1px solid ${alpha(col, 0.40)}`, boxShadow: `0 10px 40px -10px ${alpha(col, 0.33)}`, width: "fit-content" }}>
      <Icon name={icon ?? (tone === "success" ? "circle-check" : "triangle-alert")} size={30} color={col} />
      <Body size={26} style={{ fontWeight: 600 }}>{children}</Body>
    </div>
  );
};

// A checklist whose boxes stay empty. Past 0.4 the box outlines are hand-drawn and crooked.
export const Checklist: React.FC<{ items: string[]; checked?: boolean[] }> = ({ items, checked = [] }) => {
  const t = useTheme();
  const wobble = interpolate(t.infection, [0.3, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {items.map((it, k) => {
        const j = (n: string) => (random(`${it}${n}`) - 0.5) * 6 * wobble;
        return (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={40} height={40} viewBox="0 0 40 40">
              <path d={`M${4 + j("a")} ${4 + j("b")} L${36 + j("c")} ${5 + j("d")} L${35 + j("e")} ${36 + j("f")} L${5 + j("g")} ${35 + j("h")} Z`}
                fill="none" stroke={t.c.muted} strokeWidth={2.5} strokeLinejoin="round" />
              {checked[k] && <path d="M10 21 L17 28 L30 12" fill="none" stroke={t.c.success} strokeWidth={4} />}
            </svg>
            <Body size={34}>{it}</Body>
          </div>
        );
      })}
    </div>
  );
};

// The running gag's background task, top right: "Restoring human warmth…"
export type RestoreState = "running" | "stalled" | "error" | "retrying" | "ok" | "off";
export const RestoreOverlay: React.FC<{ pct: number; state?: RestoreState }> = ({ pct, state = "running" }) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const col = { running: t.c.accentA, stalled: t.c.accentA, error: t.c.error, retrying: t.c.accentA, ok: t.c.success, off: t.c.error }[state];
  const label = { running: "Restoring human warmth…", stalled: "Restoring human warmth…", error: "Restoring human warmth…",
    retrying: "Retrying…", ok: "Human warmth restored", off: "Artifact suppression: OFF (by choice)" }[state];
  const icon = { running: "loader-circle", stalled: "loader-circle", error: "triangle-alert", retrying: "rotate-cw", ok: "circle-check", off: "power" }[state];
  const spin = state === "running" || state === "retrying" ? f * 8 : 0;
  return (
    <div style={{ minWidth: 460, width: "fit-content", padding: "18px 22px", borderRadius: 14, background: `${alpha(t.c.card, 0.95)}`,
      border: `1px solid ${t.c.border}`, boxShadow: "0 16px 40px -16px #000c" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name={icon} size={24} color={col} style={{ transform: `rotate(${spin}deg)` }} />
        <Body size={21} style={{ fontWeight: 600 }}>{label}</Body>
        <Body size={21} mono style={{ marginLeft: "auto", color: col }}>{Math.round(pct)}%</Body>
      </div>
      <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "#ffffff14", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: col }} />
      </div>
    </div>
  );
};

// Karaoke caption: the current word highlighted. Captions are plain type (no emoji).
export const KaraokeCaption: React.FC<{ words: string[]; current: number }> = ({ words, current }) => {
  const t = useTheme();
  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", padding: "14px 28px",
      borderRadius: 16, background: "#00000066", fontFamily: t.font.sans, fontWeight: 600, fontSize: 46 }}>
      {words.map((w, k) => (
        <span key={k} style={{ color: k === current ? t.c.accentA : k < current ? t.c.text : `${t.c.muted}` }}>{w}</span>
      ))}
    </div>
  );
};

// "The Hum": an animated sine wave. Past chorus 1 it picks up a tape-warble wobble.
export const HumWave: React.FC<{ width: number; height: number; label?: boolean }> = ({ width, height, label = true }) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const warble = t.infection * 0.6;
  const pts = Array.from({ length: 241 }, (_, k) => {
    const x = (k / 240) * width;
    const amp = height * 0.32 * (1 + warble * 0.5 * Math.sin(k / 9 + f / 11));
    const y = height / 2 + amp * Math.sin(k / 240 * Math.PI * 6 - f / 6 + warble * Math.sin(f / 23 + k / 30));
    return `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="hum" x1="0" x2="1">
            <stop offset="0" stopColor={t.c.accentA} />
            <stop offset="1" stopColor={t.c.accentB} />
          </linearGradient>
        </defs>
        <path d={pts} fill="none" stroke="url(#hum)" strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${alpha(t.c.accentB, 0.53)})` }} />
      </svg>
      {label && <Body size={22} mono muted style={{ position: "absolute", left: 0, top: -6 }}>The Hum · always</Body>}
    </div>
  );
};

// The extension cord: one orange connector line through every scene. `progress` draws it.
export const Cord: React.FC<{ d: string; progress?: number; width?: number; height?: number }> = ({
  d, progress = 1, width = 1920, height = 1080,
}) => (
  <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <path d={d} fill="none" stroke="#ff8a1f" strokeWidth={7} strokeLinecap="round" pathLength={1}
      strokeDasharray={1} strokeDashoffset={1 - progress} style={{ filter: "drop-shadow(0 0 8px #ff8a1f88)" }} />
  </svg>
);

// The server room: a grid of tiles. Each is corn until its row flips (rowFlip(r): 0 corn, 1 rack tile, a half-turn
// between) or `flip` (0..1, row by row) has passed it; flowers take the theme's flower count of tiles; one cornstalk
// (`survivor`) never flips. `heat` (0..1) is the thermal sweep's position: tiles left of it show tie-dye status dots.
export const TileGrid: React.FC<{ cols: number; rows: number; tile: number; flip?: number; rowFlip?: (r: number) => number;
  survivor?: [number, number]; heat?: number }> = ({ cols, rows, tile, flip = 1, rowFlip, survivor = [rows - 1, cols - 2], heat = 0 }) => {
  const t = useTheme();
  const f = useCurrentFrame();
  // the theme's flower count, on tiles in a fixed shuffled order so a flower, once there, stays on its tile
  const order = Array.from({ length: rows * cols }, (_, k) => k).sort((a, b) => random(`fl${a}`) - random(`fl${b}`));
  const flowerTiles = order.filter((k) => !(Math.floor(k / cols) === survivor[0] && k % cols === survivor[1])).slice(0, t.flowers);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tile}px)`, gap: tile * 0.18, perspective: 600 }}>
      {Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols), c = k % cols;
        const isSurvivor = r === survivor[0] && c === survivor[1];
        const p = isSurvivor ? 0 : rowFlip ? rowFlip(r) : r < flip * rows ? 1 : 0;
        const flipped = p >= 0.5;
        const flower = flipped && flowerTiles.includes(k);
        const blink = 0.4 + 0.6 * (Math.sin(f / 7 + random(`dot${k}`) * 20) > 0 ? 1 : 0.3);
        const hue = (random(`heat${k}`) * 6 + f / 30) % 6;
        const hot = heat > 0 && c / cols < heat;
        const dot = hot ? ["#ff5e3a", "#ffb000", "#3bd16f", "#2ea6ff", "#9b5cff", "#ff3d8b"][Math.floor(hue)] : t.c.success;
        const turn = p * 180 - (flipped ? 180 : 0);
        return (
          <div key={k} style={{ width: tile, height: tile, borderRadius: tile * 0.18, display: "grid", placeItems: "center",
            background: flipped ? t.c.card : "transparent", border: flipped ? `1px solid ${t.c.border}` : "none", position: "relative",
            transform: `rotateX(${turn}deg)` }}>
            {!flipped || flower ? (
              <Emoji name={flower ? ["blossom", "cherry", "sunflower"][k % 3] : "corn"} size={tile * 0.72} />
            ) : (
              <>
                <div style={{ width: tile * 0.56, display: "flex", flexDirection: "column", gap: tile * 0.07 }}>
                  {[0, 1, 2].map((q) => <div key={q} style={{ height: tile * 0.1, borderRadius: 2, background: `${alpha(t.c.muted, 0.67)}` }} />)}
                </div>
                <div style={{ position: "absolute", right: tile * 0.12, top: tile * 0.12, width: tile * 0.12, height: tile * 0.12,
                  borderRadius: "50%", background: dot, opacity: blink, boxShadow: `0 0 ${tile * 0.15}px ${dot}` }} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { Card };
