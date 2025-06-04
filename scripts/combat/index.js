// index.js - Main entry point for combat system
// Styled to match Lord Tsarcasm's House aesthetic

import { CombatManager } from './combatManager.js';
import { Unit, Soldier, Enemy } from './units.js';
import { ModelData } from './modelData.js';
import { EncounterManager } from './encounters.js';
import { GridManager } from './grid.js';
import { CombatRenderer } from './renderer.js';
import { CombatUI } from './ui.js';
import { CombatAI } from './ai.js';

// Add CSS link for Lord Tsarcasm aesthetic
document.addEventListener('DOMContentLoaded', () => {
    // Add combat CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = './scripts/combat/css/combat.css';
    document.head.appendChild(linkElement);
    
    // Add Google Fonts for Cinzel font used in Tsarcasm house
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap';
    document.head.appendChild(fontLink);
});

/**
 * Initialize a new combat scene
 * This is the public API for the combat system
 */
export function initCombat(container, options = {}) {
    const {
        encounterLocation = 'WASTELAND',
        encounterType = null,
        onCombatEnd = null,
        playerUnits = [],
        enemyUnits = []
    } = options;
    
    console.log('Combat system initializing with:', encounterLocation, encounterType);
    
    // Create combat manager
    const combatManager = new CombatManager(container, encounterLocation, encounterType);
    
    // Set callback for combat end
    if (onCombatEnd) {
        container.onCombatEnd = onCombatEnd;
    }
    
    // Return the combat manager
    return combatManager;
}

// Export all classes and functions for the combat system
export { CombatManager } from './combatManager.js';
export { Unit, Soldier, Enemy } from './units.js';
export { ModelData } from './modelData.js';
export { EncounterManager } from './encounters.js';
export { GridManager } from './grid.js';
export { CombatRenderer } from './renderer.js';
export { CombatUI } from './ui.js';
export { CombatAI } from './ai.js';

// For better compatibility with script tag loading, also attach to window
if (typeof window !== 'undefined') {
    // Create a global namespace for the combat system
    window.CombatSystem = {
        initCombat,
        CombatManager,
        Unit,
        Soldier,
        Enemy,
        ModelData,
        EncounterManager,
        GridManager,
        CombatRenderer,
        CombatUI,
        CombatAI
    };
}