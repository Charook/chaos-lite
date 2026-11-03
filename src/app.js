/**
 * app.js - Meter Section Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load saved state or default
  if (typeof loadState === 'function') {
    loadState();
  }

  // Bind meter button listeners
  document.getElementById('btn-control-minus').addEventListener('click', () => {
    updateControl(-1);
    renderMeters();
  });

  document.getElementById('btn-control-plus').addEventListener('click', () => {
    updateControl(1);
    renderMeters();
  });

  document.getElementById('btn-essence-minus').addEventListener('click', () => {
    updateEssence(-1);
    renderMeters();
  });

  document.getElementById('btn-essence-plus').addEventListener('click', () => {
    updateEssence(1);
    renderMeters();
  });

  // Output history control bindings
  document.getElementById('btn-copy-directive').addEventListener('click', copyDirective);
  document.getElementById('btn-undo-directive').addEventListener('click', undoDirective);
  document.getElementById('btn-redo-directive').addEventListener('click', redoDirective);
  document.getElementById('btn-clear-directive').addEventListener('click', clearDirective);

  // Bind roll button and experience select listener
  document.getElementById('btn-roll-move').addEventListener('click', handleRollMove);
  document.getElementById('exp-select').addEventListener('change', handleExperienceSelectChange);

  // Re-render difficulty dropdown when selected move changes
  document.getElementById('move-select').addEventListener('change', updateDifficultyDropdown);

  // Bind UI cost tracking to roll button label
  document.getElementById('move-select').addEventListener('change', updateRollButtonText);
  document.getElementById('exp-select').addEventListener('change', updateRollButtonText);

  // Initial render
  renderMeters();

  // Populate experiences dropdown
  populateExperienceDropdown();

  // Populate moves dropdown dynamically from MOVES object
  populateMoveDropdown();
  updateDifficultyDropdown();

  // Initial button text sync
  updateRollButtonText();

});

function renderMeters() {
  const controlEl = document.getElementById('control-val');
  const essenceEl = document.getElementById('essence-val');

  if (controlEl && window.gameState && window.gameState.player) {
    controlEl.textContent = window.gameState.player.control;
  }
  if (essenceEl && window.gameState && window.gameState.player) {
    essenceEl.textContent = window.gameState.player.essence;
  }
}

function updateDirectiveOutput(text) {
  if (window.gameState) {
    window.gameState.lastDirective = text;
    if (typeof saveState === 'function') saveState();
  }
  const textarea = document.getElementById('directive-output');
  if (textarea) textarea.value = text;
}

function copyDirective() {
  const textarea = document.getElementById('directive-output');
  if (!textarea || !textarea.value) return;

  textarea.select();
  textarea.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(textarea.value).then(() => {
    const feedback = document.getElementById('copy-feedback');
    if (feedback) {
      feedback.style.display = 'inline';
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 1500);
    }
  });
}

// History stack state
let directiveHistory = [];
let historyIndex = -1;

/**
 * Appends a new directive to output and pushes to history stack.
 * If mode is 'append' (default), it appends with a space; if 'replace', replaces whole text.
 */
function pushDirectiveOutput(newInstructionText, mode = 'append') {
  const currentText = (historyIndex >= 0 && historyIndex < directiveHistory.length)
    ? directiveHistory[historyIndex]
    : '';

  let updatedText = '';
  if (mode === 'append' && currentText.trim().length > 0) {
    updatedText = `${currentText} ${newInstructionText.trim()}`;
  } else {
    updatedText = newInstructionText.trim();
  }

  // Truncate any 'redo' future history if we push after undoing
  if (historyIndex < directiveHistory.length - 1) {
    directiveHistory = directiveHistory.slice(0, historyIndex + 1);
  }

  directiveHistory.push(updatedText);
  historyIndex = directiveHistory.length - 1;

  applyHistoryToUI();
}

function undoDirective() {
  if (historyIndex > 0) {
    historyIndex--;
    applyHistoryToUI();
  } else if (historyIndex === 0) {
    historyIndex = -1;
    applyHistoryToUI();
  }
}

function redoDirective() {
  if (historyIndex < directiveHistory.length - 1) {
    historyIndex++;
    applyHistoryToUI();
  }
}

function clearDirective() {
  if (historyIndex >= 0 && directiveHistory[historyIndex] !== '') {
    pushDirectiveOutput('', 'replace');
  }
}

function applyHistoryToUI() {
  const activeText = (historyIndex >= 0 && historyIndex < directiveHistory.length)
    ? directiveHistory[historyIndex]
    : '';

  const textarea = document.getElementById('directive-output');
  if (textarea) textarea.value = activeText;

  // Sync with global state
  if (window.gameState) {
    window.gameState.lastDirective = activeText;
    if (typeof saveState === 'function') saveState();
  }

  // Update button enabled/disabled states
  const undoBtn = document.getElementById('btn-undo-directive');
  const redoBtn = document.getElementById('btn-redo-directive');

  if (undoBtn) undoBtn.disabled = (historyIndex < 0);
  if (redoBtn) redoBtn.disabled = (historyIndex >= directiveHistory.length - 1);
}

function copyDirective() {
  const textarea = document.getElementById('directive-output');
  if (!textarea || !textarea.value) return;

  // Focus and select range for mobile touch focus
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, 99999);

  const showFeedback = () => {
    const feedback = document.getElementById('copy-feedback');
    if (feedback) {
      feedback.style.display = 'inline';
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 1500);
    }
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textarea.value)
      .then(showFeedback)
      .catch(() => {
        // Fallback for mobile browser security blocks
        document.execCommand('copy');
        showFeedback();
      });
  } else {
    document.execCommand('copy');
    showFeedback();
  }
}

/**
 * Populates the Experience dropdown from window.gameState.player.experiences,
 * with a fallback 'Ad-Hoc / Generic (+2)' for quick testing/general use.
 */
function populateExperienceDropdown() {
  const expSelect = document.getElementById('exp-select');
  if (!expSelect) return;

  expSelect.innerHTML = `
    <option value="none">-- None (+0) --</option>
    <option value="generic">Ad-Hoc / Generic (+2)</option>
  `;

  if (window.gameState && window.gameState.player && Array.isArray(window.gameState.player.experiences)) {
    window.gameState.player.experiences.forEach((exp, idx) => {
      const opt = document.createElement('option');
      const name = typeof exp === 'object' ? exp.name : exp;
      const bonus = typeof exp === 'object' ? (exp.value || 2) : 2;

      opt.value = idx.toString();
      opt.textContent = `${name} (+${bonus})`;
      expSelect.appendChild(opt);
    });
  }
}

/**
 * Shows/hides the '-1 Essence' cost badge
 */
function handleExperienceSelectChange() {
  const expSelect = document.getElementById('exp-select');
  const costNote = document.getElementById('exp-cost-note');
  
  if (expSelect && costNote) {
    if (expSelect.value !== 'none') {
      costNote.style.display = 'inline';
    } else {
      costNote.style.display = 'none';
    }
  }
}

/**
 * Populates the Move selection dropdown dynamically from window.MOVES
 */
function populateMoveDropdown() {
  const moveSelect = document.getElementById('move-select');
  if (!moveSelect || !window.MOVES) return;

  moveSelect.innerHTML = '';
  Object.values(window.MOVES).forEach(move => {
    const opt = document.createElement('option');
    opt.value = move.id;

    // Build cost text badge if move has upfront costs
    const costs = [];
    if (move.costs.essence > 0) costs.push(`${move.costs.essence} Ess`);
    if (move.costs.control > 0) costs.push(`${move.costs.control} Ctrl`);
    const costText = costs.length > 0 ? ` [Cost: ${costs.join(', ')}]` : '';

    opt.textContent = `${move.name} (${move.category})${costText}`;
    moveSelect.appendChild(opt);
  });
}

const STANDARD_DIFFICULTIES = [
  { value: "2", label: "Very Easy (+2)" },
  { value: "1", label: "Easy (+1)" },
  { value: "0", label: "Moderate (+0)" },
  { value: "-1", label: "Formidable (-1)" },
  { value: "-2", label: "Hard (-2)" },
  { value: "-3", label: "Very Hard (-3)" }
];

/**
 * Updates difficulty select options based on custom move labels or standard defaults.
 */
function updateDifficultyDropdown() {
  const moveSelect = document.getElementById('move-select');
  const diffSelect = document.getElementById('diff-select');
  if (!moveSelect || !diffSelect || !window.MOVES) return;

  const moveDef = window.MOVES[moveSelect.value];
  const options = (moveDef && moveDef.difficultyLabels) ? moveDef.difficultyLabels : STANDARD_DIFFICULTIES;

  const currentVal = diffSelect.value;
  diffSelect.innerHTML = '';

  options.forEach(opt => {
    const el = document.createElement('option');
    el.value = opt.value;
    el.textContent = opt.label;
    if (opt.value === currentVal || (opt.value === "0" && !options.some(o => o.value === currentVal))) {
      el.selected = true;
    }
    diffSelect.appendChild(el);
  });
}

/**
 * Dynamic button label updating based on combined move + experience costs
 */
function updateRollButtonText() {
  const moveSelect = document.getElementById('move-select');
  const expSelect = document.getElementById('exp-select');
  const rollBtn = document.getElementById('btn-roll-move');
  if (!moveSelect || !expSelect || !rollBtn || !window.MOVES) return;

  const moveDef = window.MOVES[moveSelect.value];
  const baseEssenceCost = moveDef?.costs?.essence || 0;
  const expEssenceCost = (expSelect.value !== 'none') ? 1 : 0;
  const totalEssenceCost = baseEssenceCost + expEssenceCost;

  if (totalEssenceCost > 0) {
    rollBtn.textContent = `Roll Move (-${totalEssenceCost} Essence)`;
  } else {
    rollBtn.textContent = 'Roll Move';
  }
}

/**
 * Handles Action Move calculation, upfront costs, dice dominance,
 * post-roll rewards/penalties, net stat tallying, and output generation.
 */
function handleRollMove() {
  const moveType = document.getElementById('move-select').value;
  const diffMod = parseInt(document.getElementById('diff-select').value, 10) || 0;
  const expSelectVal = document.getElementById('exp-select').value;

  const moveDef = window.MOVES ? window.MOVES[moveType] : null;

  // --- 1. CALCULATE UPFRONT COSTS ---
  let expMod = 0;
  let expEssenceCost = 0;

  if (expSelectVal !== 'none') {
    expEssenceCost = 1;
    if (expSelectVal === 'generic') {
      expMod = 2;
    } else if (window.gameState) {
      const expIdx = parseInt(expSelectVal, 10);
      const expItem = window.gameState.player.experiences[expIdx];
      expMod = typeof expItem === 'object' ? (expItem.value || 2) : 2;
    }
  }

  const baseEssenceCost = moveDef?.costs?.essence || 0;
  const baseControlCost = moveDef?.costs?.control || 0;
  const totalUpfrontEssence = baseEssenceCost + expEssenceCost;

  // Validate player resources
  if (window.gameState.player.essence < totalUpfrontEssence) {
    alert(`Not enough Essence! Need ${totalUpfrontEssence} Essence.`);
    return;
  }
  if (window.gameState.player.control < baseControlCost) {
    alert(`Not enough Control! Need ${baseControlCost} Control.`);
    return;
  }

  // Net changes tracking
  let netEssence = -totalUpfrontEssence;
  let netControl = -baseControlCost;

  // Deduct upfront costs
  if (totalUpfrontEssence > 0) updateEssence(-totalUpfrontEssence);
  if (baseControlCost > 0) updateControl(-baseControlCost);

  // --- 2. ENGINE ROLL ---
  const roll = rollAction(window.gameState.player.control, diffMod, expMod);

  // --- 3. APPLY DICE DOMINANCE SHIFTS ---
  if (roll.controlChange !== 0) {
    updateControl(roll.controlChange);
    netControl += roll.controlChange;
  }
  if (roll.essenceChange !== 0) {
    updateEssence(roll.essenceChange);
    netEssence += roll.essenceChange;
  }

  // --- 4. APPLY MOVE SPECIFIC REWARDS & PENALTIES ---
  let outcomeModifierText = '';

  if (moveDef) {
    const reward = moveDef.rewards?.[roll.outcome];
    if (reward) {
      if (reward.control) {
        updateControl(reward.control);
        netControl += reward.control;
      }
      if (reward.essence) {
        updateEssence(reward.essence);
        netEssence += reward.essence;
      }

      const parts = [];
      if (reward.essence) parts.push(`${reward.essence > 0 ? '+' : ''}${reward.essence} Essence`);
      if (reward.control) parts.push(`${reward.control > 0 ? '+' : ''}${reward.control} Control`);
      if (parts.length > 0) outcomeModifierText = ` <span style="color: #a3be8c; font-weight: bold;">(${parts.join(', ')})</span>`;
    }

    const penalty = moveDef.penalties?.[roll.outcome];
    if (penalty) {
      if (penalty.control) {
        updateControl(penalty.control);
        netControl += penalty.control;
      }
      if (penalty.essence) {
        updateEssence(penalty.essence);
        netEssence += penalty.essence;
      }

      const parts = [];
      if (penalty.essence) parts.push(`${penalty.essence > 0 ? '+' : ''}${penalty.essence} Essence`);
      if (penalty.control) parts.push(`${penalty.control > 0 ? '+' : ''}${penalty.control} Control`);
      if (parts.length > 0) outcomeModifierText = ` <span style="color: #bf616a; font-weight: bold;">(${parts.join(', ')})</span>`;
    }
  }

  // --- 5. RENDER UPDATED METERS ---
  if (typeof renderMeters === 'function') renderMeters();

  // --- 6. GATHER VECTORS ---
  let clueText = null;
  let critVectorText = null;

  if (moveType === 'investigate' && roll.outcome.includes('Success')) {
    clueText = typeof generateClueVector === 'function' ? generateClueVector() : null;
  }
  if (roll.outcome === 'Critical Success') {
    critVectorText = typeof generateOpportunityVector === 'function' ? generateOpportunityVector() : null;
  } else if (roll.outcome === 'Critical Failure') {
    critVectorText = typeof generateComplicationVector === 'function' ? generateComplicationVector() : null;
  }

  // --- 7. BUILD & PUSH DIRECTIVE ---
  const directive = buildMoveDirective(moveType, roll.outcome, clueText, critVectorText);
  pushDirectiveOutput(directive, 'append');

  // --- 8. UI READOUT ---
  const readout = document.getElementById('roll-results');
  
  const fmtStat = (val) => (val > 0 ? `+${val}` : `${val}`);
  const essenceStr = netEssence !== 0 ? ` | Essence ${fmtStat(netEssence)}` : '';
  const controlStr = netControl !== 0 ? ` | Control ${fmtStat(netControl)}` : '';

  readout.innerHTML = `<strong>${roll.outcome}</strong> (Action: ${roll.actionScore} vs Challenge: ${roll.c1}, ${roll.c2})${outcomeModifierText}<br>Dominance: <em>${roll.dominance}</em>${essenceStr}${controlStr}`;
}