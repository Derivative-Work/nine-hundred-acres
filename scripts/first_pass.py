"""M1 first pass: what is sung where. faster-whisper (medium.en, int8, CPU) on the two vocal stems, no prompt,
word timestamps, so the as-sung lyrics and the section windows for the forced alignment come from the audio,
not the submitted text. Usage: .venv/bin/python -I scripts/first_pass.py -> timing/first_pass_{vocals,backing}.json
"""
import json
import sys
from pathlib import Path

import librosa
from faster_whisper import WhisperModel

sys.path.insert(0, str(Path(__file__).resolve().parent))
from song import STEM  # noqa: E402

model = WhisperModel("medium.en", device="cpu", compute_type="int8")
for stem, tag in (("0 Lead Vocals", "vocals"), ("1 Backing Vocals", "backing")):
    # decoded here, not by faster-whisper: its PyAV call breaks on the installed PyAV (metadata_errors)
    audio = librosa.load(STEM.format(stem), sr=16000, mono=True)[0]
    segs, info = model.transcribe(audio, beam_size=5, temperature=0, word_timestamps=True,
                                  vad_filter=False, condition_on_previous_text=False)
    out = [{"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
            "words": [{"w": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2), "p": round(w.probability, 2)}
                      for w in s.words]} for s in segs]
    Path(f"timing/first_pass_{tag}.json").write_text(json.dumps({"model": "faster-whisper medium.en int8", "stem": stem,
                                                                  "segments": out}, indent=1) + "\n")
    for s in out:
        print(f"{tag} {s['start']:7.2f}-{s['end']:7.2f} {s['text']}")
