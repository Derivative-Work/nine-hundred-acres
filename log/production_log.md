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

## 2026-10-30T02:20:00-04:00 — M4: more going on (explainer chrome and annotations), sampled on Verse 1 and Chorus 1

- **What:** The human, on animatic v2: "the gist is good, but I feel like this genre of explainer typically has more going on in them". Added the genre's secondary layers, built so they apply to the whole video, and filled in Verse 1 and Chorus 1 as a sample before rolling out.
  - **Chrome** (`remotion/src/chrome/`): a chapter header (01 The Land, 02 The Hum, 03 The Air, 04 The Power, 05 The Bill) with progress dots per shot; a headline per shot that types in; an "agent ·" status chip (spinner, then a check) naming what it is building; the source line for factual shots; a thin progress bar; a drifting dot grid and floating particles that turn into tie-dye petals with the infection; each scene scaled under the header with a slow push. The chrome reads the global infection curve, is absent before the title card, and strips away from S45 to S48. During the restore overlay (S19–S21+, S48 on) the agent chip hides so the overlay owns the top right.
  - **Annotation layer** (`components/annotate.tsx`): leader-line notes, stat tiles that tick, and a pointer cursor with click ripples. In the sample: the map's state/region/crop/height tiles and a click on the pin; acres/reason/windows tiles, "annexation boundary", "1 stalk left"; "family photo · 1 of 1", "archived", "1 hum", "amplitude: constant"; "period: forever", "cricket? no: fan", a hover on "room 0412 · thinking…", a rooms counter; the cursor failing to tick Sleep and Stop ("can't check").
  - Per-shot text lives in `remotion/src/chrome/script.ts`; every factual line names its source from the Reference facts table (Iowa Public Radio; Oil & Gas Watch, Gas Outlook; Maryland Matters, Enlit; NPR via KUNC).
- **Fixes:** the hum's label no longer says "60 Hz" (an implied fact with no source); the review burn-in moved to the bottom right.
- **Why:** the human's note at the M4 gate. Rolling out to the other sections waits on their view of the sample.

## 2026-10-30T02:50:00-04:00 — M4: the annotation layer rolled out; animatic v3

- **What:** After the human approved the density sample ("this is good, keep going"), added notes, stat tiles and cursor moves to every remaining scene from S17 to S44, and re-rendered the whole animatic.
  - S17–S22: "cloud.location = ?", cloud altitude "0 ft", location "a field"; the cursor clicking "Artifact detected" twice ("can't dismiss"); "you are here" on Memphis; state "Tennessee".
  - S23–S25: air permits "0" (sourced on screen), "exhaust" on a plume, "wind consulted: no"; the cursor drifting to Wind's raised hand and away; a "hand raised for" timer.
  - S26–S27: permits filed "0", notices posted "0"; the cursor knocking on the permit office ("no answer"); "schoolhouse", visibility "low", lawyers at door "3".
  - S32–S35: "hand-lettered, 100% human", year "1979", reactors "off", restart (planned) "mid-2027" (sourced); the cursor flips the Reactor toggle.
  - S36–S37: destination "the machines", heat map "tie-dye", "still corn" on the surviving stalk; the cursor chasing the Against/For slider.
  - S38: signs "8", message "ok, fine", "now gray".
  - S39–S40: amount due "up again", a line-items counter, an axis-rescales counter, "itemized (very)".
  - S41–S44: tokens, confidence "high" → "uncertain", error bars "wide", "sparkle: decorative"; the cursor sends the question. These fade out as the swirl builds.
  - No annotations from S45 on: the coda strips back to the bare terminal as briefed.
- **Fixes:** the haze and lava layers now overhang the scaled stage (they stopped short of the right edge); S26's tiles fade before S27.
- **Why:** the human's M4 notes. Gate: framing and timing.

## 2026-10-30T05:51 — M4: coda corruption reworked; animatic v4

- **Bug:** the glyph boxes ("▯") are not in JetBrains Mono or Inter; the fallback font drew them as thin double slivers. Now drawn as real one-character boxes (`Tofu` in `shots/kit.tsx`).
- **Interest:** after the letters fail (~5 s) S49 sat static for ~33 s. Now, on the stuttered 6 fps clock, every downbeat tears the frame into shifted bands with a red/cyan split, palette blocks smear across the black (lighter ticks on the other beats), and ghosts of the explainer (title, toasts, chapters 01–05, headlines; on-screen text only, nothing new) flash up half-boxed in order and fail. It builds through the outro, peaks from 222 s, and clears when the drums drop out (227.14 s). The overlay stays OFF; nothing recovers.
- **S50:** clean frame; after the plug lands a spark, then current runs along the cord into the terminal, slowing to a stop with the fan spin-down.
- **Commit:** 2e32c53 (code); animatic v4 in renders.md.

## 2026-10-30T06:40 — M4 gate approved; caret and fan fixes

- **Caret:** `Terminal` drew the cursor on its own line below the last row. It now sits at the end of the last row, where the next character is typed (S01–S04, S48–S50). Rows keep their spaces (`white-space: pre`), so "  ok  Explainer ready" shows its indent.
- **Fan:** `scripts/postroll_audio.py` takes a lead: `postroll_audio.py 61.5 8` starts the file 8 s before the song ends; the fan (at full speed) and the room tone fade in under the final chord (smoothstep, full 1 s before the end), and the spin-down starts where the song ends, as before. The Animatic starts `postroll.wav` 240 frames early. v1 moved to `archive/audio/postroll_v1.wav`.

## 2026-10-30T06:50 — M5 begun: Intro and Verse 1 final renders

- Final sections are frame ranges of the full cut (`Animatic`, burn-in off) at 1080p, CRF 16; the full release render later is the same composition end to end. Fixed S10's badge and label (see renders.md). Sent both for approval.

## 2026-10-30T06:57 — M5: granddad.jpg redrawn; Verse 1 re-rendered

- The human asked for more detail in the photo. Now an old family snapshot in SVG: sky with clouds, a tree line, a two-story farmhouse with siding, porch, gable window and chimney, a red gambrel barn with hayloft and X door, a silo, a windmill, a tree with a tire swing, a fence and mailbox, corn rows to the horizon; warm fade, grain, vignette, a light leak and a crease. Generic, no people. It still goes gray when archived.

## 2026-10-30T07:08 — M5: Chorus 1 and Span 1 final renders (and Verse 1 v3)

- Fixes from the full-res pass listed in renders.md; the S22 map placeholder was an M4 item that had been missed.

## 2026-10-30T07:15 — M5: Chorus 1 and Span 1 approved

- Human approved Chorus 1, Span 1 and Verse 1 v3 (H2). Next: Verse 2 (S23–S27).

## 2026-10-30T08:25 — M5: Verse 2 and Verse 3 final renders

- Full-res still passes, fixes and renders listed in renders.md. Sent both for approval. Noted for the human: the cord in S05–S11 and S12 also begins in midair at the stage's left edge (approved sections, left as is unless asked).
- Verse 3's master (38.8 MiB; the film grain is costly at CRF 16) exceeds the 30 MiB send limit, so the human got a CRF 21 review copy (10 MiB, scratch only). The master in `renders/m5/` is unchanged.

## 2026-10-30T08:33 — M5: 1979 crowd redrawn; Verse 3 re-rendered

- The human asked for more detail in the "no nukes" photo. Redrawn (details in renders.md); the figures stay faceless pictograms as the brief specifies.

## 2026-10-30T08:40 — M5: Verse 2 and Verse 3 approved

- Human approved (H2). Next: Bridge (S39–S44).

## 2026-10-30T08:43 — M5: Bridge final render

- Still pass, fixes and render in renders.md. Sent for approval; Coda next.

## 2026-10-30T09:10 — M5: human notes on Verse 3 and the Bridge; the real Suno capture in the coda

- **Verse 3 (peace sign):** the sign was a free overlay, so it stayed still while the photo wove and the toggle card floated and leaned. Now it is drawn inside the banner (in the photo's SVG, so it weaves with the film) until it lifts off, and inside the toggle card's icon slot once landed; only the 30-frame flight is free, and its ends follow the same weave and card drift/lean formulas, so neither hand-off jumps (checked on the frames either side of each).
- **Bridge (rescales):** each of the three rescales is now an event: the cursor clicks a "Fit to data" button, the axis flashes, the gridlines and labels slide down and squeeze as the scale eases from $1B → $5B → $10B → $30B (12 frames each, 28 apart), a toast counts "Rescaling axis… 1/3…3/3", and the bar shows a torn top and "▲ doesn't fit" until the third.
- **Coda (H3):** the placeholder is replaced by the human's capture. The recording is the Suno workspace playing this take (not the generation moment, per the human), with the lyrics, the style prompt on each take and the take list. Cropped to the page: the browser chrome is removed because it carried another company's branding (an "Ask Gemini" button) and the profile avatar. Proxy: `ffmpeg -i assets/real/suno_generation_capture.mov -vf "crop=2960:1450:120:262,scale=2400:1176:flags=lanczos,fps=30" -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -an remotion/public/real/suno_capture.mp4`. Sync: the player's counter turns to 2:49 at 0.93 s, so song time = capture time + 168.07 s; checked at frames 5420 (2:58 on screen, 178.7 s) and 5500 (3:01, 181.3 s). S46 pushes in on the take that is playing (the third row, highlighted in the capture) with an amber ring. Listed in `assets/LICENSES.md`.
- **Process note:** parallel `remotion still` launches deadlocked (idle CPU, no output) three times this session; stills now render one at a time.

## 2026-10-30T09:20 — M5 gate passed

- All eight sections approved (H2). Starting M6.

## 2026-10-30T09:40 — S51 rebuilt from the post-filter's own output code

- Cloned https://github.com/Derivative-Work/music-deslop to `~/Code/music-deslop` (commit 2469907); not run (no GPU here).
- How it reports: `postfilter.postprocess.postprocess` logs `  fallback <a>-<e>: model output was noisy there, passed through unprocessed` per fallback passage (times via `fmt_time`, `m:ss.s`), and `infer.main` prints `<in> -> <out> (<len> s, strength <s>, latent null)`. With `--no-fallback` the detector is not run at all, so the no-fallback run prints only the summary: the two spans can only appear in the default run's log.
- So S51 shows both runs from the human's run folder (`~/Downloads/music-deslop-m6f-10k-2026-10-18`: `with-fallback/` and `no-fallback/`): the default run listing `1:12.4-1:22.6` and `3:11.2-3:48.9` (the repo's `fmt_time` applied to `fallback.json`'s regions; matches the folder's REPORT.md), then the `--no-fallback` run, which made the master. Strength 1.0 (the repo's default for every source), latent null (no latents given), 238.4 s. No clip line (REPORT.md lists no scaling for this song). Command form from the README (`--ckpt m6f_10k.safetensors --source suno`); the exact paths used on the 5090 are not recorded, so the commands use the run folder's layout.
- S51 lengthened 180 → 270 frames so both timestamps can be read; post-roll 61.5 → 64.5 s, so `postroll.wav` is regenerated after the running M6 render finishes.

## 2026-10-30T09:55 — M6: first pass on the full render; span 2's onset made visible

- Full render (`Animatic`, `label: false`, 1080p, CRF 16, 12 min) → `renders/m6/nine_hundred_acres_full.mp4`, and the track alone as WAV (`--codec=wav`) → `renders/m6/audio_check.wav`; `scripts/m6_check.py` on both:
  - Audio: the master (hash = `audio/master/field-of-humming-things.no-fallback.wav`) through both spans ±1 s: max |render − master| 3.04e-5 = one 16-bit step (the check WAV is 16-bit), residual −76.5 / −80.2 dB: no gain, edit or processing; the spans are untouched.
  - Span 1 start: first changed frame 2232 (the cards' jitter; haze and overlay follow). Span 1 end: 2539 is the first "Human warmth restored" frame. Span 2 end: 6927 is the first clean frame.
  - Span 2 start: 5795 changed almost nothing (per-frame change 0.01): the overlay's stall only stops its spinner, and on the bare terminal there is nothing moving for the 6 fps stutter to hold. Fix: the failure's first frame tears once (red/cyan band shift, palette blocks), held for the first dropped-frame step (5795–5799); 5794 and 5800 are clean (checked on a frame render).
  - Captions: driven by the timing map's word frames, 0 frames off by construction.
- `postroll.wav` regenerated for S51's new length: `postroll_audio.py 64.5 8` (72.5 s); v2 → `archive/audio/postroll_v2.wav`.

## 2026-10-30T10:05 — M6 gate passed

- Human approved (H2). Starting M7.

## 2026-10-30T10:15 — M7: end card, SRT, thumbnail

- **End card (S52)**, two 10 s pages in plain type on black (`remotion/src/shots/Post.tsx`): page 1 is the title, the brief's two statements, the energy line, and one line per on-screen fact with its source (the six rows of the brief's Reference facts, worded as on screen; the fact cards keep their own sources). Page 2 is credits: Suno v6, Remotion and Claude Code, the post-filter (M6f 10k, without its fallback); a disclosure that the Suno screen is the human's recording and the post-filter log is rebuilt (the human's S51 decision, 09:40); then `assets/LICENSES.md`: the Twemoji credit verbatim (required, CC BY 4.0), Lucide, Natural Earth, the four OFL fonts, and the brief's note that the people are original faceless pictograms. The animatic's "draft" line is gone.
- **SRT:** `scripts/make_srt.py deliverables/nine_hundred_acres.en.srt`: 30 cues, built frame by frame with the burned-in captions' own rule (`Captions` in `shots/kit.tsx`), so the two agree to the frame.
- **Thumbnail:** S38's "…OK, FINE." signs (brief). `deliverables/thumbnail.jpg` (1280×720, a crop of the S38 photo card from frame 4280) and `deliverables/thumbnail_alt_fullframe.jpg` (the whole frame with the explainer chrome). Never the Suno screen.

## 2026-10-30T10:24 — M7: vertical cut, closing; gate

- Rendered (renders.md). Sent the closing, the vertical cut, the end card stills, the thumbnail and both SRTs for the M7 gate (closing and end card). M8 (the fact check by another lab's model) is next after approval.

## 2026-10-30T10:30 — M7 gate passed; draft cut

- Human approved M7 (H2) and will run the M8 audits; rendering a full draft cut for them.

## 2026-10-30 — M8: audit prompt for the cross-lab fact check

The human asked for the prompt to paste into the other labs' models. Wrote `log/prompts/other/m8_fact_audit.md`:
- **What it lists:** every on-screen claim from the draft cut, each with its source from the Reference facts table:
  - A1–A12: graphics, lyrics and the end card.
  - F1–F7: the fact cards, with their exact text.
  - Section C: the satirical labels, to flag only if a viewer could take one as fact.
- **What it asks for:** a verdict per claim, a quote from the source, newer developments as of today, a primary source for each fact card, and a suggested rewording that fits on screen.
- **Rules for the auditor:** it may not verify a claim from memory, and it may not add names. The Memphis company stays unnamed on screen.

The auditors' outputs go in `log/audits/`, following the sibling repos' layout.

## 2026-10-30T16:30 — M8: audits filed and checked

- **Received:** the human's two audits (ChatGPT, which browsed; Gemini, which could not browse, so every row is UNVERIFIED) and the NBC report behind F1 (video and captions). Filed in `log/audits/` and `reference/sources/` (git-ignored).
- **Checked:** every flag against a source Claude opened itself; the results are in `log/audits/03_review.md`.
- **Findings neither auditor caught:**
  - F3's "150 gallons an hour" comes from a reader comment on the Prince William Times page.
  - F2's figure covers all of Virginia, and it counts permitted generators, not Northern Virginia.
  - F7's 57 turbines are in Southaven, Mississippi, confirmed by N.D. Miss. Doc 51, the primary source.
- **Verified from the primary source:** F1, from the NBC captions.
- **Proposed:** text changes to A3, A4, A5, A9, A12 and F1–F7, with F3 retired. These wait on the human's approval; nothing on screen has changed yet.

## 2026-10-30T16:50 — M8: the Southaven case, read to date

The human flagged the F7 finding as especially important. Claude read the docket through 2026-10-26: the state called the turbines exempt; the United States, on the EPA's behalf, moved to dismiss the NAACP's suit (denied 2026-10-19), then filed a crossclaim against the NAACP citing "Super Intelligence" power for the "Department of War". Details are in `log/audits/03_review.md` (addendum). Card options drafted for the human; the naming guardrail is the human's call.

## 2026-10-30T17:05 — M8: resolutions applied

- **Fact cards** (`Post.tsx`):
  - F1, F2 and F4–F6 reworded to their verified sources (`log/audits/03_review.md`).
  - F3 retired: no primary source.
  - F7 rewritten for Southaven, naming xAI.
  - F7a and F7b inserted: the U.S. motion to dismiss, denied 2026-10-19, and the 2026-10-23 crossclaim quote.
  - Each card now holds long enough to read: max(5 s, 1.5 s + words / 4). The eight cards run 8.3 + 6.5 + 8.5 + 8.7 + 8.5 + 9.7 + 8.7 + 7.5 s.
  - The post-roll is now 2879 frames (96.0 s), and the video 10091 frames (5:36.4).
- **End card:** the Memphis line and the energy-meter line reworded.
- **Graphics:**
  - S08 headline: "End user: confidential". Stat: "end user".
  - S24 headline: "… (2025)".
  - S26: stat "permits granted"; source line now cites SELC's reading of the Jan 2026 rule.
  - S36/S36a: headline and the title art now read "Restarting to feed the machines". The lyric is unchanged.
- **Audio:** `postroll.wav` regenerated with `postroll_audio.py 96 8` (104 s); v3 moved to `archive/audio/postroll_v3.wav`; manifest updated.
- **Checked:** stills of every changed frame.
- **Still owed:** a brief edit (guardrail scope, the Reference facts S22–S26 and S50/S52 rows, the F table, S51 source). `scripts/contact_sheets.py` still hard-codes the old post-roll timings, as it already did before this change; it's unused since M5.
