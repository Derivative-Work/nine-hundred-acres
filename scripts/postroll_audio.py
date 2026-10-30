"""M4: the post-roll's sound (S51, the fact cards, the end card), generated in code.

The brief: "The fan sound bridges the cut" (S50 -> S51), and the fact cards play over "room tone with the hum faintly
underneath". The master has no fan, so this makes one: band-passed noise with a blade-rate whir that runs at full speed
through S51 and spins down in the 2.5 s before the cut to the fact cards (CUT), under pink room tone (-52 dBFS RMS) and a
60 Hz hum with its harmonics (-44 dBFS, rising to -32 dBFS as the fact cards start), fading out over the last 4 s. The
file starts <lead> seconds before the song ends: the fan (and the room tone) fade in under the final chord. 48 kHz
stereo, 24-bit.
Usage: .venv/bin/python -I scripts/postroll_audio.py <seconds after the song> [<lead seconds>]
  -> audio/postroll/postroll.wav (and a copy in remotion/public/audio/)
"""
import shutil
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
# The cut from S51 (the terminal) to the first fact card, after the song ends: S51_LEN + FADE in Post.tsx, 285 frames.
CUT = 285 / 30


def db(x):
    return 10 ** (x / 20)


def main(seconds, lead=0.0):
    total = seconds + lead
    n = int(total * SR)
    t = np.arange(n) / SR - lead  # 0 where the song ends
    rng = np.random.default_rng(900)
    white = rng.standard_normal((n, 2))
    pink = np.cumsum(white, axis=0)
    pink = sosfilt(butter(2, 20, "hp", fs=SR, output="sos"), pink, axis=0)
    pink *= db(-52) / pink.std()
    spin = np.clip((CUT - np.maximum(t, 0)) / 2.5, 0, 1) ** 1.5  # fan speed: full through S51, 1 -> 0 over the 2.5 s before the cut
    whir_f = 40 + 140 * spin  # blade rate, Hz
    whir = np.sin(2 * np.pi * np.cumsum(whir_f) / SR)
    air = sosfilt(butter(2, [300, 3000], "bp", fs=SR, output="sos"), white, axis=0)
    fan = (air / air.std()) * (0.6 + 0.4 * whir[:, None]) * spin[:, None] * db(-30)
    hum = sum(a * np.sin(2 * np.pi * f * t + p) for f, a, p in ((60, 1.0, 0), (120, 0.5, 1), (180, 0.3, 2), (240, 0.15, 3)))
    hum = (hum / np.sqrt(np.mean(hum ** 2)) * db(-44))[:, None] * np.ones((1, 2))
    hum *= np.clip(t / 3.0, 0, 1)[:, None]  # the hum comes up under the fan
    hum *= db(12 * np.clip((t - CUT + 0.5) / 1.5, 0, 1))[:, None]  # and rises 12 dB (to -32 dBFS) as the fact cards start
    hum *= (t >= 0)[:, None]
    fade_in = np.clip((t + lead) / max(lead - 1.0, 1e-9), 0, 1) if lead else np.ones(n)
    fade_in = fade_in * fade_in * (3 - 2 * fade_in)  # smoothstep: barely there at first, full a second before the end
    y = (pink + fan) * fade_in[:, None] + hum
    y *= np.clip((seconds - t) / 4.0, 0, 1)[:, None]
    out = Path("audio/postroll/postroll.wav")
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, y.astype(np.float32), SR, subtype="PCM_24")
    shutil.copy(out, "remotion/public/audio/postroll.wav")
    print(out, f"{total:.2f} s ({lead:.1f} s lead), peak {20 * np.log10(np.abs(y).max()):.1f} dBFS")


if __name__ == "__main__":
    main(float(sys.argv[1]), float(sys.argv[2]) if len(sys.argv) > 2 else 0.0)
