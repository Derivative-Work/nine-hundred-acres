// The vertical cut (brief: 9:16, S12-S27: the first chorus, the first failure and Verse 2). The same scenes on the
// same frames as the main video, reflowed to one column (each scene reads `usePortrait()`), with the stacked chrome
// and the captions in the top third; the master plays from S12 to the start of S32.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { at, shot } from "../timing";
import { Portrait, ShotClock } from "../shots/kit";
import { ChromeOn } from "../chrome/context";
import { ChromeBackTall, ChromeFrontTall } from "../chrome/Chrome";
import { Chorus1Hum, Chorus1Wired } from "../shots/Chorus1";
import { Span1Haze } from "../shots/Span1";
import { Verse2Permit, Verse2Turbines } from "../shots/Verse2";

const LIST: [string, React.FC][] = [["S12", Chorus1Hum], ["S16", Chorus1Wired], ["S17", Span1Haze], ["S23", Verse2Turbines], ["S26", Verse2Permit]];
const A = shot("S12").frame, B = shot("S32").frame;
export const verticalRange = [A, B];
export const verticalLength = B - A;

export const Vertical: React.FC = () => (
  <Portrait.Provider value={true}>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={-A} layout="none"><ChromeBackTall /></Sequence>
      {LIST.map(([id, Scene], k) => {
        const s = shot(id).frame, e = k + 1 < LIST.length ? shot(LIST[k + 1][0]).frame : B;
        return (
          <Sequence key={id} from={s - A} durationInFrames={e - s}>
            <ShotClock from={s}><ChromeOn.Provider value={true}><Scene /></ChromeOn.Provider></ShotClock>
          </Sequence>
        );
      })}
      <Sequence from={-A} layout="none"><ChromeFrontTall from={A} to={B} /></Sequence>
      <Audio src={staticFile("audio/master.wav")} trimBefore={A - at(0)} trimAfter={B - at(0)} />
    </AbsoluteFill>
  </Portrait.Provider>
);
