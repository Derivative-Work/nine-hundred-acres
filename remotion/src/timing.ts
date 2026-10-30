// The timing map (timing/map.json, scripts/timing_map.py) as the video's clock. Video frames include the 2 s
// pre-roll; `at(t)` turns audio seconds into a video frame. Shots, lines and words come straight from the map.
import map from "../../timing/map.json";

export const FPS = map.fps;
export const PREROLL = map.preroll_s;
export const at = (t: number) => Math.round((t + PREROLL) * FPS);

type Shot = (typeof map.shots)[number];
export const shot = (id: string) => {
  const s = map.shots.find((x) => x.id === id) as Shot & { end?: number; frame_end?: number };
  if (!s || s.frame == null) throw new Error(`shot ${id} has no time`);
  return s as Shot & { t: number; frame: number; end: number; frame_end: number };
};
export const lines = map.lines;
export const line = (id: string) => map.lines.find((l) => l.id === id)!;
// the frame a word starts on: the n'th word of a line (0-based)
export const word = (lineId: string, n: number) => line(lineId).words[n].frame;
export const beats = map.beats.map(at);
export const spans = map.failure_spans;
// beats from frame a to frame b (video frames), for staggering on the beat
export const beatsBetween = (a: number, b: number) => beats.filter((x) => x >= a && x < b);
export const downbeats = map.downbeats.map(at);
