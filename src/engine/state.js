/**
 * state.js
 * Central state management, progress tracks, and persistence for Chaos-Lite.
 */

const STORAGE_KEY = 'chaos_lite_state';

const defaultState = {
  version: 1.0,
  player: {
    name: "Investigator",
    control: 6,
    essence: 2,
    experiences: []
  },
  tracks: [],
  lastDirective: ""
};

// Global singleton state object
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
      const parsed = JSON.parse(saved);
      // Mutate existing gameState in-place to preserve window object reference
      Object.assign(gameState, JSON.parse(JSON.stringify(defaultState)), parsed);
    }
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
  }

  // Ensure arrays are strictly initialized
  if (!gameState.player) gameState.player = { name: "Investigator", control: 6, essence: 2, experiences: [] };
  if (!Array.isArray(gameState.player.experiences)) gameState.player.experiences = [];
  if (!Array.isArray(gameState.tracks)) gameState.tracks = [];

  return gameState;
}

function resetState() {
  Object.assign(gameState, JSON.parse(JSON.stringify(defaultState)));
  saveState();
  return gameState;
}

// --- PLAYER METER MODIFIERS ---

function updateControl(amount) {
  gameState.player.control = Math.max(0, Math.min(6, gameState.player.control + amount));
  saveState();
  return gameState.player.control;
}

function updateEssence(amount) {
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

// --- TRACKS ---

function createTrack(name, size = 6, type = 'progress') {
  const newTrack = {
    id: 'track_' + Date.now(),
    name: name || 'New Track',
    size: Number(size),
    current: 0,
    type: type,
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
    track.isComplete = (track.current >= track.size);
    saveState();
  }
  return track;
}

function removeTrack(id) {
  gameState.tracks = gameState.tracks.filter(t => t.id !== id);
  saveState();
}

// Global attachment
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
}