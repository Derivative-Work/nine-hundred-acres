"""C3: word-level forced alignment of the as-sung lyrics (lyrics/as_sung_draft.txt) against the vocal stems.

Method from Not Yet's align_words.py (itself from Sandbox Rhapsody): torchaudio's MMS forced aligner (MMS_FA,
multilingual wav2vec2 CTC) aligns each section's words as one continuous sequence inside the section's window, which
keeps every word in sung order, then splits it back into lines; words are trimmed to where the stem has energy
(-38 dB). Here each section names its own stem: the soloists are on Vocals, the choir on Backing Vocals.

Section windows come from the first pass (scripts/first_pass.py, faster-whisper medium.en on both vocal stems):
each runs from just before its first line to just before the next section's.

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
WINDOWS = {  # section: (start s, end s), from the first pass
    "Intro": (0.0, 19.5),
    "Verse 1": (19.5, 46.4),
    "Pre-Chorus": (46.0, 57.9),
    "Pre-Chorus tag": (57.5, 60.3),
    "Chorus": (60.0, 98.9),
    "Verse 2": (98.9, 126.8),
    "Pre-Chorus 2": (126.0, 132.9),
    # C4 correction (spectrogram + a re-transcription of 131-141 s): Suno sings the choir's "Through this fund!" first
    # (132.3 s, "fund" held to ~137 s), then the lead's "through this fund" (134.5 s, a melisma to ~138.5 s); chorus 2
    # starts at 139.4 s with two "share the shares" (141.2 s; "five" at 142.8 s), not four from 133.3 s
    "Pre-Chorus 2 tag": (131.9, 137.6),
    "Pre-Chorus 2 echo": (134.2, 139.1),
    "Chorus 2": (139.0, 163.2),
    "Verse 3": (163.2, 191.9),
    # C4 correction (windowed re-transcriptions of both stems and the mix): "When it's not!" is sung three times
    # (212.7, 214.8, 216.2 s; their own window, as one section they were squeezed late), and the final chorus opens
    # with two "share the shares" (220.5, 222.3 s), clear on the choir stem (the lead's is a blur)
    "Bridge": (191.9, 212.62),
    "Bridge tag": [(1, 212.5, 214.7), (1, 214.7, 216.3), (1, 216.25, 220.4)],  # per line, from the onsets of both stems;
    # the last "not!" is held to 220.3 s and "Share" comes in at 220.5 s (spectrogram)
    "Final Chorus open": (220.3, 223.75),
    "Final Chorus": (223.6, 247.3),
    "Outro": (247.3, 263.5),
    "Tag": (263.5, 283.4),
}
# lines the choir doesn't sing, aligned on another stem in their own window (section, line index): (stem, start, end).
# C4 correction: in chorus 1's "so help us grow" lines the choir holds "the more we give" under the lead, and on the
# choir stem the line was squeezed 0.5-1 s early (the lead: 78.0 and 91.8 s). The repeat sings "the more we give"
# twice (86.6, 90.3 s)
ON_STEM = {("Chorus", 5): ("Vocals", 77.8, 82.6), ("Chorus", 8): ("Vocals", 91.6, 98.4)}
SPOKEN = {"llc": "l l c", "ipo": "i p o", "tba": "t b a", "isn't": "isnt", "can't": "cant", "we'll": "well",
          "it's": "its", "i'd": "id", "who's": "whos", "haven't": "havent", "milestone's": "milestones",
          "holding's": "holdings", "don't": "dont"}


def sections():
    out, cur = [], None
    for line in Path("lyrics/as_sung_draft.txt").read_text().splitlines():
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
