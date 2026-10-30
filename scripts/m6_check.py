"""M6: check the two failure spans (and the reveal) frame by frame against the audio, on the render that ships.

Usage: m6_check.py <full render .mp4> <lossless audio .wav rendered from the same composition>

1. Audio: the rendered track must be the no-fallback master, untouched, through both spans: compare the render's
   samples (offset by the 2 s pre-roll) with the master's and report the residual.
2. Picture: for each span boundary, the per-frame change (mean abs difference from the previous frame, at 480x270)
   for a window around it, and a strip of the frames either side, so the first changed frame can be read off.
3. Reveal: a strip of the S45-S47 cues.

Writes review/m6/*.jpg and prints a report (pasted into log/production_log.md).
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
MAP = json.loads((ROOT / "timing/map.json").read_text())
FPS, PRE = MAP["fps"], MAP["preroll_s"]
MASTER = ROOT / MAP["audio"]
OUT = ROOT / "review/m6"
W, H = 480, 270


def frames(video: Path, a: int, b: int) -> np.ndarray:
    """Frames a..b (inclusive) as float arrays at W x H."""
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{a / FPS:.4f}", "-i", str(video), "-frames:v", str(b - a + 1),
           "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32)


def strip(video: Path, a: int, b: int, name: str) -> None:
    n = b - a + 1
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a / FPS:.4f}", "-i", str(video), "-frames:v", str(n),
                    "-vf", f"scale={W}:{H},drawtext=text='%{{eif\\:n+{a}\\:d}}':x=8:y=8:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.7,"
                           f"tile={n}x1", "-frames:v", "1", str(OUT / f"{name}.jpg")], check=True)


def audio_check(render_wav: Path) -> list[str]:
    m, sr = sf.read(MASTER, dtype="float64", always_2d=True)
    r, sr2 = sf.read(render_wav, dtype="float64", always_2d=True)
    lines = [f"master {MASTER.name}: {sr} Hz, {m.shape[1]} ch; render {render_wav.name}: {sr2} Hz, {r.shape[1]} ch"]
    if sr != sr2:
        return lines + ["SAMPLE RATES DIFFER: cannot compare sample for sample"]
    off = int(round(PRE * sr))
    for s in MAP["failure_spans"]:
        a, b = int((s["start"] - 1) * sr), int((s["end"] + 1) * sr)  # the span and a second either side
        mm, rr = m[a:b], r[off + a:off + b]
        diff = rr - mm
        peak = np.abs(mm).max()
        res = 20 * np.log10(max(np.sqrt((diff ** 2).mean()), 1e-12) / max(np.sqrt((mm ** 2).mean()), 1e-12))
        lines.append(f"span {s['id']} ({s['start']}-{s['end']} s, +-1 s): max |render - master| = {np.abs(diff).max():.2e} "
                     f"(master peak {peak:.3f}); residual {res:.1f} dB relative to the signal; "
                     f"bit-identical: {bool(np.array_equal(rr, mm))}")
    return lines


def main() -> None:
    video, wav = Path(sys.argv[1]), Path(sys.argv[2])
    OUT.mkdir(parents=True, exist_ok=True)
    report = audio_check(wav)
    for s in MAP["failure_spans"]:
        for edge, fr in (("start", s["frame_start"]), ("end", s["frame_end"])):
            f = frames(video, fr - 6, fr + 6)
            d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2, 3))  # d[k]: change from frame fr-6+k to fr-5+k
            changes = " ".join(f"{fr - 5 + k}:{v:.2f}" for k, v in enumerate(d))
            report.append(f"span {s['id']} {edge} (frame {fr}, t = {s[edge]} s): per-frame change {changes}")
            strip(video, fr - 3, fr + 3, f"span{s['id']}_{edge}")
    shots = {x["id"]: x["frame"] for x in MAP["shots"]}
    for sid in ("S45", "S46", "S47", "S48", "S50"):
        strip(video, shots[sid] - 2, shots[sid] + 4, f"reveal_{sid}")
        report.append(f"{sid} at frame {shots[sid]}: strip review/m6/reveal_{sid}.jpg")
    print("\n".join(report))


if __name__ == "__main__":
    main()
