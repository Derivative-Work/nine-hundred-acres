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
