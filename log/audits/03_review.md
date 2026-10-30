# M8 review: each flag checked against its source

Claude checked each audit flag itself on 2026-10-30. Only a source Claude opened, or the NBC captions the human supplied, counts as evidence. The verdicts:
- **Holds:** the flag is right.
- **Partly:** the flag is partly right.
- **Rejected:** the flag is wrong, or doesn't apply.
- **New:** Claude found a problem that neither auditor raised.

The lyrics are part of the master and cannot change. Only the graphics, fact cards and end card can.

| # | Flag | Verdict | What Claude found (source opened) | Proposed resolution |
| --- | --- | --- | --- | --- |
| A1 | — | Keep | IPR 2026-06-17 and 2026-08-21: "about/roughly 900 acres"; KCRG 2026-10-15: "over 900 acres" | Keep "About 900 acres" |
| A2 | Newer: Google MOU (ChatGPT) | Holds, no change | KCRG 2026-10-15: MOU with Google passed 3–2; the mayor said plans are "still very much up in the air", and the land has not been sold | Keep "still proposed, not built" |
| A3 | "Reason given: none" is too absolute (ChatGPT) | Holds | IPR: the city cited confidential talks with prospective customers, jobs and growth. A reason was given; the end user was withheld | Headline S08 "Reason given: none" → "End user: confidential"; stat "reason given: —" → "end user: —". The lyric and the "Why?" tooltip stay |
| A4 | "permits filed: 0" is false; 35 is a 2025 count (ChatGPT) | Holds | SELC: 35 turbines in aerial photos on 2025-04-09; they were unpermitted; a permit for 15 was applied for in Jan 2025 and approved 2025-07-02 | Headline "35 turbines, no air permits" → "35 turbines, no air permits (2025)"; stat "permits filed: 0" → "permits granted: 0" |
| A5 | "EPA clarified" overstates (ChatGPT) | Partly | SELC (2026-01-15) says the revised rule "confirms" such turbines need permits; Mississippi regulators say the rule changes nothing for portable turbines. "Clarified" is SELC's reading, not settled law | Source line → "Jan 2026: EPA revised its turbine rule; SELC says it confirms these need permits" |
| A6 | Schoolhouse near the turbines unsupported (both) | Rejected | FOX13: the Memphis-Shelby County school board approved xAI donations to schools near both Colossus sites. The schoolhouse is a generic icon in a row of houses, not a map pin, and it illustrates the lyric | Keep |
| A7 | — | Keep | Contemporary reporting of the 1979 protests (ChatGPT; not reopened) | Keep |
| A8 | — | Keep | Enlit (ChatGPT; matches the brief) | Keep |
| A9 | Official name is "Christopher M. Crane" (ChatGPT); "built to feed the machines" reads as built for AI (Gemini) | Partly | Maryland Matters uses "Crane Clean Energy Center". The S36 headline "Built to feed the machines" does read as a claim about the 1974 build | Rename text stays. S36 headline → "Restarting to feed the machines" (the lyric stays) |
| A10 | "target", not done (ChatGPT) | No change | On screen it already reads "restart (planned)" and "on track for mid-2027" | Keep |
| A11 | $29B is capacity-market cost, not bills (ChatGPT) | Rejected | KUNC/NPR, verbatim: the monitor "estimates that data centers have cost their 67 million ratepayers about $29 billion … over roughly the past two years". The video says exactly that, marked "est." | Keep |
| A12 | "No public real-time measurement" too broad (ChatGPT) | Partly | gradually.ai: "no global meter"; its counter is an estimate | End card → "No public meter measures AI data centers' energy use in real time." |
| F1 | Video unopened (both) | **Verified (primary)** | NBC captions (human's download): "11 centers within half a mile of the school, and two more being built"; "as many as 264 [backup diesel generators] near the school, according to an NBC News analysis of state issued permits" | Keep. Option: add "as many as 264 backup diesel generators" (see F3) |
| F2 | Credit the real report (ChatGPT) | Holds, and **New** | Better Data Center Project, Mar 2026, p.1: "Over 10,500 generator units have been permitted for data centers in Virginia as of the end of 2025 … total capacity of 27 GW". It covers all of Virginia, not Northern Virginia, and counts permitted units. The Sierra Club page didn't load for either Claude or ChatGPT | → "Virginia had permitted over 10,500 diesel backup generators for data centers by the end of 2025: 27 gigawatts in all." Source: "Better Data Center Project, Mar 2026 (state air permits)" |
| F3 | 150 gal/h unsourced (ChatGPT) | Holds, and **New** | Prince William Times: the 150 gal/h figure appears only in a **reader comment**, not in the article. 10M gal/yr comes from a Virginia Mercury **commentary** (Jan 14, 2026) by a writer who "reviewed" one Amazon permit; the permit itself was not found | **Retire F3** (no primary source). Fold NBC's 264 generators into F1 |
| F4 | Overstates: states decide; still proposed (ChatGPT) | Holds | EPA release: it would "eliminate the minimum federal regulatory requirements for public participation" and leave states to decide; the EPA NSR page lists it as a proposed rule (signed Jul 1, published Jul 7, 91 FR 41591). "Which cover most data center generators" is not sourced anywhere Claude opened | → "In July 2026 the EPA proposed ending federal minimum public-comment rules for "minor source" air permits, leaving it to the states. It is still a proposal." Source: "EPA; Federal Register, Jul 7, 2026" |
| F5 | Exemption outdated (both) | Holds | Prince William County, 2023-02-28: the Board removed "the commercial HVAC exemption from the nighttime maximum permissible sound pressure levels" (one-year sunset). pwcva.gov/noise: new steady-tonal-noise enforcement, explicitly covering HVAC and backup generators, effective 2026-05-01 | → "In 2022, neighbors near one Virginia data center measured noise above the county's 60 dB limit. Air conditioning was exempt then; the county has since tightened its rules." Source: "AP via WSLS, 2022; Prince William County" |
| F6 | "about"; litigation detail (both) | Holds, and **New** | IPR 2026-08-21: "Woodbury County is also challenging Salix's annexation in court." KTIV 2026-09-03: three landowners also sued; the city moved to dismiss, and no ruling yet. KCRG 2026-10-15: no moratorium is in place | → "Salix, Iowa annexed about 900 acres of farmland. In August the council voted 3–2 against a moratorium. The annexation is being challenged in court." |
| F7 | 57 turbines are in Southaven, MS, not Memphis (ChatGPT) | Holds, **verified (primary)** | NAACP v. X.AI Corp., N.D. Miss. No. 3:26-cv-74, Doc 51 (filed 2026-06-12): "added 30 more gas turbines by May 15, bringing the total up to 57 turbines … still no permit". Doc 52 calls them trailer-mounted ("a flatbed trailer") | → "In Southaven, Mississippi, a court filing says a data center's gas plant grew to 57 turbines by May 2026, with no air permit." Source: "NAACP court filing, N.D. Miss., Jun 12, 2026" |
| C | "Stakeholders consulted: 3 of 4", "lawyers at door: 3" (Gemini) | Rejected | ChatGPT reads both as "clearly satirical". "Lawyers at the door" is the lyric itself, and neither label sits beside a real person or a document | Keep |
| A11 lyric | "cost folks out east … in two years" | Rejected | Matches NPR | Keep |

**F7 source line:** the case caption names the defendant, and the guardrail says never to name the Memphis company, so the card cites the filing without the caption. The full citation goes in this log only.

**Changes outside the video if these are approved:**
- The brief's Reference facts table (S22–S26 rows) and its F1–F7 table, Status column.
- The end card's fact list.
- `assets/LICENSES.md`: no change.

## Addendum, 2026-10-30: the Southaven case after June

Prompted by the human ("some version of that xAI finding actually seems *especially* important to point out in a video like this"), Claude read the rest of the docket. Source: N.D. Miss. No. 3:26-cv-74, RECAP. Saved in `reference/sources/naacp_v_xai_msnd/`.

- **Doc 52 (2026-06-12, the NAACP's brief):**
  - The turbines "would provide fast power to [the company's] Colossus 2 data center … in Shelby County, Tennessee, a mile away."
  - On 2025-07-29 the Mississippi Department of Environmental Quality (MDEQ) called them "exempt" because they are "'mobile' as each will remain affixed to a portable unit (i.e., a flatbed trailer) and … 'temporary'."
  - A PSD permit was issued 2026-03-11 for a *different* turbine fleet.
- **Docs 75 and 81 (June–July):** the State of Mississippi filed an amicus brief supporting the defendants.
- **Doc 112 (2026-08-21):** the hearing on the preliminary injunction was "CONTINUED UNTIL FURTHER NOTICE."
- **Doc 135 (2026-10-19, opinion and order):** "The United States, on behalf of the Administrator of the Environmental Protection Agency, moves to intervene as a plaintiff and dismiss this case. … the United States will be allowed to intervene but will not be allowed to dismiss this case." The court found the government's national-security concerns not relevant, and notes that "the Fifth Circuit denied the United States' motion to stay this litigation."
- **Doc 136 (2026-10-23, the United States' complaint for declaratory relief, a crossclaim against the NAACP):** "NAACP threatens American national, economic, and energy security by seeking to shut off the power supply for Super Intelligence innovation that is essential to the Department of War's military operations."
- **Doc 137 (2026-10-26):** a scheduling order. No ruling yet on the injunction or on the defendants' motion to dismiss.
