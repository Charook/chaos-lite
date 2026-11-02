/**
 * vectors.js
 * Narrative vectors (Clues, Revelations, Complications, and Opportunities)
 * for the Chaos-Lite investigative engine.
 */

// 1. Expanded Clues & Revelations (Primary Driver for Investigation)
const CLUE_VECTORS = [
  // --- CONNECTIONS & NETWORK ---
  "Reveals a hidden alliance or secret meeting between two unexpected people",
  "Exposes a shadow handler or benefactor operating from behind the scenes",
  "Uncovers a shared past or forgotten relationship between key figures",
  "Points directly toward a primary suspect's hidden secondary location",

  // --- EVIDENCE & DECEPTION ---
  "Uncovers a physical ledger, coded letter, or altered public record",
  "Exposes a recent lie, fabricated alibi, or deliberately planted cover-up",
  "Reveals a hidden signet, symbol, or mark linking to a broader faction",
  "Highlights a forged document or tampered piece of official evidence",

  // --- SECRETS & VULNERABILITIES ---
  "Exposes a personal vice, secret debt, or deep vulnerability to exploit",
  "Uncovers a suppressed trauma or past crime haunting a key figure",
  "Reveals a hidden motive driven by greed, fear, or a desire for absolution",
  "Uncovers a secret entry, hidden vault key, or physical bypass code",

  // --- ATMOSPHERIC & SUPERNATURAL TRACKS ---
  "Shows physical signs of recent panic, struggle, or hurried destruction",
  "Uncovers physical residue of an unusual substance, reagent, or magic",
  "Reveals a active holy ward, active curse, or supernatural anomaly",
  "Exposes a lingering memory trace or sensory echo of a past event"
];

// 2. Complications & Hazards (Negative Outcome / Pressure Vectors)
const COMPLICATION_VECTORS = [
  "A crucial physical asset, tool, or clue item is damaged or rendered inaccessible",
  "A key relationship, trust, or delicate boundary is severely strained",
  "An unexpected physical obstacle or lockdown blocks your immediate path",
  "A dangerous secret or personal vulnerability is accidentally exposed",
  "A strict time constraint or immediate threat escalates in the area",
  "An authority or hostile party unexpectedly demands a steep price or favor",
  "A hidden environmental danger, trap, or active ward triggers nearby",
  "An unwanted observer or eavesdropper locks onto your position"
];

// 3. Opportunities & Advantages (Positive Outcome Vectors)
const OPPORTUNITY_VECTORS = [
  "An NPC unexpectedly lets down their guard or lets slip vital gossip",
  "A temporary hidden path, unguarded door, or shortcut opens up",
  "You gain crucial leverage or negotiating power over a key figure",
  "An immediate threat or suspicious guard is temporarily delayed or distracted",
  "An unexpected local ally or informant steps forward to offer assistance",
  "You recover a useful item, key, or resource from the immediate scene"
];

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.CLUE_VECTORS = CLUE_VECTORS;
  window.COMPLICATION_VECTORS = COMPLICATION_VECTORS;
  window.OPPORTUNITY_VECTORS = OPPORTUNITY_VECTORS;
}
