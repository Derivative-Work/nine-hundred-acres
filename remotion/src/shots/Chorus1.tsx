// Chorus 1, S16 (infection 0.15): "it never…" with both boxes left empty, then on "wired to everything" connector
// lines spider out from the server grid to every card on screen, the caption bar included.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Checklist, Cord, HumWave, TileGrid } from "../components/furniture";
import { Body, Emoji, Icon, Pill } from "../components/type";
import { Fireflies } from "../components/illustrations";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
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
        <Cursor keys={[[sleep + 4, 1150, 640], [sleep + 22, 1384, 300, true], [sleep + 34, 1386, 302, true], [stop + 12, 1384, 365, true], [stop + 28, 1390, 370, true]]} />
        <Note at={stop + 30} x={1700} y={470} tx={1405} ty={365} until={wired + 40}>can't check</Note>
        <StatRow x={1330} y={820}>
          <Stat at={sleep} label="sleep" value="0 h" />
          <Stat at={stop} label="stops" value="0" />
        </StatRow>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};

// S12-S15: the hum fills the frame ("Hum: always"); it ripples through the surviving corn, and zooming in, the
// crickets between the rows are tiny spinning fans; 1,000 room tiles stagger in; "Uptime" starts and a day/night
// slider sweeps to night, the tiles stay lit, and fireflies blink at exactly the status-dot rate.
export const Chorus1Hum: React.FC = () => {
  const F = useFrame();
  const s12 = shot("S12").frame, s13 = shot("S13").frame, s14 = shot("S14").frame, s15 = shot("S15").frame;
  const big = 1 - ramp(F, s13 - 6, s13 + 10);
  const corn = ramp(F, s13, s13 + 10) * (1 - ramp(F, s14 - 6, s14 + 6));
  const zoom = 1 + 0.7 * ramp(F, s13 + 20, s14 - 10);
  const tiles = ramp(F, s14 - 4, s14 + 6);
  const night = ramp(F, s15 + 10, s15 + 50);
  const up = Math.max(0, Math.floor((F - s15) / 30));
  return (
    <Infected value={0.15}>
      <AbsoluteFill>
        <Background glowAt={[50, 50]} />
        <AbsoluteFill style={{ background: "#000", opacity: 0.45 * night }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: big }}>
          <HumWave width={1700} height={420} label={false} />
          <div style={{ position: "absolute", left: 140, top: 140 }}><Pill tone="accent" size={34}>Hum: always</Pill></div>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: corn, transform: `scale(${zoom})` }}>
          <div style={{ display: "flex", gap: 60, alignItems: "flex-end" }}>
            {Array.from({ length: 5 }, (_, k) => (
              <React.Fragment key={k}>
                <Emoji name="corn" size={130} style={{ transform: `translateY(${10 * Math.sin((F - s13) / 5 - k)}px) rotate(${4 * Math.sin((F - s13) / 7 - k)}deg)` }} />
                {k < 4 && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Icon name="fan" size={34} color="#8a93b2" style={{ transform: `rotate(${F * 25}deg)` }} />
                  <Body size={16} mono muted>cricket</Body>
                </div>}
              </React.Fragment>
            ))}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: tiles }}>
          <div style={{ position: "relative" }}>
            <TileGrid cols={40} rows={25} tile={26} survivor={[24, 31]} rowFlip={() => 1} />
            <AbsoluteFill style={{ background: "#0a0f1f", clipPath: `inset(${ramp(F, s14, s14 + 30) * 100}% 0 0 0)` }} />
            <Fireflies n={22} w={1300} h={800} opacity={night} />
          </div>
        </AbsoluteFill>
        <Note at={s12 + 12} x={1560} y={250} tx={1340} ty={420} until={s13 - 6}>period: forever</Note>
        <Note at={s12 + 30} x={360} y={800} tx={520} ty={680} until={s13 - 6}>volume: steady</Note>
        <Note at={s13 + 6} x={495} y={330} tx={495} ty={505} until={s13 + 22}>cricket? no: fan</Note>
        <Cursor keys={[[s14 + 24, 1250, 900], [s14 + 48, 705, 425], [s14 + 62, 706, 426, true]]} />
        <Note at={s14 + 64} x={960} y={330} tx={706} ty={426} until={s15 + 30}>room 0412 · thinking…</Note>
        <StatRow x={60} y={170} column>
          <Stat at={s14 + 10} label="rooms" value={1000} tick={30} />
          <Stat at={s15 + 20} label="sleep scheduled" value="never" />
        </StatRow>
        {F >= s15 && (
          <div style={{ position: "absolute", right: 60, top: 50, display: "flex", flexDirection: "column", gap: 16, opacity: ramp(F, s15, s15 + 10) }}>
            <Card seed="up"><Body size={22} mono muted>Uptime</Body><Body size={40} mono>{`214d 06:12:${String(5 + up).padStart(2, "0")}`}</Body></Card>
            <Card seed="dn"><div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon name="sparkles" size={24} color="#ffb000" />
              <div style={{ position: "relative", width: 200, height: 8, borderRadius: 4, background: "#ffffff22" }}>
                <div style={{ position: "absolute", top: -10, left: night * 172, width: 28, height: 28, borderRadius: 14, background: "#e8ecf8" }} />
              </div>
              <Body size={22} muted>night</Body></div></Card>
          </div>
        )}
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
