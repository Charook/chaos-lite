/**
 * generators.js
 * Core oracle rolling logic, polyhedral dice math, and action roll resolution 
 * for Blackwood Crossing (Chaos-Lite Engine).
 */

// --- BASIC MATH & DICE HELPERS ---

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

function rollDice(sides) {
  return getRandomInt(1, sides);
}

// --- ACTION ROLL ENGINE ---

/**
 * Executes a 1d6 + Control + Modifiers vs 2d12 challenge roll.
 * Handles outcome tiers, doubles (crits), and dominance checks.
 */
function rollAction(controlValue, difficultyMod = 0, experienceMod = 0) {
  const d6 = rollDice(6);
  const actionScore = d6 + controlValue + difficultyMod + experienceMod;

  const c1 = rollDice(12);
  const c2 = rollDice(12);
  const isDoubles = (c1 === c2);
  const highestChallenge = Math.max(c1, c2);

  // Dominance Check (Default based on highest challenge die)
  // If c1 > c2, Essence dominant; if c2 >= c1, Chaos dominant.
  let dominance = (c1 > c2) ? "Essence" : "Chaos";

  let outcome = "";
  let controlChange = 0;
  let essenceChange = 0;

  const beatC1 = actionScore > c1;
  const beatC2 = actionScore > c2;

  if (beatC1 && beatC2) {
    if (isDoubles) {
      outcome = "Critical Success";
      dominance = "Essence";
    } else {
      outcome = "Strong Success";
    }
  } else if (beatC1 || beatC2) {
    outcome = "Weak Success";
  } else {
    if (isDoubles) {
      outcome = "Critical Failure";
      dominance = "Chaos";
    } else {
      outcome = "Failure";
    }
  }

  // If Chaos is dominant on a normal roll, signal a -1 Control shift
  if (dominance === "Chaos") {
    controlChange = -1;
  } else if (dominance === "Essence") {
    essenceChange = 1;
  }

  return {
    actionScore,
    d6,
    c1,
    c2,
    outcome,
    dominance,
    controlChange,
    essenceChange
  };
}

// --- ORACLE GENERATORS ---

/**
 * Generates a micro-location (Primary or Dynamic Theme+Domain).
 * @param {string} macroKey - Hub key (e.g., 'docks', 'parish') or null/'random' for a random hub.
 * @param {number} namedWeight - Percentage chance (0-100) to pick a Primary location over dynamic.
 */
function generateLocation(macroKey = null, namedWeight = 60) {
  if (typeof MACRO_LOCATIONS === 'undefined') return "Unknown Location";

  const macroKeys = Object.keys(MACRO_LOCATIONS);
  
  // Pick random macro if not specified or invalid
  if (!macroKey || macroKey === 'random' || !MACRO_LOCATIONS[macroKey]) {
    macroKey = getRandomElement(macroKeys);
  }

  const hub = MACRO_LOCATIONS[macroKey];
  const isNamed = getRandomInt(1, 100) <= namedWeight;

  if (isNamed && hub.primary && hub.primary.length > 0) {
    return {
      macro: hub.name,
      type: "Primary",
      text: getRandomElement(hub.primary)
    };
  } else {
    const theme = getRandomElement(hub.themes) || "Shadowed";
    const domain = getRandomElement(hub.domain) || "Passageway";
    return {
      macro: hub.name,
      type: "Dynamic",
      text: `${theme} ${domain}`
    };
  }
}

/**
 * Generates a character (Named NPC or Dynamic Archetype).
 * @param {number} namedWeight - Percentage chance (0-100) to pick a Named character.
 */
function generateCharacter(namedWeight = 60) {
  const isNamed = getRandomInt(1, 100) <= namedWeight;

  if (isNamed && typeof NAMED_CHARACTERS !== 'undefined' && NAMED_CHARACTERS.length > 0) {
    return {
      type: "Named",
      text: getRandomElement(NAMED_CHARACTERS)
    };
  } else {
    const desc1 = (typeof ARCHETYPE_DESCRIPTORS !== 'undefined') ? getRandomElement(ARCHETYPE_DESCRIPTORS) : "Mysterious";
    const desc2 = (typeof ARCHETYPE_DESCRIPTORS !== 'undefined') ? getRandomElement(ARCHETYPE_DESCRIPTORS) : "Guarded";
    const role = (typeof ARCHETYPE_ROLES !== 'undefined') ? getRandomElement(ARCHETYPE_ROLES) : "Traveler";
    const motivation = (typeof ARCHETYPE_MOTIVATIONS !== 'undefined') ? getRandomElement(ARCHETYPE_MOTIVATIONS) : "Survival";

    return {
      type: "Dynamic",
      text: `${desc1}, ${desc2} ${role} (Motivated by ${motivation})`
    };
  }
}

/**
 * Generates an Action/Theme word pair.
 */
function generateActionTheme() {
  const action = (typeof ACTION_WORDS !== 'undefined') ? getRandomElement(ACTION_WORDS) : "Observe";
  const theme = (typeof THEME_WORDS !== 'undefined') ? getRandomElement(THEME_WORDS) : "Secret";
  return `${action} + ${theme}`;
}

/**
 * Master vector generator.
 * @param {string} type - 'clue', 'opportunity', or 'complication'
 */
function generateVector(type = 'clue') {
  if (type === 'opportunity' && typeof OPPORTUNITY_VECTORS !== 'undefined') {
    return getRandomElement(OPPORTUNITY_VECTORS);
  } else if (type === 'complication' && typeof COMPLICATION_VECTORS !== 'undefined') {
    return getRandomElement(COMPLICATION_VECTORS);
  } else if (typeof CLUE_VECTORS !== 'undefined') {
    return getRandomElement(CLUE_VECTORS);
  }
  return "A mystery reveals itself.";
}

// Wrapper shortcuts
function generateClueVector() { return generateVector('clue'); }
function generateOpportunityVector() { return generateVector('opportunity'); }
function generateComplicationVector() { return generateVector('complication'); }

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.getRandomInt = getRandomInt;
  window.getRandomElement = getRandomElement;
  window.rollDice = rollDice;
  window.rollAction = rollAction;
  window.generateLocation = generateLocation;
  window.generateCharacter = generateCharacter;
  window.generateActionTheme = generateActionTheme;
  window.generateVector = generateVector;
  window.generateClueVector = generateClueVector;
  window.generateOpportunityVector = generateOpportunityVector;
  window.generateComplicationVector = generateComplicationVector;
}
