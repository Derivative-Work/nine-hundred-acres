// M3 style board: every piece of the explainer's furniture on one frame at a given infection value.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Infected } from "../theme/context";
import { Background, Card, Haze } from "../components/surface";
import { Body, Emoji, Heading, Pill } from "../components/type";
import { Callout, Checklist, Cord, HumWave, KaraokeCaption, RestoreOverlay, TileGrid, Toast } from "../components/furniture";

export type StyleBoardProps = { infection: number; label: string; heat?: number; haze?: number };

const CORD = "M 1880 300 C 1700 320, 1560 380, 1470 420 S 1240 520, 1180 560 C 1000 640, 760 600, 620 640 S 380 760, 330 740";

export const StyleBoard: React.FC<StyleBoardProps> = ({ infection, label, heat = 0, haze = 0 }) => (
  <Infected value={infection}>
    <AbsoluteFill style={{ fontFamily: "Inter" }}>
      <Background glowAt={[58, 48]} />
      <Cord d={CORD} />
      <div style={{ position: "absolute", left: 90, top: 80, display: "flex", flexDirection: "column", gap: 18 }}>
        <Pill tone="accent" size={22}>A Visual Explainer <Emoji name="sparkles" size={24} /></Pill>
        <Heading size={104} gradient>NINE HUNDRED ACRES</Heading>
        <Heading size={48}>(The Hum)</Heading>
      </div>
      <div style={{ position: "absolute", right: 60, top: 50 }}>
        <RestoreOverlay pct={41} />
      </div>
      <Card seed="bullets" style={{ position: "absolute", left: 90, top: 400, width: 520 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Emoji name="corn" size={40} /><Body>Farmland annexed</Body>
            <span style={{ marginLeft: "auto" }}><Pill tone="accent">900 acres</Pill></span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Emoji name="zap" size={40} /><Body>Hum: always</Body></div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Emoji name="cloud" size={40} /><Body>The cloud: a field</Body></div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Emoji name="cricket" size={40} /><Body muted>Crickets: tiny fans</Body></div>
        </div>
      </Card>
      <Card seed="grid" glow style={{ position: "absolute", left: 700, top: 330, width: 760 }}>
        <Body size={22} mono muted style={{ marginBottom: 16 }}>room tiles · 1,000 · status</Body>
        <TileGrid cols={11} rows={5} tile={52} heat={heat} />
      </Card>
      <div style={{ position: "absolute", left: 700, top: 765 }}>
        <Callout width={760}>The cloud is not in the sky.</Callout>
      </div>
      <Card seed="check" style={{ position: "absolute", right: 70, top: 300, width: 330 }}>
        <Body size={22} mono muted style={{ marginBottom: 18 }}>it never…</Body>
        <Checklist items={["Sleep", "Stop"]} />
      </Card>
      <div style={{ position: "absolute", right: 70, top: 560 }}>
        <Toast>Explainer ready</Toast>
      </div>
      <div style={{ position: "absolute", right: 70, top: 660 }}>
        <Toast tone="error">Artifact detected</Toast>
      </div>
      <div style={{ position: "absolute", left: 90, top: 790 }}>
        <HumWave width={520} height={110} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center" }}>
        <KaraokeCaption words={"Can you hear it humming, brother?".split(" ")} current={4} />
      </div>
      {haze > 0 && <Haze amount={haze} />}
      <div style={{ position: "absolute", left: 24, bottom: 18, fontFamily: "'JetBrains Mono'", fontSize: 18, color: "#ffffff88" }}>
        style board · infection {infection.toFixed(2)} · {label}
      </div>
    </AbsoluteFill>
  </Infected>
);
