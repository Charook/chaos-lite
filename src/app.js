/**
 * app.js
 * UI Controller connecting index.html controls to state.js, generators.js, and directives.js
 */

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderUI();
});

// --- RENDER & STATE SYNC ---

function renderUI() {
  document.getElementById('control-val').textContent = gameState.player.control;
  document.getElementById('essence-val').textContent = gameState.player.essence;
  document.getElementById('directive-output').value = gameState.lastDirective || '';
  
  renderTracks();
  renderExperiences();
}

function updateDirectiveOutput(text) {
  gameState.lastDirective = text;
  saveState();
  document.getElementById('directive-output').value = text;
}

// --- METER HANDLERS ---

function handleControlChange(amount) {
  updateControl(amount);
  renderUI();
}

function handleEssenceChange(amount) {
  updateEssence(amount);
  renderUI();
}

// --- ACTION ROLL HANDLER ---

function handleRollAction() {
  const moveType = document.getElementById('move-select').value;
  const diffMod = parseInt(document.getElementById('diff-mod').value, 10) || 0;
  const expMod = parseInt(document.getElementById('exp-mod').value, 10) || 0;

  // 1. Roll math
  const roll = rollAction(gameState.player.control, diffMod, expMod);

  // 2. Automatically apply meter changes from roll dominance
  if (roll.controlChange !== 0) updateControl(roll.controlChange);
  if (roll.essenceChange !== 0) updateEssence(roll.essenceChange);

  // 3. Fetch necessary vectors based on outcome
  let clueText = null;
  let critVectorText = null;

  if (moveType === 'investigate' && (roll.outcome.includes('Success'))) {
    clueText = generateClueVector();
  }

  if (roll.outcome === 'Critical Success') {
    critVectorText = generateOpportunityVector();
  } else if (roll.outcome === 'Critical Failure') {
    critVectorText = generateComplicationVector();
  }

  // 4. Build instruction directive
  const directive = buildMoveDirective(moveType, roll.outcome, clueText, critVectorText);
  updateDirectiveOutput(directive);

  // 5. Update readout
  const readout = document.getElementById('roll-results');
  readout.innerHTML = `<strong>${roll.outcome}</strong> (Action: ${roll.actionScore} vs Challenge: ${roll.c1}, ${roll.c2}) | <em>${roll.dominance} Dominant</em>`;

  renderUI();
}

// --- ORACLE HANDLERS ---

function handleGenerateLead() {
  const hubKey = document.getElementById('hub-select').value;
  const locationObj = generateLocation(hubKey);
  const characterObj = generateCharacter();
  
  const directive = buildLeadDirective(locationObj.text, characterObj.text);
  updateDirectiveOutput(directive);
}

function handleGenerateClue() {
  const clue = generateClueVector();
  const directive = buildVectorDirective(clue, 'clue');
  updateDirectiveOutput(directive);
}

function handleGenerateComplication() {
  const comp = generateComplicationVector();
  const directive = buildVectorDirective(comp, 'complication');
  updateDirectiveOutput(directive);
}

function handleGenerateOpportunity() {
  const opp = generateOpportunityVector();
  const directive = buildVectorDirective(opp, 'opportunity');
  updateDirectiveOutput(directive);
}

function handleGenerateOracle() {
  const pair = generateActionTheme();
  const directive = buildOracleDirective(pair);
  updateDirectiveOutput(directive);
}

// --- TRACKS HANDLERS ---

function handleCreateTrack() {
  const name = document.getElementById('track-name').value.trim();
  const size = parseInt(document.getElementById('track-size').value, 10) || 6;
  const type = document.getElementById('track-type').value;

  if (name) {
    createTrack(name, size, type);
    document.getElementById('track-name').value = '';
    renderUI();
  }
}

function renderTracks() {
  const container = document.getElementById('tracks-container');
  container.innerHTML = '';

  gameState.tracks.forEach(track => {
    const item = document.createElement('div');
    item.className = 'track-item';
    item.innerHTML = `
      <div class="track-info">
        <span class="track-name">${track.name} (${track.type})</span>
        <span class="track-meta">${track.current} / ${track.size} Boxes</span>
      </div>
      <div class="track-btns">
        <button onclick="handleAdvanceTrack('${track.id}', -1)">-</button>
        <button onclick="handleAdvanceTrack('${track.id}', 1)">+</button>
        <button onclick="handleRemoveTrack('${track.id}')">✕</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function handleAdvanceTrack(id, amount) {
  advanceTrack(id, amount);
  renderUI();
}

function handleRemoveTrack(id) {
  removeTrack(id);
  renderUI();
}

// --- EXPERIENCES HANDLERS ---

function handleAddExperience() {
  const input = document.getElementById('exp-input');
  const val = input.value.trim();
  if (val) {
    addExperience(val);
    input.value = '';
    renderUI();
  }
}

function renderExperiences() {
  const list = document.getElementById('experience-list');
  list.innerHTML = '';

  gameState.player.experiences.forEach((exp, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `${exp} <button onclick="handleRemoveExperience(${idx})">✕</button>`;
    list.appendChild(li);
  });
}

function handleRemoveExperience(idx) {
  removeExperience(idx);
  renderUI();
}

// --- UTILITIES ---

function copyDirective() {
  const textarea = document.getElementById('directive-output');
  if (!textarea.value) return;

  textarea.select();
  textarea.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(textarea.value).then(() => {
    const feedback = document.getElementById('copy-feedback');
    feedback.style.display = 'inline';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 1500);
  });
}