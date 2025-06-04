// ui.js - UI components for combat system

/**
 * Manages the combat UI elements
 */
export class CombatUI {
    constructor(container) {
        this.container = container;
        this.actionButtons = [];
        this.unitStatsPopup = null;
        this.turnIndicator = null;
        this.messageLog = null;
        this.abilityPanel = null;
    }
    
    /**
     * Initialize the UI elements
     */
    initialize() {
        this.createTurnIndicator();
        this.createMessageLog();
        this.createActionButtons();
        this.createAbilityPanel();
        this.createDevCloseButton();
        
        return this;
    }
    
    /**
     * Create developer close button for easy exit during development
     */
    createDevCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.className = 'combat-dev-close';
        closeButton.innerHTML = 'X';
        closeButton.title = 'Developer Close (Exit Combat)';
        
        // Add event listener to close combat
        closeButton.addEventListener('click', () => {
            // Log the action
            console.log('Developer close button clicked - exiting combat');
            
            try {
                // Add visual feedback when button is clicked
                closeButton.style.backgroundColor = '#990000';
                closeButton.innerHTML = '✓';
                
                // Log message if available
                if (typeof this.addLogMessage === 'function') {
                    this.addLogMessage('Developer close button clicked - exiting combat', 'warning');
                }
                
                // GUARANTEED CLOSE METHOD:
                // First try the onCombatEnd handler
                if (this.container && typeof this.container.onCombatEnd === 'function') {
                    console.log('Closing via onCombatEnd handler');
                    setTimeout(() => {
                        this.container.onCombatEnd({ 
                            outcome: 'developer_exit',
                            message: 'Combat was closed using the developer exit button' 
                        });
                    }, 300);
                } 
                // Then try to remove combat container from DOM
                else if (this.container && this.container.parentNode) {
                    console.log('Closing by removing container from DOM');
                    this.container.parentNode.removeChild(this.container);
                } 
                // Last resort: hide the container
                else if (this.container) {
                    console.log('Closing by hiding container');
                    this.container.style.display = 'none';
                    
                    // Find and close any open popups too
                    const popups = document.querySelectorAll('.unit-stats-popup');
                    popups.forEach(popup => {
                        popup.style.display = 'none';
                    });
                }
                
                // Force reload if nothing else works
                setTimeout(() => {
                    const combatContainers = document.querySelectorAll('.combat-container');
                    if (combatContainers.length > 0) {
                        console.log('Force closing all combat containers');
                        combatContainers.forEach(container => {
                            container.style.display = 'none';
                        });
                    }
                }, 500);
                
            } catch (error) {
                console.error('Error closing combat:', error);
                alert('Error closing combat. Check console for details.');
            }
        });
        
        this.container.appendChild(closeButton);
    }
    
    /**
     * Create the turn indicator
     */
    createTurnIndicator() {
        this.turnIndicator = document.createElement('div');
        this.turnIndicator.className = 'combat-turn-indicator';
        this.turnIndicator.innerHTML = '<span>Player Turn</span>';
        this.container.appendChild(this.turnIndicator);
    }
    
    /**
     * Create the message log
     */
    createMessageLog() {
        this.messageLog = document.createElement('div');
        this.messageLog.className = 'combat-message-log';
        this.messageLog.innerHTML = '<h3>Combat Log</h3><div class="log-messages"></div>';
        this.container.appendChild(this.messageLog);
    }
    
    /**
     * Create action buttons
     */
    createActionButtons() {
        const actionBar = document.createElement('div');
        actionBar.className = 'combat-action-bar';
        
        // Define action buttons
        const buttonDefinitions = [
            { id: 'move', text: 'Move', icon: '🚶', action: 'move' },
            { id: 'attack', text: 'Attack', icon: '⚔️', action: 'attack' },
            { id: 'ability', text: 'Abilities', icon: '✨', action: 'ability' },
            { id: 'item', text: 'Items', icon: '🎒', action: 'item' },
            { id: 'end-turn', text: 'End Turn', icon: '⏭️', action: 'endTurn' }
        ];
        
        // Create each button
        buttonDefinitions.forEach(btn => {
            const button = document.createElement('button');
            button.id = `combat-${btn.id}-btn`;
            button.className = 'combat-action-button';
            button.dataset.action = btn.action;
            button.innerHTML = `<span class="icon">${btn.icon}</span><span class="text">${btn.text}</span>`;
            
            // Store reference to the button
            this.actionButtons.push(button);
            
            // Add button to the action bar
            actionBar.appendChild(button);
        });
        
        this.container.appendChild(actionBar);
    }
    
    /**
     * Create ability panel
     */
    createAbilityPanel() {
        this.abilityPanel = document.createElement('div');
        this.abilityPanel.className = 'combat-ability-panel';
        this.abilityPanel.innerHTML = '<h3>Abilities</h3><div class="abilities-container"></div>';
        this.abilityPanel.style.display = 'none';
        this.container.appendChild(this.abilityPanel);
    }
    
    /**
     * Show the unit stats popup
     * @param {object} unit - Unit to show stats for
     * @param {number} x - X position for the popup
     * @param {number} y - Y position for the popup
     */
    showUnitStatsPopup(unit, x, y) {
        // Remove any existing popup
        if (this.unitStatsPopup) {
            this.unitStatsPopup.remove();
            this.unitStatsPopup = null;
        }
        
        console.log(`Showing stats popup for ${unit.modelName} at screen position (${x}, ${y})`);
        // Force stat popup to show - this is for debugging the popup creation

        // Create the popup div
        this.unitStatsPopup = document.createElement('div');
        this.unitStatsPopup.className = 'combat-unit-stats-popup';
        // Calculate position to ensure popup stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupWidth = 240;
        const popupHeight = 250; // Approximate height
        
        // Adjust x position to keep popup within viewport
        let adjustedX = x;
        if (x + popupWidth > viewportWidth) {
            adjustedX = viewportWidth - popupWidth - 10;
        }
        
        // Adjust y position to keep popup within viewport
        let adjustedY = y;
        if (y + popupHeight > viewportHeight) {
            adjustedY = viewportHeight - popupHeight - 10;
        }
        
        this.unitStatsPopup.style.cssText = `
            position: absolute;
            left: ${adjustedX}px;
            top: ${adjustedY}px;
            width: 240px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 2100;
            background-color: rgba(0, 0, 0, 0.9);
            color: #baa88f;
            border: 2px solid #4a3f35;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 100, 0, 0.3);
            font-family: 'Cinzel', serif;
        `;

        // Populate the popup with unit stats using Lord Tsarcasm styling
        const unitName = unit.modelName.charAt(0).toUpperCase() + unit.modelName.slice(1);
        const factionName = unit.faction.charAt(0).toUpperCase() + unit.faction.slice(1);
        
        let statsHTML = `
            <h3>${unitName}</h3>
            <p>Faction: ${factionName}</p>
            <p>Health: <span style="color: ${unit.health < unit.maxHealth * 0.3 ? '#ff0000' : '#ff6400'}">${unit.health}/${unit.maxHealth}</span></p>
            <p>Action Points: <span style="color: #ffcc00">${unit.actionPoints}/${unit.maxActionPoints}</span></p>
            <p>Attack Range: ${unit.attackRange}</p>
            <p>Accuracy: ${unit.accuracy}%</p>
        `;
        
        // Add class-specific info for player units with Lord Tsarcasm styling
        if (unit.faction === 'player') {
            statsHTML += `<p>Class: <span style="color: #ff6400">${unit.class.charAt(0).toUpperCase() + unit.class.slice(1)}</span></p>`;
            if (unit.items.length > 0) {
                statsHTML += `<p>Items: <span style="color: #baa88f">${unit.items.join(', ')}</span></p>`;
            }
            if (unit.abilities.length > 0) {
                statsHTML += `<p>Abilities: <span style="color: #baa88f">${unit.abilities.join(', ')}</span></p>`;
            }
        } else {
            statsHTML += `<p>Type: <span style="color: #ff0000">${unit.type}</span></p>`;
            if (unit.abilities.length > 0) {
                statsHTML += `<p>Abilities: <span style="color: #baa88f">${unit.abilities.join(', ')}</span></p>`;
            }
        }
        
        // Add status effects with Lord Tsarcasm styling
        if (unit.statusEffects.length > 0) {
            statsHTML += `<p>Status Effects: <span style="color: #ffcc00">${unit.statusEffects.map(e => e.type).join(', ')}</span></p>`;
        }

        // Add a close button
        const closeButtonHTML = `<button class="stats-close-button" style="position:absolute;top:5px;right:5px;width:25px;height:25px;background-color:#990000;color:white;border:none;border-radius:50%;font-weight:bold;cursor:pointer;font-size:12px;">✕</button>`;
        
        // Combine stats and close button
        this.unitStatsPopup.innerHTML = closeButtonHTML + statsHTML;
        this.container.appendChild(this.unitStatsPopup);
        
        // Add event listener to close button
        this.unitStatsPopup.querySelector('.stats-close-button').addEventListener('click', () => {
            if (this.unitStatsPopup) {
                this.unitStatsPopup.remove();
                this.unitStatsPopup = null;
            }
        });

        // Add a click handler to close the popup when clicking outside
        const closePopup = (e) => {
            // First check if popup exists to prevent null reference error
            if (this.unitStatsPopup) {
                if (!this.unitStatsPopup.contains(e.target)) {
                    this.unitStatsPopup.remove();
                    this.unitStatsPopup = null;
                    document.removeEventListener('click', closePopup);
                }
            } else {
                // If popup is already gone, remove the event listener
                document.removeEventListener('click', closePopup);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closePopup);
        }, 0);
    }
    
    /**
     * Update the turn indicator
     * @param {string} turn - Current turn ('player' or 'enemy')
     */
    updateTurnIndicator(turn) {
        if (!this.turnIndicator) return;
        
        this.turnIndicator.innerHTML = `<span>${turn.charAt(0).toUpperCase() + turn.slice(1)} Turn</span>`;
        this.turnIndicator.className = `combat-turn-indicator ${turn}-turn`;
    }
    
    /**
     * Add a message to the combat log
     * @param {string} message - Message to add
     * @param {string} type - Message type (info, success, warning, error)
     */
    addLogMessage(message, type = 'info') {
        if (!this.messageLog) return;
        
        const messagesContainer = this.messageLog.querySelector('.log-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `log-message ${type}`;
        messageElement.textContent = message;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Remove old messages if there are too many
        const maxMessages = 50;
        const messages = messagesContainer.querySelectorAll('.log-message');
        if (messages.length > maxMessages) {
            for (let i = 0; i < messages.length - maxMessages; i++) {
                messagesContainer.removeChild(messages[i]);
            }
        }
    }
    
    /**
     * Show abilities for a unit
     * @param {object} unit - Unit to show abilities for
     * @param {Function} onAbilitySelect - Callback when ability is selected
     */
    showAbilities(unit, onAbilitySelect) {
        if (!this.abilityPanel || !unit.abilities || unit.abilities.length === 0) return;
        
        const abilitiesContainer = this.abilityPanel.querySelector('.abilities-container');
        abilitiesContainer.innerHTML = '';
        
        const abilityDescriptions = {
            'overwatch': {
                name: 'Overwatch',
                description: 'Attack any enemy that moves into your line of sight on their turn',
                apCost: 1,
                icon: '👁️'
            },
            'focused_shot': {
                name: 'Focused Shot',
                description: '+25% accuracy, +20% damage',
                apCost: 1,
                icon: '🎯'
            },
            'sprint': {
                name: 'Sprint',
                description: 'Double movement range for one turn',
                apCost: 1,
                icon: '🏃'
            },
            'stealth': {
                name: 'Stealth',
                description: 'Become harder to detect for 2 turns',
                apCost: 1,
                icon: '👤'
            },
            'suppression': {
                name: 'Suppression',
                description: 'Reduce target\'s action points and accuracy',
                apCost: 1,
                icon: '🔫'
            },
            'grenade': {
                name: 'Grenade',
                description: 'Throw a grenade that damages all units in an area',
                apCost: 1,
                icon: '💣'
            },
            'heal': {
                name: 'Heal',
                description: 'Restore health to an ally',
                apCost: 1,
                icon: '💉'
            },
            'stim_pack': {
                name: 'Stim Pack',
                description: 'Give an ally +1 action point for one turn',
                apCost: 1,
                icon: '💪'
            },
            'headshot': {
                name: 'Headshot',
                description: 'High accuracy attack with 3x critical chance',
                apCost: 2,
                icon: '🎯'
            },
            'mark_target': {
                name: 'Mark Target',
                description: 'Mark an enemy, giving all allies +20% accuracy against it',
                apCost: 1,
                icon: '🔍'
            },
            'charge': {
                name: 'Charge',
                description: 'Rush at an enemy, dealing damage',
                apCost: 1,
                icon: '🏃'
            },
            'slam': {
                name: 'Slam',
                description: 'Powerful melee attack that stuns the target',
                apCost: 2,
                icon: '👊'
            },
            'fly': {
                name: 'Fly',
                description: 'Move to any empty space within range',
                apCost: 1,
                icon: '🦇'
            },
            'screech': {
                name: 'Screech',
                description: 'Reduce all nearby enemies\' accuracy',
                apCost: 1,
                icon: '🔊'
            },
            'psychic_blast': {
                name: 'Psychic Blast',
                description: 'Mental attack that ignores cover',
                apCost: 1,
                icon: '🧠'
            },
            'mind_control': {
                name: 'Mind Control',
                description: 'Take control of an enemy for one turn',
                apCost: 2,
                icon: '🔮'
            },
            'trample': {
                name: 'Trample',
                description: 'Run through multiple enemies, damaging them all',
                apCost: 2,
                icon: '🐘'
            }
        };
        
        // Create ability buttons
        unit.abilities.forEach(abilityId => {
            const ability = abilityDescriptions[abilityId] || {
                name: abilityId.charAt(0).toUpperCase() + abilityId.slice(1),
                description: 'No description available',
                apCost: 1,
                icon: '❓'
            };
            
            const abilityElement = document.createElement('div');
            abilityElement.className = 'combat-ability';
            abilityElement.dataset.ability = abilityId;
            
            // Disable ability if not enough AP
            const disabled = unit.actionPoints < ability.apCost;
            if (disabled) {
                abilityElement.classList.add('disabled');
            }
            
            abilityElement.innerHTML = `
                <div class="ability-icon">${ability.icon}</div>
                <div class="ability-details">
                    <div class="ability-name">${ability.name}</div>
                    <div class="ability-description">${ability.description}</div>
                    <div class="ability-cost">AP Cost: ${ability.apCost}</div>
                </div>
            `;
            
            if (!disabled) {
                abilityElement.addEventListener('click', () => {
                    if (onAbilitySelect) {
                        onAbilitySelect(abilityId, ability);
                    }
                    this.hideAbilities();
                });
            }
            
            abilitiesContainer.appendChild(abilityElement);
        });
        
        this.abilityPanel.style.display = 'block';
    }
    
    /**
     * Hide the abilities panel
     */
    hideAbilities() {
        if (this.abilityPanel) {
            this.abilityPanel.style.display = 'none';
        }
    }
    
    /**
     * Show the item menu for a unit
     * @param {object} unit - Unit to show items for
     * @param {Function} onItemSelect - Callback when item is selected
     */
    showItems(unit, onItemSelect) {
        // Create a similar panel to abilities
        const itemPanel = document.createElement('div');
        itemPanel.className = 'combat-item-panel';
        itemPanel.innerHTML = '<h3>Items</h3><div class="items-container"></div>';
        
        const itemsContainer = itemPanel.querySelector('.items-container');
        
        // Item descriptions
        const itemDescriptions = {
            'medkit': {
                name: 'Medkit',
                description: 'Restore 30 health to self or ally',
                icon: '🩹'
            },
            'grenade': {
                name: 'Grenade',
                description: 'Deal 30 damage to all units in a 2-tile radius',
                icon: '💣'
            },
            'stim': {
                name: 'Stimulant',
                description: 'Gain +1 action point for this turn',
                icon: '💉'
            },
            'smoke': {
                name: 'Smoke Grenade',
                description: 'Create smoke in a 3-tile radius, reducing accuracy by 50%',
                icon: '💨'
            }
        };
        
        // Create item buttons
        if (unit.items && unit.items.length > 0) {
            unit.items.forEach(itemId => {
                const item = itemDescriptions[itemId] || {
                    name: itemId.charAt(0).toUpperCase() + itemId.slice(1),
                    description: 'No description available',
                    icon: '📦'
                };
                
                const itemElement = document.createElement('div');
                itemElement.className = 'combat-item';
                itemElement.dataset.item = itemId;
                
                itemElement.innerHTML = `
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${item.description}</div>
                    </div>
                `;
                
                itemElement.addEventListener('click', () => {
                    if (onItemSelect) {
                        onItemSelect(itemId, item);
                    }
                    itemPanel.remove();
                });
                
                itemsContainer.appendChild(itemElement);
            });
        } else {
            itemsContainer.innerHTML = '<div class="no-items">No items available</div>';
        }
        
        this.container.appendChild(itemPanel);
        
        // Add a click handler to close the panel when clicking outside
        const closePanel = (e) => {
            if (!itemPanel.contains(e.target)) {
                itemPanel.remove();
                document.removeEventListener('click', closePanel);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closePanel);
        }, 0);
    }
    
    /**
     * Set the enabled state of action buttons
     * @param {string} action - Action to enable/disable
     * @param {boolean} enabled - Whether the action is enabled
     */
    setActionEnabled(action, enabled) {
        const button = this.actionButtons.find(btn => btn.dataset.action === action);
        if (button) {
            if (enabled) {
                button.classList.remove('disabled');
                button.disabled = false;
            } else {
                button.classList.add('disabled');
                button.disabled = true;
            }
        }
    }
    
    /**
     * Set the active state of an action button
     * @param {string} action - Action to set active/inactive
     * @param {boolean} active - Whether the action is active
     */
    setActionActive(action, active) {
        this.actionButtons.forEach(btn => {
            if (btn.dataset.action === action) {
                if (active) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    /**
     * Clear all active states
     */
    clearActiveActions() {
        this.actionButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    /**
     * Update the UI based on the current state
     * @param {object} state - Current combat state
     */
    update(state) {
        // Update turn indicator
        this.updateTurnIndicator(state.currentTurn);
        
        // Update button states based on the selected unit and current turn
        if (state.currentTurn === 'player') {
            const selectedUnit = state.selectedUnit;
            
            if (selectedUnit) {
                // Enable/disable actions based on unit state
                this.setActionEnabled('move', selectedUnit.actionPoints > 0 && !selectedUnit.hasMoved);
                this.setActionEnabled('attack', selectedUnit.actionPoints > 0 && !selectedUnit.hasAttacked);
                this.setActionEnabled('ability', selectedUnit.actionPoints > 0 && selectedUnit.abilities && selectedUnit.abilities.length > 0);
                this.setActionEnabled('item', selectedUnit.actionPoints > 0 && selectedUnit.items && selectedUnit.items.length > 0);
            } else {
                // No unit selected, disable all but end turn
                this.setActionEnabled('move', false);
                this.setActionEnabled('attack', false);
                this.setActionEnabled('ability', false);
                this.setActionEnabled('item', false);
            }
            
            // Always enable end turn during player turn
            this.setActionEnabled('endTurn', true);
        } else {
            // During enemy turn, disable all actions
            this.setActionEnabled('move', false);
            this.setActionEnabled('attack', false);
            this.setActionEnabled('ability', false);
            this.setActionEnabled('item', false);
            this.setActionEnabled('endTurn', false);
        }
    }
}