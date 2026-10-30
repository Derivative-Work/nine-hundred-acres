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
