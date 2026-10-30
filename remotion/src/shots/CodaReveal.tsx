// Coda, S45-S47 (infection dropping to 0): over the frozen, drained bridge the cards fade out one per sung word,
// the last cornstalk last; in the gap the real Suno generation capture fades up in a plain window (a placeholder
// until the human supplies it, H3); push in on the take list, the first generation highlighted (S46); the window
// shrinks and drops into the S09 server grid as one more tile (S47), which then winks out with the grid.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { useChrome } from "../chrome/context";
import { Card } from "../components/surface";
import { TileGrid } from "../components/furniture";
import { Body } from "../components/type";
import { line, shot } from "../timing";
import { BridgeNeedle } from "./Bridge";
import { Captions, clamp, ramp, useFrame } from "./kit";

const Placeholder: React.FC<{ hi: number }> = ({ hi }) => (
  <div style={{ width: 1100, height: 640, borderRadius: 12, background: "#f4f4f2", overflow: "hidden", boxShadow: "0 40px 100px -30px #000" }}>
    <div style={{ height: 38, background: "#e4e4e0", display: "flex", gap: 8, alignItems: "center", padding: "0 14px" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: "#c9c9c4" }} />)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: 28, height: 560, boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Body size={20} mono style={{ color: "#666" }}>style prompt</Body><div style={{ height: 90, background: "#e6e6e2", borderRadius: 8 }} />
        <Body size={20} mono style={{ color: "#666" }}>lyrics</Body><div style={{ flex: 1, background: "#e6e6e2", borderRadius: 8 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Body size={20} mono style={{ color: "#666" }}>take list</Body>
        {[0, 1].map((k) => <div key={k} style={{ height: 70, borderRadius: 8, background: k === 0 ? `rgba(255,176,0,${0.2 + 0.5 * hi})` : "#e6e6e2",
          border: k === 0 ? `3px solid rgba(255,140,0,${hi})` : "none" }} />)}
        <Body size={22} style={{ color: "#999", marginTop: 20 }}>[the real Suno generation capture goes here: supplied by the human]</Body>
      </div>
    </div>
  </div>
);

export const CodaReveal: React.FC = () => {
  const F = useFrame();
  const s45 = shot("S45").frame, s46 = shot("S46").frame, s47 = shot("S47").frame, s48 = shot("S48").frame;
  const w = line("L27").words.map((x) => x.frame);
  const fade = (k: number) => ramp(F, w[[1, 2, 3, 5][k]], w[[1, 2, 3, 5][k]] + 8);
  const capture = ramp(F, w[5] + 4, w[5] + 24);
  const push = spring({ frame: F - s46, fps: 30, config: { damping: 200 } });
  const drop = spring({ frame: F - s47, fps: 30, config: { damping: 200 }, durationInFrames: 40 });
  const gridIn = ramp(F, s47, s47 + 12);
  const wink = ramp(F, s48 - 14, s48 - 4);
  // the capture's scale and place: full → pushed in on the take list → one tile in the grid
  const scale = interpolate(drop, [0, 1], [1 + 0.6 * push, 0.05]);
  const x = interpolate(drop, [0, 1], [-260 * push, 393]), y = interpolate(drop, [0, 1], [-60 * push, 172]);
  return (
    <Infected value={interpolate(F, [s45, w[5]], [0.75, 0], clamp)}>
      <AbsoluteFill style={{ background: useChrome() ? "transparent" : "#000" }}>
        <AbsoluteFill style={{ opacity: 1 - capture }}><BridgeNeedle fade={fade} captions={false} /></AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: gridIn * (1 - wink) }}>
          <Card seed="codagrid"><TileGrid cols={12} rows={6} tile={62} survivor={[-1, -1]} /></Card>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: capture * (1 - wink) }}>
          <div style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}><Placeholder hi={push} /></div>
        </AbsoluteFill>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
