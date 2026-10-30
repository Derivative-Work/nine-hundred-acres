// After the song: S51 (the post-filter's terminal output for this song, rebuilt from the music-deslop repo's own
// print statements and the run's real detected spans; the human chose this over a capture, see production_log.md
// 2026-10-30T09:40), a fade to black, the fact cards (plain white type on black, one fact per card, source
// beneath, each held long enough to read, plain cuts, no explainer styling, no emoji), then the end card S52 in plain type.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ramp } from "./kit";
import { useCurrentFrame } from "remotion";

// Card wording verified in M8 against a primary source (log/audits/03_review.md). F3 is retired (no primary source); F7a
// and F7b are inserts. The fact cards name companies (the human lifted that guardrail for the cards, M8).
export const FACTS: [string, string, string][] = [
  ["F1", "11 data centers sit within half a mile of an elementary school in Loudoun County, Virginia. As many as 264 diesel backup generators are near the school.", "NBC News, Oct 28, 2026 (analysis of state-issued permits)"],
  ["F2", "Virginia had permitted over 10,500 diesel backup generators for data centers by the end of 2025: 27 gigawatts in all.", "Better Data Center Project, Mar 2026, from state air permits"],
  ["F4", "In July 2026 the EPA proposed ending the federal minimum for public comment on “minor source” air permits, leaving it to each state. It is still a proposal.", "EPA; Federal Register, Jul 7, 2026"],
  ["F5", "In 2022, neighbors said noise from one Virginia data center regularly exceeded the county’s 60 dB limit. Air conditioning was exempt then; the county has since tightened its rules.", "AP, Sep 2022; Prince William County, 2023 and 2026"],
  ["F6", "Salix, Iowa annexed about 900 acres of farmland. In August the council voted 3–2 against a moratorium. The county and three landowners are challenging the annexation in court.", "Iowa Public Radio; KTIV"],
  ["F7", "In Southaven, Mississippi, xAI’s gas plant for a data center a mile away in Tennessee grew to 57 trailer-mounted turbines by May 2026, with no air permit. The state had ruled them exempt.", "NAACP v. X.AI Corp., N.D. Miss., filings of Jun 12, 2026"],
  ["F7a", "When the NAACP sued, the federal government stepped in for the EPA and asked the court to dismiss the case. In October 2026 the judge refused. The case continues.", "NAACP v. X.AI Corp., N.D. Miss., order of Oct 19, 2026"],
  ["F7b", "The government’s filing says the lawsuit threatens “the power supply for Super Intelligence innovation that is essential to the Department of War’s military operations.”", "United States’ complaint in intervention, N.D. Miss., Oct 23, 2026"],
];

// Each card holds long enough to read: 1.5 s plus four words a second, and never under five seconds.
export const S51_LEN = 270, FADE = 15, END = 600;
export const cardLength = (text: string) => Math.max(150, Math.round((1.5 + text.split(/\s+/).length / 4) * 30));
export const CARDS = FACTS.map(([, text]) => cardLength(text));
export const cardStart = (k: number) => S51_LEN + FADE + CARDS.slice(0, k).reduce((x, y) => x + y, 0);
export const postLength = cardStart(FACTS.length) + END;

const plain: React.CSSProperties = { fontFamily: "Inter", color: "#f2f2f2" };

// What `postfilter.infer` prints (music-deslop: `postprocess.postprocess` logs one line per fallback passage with
// `fmt_time`; `infer.main` prints the summary), for the two runs in the human's run folder: the default chain, whose
// fallback found and bypassed the two spans (fallback.json: 72.39-82.64 s and 191.17-228.91 s), then the same chain
// with `--no-fallback`, which is the master the video plays. With `--no-fallback` the detector does not run, so that
// run prints only its summary line. Command form as in the repo's README.
const CMD = "uv run python -m postfilter.infer --in field-of-humming-things.wav";
const S51_LINES: [number, string, "cmd" | "out"][] = [
  [0, `$ ${CMD} --out with-fallback/field-of-humming-things.wav --ckpt m6f_10k.safetensors --source suno`, "cmd"],
  [18, "  fallback 1:12.4-1:22.6: model output was noisy there, passed through unprocessed", "out"],
  [24, "  fallback 3:11.2-3:48.9: model output was noisy there, passed through unprocessed", "out"],
  [30, "field-of-humming-things.wav -> with-fallback/field-of-humming-things.wav (238.4 s, strength 1.0, latent null)", "out"],
  [54, `$ ${CMD} --out no-fallback/field-of-humming-things.wav --ckpt m6f_10k.safetensors --source suno --no-fallback`, "cmd"],
  [78, "field-of-humming-things.wav -> no-fallback/field-of-humming-things.wav (238.4 s, strength 1.0, latent null)", "out"],
  [90, "$ ", "cmd"],
];

// A plain terminal, full frame, hard cut in: no explainer styling. The lines arrive as a scrollback replay, then it
// holds so the two timestamps can be read; the cursor blinks after the last prompt.
const S51: React.FC = () => {
  const f = useCurrentFrame();
  const shown = S51_LINES.filter(([at]) => f >= at);
  return (
    <AbsoluteFill style={{ background: "#0c0c0c", padding: "70px 80px", fontFamily: "'JetBrains Mono'", fontVariantLigatures: "none", fontSize: 25, lineHeight: 1.55, color: "#cfcfcf" }}>
      {shown.map(([, text, kind], k) => (
        <div key={k} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", color: kind === "cmd" ? "#e8e8e8" : "#bdbdbd", marginTop: kind === "cmd" && k ? 18 : 0 }}>
          {text}
          {k === shown.length - 1 && f >= 90 && <span style={{ display: "inline-block", width: 14, height: 30, verticalAlign: "middle", background: "#cfcfcf",
            opacity: Math.floor(f / 15) % 2 ? 0 : 1 }} />}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Fact: React.FC<{ text: string; source: string }> = ({ text, source }) => (
  <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 220 }}>
    <div style={{ ...plain, fontSize: 54, fontWeight: 400, lineHeight: 1.35, maxWidth: 1400 }}>{text}</div>
    <div style={{ ...plain, fontSize: 28, color: "#9a9a9a", marginTop: 40, maxWidth: 1400, width: "100%" }}>{source}</div>
  </AbsoluteFill>
);

// S52, the end card (brief, "End card contents"), plain type on black in two pages of ten seconds: the statement and
// one line per on-screen fact with its source (the brief's Reference facts), then the credits from assets/LICENSES.md.
const ON_SCREEN_FACTS: [string, string][] = [
  ["Salix, Iowa annexed about 900 acres of farmland for a proposed data center; it is not built.", "Iowa Public Radio"],
  ["In 2025, 35 portable gas turbines ran in South Memphis without air permits; in January 2026 the EPA revised its turbine rule, which the Southern Environmental Law Center says confirms they need permits.", "Oil & Gas Watch; Gas Outlook; SELC"],
  ["Three Mile Island Unit 1 was shut down in 2019 for economic reasons.", "Enlit"],
  ["It is renamed the Crane Clean Energy Center, under a Microsoft power deal; its restart is on track for mid-2027.", "Maryland Matters"],
  ["Data centers cost PJM’s 67 million ratepayers about $29 billion over roughly two years (market monitor estimate).", "NPR via KUNC"],
  ["No public meter measures AI data centers’ energy use in real time.", "gradually.ai"],
];

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const page2 = f >= END / 2;
  return (
    <AbsoluteFill style={{ background: "#000", padding: "90px 200px", ...plain, fontSize: 28, lineHeight: 1.45 }}>
      {!page2 ? (
        <>
          <div style={{ fontSize: 54, fontWeight: 600, marginBottom: 26 }}>Nine Hundred Acres (The Hum)</div>
          <div>Words, music, animation and audio restoration by machines. Takes chosen and gates approved by a human.</div>
          <div style={{ marginTop: 14 }}>The two distorted passages are left in on purpose.</div>
          <div style={{ marginTop: 14 }}>Energy used to make this video: unknown. Nobody publishes a meter.</div>
          <div style={{ marginTop: 40, fontSize: 23, color: "#bbb", display: "flex", flexDirection: "column", gap: 10 }}>
            {ON_SCREEN_FACTS.map(([fact, src]) => <div key={fact}>{fact} <span style={{ color: "#888" }}>({src})</span></div>)}
            <div style={{ color: "#888" }}>The facts after the song: sources as shown on each card.</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 40, fontWeight: 600, marginBottom: 26 }}>Credits</div>
          <div style={{ fontSize: 25, color: "#ddd", display: "flex", flexDirection: "column", gap: 12 }}>
            <div>Song generated with Suno (v6). Animation written as code and rendered in Remotion by Claude Code.</div>
            <div>Audio restoration: the music-deslop post-filter (M6f 10k), run without its fallback.</div>
            <div>The Suno screen is the human’s own recording. The post-filter log after the song is rebuilt from the post-filter’s code and its detection output.</div>
            <div style={{ marginTop: 18 }}>Emoji graphics by Twemoji (Twitter, Inc. and other contributors), CC BY 4.0.</div>
            <div>Icons: Lucide (ISC). Map outlines: Natural Earth (public domain).</div>
            <div>Fonts: Inter, JetBrains Mono, Shrikhand and Caveat (SIL Open Font License).</div>
            <div>People, the farmhouse and the protest crowds are original SVG illustrations: faceless pictograms, no real people.</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export const PostRoll: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={S51_LEN + FADE}><S51 /></Sequence>
      <Sequence from={S51_LEN} durationInFrames={FADE}><AbsoluteFill style={{ background: "#000", opacity: ramp(f, S51_LEN, S51_LEN + FADE) }} /></Sequence>
      {FACTS.map(([id, text, source], k) => (
        <Sequence key={id} from={cardStart(k)} durationInFrames={CARDS[k]}><Fact text={text} source={source} /></Sequence>
      ))}
      <Sequence from={cardStart(FACTS.length)} durationInFrames={END}><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
