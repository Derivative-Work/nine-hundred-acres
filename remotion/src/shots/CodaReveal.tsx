// Coda, S45-S47 (infection dropping to 0): over the frozen, drained bridge the cards fade out one per sung word,
// the last cornstalk last; in the gap the human's real Suno capture (H3) fades up in a plain window, playing in
// sync with the song; push in on the take list, the take you are hearing highlighted (S46); the window
// shrinks and drops into the S09 server grid as one more tile (S47), which then winks out with the grid.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile } from "remotion";
import { Infected } from "../theme/context";
import { useChrome } from "../chrome/context";
import { Card } from "../components/surface";
import { TileGrid } from "../components/furniture";
import { Body } from "../components/type";
import { line, shot } from "../timing";
import { BridgeNeedle } from "./Bridge";
import { Captions, clamp, ramp, useFrame } from "./kit";

// The human's real Suno capture (H3): a browser recording of the playback, cropped to the page (no browser chrome:
// it carried another company's branding), 30 fps, at remotion/public/real/suno_capture.mp4. The player's counter
// reads song time = capture time + CAPTURE_OFFSET (2:49 turns over 0.93 s in), so the capture plays in sync with the
// song: the counter and progress bar on screen match what is heard.
const CAPTURE_OFFSET = 168.07;
const CAP_W = 1100, CAP_H = Math.round((1100 * 1176) / 2400), BAR = 38;
// the take that is playing (third row, highlighted in the capture), in the window's content box
const TAKE = { x: 558, y: 263, w: 514, h: 67 };
const CaptureWindow: React.FC<{ from: number; hi: number }> = ({ from, hi }) => (
  <div style={{ position: "relative", width: CAP_W, height: CAP_H + BAR, borderRadius: 12, background: "#0b0d12", overflow: "hidden", boxShadow: "0 40px 100px -30px #000" }}>
    <div style={{ height: BAR, background: "#1a1d24", display: "flex", gap: 8, alignItems: "center", padding: "0 14px" }}>
      {[0, 1, 2].map((k) => <div key={k} style={{ width: 12, height: 12, borderRadius: 6, background: "#ffffff30" }} />)}
    </div>
    <OffthreadVideo src={staticFile("real/suno_capture.mp4")} trimBefore={Math.round((from / 30 - 2 - CAPTURE_OFFSET) * 30)} muted
      style={{ width: CAP_W, height: CAP_H, display: "block" }} />
    <div style={{ position: "absolute", left: TAKE.x - 6, top: BAR + TAKE.y - 6, width: TAKE.w + 12, height: TAKE.h + 12, borderRadius: 12,
      border: "3px solid #ffb000", boxShadow: `0 0 ${24 * hi}px #ffb000aa`, opacity: hi }} />
  </div>
);

export const CodaReveal: React.FC = () => {
  const F = useFrame();
  const s45 = shot("S45").frame, s46 = shot("S46").frame, s47 = shot("S47").frame, s48 = shot("S48").frame;
  const w = line("L27").words.map((x) => x.frame);
  const fade = (k: number) => ramp(F, w[[1, 2, 3, 5][k]], w[[1, 2, 3, 5][k]] + 8);
  const capture = ramp(F, w[5] + 4, w[5] + 24);
  const push = spring({ frame: F - s46, fps: 30, config: { damping: 200 } });
  const drop = spring({ frame: F - s47, fps: 30, config: { damping: 200 }, durationInFrames: 40 });
  const gridIn = ramp(F, s47, s47 + 12);
  const wink = ramp(F, s48 - 14, s48 - 4);
  // the capture's scale and place: full → pushed in on the take list → one tile in the grid
  // push in on the playing take: scale about the window center and bring the row toward the frame center
  const tx = TAKE.x + TAKE.w / 2 - CAP_W / 2, ty = BAR + TAKE.y + TAKE.h / 2 - (CAP_H + BAR) / 2;
  const zoom = 1 + 0.8 * push;
  const scale = interpolate(drop, [0, 1], [zoom, 0.055]);
  const x = interpolate(drop, [0, 1], [-tx * (zoom - 1) * 0.92, 393]), y = interpolate(drop, [0, 1], [-ty * (zoom - 1) - 40 * (1 - push), 172]); // raised clear of the captions until the push
  return (
    <Infected value={interpolate(F, [s45, w[5]], [0.75, 0], clamp)}>
      <AbsoluteFill style={{ background: useChrome() ? "transparent" : "#000" }}>
        <AbsoluteFill style={{ opacity: 1 - capture }}><BridgeNeedle fade={fade} captions={false} /></AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: gridIn * (1 - wink) }}>
          <Card seed="codagrid"><TileGrid cols={12} rows={6} tile={62} survivor={[-1, -1]} /></Card>
        </AbsoluteFill>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: capture * (1 - wink) }}>
          <div style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}><CaptureWindow from={s45} hi={push * (1 - drop)} /></div>
        </AbsoluteFill>
        <Captions />
      </AbsoluteFill>
    </Infected>
  );
};
