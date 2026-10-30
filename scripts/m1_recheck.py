"""M1 re-check of doubtful lines: faster-whisper medium.en and small.en, unprompted, on short windows of the lead and
backing stems and the Suno mix, so each doubtful word gets several independent hearings.
Usage: .venv/bin/python -I scripts/m1_recheck.py -> timing/m1_recheck.json
"""
import json
import sys
from pathlib import Path

import librosa
from faster_whisper import WhisperModel

sys.path.insert(0, str(Path(__file__).resolve().parent))
from song import STEM, TRACK  # noqa: E402

WINDOWS = [  # (label, start s, end s): the lines the first pass heard differently from the brief
    ("v2 l1 rolled", 79.0, 87.0), ("v2 l2 of 'em a-burning / wind", 87.0, 94.5),
    ("v3 l2 waking / in a", 114.5, 122.5), ("bridge l2 out east / dollars", 145.0, 152.5),
    ("bridge l4 It said", 156.0, 160.5), ("coda l1-2", 174.5, 181.5), ("coda l3-4 hummed out", 181.5, 191.0),
    ("intro", 0.0, 13.5), ("tail", 214.0, 238.4),
]
SOURCES = {"lead": STEM.format("0 Lead Vocals"), "backing": STEM.format("1 Backing Vocals"), "mix": TRACK}
audio = {k: librosa.load(p, sr=16000, mono=True)[0] for k, p in SOURCES.items()}
out = []
for name in ("medium.en", "small.en"):
    model = WhisperModel(name, device="cpu", compute_type="int8")
    for label, a, b in WINDOWS:
        for src, y in audio.items():
            segs, _ = model.transcribe(y[int(a * 16000):int(b * 16000)], beam_size=5, temperature=0,
                                       word_timestamps=False, vad_filter=False, condition_on_previous_text=False)
            text = " ".join(s.text.strip() for s in segs)
            out.append({"model": name, "window": label, "start": a, "end": b, "source": src, "text": text})
            print(f"{name:9} {label:30} {src:7} | {text}")
Path("timing/m1_recheck.json").write_text(json.dumps(out, indent=1) + "\n")
