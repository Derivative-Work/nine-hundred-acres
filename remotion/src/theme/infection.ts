// The infection: one value from 0 (a sterile agent-built explainer) to 1 (fully gone back to the land) that every
// component reads (brief, "Visual system"). Each shot sets its own value; SECTION_TARGETS are the brief's targets at
// the start of each section. The video peaks at 0.7 (the end of the bridge), so 1.0 is never shown; the ramps below
// are tuned so the brief's milestones land on their values:
//   0.15  the gradient warms slightly; a flower slips into a grid
//   0.30  (verse 2) the lingering haze is a separate layer, not the infection
//   0.40  tie-dye shows in gradients and heat maps; card borders pick it up
//   0.50  gradients marble; headings cross over to the groovy swash face
//   0.70  lava-lamp blobs behind the cards; springs are loose and bouncy
import { interpolate, interpolateColors } from "remotion";

export const SECTION_TARGETS = [
  { section: "Intro", value: 0 },
  { section: "Verse 1", value: 0 },
  { section: "Chorus 1", value: 0.15 },
  { section: "Verse 2", value: 0.3 },
  { section: "Verse 3", value: 0.5 },
  { section: "Bridge", value: 0.5, to: 0.7 },
  { section: "Coda", value: 0 },
] as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 below a, 1 above b, smooth between
export const smooth = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// a theme color at an alpha; theme colors arrive as "#rrggbb" or as interpolateColors' "rgba(r, g, b, a)"
export const alpha = (color: string, a: number) => {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const [r, g, b] = m ? m.slice(1, 4).map(Number) : [1, 3, 5].map((k) => parseInt(color.slice(k, k + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const mix = (x: number, from: string, to: string) => interpolateColors(x, [0, 1], [from, to]);

export const BASE = {
  bg: "#0a0f1f", // dark navy
  glow: "#1b2a55", // the soft radial glow behind the focal card
  card: "#111a33",
  border: "rgba(255,255,255,0.09)",
  text: "#e8ecf8",
  muted: "#8a93b2",
  accentA: "#ff7a3d", // the one accent gradient: orange…
  accentB: "#ff3d8b", // …to pink
  success: "#2dd4bf", // teal
  error: "#f43f5e", // red
};

const LAND = {
  bg: "#1a0f1e", // aubergine
  glow: "#5a2a2a", // a warm, smoky glow
  card: "#24162a",
  text: "#fff1dc", // cream
  muted: "#c9a98a",
  accentA: "#ffb000", // mustard…
  accentB: "#e2367a", // …to magenta
};

// tie-dye: the stops every infected gradient, border and heat map draws from
export const TIE_DYE = ["#ff5e3a", "#ffb000", "#3bd16f", "#2ea6ff", "#9b5cff", "#ff3d8b"];

export type Theme = ReturnType<typeof theme>;

export function theme(infection: number) {
  const i = Math.min(1, Math.max(0, infection));
  const warm = smooth(i, 0, 1); // the slow drift of every color toward the land palette
  const tieDye = smooth(i, 0.3, 0.55); // tie-dye arrives around 0.4
  const marble = smooth(i, 0.42, 0.62); // marbling and the groovy headings around 0.5
  const lava = smooth(i, 0.55, 0.75); // lava lamp near the bridge's 0.7 peak
  const c = {
    bg: mix(warm, BASE.bg, LAND.bg),
    glow: mix(warm, BASE.glow, LAND.glow),
    card: mix(warm, BASE.card, LAND.card),
    border: BASE.border,
    text: mix(warm, BASE.text, LAND.text),
    muted: mix(warm, BASE.muted, LAND.muted),
    accentA: mix(warm, BASE.accentA, LAND.accentA),
    accentB: mix(warm, BASE.accentB, LAND.accentB),
    success: BASE.success,
    error: BASE.error,
  };
  return {
    infection: i,
    tieDye,
    marble,
    lava,
    c,
    font: {
      sans: "Inter, sans-serif",
      mono: "'JetBrains Mono', monospace",
      groovy: "Shrikhand, Inter, sans-serif",
    },
    // the groovy face's share of a heading (crossfaded, see Heading)
    groovy: marble,
    radius: interpolate(i, [0, 0.7], [16, 30], clamp),
    // rotation (deg) for anything that should start to lean as the theme loosens up
    lean: interpolate(i, [0, 0.7], [0, 2.5], clamp),
    // springs: crisp and critically damped at 0, loose and bouncy by 0.7
    spring: { damping: interpolate(i, [0, 0.7], [200, 9], clamp), stiffness: 120, mass: interpolate(i, [0, 0.7], [1, 1.4], clamp) },
    // ambient drift (px) for cards that float, 0 when sterile
    drift: interpolate(i, [0.1, 0.7], [0, 10], clamp),
    // the gradient text and fills: two-stop linear, with tie-dye laid over it at tieDye's opacity
    gradient: (angle = 90) => `linear-gradient(${angle}deg, ${c.accentA}, ${c.accentB})`,
    tieDyeGradient: (turn = 0) => `conic-gradient(from ${turn}deg at 50% 50%, ${[...TIE_DYE, TIE_DYE[0]].join(", ")})`,
    // how many tiles in a grid have gone over to flowers (brief: one at Chorus 1, three by the heat map, then more)
    flowers: Math.floor(interpolate(i, [0, 0.149, 0.15, 0.4, 0.5, 0.7], [0, 0, 1, 3, 3.99, 9], clamp)),
  };
}
