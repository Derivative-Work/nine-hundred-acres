// Bridge, S42-S44 (infection 0.6 rising to 0.75): the reply streams in token by token while the energy meter ticks
// per token; the $29B chart's error bars widen; on "used a little more electricity" the meter becomes a spinning
// record and the cards start to swirl like a lava lamp, building as if toward a solo. Then the needle lifts (a
// visual beat: the band plays on), the swirl freezes mid-turn and drains of color.
import React from "react";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Body, Emoji, Icon } from "../components/type";
import { downbeats, line, shot } from "../timing";
import { ChatWindow, Captions, InlineEmoji, clamp, ramp, useFrame } from "./kit";

const TOKENS = ["That's", " a", " really", " great", " question!"];
const MORE = [" Estimates", " vary", " widely."];

// `fade(k)` (0..1) fades card k out (0 chat, 1 chart, 2 meter, 3 the last cornstalk): the coda fades them one per word.
export const BridgeNeedle: React.FC<{ fade?: (k: number) => number; captions?: boolean }> = ({ fade = () => 0, captions = true }) => {
  const live = useFrame();
  const s41 = shot("S41").frame;
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
  const card = (k: number): React.CSSProperties => ({ transform: `rotate(${swirl * (k % 2 ? 1 : -1) * (0.6 + 0.2 * k)}deg) scale(${1 - 0.06 * build})`,
    opacity: 1 - fade(k) });
  const asked = "why is my bill up?".slice(0, Math.max(0, Math.floor((live - s41 - 10) * 0.7)));
  return (
    <Infected value={infection}>
      <AbsoluteFill style={{ filter: `saturate(${1 - drain})` }}>
        <Background glowAt={[45, 50]} />
        <div style={{ position: "absolute", left: 90, top: 230, ...card(0) }}>
          <ChatWindow user={asked || "\u00a0"} reply={<>
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
          <div style={{ position: "absolute", right: 26, top: 22, display: "flex", alignItems: "center", gap: 8, opacity: 1 - fade(3) }}>
            <Emoji name="corn" size={26} /><Body size={18} muted>legend</Body></div>
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
        <AbsoluteFill style={{ opacity: 1 - ramp(F, s44 + 20, s44 + 50) }}>
          <StatRow x={90} y={640}>
            <Stat at={s41 + 10} label="tokens" value={`${tokens}`} />
            <Stat at={s42 + 10} label="confidence" value={live >= s43 ? "uncertain" : "high"} />
            <Stat at={s43 + 20} label="error bars" value="wide" />
          </StatRow>
          <Cursor keys={[[s41 + 4, 700, 820], [s41 + 30, 820, 360, true], [s41 + 44, 760, 500]]} />
          <Note at={s42 + 30} x={760} y={150} tx={680} ty={420} until={s44}>sparkle: decorative</Note>
        </AbsoluteFill>
        {captions && <Captions />}
      </AbsoluteFill>
    </Infected>
  );
};

// S39-S40 (infection 0.55): a bill card drops in and keeps unrolling downward like a scroll, out of frame; then the
// "$29B (est.)" bar grows off the top of its chart and the axis rescales three times trying to fit it.
export const BridgeBill: React.FC = () => {
  const F = useFrame();
  const s39 = shot("S39").frame, s40 = shot("S40").frame;
  const drop = spring({ frame: F - s39, fps: 30, config: { damping: 14 } });
  const unroll = Math.max(0, F - s39 - 20) * 9;
  const chart = ramp(F, s40 - 8, s40 + 4);
  const grow = ramp(F, s40, s40 + 30);
  const scales = [1, 5, 10, 30]; // the axis maximum, $B: three rescales
  const step = Math.min(3, Math.floor(Math.max(0, F - s40 - 20) / 22));
  const max = scales[step];
  const barH = Math.min(1.25, (29 * grow) / max) * 520;
  return (
    <Infected value={0.55}>
      <AbsoluteFill>
        <Background glowAt={[50, 40]} />
        <div style={{ position: "absolute", left: 660, top: -620 + drop * 700, width: 600, opacity: 1 - chart }}>
          <Card seed="bill" glow>
            <Body size={22} mono muted>ELECTRIC BILL</Body>
            <Body size={44} style={{ fontWeight: 800, margin: "8px 0 20px" }}>Amount due ▲</Body>
            <div style={{ height: 300 + unroll, overflow: "hidden" }}>
              {Array.from({ length: 60 }, (_, k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px dashed #ffffff22" }}>
                  <div style={{ width: 160 + (k * 37) % 180, height: 14, borderRadius: 7, background: "#ffffff22" }} />
                  <div style={{ width: 80, height: 14, borderRadius: 7, background: "#ffb00055" }} />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <AbsoluteFill style={{ opacity: chart }}>
          <Card seed="bigchart" style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 800 }}>
            <Body size={26} mono muted>Data center costs to ratepayers</Body>
            <div style={{ position: "absolute", left: 140, top: 140, width: 980, height: 520, borderLeft: "3px solid #ffffff44", borderBottom: "3px solid #ffffff44" }}>
              {[0, 0.5, 1].map((q) => (
                <div key={q} style={{ position: "absolute", left: -110, bottom: q * 520 - 16, width: 100, textAlign: "right" }}>
                  <Body size={26} mono muted>${(max * q).toFixed(max < 5 ? 1 : 0)}B</Body></div>
              ))}
              <div style={{ position: "absolute", left: 380, bottom: 0, width: 220, height: barH, borderRadius: "12px 12px 0 0", background: "linear-gradient(#ffb000, #e2367a)" }} />
              <Body size={40} style={{ position: "absolute", left: 380, bottom: Math.min(barH, 560) + 10, fontWeight: 700 }}>$29B (est.)</Body>
            </div>
            <Body size={24} muted style={{ position: "absolute", left: 40, bottom: 30 }}>PJM ratepayers, ~2 years, per its market monitor</Body>
          </Card>
        </AbsoluteFill>
        <StatRow x={110} y={260} column>
          <Stat at={s39 + 20} label="amount due" value="up again" />
          <Stat at={s39 + 50} label="line items" value={`${Math.min(60, Math.floor(unroll / 34) + 8)}`} />
          <Stat at={s40 + 20} label="axis rescales" value={`${step}`} />
        </StatRow>
        <Note at={s39 + 40} x={1500} y={300} tx={1200} ty={420} until={s40 - 8}>itemized (very)</Note>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
