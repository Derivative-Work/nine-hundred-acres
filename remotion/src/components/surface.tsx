// The explainer's surfaces: background, cards, gradient fills, the marble filter and the lava lamp.
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { TIE_DYE } from "../theme/infection";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";
import { useChrome } from "../chrome/context";

// One SVG filter per frame: turbulence displacing whatever uses it, at the theme's marble strength.
export const MarbleDefs: React.FC = () => {
  const t = useTheme();
  const f = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id="marble" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={0.006 + 0.0004 * Math.sin(f / 40)} numOctaves={2} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={t.marble * 60} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="goo">
          <feGaussianBlur stdDeviation={30} />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" />
        </filter>
      </defs>
    </svg>
  );
};

// Dark navy (drifting to aubergine), the soft radial glow behind the focal card, the lava lamp near the peak.
// Inside the chrome only the lava lamp and the filters are drawn here; the chrome owns the rest of the backdrop.
export const Background: React.FC<{ glowAt?: [number, number] }> = ({ glowAt = [50, 45] }) => {
  const t = useTheme();
  if (useChrome()) {
    return (
      <AbsoluteFill style={{ top: -120, bottom: -120, left: -160, right: -160 }}>
        {t.lava > 0 && <LavaLamp />}
        <MarbleDefs />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: t.c.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at ${glowAt[0]}% ${glowAt[1]}%, ${t.c.glow}, transparent 70%)` }} />
      {t.lava > 0 && <LavaLamp />}
      <MarbleDefs />
    </AbsoluteFill>
  );
};

// Lava lamp: tie-dye blobs rising and falling slowly behind the cards, merged by the goo filter where they meet.
export const LavaLamp: React.FC = () => {
  const t = useTheme();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: "url(#goo)", opacity: t.lava * 0.42 }}>
      {Array.from({ length: 12 }, (_, k) => {
        const sp = 0.0025 + random(`lava-s${k}`) * 0.003;
        const lane = (k % 6) / 6 + random(`lava-x${k}`) * 0.12;
        const x = 6 + lane * 88 + 3 * Math.sin(f * sp * 4 + k);
        const y = 50 - 55 * Math.sin(f * sp + random(`lava-p${k}`) * 6.28);
        const r = 180 + 160 * random(`lava-r${k}`);
        return (
          <div key={k} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: r, height: r * (1.1 + 0.25 * Math.sin(f * sp * 6 + k)),
            marginLeft: -r / 2, marginTop: -r / 2, borderRadius: "50%", background: TIE_DYE[k % TIE_DYE.length] }} />
        );
      })}
    </AbsoluteFill>
  );
};

// The haze from the Memphis lead-in: brown smog wiping in from the left (`wipe` 0..1), held at `amount`.
export const Haze: React.FC<{ amount: number; wipe?: number }> = ({ amount, wipe = 1 }) => {
  const f = useCurrentFrame();
  const edge = wipe * 130 - 15;
  const over = useChrome() ? 160 : 0; // inside the scaled stage the haze overhangs the frame so its edges never show
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: amount, top: -over, bottom: -over, left: -over, right: -over,
      WebkitMaskImage: `linear-gradient(90deg, #000 ${edge - 15}%, transparent ${edge + 15}%)`,
      maskImage: `linear-gradient(90deg, #000 ${edge - 15}%, transparent ${edge + 15}%)` }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #6b4a2b 0%, #4a3220 60%, #2e2016 100%)", mixBlendMode: "multiply" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.55 }}>
        <filter id="smog">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves={3} seed={3 + Math.floor(f / 90)} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.40  0 0 0 0 0.25  0 0 0 0.9 -0.15" />
        </filter>
        <rect width="100%" height="100%" filter="url(#smog)" transform={`translate(${-(f % 900) * 0.4} 0)`} />
      </svg>
    </AbsoluteFill>
  );
};

// The accent gradient as a fill: orange to pink, with tie-dye laid over it and both marbled as the infection rises.
export const GradientFill: React.FC<{ angle?: number; style?: React.CSSProperties }> = ({ angle = 120, style }) => {
  const t = useTheme();
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", ...style }}>
      <div style={{ position: "absolute", inset: -40, background: t.gradient(angle), filter: t.marble ? "url(#marble)" : undefined }} />
      {t.tieDye > 0 && (
        <div style={{ position: "absolute", inset: "-50%", background: t.tieDyeGradient(f * 0.6 * t.infection),
          opacity: t.tieDye * 0.85, filter: t.marble ? "url(#marble)" : undefined }} />
      )}
    </div>
  );
};

// Rounded corners, a 1 px border (tie-dye as the infection rises), soft glow, generous padding.
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: boolean; seed?: string }> = ({
  children, style, glow = false, seed = "card",
}) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const dx = t.drift * Math.sin(f / 45 + random(seed) * 6);
  const dy = t.drift * Math.cos(f / 53 + random(seed + "y") * 6);
  const rot = t.lean * Math.sin(f / 70 + random(seed + "r") * 6);
  return (
    <div style={{ position: "relative", borderRadius: t.radius, padding: 1,
      transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
      boxShadow: glow ? `0 0 60px -10px ${alpha(t.c.accentB, 0.33)}, 0 20px 50px -20px #000a` : "0 20px 50px -24px #000a",
      ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: t.radius, background: t.c.border }} />
      {t.tieDye > 0 && (
        <div style={{ position: "absolute", inset: 0, borderRadius: t.radius, overflow: "hidden", opacity: t.tieDye }}>
          <div style={{ position: "absolute", inset: "-50%", background: t.tieDyeGradient(f * 0.8) }} />
        </div>
      )}
      <div style={{ position: "relative", borderRadius: t.radius - 1, background: t.c.card, padding: 32, height: "100%",
        boxSizing: "border-box" }}>
        {children}
      </div>
    </div>
  );
};
