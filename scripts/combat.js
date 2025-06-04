// combat.js - Modular 3D Turn-Based Combat System
// Version 3.0 - Completely modularized for better code organization

/**
 * This file is now a wrapper around the modular combat system.
 * All functionality has been moved to the combat/ directory.
 * This wrapper maintains backward compatibility with existing code.
 */

// Handle both ES module and script tag inclusion
let CombatSystem;

// Function to check if THREE.js is loaded
function ensureThreeJsLoaded() {
    return new Promise((resolve, reject) => {
        if (typeof THREE !== 'undefined') {
            console.log('THREE.js is already loaded');
            resolve();
            return;
        }

        console.log('Loading THREE.js...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
        script.onload = () => {
            console.log('THREE.js loaded successfully');
            
            // Load additional THREE.js dependencies
            const dependencies = [
                'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js',
                'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js'
            ];
            
            let loaded = 0;
            dependencies.forEach(dep => {
                const depScript = document.createElement('script');
                depScript.src = dep;
                depScript.onload = () => {
                    loaded++;
                    if (loaded === dependencies.length) {
                        console.log('All THREE.js dependencies loaded');
                        resolve();
                    }
                };
                depScript.onerror = err => {
                    console.error('Error loading THREE.js dependency:', dep, err);
                    reject(err);
                };
                document.head.appendChild(depScript);
            });
        };
        script.onerror = err => {
            console.error('Error loading THREE.js:', err);
            reject(err);
        };
        document.head.appendChild(script);
    });
}

// Function to load the modular system
async function loadCombatSystem() {
    try {
        // Ensure THREE.js is loaded first
        await ensureThreeJsLoaded();
        
        // Load TWEEN.js if not already loaded
        if (typeof TWEEN === 'undefined') {
            await new Promise((resolve, reject) => {
                console.log('Loading TWEEN.js...');
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.min.js';
                script.onload = () => {
                    console.log('TWEEN.js loaded successfully');
                    resolve();
                };
                script.onerror = err => {
                    console.error('Error loading TWEEN.js:', err);
                    reject(err);
                };
                document.head.appendChild(script);
            });
        }
        
        // Try to import as ES module
        try {
            CombatSystem = await import('./combat/index.js');
            if (CombatSystem) {
                setupCompatibilityLayer(CombatSystem);
                console.log('Combat system loaded via ES Module import');
            } else {
                throw new Error('Combat system module loaded but returned undefined');
            }
        } catch (importErr) {
            console.error('Error loading combat system as ES Module:', importErr);
            // Fall back to loading each file individually as scripts
            loadCombatScripts();
        }
    } catch (err) {
        console.error('Error in loadCombatSystem:', err);
        // Fall back to loading each file individually as scripts
        loadCombatScripts();
    }
}

// Fallback function to load combat scripts when ES modules aren't supported
function loadCombatScripts() {
    // Create a namespace for non-module script loading
    window.CombatModules = {};
    
    // First, create a base CombatSystem object
    window.CombatSystem = {
        // This will be populated as modules load
        initCombat: function(container, options) {
            console.log("Combat system initializing (placeholder)");
            alert("Combat system is still loading. Please try again in a moment.");
            return null;
        }
    };
    
    // Define the scripts to load in correct dependency order
    const scripts = [
        { name: 'modelData', path: './combat/modelData.js' },
        { name: 'units', path: './combat/units.js' },
        { name: 'grid', path: './combat/grid.js' },
        { name: 'renderer', path: './combat/renderer.js' },
        { name: 'ui', path: './combat/ui.js' },
        { name: 'ai', path: './combat/ai.js' },
        { name: 'encounters', path: './combat/encounters.js' },
        { name: 'combatManager', path: './combat/combatManager.js' }
    ];
    
    // Function to load scripts one after another in order
    function loadScriptsSequentially(index) {
        if (index >= scripts.length) {
            // All module scripts loaded, now load the index.js which will tie them together
            console.log('All module scripts loaded, now loading index.js');
            
            // Create a final script to set up the actual CombatSystem
            const finalScript = document.createElement('script');
            finalScript.textContent = `
                // Define a proper initCombat function using the loaded modules
                window.CombatSystem.initCombat = function(container, options = {}) {
                    const {
                        encounterLocation = 'WASTELAND',
                        encounterType = null,
                        onCombatEnd = null
                    } = options;
                    
                    console.log('Combat system initializing with:', encounterLocation, encounterType);
                    
                    // Create combat manager using the loaded modules
                    const CombatManager = window.CombatModules.combatManager.CombatManager;
                    const combatManager = new CombatManager(container, encounterLocation, encounterType);
                    
                    // Set callback for combat end
                    if (onCombatEnd) {
                        container.onCombatEnd = onCombatEnd;
                    }
                    
                    // Return the combat manager
                    return combatManager;
                };
                
                // Set up all the exports from the modules
                Object.keys(window.CombatModules).forEach(key => {
                    const module = window.CombatModules[key];
                    Object.keys(module).forEach(exportName => {
                        window.CombatSystem[exportName] = module[exportName];
                    });
                });
                
                console.log('Combat system initialization complete via script loading');
                setupCompatibilityLayer(window.CombatSystem);
            `;
            document.head.appendChild(finalScript);
            return;
        }
        
        const script = scripts[index];
        console.log(`Loading module script: ${script.name}`);
        
        // Create wrapper script that will define the module in CombatModules namespace
        const wrapperScript = document.createElement('script');
        wrapperScript.textContent = `
            // Create empty module namespace
            window.CombatModules.${script.name} = {};
            
            // Create wrapper functions for exportable classes and functions
            const module = window.CombatModules.${script.name};
            
            // Wrap module in an execution context
            (function(exports) {
                // The module script will be loaded here
            })(module);
        `;
        document.head.appendChild(wrapperScript);
        
        // Now load the actual script
        const scriptElement = document.createElement('script');
        scriptElement.src = script.path;
        scriptElement.type = 'text/javascript';
        
        scriptElement.onload = () => {
            console.log(`Loaded module script: ${script.name}`);
            // Load the next script
            loadScriptsSequentially(index + 1);
        };
        
        scriptElement.onerror = (err) => {
            console.error(`Error loading ${script.path}:`, err);
            // Try to continue with the next script
            loadScriptsSequentially(index + 1);
        };
        
        document.head.appendChild(scriptElement);
    }
    
    // Start loading scripts
    loadScriptsSequentially(0);
}

// Set up the backward compatibility layer
function setupCompatibilityLayer(CombatSystem) {
    if (!CombatSystem) {
        console.error('Cannot set up compatibility layer: CombatSystem is undefined');
        return;
    }
    
    // Backward compatibility global variables - check if they exist before assigning
    if (CombatSystem.CombatManager) window.CombatManager = CombatSystem.CombatManager;
    if (CombatSystem.Unit) window.Unit = CombatSystem.Unit;
    if (CombatSystem.Soldier) window.Soldier = CombatSystem.Soldier;
    if (CombatSystem.Enemy) window.Enemy = CombatSystem.Enemy;
    if (CombatSystem.ModelData) window.ModelData = CombatSystem.ModelData;
    if (CombatSystem.EncounterManager) window.EncounterManager = CombatSystem.EncounterManager;
    
    // Create or access the combatScene namespace
    window.combatScene = window.combatScene || {};
    
    /**
     * Initialize a combat scene with backward compatibility
     * @param {object} options - Combat options
     */
    window.combatScene.initialize = function(options = {}) {
        const {
            container = document.getElementById('combat-container'),
            encounterLocation = 'WASTELAND',
            encounterType = null,
            onCombatEnd = null
        } = options;
        
        // Store container reference
        window.combatScene.container = container;
        
        // Check if initCombat exists before calling it
        if (typeof CombatSystem.initCombat === 'function') {
            // Create combat manager
            window.combatScene.manager = CombatSystem.initCombat(container, {
                encounterLocation,
                encounterType,
                onCombatEnd
            });
            
            // Store callback
            window.combatScene.onCombatEnd = onCombatEnd;
            
            return window.combatScene.manager;
        } else {
            console.error('CombatSystem.initCombat is not a function');
            return null;
        }
    };
    
    /**
     * Start a combat encounter with the specified options
     * @param {string} encounterLocation - Location for the encounter
     * @param {string} encounterType - Type of encounter
     * @param {Function} onComplete - Callback when combat ends
     */
    window.startCombat = function(encounterLocation, encounterType, onComplete) {
        console.log('Starting combat encounter in wrapper:', encounterLocation, encounterType);
        
        // Create container if it doesn't exist
        let container = document.getElementById('combat-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'combat-container';
            container.style.position = 'fixed';
            container.style.top = '10%';
            container.style.left = '10%';
            container.style.width = '80%';
            container.style.height = '80%';
            container.style.zIndex = '1000';
            document.body.appendChild(container);
        }
        
        // Initialize combat scene
        window.combatScene.initialize({
            container,
            encounterLocation,
            encounterType,
            onCombatEnd: onComplete
        });
    };
    
    // Export CombatSystem to global scope as well
    window.CombatSystem = CombatSystem;
    
    console.log('Combat system compatibility layer set up successfully');
}

// Initialize the system when this script loads
loadCombatSystem();

// Don't use export statements in non-module script
// This file is loaded both as a module and as a script
// So we need to check if we're in a module context
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CombatSystem };
}