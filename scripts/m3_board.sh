#!/usr/bin/env bash
# M3 style board: the StyleBoard still at each section's target infection (brief, "The infection arc"), full size in
# renders/m3/, JPEGs in review/ (the gate's three: 0, 0.4, 0.7), and all of them tiled in review/m3_style_board.jpg.
# Usage: scripts/m3_board.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
mkdir -p renders/m3 review
boards=(
  "0.00|Intro, Verse 1|0|0"
  "0.15|Chorus 1|0|0"
  "0.30|Verse 2 (with the lingering haze)|0|0.25"
  "0.40|gate check (tie-dye heat map)|1|0"
  "0.50|Verse 3 (heat map: S36a)|1|0"
  "0.70|Bridge peak|1|0"
)
for b in "${boards[@]}"; do
  IFS='|' read -r v label heat haze <<< "$b"
  (cd remotion && npx remotion still src/index.ts StyleBoard "../renders/m3/infection_${v}.png" --frame=0 \
    --props="{\"infection\":${v},\"label\":\"${label}\",\"heat\":${heat},\"haze\":${haze}}" --log=error)
done
for v in 0.00 0.40 0.70; do ffmpeg -v error -y -i "renders/m3/infection_${v}.png" -q:v 3 "review/m3_infection_${v}.jpg"; done
ffmpeg -v error -y $(for b in "${boards[@]}"; do printf -- '-i renders/m3/infection_%s.png ' "${b%%|*}"; done) \
  -filter_complex "[0]scale=960:-1[a];[1]scale=960:-1[b];[2]scale=960:-1[c];[3]scale=960:-1[d];[4]scale=960:-1[e];[5]scale=960:-1[f];[a][b][c][d][e][f]xstack=inputs=6:layout=0_0|w0_0|0_h0|w0_h0|0_h0+h1|w0_h0+h1" \
  -q:v 3 review/m3_style_board.jpg
ls -la review/m3_*
