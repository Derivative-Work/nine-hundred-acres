// The explainer chrome: everything that keeps moving around the scenes, as this genre always has.
//  - Backdrop: the theme fill and glow, a drifting dot grid and floating particles (petals as the infection rises);
//    black before the first strum and through the coda.
//  - Stage: each scene, scaled to sit under the header, with a slow camera push across the scene.
//  - Header: the chapter (number, title, progress dots for its shots), the shot's headline typing in, and the agent's
//    status chip (spinner, then a check) naming what it is building.
//  - Footer: the source line for any on-screen fact, and a thin progress bar for the whole explainer.
// The chrome follows the infection like everything else, and strips away in the coda (S45-S48).
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import map from "../../../timing/map.json";
import { Infected, useTheme } from "../theme/context";
import { TIE_DYE, alpha } from "../theme/infection";
import { Body, Heading, Icon } from "../components/type";
import { at, shot } from "../timing";
import { BEATS, CHAPTERS } from "./script";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const f = (id: string) => shot(id).frame;

// The infection over the whole video: the brief's section targets, ramped within the span and the bridge.
export const infectionAt = (F: number) =>
  interpolate(F, [f("S12") - 1, f("S12"), f("S19"), f("S22"), f("S32") - 1, f("S32"), f("S39"), f("S44"), f("S45") + 20, f("S48")],
    [0, 0.15, 0.15, 0.3, 0.3, 0.5, 0.55, 0.65, 0.75, 0], clamp);

// How much chrome is left: none before the title card, all of it from Verse 1, gone by the bare terminal.
const presence = (F: number) => interpolate(F, [f("S05") - 15, f("S05"), f("S45"), f("S48") - 10], [0, 1, 1, 0], clamp);
// How black the backdrop is: black before the strum and from the coda's terminal on.
const blackness = (F: number) => interpolate(F, [f("S02"), f("S02") + 24, f("S45") + 30, f("S48")], [1, 0, 0, 1], clamp);

const baseShots = map.shots.filter((s) => s.frame != null && !/[a-z]$/.test(s.id) && !["S19", "S20", "S21"].includes(s.id));
const currentShot = (F: number) => [...baseShots].reverse().find((s) => (s.frame as number) <= F);

const Backdrop: React.FC<{ F: number }> = ({ F }) => {
  const t = useTheme();
  const drift = F * 0.25;
  return (
    <AbsoluteFill style={{ background: t.c.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at 50% 52%, ${t.c.glow}, transparent 72%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${alpha(t.c.muted, 0.22)} 1.4px, transparent 1.6px)`, backgroundSize: "36px 36px",
        backgroundPosition: `${drift % 36}px ${(drift * 0.4) % 36}px`, opacity: 0.8,
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, transparent 85%)", maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, #000 30%, transparent 85%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 40 }, (_, k) => {
          const sp = 0.15 + random(`pt${k}`) * 0.35;
          const x = (random(`px${k}`) * 1920 + F * sp * 0.6) % 1960 - 20;
          const y = 1100 - ((random(`py${k}`) * 1100 + F * sp) % 1140);
          const petal = random(`pp${k}`) < t.tieDye;
          return petal
            ? <ellipse key={k} cx={x} cy={y} rx={7} ry={3.5} fill={TIE_DYE[k % TIE_DYE.length]} opacity={0.55} transform={`rotate(${F * 2 + k * 40} ${x} ${y})`} />
            : <circle key={k} cx={x} cy={y} r={1.5 + random(`pr${k}`) * 2} fill={t.c.accentA} opacity={0.18 + 0.2 * random(`po${k}`)} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "#000", opacity: blackness(F) }} />
    </AbsoluteFill>
  );
};

// The typed headline: characters arrive over ten frames after the shot starts.
const Typed: React.FC<{ text: string; since: number; F: number }> = ({ text, since, F }) => {
  const n = Math.min(text.length, Math.floor(Math.max(0, F - since) * (text.length / 10)));
  return <>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>▍</span></>;
};

const Header: React.FC<{ F: number }> = ({ F }) => {
  const t = useTheme();
  const cur = currentShot(F);
  const chapter = [...CHAPTERS].reverse().find((c) => f(c.first) <= F);
  if (!cur || !chapter) return null;
  const beat = BEATS[cur.id];
  const next = CHAPTERS[CHAPTERS.indexOf(chapter) + 1];
  const inChapter = baseShots.filter((s) => (s.frame as number) >= f(chapter.first) && (!next || (s.frame as number) < f(next.first)) && BEATS[s.id]);
  const overlayUp = (F >= f("S19") && F < f("S21") + 45) || F >= f("S48");
  const age = F - (cur.frame as number);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 96, display: "flex", alignItems: "center", gap: 26, padding: "0 40px",
      background: `linear-gradient(${alpha(t.c.bg, 0.92)}, ${alpha(t.c.bg, 0)})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: t.font.mono, fontSize: 22, color: t.c.accentA, padding: "4px 10px", border: `1px solid ${alpha(t.c.accentA, 0.5)}`, borderRadius: 8 }}>{chapter.num}</div>
        <Heading size={30}>{chapter.title}</Heading>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {inChapter.map((s) => <div key={s.id} style={{ width: s.id === cur.id ? 22 : 8, height: 8, borderRadius: 4,
          background: (s.frame as number) <= F ? t.c.accentA : alpha(t.c.muted, 0.35) }} />)}
      </div>
      <div style={{ width: 1, height: 34, background: alpha(t.c.muted, 0.35) }} />
      {beat && <Body size={30} style={{ fontWeight: 600, whiteSpace: "nowrap" }}><Typed text={beat.headline} since={cur.frame as number} F={F} /></Body>}
      {beat && !overlayUp && (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999,
          background: alpha(t.c.card, 0.85), border: `1px solid ${t.c.border}` }}>
          {age < 40 ? <Icon name="loader-circle" size={22} color={t.c.accentA} style={{ transform: `rotate(${F * 12}deg)` }} />
            : <Icon name="circle-check" size={22} color={t.c.success} />}
          <Body size={20} mono muted>agent · {beat.step}{age < 40 ? "…" : ""}</Body>
        </div>
      )}
    </div>
  );
};

const Footer: React.FC<{ F: number }> = ({ F }) => {
  const t = useTheme();
  const cur = currentShot(F);
  const src = cur && BEATS[cur.id]?.source;
  const end = at(map.duration_s);
  return (
    <>
      {src && <div style={{ position: "absolute", left: 40, bottom: 16, opacity: interpolate(F - (cur!.frame as number), [0, 12], [0, 1], clamp) }}>
        <Body size={17} mono muted>Source: {src}</Body></div>}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${(F / end) * 100}%`, background: t.gradient(90) }} />
    </>
  );
};

// The scene under the header, scaled to fit, with a slow push from the start of each scene.
export const Stage: React.FC<{ F: number; since: number; children: React.ReactNode }> = ({ F, since, children }) => {
  const p = presence(F);
  const push = interpolate(F - since, [0, 600], [0, 0.02], clamp);
  const scale = interpolate(p, [0, 1], [1, 0.9]) + push;
  return <AbsoluteFill style={{ transform: `translateY(${p * 46}px) scale(${scale})` }}>{children}</AbsoluteFill>;
};

export const ChromeBack: React.FC = () => {
  const F = useCurrentFrame();
  return <Infected value={infectionAt(F)}><Backdrop F={F} /></Infected>;
};

export const ChromeFront: React.FC = () => {
  const F = useCurrentFrame();
  const p = presence(F);
  if (p <= 0) return null;
  return (
    <Infected value={infectionAt(F)}>
      <AbsoluteFill style={{ opacity: p }}>
        <Header F={F} />
        <Footer F={F} />
      </AbsoluteFill>
    </Infected>
  );
};
