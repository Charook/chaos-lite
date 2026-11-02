/**
 * engine.js - Section 1: State Management & Persistence
 * Handles game state initialization, state updates, and LocalStorage sync.
 */

// Default state structure
const DEFAULT_STATE = {
  // Core Resource Meters
  control: 6,     // Starts at 6 (Decay loop)
  essence: 2,     // Player resource for activating experiences/talents

  // Dynamic Progress Tracks (e.g., Menace, Investigation Progress, Wards)
  // Each track: { id: string, name: string, current: number, max: number }
  progressTracks: [
    { id: "menace", name: "Menace / Threat", current: 0, max: 6 }
  ],

  // Player-Recorded Experiences (Freeform notes for player leverage)
  // e.g., ["Sister Catherine's Secret", "Scullery Key Passage"]
  experiences: [],

  // Dynamic User Extensions (Added during play via UI)
  customCharacters: [],
  customLocations: [],
  customVectors: []
};

// Global active game state
let gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));

/**
 * Saves current gameState to browser LocalStorage.
 */
function saveState() {
  try {
    localStorage.setItem("chaosLite_gameState", JSON.stringify(gameState));
  } catch (e) {
    console.error("Failed to save state to LocalStorage:", e);
  }
}

/**
 * Loads saved state from LocalStorage, merging missing keys with defaults.
 */
function loadState() {
  try {
    const saved = localStorage.getItem("chaosLite_gameState");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with DEFAULT_STATE to guarantee new properties exist
      gameState = Object.assign({}, DEFAULT_STATE, parsed);
    }
  } catch (e) {
    console.error("Failed to load state from LocalStorage:", e);
  }
}

/**
 * Resets state back to original initial defaults.
 */
function resetState() {
  gameState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState();
}

/**
 * Adds a new experience string to the player's recorded list.
 * @param {string} expText 
 */
function addExperience(expText) {
  if (!expText || typeof expText !== 'string') return;
  const cleanExp = expText.trim();
  if (cleanExp && !gameState.experiences.includes(cleanExp)) {
    gameState.experiences.push(cleanExp);
    saveState();
  }
}

/**
 * Removes an experience by index.
 * @param {number} index 
 */
function removeExperience(index) {
  if (index >= 0 && index < gameState.experiences.length) {
    gameState.experiences.splice(index, 1);
    saveState();
  }
}

// Global attachment for browser execution
if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.saveState = saveState;
  window.loadState = loadState;
  window.resetState = resetState;
  window.addExperience = addExperience;
  window.removeExperience = removeExperience;
}
