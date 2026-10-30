// Chorus 1, S16 (infection 0.15): "it never…" with both boxes left empty, then on "wired to everything" connector
// lines spider out from the server grid to every card on screen, the caption bar included.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Checklist, Cord, HumWave, TileGrid } from "../components/furniture";
import { Body, Icon } from "../components/type";
import { beatsBetween, line, shot, word } from "../timing";
import { Captions, ramp, useFrame } from "./kit";

export const Chorus1Wired: React.FC = () => {
  const F = useFrame();
  const s16 = shot("S16").frame;
  const sleep = word("L09", 3), stop = word("L09", 7), wired = line("L10").frame_start;
  const up = 214 * 86400 + 6 * 3600 + 12 * 60 + Math.floor((F - s16) / 30);
  const hms = `${Math.floor(up / 86400)}d ${String(Math.floor(up / 3600) % 24).padStart(2, "0")}:${String(Math.floor(up / 60) % 60).padStart(2, "0")}:${String(up % 60).padStart(2, "0")}`;
  const targets: [number, number][] = [[1330, 300], [1330, 640], [620, 800], [960, 975]];
  const b = beatsBetween(wired, wired + 200);
  return (
    <Infected value={0.15}>
      <AbsoluteFill>
        <Background glowAt={[35, 45]} />
        <Cord d="M -20 200 C 200 190, 260 240, 330 260" />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {targets.map(([x, y], k) => {
            const p = ramp(F, b[k] ?? wired, (b[k] ?? wired) + 10);
            return p > 0 && <path key={k} d={`M 860 470 C ${(860 + x) / 2} 470, ${(860 + x) / 2} ${y}, ${x} ${y}`} fill="none"
              stroke="#8a93b2" strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
          })}
          {targets.map(([x, y], k) => ramp(F, (b[k] ?? wired) + 10, (b[k] ?? wired) + 12) > 0 &&
            <circle key={k} cx={x} cy={y} r={7} fill="#2dd4bf" />)}
        </svg>
        <Card seed="c1grid" glow style={{ position: "absolute", left: 330, top: 210 }}>
          <Body size={22} mono muted style={{ marginBottom: 14 }}>room tiles · status</Body>
          <TileGrid cols={9} rows={5} tile={48} survivor={[4, 6]} />
        </Card>
        <Card seed="c1check" style={{ position: "absolute", left: 1330, top: 200, width: 360 }}>
          <Body size={22} mono muted style={{ marginBottom: 18 }}>it never…</Body>
          <Checklist items={["Sleep", "Stop"].filter((_, k) => F >= [sleep, stop][k])} />
        </Card>
        <Card seed="c1up" style={{ position: "absolute", left: 1330, top: 560, width: 360 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Icon name="power" size={26} color="#2dd4bf" /><Body size={22} mono muted>Uptime</Body></div>
          <Body size={40} mono style={{ marginTop: 8 }}>{hms}</Body>
        </Card>
        <div style={{ position: "absolute", left: 330, top: 760 }}><HumWave width={560} height={110} /></div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
