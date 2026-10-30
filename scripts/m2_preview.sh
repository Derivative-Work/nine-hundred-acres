#!/usr/bin/env bash
# M2 ear check: the master under review/m2_preview.ass (shot labels, karaoke lyrics, failure spans) on black, 640x360,
# 30 fps, on the audio clock (no pre-roll). Usage: scripts/m2_preview.sh -> renders/m2/m2_preview.mp4
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
mkdir -p renders/m2
ffmpeg -v error -y -f lavfi -i "color=c=0x0b1020:s=640x360:r=30:d=238.4" -i audio/master/field-of-humming-things.no-fallback.wav \
  -vf "subtitles=review/m2_preview.ass,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf:fontsize=13:fontcolor=gray:x=w-tw-10:y=h-th-6:text='%{pts\:hms}  f%{eif\:n+60\:d}'" \
  -c:v libx264 -crf 28 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest renders/m2/m2_preview.mp4
