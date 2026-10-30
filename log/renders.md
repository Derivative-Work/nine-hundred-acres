# Renders

Every render: timestamp, shot ID, composition, props, commit hash, output, contact sheet.

## 2026-10-30T00:40 — M2 ear-check preview

- **Shots:** all (labels only; no graphics yet). **Composition:** none (ffmpeg, not Remotion): `scripts/m2_preview.sh` burns `review/m2_preview.ass` (from `scripts/timing_map.py`) over a navy background with the master audio. 640x360, 30 fps, audio clock (no pre-roll); the corner counter shows the video frame (with the 60-frame pre-roll).
- **Commit:** built on 8d512b4 + the M2 scripts (committed with this entry).
- **Output:** `renders/m2/m2_preview.mp4` (238.4 s).
