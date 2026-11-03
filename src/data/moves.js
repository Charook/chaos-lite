/**
 * moves.js
 * Centralized data definitions for standard action moves and specialized abilities.
 */

const MOVES = {
  act: {
    id: "act",
    name: "Act",
    category: "Standard",
    stat: "control",
    costs: { essence: 0, control: 0 },
    rewards: {},
    penalties: {},
    threatImpact: { advanceTrackOnFail: false },
    directives: {
      "Critical Success": (clue, crit) => `You succeed decisively. Present a favorable opportunity or advantage: ${crit || 'A clear path opens.'}`,
      "Strong Success": () => `You succeed smoothly without complication or cost.`,
      "Weak Success": () => `You succeed, but an immediate minor complication, delay, or cost arises.`,
      "Failure": () => `You fail at your attempt. A clear setback or immediate complication occurs.`,
      "Critical Failure": (clue, crit) => `You fail catastrophically. Introduce a major crisis or threat: ${crit || 'An immediate catastrophe strikes.'}`
    }
  },

  investigate: {
    id: "investigate",
    name: "Investigate",
    category: "Standard",
    stat: "control",
    costs: { essence: 0, control: 0 },
    rewards: {},
    penalties: {},
    threatImpact: { advanceTrackOnFail: false },
    directives: {
      "Critical Success": (clue, crit) => `You uncover vital information: ${clue || 'A major secret is exposed.'} Additionally, gain a distinct advantage: ${crit || 'An opportunity presents itself.'}`,
      "Strong Success": (clue) => `You uncover useful information: ${clue || 'A key detail is revealed.'}`,
      "Weak Success": (clue) => `You learn a piece of information, but it is vague, troubling, or comes at a narrative cost: ${clue || 'An unsettling detail comes to light.'}`,
      "Failure": () => `You fail to find meaningful information and uncover a troubling information or a narrative cost.`,
      "Critical Failure": (clue, crit) => `You uncover a hard, disturbing truth: ${crit || 'Hard truth.'}`
    }
  },

  compel: {
    id: "compel",
    name: "Compel",
    category: "Standard",
    stat: "control",
    costs: { essence: 0, control: 0 },
    rewards: {},
    penalties: {},
    threatImpact: { advanceTrackOnFail: false },
    directives: {
      "Critical Success": (clue, crit) => `They are fully convinced and comply enthusiastically, offering an unexpected concession: ${crit || 'They offer extra aid.'}`,
      "Strong Success": () => `They are convinced and comply with your demand or suggestion.`,
      "Weak Success": () => `They agree to comply, but demonstrate hesitance or mistrust, or ask something in return.`,
      "Failure": () => `They refuse to comply, causing tension to rise or their attitude toward you to harden.`,
      "Critical Failure": (clue, crit) => `They refuse hostilely, retaliate socially or physically, and trigger an immediate crisis: ${crit || 'They turn openly hostile.'}`
    }
  },

  shapeshift: {
    id: "shapeshift",
    name: "Shapeshift",
    category: "Ability",
    stat: "control",
    costs: { essence: 2, control: 0 },
    rewards: {
      "Critical Success": { essence: 1, control: 1 },
      "Strong Success": { essence: 1 }
    },
    penalties: {
      "Failure": { control: -1 },
      "Critical Failure": { control: -2 }
    },
    difficultyLabels: [
      { value: "2", label: "Twelve Hours: Very Easy (+2)" },
      { value: "1", label: "Four Hours: Easy (+1)" },
      { value: "0", label: "One Hour: Moderate (+0)" },
      { value: "-1", label: "Ten Minutes: Formidable (-1)" },
      { value: "-2", label: "One Minute: Hard (-2)" },
      { value: "-3", label: "Immediate: Very Hard (-3)" }
    ],
    directives: {
      "Critical Success": () => `You shapeshift into your new mask naturally and fluidly, drawing power and focus from the transition.`,
      "Strong Success": () => `You shapeshift into your new mask smoothly and seamlessly.`,
      "Weak Success": () => `You force the shapeshift into your new mask, but the transition is uncomfortable and strains your composure.`,
      "Failure": () => `You force the shapeshift into your new mask through agonizing effort. You complete the transformation, but your control is severely shaken.`,
      "Critical Failure": () => `The shapeshift into your new mask is torturous, harrowing, and visually disturbing, leaving your composure heavily eroded.`
    }
  }
};

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.MOVES = MOVES;
}