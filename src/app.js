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

  // Oracle & Generator Bindings
  document.getElementById('btn-oracle-action-theme').addEventListener('click', handleActionThemeOracle);
  document.getElementById('btn-generate-lead').addEventListener('click', handleLeadGenerator);
  document.getElementById('btn-vector-clue').addEventListener('click', () => handleVectorGenerator('clue'));
  document.getElementById('btn-vector-opportunity').addEventListener('click', () => handleVectorGenerator('opportunity'));
  document.getElementById('btn-vector-complication').addEventListener('click', () => handleVectorGenerator('complication'));

  // Track creation & render bindings
  document.getElementById('btn-create-track').addEventListener('click', handleCreateTrack);
  renderTracks();

  // System section bindings
  document.getElementById('btn-export-state').addEventListener('click', handleExportState);
  document.getElementById('btn-import-trigger').addEventListener('click', () => {
    document.getElementById('input-import-file').click();
  });
  document.getElementById('input-import-file').addEventListener('change', handleImportState);
  document.getElementById('btn-reset-state').addEventListener('click', handleResetState);

  // Experience section bindings
  document.getElementById('btn-add-exp').addEventListener('click', handleAddExperience);
  renderExperiences();

  // Refresh all UI sections
  renderMeters();
  renderTracks();
  if (typeof renderExperiences === 'function') renderExperiences();
  if (typeof populateExperienceDropdown === 'function') populateExperienceDropdown();
  if (typeof applyHistoryToUI === 'function') applyHistoryToUI();

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
 * Populates the Action Moves dropdown with sorted experiences (+2 each).
 */
function populateExperienceDropdown() {
  const expSelect = document.getElementById('exp-select');
  if (!expSelect) return;

  const currentVal = expSelect.value;

  expSelect.innerHTML = `
    <option value="none">-- None (+0) --</option>
    <option value="generic">Ad-Hoc / Generic (+2)</option>
  `;

  if (window.gameState && window.gameState.player && Array.isArray(window.gameState.player.experiences)) {
    const sortedExps = [...window.gameState.player.experiences].sort((a, b) => {
      const nameA = (typeof a === 'object' ? a.name : a).toLowerCase();
      const nameB = (typeof b === 'object' ? b.name : b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    sortedExps.forEach(exp => {
      const expName = typeof exp === 'object' ? exp.name : exp;
      const opt = document.createElement('option');
      opt.value = expName;
      opt.textContent = `${expName} (+2)`;
      if (expName === currentVal) opt.selected = true;
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
    expMod = 2;
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

/**
 * Rolls Action/Theme oracle and pushes directive to Output stack.
 */
function handleActionThemeOracle() {
  // Fix: calling generateActionTheme() matching generators.js
  const oracleFunc = window.generateActionTheme || window.getRandomActionTheme;
  if (typeof oracleFunc !== 'function' || typeof buildOracleDirective !== 'function') return;

  const oraclePair = oracleFunc();
  const directive = buildOracleDirective(oraclePair);
  pushDirectiveOutput(directive, 'append');
}

/**
 * Generates a targeted or random Lead directive for characters/locations.
 */
function handleLeadGenerator() {
  const targetType = document.getElementById('lead-target-select').value;
  let locText = null;
  let charText = null;

  let rollType = targetType;
  if (rollType === 'random') {
    rollType = Math.random() < 0.5 ? 'character' : 'location';
  }

  // Extract the string '.text' property from returned location/character objects
  if (rollType === 'location' && typeof generateLocation === 'function') {
    const locResult = generateLocation();
    locText = typeof locResult === 'object' ? locResult.text : locResult;
  }
  
  if (rollType === 'character' && typeof generateCharacter === 'function') {
    const charResult = generateCharacter();
    charText = typeof charResult === 'object' ? charResult.text : charResult;
  }

  if (typeof buildLeadDirective === 'function') {
    const directive = buildLeadDirective(locText, charText);
    pushDirectiveOutput(directive, 'append');
  }
}

/**
 * Generates a Clue, Opportunity, or Complication vector directive.
 * @param {'clue'|'opportunity'|'complication'} type 
 */
function handleVectorGenerator(type) {
  let vectorText = '';

  if (type === 'clue' && typeof generateClueVector === 'function') {
    vectorText = generateClueVector();
  } else if (type === 'opportunity' && typeof generateOpportunityVector === 'function') {
    vectorText = generateOpportunityVector();
  } else if (type === 'complication' && typeof generateComplicationVector === 'function') {
    vectorText = generateComplicationVector();
  }

  if (vectorText && typeof buildVectorDirective === 'function') {
    const directive = buildVectorDirective(vectorText, type);
    pushDirectiveOutput(directive, 'append');
  }
}

/**
 * Reads form inputs and creates a new track in gameState.
 */
function handleCreateTrack() {
  const nameInput = document.getElementById('track-name-input');
  const typeSelect = document.getElementById('track-type-select');
  const sizeSelect = document.getElementById('track-size-select');

  if (!nameInput || !nameInput.value.trim()) {
    alert('Please enter a track name.');
    return;
  }

  const name = nameInput.value.trim();
  const type = typeSelect ? typeSelect.value : 'objective';
  const size = sizeSelect ? parseInt(sizeSelect.value, 10) : 6;

  if (typeof createTrack === 'function') {
    createTrack(name, size, type);
  }

  nameInput.value = '';
  renderTracks();
}

// State tracker for delete confirmation timeout
let pendingDeleteTrackId = null;
let deleteTimeoutTimer = null;

/**
 * Renders all tracks from gameState.tracks into #tracks-list.
 */
function renderTracks() {
  const tracksList = document.getElementById('tracks-list');
  if (!tracksList || !window.gameState) return;

  tracksList.innerHTML = '';

  if (!Array.isArray(window.gameState.tracks) || window.gameState.tracks.length === 0) {
    tracksList.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding: 4px 0 12px 0;">No active tracks. Add one below!</div>`;
    return;
  }

  window.gameState.tracks.forEach(track => {
    const trackEl = document.createElement('div');
    trackEl.className = `track-item ${track.type || 'objective'}`;

    // Header with title and control buttons
    const headerEl = document.createElement('div');
    headerEl.className = 'track-header';

    const typeLabel = (track.type || 'objective').toUpperCase();
    const isConfirming = (pendingDeleteTrackId === track.id);
    const deleteBtnText = isConfirming ? '?' : '×';
    const deleteBtnClass = `track-btn btn-delete${isConfirming ? ' confirming' : ''}`;

    headerEl.innerHTML = `
      <div class="track-title-wrap">
        <span class="track-type-badge">${typeLabel}</span>
        <span class="track-name">${track.name} (${track.current}/${track.size})</span>
      </div>
      <div class="track-controls">
        <button class="track-btn" type="button" onclick="handleReduceTrack('${track.id}')">-</button>
        <button class="track-btn" type="button" onclick="handleAdvanceTrack('${track.id}')">+</button>
        <button class="${deleteBtnClass}" type="button" onclick="handleDeleteTrack('${track.id}')">${deleteBtnText}</button>
      </div>
    `;

    // Segment boxes container
    const boxesEl = document.createElement('div');
    boxesEl.className = 'track-boxes';

    for (let i = 0; i < track.size; i++) {
      const box = document.createElement('div');
      box.className = `segment-box ${i < track.current ? 'filled' : ''}`;
      boxesEl.appendChild(box);
    }

    trackEl.appendChild(headerEl);
    trackEl.appendChild(boxesEl);
    tracksList.appendChild(trackEl);
  });
}

/**
 * Safely removes a track by requiring a second tap within 2 seconds.
 */
function handleDeleteTrack(id) {
  if (pendingDeleteTrackId === id) {
    // Second tap: execute delete
    clearTimeout(deleteTimeoutTimer);
    pendingDeleteTrackId = null;
    if (typeof removeTrack === 'function') {
      removeTrack(id);
    }
    renderTracks();
  } else {
    // First tap: trigger "Confirm?" state
    clearTimeout(deleteTimeoutTimer);
    pendingDeleteTrackId = id;
    renderTracks();

    // Reset back to normal after 2 seconds if not confirmed
    deleteTimeoutTimer = setTimeout(() => {
      pendingDeleteTrackId = null;
      renderTracks();
    }, 2000);
  }
}

/**
 * Advances a track by 1 segment.
 */
function handleAdvanceTrack(id) {
  if (typeof advanceTrack === 'function') {
    advanceTrack(id, 1);
  }
  renderTracks();
}

/**
 * Decreases a track by 1 segment.
 */
function handleReduceTrack(id) {
  if (window.gameState && Array.isArray(window.gameState.tracks)) {
    const track = window.gameState.tracks.find(t => t.id === id);
    if (track && track.current > 0) {
      track.current -= 1;
      track.isComplete = (track.current >= track.size);
      if (typeof saveState === 'function') saveState();
    }
  }
  renderTracks();
}

/**
 * Exports current gameState to a downloaded JSON file.
 */
function handleExportState() {
  if (!window.gameState) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.gameState, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `blackwood_state_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Handles importing and validating a JSON state file.
 */
function handleImportState(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Basic validation check
      if (!importedData.player || !Array.isArray(importedData.tracks)) {
        alert("Invalid state file format.");
        return;
      }

      // Mutate window.gameState in-place
      Object.assign(window.gameState, importedData);
      if (typeof saveState === 'function') saveState();

      // Refresh all UI sections
      renderMeters();
      renderTracks();
      if (typeof renderExperiences === 'function') renderExperiences();
      if (typeof populateExperienceDropdown === 'function') populateExperienceDropdown();
      if (typeof applyHistoryToUI === 'function') applyHistoryToUI();

      alert("Game state imported successfully!");
    } catch (err) {
      alert("Error reading state JSON file: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

// State tracking for session reset confirmation
let isConfirmingReset = false;
let resetTimer = null;

/**
 * Safely resets session state with a two-step confirmation.
 */
function handleResetState() {
  const resetBtn = document.getElementById('btn-reset-state');
  if (!resetBtn) return;

  if (isConfirmingReset) {
    clearTimeout(resetTimer);
    isConfirmingReset = false;
    resetBtn.textContent = 'Reset Session';
    resetBtn.style.background = '';
    
    if (typeof resetState === 'function') {
      resetState();
      renderMeters();
      renderTracks();
      if (typeof renderExperiences === 'function') renderExperiences();
      if (typeof populateExperienceDropdown === 'function') populateExperienceDropdown();
      if (typeof pushDirectiveOutput === 'function') pushDirectiveOutput('', 'replace');
    }
  } else {
    isConfirmingReset = true;
    resetBtn.textContent = 'Confirm Reset? (Erases Progress)';
    resetBtn.style.background = '#bf616a';
    resetBtn.style.color = '#ffffff';

    resetTimer = setTimeout(() => {
      isConfirmingReset = false;
      resetBtn.textContent = 'Reset Session';
      resetBtn.style.background = '';
      resetBtn.style.color = '#bf616a';
    }, 3000);
  }
}

// State tracking for experience deletion confirmation
let pendingDeleteExpName = null;
let deleteExpTimer = null;

/**
 * Renders experiences alphabetically in the Experiences card list.
 */
function renderExperiences() {
  const expListEl = document.getElementById('experiences-list');
  if (!expListEl || !window.gameState || !window.gameState.player) return;

  expListEl.innerHTML = '';

  const exps = window.gameState.player.experiences || [];

  if (exps.length === 0) {
    expListEl.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding: 4px 0;">No experiences added yet.</div>`;
    return;
  }

  // Sort alphabetically
  const sortedExps = [...exps].sort((a, b) => {
    const nameA = (typeof a === 'object' ? a.name : a).toLowerCase();
    const nameB = (typeof b === 'object' ? b.name : b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  sortedExps.forEach(exp => {
    const expName = typeof exp === 'object' ? exp.name : exp;
    const itemEl = document.createElement('div');
    itemEl.className = 'exp-item';

    const isConfirming = (pendingDeleteExpName === expName);
    const deleteBtnText = isConfirming ? '?' : '×';
    const deleteBtnClass = `track-btn btn-delete${isConfirming ? ' confirming' : ''}`;

    itemEl.innerHTML = `
      <div>
        <span class="exp-label">${expName}</span>
        <span class="exp-bonus-badge">(+2)</span>
      </div>
      <button class="${deleteBtnClass}" type="button" onclick="handleDeleteExperience('${expName.replace(/'/g, "\\'")}')">${deleteBtnText}</button>
    `;

    expListEl.appendChild(itemEl);
  });
}

/**
 * Handles adding a new experience string.
 */
function handleAddExperience() {
  const input = document.getElementById('exp-name-input');
  if (!input || !input.value.trim()) {
    alert('Please enter an experience name.');
    return;
  }

  const expName = input.value.trim();

  if (typeof addExperience === 'function') {
    addExperience(expName);
  }

  input.value = '';
  renderExperiences();
  populateExperienceDropdown();
}

/**
 * Safely removes an experience by name using a two-step confirmation tap.
 */
function handleDeleteExperience(expName) {
  if (pendingDeleteExpName === expName) {
    clearTimeout(deleteExpTimer);
    pendingDeleteExpName = null;

    if (window.gameState && window.gameState.player && Array.isArray(window.gameState.player.experiences)) {
      const idx = window.gameState.player.experiences.findIndex(e => (typeof e === 'object' ? e.name : e) === expName);
      if (idx !== -1 && typeof removeExperience === 'function') {
        removeExperience(idx);
      }
    }

    renderExperiences();
    populateExperienceDropdown();
  } else {
    clearTimeout(deleteExpTimer);
    pendingDeleteExpName = expName;
    renderExperiences();

    deleteExpTimer = setTimeout(() => {
      pendingDeleteExpName = null;
      renderExperiences();
    }, 2000);
  }
}