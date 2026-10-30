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

## 2026-10-30T00:11:30-04:00 — M1: transcription, lyric diff and the failure spans placed

- **What:** Transcribed both vocal stems (faster-whisper medium.en, int8, CPU, unprompted, word timestamps), then re-heard every line that differed from the brief with medium.en and small.en on three sources each (lead stem, backing stem, Suno mix). Measured per-stem loudness in 2 s windows to place the intro, the gaps and the outro. Wrote the as-sung draft.
- **Commands:** `.venv/bin/python -I scripts/first_pass.py` (from Share the Shares, stem names changed); `.venv/bin/python -I scripts/m1_recheck.py` (new); an inline per-stem RMS table (soundfile + numpy).
- **Outputs:** `timing/first_pass_{vocals,backing}.json`, `timing/m1_recheck.json`, `lyrics/as_sung_draft.txt`
- **Findings (structure):**
  - **Suno skipped chorus 2 as well.** Verse 2 ends at 107.6 s and verse 3 starts at 109.4 s. Shots S28–S31 (and the S27 → S28 transition) have no audio to sit on. The brief already noted the skipped jam and final chorus, not this.
  - **The coda is not a cappella, and there is no silence before it.** Drums play at about −20 dBFS from the end of the bridge (169 s) through the coda (175.0–190.7 s). The S44 → S45 "needle lifts … in the quiet" has no quiet to land in.
  - **A 37 s wordless outro follows the last line** (190.7–~228 s, ooh/ah harmonies over the full band), then drums drop out and a final chord holds to ~236 s; silence to 238.4 s.
- **Findings (failure spans, from `fallback.json`):**
  - **Span 1, 72.39–82.64 s:** starts on "humming" in the chorus's last line ("things" held to 73.94 s), covers the 6 s instrumental, and ends just after "Memphis" (81.68–82.36 s). So it runs into the first line of verse 2: S22's cue starts inside the span, and S19–S21's "Retrying… ✓" lands mid-line.
  - **Span 2, 191.17–228.91 s:** starts 0.47 s after "wrote" ends (190.70 s), matching the human's "fails after 'thing of which I wrote'". It covers the whole wordless outro; the final chord (~229–236 s) is outside it. S49's stutter would run 37.7 s.
- **Findings (words, for the human's ear):** every other line matches the brief. Doubtful, where hearings split or all disagree with the brief:
  - "they **rolled** the turbines in": 6/6 hear "roll" (the d may be elided).
  - "nobody asked the **wind**": 6/6 hear "to win" or "the when".
  - "Three Mile Island **in** a brand-new name": 4/8 "in", 4/8 "and".
  - "cost folks **out east**": small.en 2/2 "out east"; medium.en 2/2 "at least".
  - "**It** said that was a really great question": 4/5 "They said", 1 "I said".
  - "It was **hummed out** in a field": 1 "hummed out", 3 "hung down", 3 "hung out".
  - "of 'em a-burning" is heard as "of them are burning" everywhere, which is how the written line sounds; "waking" as "awake in" on the lead, "Waking" on the backing stem. Taken as sung as written.
- **Not done:** a detect-only post-filter run (the brief's wording); `fallback.json`'s regions are the same detector's output, so they are used. M1 gate questions are in the summary to the human.
- **Why:** the brief, M1.

## 2026-10-30T00:21:00-04:00 — M1 gate passed; brief updated (rev 36 → 52)

- **What:** The human approved M1 (human_interventions, same time): the lyrics are the brief's word for word (the transcriber dropped final consonants), and `fallback.json` stands as the detection output. Edited the brief to match the master and the human's decisions, then re-mirrored it.
- **Brief changes** (docs `update` on node `af75491a-3355`, project `86471679-b830-411a-8737-186dcec4751a`; text replaces and two row inserts, nothing deleted):
  - Lyrics: the note now says Suno also skipped chorus 2 and the coda is not a cappella, with a 37 s wordless outro; the second `[Chorus]` tag is removed from the lyrics block; `[Coda – a cappella]` → `[Coda]`.
  - Chorus 2: S28–S31 marked **Retired** (IDs kept for the record). New **S33a** ("sang the reactors down": the peace-sign banner over the archival crowd morphs into a power button that becomes S33's Reactor toggle) and **S36a** ("it's built to feed the machines": a thermal sweep turns the S09 grid's status dots into a tie-dye heat map, three flower tiles). Infection table: Chorus 2 row retired; both gags added to the Verse 3 row.
  - Transitions: "S27 → S28" → "S27 → S32" (haze dims, then the sepia bleed; verse 3 starts 1.8 s after verse 2); "S31 → S32" → "S27 → S32 (cont.)". S44 → S45: the needle lift is a visual beat, since the band plays on.
  - S45: "In the quiet after the needle lifts" → "As the needle lifts (a visual beat only: the band plays on under the coda)". S49's cue names the 37.7 s wordless outro.
- **Commands:** `python3 -I scripts/doc_to_md.py <read result, rev 52> docs/brief.md`; `sed` on `lyrics/as_sung_draft.txt` to drop the `[?]` marks.
- **Not changed:** S19–S22 still assume span 1 ends before "Down in South Memphis"; it ends just after "Memphis" (82.64 s). The timing map (M2) cues S22 at its line regardless and puts S21's recovery at the span's end.
- **Why:** the human's M1 decisions.

## 2026-10-30T00:40:00-04:00 — M2: alignment, beat grid, timing map and the ear-check preview

- **What:** Force-aligned the approved lyrics word by word, tracked beats and downbeats, located the intro, outro and final-chord events from the stems, and joined them with the failure spans and the brief's shot list (rev 52) into `timing/map.json` (the brief's name) and `timing/map.md`. Rendered a preview for the ear check.
- **Commands:**
  - `.venv/bin/python -I scripts/align_words.py` (from Share the Shares: new section windows from M1, contractions table, reads `lyrics/as_sung.txt`; the coda on the Backing Vocals stem, the rest on Lead Vocals)
  - `.venv/bin/python -I scripts/beats_beat_this.py` (from Share the Shares; drum stem renamed)
  - `.venv/bin/python -I scripts/timing_map.py` (new)
  - `scripts/m2_preview.sh` (new; ffmpeg + libass)
- **Outputs:** `lyrics/as_sung.txt`, `timing/{words,beat_this,map}.json`, `timing/map.md`, `review/m2_preview.ass`, `renders/m2/m2_preview.mp4`
- **Decisions in the map (for the gate):**
  - **30 fps with a 2 s pre-roll** for S01 (black, blinking cursor, before the first strum). Frame = round((t + 2) × 30); 7,212 frames in all before S51, the fact cards and the end card.
  - **Overlay shots:** S19–S21 (the restore overlay) are a top-right layer over S18 → S22 and do not end the base shot. That resolves span 1 running into "Down in South Memphis": S22 starts on its line at 80.42 s, and the overlay's green check (S21) lands at the span's end, 82.64 s, on "Memphis".
  - **Inserts** S33a and S36a play with S33 and S36, from the same word.
  - **Events:** S02 at the guitar stem's first onset (0.14 s); S03 at the intro harmonies (7.31 s, vocal stems above −40 dB; they end 13.14 s); S04 on the downbeat two bars before verse 1 (9.28 s); S20 at span 1's midpoint; S49 at span 2's start (191.18 s); S50 at span 2's end (228.91 s), with the drums out at 227.14 s and the chord ringing to the audio's end (237.84 s at −50 dB).
- **Findings:**
  - **Tempo:** 4/4 at a median 130.4 bpm (beats 0.44–0.48 s apart: played, not quantized), 125 bars. The mix and the drum stem agree on every beat but one up to the final chord; beat_this's last bars (230–235 s) are out of time, so the grid stops at the last drum hit.
  - **Alignment:** every line placed in order and within 1 s of the M1 first pass. Low-confidence words (score < 0.3) are mostly held vowels and small words; none moves a shot cue.
  - All 50 live shot IDs resolve; none "NOT FOUND". S28–S31 are retired; S51, F1–F7 and S52 play after the audio.
- **Why:** the brief, M2 ("Build the timing map; attach frame ranges to every shot ID"). Gate: "Check the map by ear".
