// The explainer's running commentary, per shot: the chapter it belongs to, the headline that types in when the shot
// starts, the agent's status line ("what it's building now"), and the source line for any on-screen fact. Every fact
// here must match the brief's Reference facts table; anything else is a label, not a claim.

export type Beat = { headline: string; step: string; source?: string };

export const CHAPTERS: { id: string; num: string; title: string; first: string }[] = [
  { id: "land", num: "01", title: "The Land", first: "S05" },
  { id: "hum", num: "02", title: "The Hum", first: "S12" },
  { id: "air", num: "03", title: "The Air", first: "S19" },
  { id: "power", num: "04", title: "The Power", first: "S32" },
  { id: "bill", num: "05", title: "The Bill", first: "S39" },
];

export const BEATS: Record<string, Beat> = {
  S04: { headline: "A Visual Explainer", step: "rendering title card" },
  S05: { headline: "Salix, Iowa", step: "geocoding Salix, IA", source: "Iowa Public Radio" },
  S06: { headline: "Farmland, as far as the eye can see", step: "planting corn grid" },
  S07: { headline: "About 900 acres, annexed", step: "measuring annexation", source: "Iowa Public Radio" },
  S08: { headline: "Reason given: none", step: "looking for a reason" },
  S09: { headline: "Proposed: a data center", step: "converting corn to compute", source: "Iowa Public Radio · still proposed, not built" },
  S10: { headline: "Family land, archived", step: "archiving granddad.jpg" },
  S11: { headline: "New crop: a hum", step: "synthesizing hum" },
  S12: { headline: "The hum is always on", step: "measuring hum" },
  S13: { headline: "Wildlife update", step: "replacing crickets" },
  S14: { headline: "1,000 rooms, all thinking", step: "allocating rooms" },
  S15: { headline: "Uptime: since birth", step: "disabling sleep" },
  S16: { headline: "Connected to everything", step: "wiring everything" },
  S17: { headline: "So where is the cloud?", step: "locating the cloud" },
  S18: { headline: "Key insight", step: "drafting key insight" },
  S19: { headline: "Restoring human warmth", step: "restoring human warmth" },
  S20: { headline: "Restoring human warmth", step: "restoring human warmth" },
  S21: { headline: "Restoring human warmth", step: "retrying" },
  S22: { headline: "South Memphis, Tennessee", step: "geocoding South Memphis" },
  S23: { headline: "Portable gas turbines", step: "rolling in turbines", source: "Oil & Gas Watch · Gas Outlook" },
  S24: { headline: "35 turbines, no air permits", step: "counting turbines", source: "Oil & Gas Watch · Gas Outlook" },
  S25: { headline: "Stakeholders consulted: 3 of 4", step: "scheduling call" },
  S26: { headline: "Permits: pending", step: "filing paperwork", source: "In Jan 2026 the EPA clarified such turbines need permits (Gas Outlook)" },
  S27: { headline: "Air quality: hazy", step: "forecasting air quality" },
  S32: { headline: "1979", step: "loading archive" },
  S33: { headline: "Reactors: switched off", step: "toggling reactor" },
  S33a: { headline: "Reactors: switched off", step: "toggling reactor" },
  S34: { headline: "Three Mile Island Unit 1: waking up", step: "reading timeline", source: "Enlit · Maryland Matters" },
  S35: { headline: "Renamed: Crane Clean Energy Center", step: "applying rename", source: "Maryland Matters" },
  S36: { headline: "Built to feed the machines", step: "routing power", source: "restart on track for mid-2027 (Maryland Matters)" },
  S36a: { headline: "Built to feed the machines", step: "running thermal scan" },
  S37: { headline: "Sentiment: undecided", step: "computing sentiment" },
  S38: { headline: "Sentiment: updated", step: "updating sentiment" },
  S39: { headline: "Your electric bill", step: "itemizing bill" },
  S40: { headline: "$29B over ~2 years (est.)", step: "rescaling axis", source: "PJM market monitor estimate, via NPR (KUNC)" },
  S41: { headline: "Asking the machine", step: "opening chat" },
  S42: { headline: "Answer quality: 5 stars", step: "generating answer" },
  S43: { headline: "Uncertainty: high", step: "widening error bars" },
  S44: { headline: "Energy used: some", step: "spinning up" },
};
