/**
 * tables.js
 * Action and Theme oracle tables for Blackwood Crossing (Chaos-Lite Engine).
 * Inspired by Ironsworn action/theme tables for narrative prompts.
 */

// 1. Action Oracle (Verbs & Dynamic Motions)
const ACTION_WORDS = [
  "Abandon", "Acquire", "Advance", "Alter", "Analyze", "Avenge", 
  "Avoid", "Betray", "Bind", "Breach", "Break", "Capture", 
  "Challenge", "Change", "Cling", "Conceal", "Confront", "Consume", 
  "Control", "Corrupt", "Create", "Defend", "Defy", "Demand", 
  "Depart", "Destroy", "Discover", "Disrupt", "Distract", "Divide", 
  "Evade", "Expose", "Gather", "Guard", "Hide", "Hold", 
  "Imitate", "Imprison", "Inspect", "Interrupt", "Investigate", "Isolate", 
  "Leave", "Manipulate", "Mourn", "Observe", "Offer", "Oppose", 
  "Overcome", "Permit", "Protect", "Pursue", "Question", "Refuse", 
  "Reject", "Release", "Relinquish", "Resist", "Restore", "Reveal", 
  "Risk", "Ruin", "Search", "Seize", "Silence", "Summon", 
  "Surrender", "Threaten", "Transform", "Uncover", "Undermine", "Weaken"
];

// 2. Theme Oracle (Nouns & Core Focus Areas)
const THEME_WORDS = [
  "Authority", "Bargain", "Bloodline", "Bond", "Boundary", "Burden", 
  "Corruption", "Covenant", "Danger", "Debt", "Decay", "Deception", 
  "Desire", "Destiny", "Discovery", "Duty", "Enmity", "Evidence", 
  "Faction", "Fear", "Greed", "Grief", "Guilt", "Hearsay", 
  "Heritage", "Honor", "Illusion", "Innocence", "Knowledge", "Legacy", 
  "Leverage", "Lie", "Loyalty", "Malice", "Memory", "Mercy", 
  "Method", "Obsession", "Organ", "Passage", "Passion", "Peril", 
  "Plea", "Poison", "Power", "Price", "Pride", "Prize", 
  "Rivalry", "Rumor", "Sacrifice", "Sanctity", "Secret", "Shelter", 
  "Status", "Stranger", "Superstition", "Suspicion", "Symbol", "Threat", 
  "Treachery", "Truth", "Vengeance", "Vow", "Vulnerability", "Ward"
];

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.ACTION_WORDS = ACTION_WORDS;
  window.THEME_WORDS = THEME_WORDS;
}
