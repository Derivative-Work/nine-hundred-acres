// Verse 3, S36-S37 (infection 0.5): the orange extension cord runs from the reactor card to the server grid with
// power pulsing along it; S36a's thermal sweep turns the status dots into a tie-dye heat map (three flower tiles);
// then the "Against ↔ For" slider ping-pongs beside a "Thinking…" spinner.
import React from "react";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
import { AbsoluteFill, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Cord, TileGrid } from "../components/furniture";
import { Body, Heading, Icon, Pill } from "../components/type";
import { shot } from "../timing";
import { Captions, ramp, useFrame } from "./kit";

const PATH = "M 600 470 C 760 470, 820 420, 960 430";

export const Verse3Feed: React.FC = () => {
  const F = useFrame();
  const s36 = shot("S36").frame, s37 = shot("S37").frame;
  const heat = ramp(F, s36 + 20, s36 + 70);
  const slider = spring({ frame: F - s37, fps: 30, config: { damping: 200 } });
  const knob = 0.5 + 0.42 * Math.sin((F - s37) / 8);
  return (
    <Infected value={0.5}>
      <AbsoluteFill>
        <Background glowAt={[55, 45]} />
        <div style={{ position: "absolute", left: 110, top: 70 }}><Heading size={84} gradient>Restarting to feed the machines</Heading></div>
        <Card seed="v3reactor" glow style={{ position: "absolute", left: 110, top: 300, width: 490 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="zap" size={40} color="#ffb000" />
            <Body size={30} style={{ fontWeight: 600 }}>Crane Clean Energy Center</Body>
          </div>
          <Body size={24} muted style={{ marginTop: 10 }}>formerly Three Mile Island Unit 1</Body>
          <div style={{ marginTop: 18 }}><Pill tone="success">Restoring</Pill></div>
        </Card>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={PATH} fill="none" stroke="#ff8a1f" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - ramp(F, s36, s36 + 20)} style={{ filter: "drop-shadow(0 0 8px #ff8a1f88)" }} />
          {F > s36 + 20 && <path d={PATH} fill="none" stroke="#fff4c2" strokeWidth={5} strokeLinecap="round" pathLength={1}
            strokeDasharray="0.03 0.17" strokeDashoffset={-(F - s36) / 25} />}
        </svg>
        <Cord d="M -180 950 C 380 950, 600 860, 600 560" />
        <Card seed="v3grid" glow style={{ position: "absolute", left: 960, top: 260 }}>
          <div style={{ position: "relative" }}>
            <TileGrid cols={10} rows={6} tile={60} survivor={[5, 8]} heat={heat} />
            {heat > 0 && heat < 1 && <div style={{ position: "absolute", top: -10, bottom: -10, left: `${heat * 100}%`, width: 10,
              background: "linear-gradient(90deg, transparent, #ffffffcc, transparent)", boxShadow: "0 0 30px #fff" }} />}
          </div>
        </Card>
        <Card seed="v3slider" style={{ position: "absolute", left: 600, top: 760, width: 720, opacity: slider }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Body size={26}>Against</Body>
            <div style={{ position: "relative", flex: 1, height: 8, borderRadius: 4, background: "#ffffff22" }}>
              <div style={{ position: "absolute", top: -12, left: `calc(${knob * 100}% - 16px)`, width: 32, height: 32, borderRadius: 16, background: "#fff1dc" }} />
            </div>
            <Body size={26}>For</Body>
            <Icon name="loader-circle" size={28} color="#ffb000" style={{ transform: `rotate(${F * 9}deg)` }} />
            <Body size={24} muted>Thinking…</Body>
          </div>
        </Card>
        <StatRow x={110} y={540} column>
          <Stat at={s36 + 10} label="destination" value="the machines" emoji="plug" />
          <Stat at={s36 + 55} label="heat map" value="tie-dye" />
        </StatRow>
        <Note at={s36 + 70} x={1760} y={850} tx={1589} ty={677}>still corn</Note>
        <Cursor keys={[[s37 + 6, 900, 960], [s37 + 22, 940, 795, true], [s37 + 36, 1080, 798], [s37 + 52, 820, 798], [s37 + 70, 1060, 798]]} />
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
