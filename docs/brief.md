# Nine Hundred Acres: Shot List and Production Brief

2026-10-29 · @Albert Armea

## Overview

"Nine Hundred Acres (The Hum)" is a sincere 1970-style folk-rock protest song about the environmental cost of AI data centers, illustrated as the slickest possible AI-made explainer animation. The joke is the clash: back-to-the-land harmonies over a sterile dark-mode slideshow, all of it produced by the machine the song protests.

- **Look:** the stereotypical agent-built explainer (dark navy, one gradient accent, rounded cards, emoji bullets, counters, self-drawing arrows, karaoke captions). Verse by verse, the hippie aesthetic infects it: gradients drift to tie-dye, emoji drift from servers to flowers. The bridge pushes it furthest; the coda strips it back to a bare terminal.
- **The two filter failures are features.** The deslop post-filter (this project's ACE-Step post-filter) distorts the audio at exactly two spots: the lead-in to "Down in South Memphis" and the coda. Both stay in, with artifact suppression off. Memphis is the setup (the distortion is the smog arriving; a restore overlay errors and recovers). The coda is the payoff (the overlay fails for good on the line that admits a machine sang it).
- **Build:** almost entirely code-rendered in Remotion by Claude Code, synced to the locked master. No video model is required.
- **Deliverables:** a 16:9 main video, a 9:16 vertical cut, captions, a thumbnail, and full logs.

** The song's origin is withheld until the coda.** Nothing on screen says the music is generated until the song admits it itself ("And the song you're hearing, brother, / Wasn't sung by any throat"). That line brings in the real Suno generation screen. The explainer look can be openly machine-made from the start; only the song's source is the reveal.

## Production rules, guardrails and logging

**AI-made by default.** Claude Code builds every frame. The human only picks takes, approves gates, and supplies the real assets listed under Inputs. Every human action goes in `log/human_interventions.md` with the time, the shot ID and what changed.

**Logging.** Log every render (shot ID, composition, props, commit hash) in `log/renders.md`, and every post-filter run (checkpoint, flags, detected artifact spans) in `log/postfilter.md`. The logs feed the end card and keep the "machine-made" claim honest.

**Content guardrails**

- No real company logos, wordmarks or brand colors used as identifiers. No recreation of the real Claude, Claude Code, ChatGPT or Suno interfaces: the chat window and terminal are generic.
- No recognizable real people. The Memphis company is never named in the song or its graphics; turbines and "generic suits" only. The fact cards after the song may name companies, since naming them is the cards' job (the human's decision in M8).
- No real protest-movement symbols such as the trademarked smiling-sun badge, and no recreations of famous festival footage, photographs or album covers.
- On-screen facts must match the Reference facts table exactly. Anything contested is labeled "est." or framed as a claim. The only number on screen for the video's own footprint is "???".
- Captions and the end card use plain type. Emoji appear only inside the explainer graphics, where they are part of the parody.

## Inputs, pipeline and timing map

**Inputs the human supplies**

- The locked Suno master (a one-shot, 48 kHz WAV) and the post-filtered version, rendered with artifact suppression off.
- A screen capture of the real Suno generation for this song, showing the style prompt, lyrics and take list (for the coda reveal, S45–S46).
- The post-filter run's detection output (fallback.json) and the music-deslop repo. S51 is rebuilt from them; the human chose this over a screen capture of the run.
- This doc, the earlier chats about the song, and the post-filter spec.

**Pipeline**

1. **Audio.** Use the post-filtered master for the whole video. Do not re-run or patch the two failure spans; they are part of the piece. Log their exact start and end times from the post-filter's own detection output (run in detect-only mode, so it reports spans without replacing them).
2. **Timing map.** Build `timing/map.json` from the locked master: section boundaries, every lyric line's start and end, the beat grid, and the two failure spans. Every shot below is cued by lyric, not time; the map resolves cues to frames.
3. **Graphics.** One Remotion project. One composition per section, sharing a theme module (see Visual system) so the hippie infection is a single `infection` value from 0 to 1 that every component reads.
4. **Review aids.** For every render, write a contact sheet of frames to `review/<shot>.jpg` so the agent can check its own stills and the human can review quickly.

**Layout**

```
nine-hundred-acres/
  audio/  timing/  assets/real/  remotion/
  renders/  review/  edit/  log/
```

## Visual system

The base style is a deliberately stereotypical agent-built explainer. Play it straight; the parody comes from playing it too well.

**Base style (infection = 0)**

- Background: dark navy, with a soft radial glow behind the focal card.
- One accent gradient, orange to pink. Secondary accent teal for success states, red for errors.
- Type: a clean geometric sans for everything, a monospace for terminals, code and counters.
- Cards: rounded corners, a 1 px border, soft glow, generous padding.
- Motion: every element enters with a short fade while sliding up a few pixels, on a spring ease. Lists stagger in on the beat. Arrows draw themselves. Counters tick with tabular figures.
- Furniture: emoji bullets, a sparkle on anything important, "Key insight" callouts, progress bars, toasts, pill badges, karaoke captions with the current word highlighted.

**The infection arc.** A single `infection` value drives a theme interpolation. Each shot sets its own value; the guide below is the target at the start of each section.

| Section | Infection | What changes |
| --- | --- | --- |
| Intro, Verse 1 | 0.0 | Pure base style |
| Chorus 1 | 0.15 | The gradient warms slightly; one flower emoji slips into a server grid |
| Verse 2 | 0.3 | Brown haze layer from the Memphis lead-in lingers at low opacity |
| Chorus 2 | 0.4 | Retired (no chorus 2); its gags move to verse 3 |
| Verse 3 | 0.5 | Gradients start to marble; the sans gets a groovy swash on headings; the peace sign morphs into a power button (S33a); tie-dye heat map in the room tiles (S36a) |
| Bridge | 0.5 → 0.7 | Peaks on the last line: a lava-lamp swirl starts building, then freezes when the needle lifts |
| Coda | to 0 | Everything strips back to a bare terminal on black |

**Running gags (in every section)**

- **The extension cord.** A single orange connector line runs through every scene, card to card. The final shot reveals where it is plugged in.
- **The last cornstalk.** One corn emoji survives in every scene, somewhere it shouldn't: in a server grid, in a code comment, in a chart legend.
- **The restore overlay.** A small progress card in the top-right corner, styled like a background task: "Restoring human warmth…". It appears only around the two failure spans.

## Assets and licenses

Every illustrated element is SVG drawn by Claude Code in the Remotion project. No image models, no stock photos, no system emoji. This keeps the video code-rendered end to end, and nothing can resemble a real photo or person.

| Element | Source | License and credit |
| --- | --- | --- |
| People (the 1979 crowd, the gray-haired crowd, the suits) | Hand-built SVG: faceless flat pictogram figures, hand-lettered signs | Original. Note in the end card |
| "Archival" look (S32, S38) | Code filters over the SVG: sepia, grain, gate weave, vignette | Original |
| `granddad.jpg` farmhouse | Hand-built SVG, rendered to look like a small photo card | Original |
| Emoji (corn, server, cloud, flowers, fireflies, crickets, sparkle) | Twemoji or Noto Emoji. Pick one set and use it everywhere | Twemoji: CC BY 4.0, credit required. Noto Emoji: Apache 2.0 |
| UI icons (turbines, doors, briefcases, toggles, houses, schoolhouse) | Lucide | ISC |
| Map outlines (US, Iowa, Tennessee) | Natural Earth | Public domain |
| Fonts | Open-licensed fonts only, such as Inter and JetBrains Mono, plus one open-licensed groovy display face for the infected headings | SIL OFL |
| Real screen captures (S45–S46, S51) | Supplied by the human | Their own recordings |

**Rules**

- Record every third-party file in `assets/LICENSES.md`: name, source URL, version, license, and the credit line if one is required.
- If an element can't be drawn convincingly in SVG, stop and ask before reaching for any other source. Log the request in `log/human_interventions.md`.
- No Apple, Google, Microsoft or Samsung system emoji images, even as references for redrawing.

## Lyrics

The master uses the first draft of the lyrics, and is the first generation of the song. Captions must match the master as sung: in M1, transcribe it and diff against the text below, and log any differences.

Suno skipped chorus 2, the planned guitar jam and the final chorus: verse 2 runs straight into verse 3, and the bridge into the coda. The band keeps playing under the coda (it is not a cappella), and a 37 s wordless outro follows the last line. The shot list follows the master.

```
[Intro – twelve-string, wordless harmonies]
Ooh… ooh-ooh…

[Verse 1]
Out in Salix, Iowa, where the corn grew to the sky,
They annexed nine hundred acres, and they never told us why.
Soon a building with no windows where my granddad turned the ground,
And the only crop it'll raise there is a low and endless sound.

[Chorus]
Can you hear it humming, brother?
Can you hear it in the corn?
It's the sound of something thinking
Since the morning it was born.
And it never sleeps, and it never stops,
And it's wired to everything.
Oh, the cloud ain't up in heaven, friend,
It's a field of humming things.

[Verse 2]
Down in South Memphis, sister, they rolled the turbines in,
Thirty-five of 'em a-burning, and nobody asked the wind.
No permit on the paperwork, no notice on the door,
Just a haze above the schoolyard, and the lawyers at the door.

[Verse 3 – one voice]
Back in seventy-nine we gathered, sang the reactors down.
Now they're waking Three Mile Island in a brand-new name and gown.
They call it Crane Clean Energy, and it's built to feed the machines,
And I'm standing here confused, man, 'cause it's the cleanest thing I've seen.

[Bridge – spoken over organ]
Got my electric bill today, man. Up again.
Fella on the radio says these places cost folks out east twenty-nine billion dollars in two years.
So I asked the machine about it.
It said that was a really great question.
Then it told me the numbers are uncertain…
and used a little more electricity telling me.

[Coda]
And the song you're hearing, brother,
Wasn't sung by any throat.
It was hummed out in a field somewhere
By the thing of which I wrote.

[Sustained chord. Server fan spins down.]
```

## Shot list: intro through Verse 2

Cues are lyric lines; the timing map resolves them to frames. **Source key:** **G** Remotion graphics, **S** real screen capture, **A** audio event.

### Opening and intro

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S01 | Before the music | Black. A cursor blinks; nothing else | G |
| S02 | First twelve-string strum | A generic terminal fades in around the cursor | G |
| S03 | Wordless harmonies | The terminal types `explain --topic "data centers" --style "visual explainer"`. A green check and an "Explainer ready" toast slide in. Nothing on screen says where the music comes from | G |
| S04 | End of intro | Gradient title card: NINE HUNDRED ACRES (THE HUM), subtitle "A Visual Explainer" with a sparkle. The orange extension-cord line draws itself out of frame right | G |

### Verse 1

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S05 | "Out in Salix, Iowa" | A map card zooms from the US to northwest Iowa and drops a pin labeled "Salix, IA" | G |
| S06 | "where the corn grew to the sky" | A grid of corn emoji fades up row by row and keeps growing past the top of the frame | G |
| S07 | "They annexed nine hundred acres" | A dashed boundary polygon expands across the grid. A counter in a pill badge ticks 0 → 900 acres | G |
| S08 | "and they never told us why" | A "Why?" tooltip pops up on the polygon, then is dismissed by an unseen click | G |
| S09 | "a building with no windows" | Row by row, corn emoji flip into server tiles. One cornstalk survives in the last row | G |
| S10 | "where my granddad turned the ground" | A small rounded photo card labeled `granddad.jpg` (an illustrated farmhouse, not a real photo) slides in, then gets a gray "archived" badge | G |
| S11 | "a low and endless sound" | An animated sine wave labeled "The Hum" runs across the bottom third and stays through the chorus | G |

### Chorus 1

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S12 | "Can you hear it humming, brother?" | Close on the sine wave; a frequency readout reads "Hum: always" | G |
| S13 | "Can you hear it in the corn?" | The hum ripples through the surviving corn emoji. Zoom in: the "crickets" between the rows are tiny spinning fans | G |
| S14 | "the sound of something thinking" | A grid of 1,000 small room tiles stagger in, each with a blinking status dot | G |
| S15 | "Since the morning it was born" | An "Uptime" counter starts running. A day/night slider sweeps to night; the tiles stay lit, and firefly emoji blink at exactly the status-dot rate | G |
| S16 | "And it never sleeps, and it never stops, / And it's wired to everything" | A checklist: ☐ Sleep ☐ Stop, neither checked. Then connector lines spider out from the grid to every card on screen, including the caption bar | G |
| S17 | "the cloud ain't up in heaven" | A flowchart: a cloud emoji at top; an arrow draws itself downward | G |
| S18 | "It's a field of humming things" | The arrow lands on the server grid from S09. A "Key insight" callout: "The cloud is not in the sky." | G |

### Lead-in to Verse 2 (first filter failure)

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S19 | Failure span 1 starts | The restore overlay appears top right: "Restoring human warmth… 41%". A brown haze wipes in from the left, synced to the distortion; cards jitter by a pixel or two | G, A |
| S20 | Mid-span | Red toast: "Artifact detected". The overlay stalls | G |
| S21 | Failure span 1 ends | Overlay reads "Retrying…", then a green check. The audio clears; the haze stays at low opacity | G |

### Verse 2

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S22 | "Down in South Memphis, sister" | Map card zooms to Memphis and drops a pin. No company name anywhere | G |
| S23 | "they rolled the turbines in" | Turbine icons stamp into a grid on the beat | G |
| S24 | "Thirty-five of 'em a-burning" | A counter ticks to 35; each icon trails a small gray plume | G |
| S25 | "nobody asked the wind" | A video-call sidebar lists participants. "Wind" is muted with a raised hand that is never called on | G |
| S26 | "No permit on the paperwork, no notice on the door" | Checklist: ☐ Permit ☐ Notice ☐ Asked the wind, all left empty. A permit-office card shows "Back in 5 minutes" with a cobweb | G |
| S27 | "a haze above the schoolyard, and the lawyers at the door" | The haze thickens over a row of building icons, one a schoolhouse, then settles to its lingering opacity. Three generic briefcase icons knock at a door card | G |

## Shot list: Chorus 2 through coda

### Chorus 2

Retired: the master has no chorus 2 (M1). S28–S31 are kept below for the record only. Their two infection gags move to verse 3: the peace sign to S33a, the tie-dye heat map to S36a.

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S28 | "Can you hear it humming, brother?" | Retired. As S12, but the sine wave has picked up a slight wobble, like a tape warble | G |
| S29 | "the sound of something thinking" | Retired (moved to S36a). As S14, but a thermal-camera sweep turns the status dots into a tie-dye heat map. Three tiles now show flower emoji | G |
| S30 | "And it never sleeps, and it never stops" | Retired. As S16; the checkbox outlines are hand-drawn and slightly crooked | G |
| S31 | "It's a field of humming things" | Retired (peace sign moved to S33a). As S18; the callout's gradient has a faint tie-dye swirl. A peace-sign banner behind it slowly morphs into a power button | G |

### Verse 3

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S32 | "Back in seventy-nine we gathered" | A sepia "archival" card: an illustrated crowd with generic hand-lettered NO NUKES signs. Film grain and a slight gate weave | G |
| S33 | "sang the reactors down" | A toggle labeled "Reactor" flips off. A horizontal timeline starts drawing; a node appears at 1979 | G |
| S33a | "sang the reactors down" | From chorus 2's S31: a peace-sign banner over the archival crowd slowly morphs into a power button, and that button becomes S33's Reactor toggle as it flips off | G |
| S34 | "Now they're waking Three Mile Island" | The timeline extends: 2019 "Shut down (economic)", 2027 "Restart (planned)". A status pill flips from Deprecated to Restoring | G |
| S35 | "in a brand-new name and gown" | A code-diff panel: red `- Three Mile Island Unit 1`, green `+ Crane Clean Energy Center`. A rename tag with a small bow tied on | G |
| S36 | "it's built to feed the machines" | The orange extension-cord line runs from the reactor card to the server grid; a power-flow animation pulses along it | G |
| S36a | "it's built to feed the machines" | From chorus 2's S29: as the power flow reaches the S09 server grid, a thermal-camera sweep turns its status dots into a tie-dye heat map. Three tiles now show flower emoji | G |
| S37 | "I'm standing here confused, man" | A slider labeled "Against ↔ For" ping-pongs and never settles. A "Thinking…" spinner appears beside it | G |
| S38 | "'cause it's the cleanest thing I've seen" | Back to the S32 crowd, now gray-haired. They flip their signs; the backs read "…OK, FINE." | G |

### Bridge

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S39 | "Got my electric bill today, man" | A bill card drops in and keeps unrolling downward like a scroll, out of frame | G |
| S40 | "twenty-nine billion dollars in two years" | A bar labeled "$29B (est.)" grows off the top of the chart; the axis rescales three times trying to fit it. Caption: "PJM ratepayers, ~2 years, per its market monitor" | G |
| S41 | "So I asked the machine about it" | A generic chat window. The user bubble types "why is my bill up?" | G |
| S42 | "a really great question" | The reply streams in token by token: "That's a really great question! ✨". An "Energy used" counter in the corner ticks with each token | G |
| S43 | "the numbers are uncertain" | The reply continues: "Estimates vary widely." Error bars on the S40 chart widen until they fill the frame | G |
| S44 | "used a little more electricity telling me" | The energy counter becomes an electric meter, then a spinning record on a turntable. The cards start to swirl like a lava lamp, building as if toward a solo. Then the needle lifts | G |

### Coda (second filter failure)

| ID | Cue | Picture | Source |
| --- | --- | --- | --- |
| S45 | "And the song you're hearing, brother" | As the needle lifts (a visual beat only: the band plays on under the coda), infection drops toward 0; cards fade out one per sung word, the last cornstalk last. In the gap they leave, the real Suno generation capture fades up inside a plain window: style prompt, lyrics, take list. First time the video shows where the song came from | G, S |
| S46 | "Wasn't sung by any throat" | Push in on the take list; the first generation, the one you are hearing, is highlighted | S, G |
| S47 | "It was hummed out in a field somewhere" | The capture window shrinks and drops into the server grid from S09, becoming one more tile | G |
| S48 | "By the thing of which I wrote" | Everything is gone except a bare terminal on black. The restore overlay returns: "Restoring human warmth… 88%" | G |
| S49 | Failure span 2 (after the last line: the 37.7 s wordless outro) | The overlay climbs to 97% and stalls. Spring animations stutter (drop to 6 fps); text renders as empty glyph boxes. The overlay then reads "Artifact suppression: OFF (by choice)" and does not recover | G, A |
| S50 | Sustained chord, fan spin-down | The terminal types `exit`. The orange extension cord, traced back across the frame, turns out to be plugged into the terminal itself. Last line: "Energy used: ???" | G, A |

## Transitions

Every transition lands on a beat or a lyric boundary from the timing map. Default inside a section is the house style: outgoing cards fade and slide up, incoming cards stagger in.

| From → To | Transition | Notes |
| --- | --- | --- |
| S01 → S02 | The terminal fades in around the cursor on the first strum | No hard cut; the cursor never moves |
| S04 → S05 | Title card shrinks into the map card | Zoom continues straight into Iowa |
| S08 → S09 | Grid flip, row by row | Each row flips on an eighth note |
| S11 → S12 | The sine wave scales up to fill frame | Carries the hum across the section line |
| S18 → S19 | Haze wipe from the left, starting exactly at failure span 1 | Sync the wipe's leading edge to the span's start frame |
| S21 → S22 | The haze settles; the map card pans east from Iowa to Memphis | Same map instance as S05, so the cut feels continuous |
| S27 → S32 | Haze dims to its lingering level, then the sepia bleed below. No chorus 2: verse 3 starts 1.8 s after verse 2 ends |  |
| S27 → S32 (cont.) | Sepia bleed: color drains from the frame | The archival card fades up under the grain |
| S38 → S39 | Signs flip, and the last sign becomes the bill card |  |
| S44 → S45 | The needle lifts; the swirl freezes mid-turn and drains of color | The build promises a jam that never comes. The audio has no gap (the band plays on), so the needle lift is a visual beat: land the freeze on a beat between the bridge's last word and the coda's first |
| S45 → S46 | Push in on the take list | This is the reveal; play it plain, no flourish |
| S47 → S48 | The new tile winks out, and the grid goes with it | Leaves the terminal alone on black |
| S48 → S49 | No transition; the frame stutters in place | Hold dropped frames for the whole span |
| S50 → S51 | Hard cut to the terminal (S51) | The fan sound bridges the cut |
| S51 → F1 → S52 | Fade to black, then plain cuts between fact cards | The tone shift is the transition; no motion graphics |

## Bookends, end card and vertical cut

| ID | Picture | Source |
| --- | --- | --- |
| S51 | The post-filter's terminal output for this song, rebuilt in code from the music-deslop repo's own log format and the run's real detected spans: the default run prints the two fallback spans, then the --no-fallback run the video plays. Hold long enough to read the two timestamps | G |
| S52 | End card (below), set in plain type on black | G |

The real Suno capture is not a bookend in this video; it appears in the coda (S45–S46), where the song admits its own origin.

**End card contents**

- Title, and "Words, music, animation and audio restoration by machines. Takes chosen and gates approved by a human."
- "The two distorted passages are left in on purpose."
- One line per fact used on screen, each with its source (Reference facts, below).
- "Energy used to make this video: unknown. Nobody publishes a meter."
- Asset credits from `assets/LICENSES.md`, including the emoji set's attribution if it requires one.

**Fact cards (F1–F7b)**

These play between S51 and the end card, and they are where the video turns serious. No jokes, no explainer styling, no emoji: plain white type on black, one fact per card, source line beneath, each held long enough to read (1.5 s plus four words a second, never under five seconds). Audio is room tone with the hum faintly underneath. Never depict children or name private individuals; companies may be named.

| ID | Card | Source | Status |
| --- | --- | --- | --- |
| F1 | 11 data centers sit within half a mile of an elementary school in Loudoun County, Virginia. As many as 264 diesel backup generators are near the school. | [NBC News, Oct 28, 2026](https://www.youtube.com/watch?v=-pjm8epal6o) (analysis of state-issued permits) | Ready: checked against the broadcast's captions |
| F2 | Virginia had permitted over 10,500 diesel backup generators for data centers by the end of 2025: 27 gigawatts in all. | [Better Data Center Project, Mar 2026](https://betterdatacenterproject.com/wp-content/uploads/2026/03/Diesel-Generators-at-Data-Centers-Status-Impacts-and-Protective-Practices.pdf), from state air permits | Ready |
| F3 | Retired in M8: the 150 gal/h figure came from a reader comment, and the 10M gal/yr permit was not found | — | Retired |
| F4 | In July 2026 the EPA proposed ending the federal minimum for public comment on "minor source" air permits, leaving it to each state. It is still a proposal. | [EPA](https://www.epa.gov/newsreleases/epa-proposes-streamline-state-and-local-permitting-process-minor-sources); [Federal Register, Jul 7, 2026](https://www.federalregister.gov/documents/2026/07/07/2026-13667/minor-new-source-review-program-air-permitting-public-participation-requirements-for-state) | Ready: still proposed per EPA's NSR page, Oct 30 |
| F5 | In 2022, neighbors said noise from one Virginia data center regularly exceeded the county's 60 dB limit. Air conditioning was exempt then; the county has since tightened its rules. | [AP, Sep 2022](https://www.wsls.com/business/2022/09/13/as-data-centers-proliferate-neighbors-knock-the-noise/); Prince William County, [2023](https://www.pwcva.gov/news/prince-william-board-county-supervisors-votes-initiate-amendments-county-code-regarding-data) and [2026](https://www.pwcva.gov/noise) | Ready |
| F6 | Salix, Iowa annexed about 900 acres of farmland. In August the council voted 3–2 against a moratorium. The county and three landowners are challenging the annexation in court. | [Iowa Public Radio](https://www.iowapublicradio.org/ipr-news/2026-08-21/salix-data-center-moratorium-fails); [KTIV](https://www.ktiv.com/2026/09/03/new-legal-move-made-stop-data-centers-google-sets-up-data-center-website/) | Ready |
| F7 | In Southaven, Mississippi, xAI's gas plant for a data center a mile away in Tennessee grew to 57 trailer-mounted turbines by May 2026, with no air permit. The state had ruled them exempt. | NAACP v. X.AI Corp., N.D. Miss. No. 3:26-cv-74, [Docs 51–52](https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.51.0.pdf), Jun 12, 2026 | Ready: primary filing |
| F7a | When the NAACP sued, the federal government stepped in for the EPA and asked the court to dismiss the case. In October 2026 the judge refused. The case continues. | Same case, [Doc 135](https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.135.0.pdf), order of Oct 19, 2026 | Ready: primary filing |
| F7b | The government's filing says the lawsuit threatens "the power supply for Super Intelligence innovation that is essential to the Department of War's military operations." | Same case, [Doc 136](https://storage.courtlistener.com/recap/gov.uscourts.msnd.52261/gov.uscourts.msnd.52261.136.0.pdf), United States' complaint in intervention, Oct 23, 2026 | Ready: primary filing |

Do not reference the threats that postponed a Salix council meeting.

**Vertical cut (9:16).** S12–S27: the first chorus, the first failure and Verse 2. Reflow cards to a single column; captions sit in the top third. Fallback if it runs long: S19–S27.

**Reference facts.** Every on-screen fact must match this table.

| Shots | On screen | Source |
| --- | --- | --- |
| S05–S09 | Salix, Iowa annexed about 900 acres of farmland; MidAmerican Energy confirmed it is considering the site for a data center, and the city cited confidential talks with the end user ("End user: confidential"). Still proposed, not built | [Iowa Public Radio](https://www.iowapublicradio.org/ipr-news/2026-06-17/potential-data-center-sparks-moratorium-push-in-northwest-iowa) |
| S22–S26 | In 2025, 35 portable gas turbines ran without air permits (a permit for 15 was granted in July 2025); in Jan 2026 the EPA revised its turbine rule, which SELC says confirms such turbines need permits | [Oil & Gas Watch](https://news.oilandgaswatch.org/template/brief/elon-musks-xai-plans-massive-power-plant-south-of-memphis-for-supercomputer), [Gas Outlook](https://gasoutlook.com/analysis/xai-data-centre-emits-plumes-of-pollution-new-video-shows/), [SELC](https://www.selc.org/news/inside-memphis-fight-against-xai/) |
| S34–S35 | TMI Unit 1 renamed Crane Clean Energy Center under a Microsoft power deal; restart on track for mid-2027 | [Maryland Matters](https://marylandmatters.org/2026/07/30/repub/concern-persists-as-former-three-mile-island-nuclear-plant-progresses-toward-2027-restart/) |
| S35 | Unit 1 was shut down in 2019 for economic reasons | [Enlit](https://www.enlit.world/library/three-mile-island-is-reopening-to-help-power-microsoft-data-centres) |
| S40 | Data centers cost PJM's 67 million ratepayers about $29B over roughly two years (market monitor estimate) | [NPR via KUNC](https://www.kunc.org/npr-news/2026-10-01/ai-data-centers-how-much-are-ratepayers-on-the-hook-for) |
| S50, S52 | No public meter measures AI data centers' energy use in real time | [gradually.ai](https://www.gradually.ai/en/ai-data-center-consumption/) |

M8 re-checks each row against its source before release; anything that has changed since this doc is updated on screen and logged.

**M8 result (2026-10-30).** Audited by ChatGPT (browsing) and Gemini (no browsing; advisory only), then every flag checked against its source by Claude; see `log/audits/03_review.md`. Changes: the rows above and the fact-card table; S08's headline now reads "End user: confidential", S24's adds "(2025)", S26's stat reads "permits granted: 0", and S36's headline and title read "Restarting to feed the machines" (the lyric is unchanged).

## Milestones, review gates and acceptance

Each milestone ends at a gate. Claude Code stops there until the human approves.

| # | Milestone | Gate (human) |
| --- | --- | --- |
| M1 | Transcribe the master, diff against the Lyrics section, log the two failure spans from the post-filter's detection output | Confirm lyrics and span times |
| M2 | Build the timing map; attach frame ranges to every shot ID | Check the map by ear |
| M3 | Theme module with the `infection` interpolation; a style board showing each section's target value | Approve the look at 0, 0.4 and 0.7 |
| M4 | Animatic of every shot at low resolution, cut to the track | Approve framing and timing |
| M5 | Final renders, section by section, with contact sheets | Approve each section |
| M6 | Failure spans and reveal: S19–S21 and S44–S50 checked frame by frame against the audio | Approve sync and the reveal |
| M7 | Closing capture (S51), end card, captions, vertical cut, thumbnail | Approve the closing and end card |
| M8 | Fact check of every on-screen claim, run by another lab's model against the Reference facts sources | Resolve every flag before release |

**Deliverables**

- Main video: 16:9, 1080p, 30 fps, with the post-filtered master
- Vertical cut: 9:16, S12–S27
- Burned-in captions and a separate SRT
- Thumbnail: the S38 "…OK, FINE." signs, or the S49 overlay. Never the Suno screen, which would spoil the reveal
- The Remotion project, all logs and every intermediate render

**Done when**

- Every shot ID from S01 to S52 is in the edit, in order, or its omission is logged and approved.
- Captions sit within two frames of the timing map.
- Both failure spans are audible and untouched, and their overlays line up with them to the frame.
- Nothing on screen breaks the content guardrails.
- Every on-screen fact matches the Reference facts table.
- Every human action appears in `log/human_interventions.md`.
- Every third-party asset in the edit is listed in `assets/LICENSES.md`, and every required credit is on the end card.
- Every fact card F1–F7b is verified against a primary source in M8, or cut, and its Status column reads "Ready."
