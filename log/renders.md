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
