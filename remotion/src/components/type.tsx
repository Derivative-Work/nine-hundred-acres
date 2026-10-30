// Type: headings that cross over to the groovy face, gradient text, pills, emoji and icons.
import React from "react";
import { Img, random, staticFile, useCurrentFrame } from "remotion";
import { useTheme } from "../theme/context";
import { alpha } from "../theme/infection";

// Headings catch the groovy swash letter by letter: each letter has its own threshold, and goes over to the groovy
// face once the theme's groovy share passes it (none at 0.4, about a third at 0.5, all by 0.62). A gradient heading
// carries tie-dye over its orange-to-pink fill at the theme's tie-dye share.
export const Heading: React.FC<{ children: string; size?: number; gradient?: boolean; style?: React.CSSProperties }> = ({
  children, size = 96, gradient = false, style,
}) => {
  const t = useTheme();
  const f = useCurrentFrame();
  const clip = (bg: string): React.CSSProperties => ({ backgroundImage: bg, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
  const fills = gradient
    ? [{ op: 1, css: clip(t.gradient(100)) }, ...(t.tieDye > 0 ? [{ op: t.tieDye, css: clip(t.tieDyeGradient(f * 0.6)) }] : [])]
    : [{ op: 1, css: { color: t.c.text } }];
  const letters = [...children].map((ch, k) => {
    const groovy = ch !== " " && t.groovy > 0.02 + 0.96 * random(`groovy-${children}-${k}`);
    return (
      <span key={k} style={groovy ? { fontFamily: t.font.groovy, fontWeight: 400, letterSpacing: "0.01em" }
        : { fontFamily: t.font.sans, fontWeight: 800, letterSpacing: "-0.03em" }}>{ch}</span>
    );
  });
  return (
    <div style={{ display: "grid", fontSize: size, transform: `rotate(${-1.5 * t.groovy}deg)`, transformOrigin: "left center", ...style }}>
      {fills.map((fill, k) => (
        <span key={k} style={{ gridArea: "1 / 1", lineHeight: 1.02, whiteSpace: "pre", ...fill.css, opacity: fill.op }}>{letters}</span>
      ))}
    </div>
  );
};

export const Body: React.FC<{ children: React.ReactNode; size?: number; muted?: boolean; mono?: boolean; style?: React.CSSProperties }> = ({
  children, size = 30, muted = false, mono = false, style,
}) => {
  const t = useTheme();
  return (
    <div style={{ fontFamily: mono ? t.font.mono : t.font.sans, fontSize: size, color: muted ? t.c.muted : t.c.text,
      fontWeight: 400, lineHeight: 1.35, fontVariantNumeric: "tabular-nums", ...style }}>
      {children}
    </div>
  );
};

// Twemoji only (assets/LICENSES.md); never an emoji character, which would fall back to a system font.
export const Emoji: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ name, size = 40, style }) => (
  <Img src={staticFile(`emoji/${name}.svg`)} style={{ width: size, height: size, display: "block", ...style }} />
);

// Lucide icons, recolored through a CSS mask so they take any theme color.
export const Icon: React.FC<{ name: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  name, size = 32, color, style,
}) => {
  const t = useTheme();
  const url = `url(${staticFile(`icons/${name}.svg`)})`;
  return (
    <div style={{ width: size, height: size, background: color ?? t.c.text, WebkitMaskImage: url, maskImage: url,
      WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", ...style }} />
  );
};

export const Pill: React.FC<{ children: React.ReactNode; tone?: "accent" | "success" | "error" | "plain"; size?: number }> = ({
  children, tone = "plain", size = 24,
}) => {
  const t = useTheme();
  const col = { accent: t.c.accentA, success: t.c.success, error: t.c.error, plain: t.c.muted }[tone];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.3}px ${size * 0.7}px`,
      borderRadius: 999, border: `1px solid ${alpha(col, 0.40)}`, background: `${alpha(col, 0.12)}`, color: tone === "plain" ? t.c.text : col,
      fontFamily: t.font.sans, fontWeight: 600, fontSize: size, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", width: "fit-content" }}>
      {children}
    </div>
  );
};
