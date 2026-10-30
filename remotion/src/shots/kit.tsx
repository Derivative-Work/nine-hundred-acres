// What every shot shares: the absolute video frame (shots run inside Sequences, but every cue in the timing map is an
// absolute frame), the karaoke caption bar, the stutter clock for failure span 2, and a few scene props.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";
import { lines } from "../timing";
import { Body, Emoji } from "../components/type";
import { KaraokeCaption } from "../components/furniture";

const Start = createContext(0);
// A shot's content sees absolute frames through useFrame(); `from` is the shot's first video frame.
export const ShotClock: React.FC<{ from: number; children: React.ReactNode }> = ({ from, children }) => (
  <Start.Provider value={from}>{children}</Start.Provider>
);
export const useFrame = () => useCurrentFrame() + useContext(Start);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// 0 before frame a, 1 after frame b
export const ramp = (F: number, a: number, b: number) => interpolate(F, [a, b], [0, 1], clamp);

// The caption bar: the line being sung, the current word highlighted (plain type, no emoji). `glyphBoxes` turns
// letters into empty boxes (S49).
export const Captions: React.FC<{ glyphBoxes?: number }> = ({ glyphBoxes = 0 }) => {
  const F = useFrame();
  const ln = lines.find((l) => l.words.length && F >= l.frame_start - 8 && F <= l.frame_end + 10);
  if (!ln) return null;
  const words = ln.words.map((w) => (glyphBoxes ? boxed(w.w, glyphBoxes, w.w) : w.w));
  const current = ln.words.filter((w) => w.frame <= F).length - 1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 48 }}>
      <KaraokeCaption words={words} current={current} />
    </AbsoluteFill>
  );
};

// Text whose letters fail one by one into empty glyph boxes ("tofu"), `share` of them (0..1), in a fixed order.
export const boxed = (s: string, share: number, seed = s) =>
  [...s].map((ch, k) => (ch !== " " && ((k * 7919 + seed.length * 31) % 97) / 97 < share ? "▯" : ch)).join("");

// Draws the "▯" marks from `boxed` as real empty boxes one character wide (the fonts have no such glyph, and the
// fallback draws thin slivers).
export const Tofu: React.FC<{ text: string }> = ({ text }) => (
  <>{text.split(/(▯)/).map((p, k) => p === "▯"
    ? <span key={k} style={{ display: "inline-block", width: "0.46em", height: "0.74em", margin: "0 0.07em", verticalAlign: "-0.06em",
        border: "0.07em solid currentColor", boxSizing: "border-box", opacity: 0.85 }} />
    : <React.Fragment key={k}>{p}</React.Fragment>)}</>
);

// A failing frame clock: from `start` to `end`, animation only advances at 6 fps (holding each frame five times at
// 30 fps); it runs smoothly again after `end`.
export const useStutter = (start: number, end = Infinity) => {
  const F = useFrame();
  return F < start || F >= end ? F : start + Math.floor((F - start) / 5) * 5;
};

// Small mono label in the corner of the context reel (not part of the final video).
export const ReelLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 24, top: 18, fontFamily: "'JetBrains Mono'", fontSize: 18, color: "#ffffffaa",
    background: "#0008", padding: "4px 10px", borderRadius: 6 }}>{children}</div>
);

// A generic terminal window: plain chrome (three neutral dots), monospace text, a blinking block cursor at the end of the last
// line, where the next character will be typed.
// `chrome` fades the window and its text without moving the cursor (S01: the cursor blinks alone on black).
export const Terminal: React.FC<{ lines: React.ReactNode[]; width?: number; cursor?: boolean; clock?: number; chrome?: number; style?: React.CSSProperties }> = ({
  lines: rows, width = 1100, cursor = true, clock, chrome = 1, style,
}) => {
  const t = useTheme();
  const live = useFrame();
  const F = clock ?? live;
  return (
    <div style={{ position: "relative", width, borderRadius: 12, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#0b0d12", border: "1px solid #ffffff1a",
        boxShadow: "0 30px 80px -30px #000", opacity: chrome }} />
      <div style={{ position: "relative", display: "flex", gap: 8, padding: "12px 16px", background: "#ffffff08", borderBottom: "1px solid #ffffff12", opacity: chrome }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: "#ffffff26" }} />)}
      </div>
      <div style={{ position: "relative", padding: "22px 26px", fontFamily: t.font.mono, fontSize: 30, lineHeight: 1.6, color: "#d7dbe6", minHeight: 120 }}>
        {rows.map((r, k) => (
          <div key={k} style={{ opacity: k < rows.length - 1 ? chrome : 1, whiteSpace: "pre" }}>
            {r}
            {cursor && k === rows.length - 1 && <span style={{ display: "inline-block", width: 16, height: 34, verticalAlign: "middle",
              background: "#d7dbe6", opacity: Math.floor(F / 15) % 2 ? 0 : 1 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// A generic chat window: a user bubble on the right, the reply on the left.
export const ChatWindow: React.FC<{ user: string; reply: React.ReactNode; width?: number }> = ({ user, reply, width = 900 }) => {
  const t = useTheme();
  return (
    <div style={{ width, borderRadius: t.radius, background: t.c.card, border: `1px solid ${t.c.border}`, padding: 28,
      display: "flex", flexDirection: "column", gap: 20, boxShadow: "0 30px 80px -30px #000c" }}>
      <Body size={20} mono muted>assistant · chat</Body>
      <div style={{ alignSelf: "flex-end", maxWidth: "70%", padding: "14px 20px", borderRadius: 18, background: alpha(t.c.accentA, 0.18),
        border: `1px solid ${alpha(t.c.accentA, 0.4)}` }}><Body size={32}>{user}</Body></div>
      <div style={{ alignSelf: "flex-start", maxWidth: "85%", padding: "14px 20px", borderRadius: 18, background: "#ffffff0d",
        minHeight: 48 }}><Body size={32}>{reply}</Body></div>
    </div>
  );
};

// The reply's sparkle sits inline with the text.
export const InlineEmoji: React.FC<{ name: string; size?: number }> = ({ name, size = 30 }) => (
  <span style={{ display: "inline-block", verticalAlign: "-0.15em", marginLeft: 6 }}><Emoji name={name} size={size} /></span>
);
