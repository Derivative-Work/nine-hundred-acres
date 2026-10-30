"""M2: the timing map, the clock every later step reads.

Joins the beat grid (scripts/beats_beat_this.py), the aligned words (scripts/align_words.py), the two failure spans
(log/postfilter/fallback.json) and the brief's shot list (docs/brief.md) into timing/map.json and a readable
timing/map.md, plus a review preview's subtitles (review/m2_preview.ass, burned in by scripts/m2_preview.sh).

Clocks: `t` is seconds of the audio (the Suno mix = the master; same length, the post-filter does not move timing).
`frame` is the video's frame at 30 fps, which starts PREROLL_S before the audio so S01's blinking cursor plays on
black before the first strum: frame = round((t + PREROLL_S) * FPS).

Shot cues (brief: "Every shot below is cued by lyric, not time; the map resolves cues to frames") are resolved in
reading order, searching forward from the previous shot. A quoted cue is matched to the first line at or after the
previous shot's line holding its words in order, and the shot starts at the first matched word. Event cues (the
first strum, the intro harmonies, the failure spans, the final chord) are computed from the stems. Overlay shots
(S19-S21: the restore overlay, top right) are a layer over the base picture and do not end it. "a" inserts share
their parent's cue and play with it. Retired shots (no chorus 2) and the shots after the audio (S51, F1-F7, S52) get
no time.

Usage: .venv/bin/python -I scripts/timing_map.py  ->  timing/map.json, timing/map.md, review/m2_preview.ass
"""
import json
import re
import sys
from pathlib import Path

import librosa
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from song import MASTER, STEM, SUNO_TITLE, TITLE, TRACK  # noqa: E402

FPS = 30
PREROLL_S = 2.0  # S01: black and a blinking cursor before the music
DURATION_S = 238.4
SR = 22050
OVERLAY = {"S19", "S20", "S21"}
POST = ("S51", "S52")  # after the audio: the real terminal capture and the end card (F1-F7 play between them)


def fr(t):
    return None if t is None else int(round((t + PREROLL_S) * FPS))


def norm(s):
    return re.sub(r"[^a-z0-9 ]", " ", s.lower().replace("’", "'").replace("'", "")).split()


def shot_rows():
    rows = []
    for line in Path("docs/brief.md").read_text().splitlines():
        m = re.match(r"\| (S\d\d[a-z]?) \| (.*?) \| (.*?) \| (.*?) \|$", line)
        if m and m.group(1) not in {r["id"] for r in rows}:  # the bookends table repeats S51/S52 without a cue
            rows.append({"id": m.group(1), "cue": m.group(2), "picture": m.group(3), "source": m.group(4)})
    return rows


def envelope(stem, hop=512):
    y, _ = librosa.load(STEM.format(stem), sr=SR, mono=True)
    r = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop)[0]
    return librosa.times_like(r, sr=SR, hop_length=hop), 20 * np.log10(r + 1e-9)


def runs(t, mask, min_len=0.3):
    """(start, end) of each run of True in mask, dropping runs shorter than min_len."""
    m = np.concatenate([[False], mask, [False]]).astype(int)
    on, off = np.where(np.diff(m) == 1)[0], np.where(np.diff(m) == -1)[0] - 1
    return [(float(t[a]), float(t[b])) for a, b in zip(on, off) if t[b] - t[a] >= min_len]


def events():
    g, _ = librosa.load(STEM.format("4 Guitar"), sr=SR, mono=True)
    strum = float(librosa.onset.onset_detect(y=g[:SR * 3], sr=SR, units="time", backtrack=True)[0])
    t, lead = envelope("0 Lead Vocals")
    _, back = envelope("1 Backing Vocals")
    _, drums = envelope("2 Drums")
    voc = np.maximum(lead, back)
    intro = runs(t, (t < 14) & (voc > -40))
    outro = runs(t, (t > 190.5) & (voc > -40))
    last_drum = float(t[(t > 215) & (drums > -40)].max())
    y, _ = librosa.load(MASTER, sr=SR, mono=True)
    rm = 20 * np.log10(librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0] + 1e-9)
    tm = librosa.times_like(rm, sr=SR, hop_length=512)
    return {"first_strum": round(strum, 3), "intro_harmonies": [round(intro[0][0], 3), round(intro[-1][1], 3)],
            "outro_vocals": [round(outro[0][0], 3), round(outro[-1][1], 3)], "last_drum_hit": round(last_drum, 3),
            "audio_end": round(float(tm[rm > -50].max()), 3)}


def main():
    words = json.loads(Path("timing/words.json").read_text())["lines"]
    bt = json.loads(Path("timing/beat_this.json").read_text())["mix"]
    ev = events()
    # the grid ends at the last regular bar: the final chord is out of time (beat_this's last bars are 1-2 beats)
    beats = [b for b in bt["beats"] if b < ev["last_drum_hit"] + 0.3]
    downs = [d for d in bt["downbeats"] if d < ev["last_drum_hit"] + 0.3]
    spans = next(s for s in json.loads(Path("log/postfilter/fallback.json").read_text())
                 if s["song"] == "field-of-humming-things")["regions"]
    span1, span2 = [[round(a, 3), round(b, 3)] for a, b, _ in spans]

    by_sec = {}
    for ln in words:
        by_sec.setdefault(ln["section"], []).append(ln)
    sec = lambda n: (by_sec[n][0]["start"], by_sec[n][-1]["end"])  # noqa: E731
    sections = [
        {"name": "Intro", "start": 0.0, "end": sec("Verse 1")[0], "note": "twelve-string from the first strum; "
         "wordless harmonies %.2f-%.2f s" % tuple(ev["intro_harmonies"])},
        {"name": "Verse 1", "start": sec("Verse 1")[0], "end": sec("Verse 1")[1]},
        {"name": "Chorus 1", "start": sec("Chorus")[0], "end": sec("Chorus")[1]},
        {"name": "Interlude 1", "start": sec("Chorus")[1], "end": sec("Verse 2")[0], "note": "instrumental, inside failure span 1"},
        {"name": "Verse 2", "start": sec("Verse 2")[0], "end": sec("Verse 2")[1], "note": "no chorus 2 follows"},
        {"name": "Verse 3", "start": sec("Verse 3")[0], "end": sec("Verse 3")[1]},
        {"name": "Bridge", "start": sec("Bridge")[0], "end": sec("Bridge")[1]},
        {"name": "Interlude 2", "start": sec("Bridge")[1], "end": sec("Coda")[0], "note": "the band plays on; the needle lift is visual only"},
        {"name": "Coda", "start": sec("Coda")[0], "end": sec("Coda")[1], "note": "the band plays under it"},
        {"name": "Outro", "start": sec("Coda")[1], "end": ev["last_drum_hit"], "note": "wordless ooh/ah over the full band; failure span 2"},
        {"name": "Final chord", "start": ev["last_drum_hit"], "end": ev["audio_end"], "note": "drums out; voices hold, then fade"},
    ]
    for s in sections:
        s["start"], s["end"] = round(s["start"], 3), round(s["end"], 3)
        s["frame_start"], s["frame_end"] = fr(s["start"]), fr(s["end"])

    flat = [(i, j, w) for i, ln in enumerate(words) for j, w in enumerate(ln["words"])]
    computed = {
        "S01": (None, "pre-roll: frames 0-%d, before the audio" % (fr(0) - 1)),
        "S02": (ev["first_strum"], "first guitar-stem onset"),
        "S03": (ev["intro_harmonies"][0], "intro harmonies start (vocal stems above -40 dB)"),
        # the title card holds the last two bars of the intro, then shrinks into the map at "Out in Salix"
        "S04": (max(d for d in downs if d <= sec("Verse 1")[0] - 2 * 4 * 0.46), "the downbeat two bars before verse 1"),
        "S19": (span1[0], "failure span 1 start"),
        "S20": (round(sum(span1) / 2, 3), "failure span 1 midpoint"),
        "S21": (span1[1], "failure span 1 end: the overlay's green check (Retrying… leads it by a beat)"),
        "S49": (span2[0], "failure span 2 start"),
        "S50": (span2[1], "failure span 2 end, the final chord ringing (drums out at %.2f s)" % ev["last_drum_hit"]),
    }
    shots, pos, prev = [], 0, None
    for r in shot_rows():
        sid, cue = r["id"], r["cue"]
        row = {"id": sid, "cue": cue, "t": None, "frame": None, "line": None, "how": None}
        if r["picture"].startswith("Retired"):
            row["how"] = "retired (no chorus 2 in the master)"
        elif sid in POST:
            row["how"] = "after the audio"
        elif sid in computed:
            row["t"], row["how"] = computed[sid]
        elif re.match(r"S\d\d[a-z]$", sid):
            row.update(t=prev["t"], line=prev["line"], how="insert: plays with " + prev["id"])
        else:
            want = norm(cue.split(" / ")[0].strip('"'))
            for k in range(pos, len(flat)):
                cand = [norm(w["w"]) for _, _, w in flat[k:k + len(want) + 8]]
                cand = [x for ws in cand for x in ws]
                if cand[:len(want)] == want:
                    i, _, w = flat[k]
                    row.update(t=w["start"], line=words[i]["id"], how="lyric")
                    pos = k
                    break
            else:
                row["how"] = "NOT FOUND"
        row["frame"] = fr(row["t"])
        if sid in OVERLAY:
            row["layer"] = "overlay"
        shots.append(row)
        if row["t"] is not None and not re.match(r"S\d\d[a-z]$", sid):
            prev = row
    # a base shot runs until the next base shot starts (overlays and inserts don't end it)
    base = [s for s in shots if s["t"] is not None and "layer" not in s and "insert" not in s["how"]]
    for a, b in zip(base, base[1:]):
        a["end"], a["frame_end"] = b["t"], fr(b["t"])
    base[-1]["end"], base[-1]["frame_end"] = DURATION_S, fr(DURATION_S)
    for s in shots:
        if "insert" in (s["how"] or ""):
            parent = next(p for p in base if p["t"] == s["t"])
            s["end"], s["frame_end"] = parent["end"], parent["frame_end"]

    lines = [{"id": ln["id"], "section": ln["section"], "text": ln["text"], "start": ln["start"], "end": ln["end"],
              "frame_start": fr(ln["start"]), "frame_end": fr(ln["end"]),
              "words": [{"w": w["w"], "start": w["start"], "end": w["end"], "frame": fr(w["start"])} for w in ln["words"]]}
             for ln in words]
    lines.insert(0, {"id": "L00", "section": "Intro", "text": "Ooh… ooh-ooh…", "start": ev["intro_harmonies"][0],
                     "end": ev["intro_harmonies"][1], "frame_start": fr(ev["intro_harmonies"][0]),
                     "frame_end": fr(ev["intro_harmonies"][1]), "words": [], "note": "wordless; placed from stem energy"})
    out = {"title": TITLE, "suno_title": SUNO_TITLE, "fps": FPS, "preroll_s": PREROLL_S,
           "audio": MASTER, "timing_source": TRACK, "duration_s": DURATION_S,
           "duration_frames": fr(DURATION_S), "frame_formula": "round((t + preroll_s) * fps)",
           "meter": "4/4", "bpm_median": round(60 / float(np.median(np.diff(beats))), 1),
           "beats": beats, "downbeats": downs, "events": ev,
           "failure_spans": [{"id": 1, "start": span1[0], "end": span1[1], "frame_start": fr(span1[0]), "frame_end": fr(span1[1])},
                             {"id": 2, "start": span2[0], "end": span2[1], "frame_start": fr(span2[0]), "frame_end": fr(span2[1])}],
           "sections": sections, "lines": lines, "shots": shots}
    Path("timing/map.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    write_md(out)
    write_ass(out)
    for s in shots:
        print(f"{s['id']:5} {s['t'] if s['t'] is not None else '':>8} {s['frame'] if s['frame'] is not None else '':>6}  {s['how']}  {s['cue'][:50]}")


def write_md(m):
    L = [f"# Timing map\n",
         f"M2. Generated by `scripts/timing_map.py` into `timing/map.json`. {m['fps']} fps; the video opens with "
         f"{m['preroll_s']:.0f} s of pre-roll (S01), so frame = round((t + {m['preroll_s']:.0f}) × {m['fps']}). Audio "
         f"{m['duration_s']} s ({m['duration_frames']} frames with the pre-roll); {m['meter']} at a median "
         f"{m['bpm_median']} bpm, {len(m['downbeats'])} bars. Times are seconds of the audio.\n",
         "## Failure spans\n", "| Span | Start (s) | End (s) | Frames |", "| --- | --- | --- | --- |"]
    L += [f"| {s['id']} | {s['start']:.3f} | {s['end']:.3f} | {s['frame_start']}–{s['frame_end']} |" for s in m["failure_spans"]]
    L += ["", "## Sections\n", "| Section | Start (s) | End (s) | Frames | Note |", "| --- | --- | --- | --- | --- |"]
    L += [f"| {s['name']} | {s['start']:.2f} | {s['end']:.2f} | {s['frame_start']}–{s['frame_end']} | {s.get('note', '')} |" for s in m["sections"]]
    L += ["", "## Shots\n", "| ID | Cue | t (s) | Frames | Line | How |", "| --- | --- | --- | --- | --- | --- |"]
    for s in m["shots"]:
        t = "" if s["t"] is None else f"{s['t']:.2f}"
        f = "" if s["frame"] is None else f"{s['frame']}–{s.get('frame_end', '')}"
        how = s["how"] + (" (overlay layer)" if s.get("layer") else "")
        L.append(f"| {s['id']} | {s['cue']} | {t} | {f} | {s['line'] or ''} | {how} |")
    L += ["", "## Lines\n", "| ID | Start (s) | End (s) | Frames | Text |", "| --- | --- | --- | --- | --- |"]
    L += [f"| {ln['id']} | {ln['start']:.2f} | {ln['end']:.2f} | {ln['frame_start']}–{ln['frame_end']} | {ln['text']} |" for ln in m["lines"]]
    Path("timing/map.md").write_text("\n".join(L) + "\n")


def ass_t(t):
    t = max(0.0, t)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"


def write_ass(m):
    """Subtitles for the M2 review preview, on the audio clock (the preview has no pre-roll): shot labels at the top,
    karaoke lyrics at the bottom, the failure spans in red mid-frame."""
    head = ("[Script Info]\nScriptType: v4.00+\nPlayResX: 640\nPlayResY: 360\n\n[V4+ Styles]\n"
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, "
            "Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, "
            "MarginR, MarginV, Encoding\n"
            "Style: Shot,DejaVu Sans,15,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,7,12,12,10,1\n"
            "Style: Lyric,DejaVu Sans,18,&H0000C8FF,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,1,0,2,20,20,24,1\n"
            "Style: Span,DejaVu Sans,16,&H004040FF,&H004040FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,1,0,5,20,20,20,1\n\n"
            "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")
    ev = []
    for s in m["shots"]:
        if s["t"] is None:
            continue
        end = s.get("end") or s["t"] + 3
        if s.get("layer"):
            end = s["t"] + 2.5
        layer = 1 if (s.get("layer") or "insert" in s["how"]) else 0
        y = "\\pos(12,%d)" % (10 + 22 * layer)
        txt = f"{s['id']}  {s['cue']}".replace("\\", "")[:80]
        ev.append(f"Dialogue: {layer},{ass_t(s['t'])},{ass_t(end)},Shot,,0,0,0,,{{{y}}}{txt}")
    for ln in m["lines"]:
        if not ln["words"]:
            ev.append(f"Dialogue: 0,{ass_t(ln['start'])},{ass_t(ln['end'])},Lyric,,0,0,0,,{ln['text']}")
            continue
        parts, cur = [], ln["start"]
        for w in ln["words"]:
            parts.append(f"{{\\k{max(0, int(round((w['start'] - cur) * 100)))}}}")
            parts.append(f"{{\\kf{max(1, int(round((w['end'] - w['start']) * 100)))}}}{w['w']} ")
            cur = w["end"]
        ev.append(f"Dialogue: 0,{ass_t(ln['start'] - 0.3)},{ass_t(ln['end'] + 0.4)},Lyric,,0,0,0,,{''.join(parts)}")
    for s in m["failure_spans"]:
        ev.append(f"Dialogue: 0,{ass_t(s['start'])},{ass_t(s['end'])},Span,,0,0,0,,FAILURE SPAN {s['id']}")
    Path("review").mkdir(exist_ok=True)
    Path("review/m2_preview.ass").write_text(head + "\n".join(ev) + "\n")


if __name__ == "__main__":
    main()
