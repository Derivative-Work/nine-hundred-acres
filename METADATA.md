# Upload metadata

YouTube metadata for the main video and the vertical cut, ready to paste at upload. Written by the agent; the human
uploads.

**Before uploading:**
- **Intervention count.** Update the number in the main description (`grep -c '^## ' log/human_interventions.md`).
  It was 23 when this file was written (2026-10-31).
- **Links.** Once the main video is up, put its link in the vertical cut's footer (`MAIN_VIDEO_URL`), set the
  vertical cut's **Related video** to the main video, and add the link to the README's "Watch" section.
- **The reveal.** The brief keeps the song's origin back until the coda: nothing on screen says the music is
  generated until the song admits it ("Wasn't sung by any throat"). So the titles, the opening lines of each
  description and the thumbnails never name Suno or say the song is generated. The first line does say
  "AI-generated satire", as in every video in the series, and YouTube's synthetic-content label shows anyway (see
  Settings); the explainer look is openly machine-made from the start (brief). Suno is named only under CREDITS, below
  the fold.
- **Licences** (video and assets CC BY-NC-SA 4.0, code MIT) are in the repo: `LICENSE`, `LICENSE-media.md`.

---

## Main video (16:9, 3840×2160)

**File:** `deliverables/nine_hundred_acres_3840x2160.mp4` (5:36.5; H.264 CRF 16, AAC 317 kb/s, 48 kHz). The same cut as
the 1080p release candidate v4 (`renders/m8/`), rendered at `--scale=2`. Upload the 4K file, even though the
brief asks for 1080p: YouTube gives 4K uploads a higher bitrate at every resolution, and the flat colour and fine type
in this video show it.

### Title

Recommended (72 characters):

```
Nine Hundred Acres (The Hum) — a folk protest song about AI data centers
```

Alternatives:
- `Nine Hundred Acres (The Hum) — a hippie protest song, explained by AI`
- `Can you hear it humming, brother? — Nine Hundred Acres (The Hum)`

### Description

```
AI-generated satire about real events.

A sincere 1970-style folk-rock protest song about AI data centers, illustrated as the slickest possible AI-made explainer: nine hundred acres of Iowa farmland, gas turbines in South Memphis, and a nuclear plant restarting to feed the machines. Verse by verse, the hippie aesthetic infects the explainer. Stay for the coda.

The two distorted passages are left in on purpose.

Every frame was written as code by Claude Code and rendered in Remotion. A human only picked takes, approved each stage and supplied one real screen recording. Each of those 23 actions is logged, along with every prompt, render and production step:
https://github.com/Derivative-Work/nine-hundred-acres

ChatGPT and Gemini audited every on-screen claim; Claude checked each flag against its source.

Energy used to make this video: unknown. Nobody publishes a meter.

CHAPTERS
0:00 Intro
0:16 Salix, Iowa
0:46 Chorus
1:22 South Memphis
1:51 Three Mile Island
2:23 The electric bill
2:57 Coda
3:12 Outro
4:00 What actually happened
5:16 Credits

WHAT ACTUALLY HAPPENED
(The fact cards after the song. Checked against each source on 2026-10-30.)
• 11 data centers sit within half a mile of an elementary school in Loudoun County, Virginia. As many as 264 diesel backup generators are near the school. (NBC News, Oct 28, 2026, analysis of state-issued permits)
• Virginia had permitted over 10,500 diesel backup generators for data centers by the end of 2025: 27 gigawatts in all. (Better Data Center Project, Mar 2026, from state air permits)
• In July 2026 the EPA proposed ending the federal minimum for public comment on "minor source" air permits, leaving it to each state. It is still a proposal. (EPA; Federal Register, Jul 7, 2026)
• In 2022, neighbors said noise from one Virginia data center regularly exceeded the county's 60 dB limit. Air conditioning was exempt then; the county has since tightened its rules. (AP, Sep 2022; Prince William County, 2023 and 2026)
• Salix, Iowa annexed about 900 acres of farmland. In August the council voted 3–2 against a moratorium. The county and three landowners are challenging the annexation in court. (Iowa Public Radio; KTIV)
• In Southaven, Mississippi, xAI's gas plant for a data center a mile away in Tennessee grew to 57 trailer-mounted turbines by May 2026, with no air permit. The state had ruled them exempt. (NAACP v. X.AI Corp., N.D. Miss., filings of Jun 12, 2026)
• When the NAACP sued, the federal government stepped in for the EPA and asked the court to dismiss the case. In October 2026 the judge refused. The case continues. (Same case, order of Oct 19, 2026)
• The government's filing says the lawsuit threatens "the power supply for Super Intelligence innovation that is essential to the Department of War's military operations." (United States' complaint in intervention, Oct 23, 2026)

SOURCES
NBC News: https://www.youtube.com/watch?v=-pjm8epal6o
Better Data Center Project: https://betterdatacenterproject.com/wp-content/uploads/2026/03/Diesel-Generators-at-Data-Centers-Status-Impacts-and-Protective-Practices.pdf
EPA: https://www.epa.gov/newsreleases/epa-proposes-streamline-state-and-local-permitting-process-minor-sources
Federal Register: https://www.federalregister.gov/documents/2026/07/07/2026-13667/minor-new-source-review-program-air-permitting-public-participation-requirements-for-state
AP via WSLS: https://www.wsls.com/business/2022/09/13/as-data-centers-proliferate-neighbors-knock-the-noise/
Prince William County: https://www.pwcva.gov/noise
Iowa Public Radio: https://www.iowapublicradio.org/ipr-news/2026-08-21/salix-data-center-moratorium-fails
KTIV: https://www.ktiv.com/2026/09/03/new-legal-move-made-stop-data-centers-google-sets-up-data-center-website/
NAACP v. X.AI Corp.: https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.51.0.pdf
https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.135.0.pdf
https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.136.0.pdf

The song's own claims and their sources: https://github.com/Derivative-Work/nine-hundred-acres/blob/main/docs/brief.md

CREDITS
Words: Claude, in conversation
Music: Suno V6 ("Field of Humming Things"), the only take
Audio restoration: the music-deslop post-filter (checkpoint M6f 10k), run without its fallback
Animation and edit: Claude Code (Opus 5.5), in Remotion
The Suno screen: the human's own recording
Emoji graphics by Twemoji (Twitter, Inc. and other contributors), CC BY 4.0
Icons: Lucide (ISC) · Map outlines: Natural Earth (public domain)
Type: Inter, JetBrains Mono, Shrikhand and Caveat (SIL OFL)

Video and assets: CC BY-NC-SA 4.0 · Code: MIT
Satire. Not affiliated with or endorsed by any company named here.

#AIgenerated #musicvideo #datacenters
```

Length: 4,845 of YouTube's 5,000 characters (counted 2026-10-31). Studio's counter is the final word; if it shows the
description over the limit, shorten the opening paragraph first, not the facts or their sources.

### Tags

Paste as one comma-separated line (under 500 characters):

```
Nine Hundred Acres, The Hum, AI data centers, data center protest song, folk rock, protest song, 1970s folk, AI music video, AI generated, AI satire, explainer animation, Salix Iowa, xAI Southaven, Three Mile Island, Crane Clean Energy Center, diesel generators, environmental impact of AI, electricity bills, Remotion, Claude Code, Claude, Suno
```

### Settings

| Setting | Value |
|---|---|
| Category | Music |
| Audience | Not made for kids. "Made for kids" would also turn off comments and the end screen. |
| Altered or synthetic content | **Yes.** The singing voice is AI-generated and sounds real. The animation isn't realistic, but the voice is, and disclosing matches the end card. |
| Language / caption language | English / English |
| Captions | Upload `deliverables/nine_hundred_acres.en.srt` as English subtitles (30 cues, built with the burned-in captions' own rule). The video also has burned-in captions; the SRT gives search text and lets viewers restyle them. |
| License | Standard YouTube License. YouTube's only Creative Commons option is CC BY, which would drop the NC-SA terms; the description states the licence instead. |
| Thumbnail | `deliverables/thumbnail.jpg` (1280×720): S38's crowd of "…OK, FINE." signs in front of the cooling towers (2:22, frame 4280), the brief's first choice. Never the Suno screen, which would spoil the reveal (brief). The alternative, `deliverables/thumbnail_alt_fullframe.jpg`, is the whole frame with the explainer chrome. |
| Chapters | From the description (first chapter at 0:00; each over 10 s). The song's chapters start at the first sung word of each section; "What actually happened" covers the post-filter log and the fact cards. |
| End screen | The end card, 5:16 to the end (20 s). Both pages of the end card keep their text in the top 65% of the frame (it ends at about y = 700 of 1080), so put the elements along the bottom: a video (best for viewer, or another video in the series) bottom left, Subscribe bottom right. |
| Comments | Open. |
| Visibility | Unlisted for a check pass, then public. |

---

## Vertical cut (9:16, 1080×1920)

**File:** `deliverables/nine_hundred_acres_vertical_1080x1920.mp4` (65.5 s; H.264 CRF 16, AAC). S12–S27: the first
chorus, the first failure span (the restore overlay errors and recovers) and the South Memphis verse. Reflowed to one
column, with burned-in captions in the top third. Captions: `deliverables/nine_hundred_acres_vertical.en.srt`
(13 cues, timed from the first frame).

Settings as the main video: Music; not made for kids; altered/synthetic content: yes; English captions from the
cut's SRT; Standard YouTube License. Related video: the main video. No chapters or end screen. A Short's custom
thumbnail can only be set in the mobile app's upload flow; otherwise choose a frame in the picker. The turbines at
"Thirty-five of 'em a-burning" (about 0:43) read best at phone size.

**Title:**
```
"The cloud ain't up in heaven, friend, it's a field of humming things" #Shorts
```

**Description:**
```
AI-generated satire about real events. A 1970-style folk protest song about AI data centers, explained by the slickest possible AI explainer. In 2025, 35 portable gas turbines ran in South Memphis without air permits (Oil & Gas Watch; Gas Outlook; SELC). The first chorus and second verse of Nine Hundred Acres (The Hum).

Full video, facts and sources: MAIN_VIDEO_URL
Production log, with every prompt and every human intervention: https://github.com/Derivative-Work/nine-hundred-acres
Animation and edit: Claude Code · Words: Claude
Video and assets CC BY-NC-SA 4.0. Satire; not affiliated with any company named.

#AIgenerated #datacenters #Shorts
```

**Tags:**
```
Nine Hundred Acres, The Hum, AI data centers, protest song, folk rock, AI music video, AI generated, AI satire, South Memphis, gas turbines, Remotion, Claude Code, shorts
```
