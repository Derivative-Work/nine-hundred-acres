// After the song: S51 (the post-filter's terminal output for this song, rebuilt from the music-deslop repo's own
// print statements and the run's real detected spans; the human chose this over a capture, see production_log.md
// 2026-10-30T09:40), a fade to black, the fact cards F1-F7 (plain white type on black, one fact per card, source
// beneath, about five seconds each, plain cuts, no explainer styling, no emoji), then the end card S52 in plain type.
// Card wording is the brief's; M8 verifies each against a primary source (or cuts it) before release.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ramp } from "./kit";
import { useCurrentFrame } from "remotion";

export const FACTS: [string, string, string][] = [
  ["F1", "11 data centers sit within half a mile of an elementary school in Ashburn, Virginia. NBC News is investigating what their backup generators mean for the air there.", "NBC News, Oct 28, 2026"],
  ["F2", "Northern Virginia data centers have about 10,500 diesel backup generators, nearly 27 gigawatts in all.", "Sierra Club Virginia, Jul 2026"],
  ["F3", "One backup generator burns about 150 gallons of diesel an hour. One permit allows a single data center up to 10 million gallons a year.", "Prince William Times; Virginia Mercury"],
  ["F4", "In July 2026 the EPA proposed letting states drop public comment on “minor source” air permits, which cover most data center generators.", "Sierra Club Virginia"],
  ["F5", "Neighbors near one Virginia data center measured noise above the county’s 60 dB limit. The ordinance exempts air conditioning.", "AP via WSLS, 2022"],
  ["F6", "Salix, Iowa annexed 900 acres of farmland. The council voted 3–2 against a moratorium; the county has sued over the annexation.", "Iowa Public Radio; KTIV"],
  ["F7", "In Memphis, court filings cite 57 trailer-mounted gas turbines.", "Filterbuy explainer"],
];

export const S51_LEN = 270, FADE = 15, CARD = 150, END = 600;
export const postLength = S51_LEN + FADE + FACTS.length * CARD + END;

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

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const page2 = f >= END / 2;
  return (
    <AbsoluteFill style={{ background: "#000", padding: "110px 220px", ...plain, fontSize: 30, lineHeight: 1.5 }}>
      {!page2 ? (
        <>
          <div style={{ fontSize: 56, fontWeight: 600, marginBottom: 30 }}>Nine Hundred Acres (The Hum)</div>
          <div>Words, music, animation and audio restoration by machines. Takes chosen and gates approved by a human.</div>
          <div style={{ marginTop: 20 }}>The two distorted passages are left in on purpose.</div>
          <div style={{ marginTop: 20 }}>Energy used to make this video: unknown. Nobody publishes a meter.</div>
          <div style={{ marginTop: 40, fontSize: 24, color: "#aaa" }}>
            Salix annexation, ~900 acres, proposed (Iowa Public Radio) · Memphis turbines without permits (Oil &amp; Gas Watch; Gas Outlook) ·
            Crane Clean Energy Center, restart mid-2027 (Maryland Matters) · Unit 1 shut down in 2019 (Enlit) ·
            $29B est. to PJM ratepayers (NPR via KUNC) · No public real-time meter for AI data center energy (gradually.ai) ·
            Fact cards: sources as shown on each card.
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 40, fontWeight: 600, marginBottom: 24 }}>Credits</div>
          <div style={{ fontSize: 26, color: "#ddd" }}>
            Song generated with Suno (V6). Animation code-rendered by Claude Code in Remotion. Audio restoration: the music-deslop post-filter (M6f 10k), artifact suppression off.<br /><br />
            Emoji graphics by Twemoji (Twitter, Inc. and other contributors), CC BY 4.0.<br />
            Icons: Lucide (ISC). Map outlines: Natural Earth (public domain).<br />
            Fonts: Inter, JetBrains Mono, Shrikhand, Caveat (SIL OFL).<br />
            People, farmhouse and protest crowd: original SVG illustrations.
          </div>
          <div style={{ fontSize: 22, color: "#777", marginTop: 40 }}>[animatic: end-card wording and credits are drafts until M7 and M8]</div>
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
        <Sequence key={id} from={S51_LEN + FADE + k * CARD} durationInFrames={CARD}><Fact text={text} source={source} /></Sequence>
      ))}
      <Sequence from={S51_LEN + FADE + FACTS.length * CARD} durationInFrames={END}><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
