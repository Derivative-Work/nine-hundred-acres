// Verse 2, S23-S25 (infection 0.3, the haze lingering at 0.25): turbines stamp into a grid on the beat; on "Thirty-five"
// the counter runs to 35 and each turbine trails a gray plume; a call sidebar where "Wind" is muted, hand raised,
// never called on.
import React from "react";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card, Haze } from "../components/surface";
import { Body, Icon, Pill } from "../components/type";
import { shot } from "../timing";
import { Captions, clamp, useFrame } from "./kit";

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
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
