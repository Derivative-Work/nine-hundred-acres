"""Review aid (brief, "Pipeline"): one contact sheet per shot, review/<shot>.jpg, from a rendered video of the whole
cut. Four frames per shot (at 10%, 35%, 65% and 90% of its range on screen) tiled 2x2, each 480 px wide (the
animatic's burn-in already names the shot and frame). Shot ranges come from timing/map.json for S01-S50 and from the post-roll layout
(remotion/src/shots/Post.tsx) for S51, F1-F7 and S52. Usage: python3 -I scripts/contact_sheets.py <video> [scale]
"""
import json
import subprocess
import sys
from pathlib import Path

S51, FADE, CARD, END, NFACT = 180, 15, 150, 600, 7  # keep in step with remotion/src/shots/Post.tsx


def ranges():
    m = json.loads(Path("timing/map.json").read_text())
    end = m["duration_frames"]
    out = [("S01", 0, m["shots"][1]["frame"])]
    for s in m["shots"]:
        if s["frame"] is None or s["id"] == "S01":
            continue
        out.append((s["id"], s["frame"], s.get("frame_end") or s["frame"] + 75))
    p = end
    out.append(("S51", p, p + S51 + FADE))
    for k in range(NFACT):
        a = p + S51 + FADE + k * CARD
        out.append((f"F{k + 1}", a, a + CARD))
    out.append(("S52", p + S51 + FADE + NFACT * CARD, p + S51 + FADE + NFACT * CARD + END))
    return out


def main(video):
    Path("review").mkdir(exist_ok=True)
    for sid, a, b in ranges():
        frames = [int(a + (b - a) * q) for q in (0.1, 0.35, 0.65, 0.9)]
        sel = "+".join(f"eq(n\\,{f})" for f in frames)
        vf = f"select='{sel}',scale=480:-1,tile=2x2:padding=4"  # the render's own burn-in names the shot and frame
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vf", vf, "-vsync", "0", "-frames:v", "1", "-q:v", "4",
                        f"review/{sid}.jpg"], check=True)
    print(len(ranges()), "contact sheets in review/")


if __name__ == "__main__":
    main(sys.argv[1])
