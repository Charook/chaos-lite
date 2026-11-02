/**
 * directives.js
 * Translates mechanics and oracle rolls into second-person narrative 
 * directives for AI Dungeon prompt injection.
 */

/**
 * Builds a second-person action roll directive for AI Dungeon.
 * @param {string} moveType - 'act', 'investigate', or 'compel'
 * @param {string} outcomeTier - 'Critical Success', 'Strong Success', 'Weak Success', 'Failure', or 'Critical Failure'
 * @param {string|null} clueText - Clue vector string (used primary in investigate moves)
 * @param {string|null} critVectorText - Opportunity vector (for Crit Success) or Complication vector (for Crit Fail)
 * @returns {string} Clean, second-person instruction text
 */
function buildMoveDirective(moveType, outcomeTier, clueText = null, critVectorText = null) {
  const move = (moveType || 'act').toLowerCase();
  
  // --- ACT MOVE ---
  if (move === 'act') {
    switch (outcomeTier) {
      case 'Critical Success':
        return `You succeed decisively. Present a favorable opportunity or advantage: ${critVectorText || 'A clear path opens.'}`;
      case 'Strong Success':
        return `You succeed smoothly without complication or cost.`;
      case 'Weak Success':
        return `You succeed, but an immediate minor complication, delay, or cost arises.`;
      case 'Failure':
        return `You fail at your attempt. A clear setback or immediate complication occurs.`;
      case 'Critical Failure':
        return `You fail catastrophically. Introduce a major crisis or threat: ${critVectorText || 'An immediate catastrophe strikes.'}`;
      default:
        return `You attempt the action.`;
    }
  }

  // --- INVESTIGATE MOVE ---
  if (move === 'investigate') {
    switch (outcomeTier) {
      case 'Critical Success':
        return `You uncover vital information: ${clueText || 'A major secret is exposed.'} Additionally, gain a distinct advantage: ${critVectorText || 'An opportunity presents itself.'}`;
      case 'Strong Success':
        return `You uncover useful information: ${clueText || 'A key detail is revealed.'}`;
      case 'Weak Success':
        return `You learn a piece of information, but it is vague, troubling, or comes at a narrative cost: ${clueText || 'An unsettling detail comes to light.'}`;
      case 'Failure':
        return `You fail to find meaningful information and uncover a troubling information or a narrative cost.`;
      case 'Critical Failure':
        return `You uncover a hard, disturbing truth: ${critVectorText || 'Hard truth.'}`;
      default:
        return `You investigate the area.`;
    }
  }

  // --- COMPEL MOVE ---
  if (move === 'compel') {
    switch (outcomeTier) {
      case 'Critical Success':
        return `They are fully convinced and comply enthusiastically, offering an unexpected concession: ${critVectorText || 'They offer extra aid.'}`;
      case 'Strong Success':
        return `They are convinced and comply with your demand or suggestion.`;
      case 'Weak Success':
        return `They agree to comply, but demonstrate hesitance or mistrust, or ask something in return.`;
      case 'Failure':
        return `They refuse to comply, causing tension to rise or their attitude toward you to harden.`;
      case 'Critical Failure':
        return `They refuse hostilely, retaliate socially or physically, and trigger an immediate crisis: ${critVectorText || 'They turn openly hostile.'}`;
      default:
        return `You attempt to convince them.`;
    }
  }

  return `Execute the action and resolve the outcome.`;
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