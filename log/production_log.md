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
  - **Alignment:** every line placed in order; line starts sit 0.0–1.0 s after the M1 first pass's (whisper's word starts run early), L21 1.04 s. Low-confidence words (score < 0.3) are mostly held vowels and small words; none moves a shot cue.
  - All 50 live shot IDs resolve; none "NOT FOUND". S28–S31 are retired; S51, F1–F7 and S52 play after the audio.
- **Why:** the brief, M2 ("Build the timing map; attach frame ranges to every shot ID"). Gate: "Check the map by ear".

## 2026-10-30T00:50:00-04:00 — M2 gate passed; M3: theme module and style board

- **Gate:** the human approved the timing map ("map sounds right, go ahead with M3"; human_interventions, same time).
- **What:** Built the Remotion project (`remotion/`) with the theme module the brief asks for, the explainer's furniture as components, and a style-board still rendered at each section's target infection.
- **Packages** (exact pins, each at least two weeks old): remotion, @remotion/cli, @remotion/renderer, @remotion/bundler 4.0.535; react, react-dom 19.1.10; @twemoji/svg 15.0.0; lucide-static 1.57.0; @fontsource/{inter,jetbrains-mono,shrikhand} 5.3.0; typescript 5.9.3. `npm install --save-exact` in `remotion/`.
- **Assets:** chose **Twemoji** over Noto Emoji (brief: pick one set). Twemoji's flat look is the stock explainer look, and it keeps Google's system emoji (Noto Color Emoji is installed on this box) out entirely. Emoji render only as SVG images, never as characters, so no system font can stand in. `node scripts/sync_assets.mjs` copies the 18 emoji and 25 Lucide icons used into `remotion/public/`. Groovy display face: **Shrikhand** (OFL). Everything is recorded in `assets/LICENSES.md`; Twemoji's CC BY 4.0 credit is required on the end card.
- **The theme module** (`remotion/src/theme/`): `theme(infection)` returns every token from one value. Colors drift navy → aubergine, orange/pink → mustard/magenta, white → cream. Tie-dye arrives around 0.4 (borders, gradient text, heat maps), marbling and the groovy headings around 0.5 (letters go over to Shrikhand one by one), the lava lamp near 0.7. Corner radius goes from 16 to 30, springs from critically damped to bouncy, cards from still to drifting and leaning, flower tiles from 1 at 0.15 to 3 at 0.4 to 9 at 0.7. `SECTION_TARGETS` holds the brief's targets; `<Infected value>` sets a shot's value; `useEnter` is the house fade-and-rise. The haze is its own layer (`Haze`), not part of the infection.
- **Components:** Background (radial glow, lava lamp, marble filter), Card, GradientFill, Haze, Heading, Body, Emoji, Icon, Pill, Callout, Toast, Checklist (crooked boxes past 0.4), RestoreOverlay (running/stalled/error/retrying/ok/off), KaraokeCaption, HumWave (warbles with infection), Cord, TileGrid (corn → rack tiles, the surviving cornstalk, flowers, heat map).
- **Not in the board:** the coda's bare terminal on black (infection back to 0) is a shot layout, built in M4.
- **Outputs:** `remotion/` (src, public, package.json, package-lock.json), `scripts/{sync_assets.mjs,m3_board.sh}`, `assets/LICENSES.md`, review images (log/renders.md).
- **Note for release:** Remotion's license is free for individuals and companies of up to 3 people; a larger company needs a company license.
- **Why:** the brief, M3. Gate: "Approve the look at 0, 0.4 and 0.7".

## 2026-10-30T01:05:00-04:00 — M3: context reel (the look in motion, in real shots)

- **What:** The human: "the infection looks great, but it's a little hard to tell how these will work in context without more scenes". Built seven real shot compositions, one or two per section at their own infection values, driven by the timing map, and cut them into a context reel with the master's audio at their mapped times. These are the first M4 compositions (rough; they will be refined there, not thrown away).
- **Clips** (audio seconds): S07–S09 Verse 1, infection 0 (22.0–31.79); S16 Chorus 1, 0.15 (57.0–64.95); S17–S22 failure span 1, 0.15 → 0.3 with the haze wipe, jitter, overlay, toast, retry and check (66.5–83.4); S23–S25 Verse 2, 0.3 + haze 0.25 (83.4–95.21); S36–S37 Verse 3, 0.5 (126.5–133.77); S42–S44 Bridge, 0.6 → 0.75 and the needle lift (156.5–176.5); S48–S49 Coda, failure span 2's stutter (185.3–199.0).
- **Code:** `remotion/src/timing.ts` (the map as the video clock), `remotion/src/shots/{kit,Verse1,Chorus1,Span1,Verse2,Verse3,Bridge,Coda}.tsx`, `remotion/src/compositions/ContextReel.tsx`. TileGrid now flips row by row (`rowFlip`) and takes the thermal sweep's position as `heat`. The master is copied to `remotion/public/audio/master.wav` (git-ignored) for `<Audio>`.
- **Choices to check:**
  - The needle lift lands on the last downbeat at least 0.5 s before the coda's first word; the swirl freezes there and drains to gray over 24 frames.
  - The span-1 haze peaks at 0.45 opacity (0.62 buried the cards in a test still), settling to 0.25.
  - The bridge's energy meter is a bar meter that grows per token, with no number, so the only footprint number on screen stays "???" (brief).
  - The Memphis card uses a placeholder grid map until the Natural Earth outlines are added in M4.
- **Why:** to judge the M3 look in context before the gate.

## 2026-10-30T01:40:00-04:00 — M3 gate passed; M4: the animatic of every shot

- **Gate:** the human approved the look after the context reel ("yes, keep going"; human_interventions, 01:15).
- **What:** Built every shot S01–S52 as Remotion scenes driven by the timing map, grouped into one composition per section (Intro, Verse1, Chorus1, Span1, Verse2, Verse3, Bridge, Coda) and chained into `Animatic` with the master (from the end of the 2 s pre-roll) and a post-roll (S51, F1–F7, S52). A burn-in names the shot(s) on screen and the frame. Rendered at 960x540.
- **New inputs:** Natural Earth 1:50m admin-1 states (lakes) v5.1.2, public domain, downloaded to `assets/naturalearth/` and projected (Albers, lower 48) by `scripts/build_maps.py` into `remotion/src/data/maps.json`; Caveat 5.3.0 (OFL) for the hand-lettered signs. Both are in `assets/LICENSES.md`.
- **New scenes:** `Intro.tsx` (S01–S04: the cursor never moves; the prompt fades in around it); `Verse1Map`, `Verse1Granddad` (S05–S06, S10–S11); `Chorus1Hum` (S12–S15); `Verse2Permit` (S26–S27); `Verse3Archive.tsx` (S32–S35 with S33a, S38); `BridgeBill` (S39–S40); `BridgeNeedle` gained S41's typing, per-card fades and the last cornstalk (in the chart's legend); `CodaReveal.tsx` (S45–S47); `CodaStutter` gained S50 and the stutter now stops at span 2's end; `Post.tsx` (S51, F1–F7, S52). Illustrations (`components/illustrations.tsx`): protesters, farmhouse photo, cobweb, peace-sign-to-power-button, fireflies, map view.
- **Placeholders (waiting on H3 inputs):** S45–S46's Suno generation capture and S51's post-filter terminal capture are labeled gray windows. Nothing imitates either real interface.
- **Departures and choices for the gate:**
  - **Fireflies are drawn:** Unicode has no firefly emoji, so S15's fireflies are small glowing dots blinking at the status-dot rate.
  - **Turbines** are Lucide's `fan` icon (Lucide has no turbine).
  - **S04's title card** holds only 4.9 s (9.28–14.16 s); the terminal typing in S03 runs at 1.8 characters per frame to finish before it.
  - **S50:** the cord enters from the left, runs along the bottom and plugs into the terminal's right side; the overlay stays at "OFF (by choice)" to the end.
  - **Post-roll timing:** S51 6 s, a 0.5 s fade, F1–F7 5 s each, S52 20 s in two pages: 61.5 s in all.
  - **Post-roll sound:** the master has no fan, so `scripts/postroll_audio.py` generates one: a fan spinning down over 5 s (bridging S50 → S51), pink room tone at −52 dBFS and a 60 Hz hum with harmonics at −44 dBFS, fading over the last 4 s.
  - **Fact cards and end card** use the brief's wording; F1–F7 statuses are unchanged (M8 verifies or cuts each).
- **Review aid:** `scripts/contact_sheets.py <video>` writes `review/<shot>.jpg` for every shot (four frames each).
- **Why:** the brief, M4 ("Animatic of every shot at low resolution, cut to the track"). Gate: "Approve framing and timing".
