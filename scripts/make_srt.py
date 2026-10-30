"""The separate SRT for the main video: the same lines, on the same frames, as the burned-in captions.

Usage: make_srt.py <out.srt> [<first frame> <last frame>]

`Captions` (remotion/src/shots/kit.tsx) shows, on frame F, the first lyric line with words whose window
[frame_start - 8, frame_end + 10] contains F. This walks every frame with that rule and writes one cue per run of
frames showing the same line, so each cue starts and ends on the burned-in caption's own frames. With a frame range
(the vertical cut), cue times are relative to its first frame.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAP = json.loads((ROOT / "timing/map.json").read_text())
FPS = MAP["fps"]
LINES = [l for l in MAP["lines"] if l["words"]]


def shown(f: int):
    return next((l for l in LINES if l["frame_start"] - 8 <= f <= l["frame_end"] + 10), None)


def stamp(frame: int) -> str:
    ms = round(frame * 1000 / FPS)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main() -> None:
    out = Path(sys.argv[1])
    a, b = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (0, MAP["duration_frames"])
    cues, cur, start = [], None, None
    for f in range(a, b + 2):
        l = shown(f) if f <= b else None
        if l is not cur:
            if cur is not None:
                cues.append((start, f, " ".join(w["w"] for w in cur["words"])))
            cur, start = l, f
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("".join(f"{k}\n{stamp(s - a)} --> {stamp(e - a)}\n{t}\n\n" for k, (s, e, t) in enumerate(cues, 1)))
    print(f"{out}: {len(cues)} cues, frames {a}-{b}")


if __name__ == "__main__":
    main()
