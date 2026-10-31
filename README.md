# Nine Hundred Acres (The Hum)

An AI-made music video: a sincere 1970-style folk-rock protest song about AI data centers, illustrated as the
slickest possible AI-made explainer animation. Dark-mode cards, emoji bullets, counters and self-drawing arrows
explain a farm town's annexation, gas turbines without permits and a nuclear plant restarting to feed the
machines. Verse by verse the hippie aesthetic infects the explainer: the gradients drift to tie-dye, and the emoji
drift from servers to flowers. In the coda the song admits that no throat sang it, and the video cuts to the real
Suno screen where it was made.

Claude Code (Opus 5.5) wrote every frame as code and rendered it in [Remotion](https://www.remotion.dev). Suno V6
made the music, and Claude wrote the words. The music-deslop post-filter distorts the audio in two places. Both are
left in on purpose: the first is the smog arriving over South Memphis, and the second is the coda's admission. A
human only picked takes, approved gates and supplied the real Suno screen recording, and every such action is
logged.

AI-generated satire about real events. The fact cards after the song say what actually happened, with their sources.
Two other labs' models audited every on-screen claim, and Claude checked each flag against its source:
[log/audits/](log/audits/README.md).

## Watch

- **YouTube:** https://www.youtube.com/watch?v=7OT7Fb6LcP8
- **Files:** the videos, captions, thumbnail and music are in the
  [v1.0 release](https://github.com/Derivative-Work/nine-hundred-acres/releases/tag/v1.0).

## The making-of record

- [The planning chat](https://claude.ai/share/a5f6169c-f61a-4fe1-8082-0fa59375473a) that led to the song and the
  brief, archived in [docs/planning_chat/](docs/planning_chat/planning_chat.md).
- [docs/brief.md](docs/brief.md): the production brief, guardrails and shot list, mirrored from the live brief.
- [log/audits/](log/audits/README.md): the fact check (M8). ChatGPT's and Gemini's audits verbatim, and
  [Claude's review](log/audits/03_review.md) of each flag against its source.
- [log/production_log.md](log/production_log.md): every action the agent took, with commands and outputs.
- [log/human_interventions.md](log/human_interventions.md): every human action, with the rule that allowed it.
- [log/renders.md](log/renders.md) and [log/postfilter.md](log/postfilter.md): every render (with its commit) and
  every post-filter run.
- [log/prompts/](log/prompts/): the Suno take and its prompt, and the audit prompt sent to the other models.
- [timing/map.md](timing/map.md): where every shot lands in the song, and the two failure spans.
- [assets/LICENSES.md](assets/LICENSES.md): every third-party file in the edit.
- [METADATA.md](METADATA.md): the YouTube titles, descriptions and settings.

## Files

Large files stay out of git. [MANIFEST.sha256](MANIFEST.sha256) lists them with SHA-256 hashes: the Suno track and
stems, both post-filtered masters, the post-roll audio, the human's Suno screen recording, the finished videos and
every render, so a rebuild can be checked against them. The fact-check sources (other publishers' reports, court
filings and the NBC News broadcast) are kept locally and never published. The brief's Reference facts table and
[log/audits/03_review.md](log/audits/03_review.md) give their URLs.

## Rebuilding

Versions used: Remotion 4.0.535, React 19, Node v24.22.0, ffmpeg 8.0.1, uv with Python 3.12 (CPU PyTorch).
The video was built and rendered on one Linux box with a GTX 970; the post-filter ran on an RTX 5090.

```bash
uv sync                                   # .venv from pyproject.toml / uv.lock
npm ci                                    # Puppeteer, for the page fetches
(cd remotion && npm ci)                   # Remotion, fonts, Twemoji and Lucide
git config core.hooksPath scripts/hooks   # the 50 MiB pre-commit check
```

Put the large files back at the paths `MANIFEST.sha256` lists: the master
`audio/master/field-of-humming-things.no-fallback.wav`, its copy at `remotion/public/audio/master.wav`, and the Suno
recording's proxy `remotion/public/real/suno_capture.mp4` (or remake the proxy from `assets/real/` with the ffmpeg
command in the production log, 2026-10-30T09:10). Then, in order (each step's production-log entry has its exact
inputs, outputs and checks; Python runs as `.venv/bin/python -I scripts/<name>.py`):

1. **Timing:** `scripts/timing_map.py`, from the stems and the transcriptions under `timing/` →
   `timing/map.json`, which `remotion/src/timing.ts` reads as the video clock.
2. **Assets:** `node scripts/sync_assets.mjs` (emoji and icons into `remotion/public/`) and
   `scripts/build_maps.py` (the map outlines).
3. **Post-roll audio:** `scripts/postroll_audio.py 96 4.9` → `remotion/public/audio/postroll.wav` (the fan and
   the hum after the song).
4. **Video:** from `remotion/`,
   `./node_modules/.bin/remotion render src/index.ts Animatic out.mp4 --props='{"label":false}' --crf=16`
   (add `--scale=2` for 4K), and the composition `Vertical` for the vertical cut. `npm run studio` opens
   the editor.
5. **Captions:** `scripts/make_srt.py` writes the SRTs from the same rule as the burned-in captions.
6. **Thumbnail:** render 4K stills of the frames listed in `scripts/thumbnail_options.py` into `renders/thumbs/`,
   then run it; option A is `deliverables/thumbnail.jpg`.

## Licences

- **Video and assets:** [CC BY-NC-SA 4.0](LICENSE-media.md). That file lists exactly what it covers, and what it
  doesn't (emoji, icons, fonts, the Suno screen, the other models' audits, the fact-check sources).
- **Code:** [MIT](LICENSE). Remotion itself is not MIT: it is under the
  [Remotion License](https://www.remotion.dev/license), free for individuals and for companies of up to three
  people.

## Credits

- **Words:** Claude, in the planning chat.
- **Music:** Suno V6 (take `4dc300e8`, "Field of Humming Things"), the only generation, chosen by a human.
- **Audio restoration:** music-deslop, a post-filter model for AI-generated music that Claude Code built and trained
  from a human-written spec, on Creative Commons audio only (checkpoint M6f 10k). The model is private for now. The
  human ran it twice: once by default, where its fallback found the two noisy passages and passed them through
  unprocessed, and once with `--no-fallback`, the master the video plays. Settings and detected spans are in
  [log/postfilter.md](log/postfilter.md).
- **Animation, edit, captions, cards, post-roll audio and thumbnail:** Claude Code with Claude Opus 5.5.
- **Fact check:** ChatGPT (OpenAI) and Gemini (Google), then Claude against each source.
- **The Suno screen:** the human's own recording of their Suno workspace playing this song.
- **Emoji:** [Twemoji](https://github.com/jdecked/twemoji) (Twitter, Inc. and other contributors), CC BY 4.0.
- **Icons:** [Lucide](https://lucide.dev) (ISC). **Map outlines:** [Natural Earth](https://www.naturalearthdata.com/)
  (public domain).
- **Tools:** Remotion and React, ffmpeg, Node.js with Puppeteer, and Python with NumPy, SciPy, Pillow, librosa,
  soundfile, PyTorch, Beat This! (beats) and faster-whisper (lyric alignment).
- **Fonts:** [Inter](https://github.com/rsms/inter), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono),
  [Shrikhand](https://github.com/jonpinhorn/shrikhand) (the infected headings) and
  [Caveat](https://github.com/googlefonts/caveat) (the protest signs), SIL Open Font License 1.1.

### Mastering model training data

The music-deslop model was trained only on audio from these datasets, each licensed under
[Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). The audio was cut into
segments, made stereo, mixed, processed (reverb, EQ, compression, mastering, codecs and other degradations) and used
to synthesise training pairs. No dataset audio is in this repository or in the video.

- **Slakh2100** (redux mixes). Ethan Manilow, Gordon Wichern, Prem Seetharaman and Jonathan Le Roux, "Cutting Music
  Source Separation Some Slakh: A Dataset to Study the Impact of Training Data Quality and Quantity", IEEE WASPAA
  2019. https://zenodo.org/records/4599666
- **VocalSet 1.2.** Julia Wilkins, Prem Seetharaman, Alison Wahl and Bryan Pardo, "VocalSet: A Singing Voice
  Dataset", ISMIR 2018. https://zenodo.org/records/1442513
- **CSTR VCTK Corpus 0.92.** Junichi Yamagishi, Christophe Veaux and Kirsten MacDonald, "CSTR VCTK Corpus: English
  Multi-speaker Corpus for CSTR Voice Cloning Toolkit (version 0.92)", University of Edinburgh, The Centre for Speech
  Technology Research, 2019. https://doi.org/10.7488/ds/2645

The degraded training inputs were also made with the
[ACE-Step 1.5 VAE](https://huggingface.co/ACE-Step/Ace-Step1.5) (MIT), the
[Descript Audio Codec](https://github.com/descriptinc/descript-audio-codec) (MIT) and FFmpeg (LAME, the native AAC
encoder and libopus). No generator output (Suno, ElevenMusic or ACE-Step songs) was used for training.

Satire. Not affiliated with or endorsed by any company named here.
