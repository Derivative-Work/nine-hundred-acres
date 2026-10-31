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

## 2026-10-30T06:40 — M4 approved, with two notes — H2

- **What:** On animatic v4: "Both are good. Two nitpicks, then keep going: the terminal caret is in the wrong position for what is typed next, and fade into the fan sound during the end of the song rather than starting it abruptly".
- **Rule:** H2 (M4 gate approved: framing and timing; the agent made the two fixes).

## 2026-10-30T06:57 — M5 note on S10's photo — H2

- **What:** On the Verse 1 final render: "I feel like that photo could use some more detail".
- **Rule:** H2 (feedback at the M5 gate; the agent redrew it).

## 2026-10-30T06:58 — M5: Intro and Verse 1 approved — H2

- **What:** "Yes, keep going" (on Intro and Verse 1 v2).
- **Rule:** H2.

## 2026-10-30T07:15 — M5: Chorus 1 and Span 1 approved — H2

- **What:** "yes, keep going" (on Chorus 1, Span 1 and Verse 1 v3).
- **Rule:** H2.

## 2026-10-30T08:30 — M5 note on the 1979 crowd photo — H2

- **What:** On the Verse 3 final render: "the "no nukes" photo depiction needs more detail".
- **Rule:** H2 (feedback at the M5 gate; the agent redraws it).

## 2026-10-30T08:40 — M5: Verse 2 and Verse 3 approved — H2

- **What:** "looks good, keep going" (on Verse 2 and Verse 3 v2). The open question on the cord's start in S05–S12 got no answer; left as is.
- **Rule:** H2.

## 2026-10-30T08:46 — M5 notes on Verse 3 and the Bridge — H2

- **What:** "oh one more thing for verse 3: the peace sign/power button are not moving with their apparent containers" and "for the bridge: the graph rescales are not obvious enough".
- **Rule:** H2 (feedback at the M5 gate; the agent makes the changes).

## 2026-10-30T08:51 — Suno generation capture supplied — H3

- **What:** "I put the Suno screen grab in Downloads. It's not showing the "create" but it is showing the playback at exactly the timestamps from the video, and it includes prompt etc." File: `~/Downloads/Screen Recording 2026-10-30 at 08.49.12.mov`, copied unchanged to `assets/real/suno_generation_capture.mov`.
- **Rule:** H3 (a real asset listed under Inputs: the capture for S45–S46).

## 2026-10-30T09:20 — M5 approved: Verse 3, Bridge, Coda — H2

- **What:** "these look great, keep going" (on Verse 3 v3, Bridge v2 and the Coda). All eight sections are approved; M5 gate passed.
- **Rule:** H2.

## 2026-10-30T09:40 — S51 source changed: rebuilt from the post-filter repo instead of a capture — H2

- **What:** "the 5090 box is busy doing another video, but you do have access to the deslop repo at https://github.com/Derivative-Work/music-deslop -- even if you can't run it yourself here (it might need more VRAM), you can at least check it out (put it in ~/Code/music-deslop) and inspect the repo for how it outputs status including fallbacks and combine it with where you know the artifacts are".
- **Rule:** H2 (a human decision on an input: S51's brief source is S, a real capture listed under H3; the human chose a reconstruction instead). Not an EXCEPTION: the human directed it. The brief's S51 row still says S; flagged for a brief edit.

## 2026-10-30T10:05 — M6 approved — H2

- **What:** "these are great, keep going" (on the span-edge clips, the onset tear, and the rebuilt S51).
- **Rule:** H2 (M6 gate: sync and the reveal).

## 2026-10-30T10:30 — M7 approved; draft cut requested; the human runs the audits — H2

- **What:** "these are great; make a draft cut of the whole thing and then I'll do the audits".
- **Rule:** H2 (M7 gate: closing and end card approved). The M8 fact check is the human's to run; the agent makes a draft cut first.

## 2026-10-30T16:55 — Naming guardrail lifted for the fact cards — H2

- **What:** "Lift the guardrail for facts cards, that's the point of them" (answering whether F7–F7b may name the company). Earlier, on the F7 finding: "some version of that xAI finding actually seems *especially* important to point out in a video like this".
- **Rule:** H2, a human decision on the brief's guardrail ("never name the Memphis company"). It now applies to the song and its graphics only; the fact cards may name companies. The brief needs this edit.
- **Also taken as direction:** proceed with the resolutions in `log/audits/03_review.md` and all three Southaven cards. The M8 gate (resolve every flag) is approved on the re-render.

## 2026-10-30T18:25 — S50 plug and fan approved; 4K render requested — H2

- **What:** "This looks correct" (on v4's closing: the plug riding the cord, the fan starting at the plug-in). Then: "Do a 4k render".
- **Rule:** H2. This approves the S50 and post-roll fixes. The M8 sign-off for release has been asked about but not yet given.

## 2026-10-31T07:10 — 4K render approved; release prep requested — H2

- **What:** "This is great. I gave you write access to https://github/Derivative-Work/nine-hundred-acres for you to push to and prepare to publish -- see the adjacent projects in the organization (prerelease drafts of which are also in the parent directory). In particular, you'll need to write a README.md, license documentation, and the YouTube METADATA.md"
- **Rule:** H2. Approves the 4K render, and with it the M8 gate (release). The human created the GitHub repo (private) and granted push access; the agent pushes and writes the release documents. Uploading to YouTube stays with the human.

## 2026-10-31T08:40 — Thumbnail A chosen — H1

- **What:** "yes go with A" (of the five text thumbnails in `review/thumbnails/`).
- **Rule:** H1, a pick among the agent's options. A replaces the plain S38 thumbnail chosen at M7.

## 2026-10-31T09:15 — Main video uploaded to YouTube; release requested — EXCEPTION (publishing)

- **What:** "go ahead and make the release too"; then, while the agent was building it, "youtube link https://www.youtube.com/watch?v=7OT7Fb6LcP8". The human uploaded the main video (not yet public: YouTube's oEmbed returns 403).
- **Rule:** outside H1–H3: the agent has no access to YouTube, and publishing is the human's call (as R4/R1 in Not Yet). The release request is H2.

## 2026-10-31T09:50 — Session transcript published verbatim — H2

- **What:** Asked whether the session transcript should go in the release, given it holds their email address (from the context Claude Code adds) and text from the fact-check sources and the other models' audits, the human chose "Verbatim" over a redacted copy or leaving it out.
- **Rule:** H2 (a decision on what is published), as in Not Yet.
