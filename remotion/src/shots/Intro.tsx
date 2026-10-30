// Intro, S01-S04 (infection 0): a cursor blinks on black; on the first strum a terminal fades in around it (the
// cursor never moves); over the harmonies it types the explainer command and reports "Explainer ready"; then the
// gradient title card, and the orange extension cord draws itself out of frame right. Nothing says where the
// music comes from.
import React from "react";
import { AbsoluteFill, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background } from "../components/surface";
import { Cord, Toast } from "../components/furniture";
import { Emoji, Heading, Icon, Pill } from "../components/type";
import { shot } from "../timing";
import { ramp, Terminal, useFrame } from "./kit";

const CMD = 'explain --topic "data centers" --style "visual explainer"';

export const IntroTitle: React.FC = () => {
  const F = useFrame();
  const s02 = shot("S02").frame, s03 = shot("S03").frame, s04 = shot("S04").frame;
  const chrome = ramp(F, s02, s02 + 24);
  const typed = Math.floor(Math.max(0, F - s03) * 1.8);
  const done = typed >= CMD.length;
  const doneAt = s03 + Math.ceil(CMD.length / 1.8);
  const title = spring({ frame: F - s04, fps: 30, config: { damping: 200 } });
  const termOut = ramp(F, s04, s04 + 12);
  const rows: React.ReactNode[] = [
    <span key="c"><span style={{ color: "#8a93b2" }}>$ </span>{CMD.slice(0, typed)}</span>,
    ...(F >= doneAt + 6 ? [<span key="ok" style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "#2dd4bf" }}>
      <Icon name="check" size={30} color="#2dd4bf" /> Explainer ready</span>] : []),
    ...(done ? [<span key="p" style={{ color: "#8a93b2" }}>$ </span>] : []),
  ];
  return (
    <Infected value={0}>
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill style={{ opacity: chrome }}><Background /></AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - termOut, transform: `translateY(${-termOut * 20}px)` }}>
          <Terminal lines={done ? rows : [<span key="c"><span style={{ color: "#8a93b2", opacity: chrome }}>$ </span>{CMD.slice(0, typed)}</span>]}
            width={1180} chrome={chrome} style={{ marginTop: -40 }} />
        </AbsoluteFill>
        {F >= doneAt + 6 && F < s04 && (
          <div style={{ position: "absolute", right: 70, bottom: 70, opacity: ramp(F, doneAt + 6, doneAt + 14) }}><Toast>Explainer ready</Toast></div>
        )}
        {F >= s04 && (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: title, transform: `translateY(${(1 - title) * 14}px)` }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              <Heading size={150} gradient>NINE HUNDRED ACRES</Heading>
              <Heading size={64}>(THE HUM)</Heading>
              <Pill tone="accent" size={30}>A Visual Explainer <Emoji name="sparkles" size={32} /></Pill>
            </div>
          </AbsoluteFill>
        )}
        {F >= s04 && <Cord d="M 960 820 C 1300 820, 1500 760, 1960 760" progress={ramp(F, s04 + 10, s04 + 40)} />}
      </AbsoluteFill>
    </Infected>
  );
};
