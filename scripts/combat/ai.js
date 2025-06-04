// ai.js - AI for combat enemies

/**
 * Handles AI behavior for enemy units
 */
export class CombatAI {
    constructor(combatManager) {
        this.combatManager = combatManager;
        this.actionDelay = 800; // Delay between AI actions in ms
    }
    
    /**
     * Execute the AI turn for all enemy units
     * @returns {Promise} - Resolves when AI turn is complete
     */
    async executeTurn() {
        // Get all enemy units that can act
        const enemies = this.combatManager.units.filter(unit => 
            unit.faction === 'enemy' && unit.health > 0
        );
        
        // Sort by priority based on behavior type and health
        const sortedEnemies = this.prioritizeUnits(enemies);
        
        // Execute each enemy's turn
        for (const enemy of sortedEnemies) {
            await this.executeUnitTurn(enemy);
        }
        
        // Return a resolved promise when all units have acted
        return Promise.resolve();
    }
    
    /**
     * Prioritize units for AI turn execution
     * @param {Array} units - Array of enemy units
     * @returns {Array} - Sorted array of units
     */
    prioritizeUnits(units) {
        // Priority order for behaviors (highest to lowest)
        const behaviorPriority = {
            'tactical': 5,    // Leaders and coordinated enemies act first
            'support': 4,     // Support units with healing/buffs
            'hit_and_run': 3, // Fast attackers
            'defensive': 2,   // Defensive units
            'aggressive': 1   // Basic attackers
        };
        
        return [...units].sort((a, b) => {
            // First sort by behavior priority
            const aPriority = behaviorPriority[a.behavior] || 0;
            const bPriority = behaviorPriority[b.behavior] || 0;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            // Then by health percentage (wounded units act first)
            const aHealthPct = a.health / a.maxHealth;
            const bHealthPct = b.health / b.maxHealth;
            
            return aHealthPct - bHealthPct;
        });
    }
    
    /**
     * Execute a turn for a single enemy unit
     * @param {object} unit - Enemy unit
     * @returns {Promise} - Resolves when unit's turn is complete
     */
    async executeUnitTurn(unit) {
        return new Promise(async (resolve) => {
            // Reset the unit for the new turn
            unit.resetForNewTurn();
            
            // Execute actions while the unit can still act
            while (unit.canAct()) {
                // Analyze the situation
                const situation = this.analyzeSituation(unit);
                
                // Determine the best action
                const action = this.determineBestAction(unit, situation);
                
                // Perform the action
                await this.performAction(unit, action, situation);
                
                // Add a delay between actions
                await new Promise(r => setTimeout(r, this.actionDelay));
            }
            
            resolve();
        });
    }
    
    /**
     * Analyze the combat situation for a unit
     * @param {object} unit - Enemy unit
     * @returns {object} - Situation analysis
     */
    analyzeSituation(unit) {
        const situation = {
            visibleEnemies: [],
            attackableEnemies: [],
            nearbyAllies: [],
            nearestEnemy: null,
            lowestHealthEnemy: null,
            highestThreatEnemy: null,
            bestCoverPosition: null,
            shouldRetreat: false
        };
        
        // Get all player units
        const playerUnits = this.combatManager.units.filter(u => 
            u.faction === 'player' && u.health > 0
        );
        
        // Get all other enemy units
        const enemyUnits = this.combatManager.units.filter(u => 
            u.faction === 'enemy' && u !== unit && u.health > 0
        );
        
        // Identify visible enemies (implement line of sight)
        situation.visibleEnemies = playerUnits.filter(enemy => 
            this.combatManager.hasLineOfSight(unit.x, unit.y, enemy.x, enemy.y)
        );
        
        // Identify attackable enemies (within attack range and visible)
        situation.attackableEnemies = situation.visibleEnemies.filter(enemy => 
            this.getDistance(unit.x, unit.y, enemy.x, enemy.y) <= unit.attackRange
        );
        
        // Find nearby allies (within 5 tiles)
        situation.nearbyAllies = enemyUnits.filter(ally => 
            this.getDistance(unit.x, unit.y, ally.x, ally.y) <= 5
        );
        
        // Find nearest enemy
        if (situation.visibleEnemies.length > 0) {
            situation.nearestEnemy = situation.visibleEnemies.reduce((nearest, enemy) => {
                const distance = this.getDistance(unit.x, unit.y, enemy.x, enemy.y);
                const nearestDistance = nearest ? this.getDistance(unit.x, unit.y, nearest.x, nearest.y) : Infinity;
                return distance < nearestDistance ? enemy : nearest;
            }, null);
        }
        
        // Find lowest health enemy
        if (situation.visibleEnemies.length > 0) {
            situation.lowestHealthEnemy = situation.visibleEnemies.reduce((lowest, enemy) => {
                return (enemy.health < (lowest ? lowest.health : Infinity)) ? enemy : lowest;
            }, null);
        }
        
        // Determine if the unit should retreat (low health)
        situation.shouldRetreat = unit.health < unit.maxHealth * 0.3;
        
        // Find best cover position (if not already in cover)
        // This is a simplified version, actual implementation would check for proper cover
        situation.bestCoverPosition = this.findBestCoverPosition(unit, situation);
        
        return situation;
    }
    
    /**
     * Find the best cover position for a unit
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object|null} - Best cover position or null if none found
     */
    findBestCoverPosition(unit, situation) {
        // Implement a more sophisticated cover finding algorithm here
        // For simplicity, just find a cell with cover that's away from enemies
        
        const maxSearchRadius = 5; // Don't search too far
        const coverPositions = [];
        
        // Check cells in a radius around the unit
        for (let dx = -maxSearchRadius; dx <= maxSearchRadius; dx++) {
            for (let dy = -maxSearchRadius; dy <= maxSearchRadius; dy++) {
                const x = unit.x + dx;
                const y = unit.y + dy;
                
                // Skip invalid positions or current position
                if (
                    x < 0 || x >= this.combatManager.gridSize.width ||
                    y < 0 || y >= this.combatManager.gridSize.height ||
                    (x === unit.x && y === unit.y)
                ) {
                    continue;
                }
                
                // Check if cell is cover and empty
                const cell = this.combatManager.grid[y][x];
                if (cell && cell.type === 'cover' && !cell.unit) {
                    // Calculate score based on distance from enemies
                    let score = 0;
                    
                    // Prefer positions further from enemies
                    situation.visibleEnemies.forEach(enemy => {
                        const distance = this.getDistance(x, y, enemy.x, enemy.y);
                        score += distance;
                    });
                    
                    // Prefer positions not too far from the unit's current position
                    const distanceFromUnit = this.getDistance(x, y, unit.x, unit.y);
                    score -= distanceFromUnit * 2;
                    
                    coverPositions.push({ x, y, score });
                }
            }
        }
        
        // Sort by score (highest first)
        coverPositions.sort((a, b) => b.score - a.score);
        
        // Return the best position or null if none found
        return coverPositions.length > 0 ? coverPositions[0] : null;
    }
    
    /**
     * Determine the best action for a unit
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineBestAction(unit, situation) {
        // Based on behavior and situation, determine the best action
        switch (unit.behavior) {
            case 'aggressive':
                return this.determineAggressiveAction(unit, situation);
            case 'hit_and_run':
                return this.determineHitAndRunAction(unit, situation);
            case 'support':
                return this.determineSupportAction(unit, situation);
            case 'tactical':
                return this.determineTacticalAction(unit, situation);
            case 'defensive':
                return this.determineDefensiveAction(unit, situation);
            default:
                return this.determineAggressiveAction(unit, situation);
        }
    }
    
    /**
     * Determine action for aggressive behavior
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineAggressiveAction(unit, situation) {
        // Aggressive units prioritize attacking
        if (situation.attackableEnemies.length > 0) {
            // If can attack, attack lowest health enemy
            return {
                type: 'attack',
                target: situation.lowestHealthEnemy || situation.attackableEnemies[0]
            };
        } else if (situation.nearestEnemy) {
            // Move towards nearest enemy
            return {
                type: 'move',
                target: {
                    x: situation.nearestEnemy.x,
                    y: situation.nearestEnemy.y
                }
            };
        } else {
            // Move randomly
            return {
                type: 'move',
                target: this.getRandomPosition(unit)
            };
        }
    }
    
    /**
     * Determine action for hit-and-run behavior
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineHitAndRunAction(unit, situation) {
        // Hit and run units attack then retreat
        if (unit.hasAttacked) {
            // If already attacked, retreat to cover
            if (situation.bestCoverPosition) {
                return {
                    type: 'move',
                    target: situation.bestCoverPosition
                };
            } else {
                // Move away from nearest enemy
                return {
                    type: 'retreat',
                    target: situation.nearestEnemy
                };
            }
        } else if (situation.attackableEnemies.length > 0) {
            // If can attack, attack
            return {
                type: 'attack',
                target: situation.attackableEnemies[0]
            };
        } else if (situation.nearestEnemy) {
            // Move to attack range of enemy
            return {
                type: 'move',
                target: {
                    x: situation.nearestEnemy.x,
                    y: situation.nearestEnemy.y
                }
            };
        } else {
            // Move randomly
            return {
                type: 'move',
                target: this.getRandomPosition(unit)
            };
        }
    }
    
    /**
     * Determine action for support behavior
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineSupportAction(unit, situation) {
        // Support units prioritize abilities and helping allies
        if (unit.abilities.includes('heal') && situation.nearbyAllies.some(ally => ally.health < ally.maxHealth * 0.7)) {
            // Find wounded ally to heal
            const woundedAlly = situation.nearbyAllies.filter(
                ally => ally.health < ally.maxHealth * 0.7
            ).sort((a, b) => a.health - b.health)[0];
            
            return {
                type: 'ability',
                ability: 'heal',
                target: woundedAlly
            };
        } else if (unit.abilities.includes('psychic_blast') && situation.attackableEnemies.length > 0) {
            // Use psychic blast on enemies
            return {
                type: 'ability',
                ability: 'psychic_blast',
                target: situation.highestThreatEnemy || situation.attackableEnemies[0]
            };
        } else if (situation.attackableEnemies.length > 0) {
            // If can attack, attack
            return {
                type: 'attack',
                target: situation.attackableEnemies[0]
            };
        } else if (situation.nearestEnemy) {
            // Stay at medium distance from enemies
            const idealDistance = Math.floor(unit.attackRange * 0.7);
            const currentDistance = this.getDistance(unit.x, unit.y, situation.nearestEnemy.x, situation.nearestEnemy.y);
            
            if (currentDistance < idealDistance - 1) {
                // Too close, move away
                return {
                    type: 'retreat',
                    target: situation.nearestEnemy
                };
            } else if (currentDistance > idealDistance + 1) {
                // Too far, move closer
                return {
                    type: 'move',
                    target: {
                        x: situation.nearestEnemy.x,
                        y: situation.nearestEnemy.y
                    }
                };
            } else {
                // Good distance, stay put
                return {
                    type: 'defend'
                };
            }
        } else {
            // Move to allies
            if (situation.nearbyAllies.length > 0) {
                const ally = situation.nearbyAllies[0];
                return {
                    type: 'move',
                    target: {
                        x: ally.x,
                        y: ally.y
                    }
                };
            } else {
                // Move randomly
                return {
                    type: 'move',
                    target: this.getRandomPosition(unit)
                };
            }
        }
    }
    
    /**
     * Determine action for tactical behavior
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineTacticalAction(unit, situation) {
        // Tactical units use abilities and position strategically
        if (unit.abilities.includes('overwatch') && !unit.hasAttacked && situation.visibleEnemies.length > 0) {
            // Use overwatch if enemies are visible
            return {
                type: 'ability',
                ability: 'overwatch'
            };
        } else if (unit.abilities.includes('suppression') && situation.attackableEnemies.length > 0) {
            // Use suppression on most dangerous enemy
            return {
                type: 'ability',
                ability: 'suppression',
                target: situation.highestThreatEnemy || situation.attackableEnemies[0]
            };
        } else if (situation.attackableEnemies.length > 0) {
            // If can attack, attack
            return {
                type: 'attack',
                target: situation.highestThreatEnemy || situation.attackableEnemies[0]
            };
        } else if (situation.bestCoverPosition) {
            // Move to cover if available
            return {
                type: 'move',
                target: situation.bestCoverPosition
            };
        } else if (situation.nearestEnemy) {
            // Move to ideal range from enemy
            const idealDistance = Math.floor(unit.attackRange * 0.8);
            const currentDistance = this.getDistance(unit.x, unit.y, situation.nearestEnemy.x, situation.nearestEnemy.y);
            
            if (currentDistance < idealDistance - 1) {
                // Too close, move away
                return {
                    type: 'retreat',
                    target: situation.nearestEnemy
                };
            } else if (currentDistance > idealDistance + 1) {
                // Too far, move closer
                return {
                    type: 'move',
                    target: {
                        x: situation.nearestEnemy.x,
                        y: situation.nearestEnemy.y
                    }
                };
            } else {
                // Good distance, defend
                return {
                    type: 'defend'
                };
            }
        } else {
            // Move towards center or random
            return {
                type: 'move',
                target: {
                    x: Math.floor(this.combatManager.gridSize.width / 2),
                    y: Math.floor(this.combatManager.gridSize.height / 2)
                }
            };
        }
    }
    
    /**
     * Determine action for defensive behavior
     * @param {object} unit - Enemy unit
     * @param {object} situation - Situation analysis
     * @returns {object} - Action to perform
     */
    determineDefensiveAction(unit, situation) {
        // Defensive units prioritize staying in cover and defending
        if (situation.shouldRetreat) {
            // Low health, retreat to cover
            if (situation.bestCoverPosition) {
                return {
                    type: 'move',
                    target: situation.bestCoverPosition
                };
            } else {
                // Retreat from nearest enemy
                return {
                    type: 'retreat',
                    target: situation.nearestEnemy
                };
            }
        } else if (situation.attackableEnemies.length > 0) {
            // If can attack, attack
            return {
                type: 'attack',
                target: situation.attackableEnemies[0]
            };
        } else if (this.isInCover(unit)) {
            // If in cover already, stay put
            if (situation.nearestEnemy && this.getDistance(unit.x, unit.y, situation.nearestEnemy.x, situation.nearestEnemy.y) <= unit.attackRange + 2) {
                // If enemy is close enough, set up overwatch
                return {
                    type: 'defend'
                };
            } else {
                // Move slightly to get better position while staying in cover
                return {
                    type: 'adjust',
                    target: situation.nearestEnemy
                };
            }
        } else if (situation.bestCoverPosition) {
            // Move to cover
            return {
                type: 'move',
                target: situation.bestCoverPosition
            };
        } else if (situation.nearestEnemy) {
            // Stay at long range
            const idealDistance = unit.attackRange;
            const currentDistance = this.getDistance(unit.x, unit.y, situation.nearestEnemy.x, situation.nearestEnemy.y);
            
            if (currentDistance < idealDistance) {
                // Too close, move away
                return {
                    type: 'retreat',
                    target: situation.nearestEnemy
                };
            } else {
                // Good distance, defend
                return {
                    type: 'defend'
                };
            }
        } else {
            // Move randomly
            return {
                type: 'move',
                target: this.getRandomPosition(unit)
            };
        }
    }
    
    /**
     * Perform an action for an enemy unit
     * @param {object} unit - Enemy unit
     * @param {object} action - Action to perform
     * @param {object} situation - Situation analysis
     * @returns {Promise} - Resolves when action is complete
     */
    async performAction(unit, action, situation) {
        return new Promise(async (resolve) => {
            switch (action.type) {
                case 'attack':
                    await this.performAttackAction(unit, action.target);
                    break;
                    
                case 'move':
                    await this.performMoveAction(unit, action.target);
                    break;
                    
                case 'retreat':
                    await this.performRetreatAction(unit, action.target);
                    break;
                    
                case 'ability':
                    await this.performAbilityAction(unit, action.ability, action.target);
                    break;
                    
                case 'defend':
                    // Defending uses up action points but doesn't do anything else
                    unit.actionPoints = 0;
                    break;
                    
                case 'adjust':
                    // Minor movement while maintaining cover
                    await this.performAdjustAction(unit, action.target);
                    break;
                    
                default:
                    // Unknown action, just end the unit's turn
                    unit.actionPoints = 0;
                    break;
            }
            
            resolve();
        });
    }
    
    /**
     * Perform an attack action
     * @param {object} unit - Enemy unit
     * @param {object} target - Target unit
     * @returns {Promise} - Resolves when action is complete
     */
    async performAttackAction(unit, target) {
        return new Promise(resolve => {
            this.combatManager.attack(unit, target);
            resolve();
        });
    }
    
    /**
     * Perform a move action
     * @param {object} unit - Enemy unit
     * @param {object} targetPos - Target position
     * @returns {Promise} - Resolves when action is complete
     */
    async performMoveAction(unit, targetPos) {
        return new Promise(resolve => {
            // Find path to target (or as close as possible)
            const path = this.findPathToTarget(unit, targetPos);
            
            if (path.length > 0) {
                // Get the furthest reachable cell in the path
                const reachableCells = this.combatManager.getReachableCells(unit);
                let furthestReachableIndex = -1;
                
                for (let i = 0; i < path.length; i++) {
                    const cell = path[i];
                    if (reachableCells.some(c => c.x === cell.x && c.y === cell.y)) {
                        furthestReachableIndex = i;
                    }
                }
                
                if (furthestReachableIndex >= 0) {
                    const targetCell = path[furthestReachableIndex];
                    this.combatManager.moveUnit(unit, targetCell.x, targetCell.y);
                }
            }
            
            resolve();
        });
    }
    
    /**
     * Perform a retreat action
     * @param {object} unit - Enemy unit
     * @param {object} target - Target to retreat from
     * @returns {Promise} - Resolves when action is complete
     */
    async performRetreatAction(unit, target) {
        return new Promise(resolve => {
            if (!target) {
                // No target to retreat from, just end action
                unit.actionPoints--;
                resolve();
                return;
            }
            
            // Calculate direction away from target
            const dx = unit.x - target.x;
            const dy = unit.y - target.y;
            
            // Normalize and scale
            const length = Math.sqrt(dx * dx + dy * dy);
            const normalizedDx = dx / length;
            const normalizedDy = dy / length;
            
            // Target position is in the opposite direction of the target
            const targetX = Math.round(unit.x + normalizedDx * unit.moveRange);
            const targetY = Math.round(unit.y + normalizedDy * unit.moveRange);
            
            // Find path to retreat position
            const path = this.findPathToTarget(unit, { x: targetX, y: targetY });
            
            if (path.length > 0) {
                // Get the furthest reachable cell in the path
                const reachableCells = this.combatManager.getReachableCells(unit);
                let furthestReachableIndex = -1;
                
                for (let i = 0; i < path.length; i++) {
                    const cell = path[i];
                    if (reachableCells.some(c => c.x === cell.x && c.y === cell.y)) {
                        furthestReachableIndex = i;
                    }
                }
                
                if (furthestReachableIndex >= 0) {
                    const targetCell = path[furthestReachableIndex];
                    this.combatManager.moveUnit(unit, targetCell.x, targetCell.y);
                }
            }
            
            resolve();
        });
    }
    
    /**
     * Perform an ability action
     * @param {object} unit - Enemy unit
     * @param {string} ability - Ability to use
     * @param {object} target - Target for the ability
     * @returns {Promise} - Resolves when action is complete
     */
    async performAbilityAction(unit, ability, target) {
        return new Promise(resolve => {
            // Implement ability usage
            this.combatManager.useAbility(unit, ability, target);
            resolve();
        });
    }
    
    /**
     * Perform a minor adjustment while maintaining cover
     * @param {object} unit - Enemy unit
     * @param {object} target - Target to adjust relative to
     * @returns {Promise} - Resolves when action is complete
     */
    async performAdjustAction(unit, target) {
        return new Promise(resolve => {
            if (!target) {
                // No target to adjust for, just end action
                unit.actionPoints--;
                resolve();
                return;
            }
            
            // Find cells that provide cover from the target
            const coverCells = this.findCellsWithCoverFrom(unit, target);
            
            if (coverCells.length > 0) {
                // Sort by distance from current position (closest first)
                coverCells.sort((a, b) => {
                    const distA = this.getDistance(unit.x, unit.y, a.x, a.y);
                    const distB = this.getDistance(unit.x, unit.y, b.x, b.y);
                    return distA - distB;
                });
                
                // Move to closest cover cell
                const targetCell = coverCells[0];
                this.combatManager.moveUnit(unit, targetCell.x, targetCell.y);
            } else {
                // No cover cells, just reduce action points
                unit.actionPoints--;
            }
            
            resolve();
        });
    }
    
    /**
     * Find cells that provide cover from a target
     * @param {object} unit - Enemy unit
     * @param {object} target - Target to get cover from
     * @returns {Array} - Array of cells that provide cover
     */
    findCellsWithCoverFrom(unit, target) {
        const result = [];
        const searchRadius = 2; // Only look for nearby cells
        
        // Look in cells around the unit
        for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            for (let dy = -searchRadius; dy <= searchRadius; dy++) {
                const x = unit.x + dx;
                const y = unit.y + dy;
                
                // Skip invalid positions, current position, or positions without cover
                if (
                    x < 0 || x >= this.combatManager.gridSize.width ||
                    y < 0 || y >= this.combatManager.gridSize.height ||
                    (x === unit.x && y === unit.y) ||
                    !this.isCellValidForMovement(x, y) ||
                    this.combatManager.grid[y][x].type !== 'cover'
                ) {
                    continue;
                }
                
                // Check if this position provides cover
                if (this.doesPositionProvideCoverFrom(x, y, target.x, target.y)) {
                    result.push({ x, y });
                }
            }
        }
        
        return result;
    }
    
    /**
     * Check if a position provides cover from a target
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} targetX - Target X position
     * @param {number} targetY - Target Y position
     * @returns {boolean} - True if position provides cover
     */
    doesPositionProvideCoverFrom(x, y, targetX, targetY) {
        // Simplified check: if there's a wall or tall object between positions
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction vector
        const ndx = dx / distance;
        const ndy = dy / distance;
        
        // Check if there's a blocking object in the line
        let cx = x;
        let cy = y;
        
        for (let i = 1; i < distance; i++) {
            cx += ndx;
            cy += ndy;
            
            const gridX = Math.round(cx);
            const gridY = Math.round(cy);
            
            if (
                gridX >= 0 && gridX < this.combatManager.gridSize.width &&
                gridY >= 0 && gridY < this.combatManager.gridSize.height
            ) {
                if (
                    this.combatManager.grid[gridY][gridX].type === 'wall' ||
                    this.combatManager.grid[gridY][gridX].type === 'tall' ||
                    this.combatManager.grid[gridY][gridX].type === 'cover'
                ) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Find a path to a target position
     * @param {object} unit - Unit to move
     * @param {object} targetPos - Target position
     * @returns {Array} - Array of positions forming a path
     */
    findPathToTarget(unit, targetPos) {
        // Use the combat manager's path finding
        return this.combatManager.getPath(unit.x, unit.y, targetPos.x, targetPos.y);
    }
    
    /**
     * Check if a cell is valid for movement
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if cell is valid for movement
     */
    isCellValidForMovement(x, y) {
        return this.combatManager.isCellValidForMovement(x, y);
    }
    
    /**
     * Check if a unit is in cover
     * @param {object} unit - Unit to check
     * @returns {boolean} - True if unit is in cover
     */
    isInCover(unit) {
        return (
            this.combatManager.grid[unit.y] &&
            this.combatManager.grid[unit.y][unit.x] &&
            this.combatManager.grid[unit.y][unit.x].type === 'cover'
        );
    }
    
    /**
     * Get a random position near the unit
     * @param {object} unit - Unit to get position for
     * @returns {object} - Random position
     */
    getRandomPosition(unit) {
        const radius = unit.moveRange;
        const positions = [];
        
        // Check positions in radius
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const x = unit.x + dx;
                const y = unit.y + dy;
                
                if (this.isCellValidForMovement(x, y)) {
                    positions.push({ x, y });
                }
            }
        }
        
        // Return random valid position or current position if none found
        return positions.length > 0
            ? positions[Math.floor(Math.random() * positions.length)]
            : { x: unit.x, y: unit.y };
    }
    
    /**
     * Calculate distance between two points
     * @param {number} x1 - First X coordinate
     * @param {number} y1 - First Y coordinate
     * @param {number} x2 - Second X coordinate
     * @param {number} y2 - Second Y coordinate
     * @returns {number} - Distance
     */
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
}