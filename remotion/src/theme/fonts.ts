// Open-licensed fonts only (assets/LICENSES.md): Inter, JetBrains Mono, Shrikhand for the infected headings, and
// Caveat for the hand-lettered protest signs.
// Imported from the pinned Fontsource packages, so nothing is fetched at render time; every frame waits for them.
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/shrikhand/400.css";
import "@fontsource/caveat/700.css";
import { continueRender, delayRender } from "remotion";

const FACES = ["400 16px Inter", "600 16px Inter", "800 16px Inter", "400 16px 'JetBrains Mono'",
  "700 16px 'JetBrains Mono'", "400 16px Shrikhand", "700 16px Caveat"];

const handle = delayRender("fonts");
Promise.all(FACES.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
