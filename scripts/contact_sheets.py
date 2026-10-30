"""Review aid (brief, "Pipeline"): one contact sheet per shot, review/<shot>.jpg, from a rendered video of the whole
cut. Four frames per shot (at 10%, 35%, 65% and 90% of its range on screen) tiled 2x2, each 480 px wide (the
animatic's burn-in already names the shot and frame). Shot ranges come from timing/map.json for S01-S50 and from the post-roll layout
(remotion/src/shots/Post.tsx) for S51, F1-F7 and S52. A section render (M5) starts at frame <offset> of the cut; only the
shots inside it get sheets. Usage: python3 -I scripts/contact_sheets.py <video> [<offset> <frames>]
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


def main(video, offset=0, length=None):
    Path("review").mkdir(exist_ok=True)
    shots = [(sid, a - offset, b - offset) for sid, a, b in ranges()]
    if length is not None:
        shots = [(sid, max(a, 0), min(b, length)) for sid, a, b in shots if a < length and b > 0 and min(b, length) - max(a, 0) >= 0.5 * (b - a)]
    for sid, a, b in shots:
        frames = [int(a + (b - a) * q) for q in (0.1, 0.35, 0.65, 0.9)]
        sel = "+".join(f"eq(n\\,{f})" for f in frames)
        vf = f"select='{sel}',scale=480:-1,tile=2x2:padding=4"  # the render's own burn-in names the shot and frame
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vf", vf, "-vsync", "0", "-frames:v", "1", "-q:v", "4",
                        f"review/{sid}.jpg"], check=True)
    print(len(shots), "contact sheets in review/:", " ".join(sid for sid, _, _ in shots))


if __name__ == "__main__":
    main(sys.argv[1], *(int(x) for x in sys.argv[2:4]))
