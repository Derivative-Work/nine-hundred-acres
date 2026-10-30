# Production log

Append-only. One entry per action: timestamp, step (shot ID where relevant), what, exact command/prompt/script, outputs, why.

## 2026-10-30T00:03:00-04:00 — Step 1: repo scaffolding, the brief and the supplied audio

- **What:** Read the brief (Claude Doc rev 36) in full. Created the brief's layout (`audio/ timing/ assets/real/ remotion/ renders/ review/ edit/ log/`) plus the house folders (`docs/ lyrics/ archive/ config/ deliverables/ scripts/`). Copied the house tooling from Share the Shares: `.gitignore`, the 50 MiB pre-commit hook, `scripts/{manifest.sh,doc_to_md.py,fetch_share.mjs,chat_snapshot_to_md.py,fetch_suno.mjs,suno_meta.py,align_words.py}`, `package.json`/`package-lock.json` (Puppeteer 24.43.1, renamed). Imported the Suno mix, the stems and both post-filter outputs from `~/Downloads` (originals left in place) and checked every copy's SHA-256 (5/5 OK). `~/Downloads/Field of Humming Things (1).{wav,mp3}` are byte-identical to the unnumbered files, so only one copy was imported. Mirrored the brief to `docs/brief.md`.
- **Commands:**
  - `mkdir -p audio/{track,stems,master} timing assets/real remotion renders review edit log/{prompts/suno,audits,postfilter} scripts/hooks docs lyrics archive config deliverables`; `git config core.hooksPath scripts/hooks`
  - `cp -p ~/Downloads/"Field of Humming Things".{wav,mp3} audio/track/`; `cp -p ~/Downloads/"Field of Humming Things Stems.zip" audio/`; `unzip -q … -d audio/stems`
  - `cp -p ~/Downloads/music-deslop-m6f-10k-2026-10-18/{no,with}-fallback/field-of-humming-things.wav audio/master/field-of-humming-things.{no,with}-fallback.wav`; `cp -p …/{fallback.json,REPORT.md} log/postfilter/`; `sha256sum -c` against the sources
  - Brief: docs `read` of project `86471679-b830-411a-8737-186dcec4751a`, node `af75491a-3355` (full view, rev 36), then `python3 -I scripts/doc_to_md.py <read result> docs/brief.md`
  - `uv sync` (new `pyproject.toml`: numpy, scipy, pillow, CPU torch/torchaudio 2.8, librosa, soundfile, faster-whisper, beat-this at the pinned commit used in Not Yet); `npm ci`
- **Script changes:** `manifest.sh` hashes this layout's large-file folders (`audio renders edit archive assets/real deliverables`). `.gitignore` drops Share the Shares' engraving and puppet paths and ignores `assets/real/`, `edit/`, `deliverables/` and Remotion's build output. New `scripts/song.py` names this song's files.
- **Findings:**
  - **The mix:** PCM s16le, 48 kHz stereo, 238.40 s (3:58.4).
  - **The master (no-fallback):** PCM s24le, 48 kHz stereo, 238.40 s, the same length as the mix. `REPORT.md` says it was not rescaled (only three other songs were).
  - **Stems:** nine WAVs, no MIDI: Lead Vocals, Backing Vocals, Drums, Bass, Guitar, Keyboard, Percussion, Synth, Other.
  - **Failure spans** (the post-filter's detector, `fallback.json`): 72.39–82.64 s and 191.17–228.91 s. Logged in `log/postfilter.md`. M1 places them against the lyrics.
- **Why:** the brief (Inputs, Pipeline, Layout, Production rules).
- **Environment:** Claude Code (Opus 5.5); ffmpeg at `/usr/bin/ffmpeg`; uv; Node v24.22.0; GTX 970 4 GB (draft box). Disk: 107 GB free.

## 2026-10-30T00:03:30-04:00 — Step 2: planning chat archived; the Suno take logged

- **What:** Fetched the planning chat's share page and the Suno page with the house Puppeteer scripts. Extracted the take's metadata and submitted lyrics, diffed them against the brief, and wrote `log/prompts/suno/takes.md`. Logged the post-filter runs in `log/postfilter.md` and the human's actions in `log/human_interventions.md`.
- **Commands:**
  - `node scripts/fetch_share.mjs https://claude.ai/share/a5f6169c-f61a-4fe1-8082-0fa59375473a docs/planning_chat/planning_chat`; `python3 -I scripts/chat_snapshot_to_md.py docs/planning_chat/planning_chat.json <url> > docs/planning_chat/planning_chat.md`
  - `node scripts/fetch_suno.mjs https://suno.com/s/Wq0bulQq4X9a9RsO log/prompts/suno/fetch_accepted`; `python3 -I scripts/suno_meta.py log/prompts/suno/fetch_accepted`
  - The brief's lyrics block saved to `lyrics/brief.txt`; an inline `difflib` diff against `fetch_accepted/lyrics.txt` (curly quotes normalized)
- **Script change:** `suno_meta.py`'s lyric bounds are now `[Intro` … `A server fan spins down.]` (they were Share the Shares' first and last lines).
- **Outputs:** `docs/planning_chat/planning_chat.{json,html,txt,md}`; `log/prompts/suno/fetch_accepted/{clip.json,lyrics.txt,page.*,resp_*.json}`; `log/prompts/suno/takes.md`; `lyrics/brief.txt`
- **Findings:**
  - Planning chat snapshot (2026-10-30T03:50Z): messages 1–44, 2026-10-12 to 2026-10-30; messages 3–4, 9–12 and 23–24 aren't in the share (probably edited branches). There were no lyric audits by other models in this chat, so `log/audits/` stays empty.
  - The chat (message 19) places the coda failure *after* "By the thing of which I wrote", and message 21 places the first one in "the lead-up to 'down in South Memphis'". The detector's span 2 (191.2–228.9 s, 37.7 s) is long for "after the last line" of a 238.4 s song; M1 checks it against the as-sung timing.
  - Suno V6 (`chirp-hawk`), created 2026-10-14T03:12:29Z. The submitted lyrics are the brief's word for word; only section tags differ, including the `[Jam]` and `[Final chorus]` tags Suno skipped. No lyric exception.
- **Why:** House practice (Share the Shares step 2): the planning chat and the take are part of the making-of record.
