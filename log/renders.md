# Renders

Every render: timestamp, shot ID, composition, props, commit hash, output, contact sheet.

## 2026-10-30T00:40 — M2 ear-check preview

- **Shots:** all (labels only; no graphics yet). **Composition:** none (ffmpeg, not Remotion): `scripts/m2_preview.sh` burns `review/m2_preview.ass` (from `scripts/timing_map.py`) over a navy background with the master audio. 640x360, 30 fps, audio clock (no pre-roll); the corner counter shows the video frame (with the 60-frame pre-roll).
- **Commit:** built on 8d512b4 + the M2 scripts (committed with this entry).
- **Output:** `renders/m2/m2_preview.mp4` (238.4 s).

## 2026-10-30T00:50 — M3 style board

- **Shots:** none (style board). **Composition:** `StyleBoard` (Remotion still, 1920x1080), props `{infection, label, heat, haze}` at 0.00, 0.15, 0.30 (haze 0.25), 0.40 (heat 1), 0.50 (heat 1), 0.70 (heat 1).
- **Commit:** b0cd8b6. **Command:** `scripts/m3_board.sh`.
- **Output:** `renders/m3/infection_*.png`; `review/m3_infection_{0.00,0.40,0.70}.jpg` (the gate's three), `review/m3_style_board.jpg` (all six tiled).
- **Earlier test stills** (scratch, not kept): two rounds that found an invalid-color bug (theme colors are `rgba()` strings, so hex-alpha suffixes failed: empty server tiles, pills without borders), a stretched pill, and a garbled Inter/Shrikhand crossfade at 0.5; all fixed before this render.

## 2026-10-30T01:10 — M3 context reel

- **Shots:** S07–S09, S16, S17–S22 (S19–S21 as the overlay layer), S23–S25, S36/S36a–S37, S42–S44, S48–S49. **Composition:** `ContextReel` (1920x1080, 30 fps, 2,623 frames), rendered at `--scale=0.5` (960x540), `--crf=23`, with the master's audio trimmed to each clip.
- **Commit:** 17b921c. **Command:** `cd remotion && npx remotion render src/index.ts ContextReel ../renders/m3/context_reel.mp4 --scale=0.5 --crf=23` (2 min 4 s on the GTX 970 box, CPU).
- **Output:** `renders/m3/context_reel.mp4` (87.4 s; audio mean −17.9 dB); contact sheet `review/m3_context_reel.jpg` (every 6 s).
- **Test stills before the render** (scratch, not kept): 14 frames; they led to the haze cap of 0.45 and the overlay widening to fit "Artifact suppression: OFF (by choice)" on one line.

## 2026-10-30T01:45 — M4 animatic v1 (archived)

- **Shots:** all, S01–S52. **Composition:** `Animatic` (1920x1080, 30 fps, 9,057 frames: 60 pre-roll + 7,152 audio + 1,845 post-roll), `--scale=0.5 --crf=24`. **Commit:** the M4 scenes commit before 302d37e.
- **Output:** `archive/renders/m4_animatic_v1.mp4` (superseded: S33a's power button hid under the toggle card; sign lettering clipped). A/V check: the animatic's audio at 62 s matched the master at 60.000 s (cross-correlation), the 2 s pre-roll exactly.

## 2026-10-30T01:52 — M4 animatic v2

- **Shots:** all, S01–S52. **Composition:** `Animatic`, same settings. **Commit:** 302d37e. **Command:** `cd remotion && npx remotion render src/index.ts Animatic ../renders/m4/animatic.mp4 --scale=0.5 --crf=24` (about 4 min on the GTX 970 box, CPU).
- **Output:** `renders/m4/animatic.mp4` (301.9 s, 960x540). Contact sheets: `review/<shot>.jpg` for all 57 shot IDs (`scripts/contact_sheets.py`); `review/m4_animatic_overview.jpg` (every 10 s).

## 2026-10-30T02:20 — M4 density sample (Verse 1 and Chorus 1)

- **Shots:** S04–S16 (frames 300–2010). **Composition:** `Animatic` with the new chrome, `--frames=300-2010 --scale=0.5 --crf=24`. **Commit:** 6df6395.
- **Output:** `renders/m4/density_sample.mp4` (57 s). Test stills before it (scratch): one found a crash (a note with no end time passed Infinity to `interpolate`), one the burn-in colliding with the chapter header.

## 2026-10-30T02:50 — M4 animatic v3 (with the explainer chrome and annotations)

- **Shots:** all, S01–S52. **Composition:** `Animatic` (chrome on, burn-in at the bottom right), `--scale=0.5 --crf=24`. **Commit:** d4a94a1.
- **Output:** `renders/m4/animatic.mp4` (301.9 s); v2 moved to `archive/renders/m4_animatic_v2.mp4`. Contact sheets `review/<shot>.jpg` (57) and `review/m4_animatic_overview.jpg` regenerated.
- **Test stills before it** (scratch): 12 frames, S18–S42. They found the haze stopping short of the right edge (`AbsoluteFill` sets `width: 100%`, which defeated the overhang; also the lava layer) and S26's tiles lingering over S27's buildings; both fixed.

## 2026-10-30T05:51 — M4 animatic v4 (coda corruption)

- **Shots:** all, S01–S52 (changed: S48–S50). **Composition:** `Animatic`, `--scale=0.5 --crf=24`. **Commit:** 2e32c53.
- **Output:** `renders/m4/animatic.mp4` (301.9 s); v3 moved to `archive/renders/m4_animatic_v3.mp4`. Contact sheets regenerated.
- **Test stills before it** (scratch): 9 frames, S48–S50, before and after the change.
- **Why:** the human's note on S49–S50. Gate: framing and timing.

## 2026-10-30T06:46 — M4 animatic v5 (caret, fan fade-in)

- **Shots:** all, S01–S52 (changed: S01–S04 and S48–S50 caret; the sound from 230 s). **Composition:** `Animatic`, `--scale=0.5 --crf=24`. **Commit:** ffc5b5d.
- **Output:** `renders/m4/animatic.mp4` (301.9 s); v4 moved to `archive/renders/m4_animatic_v4.mp4`. Contact sheets regenerated.
- **Check:** RMS by second (video time) 236 s −17.0, 239 s −32.3, 241 s −36.6, 244 s −43.1 dB: the chord decays into the fan with no step at the song's end.

## 2026-10-30T06:50 — M5 final: Intro (S01–S04) and Verse 1 (S05–S11)

- **Composition:** `Animatic` with `label: false` (chrome on), full 1920×1080, `--crf=16`, frames 0–484 → `renders/m5/01_intro.mp4` (16.2 s) and 485–1387 → `renders/m5/02_verse1.mp4` (30.1 s). Rendering the final cut's own frame ranges means the approved sections are exactly what the full render will contain. **Commit:** 84fa484.
- **Full-res still pass before it** (scratch, 9 frames): S10's "archived" badge was see-through over the white photo border (unreadable) and the "family photo · 1 of 1" label ran off the right edge; both fixed. Nothing else found.
- **Contact sheets:** `review/S01.jpg`–`review/S11.jpg` from these renders (`contact_sheets.py` now takes a section offset and length).
- **Gate:** approve each section.

## 2026-10-30T06:57 — M5 final: Verse 1 v2 (S05–S11)

- **Change:** granddad.jpg (`Farmhouse`, `components/illustrations.tsx`) redrawn in more detail; S10's label now points at the house. **Commit:** 4c45e5a.
- **Output:** `renders/m5/02_verse1.mp4` (frames 485–1387, 1080p, CRF 16); v1 moved to `archive/renders/m5/02_verse1_v1.mp4`. Sheets `review/S05.jpg`–`S11.jpg` regenerated.

## 2026-10-30T07:08 — M5 final: Verse 1 v3, Chorus 1 (S12–S16), Span 1 (S17–S22)

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16. Frames 485–1387 → `renders/m5/02_verse1.mp4` (v2 archived to `archive/renders/m5/02_verse1_v2.mp4`), 1388–2007 → `03_chorus1.mp4` (20.7 s), 2008–2561 → `04_span1.mp4` (18.5 s). **Commit:** a55084d.
- **Full-res still pass before it** (scratch, 12 frames S12–S22) found:
  - S22's Memphis card was still the M3 placeholder ("map placeholder: Natural Earth outline in M4"). Now the Natural Earth map (`MapView`, Tennessee highlighted, the existing Memphis pin labeled "South Memphis, TN"); "you are here" points at the pin.
  - S15's night overlay stopped short of the frame edges under the scaled stage; it now overhangs like the haze.
  - "The Hum · always" sat on the wave's crests (S11, S16); it now sits above the wave (S11's "amplitude" note moved up to clear it). This touches Verse 1, hence v3.
  - S18's cloud tiles lingered beside the Memphis map; they fade as it arrives.
- **Contact sheets:** `review/S05.jpg`–`S22.jpg` (`contact_sheets.py` now includes every shot that starts inside the section, so S21 gets one).

## 2026-10-30T08:25 — M5 final: Verse 2 (S23–S27) and Verse 3 (S32–S38)

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16. Frames 2562–3351 → `renders/m5/05_verse2.mp4` (26.3 s; commit b4bd7d0), 3352–4293 → `renders/m5/06_verse3.mp4` (31.4 s; commit ec29062).
- **Full-res still pass before it** (scratch, 10 frames each) found:
  - Verse 2: the "exhaust" leader crossed the whole turbine grid to a fan, now short and to a plume; "no answer" sat on the "Permit office" title, now points at the sign (the cursor knocks on the door icon); the lawyers' briefcases overlapped the last house.
  - Verse 3: the peace sign on the 1979 banner drew no circle (an SVG arc with equal ends draws nothing; `PeaceToPower` now keeps a 1° gap) and sat off-center; the "hand-lettered" leader crossed the banner (label now under the photo); the timeline labels touched the caption bar (moved up 20 px); S36's cord ran behind the stat tiles and began in midair (now enters from the frame edge, below the tiles).
- **Contact sheets:** `review/S23.jpg`–`S27.jpg`, `review/S32.jpg`–`S38.jpg` (with S33a, S36a).

## 2026-10-30T08:33 — M5 final: Verse 3 v2 (S32–S38)

- **Change:** the 1979 crowd photo redrawn in more detail (human note). Still faceless flat pictograms per the brief, with the detail in the scene and silhouettes: overcast sky, two generic cooling towers with drifting steam across the river, a tree line, a chain-link fence, two rows of people behind the front line (placards, raised fists), the peace banner as a bedsheet on two poles; the front line gets 1970s hair (long, afro, beard, headband, cap), open jackets, fringed vests, striped knits, flared jeans and cords, and cardboard signs with tape and marker lettering. S38's gray crowd is the same scene; its back rows' placards read "…ok, fine" too. `RallyGround`, `RallyBanner`, `Protester` in `components/illustrations.tsx`. **Commit:** 375b011.
- **Output:** `renders/m5/06_verse3.mp4` (frames 3352–4293, 1080p, CRF 16); v1 moved to `archive/renders/m5/06_verse3_v1.mp4`. Sheets `review/S32.jpg`–`S38.jpg` regenerated. Sent as a CRF 21 review copy (upload limit).

## 2026-10-30T08:43 — M5 final: Bridge (S39–S44)

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16. Frames 4294–5331 → `renders/m5/07_bridge.mp4` (34.6 s). **Commit:** 650683b.
- **Full-res still pass before it** (scratch, 10 frames) found:
  - S40's axis midpoint read "$3B" on the $5B scale (rounded to whole billions); now "$2.5B" (and "$0.5B" on the $1B scale). A wrong on-screen number, caught before release.
  - S42–S44: the "$29B (est.)" label rode the widening error bar up into the chart title; the label now sits beside the bar, and the bar is shorter so the widest error bar stays under the title.
  - S42: "sparkle: decorative" pointed at "Estimates", with its leader across the user's bubble; it now points at the sparkle from above-left.
- **Contact sheets:** `review/S39.jpg`–`S44.jpg`.

## 2026-10-30T09:14 — M5 final: Verse 3 v3, Bridge v2, Coda (S45–S50)

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16. **Commit:** 81b55df. Frames 3352–4293 → `renders/m5/06_verse3.mp4` (v2 → `archive/renders/m5/06_verse3_v2.mp4`); 4294–5331 → `07_bridge.mp4` (v1 → `archive/renders/m5/07_bridge_v1.mp4`); 5332–7211 → `08_coda.mp4` (62.7 s, through the song's end, with the fan fading in under the last chord; an earlier coda render with the placeholder, never sent, → `archive/renders/m5/08_coda_v1.mp4`).
- **Changes:** see production_log.md 09:10 (peace sign in its containers; rescales as events; the real Suno capture synced in S45–S47). Coda still pass before it (scratch, 10 frames + 4 with the capture): the chapter header showed over the S46 window (fixed, commit b3e04fa); the capture window sat on the caption bar (raised 40 px until the push).
- **Contact sheets:** `review/S32.jpg`–`S50.jpg` regenerated.

## 2026-10-30T09:59 — M6: full render v2 and span-edge review clips

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16, all 9147 frames (304.9 s) → `renders/m6/nine_hundred_acres_full.mp4`; track as WAV → `renders/m6/audio_check.wav`. **Commit:** c3b0869. v1 (before the span 2 onset tear and the S51 rebuild) → `archive/renders/m6/`.
- **Check** (`scripts/m6_check.py`): audio through both spans = the no-fallback master to one 16-bit step; first changed frames 2232, 2539, 5795 (tear, held to 5799, released 5800), 6927, each the span edge from fallback.json. Strips in `review/m6/`.
- **Review clips:** `renders/m6/m6_span_edges.mp4` (4 × 8 s with audio, ±4 s around each edge, frame counter burned in, a red label from the edge frame on).
- **Found on S51** (`review/m6/S51.jpg`): JetBrains Mono's ligature drew `->` as an arrow; ligatures are now off in S51 (re-rendered in M7).

## 2026-10-30T10:24 — M7: vertical cut and closing

- **Vertical cut:** composition `Vertical` (1080×1920, 30 fps; S12–S27, frames 1388–3351 of the main timing, the master trimmed to match), CRF 16 → `renders/m7/vertical_s12-s27.mp4` (65.5 s). **Commit:** 33aea1a. Scenes read `usePortrait()` and reflow to one column; the chrome is stacked (chapter and status chip, then the headline; source line and progress bar at the bottom); captions sit in the top third. 1,000 rooms stay 1,000 (25 × 40 tiles). Overview: `review/m7_vertical_overview.jpg`. SRT: `deliverables/nine_hundred_acres_vertical.en.srt` (13 cues, same rule, times from S12).
- **Still pass before it** (scratch, 19 frames at half scale): the corn row ran wide (scaled down), S16, Span 1 and the permit scene sat high with the bottom third empty (moved down 100–170 px).
- **Closing:** `Animatic`, `label: false`, frames 7212–9146 (S51, fade, F1–F7, S52) → `renders/m7/closing_s51-s52.mp4` (64.5 s), with the fan and room tone (postroll v3).

## 2026-10-30T11:12 — Draft cut (for the human's audits)

- **Composition:** `Animatic`, `label: false`, 1080p, CRF 16, all 9147 frames → `renders/m7/nine_hundred_acres_draft.mp4` (304.9 s: the song, S51, F1–F7, S52). **Commit:** bc2bb16. Everything approved through M7; the fact cards and on-screen facts are unaudited (M8).
- **Preview:** a 720p two-pass copy (620 kb/s, 28 MB, scratch only) sent so it fits the upload limit; the 1080p file is the draft.

## 2026-10-30 — M8 release candidate

| Shot | Composition | Props | Commit | Output |
| --- | --- | --- | --- | --- |
| S01–S52, F1–F7b | Animatic | `{"label":false}`, CRF 16 | 148a4ee | `renders/m8/nine_hundred_acres_m8.mp4` (336.5 s) |
| S12–S27 (vertical) | Vertical | CRF 16 | 148a4ee | `renders/m8/vertical_s12-s27_m8.mp4` (65.5 s) |
