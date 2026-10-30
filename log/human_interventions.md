# Human interventions

Every human action: timestamp, what, why, and which rule allows it. The brief allows the human only to (H1) pick takes, (H2) approve gates, and (H3) supply the real assets listed under Inputs (the Suno master and the post-filtered version, the Suno generation capture, the post-filter terminal capture). Anything else is an EXCEPTION.

## 2026-10-14T03:12Z (Suno's created_at) — Track generated in Suno — H1

- **What:** A human ran Suno (V6, `chirp-hawk`) once and kept the first generation, `4dc300e8-54c6-4990-94da-8a3842909810` ("Field of Humming Things", 238.4 s), with the first-draft lyrics.
- **Why:** The agent has no access to Suno. The planning chat (message 31): "I had actually gone with the first draft of the lyrics since it flowed the best. It also happened to be the first generation of this song too."
- **Rule:** H1 (take chosen); H3 (master supplied).

## 2026-10-18 (the post-filter folder's date) — Post-filter run on the master — H3

- **What:** A human ran the deslop post-filter (M6f 10k checkpoint, release chain) on the master twice, with and without the fallback, and supplied both outputs, `fallback.json` and `REPORT.md` (`~/Downloads/music-deslop-m6f-10k-2026-10-18`).
- **Why:** The brief's Inputs: "the post-filtered version, rendered with artifact suppression off".
- **Rule:** H3. Details in `log/postfilter.md`.

## 2026-10-30T00:00 — Inputs supplied; the no-fallback version chosen — H3, H1

- **What:** The human pointed the agent at the brief, the planning chat (https://claude.ai/share/a5f6169c-f61a-4fe1-8082-0fa59375473a), the master folder, the Suno link (https://suno.com/s/Wq0bulQq4X9a9RsO), the stems in `~/Downloads` and the sibling projects. They said: "as the brief describes, you want the *no*-fallback version. (note that Suno called it "field of humming things" while I'm calling it "Nine Hundred Acres")".
- **Why:** Inputs for the project.
- **Rule:** H3 (inputs); H1 (no-fallback chosen, as the brief already specifies).
- **Still needed (H3):** the screen capture of the Suno generation (S45–S46) and of the post-filter run in a terminal (S51).

## 2026-10-30T00:20 — M1 gate: lyrics and spans approved; chorus 2 gags moved; needle lift kept — H2

- **What:** The human: "fallback.json is fine; move the chorus 2 gags into verse 3. just keep the needle lift as a visual beat -- I'll play around with the stems once we're on the 5090 box (since it's able to re-run the post-filter). looks like the transcriber is dropping 'd's -- "rolled", "wind", "in", "out east", "it said", "hummed out" are all correct"
- **Why:** M1 gate (confirm lyrics and span times), plus the shot-list questions M1 raised.
- **Rule:** H2 (gate approval). Moving the gags and keeping the needle lift are shot-list decisions at a gate; the brief was edited to match (production log). The stems work on the 5090 box is a future human action, to be logged with its own rule when it happens (a re-mix of the audio would be outside H1–H3: an EXCEPTION unless the brief is amended).

## 2026-10-30T00:42 — M2 gate: timing map approved — H2

- **What:** The human: "map sounds right, go ahead with M3".
- **Rule:** H2.

## 2026-10-30T01:15 — M3 gate: look approved (style board and context reel) — H2

- **What:** After the style board the human said: "the infection looks great, but it's a little hard to tell how these will work in context without more scenes". After the context reel: "yes, keep going".
- **Rule:** H2.

## 2026-10-30T02:25 — M4 note on density; the sample approved — H2

- **What:** On animatic v2: "the gist is good, but I feel like this genre of explainer typically has more going on in them". On the density sample: "this is good, keep going".
- **Rule:** H2 (feedback and approval at the M4 gate; the agent made the changes).

## 2026-10-30T05:51 — M4 note on S49–S50 — H2

- **What:** On animatic v3: "Mostly there, but S50's visual corruption is not rendering right and also could use some more visual interest".
- **Rule:** H2 (feedback at the M4 gate; the agent made the changes).
