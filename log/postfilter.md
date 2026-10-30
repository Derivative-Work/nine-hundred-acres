# Post-filter runs

Every run of the deslop post-filter on this song: checkpoint, flags, detected artifact spans. The agent does not run it (the human runs it on the RTX 5090 box; brief Inputs).

## 2026-10-18 — M6f 10k, release chain, with and without the fallback (run by the human)

- **Source:** `~/Downloads/music-deslop-m6f-10k-2026-10-18/` (copied verbatim: `log/postfilter/REPORT.md`, `log/postfilter/fallback.json`).
- **Chain:** `postfilter.infer` defaults: M6f 10k, temperature 0, 18 kHz input lowpass, de-pump with 1.5 dB cut cap, gain smoothing. Output 24-bit 48 kHz WAV.
- **Runs:** `with-fallback/` (the default: where per-bin gain jitter in 2 s windows rises from 0.25 to 0.4 dB the change fades out over 0.5 s and the input passes through) and `no-fallback/` (`--no-fallback`, the model's output everywhere). This video uses **no-fallback** (`audio/master/field-of-humming-things.no-fallback.wav`, SHA-256 `ab376be7…62d6857c7f1405f125dd99942bd870f3b`).
- **Detected artifact spans** (the fallback's detector, `fallback.json`; at temperature 0 the raw model output is the same in both runs, so these are the spans where the no-fallback output is distorted). Both faded to "input only" (depth 0.0):

| span | start (s) | end (s) | length (s) |
|---|---|---|---|
| 1 | 72.390 | 82.644 | 10.254 |
| 2 | 191.175 | 228.912 | 37.737 |

- **Not yet available:** a detect-only run log (the brief's wording) and the terminal capture of a run for S51. The `fallback.json` regions above are the detector's own output.
