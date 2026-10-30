// Verse 1, S07-S09 (infection 0): the annexation polygon and its counter, the "Why?" tooltip, the corn grid
// flipping row by row into server tiles on the eighth notes. One cornstalk survives in the last row.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Cord, TileGrid } from "../components/furniture";
import { Body, Emoji, Pill } from "../components/type";
import { shot, word } from "../timing";
import { Captions, clamp, ramp, useFrame } from "./kit";

const EIGHTH = 7; // frames: an eighth note at ~130 bpm

export const Verse1Annex: React.FC = () => {
  const F = useFrame();
  const s07 = shot("S07").frame, s08 = shot("S08").frame, s09 = shot("S09").frame;
  const grow = spring({ frame: F - s07, fps: 30, config: { damping: 200 } });
  const acres = Math.round(900 * ramp(F, s07, word("L02", 4) + 12));
  const why = spring({ frame: F - s08, fps: 30, config: { damping: 200 } });
  const dismiss = ramp(F, s08 + 48, s08 + 54);
  return (
    <Infected value={0}>
      <AbsoluteFill>
        <Background glowAt={[50, 50]} />
        <Cord d="M -20 560 C 200 560, 300 520, 470 520" />
        <div style={{ position: "absolute", left: 90, top: 80, display: "flex", gap: 16, alignItems: "center" }}>
          <Pill tone="accent" size={26}><Emoji name="corn" size={30} /> Salix, IA</Pill>
          <Pill size={26}>Annexed: <span style={{ fontFamily: "'JetBrains Mono'", minWidth: 70, textAlign: "right" }}>{acres}</span> acres</Pill>
        </div>
        <Card seed="v1grid" glow style={{ position: "absolute", left: 470, top: 190 }}>
          <div style={{ position: "relative" }}>
            <TileGrid cols={12} rows={6} tile={62} rowFlip={(r) => ramp(F, s09 + r * EIGHTH, s09 + r * EIGHTH + 8)} survivor={[5, 9]} />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: -10, width: "calc(100% + 20px)",
              height: "calc(100% + 20px)", transform: `scale(${grow})`, transformOrigin: "40% 55%", opacity: 1 - ramp(F, s09, s09 + 20) }}>
              <polygon points="6,12 58,4 94,18 97,70 70,96 22,92 3,60" fill="#ff7a3d1a" stroke="#ff7a3d" strokeWidth={0.5}
                strokeDasharray="2 1.4" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />
            </svg>
            {F >= s08 && dismiss < 1 && (
              <div style={{ position: "absolute", left: 640, top: -40, transform: `scale(${why * (1 - dismiss)})`, transformOrigin: "bottom left" }}>
                <div style={{ padding: "12px 22px", borderRadius: 12, background: "#e8ecf8", color: "#0a0f1f" }}>
                  <Body size={30} style={{ color: "#0a0f1f", fontWeight: 600 }}>Why?</Body>
                </div>
              </div>
            )}
            {F >= s08 + 48 && F < s08 + 66 && (
              <div style={{ position: "absolute", left: 700, top: -10, width: 30, height: 30, borderRadius: 15,
                border: "3px solid #e8ecf8", transform: `scale(${interpolate(F, [s08 + 48, s08 + 66], [0.4, 2.2], clamp)})`,
                opacity: 1 - ramp(F, s08 + 48, s08 + 66) }} />
            )}
          </div>
        </Card>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
