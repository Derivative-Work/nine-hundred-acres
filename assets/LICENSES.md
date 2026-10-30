# Third-party assets

Every third-party file in the edit: name, source, version, license, and the credit line if one is required (brief, "Assets and licenses"). Everything illustrated is SVG drawn in code in `remotion/src`; those are original and not listed here. Files reach the render only through `scripts/sync_assets.mjs` (emoji, icons) or the font packages' imports in `remotion/src/theme/fonts.ts`.

| Asset | Files | Source | Version | License | Credit |
| --- | --- | --- | --- | --- | --- |
| Twemoji (the emoji set; chosen over Noto Emoji) | `remotion/public/emoji/*.svg` (names and codepoints in `scripts/sync_assets.mjs`) | npm `@twemoji/svg` (https://github.com/boywithkeyboard/twemoji_svg; packages https://github.com/jdecked/twemoji) | 15.0.0 | Graphics: CC BY 4.0. Packaging code: MIT | **Required:** "Emoji graphics by Twemoji (Twitter, Inc. and other contributors), CC BY 4.0" |
| Lucide icons | `remotion/public/icons/*.svg` (list in `scripts/sync_assets.mjs`) | npm `lucide-static` (https://lucide.dev) | 1.57.0 | ISC | Not required; listed on the end card anyway |
| Inter | imported from `@fontsource/inter` | https://github.com/rsms/inter via Fontsource | 5.3.0 (package) | SIL OFL 1.1 | Not required |
| JetBrains Mono | imported from `@fontsource/jetbrains-mono` | https://github.com/JetBrains/JetBrainsMono via Fontsource | 5.3.0 (package) | SIL OFL 1.1 | Not required |
| Caveat (the hand-lettered protest signs, S32 and S38) | imported from `@fontsource/caveat` | https://github.com/googlefonts/caveat via Fontsource | 5.3.0 (package) | SIL OFL 1.1 | Not required |
| Natural Earth admin-1 states (the map cards' outlines, S05 and S22) | `assets/naturalearth/ne_50m_admin_1_states_provinces_lakes.geojson`, projected by `scripts/build_maps.py` into `remotion/src/data/maps.json` | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_1_states_provinces_lakes.geojson | 5.1.2 | Public domain | Not required; credited on the end card |
| Shrikhand (the groovy display face for infected headings) | imported from `@fontsource/shrikhand` | https://github.com/jonpinhorn/shrikhand via Fontsource | 5.3.0 (package) | SIL OFL 1.1 | Not required |
| Suno generation capture (S45–S47, the coda reveal) | `assets/real/suno_generation_capture.mov` (original, 3200×1868, 54.1 s, no audio); `remotion/public/real/suno_capture.mp4` (derived: cropped to the page, browser chrome removed, 2400×1176, 30 fps; regenerate with the ffmpeg command in `log/production_log.md`, 2026-10-30T09:10) | The human's own screen recording of their Suno workspace playing this song (H3) | 2026-10-30 08:49 | The human's own recording; shows the real Suno interface, which the brief allows only as this real capture | Not required |

## Tools (not assets, recorded for the end card)

| Tool | Version | License |
| --- | --- | --- |
| Remotion | 4.0.535 | Remotion License: free for individuals and companies of up to 3 people; larger companies need a company license |
| React | 19.1.10 | MIT |
