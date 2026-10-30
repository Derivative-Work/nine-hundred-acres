// Verse 3, S32-S35 and S38 (infection 0.5): the sepia "archival" card of the 1979 crowd with hand-lettered NO NUKES
// signs, film grain and gate weave; the peace sign on their banner becomes a power button, which becomes the Reactor
// toggle as it flips off (S33a); the timeline 1979 → 2019 → 2027; the rename diff with a bow; later (S38) the same
// crowd, gray-haired, flips its signs: "…OK, FINE."
import React from "react";
import { AbsoluteFill, interpolate, random, spring } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Body, Heading, Pill } from "../components/type";
import { PeaceToPower, Protester } from "../components/illustrations";
import { shot, word } from "../timing";
import { Captions, clamp, ramp, useFrame } from "./kit";

const Archival: React.FC<{ children: React.ReactNode; width: number; height: number }> = ({ children, width, height }) => {
  const F = useFrame();
  const wx = (random(`gw${F}`) - 0.5) * 3, wy = (random(`gh${F}`) - 0.5) * 3;
  return (
    <div style={{ position: "relative", width, height, borderRadius: 14, overflow: "hidden", background: "#d9c8a3",
      boxShadow: "0 30px 80px -30px #000", border: "10px solid #efe6d2" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${wx}px, ${wy}px)`, filter: "sepia(0.85) contrast(1.05)" }}>{children}</div>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.55 }}>
        <filter id={`grain${F % 4}`}><feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={1} seed={F % 50} />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0.9 0" /></filter>
        <rect width="100%" height="100%" filter={`url(#grain${F % 4})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, #2a1a0a99 100%)" }} />
    </div>
  );
};

const SIGNS = ["NO NUKES", "NO NUKES", "NO NUKES!", "NO NUKES", "NO NUKES", "NO NUKES", "NO NUKES", "NO NUKES"];

export const Crowd: React.FC<{ gray?: boolean; flip?: (k: number) => number; banner?: React.ReactNode }> = ({ gray = false, flip, banner }) => (
  <svg width={960} height={560} viewBox="0 0 960 560">
    <rect width={960} height={560} fill="#cbb98f" />
    <rect y={380} width={960} height={180} fill="#a99366" />
    {banner}
    {SIGNS.map((s, k) => (
      <Protester key={k} x={80 + k * 115} y={430 + (k % 2) * 30} scale={1.05} sign={s} back="…OK, FINE." flip={flip ? flip(k) : 0} gray={gray} seed={`p${k}`} />
    ))}
  </svg>
);

export const Verse3Archive: React.FC = () => {
  const F = useFrame();
  const s32 = shot("S32").frame, s33 = shot("S33").frame, s34 = shot("S34").frame, s35 = shot("S35").frame;
  const bleed = ramp(F, s32 - 4, s32 + 20);
  const morph = ramp(F, s33, s33 + 20);
  const travel = spring({ frame: F - s33 - 20, fps: 30, config: { damping: 200 }, durationInFrames: 30 });
  const off = F >= s33 + 34;
  const line = ramp(F, s33 + 10, s34 + 40);
  const diff = spring({ frame: F - s35, fps: 30, config: { damping: 200 } });
  const pill = F >= s34 + 30 ? "Restoring" : "Deprecated";
  // the peace sign starts on the banner (over the crowd card) and flies to the toggle on the right
  const px = interpolate(travel, [0, 1], [500, 1250]), py = interpolate(travel, [0, 1], [205, 297]), ps = interpolate(travel, [0, 1], [110, 56]);
  return (
    <Infected value={0.5}>
      <AbsoluteFill>
        <Background glowAt={[40, 45]} />
        <div style={{ position: "absolute", left: 90, top: 140, opacity: bleed, transform: `translateY(${(1 - bleed) * 10}px)` }}>
          <Archival width={980} height={580}>
            <Crowd banner={<rect x={340} y={40} width={300} height={120} rx={8} fill="#f1e6cf" stroke="#3a2a1a" strokeWidth={3} />} />
          </Archival>
          <div style={{ position: "absolute", left: 30, top: -60 }}><Pill tone="accent" size={28}>1979</Pill></div>
        </div>
        <Card seed="toggle" style={{ position: "absolute", left: 1180, top: 230, width: 600, opacity: ramp(F, s33, s33 + 10) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70 }} />
            <Body size={36} style={{ fontWeight: 600 }}>Reactor</Body>
            <div style={{ marginLeft: "auto", width: 96, height: 52, borderRadius: 26, background: off ? "#ffffff22" : "#2dd4bf", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: off ? 6 : 50, width: 40, height: 40, borderRadius: 20, background: "#fff" }} />
            </div>
          </div>
          <div style={{ marginTop: 18 }}><Pill tone={pill === "Restoring" ? "success" : "plain"}>{pill}</Pill></div>
        </Card>
        <div style={{ position: "absolute", left: px - ps / 2, top: py - ps / 2, opacity: bleed }}>
          <PeaceToPower size={ps} morph={morph} color={travel > 0.9 ? (off ? "#8a93b2" : "#2dd4bf") : travel > 0.05 ? "#fff1dc" : "#3a2a1a"} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={140} y1={860} x2={140 + 1640 * line} y2={860} stroke="#fff1dc" strokeWidth={4} />
          {([[1979, 0.05, "Protests"], [2019, 0.62, "Shut down (economic)"], [2027, 0.95, "Restart (planned)"]] as [number, number, string][]).map(([y, at, lab]) =>
            line >= at && (
              <g key={y}><circle cx={140 + 1640 * at} cy={860} r={12} fill="#ffb000" />
                <text x={140 + 1640 * at} y={910} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={32} fill="#fff1dc">{y}</text>
                <text x={140 + 1640 * at} y={945} textAnchor="middle" fontFamily="Inter" fontSize={24} fill="#c9a98a">{lab}</text></g>
            ))}
        </svg>
        <div style={{ position: "absolute", left: 300, top: 330, opacity: diff, transform: `translateY(${(1 - diff) * 20}px)` }}>
          <Card seed="diff" glow style={{ width: 900 }}>
            <Body size={22} mono muted style={{ marginBottom: 14 }}>rename.diff</Body>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 34, lineHeight: 1.7 }}>
              <div style={{ background: "#f43f5e22", color: "#ff8a9b", padding: "0 12px" }}>- Three Mile Island Unit 1</div>
              <div style={{ background: "#2dd4bf22", color: "#7ff0dd", padding: "0 12px" }}>+ Crane Clean Energy Center</div>
            </div>
            <svg width={120} height={70} viewBox="0 0 120 70" style={{ position: "absolute", right: 30, top: -30 }}>
              <path d="M 60 35 C 20 0, 0 30, 10 50 C 30 60, 50 45, 60 35 C 70 45, 90 60, 110 50 C 120 30, 100 0, 60 35 Z" fill="#e2367a" />
              <path d="M 55 38 L 40 70 M 65 38 L 80 70" stroke="#e2367a" strokeWidth={8} /><circle cx={60} cy={36} r={9} fill="#ff5e8f" />
            </svg>
          </Card>
        </div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};

export const Verse3Signs: React.FC = () => {
  const F = useFrame();
  const s38 = shot("S38").frame;
  const start = word("L20", 9); // the signs flip on "cleanest"
  const flip = (k: number) => ramp(F, start + k * 4, start + k * 4 + 10);
  const enter = ramp(F, s38, s38 + 12);
  return (
    <Infected value={0.5}>
      <AbsoluteFill>
        <Background glowAt={[50, 45]} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: enter }}>
          <div style={{ position: "relative" }}>
            <Archival width={1300} height={760}><div style={{ transform: "scale(1.35)", transformOrigin: "top left" }}><Crowd gray flip={flip} /></div></Archival>
            <div style={{ position: "absolute", right: 30, top: -64 }}><Pill tone="accent" size={28}>today</Pill></div>
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 80, top: 50 }}><Heading size={60}>Public sentiment</Heading></div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
