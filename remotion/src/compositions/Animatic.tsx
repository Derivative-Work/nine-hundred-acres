// The M4 animatic: every shot in order, cut to the track. One composition per section (brief: "One composition per
// section"), each a run of scenes; a scene starts on its first shot's frame (timing map) and runs to the next
// scene's. The full animatic chains the sections, the master from the end of the pre-roll, then the post-roll.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import map from "../../../timing/map.json";
import { at, shot } from "../timing";
import { ShotClock } from "../shots/kit";
import { IntroTitle } from "../shots/Intro";
import { Verse1Annex, Verse1Granddad, Verse1Map } from "../shots/Verse1";
import { Chorus1Hum, Chorus1Wired } from "../shots/Chorus1";
import { Span1Haze } from "../shots/Span1";
import { Verse2Permit, Verse2Turbines } from "../shots/Verse2";
import { Verse3Archive, Verse3Signs } from "../shots/Verse3Archive";
import { Verse3Feed } from "../shots/Verse3";
import { BridgeBill, BridgeNeedle } from "../shots/Bridge";
import { CodaReveal } from "../shots/CodaReveal";
import { CodaStutter } from "../shots/Coda";
import { FACTS, CARD, END, FADE, PostRoll, S51_LEN, postLength } from "../shots/Post";

export const AUDIO_END = at(map.duration_s);

// section: [first shot of each scene, scene]
export const SECTIONS: [string, [string | number, React.FC][]][] = [
  ["Intro", [[0, IntroTitle]]],
  ["Verse1", [["S05", Verse1Map], ["S07", Verse1Annex], ["S10", Verse1Granddad]]],
  ["Chorus1", [["S12", Chorus1Hum], ["S16", Chorus1Wired]]],
  ["Span1", [["S17", Span1Haze]]],
  ["Verse2", [["S23", Verse2Turbines], ["S26", Verse2Permit]]],
  ["Verse3", [["S32", Verse3Archive], ["S36", Verse3Feed], ["S38", Verse3Signs]]],
  ["Bridge", [["S39", BridgeBill], ["S41", BridgeNeedle]]],
  ["Coda", [["S45", CodaReveal], ["S48", CodaStutter]]],
];

const startOf = (s: string | number) => (typeof s === "number" ? s : shot(s).frame);
const scenes = SECTIONS.flatMap(([, sc]) => sc);
const sceneEnd = (s: string | number) => {
  const k = scenes.findIndex(([x]) => x === s);
  return k + 1 < scenes.length ? startOf(scenes[k + 1][0]) : AUDIO_END;
};
export const sectionRange = (name: string) => {
  const sc = SECTIONS.find(([n]) => n === name)![1];
  return [startOf(sc[0][0]), sceneEnd(sc[sc.length - 1][0])];
};

const Scenes: React.FC<{ list: [string | number, React.FC][]; offset: number }> = ({ list, offset }) => (
  <>
    {list.map(([s, Scene]) => (
      <Sequence key={String(s)} from={startOf(s) - offset} durationInFrames={sceneEnd(s) - startOf(s)}>
        <ShotClock from={startOf(s)}><Scene /></ShotClock>
      </Sequence>
    ))}
  </>
);

// Review burn-in: the shot (or shots) on screen and the video frame.
const ShotLabel: React.FC<{ offset: number }> = ({ offset }) => {
  const F = useCurrentFrame() + offset;
  let label: string;
  if (F < AUDIO_END) {
    const on = map.shots.filter((s) => s.frame != null && s.frame <= F &&
      ("frame_end" in s ? (s as { frame_end: number }).frame_end > F : F < s.frame + 75));
    label = on.map((s) => s.id).join(" + ") || "S01";
  } else {
    const p = F - AUDIO_END;
    const k = Math.floor((p - S51_LEN - FADE) / CARD);
    label = p < S51_LEN + FADE ? "S51" : k < FACTS.length ? FACTS[k][0] : "S52";
  }
  return (
    <div style={{ position: "absolute", left: 16, top: 12, fontFamily: "'JetBrains Mono'", fontSize: 22, color: "#fff", background: "#000a",
      padding: "4px 10px", borderRadius: 6 }}>{label} · f{F}</div>
  );
};

export const Section: React.FC<{ name: string; label?: boolean }> = ({ name, label = true }) => {
  const [a, b] = sectionRange(name);
  const list = SECTIONS.find(([n]) => n === name)![1];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Scenes list={list} offset={a} />
      <Sequence from={Math.max(0, at(0) - a)}>
        <Audio src={staticFile("audio/master.wav")} trimBefore={Math.max(0, a - at(0))} trimAfter={b - at(0)} />
      </Sequence>
      {label && <ShotLabel offset={a} />}
    </AbsoluteFill>
  );
};

export const Animatic: React.FC<{ label?: boolean }> = ({ label = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Scenes list={scenes} offset={0} />
    <Sequence from={at(0)} durationInFrames={AUDIO_END - at(0)}><Audio src={staticFile("audio/master.wav")} /></Sequence>
    <Sequence from={AUDIO_END} durationInFrames={postLength}>
      <PostRoll />
      <Audio src={staticFile("audio/postroll.wav")} />
    </Sequence>
    {label && <ShotLabel offset={0} />}
  </AbsoluteFill>
);

export const animaticLength = AUDIO_END + postLength;
export { END };
