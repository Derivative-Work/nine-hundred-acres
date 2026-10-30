# Nine Hundred Acres (The Hum)

A sincere 1970-style folk-rock protest song about AI data centers, illustrated as the slickest possible agent-built explainer animation, code-rendered in Remotion. Suno calls the take "Field of Humming Things"; the video calls it "Nine Hundred Acres (The Hum)".

**Start here:** the brief is the Claude Doc https://claude.ai/artifact/Hai6RqdqRpZrmBXy5ywMg5 (read it with the docs tools, not a web fetch; mirrored in `docs/brief.md`). Its production rules, guardrails, milestones (M1–M8) and gates govern this project. House conventions not in the brief come from the sibling repos under `~/Projects` (Share the Shares is the most recent). Then read the latest entries of `log/production_log.md` and `log/human_interventions.md`.

Rules that apply to every step:
- **Human role (brief):** the human only picks takes (H1), approves gates (H2) and supplies the real assets listed under Inputs (H3). Log every human action with its code in `log/human_interventions.md`; anything else is an EXCEPTION.
- **Logs:** append to `log/production_log.md` for every action; every render in `log/renders.md` (shot ID, composition, props, commit); every post-filter run in `log/postfilter.md`.
- **Gates:** stop at the end of each milestone until the human approves.
- **Audio:** the video uses `audio/master/field-of-humming-things.no-fallback.wav` (artifact suppression off). Never re-run or patch the two failure spans.
- **Commits:** one git commit per logged step.
- **Assets:** never delete or overwrite an asset. Superseded or rejected files go to `archive/` with a log note. Every third-party file goes in `assets/LICENSES.md`. Illustrations are SVG built in code; ask before any other source.
- **Large files** stay out of git; run `scripts/manifest.sh` after adding any.
- **Shot IDs** never change: inserts take a letter suffix, removals retire their ID.
- **Python:** `.venv/bin/python -I scripts/<script>.py` (uv; CPU torch on the GTX 970 box).
