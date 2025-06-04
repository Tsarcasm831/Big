// combatManager.js - Main combat system manager

import { GridManager } from './grid.js';
import { CombatRenderer } from './renderer.js';
import { CombatUI } from './ui.js';
import { CombatAI } from './ai.js';
import { EncounterManager } from './encounters.js';
import { Unit, Soldier, Enemy } from './units.js';
import { ModelData } from './modelData.js';

/**
 * Main combat manager class
 * Central controller for the combat system
 */
export class CombatManager {
    constructor(container, encounterLocation, encounterType) {
        // Core properties
        this.container = container;
        this.encounterLocation = encounterLocation;
        this.encounterType = encounterType || null;
        this.gridSize = { width: 20, height: 20 };
        this.units = [];
        this.currentTurn = 'player';
        this.selectedUnit = null;
        this.reachableCells = [];
        this.currentMode = null; // move, attack, ability, item

        // Sub-systems
        this.grid = new GridManager(this.gridSize.width, this.gridSize.height);
        this.renderer = new CombatRenderer(container);
        this.ui = new CombatUI(container);
        this.encounters = new EncounterManager();
        this.ai = null; // Will be initialized after the manager is set up
        
        // Initialize systems
        this.initialize();
    }
    
    /**
     * Initialize the combat system
     */
    initialize() {
        // Initialize grid
        this.grid.initialize();
        
        // Generate terrain based on encounter type
        if (this.encounterType) {
            this.grid.applyEncounterTerrain(this.encounterType);
        } else {
            this.grid.generateTerrain();
        }
        
        // Initialize 3D renderer
        this.renderer.initialize();
        this.renderer.createGround(this.gridSize.width, this.gridSize.height);
        
        // Initialize UI
        this.ui.initialize();
        
        // Place units on the grid
        this.placeUnits();
        
        // Initialize AI system with reference to this manager
        this.ai = new CombatAI(this);
        
        // Set up input handlers
        this.setupEventListeners();
        
        // Start the animation loop
        this.renderer.startAnimationLoop((delta) => {
            // Update any animations
            this.units.forEach(unit => {
                if (unit.mixer) unit.mixer.update(delta);
            });
        });
        
        // Add welcome message
        if (this.encounterType) {
            const rules = this.encounters.getEncounterRules(this.encounterType);
            this.ui.addLogMessage(`Encounter: ${this.encounterType}`, 'info');
            this.ui.addLogMessage(rules.description, 'info');
        } else {
            this.ui.addLogMessage('Combat started!', 'info');
        }
        
        return this;
    }
    
    /**
     * Place units on the grid
     */
    placeUnits() {
        // Get positions based on encounter type
        let playerPositions = [
            { x: 5, y: 18 }, { x: 6, y: 18 }, { x: 7, y: 18 }, { x: 8, y: 18 }
        ];
        
        if (this.encounterType) {
            playerPositions = this.encounters.getPlayerPositions(this.encounterType);
        }
        
        // Player units
        const friendlyModels = ['katia_f', 'oldman', 'katia_f', 'oldman'];
        const playerClasses = ['rifleman', 'heavy', 'scout', 'medic'];
        
        playerPositions.forEach((pos, index) => {
            const modelName = friendlyModels[index % friendlyModels.length];
            const soldierClass = playerClasses[index % playerClasses.length];
            
            const unit = new Soldier('player', pos.x, pos.y, modelName, soldierClass);
            unit.items = ['medkit', 'grenade'];
            
            this.units.push(unit);
            this.grid.grid[pos.y][pos.x].unit = unit;
            this.loadUnitModel(unit);
        });
        
        // Enemy units based on encounter type
        let enemyData = {
            positions: [
                { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }
            ],
            models: ['anthromorph', 'avianos', 'xithrian', 'talorian']
        };
        
        if (this.encounterType) {
            enemyData = this.encounters.getEnemyPositions(this.encounterType);
        }
        
        // Place enemies
        enemyData.positions.forEach((pos, index) => {
            // Select model
            let modelName = 'anthromorph'; // Default
            if (index < enemyData.models.length) {
                modelName = enemyData.models[index];
            } else if (enemyData.models.length > 0) {
                modelName = enemyData.models[Math.floor(Math.random() * enemyData.models.length)];
            }
            
            // Create unit
            const unit = new Enemy('enemy', pos.x, pos.y, modelName);
            
            // Apply special rules based on encounter type
            if (this.encounterType) {
                this.encounters.applyEncounterEffectsToEnemy(unit, this.encounterType);
            }
            
            this.units.push(unit);
            this.grid.grid[pos.y][pos.x].unit = unit;
            this.loadUnitModel(unit);
        });
    }
    
    /**
     * Set up event listeners for user interaction
     */
    setupEventListeners() {
        // Handle action button clicks
        document.querySelectorAll('.combat-action-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleActionButton(action);
            });
        });
        
        // Handle grid clicks - simplified, robust approach
        this.renderer.renderer.domElement.addEventListener('click', (e) => {
            // Get exact mouse position relative to the canvas
            const rect = this.renderer.renderer.domElement.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            
            // Convert to normalized device coordinates
            const mouse = new THREE.Vector2();
            mouse.x = (canvasX / rect.width) * 2 - 1;
            mouse.y = -(canvasY / rect.height) * 2 + 1;
            
            // Setup raycaster
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.renderer.camera);
            
            // Cast ray to find intersected objects
            const intersects = raycaster.intersectObjects(this.renderer.scene.children, true);
            
            // Process if we hit something
            if (intersects.length > 0) {
                const point = intersects[0].point;
                
                // SIMPLE, DIRECT APPROACH FOR UNIT DETECTION
                // First check if we clicked on a unit model directly
                const clickedObject = intersects[0].object;
                if (clickedObject.userData && clickedObject.userData.unit) {
                    const unit = clickedObject.userData.unit;
                    console.log(`Direct click on unit model: ${unit.modelName}`);
                    this.ui.showUnitStatsPopup(unit, e.clientX, e.clientY);
                    return;
                }
                
                // Otherwise check grid cells for units
                const gridX = Math.floor(point.x);
                const gridY = Math.floor(point.z);
                
                console.log(`Grid click at (${gridX}, ${gridY})`);
                
                // Look for a unit at this exact grid position
                // Use a direct loop for simplicity and reliability
                for (let i = 0; i < this.units.length; i++) {
                    const unit = this.units[i];
                    if (unit.x === gridX && unit.y === gridY) {
                        console.log(`Found unit at clicked position: ${unit.modelName}`);
                        
                        // Show unit stats popup at click position
                        this.ui.showUnitStatsPopup(unit, e.clientX, e.clientY);
                        return;
                    }
                }
                
                // If we get here, no unit was found - handle as grid click
                if (this.currentTurn === 'player' && this.selectedUnit && 
                    gridX >= 0 && gridX < this.gridSize.width &&
                    gridY >= 0 && gridY < this.gridSize.height) {
                    
                    this.handleGridClick(gridX, gridY);
                }
            }
        });
        
        // Simple mouse hover for grid highlighting
        this.renderer.renderer.domElement.addEventListener('mousemove', (e) => {
            // Get mouse position relative to the canvas
            const rect = this.renderer.renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Setup raycaster
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.renderer.camera);
            
            // Cast ray to all objects in the scene
            const intersects = raycaster.intersectObjects(this.renderer.scene.children, true);
            
            // Remove existing hover highlight
            if (this.renderer.hoverHighlight) {
                this.renderer.scene.remove(this.renderer.hoverHighlight);
                this.renderer.hoverHighlight = null;
            }
            
            if (intersects.length > 0) {
                // The first intersection gives us the closest object
                const intersection = intersects[0];
                const point = intersection.point;
                
                // Calculate grid position
                const gridX = Math.floor(point.x);
                const gridY = Math.floor(point.z);
                
                // Make sure we're within grid bounds
                if (gridX >= 0 && gridX < this.gridSize.width && 
                    gridY >= 0 && gridY < this.gridSize.height) {
                    
                    // Check if there's a unit at this position
                    const unitAtPosition = this.getUnitAtPosition(gridX, gridY);
                    
                    // Choose highlight color: red for units, yellow for empty cells
                    const highlightColor = unitAtPosition ? 0xff0000 : 0xffff00;
                    
                    // If over a unit, make the cursor a pointer to indicate clickable
                    this.renderer.renderer.domElement.style.cursor = unitAtPosition ? 'pointer' : 'default';
                    
                    // Create highlight with appropriate color
                    this.renderer.createHoverHighlight(gridX, gridY, highlightColor);
                    
                    // Show debug info if we're hovering over a unit
                    if (unitAtPosition) {
                        console.log(`Hovering over ${unitAtPosition.modelName} at (${gridX}, ${gridY})`);
                    }
                }
            }
        });
    }
    
    /**
     * Create a visible debug marker at the specified position
     * @param {number} x - X position in world space
     * @param {number} y - Y position in world space
     * @param {number} z - Z position in world space
     */
    createDebugMarker(x, y, z) {
        // Remove any existing debug marker
        if (this.debugMarker) {
            this.renderer.scene.remove(this.debugMarker);
        }
        
        // Create a small red sphere at the intersection point
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.debugMarker = new THREE.Mesh(geometry, material);
        this.debugMarker.position.set(x, y + 0.1, z); // Raise slightly above the surface
        
        this.renderer.scene.add(this.debugMarker);
    }
    
    /**
     * Show a visual debug marker at the exact cursor position on screen
     * @param {number} x - Screen X position
     * @param {number} y - Screen Y position 
     */
    showCursorDebugMarker(x, y) {
        // Create or update the cursor debug element
        const pointerDebug = document.getElementById('pointer-debug') || document.createElement('div');
        if (!document.getElementById('pointer-debug')) {
            pointerDebug.id = 'pointer-debug';
            pointerDebug.style.cssText = 'position:absolute;width:8px;height:8px;background:red;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);';
            document.body.appendChild(pointerDebug);
        }
        pointerDebug.style.left = `${x}px`;
        pointerDebug.style.top = `${y}px`;
    }
    
    /**
     * Check if a grid cell is occupied by any unit
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @returns {boolean} True if the cell is occupied, false otherwise
     */
    isCellOccupied(x, y) {
        // Check if any unit is at this position
        return this.units.some(unit => unit.x === x && unit.y === y);
    }
    
    /**
     * Get the unit at a specific grid position
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @returns {Unit|null} The unit at the position or null if none found
     */
    getUnitAtPosition(x, y) {
        // Extra debug logging for unit positions
        console.log(`Checking for unit at (${x}, ${y})`);
        console.log('Current units:', this.units.map(u => `${u.modelName} at (${u.x}, ${u.y})`));
        
        // Find a unit at the specified position
        const unit = this.units.find(unit => unit.x === x && unit.y === y);
        if (unit) {
            console.log(`Found unit: ${unit.modelName}`);
            return unit;
        }
        
        return null;
    }
    
    /**
     * Load a 3D model for a unit
     * @param {object} unit - Unit to load model for
     */
    loadUnitModel(unit) {
        // Get the GLB model
        const gltf = window.getGLB(unit.modelName);
        
        if (gltf) {
            // Create model from GLB
            unit.model = gltf.scene.clone();
            unit.animations = gltf.animations;
            unit.mixer = new THREE.AnimationMixer(unit.model);
            
            // Play idle animation if available
            const idleClip = unit.animations.find(clip => clip.name.toLowerCase().includes('idle'));
            if (idleClip) unit.mixer.clipAction(idleClip).play();
            
            // Position model on grid - center the unit on the grid cell
            // Get model height to place it correctly
            let modelHeight = 1.0; // Default height
            
            // Calculate actual height of the model by traversing it first
            unit.model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            // Get bounding box to properly center vertically
            const boundingBox = new THREE.Box3().setFromObject(unit.model);
            if (boundingBox.max.y !== Infinity && boundingBox.min.y !== -Infinity) {
                modelHeight = boundingBox.max.y - boundingBox.min.y;
            }
            
            // Position with bottom at ground level and centered on grid cell
            unit.model.position.set(unit.x + 0.5, modelHeight / 2, unit.y + 0.5);
            // Increase unit size for better visibility
            unit.model.scale.set(0.8, 0.8, 0.8);
            
            // Store reference to unit in model
            unit.model.userData.unit = unit;
            this.renderer.scene.add(unit.model);
            
            // Create health bar
            this.createHealthBar(unit);
        } else {
            console.warn(`Model ${unit.modelName} not loaded. Using placeholder.`);
            
            // Create simple placeholder model
            const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
            const material = new THREE.MeshStandardMaterial({ 
                color: unit.faction === 'player' ? 0x00ff00 : 0xff0000 
            });
            
            unit.model = new THREE.Mesh(geometry, material);
            unit.model.position.set(unit.x + 0.5, 0.5, unit.y + 0.5);
            unit.model.castShadow = true;
            unit.model.receiveShadow = true;
            unit.model.userData.unit = unit;
            
            this.renderer.scene.add(unit.model);
            
            // Create health bar
            this.createHealthBar(unit);
        }
    }
    
    /**
     * Create a health bar for a unit
     * @param {object} unit - Unit to create health bar for
     */
    createHealthBar(unit) {
        const healthBarGeometry = new THREE.PlaneGeometry(0.8, 0.1);
        const healthBarMaterial = new THREE.MeshBasicMaterial({ 
            color: unit.faction === 'player' ? 0x00ff00 : 0xff0000 
        });
        
        unit.healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
        unit.healthBar.position.set(unit.x + 0.5, 2.5, unit.y + 0.5);
        unit.healthBar.rotation.x = -Math.PI / 2; // Face up
        
        this.renderer.scene.add(unit.healthBar);
        
        // Update health bar initially
        this.updateHealthBar(unit);
    }
    
    /**
     * Update a unit's health bar
     * @param {object} unit - Unit to update health bar for
     */
    updateHealthBar(unit) {
        if (!unit.healthBar) return;
        
        // Update health bar position
        unit.healthBar.position.set(unit.model.position.x, 2.5, unit.model.position.z);
        
        // Make health bar always face the camera
        if (this.renderer.camera) {
            // Get the camera quaternion and clone it
            const quaternion = this.renderer.camera.quaternion.clone();
            
            // Rotate the health bar to face the camera
            // We need to add 90 degrees rotation on X-axis to make it face the camera properly
            const euler = new THREE.Euler(Math.PI / 2, 0, 0);
            const rotationQuaternion = new THREE.Quaternion().setFromEuler(euler);
            quaternion.multiply(rotationQuaternion);
            
            unit.healthBar.quaternion.copy(quaternion);
        }
        
        // Update health bar scale based on health
        const healthPercent = unit.health / unit.maxHealth;
        unit.healthBar.scale.set(healthPercent, 1, 1);
        
        // Update color based on health
        const material = unit.healthBar.material;
        
        if (healthPercent > 0.6) {
            material.color.setHex(unit.faction === 'player' ? 0x00ff00 : 0xff0000);
        } else if (healthPercent > 0.3) {
            material.color.setHex(0xffff00); // Yellow for medium health
        } else {
            material.color.setHex(0xff0000); // Red for low health
        }
    }
    
    /**
     * Handle action button clicks
     * @param {string} action - Action to perform
     */
    handleActionButton(action) {
        if (this.currentTurn !== 'player') return;
        
        switch (action) {
            case 'move':
                this.setMode('move');
                break;
                
            case 'attack':
                this.setMode('attack');
                break;
                
            case 'ability':
                if (this.selectedUnit) {
                    this.ui.showAbilities(this.selectedUnit, (abilityId, ability) => {
                        this.useAbility(this.selectedUnit, abilityId);
                    });
                }
                break;
                
            case 'item':
                if (this.selectedUnit) {
                    this.ui.showItems(this.selectedUnit, (itemId, item) => {
                        this.useItem(this.selectedUnit, itemId);
                    });
                }
                break;
                
            case 'endTurn':
                this.endPlayerTurn();
                break;
        }
    }
    
    /**
     * Set the current action mode
     * @param {string} mode - Mode to set (move, attack, ability, item)
     */
    setMode(mode) {
        // Clear current mode
        this.currentMode = null;
        this.renderer.clearHighlights();
        this.ui.clearActiveActions();
        
        // Don't proceed if no unit selected
        if (!this.selectedUnit) return;
        
        // Set new mode
        this.currentMode = mode;
        this.ui.setActionActive(mode, true);
        
        // Update highlights based on mode
        switch (mode) {
            case 'move':
                // Show movement range
                this.reachableCells = this.grid.getReachableCells(
                    this.selectedUnit.x, 
                    this.selectedUnit.y, 
                    this.selectedUnit.moveRange
                );
                this.renderer.highlightCells(this.reachableCells, 0x00ff00, 0.4);
                break;
                
            case 'attack':
                // Show attack range
                const attackableCells = this.getAttackableCells(this.selectedUnit);
                this.renderer.highlightCells(attackableCells, 0xff0000, 0.4);
                break;
        }
    }
    
    /**
     * Handle clicks on units
     * @param {object} unit - Clicked unit
     * @param {number} x - Mouse X position
     * @param {number} y - Mouse Y position
     */
    handleUnitClick(unit, x, y) {
        // Show unit stats for any unit
        this.ui.showUnitStatsPopup(unit, x, y);
        
        // Only select player units during player turn
        if (this.currentTurn === 'player' && unit.faction === 'player') {
            // Select the clicked unit
            this.selectUnit(unit);
        } else if (
            this.currentTurn === 'player' && 
            unit.faction === 'enemy' && 
            this.selectedUnit && 
            this.currentMode === 'attack'
        ) {
            // If in attack mode and clicked on enemy, attack it
            if (this.canAttack(this.selectedUnit, unit)) {
                this.attack(this.selectedUnit, unit);
                this.setMode(null); // Clear mode after attacking
            }
        }
    }
    
    /**
     * Handle clicks on the grid
     * @param {number} gridX - Grid X coordinate
     * @param {number} gridY - Grid Y coordinate
     * @param {Event} event - The original click event (optional)
     */
    handleGridClick(gridX, gridY, event = null) {
        // Check if there's a unit at this grid position
        const unitAtPosition = this.getUnitAtPosition(gridX, gridY);
        
        if (unitAtPosition) {
            // If there's a unit at this position, show its stats
            if (event) {
                this.handleUnitClick(unitAtPosition, event.clientX, event.clientY);
            } else {
                // If no event provided, center the popup on the grid cell
                const rect = this.renderer.renderer.domElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                this.handleUnitClick(unitAtPosition, centerX, centerY);
            }
            return;
        }
        
        // No unit at this position, proceed with normal grid click logic
        if (this.currentTurn !== 'player' || !this.selectedUnit) return;
        
        // Get the cell at the clicked position
        const cell = this.grid.grid[gridY][gridX];
        if (!cell) return;
        
        // Handle based on current mode
        switch (this.currentMode) {
            case 'move':
                // Check if cell is reachable
                if (
                    !cell.unit && 
                    this.reachableCells.some(c => c.x === gridX && c.y === gridY)
                ) {
                    this.moveUnit(this.selectedUnit, gridX, gridY);
                    this.setMode(null); // Clear mode after moving
                }
                break;
                
            case 'attack':
                // Check if there's an enemy to attack
                if (cell.unit && cell.unit.faction === 'enemy') {
                    if (this.canAttack(this.selectedUnit, cell.unit)) {
                        this.attack(this.selectedUnit, cell.unit);
                        this.setMode(null); // Clear mode after attacking
                    }
                }
                break;
        }
    }
    
    /**
     * Select a unit
     * @param {object} unit - Unit to select
     */
    selectUnit(unit) {
        // Don't select if it's not the player's turn
        if (this.currentTurn !== 'player') return;
        
        // Don't select if the unit can't act
        if (!unit.canAct()) {
            this.ui.addLogMessage(`${unit.modelName} has no actions left!`, 'warning');
            return;
        }
        
        // Clear any existing selection
        if (this.selectedUnit) {
            // Clear highlights
            this.renderer.clearHighlights();
        }
        
        // Set new selection
        this.selectedUnit = unit;
        
        // Highlight the selected unit
        const highlightGeometry = new THREE.RingGeometry(0.6, 0.7, 32);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00, 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlight.position.set(unit.x + 0.5, 0.03, unit.y + 0.5);
        highlight.rotation.x = -Math.PI / 2;
        
        this.renderer.scene.add(highlight);
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: this.selectedUnit
        });
    }
    
    /**
     * Move a unit to a new position
     * @param {object} unit - Unit to move
     * @param {number} x - Target X coordinate
     * @param {number} y - Target Y coordinate
     */
    moveUnit(unit, x, y) {
        // Play walking animation if available
        const walkClip = unit.animations.find(clip => clip.name.toLowerCase().includes('walk'));
        if (walkClip) {
            unit.mixer.stopAllAction();
            unit.mixer.clipAction(walkClip).play();
        }
        
        // Calculate target position in 3D space
        const targetPosition = new THREE.Vector3(x + 0.5, 0, y + 0.5);
        
        // Animate movement
        new TWEEN.Tween(unit.model.position)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                // Update health bar position during movement
                if (unit.healthBar) {
                    unit.healthBar.position.set(unit.model.position.x, 2.5, unit.model.position.z);
                }
            })
            .onComplete(() => {
                // Return to idle animation
                if (walkClip) {
                    unit.mixer.stopAllAction();
                    const idleClip = unit.animations.find(clip => clip.name.toLowerCase().includes('idle'));
                    if (idleClip) unit.mixer.clipAction(idleClip).play();
                }
                
                // Update grid references
                this.grid.grid[unit.y][unit.x].unit = null;
                unit.x = x;
                unit.y = y;
                this.grid.grid[y][x].unit = unit;
                
                // Consume action points
                unit.actionPoints -= 1;
                unit.hasMoved = true;
                
                // Clear selection if out of action points
                if (unit.actionPoints <= 0) {
                    this.selectedUnit = null;
                    this.reachableCells = [];
                    this.renderer.clearHighlights();
                }
                
                // Update UI
                this.ui.update({
                    currentTurn: this.currentTurn,
                    selectedUnit: this.selectedUnit
                });
                
                // Add log message
                this.ui.addLogMessage(`${unit.modelName} moved to (${x}, ${y})`, 'info');
                
                // Check for combat end
                this.checkCombatEnd();
            })
            .start();
    }
    
    /**
     * Attack a target unit
     * @param {object} attacker - Attacking unit
     * @param {object} target - Target unit
     */
    attack(attacker, target) {
        // Check if attack is valid
        if (!this.canAttack(attacker, target)) {
            this.ui.addLogMessage(`${attacker.modelName} cannot attack ${target.modelName}!`, 'error');
            return;
        }
        
        // Play attack animation if available
        const attackClip = attacker.animations.find(clip => 
            clip.name.toLowerCase().includes('attack') ||
            clip.name.toLowerCase().includes('shoot')
        );
        
        if (attackClip) {
            attacker.mixer.stopAllAction();
            const action = attacker.mixer.clipAction(attackClip);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
            
            // Return to idle after animation
            setTimeout(() => {
                attacker.mixer.stopAllAction();
                const idleClip = attacker.animations.find(clip => clip.name.toLowerCase().includes('idle'));
                if (idleClip) attacker.mixer.clipAction(idleClip).play();
            }, 1000);
        }
        
        // Calculate hit chance
        const distance = Math.abs(target.x - attacker.x) + Math.abs(target.y - attacker.y);
        const distanceModifier = Math.max(0, 1 - (distance / attacker.attackRange) * 0.3);
        
        // Check for cover
        const inCover = this.isUnitInCover(target, attacker);
        const coverModifier = inCover ? 0.7 : 1; // Reduce hit chance by 30% if in cover
        
        // Final hit chance
        const hitChance = attacker.accuracy * distanceModifier * coverModifier;
        
        // Roll for hit
        const hitRoll = Math.random() * 100;
        const hit = hitRoll < hitChance;
        
        if (hit) {
            // Calculate damage
            const { damage, isCritical } = attacker.calculateDamage();
            
            // Apply damage to target
            target.health -= damage;
            if (target.health < 0) target.health = 0;
            
            // Update health bar
            this.updateHealthBar(target);
            
            // Create hit effect
            this.createHitEffect(target.model.position, isCritical);
            
            // Log the attack
            const critText = isCritical ? ' (CRITICAL)' : '';
            this.ui.addLogMessage(
                `${attacker.modelName} hits ${target.modelName} for ${damage} damage${critText}!`,
                isCritical ? 'success' : 'info'
            );
            
            // Check if target is defeated
            if (target.health <= 0) {
                this.defeatUnit(target);
            }
            
            // Custom on-hit effects for the attacker (for special abilities)
            if (attacker.onAttack) {
                attacker.onAttack();
            }
            
            // Custom on-damage effects for the target
            if (target.onDamage) {
                target.onDamage();
            }
        } else {
            // Create miss effect
            this.createMissEffect(target.model.position);
            
            // Log the miss
            this.ui.addLogMessage(`${attacker.modelName} misses ${target.modelName}!`, 'warning');
        }
        
        // Consume action points
        attacker.actionPoints -= 1;
        attacker.hasAttacked = true;
        
        // Clear selection if out of action points
        if (attacker.actionPoints <= 0) {
            this.selectedUnit = null;
            this.reachableCells = [];
            this.renderer.clearHighlights();
        }
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: this.selectedUnit
        });
        
        // Check for combat end
        this.checkCombatEnd();
    }
    
    /**
     * Create a hit effect at a position
     * @param {THREE.Vector3} position - Position for the effect
     * @param {boolean} isCritical - Whether the hit was critical
     */
    createHitEffect(position, isCritical) {
        // Create particle effect for hit
        const particleCount = isCritical ? 30 : 15;
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: isCritical ? 0xff0000 : 0xffff00,
            size: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 1] = position.y + Math.random() * 1.5;
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.5;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.renderer.scene.add(particles);
        
        // Animate particles
        const particlePositions = particleGeometry.attributes.position.array;
        const initialPositions = [...particlePositions];
        
        // Store initial time
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            
            // Update particle positions
            for (let i = 0; i < particleCount; i++) {
                particlePositions[i * 3] = initialPositions[i * 3] + (Math.random() - 0.5) * 0.2;
                particlePositions[i * 3 + 1] = initialPositions[i * 3 + 1] + elapsed * 2; // Move up
                particlePositions[i * 3 + 2] = initialPositions[i * 3 + 2] + (Math.random() - 0.5) * 0.2;
            }
            
            particleGeometry.attributes.position.needsUpdate = true;
            
            // Fade out
            particleMaterial.opacity = Math.max(0, 0.8 - elapsed);
            
            // Remove when done
            if (elapsed < 1) {
                requestAnimationFrame(animate);
            } else {
                this.renderer.scene.remove(particles);
                particleGeometry.dispose();
                particleMaterial.dispose();
            }
        };
        
        animate();
    }
    
    /**
     * Create a miss effect at a position
     * @param {THREE.Vector3} position - Position for the effect
     */
    createMissEffect(position) {
        // Create text sprite for miss
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        context.fillStyle = '#ffffff';
        context.font = 'bold 48px Arial';
        context.fillText('MISS', 10, 48);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(position.x, position.y + 2, position.z);
        sprite.scale.set(2, 1, 1);
        
        this.renderer.scene.add(sprite);
        
        // Animate sprite
        const startY = position.y + 2;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            
            // Move up and fade out
            sprite.position.y = startY + elapsed * 2;
            material.opacity = Math.max(0, 0.8 - elapsed);
            
            // Remove when done
            if (elapsed < 1) {
                requestAnimationFrame(animate);
            } else {
                this.renderer.scene.remove(sprite);
                texture.dispose();
                material.dispose();
            }
        };
        
        animate();
    }
    
    /**
     * Use an ability
     * @param {object} unit - Unit using the ability
     * @param {string} abilityId - ID of the ability to use
     * @param {object} target - Target for the ability (optional)
     */
    useAbility(unit, abilityId, target = null) {
        // Check if unit has this ability
        if (!unit.abilities.includes(abilityId)) {
            this.ui.addLogMessage(`${unit.modelName} doesn't have the ${abilityId} ability!`, 'error');
            return;
        }
        
        // Implement ability effects
        switch (abilityId) {
            case 'overwatch':
                // Set up overwatch effect
                unit.onOverwatch = true;
                this.ui.addLogMessage(`${unit.modelName} is on overwatch!`, 'info');
                unit.actionPoints -= 1;
                break;
                
            case 'focused_shot':
                // Increase accuracy and damage for next attack
                unit.applyStatusEffect({
                    type: 'focused',
                    duration: 1,
                    onApply: (u) => {
                        u.accuracy += 25;
                        u.damageRange = [
                            Math.floor(u.damageRange[0] * 1.2),
                            Math.floor(u.damageRange[1] * 1.2)
                        ];
                    },
                    onRemove: (u) => {
                        u.accuracy -= 25;
                        u.damageRange = [
                            Math.floor(u.damageRange[0] / 1.2),
                            Math.floor(u.damageRange[1] / 1.2)
                        ];
                    }
                });
                this.ui.addLogMessage(`${unit.modelName} is focusing for increased accuracy!`, 'info');
                unit.actionPoints -= 1;
                break;
                
            case 'sprint':
                // Double movement range for one turn
                unit.applyStatusEffect({
                    type: 'sprint',
                    duration: 1,
                    onApply: (u) => { u.moveRange *= 2; },
                    onRemove: (u) => { u.moveRange = Math.floor(u.moveRange / 2); }
                });
                this.ui.addLogMessage(`${unit.modelName} is sprinting!`, 'info');
                unit.actionPoints -= 1;
                break;
                
            case 'heal':
                // Implement healing effect
                if (!target) {
                    // Target selection UI should be shown
                    this.ui.addLogMessage('Select a target to heal!', 'info');
                    return;
                }
                
                const healAmount = 30;
                target.health = Math.min(target.health + healAmount, target.maxHealth);
                this.updateHealthBar(target);
                this.ui.addLogMessage(`${unit.modelName} heals ${target.modelName} for ${healAmount} health!`, 'success');
                unit.actionPoints -= 1;
                break;
                
            // Add more abilities as needed
                
            default:
                this.ui.addLogMessage(`Ability ${abilityId} not implemented yet!`, 'warning');
                return;
        }
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: this.selectedUnit
        });
        
        // Clear selection if out of action points
        if (unit.actionPoints <= 0) {
            this.selectedUnit = null;
            this.reachableCells = [];
            this.renderer.clearHighlights();
        }
    }
    
    /**
     * Use an item
     * @param {object} unit - Unit using the item
     * @param {string} itemId - ID of the item to use
     * @param {object} target - Target for the item (optional)
     */
    useItem(unit, itemId, target = null) {
        // Check if unit has this item
        if (!unit.items.includes(itemId)) {
            this.ui.addLogMessage(`${unit.modelName} doesn't have a ${itemId}!`, 'error');
            return;
        }
        
        // Implement item effects
        switch (itemId) {
            case 'medkit':
                // Heal self or target
                if (!target) target = unit;
                
                const healAmount = 30;
                target.health = Math.min(target.health + healAmount, target.maxHealth);
                this.updateHealthBar(target);
                this.ui.addLogMessage(`${unit.modelName} uses a medkit on ${target.modelName} for ${healAmount} health!`, 'success');
                
                // Remove item from inventory
                const itemIndex = unit.items.indexOf(itemId);
                unit.items.splice(itemIndex, 1);
                
                unit.actionPoints -= 1;
                break;
                
            case 'grenade':
                // Explode in an area
                if (!target) {
                    // Target selection UI should be shown
                    this.ui.addLogMessage('Select a target for the grenade!', 'info');
                    return;
                }
                
                const blastRadius = 2;
                const damage = 30;
                
                // Apply damage to all units in radius
                this.units.forEach(targetUnit => {
                    const distance = Math.abs(targetUnit.x - target.x) + Math.abs(targetUnit.y - target.y);
                    if (distance <= blastRadius) {
                        // Calculate damage with falloff
                        const actualDamage = Math.floor(damage * (1 - distance / (blastRadius + 1)));
                        targetUnit.health -= actualDamage;
                        if (targetUnit.health < 0) targetUnit.health = 0;
                        
                        this.updateHealthBar(targetUnit);
                        this.ui.addLogMessage(`${targetUnit.modelName} takes ${actualDamage} damage from grenade!`, 'info');
                        
                        // Check if target is defeated
                        if (targetUnit.health <= 0) {
                            this.defeatUnit(targetUnit);
                        }
                    }
                });
                
                // Create explosion effect at target
                this.createExplosionEffect(new THREE.Vector3(target.x + 0.5, 1, target.y + 0.5));
                
                // Remove item from inventory
                const grenadeIndex = unit.items.indexOf(itemId);
                unit.items.splice(grenadeIndex, 1);
                
                unit.actionPoints -= 1;
                break;
                
            // Add more items as needed
                
            default:
                this.ui.addLogMessage(`Item ${itemId} not implemented yet!`, 'warning');
                return;
        }
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: this.selectedUnit
        });
        
        // Clear selection if out of action points
        if (unit.actionPoints <= 0) {
            this.selectedUnit = null;
            this.reachableCells = [];
            this.renderer.clearHighlights();
        }
        
        // Check for combat end
        this.checkCombatEnd();
    }
    
    /**
     * Create an explosion effect at a position
     * @param {THREE.Vector3} position - Position for the explosion
     */
    createExplosionEffect(position) {
        // Create particle effect for explosion
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff5500,
            size: 0.3,
            transparent: true,
            opacity: 0.8
        });
        
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.renderer.scene.add(particles);
        
        // Create explosion light
        const light = new THREE.PointLight(0xff5500, 2, 10);
        light.position.copy(position);
        this.renderer.scene.add(light);
        
        // Animate explosion
        const startTime = Date.now();
        const duration = 1000; // ms
        const maxRadius = 3;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update particle positions
            const currentRadius = progress * maxRadius;
            
            for (let i = 0; i < particleCount; i++) {
                // Random direction
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                // Random distance (more particles near edge of explosion)
                const radius = currentRadius * (0.5 + Math.random() * 0.5);
                
                // Convert to cartesian coordinates
                positions[i * 3] = position.x + radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = position.y + radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = position.z + radius * Math.cos(phi);
            }
            
            particleGeometry.attributes.position.needsUpdate = true;
            
            // Fade out light and particles
            light.intensity = 2 * (1 - progress);
            particleMaterial.opacity = 0.8 * (1 - progress);
            
            // Remove when done
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.renderer.scene.remove(particles);
                this.renderer.scene.remove(light);
                particleGeometry.dispose();
                particleMaterial.dispose();
            }
        };
        
        animate();
    }
    
    /**
     * Check if a unit can attack a target
     * @param {object} attacker - Attacking unit
     * @param {object} target - Target unit
     * @returns {boolean} - Whether attack is possible
     */
    canAttack(attacker, target) {
        // Check if on different factions
        if (attacker.faction === target.faction) return false;
        
        // Check if attacker has already attacked
        if (attacker.hasAttacked) return false;
        
        // Check if attacker has action points
        if (attacker.actionPoints <= 0) return false;
        
        // Check if target is alive
        if (target.health <= 0) return false;
        
        // Check if target is in range
        const distance = Math.abs(target.x - attacker.x) + Math.abs(target.y - attacker.y);
        if (distance > attacker.attackRange) return false;
        
        // Check line of sight
        if (!this.hasLineOfSight(attacker.x, attacker.y, target.x, target.y)) return false;
        
        return true;
    }
    
    /**
     * Check if a unit is in cover from an attacker
     * @param {object} unit - Unit to check
     * @param {object} attacker - Attacking unit
     * @returns {boolean} - Whether unit is in cover
     */
    isUnitInCover(unit, attacker) {
        // Check if the unit is in a cover cell
        if (
            this.grid.grid[unit.y] && 
            this.grid.grid[unit.y][unit.x] && 
            this.grid.grid[unit.y][unit.x].type === 'cover'
        ) {
            // Simple cover check based on cardinal directions
            const dx = attacker.x - unit.x;
            const dy = attacker.y - unit.y;
            
            // Determine the main direction of attack
            if (Math.abs(dx) > Math.abs(dy)) {
                // Attack from sides
                const nx = unit.x + Math.sign(dx);
                const ny = unit.y;
                
                // Check if there's cover in that direction
                if (
                    nx >= 0 && nx < this.gridSize.width &&
                    ny >= 0 && ny < this.gridSize.height &&
                    (this.grid.grid[ny][nx].type === 'cover' || 
                     this.grid.grid[ny][nx].type === 'wall')
                ) {
                    return true;
                }
            } else {
                // Attack from top/bottom
                const nx = unit.x;
                const ny = unit.y + Math.sign(dy);
                
                // Check if there's cover in that direction
                if (
                    nx >= 0 && nx < this.gridSize.width &&
                    ny >= 0 && ny < this.gridSize.height &&
                    (this.grid.grid[ny][nx].type === 'cover' || 
                     this.grid.grid[ny][nx].type === 'wall')
                ) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get cells that can be attacked by a unit
     * @param {object} unit - Unit to get attackable cells for
     * @returns {Array} - Array of attackable cells
     */
    getAttackableCells(unit) {
        const attackableCells = [];
        
        // Check all cells in attack range
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                // Skip cells without enemies
                const cell = this.grid.grid[y][x];
                if (!cell || !cell.unit || cell.unit.faction === unit.faction || cell.unit.health <= 0) {
                    continue;
                }
                
                // Check if in range
                const distance = Math.abs(x - unit.x) + Math.abs(y - unit.y);
                if (distance > unit.attackRange) {
                    continue;
                }
                
                // Check line of sight
                if (!this.hasLineOfSight(unit.x, unit.y, x, y)) {
                    continue;
                }
                
                // This cell can be attacked
                attackableCells.push({ x, y });
            }
        }
        
        return attackableCells;
    }
    
    /**
     * Check if there is line of sight between two points
     * @param {number} x1 - Starting X coordinate
     * @param {number} y1 - Starting Y coordinate
     * @param {number} x2 - Ending X coordinate
     * @param {number} y2 - Ending Y coordinate
     * @returns {boolean} - Whether there is line of sight
     */
    hasLineOfSight(x1, y1, x2, y2) {
        return this.grid.hasLineOfSight(x1, y1, x2, y2);
    }
    
    /**
     * Get a path between two points
     * @param {object} unit - Unit to get path for
     * @param {number} targetX - Target X coordinate
     * @param {number} targetY - Target Y coordinate
     * @returns {Array} - Array of positions forming a path
     */
    getPath(unit, targetX, targetY) {
        return this.grid.getPath(unit.x, unit.y, targetX, targetY);
    }
    
    /**
     * Get reachable cells for a unit
     * @param {object} unit - Unit to get reachable cells for
     * @returns {Array} - Array of reachable cells
     */
    getReachableCells(unit) {
        return this.grid.getReachableCells(unit.x, unit.y, unit.moveRange);
    }
    
    /**
     * Check if a cell is valid for movement
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - Whether the cell is valid for movement
     */
    isCellValidForMovement(x, y) {
        return this.grid.isCellValidForMovement(x, y);
    }
    
    /**
     * Handle a unit being defeated
     * @param {object} unit - Unit that was defeated
     */
    defeatUnit(unit) {
        // Add log message
        this.ui.addLogMessage(`${unit.modelName} has been defeated!`, 'warning');
        
        // Remove unit model
        if (unit.model) {
            // Play death animation or fade out
            new TWEEN.Tween(unit.model.position)
                .to({ y: -1 }, 1000)
                .easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.renderer.scene.remove(unit.model);
                    if (unit.healthBar) {
                        this.renderer.scene.remove(unit.healthBar);
                    }
                })
                .start();
        }
        
        // Remove unit from grid
        this.grid.grid[unit.y][unit.x].unit = null;
        
        // Grant experience to player units if an enemy was defeated
        if (unit.faction === 'enemy') {
            const expGain = 20;
            this.units.forEach(playerUnit => {
                if (playerUnit.faction === 'player' && playerUnit.health > 0) {
                    if (playerUnit.gainExperience) {
                        const leveledUp = playerUnit.gainExperience(expGain);
                        if (leveledUp) {
                            this.ui.addLogMessage(`${playerUnit.modelName} leveled up to level ${playerUnit.level}!`, 'success');
                        }
                    }
                }
            });
        }
        
        // Check for combat end
        this.checkCombatEnd();
    }
    
    /**
     * End the player's turn
     */
    endPlayerTurn() {
        // Clear selection
        this.selectedUnit = null;
        this.reachableCells = [];
        this.renderer.clearHighlights();
        
        // Set to enemy turn
        this.currentTurn = 'enemy';
        this.ui.updateTurnIndicator('enemy');
        this.ui.addLogMessage('Enemy turn', 'info');
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: null
        });
        
        // Execute enemy turn after a short delay
        setTimeout(() => {
            this.executeEnemyTurn();
        }, 1000);
    }
    
    /**
     * Execute the enemy's turn
     */
    async executeEnemyTurn() {
        // Execute AI actions
        await this.ai.executeTurn();
        
        // End enemy turn
        this.endEnemyTurn();
    }
    
    /**
     * End the enemy's turn
     */
    endEnemyTurn() {
        // Set back to player turn
        this.currentTurn = 'player';
        this.ui.updateTurnIndicator('player');
        this.ui.addLogMessage('Player turn', 'info');
        
        // Reset all player units
        this.units.forEach(unit => {
            if (unit.faction === 'player' && unit.health > 0) {
                unit.resetForNewTurn();
            }
        });
        
        // Update UI
        this.ui.update({
            currentTurn: this.currentTurn,
            selectedUnit: null
        });
        
        // Check for combat end
        this.checkCombatEnd();
    }
    
    /**
     * Check if combat has ended
     */
    checkCombatEnd() {
        // Count alive units for each faction
        const alivePlayers = this.units.filter(unit => unit.faction === 'player' && unit.health > 0).length;
        const aliveEnemies = this.units.filter(unit => unit.faction === 'enemy' && unit.health > 0).length;
        
        // Check win/loss conditions
        if (alivePlayers === 0) {
            // All player units defeated - lose
            this.endCombat('defeat');
        } else if (aliveEnemies === 0) {
            // All enemy units defeated - win
            this.endCombat('victory');
        }
    }
    
    /**
     * End combat with a result
     * @param {string} result - Combat result ('victory' or 'defeat')
     */
    endCombat(result) {
        // Stop animations
        this.renderer.stopAnimationLoop();
        
        // Create result screen
        const resultScreen = document.createElement('div');
        resultScreen.className = `combat-result ${result}`;
        resultScreen.innerHTML = `
            <h2>${result === 'victory' ? 'Victory!' : 'Defeat!'}</h2>
            <p>${result === 'victory' 
                ? 'Your squad has eliminated all enemies.' 
                : 'Your squad has been defeated.'}</p>
            <button id="combat-continue-btn">Continue</button>
        `;
        
        this.container.appendChild(resultScreen);
        
        // Add continue button handler
        document.getElementById('combat-continue-btn').addEventListener('click', () => {
            // Clean up combat
            this.cleanup();
            
            // Return to world map or previous screen
            if (typeof combatScene.onCombatEnd === 'function') {
                combatScene.onCombatEnd(result);
            }
        });
    }
    
    /**
     * Clean up combat resources
     */
    cleanup() {
        // Clear all objects from scene
        while (this.renderer.scene.children.length > 0) {
            const object = this.renderer.scene.children[0];
            this.renderer.scene.remove(object);
        }
        
        // Remove render canvas
        if (this.renderer.renderer.domElement.parentNode) {
            this.renderer.renderer.domElement.parentNode.removeChild(this.renderer.renderer.domElement);
        }
        
        // Clear event listeners
        window.removeEventListener('resize', this.renderer.onWindowResize);
    }
}