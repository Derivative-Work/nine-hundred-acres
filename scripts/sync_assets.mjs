// Copy the emoji and icons the video uses from the pinned npm packages into remotion/public, so the render reads
// only files listed in assets/LICENSES.md. Emoji are Twemoji SVGs (never a system emoji font); icons are Lucide.
// Usage: node scripts/sync_assets.mjs
import { copyFileSync, mkdirSync } from "node:fs";

const NM = "remotion/node_modules";
export const EMOJI = {
  corn: "1f33d", computer: "1f5a5", cloud: "2601", blossom: "1f33c", cherry: "1f338", sunflower: "1f33b",
  sparkles: "2728", bulb: "1f4a1", zap: "26a1", plug: "1f50c", cricket: "1f997", rice: "1f33e", check: "2705",
  warning: "26a0", peace: "262e", chart: "1f4c8", fog: "1f32b", dash: "1f4a8",
};
export const ICONS = ["fan", "server", "wind", "zap", "power", "plug", "check", "square", "x", "briefcase", "door-closed",
  "factory", "map-pin", "terminal", "cloud", "sparkles", "lightbulb", "house", "school", "loader-circle", "circle-check",
  "triangle-alert", "rotate-cw", "mic-off", "hand"];

mkdirSync("remotion/public/emoji", { recursive: true });
mkdirSync("remotion/public/icons", { recursive: true });
for (const [name, cp] of Object.entries(EMOJI)) copyFileSync(`${NM}/@twemoji/svg/${cp}.svg`, `remotion/public/emoji/${name}.svg`);
for (const name of ICONS) copyFileSync(`${NM}/lucide-static/icons/${name}.svg`, `remotion/public/icons/${name}.svg`);
console.log(`${Object.keys(EMOJI).length} emoji, ${ICONS.length} icons`);
