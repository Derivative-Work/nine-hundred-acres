// Verse 1, S07-S09 (infection 0): the annexation polygon and its counter, the "Why?" tooltip, the corn grid
// flipping row by row into server tiles on the eighth notes. One cornstalk survives in the last row.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Cord, HumWave, TileGrid } from "../components/furniture";
import { Farmhouse, MAP_BOX, MAP_PINS, MapView } from "../components/illustrations";
import { Body, Emoji, Pill } from "../components/type";
import { shot, word } from "../timing";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
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
        <StatRow x={1480} y={200} column>
          <Stat at={s07} label="acres annexed" value={900} tick={word("L02", 4) + 12 - s07} emoji="corn" />
          <Stat at={s08 + 8} label="reason given" value="—" />
          <Stat at={s09 + 4} label="windows" value="0" />
        </StatRow>
        <Note at={s07 + 18} x={420} y={760} tx={600} ty={655} until={s09}>annexation boundary</Note>
        <Note at={s09 + 40} x={1300} y={780} tx={1162} ty={622}>1 stalk left</Note>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};

// S05-S06: the title card shrinks into the map card, which zooms from the US to northwest Iowa and drops the Salix
// pin; then the corn grid fades up row by row (bottom up, on the beat) and keeps growing past the top of the frame.
export const Verse1Map: React.FC = () => {
  const F = useFrame();
  const s05 = shot("S05").frame, s06 = shot("S06").frame;
  const zoom = spring({ frame: F - s05 - 8, fps: 30, config: { damping: 200 }, durationInFrames: 50 });
  const [sx, sy] = MAP_PINS["Salix, IA"];
  const view = MAP_BOX.map((v, k) => v + (([sx - 90, sy - 60, 180, 120][k]) - v) * zoom);
  const enter = spring({ frame: F - s05, fps: 30, config: { damping: 200 } });
  const aside = spring({ frame: F - s06, fps: 30, config: { damping: 200 } });
  return (
    <Infected value={0}>
      <AbsoluteFill>
        <Background glowAt={[50, 50]} />
        <Cord d="M -20 560 C 200 560, 300 520, 470 520" progress={ramp(F, s06, s06 + 30)} />
        <div style={{ position: "absolute", left: 360, top: 150, transformOrigin: "top left",
          transform: `translate(${-aside * 270}px, ${-aside * 80}px) scale(${(0.6 + 0.4 * enter) * (1 - 0.6 * aside)})`, opacity: 1 - 0.3 * aside }}>
          <Card seed="map" glow>
            <MapView view={view} width={1140} height={700} hi="Iowa" pins={[{ name: "Salix, IA", drop: ramp(F, s05 + 55, s05 + 70) }]} />
          </Card>
        </div>
        {F >= s06 && (
          <Card seed="v1grid" glow style={{ position: "absolute", left: 470, top: 190, opacity: ramp(F, s06, s06 + 8) }}>
            <TileGrid cols={12} rows={6} tile={62} rowFlip={() => 0} survivor={[5, 9]} />
          </Card>
        )}
        {F >= s06 && <CornRise from={s06} />}
        <StatRow x={1540} y={230} column>
          <Stat at={s05 + 20} label="state" value="Iowa" />
          <Stat at={s05 + 60} label="region" value="northwest" />
          <Stat at={s06} label="crop" value="corn" emoji="corn" />
          <Stat at={word("L01", 10)} label="height" value="the sky" />
        </StatRow>
        <Cursor keys={[[s05 + 40, 1300, 800], [s05 + 62, 962, 515, true], [s05 + 80, 975, 530]]} />
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};

// The corn rows fade up from the bottom on the beat, and stalks keep climbing out of the top of the frame.
const CornRise: React.FC<{ from: number }> = ({ from }) => {
  const F = useFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 495, top: 215, width: 920, height: 470, background: "#111a33",
        clipPath: `inset(0 0 ${Math.min(100, ramp(F, from, from + 60) * 100)}% 0)` }} />
      {Array.from({ length: 12 }, (_, k) => {
        const rise = Math.max(0, F - from - 40 - k * 3) * (3 + (k % 3));
        return <div key={k} style={{ position: "absolute", left: 503 + k * 73.2, top: 160 - rise, opacity: ramp(F, from + 40, from + 50) }}>
          {[0, 1, 2, 3].map((q) => <Emoji key={q} name="corn" size={44} style={{ marginBottom: 20, opacity: 0.8 - q * 0.15 }} />)}
        </div>;
      })}
    </AbsoluteFill>
  );
};

// S10-S11: granddad.jpg slides in over the server grid and gets an "archived" badge; then "The Hum" runs across the
// bottom third and stays through the chorus.
export const Verse1Granddad: React.FC = () => {
  const F = useFrame();
  const s10 = shot("S10").frame, s11 = shot("S11").frame;
  const slide = spring({ frame: F - s10, fps: 30, config: { damping: 200 } });
  const badge = spring({ frame: F - s10 - 55, fps: 30, config: { damping: 14 } });
  const hum = spring({ frame: F - s11, fps: 30, config: { damping: 200 } });
  return (
    <Infected value={0}>
      <AbsoluteFill>
        <Background glowAt={[50, 45]} />
        <Cord d="M -20 560 C 200 560, 300 520, 470 520" />
        <div style={{ position: "absolute", left: 470, top: 190, transform: `translateY(${-hum * 90}px) scale(${1 - 0.15 * hum})`, transformOrigin: "top center" }}>
          <Card seed="v1grid">
            <TileGrid cols={12} rows={6} tile={62} survivor={[5, 9]} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1180, top: 300, transform: `translateX(${(1 - slide) * 700}px) rotate(${4 - 2 * slide}deg)`,
          transformOrigin: "center", opacity: 1 - 0.4 * hum }}>
          <div style={{ padding: 14, paddingBottom: 54, background: "#f4f1ea", borderRadius: 18, boxShadow: "0 30px 70px -20px #000" }}>
            <div style={{ borderRadius: 8, overflow: "hidden", filter: `grayscale(${0.8 * ramp(F, s10 + 55, s10 + 70)})` }}><Farmhouse width={420} /></div>
            <Body size={24} mono style={{ color: "#333", marginTop: 12 }}>granddad.jpg</Body>
          </div>
          <div style={{ position: "absolute", right: -20, top: -20, transform: `scale(${badge})` }}><Pill size={24}>archived</Pill></div>
        </div>
        <div style={{ position: "absolute", left: 160, top: 760, opacity: hum }}><HumWave width={1600} height={170} /></div>
        <Note at={s10 + 22} x={1720} y={250} tx={1420} ty={340} until={s11}>family photo · 1 of 1</Note>
        <StatRow x={60} y={220} column>
          <Stat at={s10 + 56} label="status" value="archived" />
          <Stat at={s11 + 6} label="crop yield" value="1 hum" />
        </StatRow>
        <Note at={s11 + 16} x={420} y={700} tx={560} ty={845}>amplitude: constant</Note>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
