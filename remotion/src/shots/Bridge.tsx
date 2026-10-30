// Bridge, S42-S44 (infection 0.6 rising to 0.75): the reply streams in token by token while the energy meter ticks
// per token; the $29B chart's error bars widen; on "used a little more electricity" the meter becomes a spinning
// record and the cards start to swirl like a lava lamp, building as if toward a solo. Then the needle lifts (a
// visual beat: the band plays on), the swirl freezes mid-turn and drains of color.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Body, Icon } from "../components/type";
import { downbeats, line, shot } from "../timing";
import { ChatWindow, Captions, InlineEmoji, clamp, ramp, useFrame } from "./kit";

const TOKENS = ["That's", " a", " really", " great", " question!"];
const MORE = [" Estimates", " vary", " widely."];

export const BridgeNeedle: React.FC = () => {
  const live = useFrame();
  const s42 = shot("S42").frame, s43 = shot("S43").frame, s44 = shot("S44").frame;
  // the needle lifts on the last downbeat at least half a second before the coda's first word
  const coda = line("L27").frame_start;
  const lift = Math.max(...downbeats.filter((d) => d <= coda - 15));
  const F = Math.min(live, lift); // the swirl freezes at the lift
  const n1 = Math.min(TOKENS.length + 1, Math.max(0, Math.floor((live - s42) / 4)));
  const n2 = Math.min(MORE.length, Math.max(0, Math.floor((live - s43) / 4)));
  const tokens = n1 + n2;
  const build = ramp(F, s44, lift);
  const swirl = 40 * build * build;
  const drain = ramp(live, lift, lift + 24);
  const infection = interpolate(F, [s42, s44, lift], [0.6, 0.65, 0.75], clamp);
  const err = interpolate(live, [s43, s43 + 90], [30, 260], clamp);
  const record = ramp(live, s44 + 20, s44 + 45);
  const arm = interpolate(live, [lift, lift + 8], [0, -24], clamp);
  const card = (k: number): React.CSSProperties => ({ transform: `rotate(${swirl * (k % 2 ? 1 : -1) * (0.6 + 0.2 * k)}deg) scale(${1 - 0.06 * build})` });
  return (
    <Infected value={infection}>
      <AbsoluteFill style={{ filter: `saturate(${1 - drain})` }}>
        <Background glowAt={[45, 50]} />
        <div style={{ position: "absolute", left: 90, top: 230, ...card(0) }}>
          <ChatWindow user="why is my bill up?" reply={<>
            {TOKENS.slice(0, n1).join("")}{n1 > TOKENS.length && <InlineEmoji name="sparkles" />}{MORE.slice(0, n2).join("")}
          </>} width={860} />
        </div>
        <Card seed="bchart" style={{ position: "absolute", left: 1080, top: 420, width: 640, height: 470, ...card(1) }}>
          <Body size={22} mono muted>Data center costs to ratepayers</Body>
          <div style={{ position: "relative", height: 300, marginTop: 20, borderLeft: "2px solid #ffffff33", borderBottom: "2px solid #ffffff33" }}>
            <div style={{ position: "absolute", left: 230, bottom: 0, width: 140, height: 240, background: "linear-gradient(#ffb000, #e2367a)", borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "absolute", left: 298, bottom: 240 - err / 2, width: 4, height: err, background: "#fff1dc" }} />
            {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: 280, bottom: 240 + (s * err) / 2, width: 40, height: 4, background: "#fff1dc" }} />)}
            <Body size={28} style={{ position: "absolute", left: 230, bottom: 250 + err / 2, fontWeight: 600 }}>$29B (est.)</Body>
          </div>
          <Body size={18} muted style={{ marginTop: 10 }}>PJM ratepayers, ~2 years, per its market monitor</Body>
        </Card>
        <Card seed="benergy" glow style={{ position: "absolute", left: 1300, top: 60, width: 420, ...card(2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="zap" size={28} color="#ffb000" /><Body size={24} mono muted>Energy used</Body>
          </div>
          <div style={{ position: "relative", height: 150, marginTop: 14 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", gap: 6, alignItems: "flex-end", opacity: 1 - record }}>
              {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ flex: 1, height: `${20 + k * 6}%`, borderRadius: 4,
                background: k < tokens ? "#ffb000" : "#ffffff14" }} />)}
            </div>
            <div style={{ position: "absolute", left: 100, top: -20, width: 190, height: 190, opacity: record }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `rotate(${F * 9}deg)`,
                background: "repeating-radial-gradient(circle, #111 0 3px, #222 3px 5px)" }}>
                <div style={{ position: "absolute", inset: 66, borderRadius: "50%", background: "conic-gradient(#ff5e3a, #ffb000, #3bd16f, #2ea6ff, #9b5cff, #ff3d8b, #ff5e3a)" }} />
              </div>
              <div style={{ position: "absolute", left: 160, top: -10, width: 8, height: 150, borderRadius: 4, background: "#d9d9d9",
                transformOrigin: "top center", transform: `rotate(${28 + arm}deg)` }} />
            </div>
          </div>
        </Card>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
