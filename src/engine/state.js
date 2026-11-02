/**
 * state.js
 * Central state management, progress tracks, and persistence for Chaos-Lite.
 */

const STORAGE_KEY = 'chaos_lite_state';

// Default state model
const defaultState = {
  version: 1.0,
  player: {
    name: "Investigator",
    control: 6,
    essence: 2,
    experiences: []
  },
  tracks: [], // Array of track objects: { id, name, size, current, type, isComplete }
  lastDirective: ""
};

let gameState = JSON.parse(JSON.stringify(defaultState));

// --- CORE PERSISTENCE ---

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      gameState = Object.assign({}, defaultState, JSON.parse(saved));
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
  }
  return gameState;
}

function resetState() {
  gameState = JSON.parse(JSON.stringify(defaultState));
  saveState();
  return gameState;
}

// --- PLAYER METER MODIFIERS ---

function updateControl(amount) {
  // Clamps value between 0 and 6
  gameState.player.control = Math.max(0, Math.min(6, gameState.player.control + amount));
  saveState();
  return gameState.player.control;
}

function updateEssence(amount) {
  // Clamps value between 0 and 6
  gameState.player.essence = Math.max(0, Math.min(6, gameState.player.essence + amount));
  saveState();
  return gameState.player.essence;
}

function addExperience(expString) {
  if (expString && !gameState.player.experiences.includes(expString)) {
    gameState.player.experiences.push(expString);
    saveState();
  }
}

function removeExperience(index) {
  if (index >= 0 && index < gameState.player.experiences.length) {
    gameState.player.experiences.splice(index, 1);
    saveState();
  }
}

// --- DAGGERHEART-STYLE PROGRESS TRACKS ---

function createTrack(name, size = 6, type = 'progress') {
  const newTrack = {
    id: 'track_' + Date.now(),
    name: name || 'New Track',
    size: Number(size),
    current: 0,
    type: type, // 'progress' or 'threat'
    isComplete: false
  };
  gameState.tracks.push(newTrack);
  saveState();
  return newTrack;
}

function advanceTrack(id, amount = 1) {
  const track = gameState.tracks.find(t => t.id === id);
  if (track) {
    track.current = Math.max(0, Math.min(track.size, track.current + amount));
    if (track.current >= track.size) {
      track.isComplete = true;
    } else {
      track.isComplete = false;
    }
    saveState();
  }
  return track;
}

function removeTrack(id) {
  gameState.tracks = gameState.tracks.filter(t => t.id !== id);
  saveState();
}

// --- IMPORT / EXPORT JSON ---

function exportStateJSON() {
  return JSON.stringify(gameState, null, 2);
}

function importStateJSON(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    if (imported && imported.player) {
      gameState = imported;
      saveState();
      return true;
    }
  } catch (e) {
    console.error("Invalid state JSON format:", e);
  }
  return false;
}

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.saveState = saveState;
  window.loadState = loadState;
  window.resetState = resetState;
  window.updateControl = updateControl;
  window.updateEssence = updateEssence;
  window.addExperience = addExperience;
  window.removeExperience = removeExperience;
  window.createTrack = createTrack;
  window.advanceTrack = advanceTrack;
  window.removeTrack = removeTrack;
  window.exportStateJSON = exportStateJSON;
  window.importStateJSON = importStateJSON;
}
