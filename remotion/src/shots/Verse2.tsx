// Verse 2, S23-S25 (infection 0.3, the haze lingering at 0.25): turbines stamp into a grid on the beat; on "Thirty-five"
// the counter runs to 35 and each turbine trails a gray plume; a call sidebar where "Wind" is muted, hand raised,
// never called on.
import React from "react";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card, Haze } from "../components/surface";
import { Body, Icon, Pill } from "../components/type";
import { beatsBetween, shot, word } from "../timing";
import { Checklist } from "../components/furniture";
import { Cobweb } from "../components/illustrations";
import { Captions, clamp, ramp, useFrame } from "./kit";

const Turbine: React.FC<{ born: number; k: number }> = ({ born, k }) => {
  const F = useFrame();
  const stamp = interpolate(F, [born, born + 6], [1.7, 1], clamp);
  return (
    <div style={{ position: "relative", width: 86, height: 86, display: "grid", placeItems: "center", borderRadius: 16,
      background: "#ffffff0a", border: "1px solid #ffffff14", transform: `scale(${stamp})`, opacity: F >= born ? 1 : 0 }}>
      <Icon name="fan" size={54} color="#c8cede" style={{ transform: `rotate(${(F - born) * 14 + k * 20}deg)` }} />
      {[0, 1, 2].map((q) => {
        const ph = ((F - born) / 40 + q / 3 + random(`pl${k}`)) % 1;
        return <div key={q} style={{ position: "absolute", left: 30 + 10 * Math.sin(ph * 5 + k), top: -10 - ph * 60, width: 26 + ph * 30,
          height: 26 + ph * 30, borderRadius: "50%", background: "#9a9a9a", opacity: (F >= born + 10 ? 0.35 : 0) * (1 - ph), filter: "blur(4px)" }} />;
      })}
    </div>
  );
};

export const Verse2Turbines: React.FC = () => {
  const F = useFrame();
  const s23 = shot("S23").frame, s24 = shot("S24").frame, s25 = shot("S25").frame;
  const n = Math.floor(interpolate(F, [s23, s24, s24 + 45], [0, 18, 35], clamp));
  const born = (k: number) => (k < 18 ? s23 + (k * (s24 - s23)) / 18 : s24 + ((k - 18) * 45) / 17);
  const side = spring({ frame: F - s25, fps: 30, config: { damping: 200 } });
  const people = ["Operator", "Contractor", "Consultant", "Wind"];
  return (
    <Infected value={0.3}>
      <AbsoluteFill>
        <Background glowAt={[40, 50]} />
        <div style={{ position: "absolute", left: 90, top: 70, display: "flex", gap: 16 }}>
          <Pill size={26}><Icon name="map-pin" size={26} color="#ff7a3d" /> South Memphis, TN</Pill>
          <Pill tone="accent" size={26}>Turbines: <span style={{ fontFamily: "'JetBrains Mono'" }}>{n}</span></Pill>
        </div>
        <Card seed="v2grid" style={{ position: "absolute", left: 90, top: 180 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 86px)", gap: 16 }}>
            {Array.from({ length: 35 }, (_, k) => <Turbine key={k} k={k} born={born(k)} />)}
          </div>
        </Card>
        <Card seed="v2call" style={{ position: "absolute", left: 1300, top: 180, width: 480, opacity: side, transform: `translateX(${(1 - side) * 40}px)` }}>
          <Body size={22} mono muted style={{ marginBottom: 18 }}>permit call · 4 participants</Body>
          {people.map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: "1px solid #ffffff12" }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: p === "Wind" ? "#2ea6ff33" : "#ffffff1a", display: "grid", placeItems: "center" }}>
                <Icon name={p === "Wind" ? "wind" : "briefcase"} size={24} color={p === "Wind" ? "#7cc4ff" : "#c8cede"} />
              </div>
              <Body size={30}>{p}</Body>
              {p === "Wind" && <>
                <Icon name="hand" size={30} color="#ffb000" style={{ marginLeft: "auto", transform: `translateY(${Math.sin(F / 6) * 3}px)` }} />
                <Icon name="mic-off" size={28} color="#f43f5e" />
              </>}
            </div>
          ))}
        </Card>
        <Haze amount={0.25} />
        <StatRow x={920} y={200} column>
          <Stat at={s24 + 20} label="air permits" value="0" />
          <Stat at={s25} label="wind consulted" value="no" emoji="dash" />
        </StatRow>
        <Note at={s24 + 30} x={1000} y={640} tx={190} ty={250} until={s25 + 40}>exhaust</Note>
        <Cursor keys={[[s25 + 20, 1100, 800], [s25 + 45, 1660, 472], [s25 + 70, 1640, 480], [s25 + 90, 1300, 700]]} />
        <div style={{ position: "absolute", left: 1300, top: 580 }}>
          <Stat at={s25 + 30} label="hand raised for" value={`${Math.max(0, Math.floor((F - s25 - 30) / 30))} s`} />
        </div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};

// S26-S27: the checklist with every box left empty and the permit office's "Back in 5 minutes" under a cobweb; then
// the haze thickens over a row of buildings, one a schoolhouse, and settles back; three briefcases knock at a door.
export const Verse2Permit: React.FC = () => {
  const F = useFrame();
  const s26 = shot("S26").frame, s27 = shot("S27").frame, s32 = shot("S32").frame;
  const items = ["Permit", "Notice", "Asked the wind"].filter((_, k) => F >= [word("L15", 1), word("L15", 6), word("L15", 9)][k]);
  const office = spring({ frame: F - s26 - 20, fps: 30, config: { damping: 200 } });
  const row = spring({ frame: F - s27, fps: 30, config: { damping: 200 } });
  const haze = interpolate(F, [s27, s27 + 20, s27 + 90, s32 - 20], [0.25, 0.7, 0.7, 0.25], clamp);
  const lawyers = word("L16", 8);
  const beat = beatsBetween(lawyers, lawyers + 120);
  const knock = beat.some((b) => F >= b && F < b + 5);
  return (
    <Infected value={0.3}>
      <AbsoluteFill>
        <Background glowAt={[40, 40]} />
        <AbsoluteFill style={{ opacity: 1 - ramp(F, s27 - 6, s27 + 6) }}>
          <Card seed="permit" style={{ position: "absolute", left: 160, top: 220, width: 620 }}>
            <Body size={22} mono muted style={{ marginBottom: 18 }}>before you build</Body>
            <Checklist items={items} />
          </Card>
          <Card seed="office" style={{ position: "absolute", left: 1000, top: 200, width: 640, opacity: office, transform: `translateY(${(1 - office) * 14}px)` }}>
            <Cobweb size={160} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Icon name="door-closed" size={34} color="#c8cede" /><Body size={30} style={{ fontWeight: 600 }}>Permit office</Body></div>
            <div style={{ marginTop: 24, padding: "20px 24px", borderRadius: 10, background: "#fbf4e2", width: "fit-content", transform: "rotate(-2deg)" }}>
              <div style={{ fontFamily: "Caveat", fontWeight: 700, fontSize: 48, color: "#2a1d12" }}>Back in 5 minutes</div>
            </div>
          </Card>
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ramp(F, s27 - 6, s27 + 6) }}>
          <div style={{ position: "absolute", left: 140, top: 520, display: "flex", gap: 40, transform: `translateY(${(1 - row) * 20}px)` }}>
            {["house", "house", "school", "house", "house"].map((ic, k) => (
              <Card key={k} seed={`b${k}`} style={{ width: 150 }}><Icon name={ic} size={86} color={ic === "school" ? "#ffb000" : "#c8cede"} /></Card>
            ))}
          </div>
          <Card seed="door" style={{ position: "absolute", left: 1320, top: 300, width: 330, height: 440 }}>
            <Icon name="door-closed" size={200} color="#c8cede" style={{ margin: "40px auto 0", transform: knock ? "translateX(3px)" : undefined }} />
          </Card>
          {F >= lawyers && [0, 1, 2].map((k) => {
            const walk = spring({ frame: F - lawyers - k * 6, fps: 30, config: { damping: 200 } });
            return <div key={k} style={{ position: "absolute", left: 1000 + k * 95 + (1 - walk) * -300, top: 600 + (k % 2) * 30,
              transform: `translateY(${knock ? -6 : 0}px)` }}><Icon name="briefcase" size={80} color="#e8ecf8" /></div>;
          })}
        </AbsoluteFill>
        <Haze amount={haze} />
        <AbsoluteFill style={{ opacity: 1 - ramp(F, s27 - 6, s27 + 6) }}>
          <StatRow x={160} y={560}>
            <Stat at={word("L15", 1)} label="permits filed" value="0" />
            <Stat at={word("L15", 6)} label="notices posted" value="0" />
          </StatRow>
        </AbsoluteFill>
        <Cursor keys={[[s26 + 40, 900, 800], [s26 + 64, 1110, 255, true], [s26 + 78, 1112, 257, true], [s27 - 10, 1000, 600]]} />
        <Note at={s26 + 80} x={1500} y={560} tx={1110} ty={255} until={s27 - 6}>no answer</Note>
        <Note at={s27 + 20} x={595} y={400} tx={595} ty={560}>schoolhouse</Note>
        <StatRow x={140} y={240} column>
          <Stat at={s27 + 10} label="visibility" value="low" emoji="fog" />
        </StatRow>
        <div style={{ position: "absolute", left: 1320, top: 790 }}><Stat at={lawyers} label="lawyers at door" value={3} tick={10} /></div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
