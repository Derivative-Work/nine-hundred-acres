// Coda, S48-S50 (infection 0, black): everything is gone but a bare terminal; the restore overlay returns at 88%,
// climbs to 97% and stalls on failure span 2's first frame. For the whole span the animation stutters at 6 fps, text
// fails into empty glyph boxes, and the overlay reads "Artifact suppression: OFF (by choice)"; it does not recover.
// Through the wordless outro the corruption builds on the beat: on each downbeat the frame tears into shifted bands
// with a color split, blocks of the explainer's old palette smear across the black, and ghosts of the explainer
// (its title, chapters, headlines, toasts, in order) flash up half-boxed and are gone. It thins when the drums drop out.
// S50, on the span's end and the final chord: the frame is clean again; the terminal types `exit`, the orange
// extension cord is traced back across the frame to where it is plugged in (the terminal itself), current runs along
// it, slowing with the fan, and the last line reads "Energy used: ???".
import React from "react";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { Infected, useTheme } from "../theme/context";
import { TIE_DYE, alpha } from "../theme/infection";
import { useChrome } from "../chrome/context";
import { RestoreOverlay } from "../components/furniture";
import { Icon } from "../components/type";
import { at, beats, downbeats, shot, spans } from "../timing";
import { Captions, Terminal, Tofu, boxed, clamp, ramp, useFrame, useStutter } from "./kit";

const ROWS = ['$ explain --topic "data centers" --style "visual explainer"', "  ok  Explainer ready"];
const CORD = "M -20 860 C 400 1020, 1300 1040, 1720 880 C 1840 830, 1760 600, 1600 600";
const DRUMS_OUT = at(227.14);
const BLOCKS = ["#0a0f1f", "#1b2a55", "#111a33", "#2a1640", "#ff7a3d", ...TIE_DYE];

// The explainer's ghosts, in the order the video showed them (on-screen text only, nothing new).
type Ghost = { kind: "title" | "chapter" | "head" | "toast"; a: string; b?: string };
const GHOSTS: Ghost[] = [
  { kind: "title", a: "NINE HUNDRED ACRES" }, { kind: "toast", a: "Explainer ready" },
  { kind: "chapter", a: "01", b: "The Land" }, { kind: "head", a: "About 900 acres, annexed" },
  { kind: "chapter", a: "02", b: "The Hum" }, { kind: "head", a: "The hum is always on" },
  { kind: "chapter", a: "03", b: "The Air" }, { kind: "toast", a: "Restoring human warmth…" },
  { kind: "chapter", a: "04", b: "The Power" }, { kind: "head", a: "Reactors: switched off" },
  { kind: "chapter", a: "05", b: "The Bill" }, { kind: "head", a: "Energy used: some" },
];

const GhostCard: React.FC<{ g: Ghost; share: number; seed: string }> = ({ g, share, seed }) => {
  const t = useTheme();
  const txt = (s: string) => <Tofu text={boxed(s, share, seed)} />;
  const card = { padding: "14px 24px", borderRadius: 14, background: alpha(t.c.card, 0.9), border: `2px solid ${alpha(t.c.accentA, 0.5)}` };
  if (g.kind === "title")
    return <div style={{ fontFamily: t.font.sans, fontWeight: 800, fontSize: 120, letterSpacing: "-0.02em", color: t.c.accentA, whiteSpace: "nowrap" }}>{txt(g.a)}</div>;
  if (g.kind === "chapter")
    return (
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: t.font.mono, fontSize: 30, color: t.c.accentA, padding: "4px 12px", border: `1px solid ${alpha(t.c.accentA, 0.6)}`, borderRadius: 8 }}>{g.a}</span>
        <span style={{ fontFamily: t.font.sans, fontWeight: 800, fontSize: 52, color: t.c.text }}>{txt(g.b!)}</span>
      </div>
    );
  if (g.kind === "toast")
    return (
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap", fontFamily: t.font.sans, fontWeight: 600, fontSize: 34, color: t.c.text }}>
        <Icon name="circle-check" size={34} color={t.c.success} />{txt(g.a)}
      </div>
    );
  return <div style={{ fontFamily: t.font.sans, fontWeight: 600, fontSize: 56, color: t.c.text, whiteSpace: "nowrap" }}>{txt(g.a)}</div>;
};

// How hard the frame is failing at stuttered frame G: builds through the outro, gone when the drums drop out.
const envelope = (G: number, fail: number) =>
  interpolate(G, [fail + 130, fail + 260, at(222), DRUMS_OUT - 10, DRUMS_OUT + 20], [0, 0.4, 1, 1, 0], clamp);

// The burst hitting frame G: strongest on a downbeat, a lighter tick on the other beats, decaying over the beat.
const burstAt = (G: number, fail: number) => {
  const d = [...downbeats].reverse().find((x) => x <= G && G - x < 16);
  const b = [...beats].reverse().find((x) => x <= G && G - x < 9);
  const env = envelope(G, fail);
  if (d != null) return { s: env * (1 - (G - d) / 16), seed: `d${d}` };
  if (b != null) return { s: env * 0.35 * (1 - (G - b) / 9), seed: `b${b}` };
  return { s: 0, seed: "" };
};

// The frame torn into horizontal bands, each shifted sideways, with a red and a cyan copy split off it.
const Torn: React.FC<{ s: number; seed: string; children: React.ReactNode }> = ({ s, seed, children }) => {
  if (s < 0.04) return <AbsoluteFill>{children}</AbsoluteFill>;
  const cuts = [0, ...Array.from({ length: 6 }, (_, k) => 280 + random(`${seed}c${k}`) * 520).sort((a, b) => a - b), 1080];
  const split = 4 + 18 * s;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-split}px)`, opacity: 0.55, mixBlendMode: "screen", filter: "sepia(1) saturate(9) hue-rotate(-45deg)" }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${split}px)`, opacity: 0.55, mixBlendMode: "screen", filter: "sepia(1) saturate(9) hue-rotate(150deg)" }}>{children}</AbsoluteFill>
      {cuts.slice(1).map((y1, k) => {
        const y0 = cuts[k];
        const dx = random(`${seed}x${k}`) < 0.45 ? 0 : (random(`${seed}d${k}`) - 0.5) * 260 * s;
        return <AbsoluteFill key={k} style={{ clipPath: `inset(${y0}px 0 ${1080 - y1}px 0)`, transform: `translateX(${dx}px)` }}>{children}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );
};

// Blocks of the explainer's palette, snapped to a 48 px grid, some smeared down the frame.
const Blocks: React.FC<{ s: number; seed: string }> = ({ s, seed }) => {
  const n = Math.round(22 * s);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }, (_, k) => {
        const r = (p: string) => random(`${seed}${p}${k}`);
        const x = Math.floor(r("x") * 40) * 48, y = Math.floor(r("y") * 22) * 48;
        const smear = r("s") < 0.3;
        const w = 48 * (1 + Math.floor(r("w") * (smear ? 2 : 6))), h = smear ? 48 * (4 + Math.floor(r("h") * 10)) : 48 * (1 + Math.floor(r("h") * 2));
        return <rect key={k} x={x} y={y} width={w} height={h} fill={BLOCKS[Math.floor(r("c") * BLOCKS.length)]} opacity={0.35 + 0.5 * r("o")} />;
      })}
    </svg>
  );
};

// Each downbeat from the span's middle on raises the next ghost for about a bar and a half; it flickers on the
// stuttered clock and is cut off in blocks.
const Ghosts: React.FC<{ G: number; fail: number }> = ({ G, fail }) => {
  const from = downbeats.findIndex((d) => d >= fail + 140);
  const ds = downbeats.slice(from).filter((d) => d < DRUMS_OUT);
  return (
    <>
      {ds.map((d, k) => {
        const life = G - d;
        if (life < 0 || life > 80) return null;
        const seed = `g${d}`;
        if (random(`${seed}:${Math.floor(G / 5)}`) < 0.22) return null;
        const g = GHOSTS[k % GHOSTS.length];
        const env = Math.max(0.35, envelope(d, fail));
        const x = 200 + random(`${seed}x`) * 1100, y = 120 + random(`${seed}y`) * 760;
        const clip = `inset(${random(`${seed}t`) * 30}% ${random(`${seed}r`) * 35}% ${random(`${seed}b`) * 30}% 0)`;
        return (
          <div key={d} style={{ position: "absolute", left: x, top: y, transform: `translate(-30%, -50%) translateX(${life > 60 ? (life - 60) * 6 : 0}px)`,
            opacity: env * interpolate(life, [0, 4, 60, 80], [0, 0.85, 0.7, 0], clamp), clipPath: clip }}>
            <Infected value={0.15 + 0.6 * random(`${seed}i`)}>
              <GhostCard g={g} share={interpolate(life, [0, 70], [0.2, 0.9], clamp)} seed={seed} />
            </Infected>
          </div>
        );
      })}
    </>
  );
};

// A wall socket on the terminal's right edge (two slots and a ground hole), where the cord ends.
const Outlet: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g opacity={opacity}>
    <rect x={1530} y={562} width={40} height={76} rx={8} fill="#e8e4da" stroke="#0008" strokeWidth={2} />
    <rect x={1541} y={578} width={5} height={16} rx={1.5} fill="#2a2a2a" />
    <rect x={1554} y={578} width={5} height={20} rx={1.5} fill="#2a2a2a" />
    <path d="M 1545 616 a 5 5 0 0 1 10 0 v 5 h -10 z" fill="#2a2a2a" />
  </g>
);

// The plug at the cord's end, prongs pointing left into the socket; it slides the last few pixels in (`push` 0 -> 1).
const Plug: React.FC<{ push: number }> = ({ push }) => {
  const x = 1572 + 14 * (1 - push), prong = 2 + 12 * (1 - push); // the prongs disappear into the socket
  return (
    <g transform={`translate(${x} 600)`}>
      <rect x={-prong} y={-8} width={prong} height={4} fill="#c9c9c9" />
      <rect x={-prong} y={4} width={prong} height={4} fill="#c9c9c9" />
      <rect x={-2} y={-17} width={26} height={34} rx={6} fill="#ff8a1f" style={{ filter: "drop-shadow(0 0 6px #ff8a1f88)" }} />
      <rect x={4} y={-11} width={3} height={22} rx={1.5} fill="#0004" />
    </g>
  );
};

// Current running along the cord into the plug, slowing with the fan until it stops.
const Current: React.FC<{ live: number; from: number; end: number }> = ({ live, from, end }) => {
  if (live < from) return null;
  // distance travelled: the integral of a speed that decays linearly to zero at `end`
  const span = end - from, t = Math.min(live - from, span);
  const travel = 0.012 * (t - (t * t) / (2 * span));
  const glow = interpolate(live, [from, from + 10, end - 60, end], [0, 1, 0.6, 0.15], clamp);
  return (
    <path d={CORD} fill="none" stroke="#ffe2b8" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="0.012 0.06"
      strokeDashoffset={-travel} opacity={glow} style={{ filter: "drop-shadow(0 0 6px #ffb000)" }} />
  );
};

export const CodaStutter: React.FC = () => {
  const live = useFrame();
  const s48 = shot("S48").frame, fail = at(spans[1].start), s50 = shot("S50").frame, end = shot("S50").frame_end;
  const F = useStutter(fail, s50);
  const pct = interpolate(F, [s48, fail], [88, 97], clamp);
  const off = F >= fail + 105;
  const boxes = ramp(F, fail + 20, fail + 140) * 0.85;
  const inn = spring({ frame: F - s48, fps: 30, config: { damping: 200 } });
  const exit = "exit".slice(0, Math.max(0, Math.floor((live - s50 - 10) / 4)));
  const cord = ramp(live, s50 + 40, s50 + 130);
  const plugged = s50 + 130;
  const energy = live >= s50 + 140;
  // the failure's first frame tears once (held for the first dropped-frame step), so the span visibly starts on its
  // frame: before it nothing on screen moves, so the stall and the stutter alone would not show
  const onset = F === fail ? { s: 0.6, seed: "onset" } : null;
  const burst = live >= s50 ? { s: 0, seed: "" } : onset ?? burstAt(F, fail);
  const rows = [...ROWS.map((r) => <Tofu key={r} text={boxed(r, boxes)} />), ...(live >= s50 ? [`$ ${exit}`] : []),
    ...(energy ? ["Energy used: ???"] : []), ...(live < s50 ? ["$ "] : [])];
  // the terminal itself jitters a little between bursts while the span runs
  const jitter = live < s50 && F >= fail + 140 ? (random(`j${F}`) - 0.5) * 6 * envelope(F, fail) : 0;
  return (
    <Infected value={0}>
      <AbsoluteFill style={{ background: useChrome() ? "transparent" : "#000" }}>
        {burst.s > 0.04 && <Blocks s={burst.s} seed={burst.seed} />}
        {live < s50 && <Ghosts G={F} fail={fail} />}
        <Torn s={burst.s} seed={burst.seed}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${jitter}px)` }}>
            <Terminal lines={rows} width={1180} clock={F} cursor={!energy} />
          </AbsoluteFill>
          <div style={{ position: "absolute", right: 50, top: 40, opacity: inn }}>
            <RestoreOverlay pct={pct} state={off ? "off" : F >= fail ? "stalled" : "running"} />
          </div>
        </Torn>
        {live >= s50 && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={CORD} fill="none" stroke="#ff8a1f" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1}
              strokeDashoffset={1 - cord} style={{ filter: "drop-shadow(0 0 8px #ff8a1f88)" }} />
            <Outlet opacity={ramp(live, s50 + 30, s50 + 45)} />
            <Current live={live} from={plugged} end={end} />
            {cord >= 1 && <Plug push={ramp(live, s50 + 122, plugged)} />}
            {live >= plugged && live < plugged + 12 && Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2, r0 = 10 + (live - plugged) * 3, r1 = r0 + 14;
              return <line key={k} x1={1566 + Math.cos(a) * r0} y1={600 + Math.sin(a) * r0} x2={1566 + Math.cos(a) * r1} y2={600 + Math.sin(a) * r1}
                stroke="#ffe2b8" strokeWidth={3} strokeLinecap="round" opacity={1 - (live - plugged) / 12} />;
            })}
          </svg>
        )}
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
