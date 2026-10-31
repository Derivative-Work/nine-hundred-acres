# Licence for the video and its assets

Copyright 2026 Albert Armea.

"Nine Hundred Acres (The Hum)" (the video) and its assets are licensed under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence](https://creativecommons.org/licenses/by-nc-sa/4.0/)
(CC BY-NC-SA 4.0). The full legal code is in [LICENSES/CC-BY-NC-SA-4.0.txt](LICENSES/CC-BY-NC-SA-4.0.txt).

The code is under the MIT licence instead: see [LICENSE](LICENSE).

## What this covers

- The video in every cut: the main video, the vertical cut, the animatics, the drafts and every intermediate render.
- The music: the Suno V6 track "Field of Humming Things", its stems, and the post-filtered master.
- The lyrics, captions (`deliverables/*.srt`) and thumbnails.
- The post-roll audio (`scripts/postroll_audio.py`'s output: the fan and the hum, synthesised in code).
- The SVG illustrations drawn in code (`remotion/src`), as pictures: the people, the farmhouse, the crowds, the
  plants, the turbines and every other drawing. The code that draws them is MIT; the frames it renders are
  CC BY-NC-SA.
- Stills and contact sheets under `review/` and `archive/`.
- The production record, written by the agent: the brief, logs, prompts, audit review, timing map, the upload
  metadata, and the other documents under `docs/`, `log/`, `timing/` and `lyrics/`.

## What this doesn't cover

- **Code** (`remotion/src/`, `scripts/`, `remotion.config.ts` and the build files): MIT, see [LICENSE](LICENSE).
- **Emoji** (`remotion/public/emoji/*.svg`): [Twemoji](https://github.com/jdecked/twemoji) graphics, Copyright
  Twitter, Inc. and other contributors, licensed under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). They appear unchanged in the explainer graphics.
  Credit: "Emoji graphics by Twemoji (Twitter, Inc. and other contributors), CC BY 4.0", as on the end card.
- **Icons** (`remotion/public/icons/*.svg`): [Lucide](https://lucide.dev), under the ISC licence (some icons derive
  from Feather, MIT). The notices are in [LICENSES/Lucide-ISC.txt](LICENSES/Lucide-ISC.txt).
- **Map outlines** (`assets/naturalearth/`): [Natural Earth](https://www.naturalearthdata.com/) 5.1.2, in the
  public domain.
- **Fonts:** Inter, JetBrains Mono, Shrikhand and Caveat, each under the SIL Open Font License 1.1 by their authors.
  They are installed from npm (Fontsource) and are not in this repository.
- **The Suno screen recording** (`assets/real/`, shown in the coda): the human's own recording of their Suno
  workspace playing this song. The interface on it is Suno's. The file is kept locally, hashed in
  `MANIFEST.sha256`, and not in this repository.
- **The model audits' raw output** (`log/audits/01_chatgpt_raw.md`, `02_gemini_raw.md`): ChatGPT's and Gemini's
  replies, kept verbatim for the record. The review of them (`03_review.md`) is covered.
- **The planning chat** (`docs/planning_chat/`): a snapshot of the human's public share of a Claude conversation,
  archived verbatim.
- **Suno's page data** (`log/prompts/suno/fetch_accepted/`): the public share page and its responses, saved as the
  record of the take.
- **Fact-check sources** (`reference/sources/`): other publishers' reports, court filings and video, saved for the
  fact check and never published. The brief's Reference facts table and `log/audits/03_review.md` give their URLs.

## Attribution

Credit "Nine Hundred Acres (The Hum)" by Albert Armea, made with Claude Code (Opus 5.5) and Suno V6, licensed
CC BY-NC-SA 4.0, with a link to https://github.com/Derivative-Work/nine-hundred-acres.
