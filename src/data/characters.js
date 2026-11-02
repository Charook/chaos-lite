/**
 *  * characters.js
  * NPC keys and archetype building blocks for Blackwood Crossing (Chaos-Lite Engine).
   */

// 1. Primary Named Cast (Matches AI Dungeon Story Card keys strictly)
const NAMED_CHARACTERS = [
  "Governor Alistair Vance",
  "Lady Eleanor Vance",
  "Father Ignatius",
  "Sister Catherine",
  "Mother Superior Teresa",
  "Maren the Herbalist",
  "Madame Genevieve Vane",
  "Gideon 'Grit' Cross",
  "Captain Thomas Thorne",
  "Julian 'The Lark'",
  "Captain Barnaby Finch",
  "Martha Higgins"
];

// 2. Archetype Descriptors (Roll 2 per generated archetype)
const ARCHETYPE_DESCRIPTORS = [
  "Suspicious", "Exhausted", "Pious", "Corrupt",
  "Desperate", "Gullible", "Fierce", "Secretive",
  "Inquisitive", "Fearful", "Ambitious", "Drunk",
  "Arrogant", "Melancholy", "Devout", "Cunning",
  "Naïve", "Resentful", "Observant", "Defiant"
];

// 3. Archetype Roles (Setting-specific & Generic Transients)
const ARCHETYPE_ROLES = [
  // Setting Specific
  "Garrison Guard", "Customs Inspector", "Novice Nun",
  "Acolyte Monk", "Loom Worker", "Dye House Hand",
  "Dockhand", "Carriage Driver", "Tavern Servant",
  "Ferry Deckhand", "Local Herbal Apprentice", "Scullery Maid",

  // Generic & Transients
  "Passing Traveler", "Visiting Merchant", "Stranded Pilgrim",
  "Drifting Laborer", "Visiting Scholar", "Out-of-Town Courier"
];

// 4. Broad Human Motivations (Universal psychological drives)
const ARCHETYPE_MOTIVATIONS = [
  "Greed",
  "Duty",
  "Fear of Exposure",
  "Compassion",
  "Guilt",
  "Ambition",
  "Self-Preservation",
  "Vengeance",
  "Loneliness",
  "Financial Debt",
  "Protecting a Loved One",
  "Need for Absolution"
];

// Global attachment for browser standard execution
if (typeof window !== 'undefined') {
  window.NAMED_CHARACTERS = NAMED_CHARACTERS;
  window.ARCHETYPE_DESCRIPTORS = ARCHETYPE_DESCRIPTORS;
  window.ARCHETYPE_ROLES = ARCHETYPE_ROLES;
  window.ARCHETYPE_MOTIVATIONS = ARCHETYPE_MOTIVATIONS;
}