// House motion: every element enters with a short fade while sliding up a few pixels, on a spring ease whose
// damping comes from the infection (crisp at 0, bouncy by 0.7). Lists stagger in on the beat (pass beat delays).
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Theme } from "./infection";

export function useEnter(t: Theme, delay = 0, rise = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: t.spring });
  return { opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * rise}px)` };
}
