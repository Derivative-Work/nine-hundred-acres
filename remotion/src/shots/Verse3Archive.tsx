// Verse 3, S32-S35 and S38 (infection 0.5): the sepia "archival" card of the 1979 crowd with hand-lettered NO NUKES
// signs, film grain and gate weave; the peace sign on their banner becomes a power button, which becomes the Reactor
// toggle as it flips off (S33a); the timeline 1979 → 2019 → 2027; the rename diff with a bow; later (S38) the same
// crowd, gray-haired, flips its signs: "…OK, FINE."
import React from "react";
import { Cursor, Note, Stat, StatRow } from "../components/annotate";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { Infected, useTheme } from "../theme/context";
import { Background, Card } from "../components/surface";
import { Body, Heading, Pill } from "../components/type";
import { PeaceToPower, Protester, RallyBanner, RallyGround } from "../components/illustrations";
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

export const Crowd: React.FC<{ gray?: boolean; flip?: (k: number) => number; banner?: boolean; emblem?: React.ReactNode }> = ({ gray = false, flip, banner, emblem }) => (
  <svg width={960} height={560} viewBox="0 0 960 560">
    <RallyGround gray={gray} />
    {banner && <RallyBanner />}
    {banner && emblem}
    {SIGNS.map((s, k) => (
      <Protester key={k} x={80 + k * 115} y={430 + (k % 2) * 30} scale={1.05} sign={s} back="…OK, FINE." flip={flip ? flip(k) : 0} gray={gray} seed={`p${k}`} />
    ))}
  </svg>
);

// Where the sign sits: on the banner it is drawn inside the photo (so it weaves with the film), in the toggle card's
// slot once landed (so it floats with the card). Only the flight between them is free; its ends follow the same motion
// as the two containers, so there is no jump at either hand-off.
const BANNER = [590, 250]; // banner center on the stage, at rest
const SLOT = [1248, 289]; // the toggle card's icon slot, at rest
const TOGGLE = { left: 1180, top: 230, w: 600, h: 176, seed: "toggle" };
const FlyingSign: React.FC<{ travel: number; bleed: number; morph: number; color: string }> = ({ travel, bleed, morph, color }) => {
  const t = useTheme();
  const f = useCurrentFrame(); // the Card's own clock
  const F = useFrame();
  // the photo's gate weave (same random stream as Archival) and its entry offset
  const bx = BANNER[0] + (random(`gw${F}`) - 0.5) * 3, by = BANNER[1] + (random(`gh${F}`) - 0.5) * 3 + (1 - bleed) * 10;
  // the toggle card's float and lean (same formula as Card), applied to the slot
  const dx = t.drift * Math.sin(f / 45 + random(TOGGLE.seed) * 6), dy = t.drift * Math.cos(f / 53 + random(TOGGLE.seed + "y") * 6);
  const rot = (t.lean * Math.sin(f / 70 + random(TOGGLE.seed + "r") * 6) * Math.PI) / 180;
  const cx = TOGGLE.left + TOGGLE.w / 2, cy = TOGGLE.top + TOGGLE.h / 2;
  const ox = SLOT[0] - cx, oy = SLOT[1] - cy;
  const sx = cx + dx + ox * Math.cos(rot) - oy * Math.sin(rot), sy = cy + dy + ox * Math.sin(rot) + oy * Math.cos(rot);
  const x = interpolate(travel, [0, 1], [bx, sx]), y = interpolate(travel, [0, 1], [by, sy]), size = interpolate(travel, [0, 1], [110, 56]);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `rotate(${(rot * 180 / Math.PI) * travel}deg)` }}>
      <PeaceToPower size={size} morph={morph} color={color} />
    </div>
  );
};

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
  // the peace sign starts on the banner and flies to the toggle on the right
  const flying = F >= s33 + 20 && F < s33 + 50;
  const landed = F >= s33 + 50;
  const signColor = travel > 0.9 ? (off ? "#8a93b2" : "#2dd4bf") : travel > 0.05 ? "#fff1dc" : "#3a2a1a";
  return (
    <Infected value={0.5}>
      <AbsoluteFill>
        <Background glowAt={[40, 45]} />
        <div style={{ position: "absolute", left: 90, top: 140, opacity: bleed, transform: `translateY(${(1 - bleed) * 10}px)` }}>
          <Archival width={980} height={580}>
            <Crowd banner emblem={F < s33 + 20 && <g transform="translate(435 45)"><PeaceToPower size={110} morph={morph} color="#3a2a1a" /></g>} />
          </Archival>
          <div style={{ position: "absolute", left: 30, top: -60 }}><Pill tone="accent" size={28}>1979</Pill></div>
        </div>
        <Card seed="toggle" style={{ position: "absolute", left: 1180, top: 230, width: 600, opacity: ramp(F, s33, s33 + 10) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 56, display: "grid", placeItems: "center" }}>{landed && <PeaceToPower size={56} morph={1} color={signColor} />}</div>
            <Body size={36} style={{ fontWeight: 600 }}>Reactor</Body>
            <div style={{ marginLeft: "auto", width: 96, height: 52, borderRadius: 26, background: off ? "#ffffff22" : "#2dd4bf", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: off ? 6 : 50, width: 40, height: 40, borderRadius: 20, background: "#fff" }} />
            </div>
          </div>
          <div style={{ marginTop: 18 }}><Pill tone={pill === "Restoring" ? "success" : "plain"}>{pill}</Pill></div>
        </Card>
        {flying && <FlyingSign travel={travel} bleed={bleed} morph={morph} color={signColor} />}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={140} y1={840} x2={140 + 1640 * line} y2={840} stroke="#fff1dc" strokeWidth={4} />
          {([[1979, 0.05, "Protests"], [2019, 0.62, "Shut down (economic)"], [2027, 0.95, "Restart (planned)"]] as [number, number, string][]).map(([y, at, lab]) =>
            line >= at && (
              <g key={y}><circle cx={140 + 1640 * at} cy={840} r={12} fill="#ffb000" />
                <text x={140 + 1640 * at} y={888} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={32} fill="#fff1dc">{y}</text>
                <text x={140 + 1640 * at} y={922} textAnchor="middle" fontFamily="Inter" fontSize={24} fill="#c9a98a">{lab}</text></g>
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
        <StatRow x={1200} y={440} column>
          <Stat at={s32 + 12} label="year" value="1979" />
          <Stat at={s33 + 36} label="reactors" value="off" />
          <Stat at={s34 + 40} label="restart (planned)" value="mid-2027" />
        </StatRow>
        <Note at={s32 + 24} x={700} y={790} tx={521} ty={440} until={s35}>hand-lettered, 100% human</Note>
        <Cursor keys={[[s33 + 10, 1500, 600], [s33 + 32, 1702, 290, true], [s33 + 50, 1600, 450]]} />
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
        <StatRow x={1650} y={260} column>
          <Stat at={s38 + 10} label="signs" value={8} tick={10} />
          <Stat at={start + 30} label="message" value="ok, fine" />
        </StatRow>
        <Note at={s38 + 20} x={1700} y={140} tx={560} ty={420} until={start}>now gray</Note>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
