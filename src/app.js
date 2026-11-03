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

  // Initial render
  renderMeters();
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