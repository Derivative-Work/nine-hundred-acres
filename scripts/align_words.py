"""M2: word-level forced alignment of the as-sung lyrics (lyrics/as_sung.txt) against the vocal stems.

From Share the Shares (method from Not Yet and Sandbox Rhapsody): torchaudio's MMS forced aligner (MMS_FA,
multilingual wav2vec2 CTC) aligns each section's words as one continuous sequence inside the section's window, which
keeps every word in sung order, then splits it back into lines; words are trimmed to where the stem has energy
(-38 dB). Each section names its stem: the coda is aligned on Backing Vocals, the rest on Lead Vocals.

Usage: .venv/bin/python -I scripts/align_words.py  ->  timing/words.json
"""
import json
import re
import sys
from pathlib import Path

import librosa
import numpy as np
import torch
import torchaudio

sys.path.insert(0, str(Path(__file__).resolve().parent))
from song import STEM  # noqa: E402

SR = 16000
WINDOWS = {  # section: (start s, end s), from the M1 first pass (timing/first_pass_*.json)
    "Verse 1": (12.8, 42.6),
    "Chorus": (42.4, 75.5),  # "things" held to 73.94 s
    "Verse 2": (79.0, 108.5),
    "Verse 3": (108.8, 139.8),
    "Bridge": (139.8, 169.5),
    "Coda": (174.0, 191.0),  # "wrote" ends 190.70 s; failure span 2 starts 191.17 s
}
ON_STEM = {}  # (section, line index): (stem, start, end) for a line aligned on another stem; none needed yet
SPOKEN = {"it's": "its", "it'll": "itll", "ain't": "aint", "'em": "em", "they're": "theyre", "i'm": "im",
          "'cause": "cause", "i've": "ive", "you're": "youre", "wasn't": "wasnt"}


def sections():
    out, cur = [], None
    for line in Path("lyrics/as_sung.txt").read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = re.match(r"\[(.+)\]$", line)
        if m:
            name, stem, singer = (x.strip() for x in m.group(1).split("|"))
            cur = {"section": name, "stem": stem, "singer": singer, "lines": []}
            out.append(cur)
        else:
            cur["lines"].append(line)
    return out


def spoken(word):
    w = word.lower().replace("’", "'")
    w = re.sub(r"[^a-z'\-]", "", w)
    w = SPOKEN.get(w, w)
    w = {"two": "two", "hundred": "hundred"}.get(w, w)
    return [p for p in re.split(r"[\s\-]+", w.replace("'", "")) if p]


def trim(words, y, a, floor_db=-38.0):
    hop = 160
    rms = librosa.feature.rms(y=y, frame_length=640, hop_length=hop)[0]
    db = 20 * np.log10(rms / (rms.max() + 1e-12) + 1e-12)
    for w in words:
        f0, f1 = int((w["start"] - a) * SR / hop), int((w["end"] - a) * SR / hop)
        loud = np.where(db[f0:f1 + 1] > floor_db)[0]
        if len(loud):
            s0, s1 = (f0 + loud[0]) * hop / SR + a, (f0 + loud[-1] + 1) * hop / SR + a
            if s1 - s0 >= 0.08:
                w["start"], w["end"] = round(s0, 3), round(s1, 3)
    return words


def main():
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model(with_star=False)
    tokenizer, aligner = bundle.get_tokenizer(), bundle.get_aligner()
    stems = {}
    out = []
    for sec in sections():
        if sec["stem"] not in stems:
            stems[sec["stem"]] = librosa.load(STEM.format(sec["stem"]), sr=SR, mono=True)[0]
        voc = stems[sec["stem"]]
        win = WINDOWS[sec["section"]]
        # a section's window, or (lines, start, end) groups where held notes pull one window's alignment off
        if isinstance(win[0], (int, float)):
            groups = [(sec["lines"], win)]
        else:
            assert sum(n for n, _, _ in win) == len(sec["lines"]), sec["section"]
            groups, k = [], 0
            for n, a, b in win:
                groups.append((sec["lines"][k:k + n], (a, b)))
                k += n
        first = len(out)
        groups = [(lines, ab, sec["stem"]) for lines, ab in groups] + \
            [([sec["lines"][i]], (a, b), stem) for (name, i), (stem, a, b) in ON_STEM.items() if name == sec["section"]]
        for lines, (a, b), stem in groups:
            if stem not in stems:
                stems[stem] = librosa.load(STEM.format(stem), sr=SR, mono=True)[0]
            voc = stems[stem]
            i0, i1 = int(a * SR), min(len(voc), int(b * SR))
            y = voc[i0:i1] / (np.abs(voc[i0:i1]).max() + 1e-9)
            display = [(k, w) for k, ln in enumerate(lines) for w in ln.split()]
            parts = [spoken(w) for _, w in display]
            flat = [p for ps in parts for p in ps]
            with torch.inference_mode():
                emission, _ = model(torch.from_numpy(y).float().unsqueeze(0))
                spans = aligner(emission[0], tokenizer(flat))
            ratio = (i1 - i0) / emission.shape[1] / SR
            per_line = [[] for _ in lines]
            j = 0
            for (k, w), ps in zip(display, parts):
                seg = spans[j:j + len(ps)]
                j += len(ps)
                start, end = seg[0][0].start * ratio + a, seg[-1][-1].end * ratio + a
                score = float(np.mean([s.score for sp in seg for s in sp]))
                per_line[k].append({"w": w, "start": round(start, 3), "end": round(end, 3), "score": round(score, 3)})
            for text, words in zip(lines, per_line):
                words = trim(words, y, a)
                out.append({"section": sec["section"], "stem": stem, "singer": sec["singer"], "text": text,
                            "start": words[0]["start"], "end": words[-1]["end"], "words": words})
        # an ON_STEM line replaces the section alignment's (they come last, one per line, in the section's order)
        sec_out, extra = out[first:first + len(sec["lines"])], out[first + len(sec["lines"]):]
        for (name, i), _ in [kv for kv in ON_STEM.items() if kv[0][0] == sec["section"]]:
            sec_out[i] = extra.pop(0)
        out[first:] = [{"id": f"L{first + k + 1:02d}", **ln} for k, ln in enumerate(sec_out)]
        for ln in out[first:]:
            low = [w["w"] for w in ln["words"] if w["score"] < 0.3]
            print(f"{ln['id']} {ln['start']:7.2f}-{ln['end']:7.2f} {ln['text'][:56]:56s} "
                  f"{'low: ' + ' '.join(low) if low else ''}")
    Path("timing/words.json").write_text(json.dumps({"aligner": "torchaudio MMS_FA", "torchaudio": torchaudio.__version__,
                                                     "lines": out}, indent=1) + "\n")


if __name__ == "__main__":
    main()
