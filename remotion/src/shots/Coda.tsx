// Coda, S48-S49 (infection 0, black): everything is gone but a bare terminal; the restore overlay returns at 88%,
// climbs to 97% and stalls on failure span 2's first frame. From there the animation stutters at 6 fps, text fails
// into empty glyph boxes, and the overlay reads "Artifact suppression: OFF (by choice)". It does not recover.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { Infected } from "../theme/context";
import { RestoreOverlay } from "../components/furniture";
import { at, shot, spans } from "../timing";
import { Captions, Terminal, boxed, clamp, ramp, useFrame, useStutter } from "./kit";

const ROWS = ['$ explain --topic "data centers" --style "visual explainer"', "  ok  Explainer ready", "$ "];

export const CodaStutter: React.FC = () => {
  const live = useFrame();
  const s48 = shot("S48").frame, fail = at(spans[1].start);
  const F = useStutter(fail);
  const pct = interpolate(F, [s48, fail], [88, 97], clamp);
  const off = F >= fail + 105;
  const boxes = ramp(F, fail + 20, fail + 140) * 0.85;
  const inn = spring({ frame: F - s48, fps: 30, config: { damping: 200 } });
  return (
    <Infected value={0}>
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Terminal lines={ROWS.map((r) => boxed(r, boxes))} width={1180} clock={F} />
        </AbsoluteFill>
        <div style={{ position: "absolute", right: 50, top: 40, opacity: inn }}>
          <RestoreOverlay pct={pct} state={off ? "off" : F >= fail ? "stalled" : "running"} />
        </div>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
