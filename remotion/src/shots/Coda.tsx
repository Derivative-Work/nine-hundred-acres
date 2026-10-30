// Coda, S48-S50 (infection 0, black): everything is gone but a bare terminal; the restore overlay returns at 88%,
// climbs to 97% and stalls on failure span 2's first frame. For the whole span the animation stutters at 6 fps, text
// fails into empty glyph boxes, and the overlay reads "Artifact suppression: OFF (by choice)"; it does not recover.
// S50, on the span's end and the final chord: the terminal types `exit`, the orange extension cord is traced back
// across the frame to where it is plugged in (the terminal itself), and the last line reads "Energy used: ???".
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { useChrome } from "../chrome/context";
import { RestoreOverlay } from "../components/furniture";
import { Icon } from "../components/type";
import { at, shot, spans } from "../timing";
import { Captions, Terminal, boxed, clamp, ramp, useFrame, useStutter } from "./kit";

const ROWS = ['$ explain --topic "data centers" --style "visual explainer"', "  ok  Explainer ready"];
const CORD = "M -20 860 C 400 1020, 1300 1040, 1720 880 C 1840 830, 1760 600, 1600 600";

export const CodaStutter: React.FC = () => {
  const live = useFrame();
  const s48 = shot("S48").frame, fail = at(spans[1].start), s50 = shot("S50").frame;
  const F = useStutter(fail, s50);
  const pct = interpolate(F, [s48, fail], [88, 97], clamp);
  const off = F >= fail + 105;
  const boxes = ramp(F, fail + 20, fail + 140) * 0.85;
  const inn = spring({ frame: F - s48, fps: 30, config: { damping: 200 } });
  const exit = "exit".slice(0, Math.max(0, Math.floor((live - s50 - 10) / 4)));
  const cord = ramp(live, s50 + 40, s50 + 130);
  const energy = live >= s50 + 140;
  const rows = [...ROWS.map((r) => boxed(r, boxes)), ...(live >= s50 ? [`$ ${exit}`] : []), ...(energy ? ["Energy used: ???"] : []),
    ...(live < s50 ? ["$ "] : [])];
  return (
    <Infected value={0}>
      <AbsoluteFill style={{ background: useChrome() ? "transparent" : "#000" }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Terminal lines={rows} width={1180} clock={F} cursor={!energy} />
        </AbsoluteFill>
        {live >= s50 && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={CORD} fill="none" stroke="#ff8a1f" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1}
              strokeDashoffset={1 - cord} style={{ filter: "drop-shadow(0 0 8px #ff8a1f88)" }} />
          </svg>
        )}
        {cord >= 1 && <div style={{ position: "absolute", left: 1546, top: 572, transform: "rotate(90deg)" }}><Icon name="plug" size={56} color="#ff8a1f" /></div>}
        <div style={{ position: "absolute", right: 50, top: 40, opacity: inn }}>
          <RestoreOverlay pct={pct} state={off ? "off" : F >= fail ? "stalled" : "running"} />
        </div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
