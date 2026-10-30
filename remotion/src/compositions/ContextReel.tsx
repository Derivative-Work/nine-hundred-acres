// The context reel: real shots from each section at their own infection, cut to the master at their mapped times,
// so the look can be judged in motion before the full animatic (M4).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import "../theme/fonts";
import { at } from "../timing";
import { ReelLabel, ShotClock } from "../shots/kit";
import { Verse1Annex } from "../shots/Verse1";
import { Chorus1Wired } from "../shots/Chorus1";
import { Span1Haze } from "../shots/Span1";
import { Verse2Turbines } from "../shots/Verse2";
import { Verse3Feed } from "../shots/Verse3";
import { BridgeNeedle } from "../shots/Bridge";
import { CodaStutter } from "../shots/Coda";

// [label, audio start s, audio end s, component]
export const CLIPS: [string, number, number, React.FC][] = [
  ["S07–S09 · Verse 1 · infection 0", 22.0, 31.79, Verse1Annex],
  ["S16 · Chorus 1 · infection 0.15", 57.0, 64.95, Chorus1Wired],
  ["S17–S22 · failure span 1 · 0.15 → 0.3", 66.5, 83.4, Span1Haze],
  ["S23–S25 · Verse 2 · infection 0.3 + haze", 83.4, 95.21, Verse2Turbines],
  ["S36–S37 · Verse 3 · infection 0.5", 126.5, 133.77, Verse3Feed],
  ["S42–S44 · Bridge · 0.6 → 0.75, needle lift", 156.5, 176.5, BridgeNeedle],
  ["S48–S49 · Coda · failure span 2", 185.3, 199.0, CodaStutter],
];

export const reelLength = CLIPS.reduce((n, [, a, b]) => n + at(b) - at(a), 0);

export const ContextReel: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {CLIPS.map(([label, a, b, Shot]) => {
        const len = at(b) - at(a);
        const seq = (
          <Sequence key={label} from={from} durationInFrames={len}>
            <ShotClock from={at(a)}>
              <Shot />
            </ShotClock>
            <Audio src={staticFile("audio/master.wav")} trimBefore={Math.round(a * 30)} trimAfter={Math.round(b * 30)} />
            <ReelLabel>{label}</ReelLabel>
          </Sequence>
        );
        from += len;
        return seq;
      })}
    </AbsoluteFill>
  );
};
