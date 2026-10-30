# Audits

M8: the cross-lab fact check of every on-screen claim (brief, "Milestones": "run by another lab's model against the Reference facts sources"). Claude built the video, so the audits come from other labs' models. The human ran each one with the prompt in `log/prompts/other/m8_fact_audit.md` (commit 7591f8a).

| # | Auditor | Version | Date | Browsing | Raw output | Use |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ChatGPT (OpenAI) | not recorded | 2026-10-30, saved 16:19 EDT | Yes: opened 11 of the 15 listed URLs, plus 18 others | `01_chatgpt_raw.md` | The working audit. Each flag is checked in `03_review.md` |
| 2 | Gemini (Google) | not recorded | 2026-10-30, saved 16:21 EDT | No: "my web-browsing and search tools are unavailable in this environment" | `02_gemini_raw.md` | Advisory only. Every row is UNVERIFIED; its four framing flags are answered in `03_review.md` |

The raw files are byte-for-byte copies of the human's saves: `~/Downloads/nine-hundred-acres-{chatgpt,gemini}-audit.md`.

## Source material the human supplied

`reference/sources/nbc_2026-10-28/` holds the NBC News report behind F1: the video (`-pjm8epal6o`, .webm) and three caption tracks. The human downloaded them on 2026-10-30 at 16:15 EDT. They are git-ignored, are never published, and are kept only for the record.

## Sources Claude retrieved

These are in `reference/sources/`, git-ignored:
- `naacp_v_xai_msnd/`: N.D. Miss. No. 3:26-cv-74, Docs 50–52, from the free RECAP archive on CourtListener. Doc 51 is the primary source for F7.
- `better_data_center_project_2026-03_diesel_generators.pdf`: the primary source for F2.
