/**
 * directives.js
 * Translates mechanics and oracle rolls into second-person narrative 
 * directives for AI Dungeon prompt injection.
 */

/**
 * Builds a second-person action roll directive.
 * @param {string} moveType - Key from MOVES dictionary ('act', 'investigate', 'compel', etc.)
 * @param {string} outcomeTier - 'Critical Success', 'Strong Success', 'Weak Success', 'Failure', or 'Critical Failure'
 * @param {string|null} clueText - Clue vector string
 * @param {string|null} critVectorText - Opportunity or Complication vector string
 * @returns {string} Clean, second-person instruction text
 */
function buildMoveDirective(moveType, outcomeTier, clueText = null, critVectorText = null) {
  const key = (moveType || 'act').toLowerCase();
  const moveDef = (window.MOVES && window.MOVES[key]) ? window.MOVES[key] : null;

  if (moveDef && moveDef.directives && moveDef.directives[outcomeTier]) {
    const directiveHandler = moveDef.directives[outcomeTier];
    if (typeof directiveHandler === 'function') {
      return directiveHandler(clueText, critVectorText);
    }
    return directiveHandler;
  }

  return `Execute the ${key} move and resolve the outcome.`;
}

/**
 * Builds a lead directive to steer narrative flow toward a location, character, or both.
 * @param {string|null} locationText - Micro-location string or null
 * @param {string|null} characterText - Character string or null
 * @returns {string}
 */
function buildLeadDirective(locationText = null, characterText = null) {
  if (locationText && characterText) {
    return `Direct the narrative toward ${characterText}, who can currently be found at or connected to ${locationText}.`;
  } else if (locationText) {
    return `Direct the narrative toward a potential lead at ${locationText}.`;
  } else if (characterText) {
    return `Direct the narrative toward a lead involving ${characterText}.`;
  }
  return `Direct the narrative toward an upcoming lead.`;
}

/**
 * Builds a standalone vector directive.
 * @param {string} vectorText - The vector string
 * @param {string} type - 'clue', 'complication', or 'opportunity'
 * @returns {string}
 */
function buildVectorDirective(vectorText, type = 'clue') {
  if (type === 'complication') {
    return `Introduce an immediate complication or threat: ${vectorText}.`;
  } else if (type === 'opportunity') {
    return `Present a favorable opening or opportunity: ${vectorText}.`;
  }
  return `Direct your attention toward a discovery: ${vectorText}.`;
}

/**
 * Builds an action/theme oracle directive framed as thematic inspiration.
 * @param {string} actionThemeText - e.g. "Observe + Secret"
 * @returns {string}
 */
function buildOracleDirective(actionThemeText) {
  return `Incorporate the underlying thematic elements of ${actionThemeText} into the scene's focus or NPC behavior.`;
}

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.buildMoveDirective = buildMoveDirective;
  window.buildLeadDirective = buildLeadDirective;
  window.buildVectorDirective = buildVectorDirective;
  window.buildOracleDirective = buildOracleDirective;
}