// S17-S22 across failure span 1 (infection 0.15 rising to 0.3): the cloud's arrow lands on the grid and the key
// insight; then the restore overlay appears, the haze wipes in from the left with its leading edge on the span's
// start, the cards jitter, "Artifact detected", the overlay stalls, "Retrying…", a green check on the span's end.
// S22's Memphis pin card arrives on its lyric, inside the span (the span runs to the end of "Memphis").
import React from "react";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card, Haze } from "../components/surface";
import { Callout, RestoreOverlay, RestoreState, TileGrid, Toast } from "../components/furniture";
import { Body, Emoji, Icon } from "../components/type";
import { shot } from "../timing";
import { Captions, clamp, ramp, useFrame } from "./kit";

export const Span1Haze: React.FC = () => {
  const F = useFrame();
  const s17 = shot("S17").frame, s18 = shot("S18").frame, s19 = shot("S19").frame, s20 = shot("S20").frame;
  const s21 = shot("S21").frame, s22 = shot("S22").frame;
  const infection = interpolate(F, [s19, s22], [0.15, 0.3], clamp);
  const inSpan = F >= s19 && F < s21;
  const jit = (k: string) => (inSpan ? (random(`${k}${Math.floor(F / 2)}`) - 0.5) * 4 : 0);
  const pct = interpolate(F, [s19, s20], [41, 58], clamp) + (F >= s21 ? 42 : 0);
  const state: RestoreState = F >= s21 ? "ok" : F >= s21 - 14 ? "retrying" : F >= s20 ? "stalled" : "running";
  const overlayIn = spring({ frame: F - s19, fps: 30, config: { damping: 200 } }) * (1 - ramp(F, s21 + 40, s21 + 55));
  const haze = F < s21 ? 0.45 : interpolate(F, [s21, s21 + 30], [0.45, 0.25], clamp);
  const memphis = ramp(F, s22 - 6, s22 + 10);
  const callout = spring({ frame: F - s18, fps: 30, config: { damping: 200 } });
  return (
    <Infected value={infection}>
      <AbsoluteFill>
        <Background glowAt={[50, 55]} />
        <AbsoluteFill style={{ opacity: 1 - memphis, transform: `translate(${jit("a")}px, ${jit("b")}px)` }}>
          <div style={{ position: "absolute", left: 900, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Emoji name="cloud" size={96} />
            <Body size={26} muted>The Cloud</Body>
          </div>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d="M 948 225 L 948 330" stroke="#e8ecf8" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1}
              strokeDashoffset={1 - ramp(F, s17, s18)} />
            {F >= s18 && <path d="M 934 316 L 948 334 L 962 316" stroke="#e8ecf8" strokeWidth={4} fill="none" />}
          </svg>
          <Card seed="s1grid" glow style={{ position: "absolute", left: 640, top: 345, transform: `translate(${jit("c")}px, ${jit("d")}px)` }}>
            <TileGrid cols={10} rows={4} tile={50} survivor={[3, 7]} />
          </Card>
          <div style={{ position: "absolute", left: 600, top: 700, opacity: callout, transform: `translateY(${(1 - callout) * 14 + jit("e")}px)` }}>
            <Callout width={720}>The cloud is not in the sky.</Callout>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: memphis, justifyContent: "center", alignItems: "center" }}>
          <Card seed="memphis" glow style={{ width: 760 }}>
            <div style={{ height: 300, borderRadius: 16, background: "repeating-linear-gradient(0deg, #ffffff08 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #ffffff08 0 1px, transparent 1px 40px)",
              display: "grid", placeItems: "center" }}>
              <Icon name="map-pin" size={90} color="#ff7a3d" style={{ transform: `translateY(${(1 - spring({ frame: F - s22, fps: 30 })) * -60}px)` }} />
            </div>
            <Body size={40} style={{ marginTop: 20, fontWeight: 600 }}>South Memphis, TN</Body>
            <Body size={22} mono muted>map placeholder: Natural Earth outline in M4</Body>
          </Card>
        </AbsoluteFill>
        {F >= s19 && <Haze amount={haze} wipe={ramp(F, s19, s19 + 45)} />}
        <div style={{ position: "absolute", right: 50, top: 40, opacity: overlayIn, transform: `translateY(${(1 - overlayIn) * 12}px)` }}>
          <RestoreOverlay pct={pct} state={state} />
          {F >= s20 && F < s21 - 14 && (
            <div style={{ marginTop: 14, opacity: ramp(F, s20, s20 + 8) }}><Toast tone="error">Artifact detected</Toast></div>
          )}
        </div>
        <StatRow x={110} y={330} column>
          <Stat at={s18 + 8} label="cloud altitude" value="0 ft" emoji="cloud" />
          <Stat at={s18 + 22} label="cloud location" value="a field" />
          <Stat at={s22 + 10} label="state" value="Tennessee" />
        </StatRow>
        <Note at={s17 + 8} x={1360} y={150} tx={985} ty={130} until={s19}>cloud.location = ?</Note>
        <Cursor keys={[[s20 + 10, 1200, 600], [s20 + 34, 1620, 170, true], [s20 + 48, 1625, 172, true], [s20 + 70, 1500, 400]]} />
        <Note at={s20 + 52} x={1300} y={330} tx={1610} ty={175} until={s21 - 10}>can't dismiss</Note>
        <Note at={s22 + 20} x={1450} y={420} tx={1030} ty={440}>you are here</Note>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
