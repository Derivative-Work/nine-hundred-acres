"""Thumbnail options with text (human, 2026-10-31: "give me more thumbnail options, with text on them (as seems to be
the winning strategy for the other videos in the project)"). Modelled on Not Yet's scripts/thumbnail.py: a treated
frame of the video with a heavy headline and a hand-lettered line set over it, each with a blurred drop shadow.

Plates are 4K stills of the main video (`remotion still … Animatic --frame=N --props='{"label":false}' --scale=2`)
in renders/thumbs/f_<frame>.png. Never the Suno screen (brief), and no text that says the song is generated: the
song's origin is the coda's reveal. The headline face is Inter Black; the line under it is Caveat, the protest signs'
hand, except option E, whose headline is Shrikhand, the video's groovy display face. Fonts load from the Remotion
project's Fontsource packages.

Usage: .venv/bin/python -I scripts/thumbnail_options.py  ->  review/thumbnails/option_<id>.jpg (1920x1080)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FS = ROOT / "remotion/node_modules/@fontsource"
INTER = FS / "inter/files/inter-latin-900-normal.woff"
CAVEAT = FS / "caveat/files/caveat-latin-700-normal.woff"
SHRIKHAND = FS / "shrikhand/files/shrikhand-latin-400-normal.woff"
WHITE, CREAM, ORANGE = (255, 250, 240), (255, 238, 210), (255, 150, 70)
OUT = ROOT / "review/thumbnails"

# id: frame, crop (x0, y0, width at 3840x2160; height = width * 9/16), shade (side, strength), lines.
# Each line: font, size, text, (x, y) on the 1920x1080 output (x None = centred), colour.
OPTIONS = {
    "A": (4280, (770, 520, 2300), ("top", 0.55), [  # S38: the 1979 crowd, signs now reading "…OK, FINE."
        (INTER, 150, "1979: NO NUKES.", (70, 40), WHITE),
        (CAVEAT, 130, "2026:", (80, 205), ORANGE),
    ]),
    "B": (1200, (700, 380, 2496), ("left", 0.75), [  # S10: the family farm photo, archived
        (INTER, 132, "FAMILY FARM:", (64, 330), WHITE),
        (INTER, 132, "ARCHIVED", (64, 470), ORANGE),
        (CAVEAT, 84, "nine hundred acres of Iowa corn", (72, 630), CREAM),
    ]),
    "C": (2900, (190, 150, 3456), ("bottom", 0.8), [  # S25: 35 turbines in the smog; the wind's hand raised
        (INTER, 128, "NOBODY ASKED THE WIND", (None, 745), WHITE),
        (CAVEAT, 92, "35 gas turbines, no air permits (2025)", (None, 900), ORANGE),
    ]),
    "D": (4640, (384, 216, 3072), ("left", 0.95), [  # S40: the $29B (est.) bar, axis rescaled to fit
        (INTER, 150, "MY BILL:", (60, 300), WHITE),
        (INTER, 150, "UP AGAIN.", (60, 455), ORANGE),
        (CAVEAT, 92, "got my electric bill today, man", (66, 640), CREAM),
    ]),
    "E": (1600, (480, 240, 2880), ("both", 0.5), [  # S13: corn and crickets, "replacing crickets"
        (SHRIKHAND, 120, "Can you hear it humming?", (None, 60), ORANGE),
        (CAVEAT, 96, "a 1970-style protest song about AI data centers", (None, 900), CREAM),
    ]),
}


def plate(frame, crop, shade):
    a = np.asarray(Image.open(ROOT / f"renders/thumbs/f_{frame}.png").convert("RGB"), np.float32) / 255
    x0, y0, w = crop
    a = a[y0:y0 + w * 9 // 16, x0:x0 + w]
    h, w = a.shape[:2]
    side, k = shade
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ramp = {
        "top": np.clip(1 - yy / (0.42 * h), 0, 1),
        "bottom": np.clip((yy - 0.55 * h) / (0.3 * h), 0, 1),
        "left": np.clip(1 - xx / (0.55 * w), 0, 1),
        "both": np.maximum(np.clip(1 - yy / (0.25 * h), 0, 1), np.clip((yy - 0.72 * h) / (0.2 * h), 0, 1)),
    }[side]
    a = a * (1 - k * ramp)[..., None]
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).resize((1920, 1080), Image.LANCZOS)


def shadowed(img, xy, txt, f, fill):
    x, y = xy
    if x is None:
        x = (img.width - ImageDraw.Draw(img).textlength(txt, font=f)) / 2
    sh = Image.new("L", img.size, 0)
    ImageDraw.Draw(sh).text((x, y + 6), txt, font=f, fill=235)
    img.paste((0, 0, 0), mask=sh.filter(ImageFilter.GaussianBlur(16)))
    ImageDraw.Draw(img).text((x, y), txt, font=f, fill=fill)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for oid, (frame, crop, shade, lines) in OPTIONS.items():
        img = plate(frame, crop, shade)
        for path, size, txt, xy, fill in lines:
            shadowed(img, xy, txt, ImageFont.truetype(str(path), size), fill)
        out = OUT / f"option_{oid}.jpg"
        img.save(out, quality=92)
        print(out.relative_to(ROOT), f"(frame {frame})")


if __name__ == "__main__":
    main()
