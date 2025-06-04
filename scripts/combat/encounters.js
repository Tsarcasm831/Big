// encounters.js - Combat encounter system

/**
 * Manages combat encounters with different types and configurations
 */
export class EncounterManager {
    constructor() {
        this.encounterTypes = [
            'AMBUSH',
            'MUTANT_FRENZY',
            'HIVE_EXECUTION',
            'CROSS_RETRIEVAL',
            'HUNTED_FOR_SPORT',
            'BURIED_THREAT',
            'CANNIBAL_FEAST',
            'PSYKER_ROGUE',
            'NIGHTMARE_FOG',
            'RED_RIBBON',
            'WARLORD_TOLL',
            'NIGHTCRAWLER_SWARM',
            'CORRUPTED_PSION'
        ];
        
        this.locations = [
            'FOREST',
            'RUINS',
            'SETTLEMENT',
            'WASTELAND',
            'BUNKER',
            'FACILITY',
            'OUTPOST'
        ];
    }
    
    /**
     * Get a random encounter type
     * @returns {string} - Random encounter type
     */
    getRandomEncounterType() {
        return this.encounterTypes[Math.floor(Math.random() * this.encounterTypes.length)];
    }
    
    /**
     * Get a random location
     * @returns {string} - Random location
     */
    getRandomLocation() {
        return this.locations[Math.floor(Math.random() * this.locations.length)];
    }
    
    /**
     * Get enemy positions for a specific encounter type
     * @param {string} encounterType - Type of encounter
     * @returns {object} - Enemy positions and models
     */
    getEnemyPositions(encounterType) {
        let enemyPositions = [];
        let enemyModels = [];
        let numEnemies = 4; // Default
        
        switch (encounterType) {
            case 'AMBUSH':
                // Raiders in ambush positions
                enemyModels = ['anthromorph', 'anthromorph2', 'anthromorph3', 'talorian'];
                enemyPositions = [
                    { x: 3, y: 12 }, { x: 10, y: 14 }, { x: 15, y: 12 }, 
                    { x: 5, y: 8 }, { x: 12, y: 8 }
                ];
                numEnemies = 5;
                break;
                
            case 'MUTANT_FRENZY':
                // A few strong mutants
                enemyModels = ['behemoth', 'chiropteran', 'vyraxus'];
                enemyPositions = [
                    { x: 5, y: 2 }, { x: 9, y: 2 }, { x: 7, y: 4 }
                ];
                numEnemies = 3;
                break;
                
            case 'HIVE_EXECUTION':
                // HIVE soldiers
                enemyModels = ['talorian', 'talorian', 'talorian', 'talorian', 'tana_rhe'];
                enemyPositions = [
                    { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 9, y: 3 }, 
                    { x: 6, y: 2 }, { x: 8, y: 2 }
                ];
                numEnemies = 5;
                break;
                
            case 'CROSS_RETRIEVAL':
                // CROSS soldiers in formation
                enemyModels = ['tal_ehn', 'tal_ehn', 'tal_ehn', 'tal_ehn', 'tal_ehn', 'shalrah_prime'];
                enemyPositions = [
                    { x: 5, y: 2 }, { x: 7, y: 2 }, { x: 9, y: 2 },
                    { x: 6, y: 4 }, { x: 8, y: 4 }, { x: 7, y: 6 }
                ];
                numEnemies = 6;
                break;
                
            case 'HUNTED_FOR_SPORT':
                // Single powerful enemy
                enemyModels = ['shalrah_prime'];
                enemyPositions = [{ x: 10, y: 2 }];
                numEnemies = 1;
                break;
                
            case 'BURIED_THREAT':
                // Threats around the map
                enemyModels = ['dengar_charger', 'behemoth', 'vyraxus'];
                enemyPositions = [
                    { x: 5, y: 10 }, { x: 10, y: 5 }, { x: 15, y: 10 }
                ];
                numEnemies = 3;
                break;
                
            case 'CANNIBAL_FEAST':
                // Many weak cannibals
                enemyModels = ['anthromorph', 'anthromorph', 'anthromorph', 'anthromorph',
                              'anthromorph', 'anthromorph', 'anthromorph'];
                enemyPositions = [
                    { x: 3, y: 3 }, { x: 5, y: 2 }, { x: 7, y: 3 }, 
                    { x: 9, y: 2 }, { x: 11, y: 3 }, { x: 13, y: 2 }, { x: 15, y: 3 }
                ];
                numEnemies = 7;
                break;
                
            case 'PSYKER_ROGUE':
                // Single central psyker
                enemyModels = ['tana_rhe'];
                enemyPositions = [{ x: 10, y: 10 }];
                numEnemies = 1;
                break;
                
            case 'NIGHTMARE_FOG':
                // Spread out enemies in fog
                enemyModels = ['chiropteran', 'xithrian', 'vyraxus', 'dengar'];
                enemyPositions = [
                    { x: 4, y: 8 }, { x: 12, y: 12 }, { x: 16, y: 8 }, { x: 8, y: 4 }
                ];
                numEnemies = 4;
                break;
                
            case 'RED_RIBBON':
                // Infected FDG soldiers
                enemyModels = ['anthromorph', 'anthromorph', 'anthromorph', 'anthromorph', 'avianos'];
                enemyPositions = [
                    { x: 4, y: 6 }, { x: 8, y: 6 }, { x: 12, y: 6 }, 
                    { x: 6, y: 10 }, { x: 10, y: 10 }
                ];
                numEnemies = 5;
                break;
                
            case 'WARLORD_TOLL':
                // Warlord and guards
                enemyModels = ['kilrathi', 'anthromorph', 'anthromorph', 'anthromorph'];
                enemyPositions = [
                    { x: 10, y: 6 }, { x: 8, y: 8 }, { x: 12, y: 8 }, { x: 10, y: 10 }
                ];
                numEnemies = 4;
                break;
                
            case 'NIGHTCRAWLER_SWARM':
                // Lots of small enemies
                enemyModels = ['xithrian', 'xithrian', 'xithrian', 'xithrian', 
                              'xithrian', 'xithrian', 'xithrian', 'xithrian'];
                enemyPositions = [
                    { x: 4, y: 4 }, { x: 8, y: 4 }, { x: 12, y: 4 }, { x: 16, y: 4 },
                    { x: 4, y: 8 }, { x: 8, y: 8 }, { x: 12, y: 8 }, { x: 16, y: 8 }
                ];
                numEnemies = 8;
                break;
                
            case 'CORRUPTED_PSION':
                // Psion and minions
                enemyModels = ['tana_rhe', 'shalrah_prime', 'shalrah_prime', 'shalrah_prime'];
                enemyPositions = [
                    { x: 10, y: 6 }, { x: 8, y: 4 }, { x: 12, y: 4 }, { x: 10, y: 2 }
                ];
                numEnemies = 4;
                break;
                
            default:
                // Default positions
                enemyModels = ['anthromorph', 'avianos', 'xithrian', 'talorian'];
                enemyPositions = [
                    { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }
                ];
                numEnemies = 4;
                break;
        }
        
        return {
            positions: enemyPositions.slice(0, numEnemies),
            models: enemyModels.length === numEnemies 
                ? enemyModels 
                : enemyModels.slice(0, numEnemies)
        };
    }
    
    /**
     * Get player positions for a specific encounter type
     * @param {string} encounterType - Type of encounter
     * @returns {Array} - Player positions
     */
    getPlayerPositions(encounterType) {
        switch (encounterType) {
            case 'AMBUSH':
                // Players start in the center
                return [
                    { x: 8, y: 10 }, { x: 10, y: 10 }, { x: 12, y: 10 }, { x: 10, y: 12 }
                ];
                
            case 'HIVE_EXECUTION':
                // Players start at the bottom
                return [
                    { x: 7, y: 17 }, { x: 9, y: 17 }, { x: 11, y: 17 }, { x: 13, y: 17 }
                ];
                
            case 'PSYKER_ROGUE':
                // Players surrounding the center
                return [
                    { x: 5, y: 10 }, { x: 10, y: 5 }, { x: 15, y: 10 }, { x: 10, y: 15 }
                ];
                
            default:
                // Default at the bottom of map
                return [
                    { x: 5, y: 18 }, { x: 6, y: 18 }, { x: 7, y: 18 }, { x: 8, y: 18 }
                ];
        }
    }
    
    /**
     * Get special rules for an encounter type
     * @param {string} encounterType - Type of encounter
     * @returns {object} - Special rules for the encounter
     */
    getEncounterRules(encounterType) {
        const rules = {
            specialAbilities: [],
            environmentEffects: [],
            rewards: [],
            description: ''
        };
        
        switch (encounterType) {
            case 'AMBUSH':
                rules.description = 'Your squad has been ambushed! Hostiles have set up in concealed positions.';
                rules.specialAbilities.push({
                    name: 'First Strike',
                    description: 'Enemies get +15% accuracy on the first turn'
                });
                rules.rewards.push('Scavenged Gear', 'Ambusher Weapons');
                break;
                
            case 'MUTANT_FRENZY':
                rules.description = 'Enraged mutants grow stronger as they take damage!';
                rules.specialAbilities.push({
                    name: 'Blood Rage',
                    description: 'Mutants gain 1 action point each time they take damage'
                });
                rules.environmentEffects.push({
                    name: 'Toxic Pools',
                    description: 'Some areas deal 5 damage per turn to units standing in them'
                });
                rules.rewards.push('Mutant Samples', 'Experimental Serum');
                break;
                
            case 'HUNTED_FOR_SPORT':
                rules.description = 'A powerful hunter stalks your squad. Be careful!';
                rules.specialAbilities.push({
                    name: 'Predator Senses',
                    description: 'The hunter can see through stealth and has enhanced accuracy'
                });
                rules.rewards.push('Rare Trophy', 'Hunter\'s Equipment');
                break;
                
            case 'NIGHTMARE_FOG':
                rules.description = 'A thick fog covers the battlefield, limiting vision and allowing enemies to teleport.';
                rules.environmentEffects.push({
                    name: 'Dimensional Fog',
                    description: 'Visibility reduced to 3 cells. Enemies can teleport once per turn.'
                });
                rules.rewards.push('Fog Samples', 'Dimensional Fragment');
                break;
                
            case 'CORRUPTED_PSION':
                rules.description = 'A powerful psyker and its minions attack. Watch for mental attacks!';
                rules.specialAbilities.push({
                    name: 'Mind Assault',
                    description: 'The psyker can attack any visible unit regardless of distance'
                });
                rules.environmentEffects.push({
                    name: 'Psychic Resonance',
                    description: 'Psionic abilities have increased range and effectiveness'
                });
                rules.rewards.push('Psi Amplifier', 'Neural Implant');
                break;
                
            default:
                rules.description = 'A standard combat encounter.';
                break;
        }
        
        return rules;
    }
    
    /**
     * Apply special effects to enemy based on encounter type
     * @param {object} enemy - Enemy to modify
     * @param {string} encounterType - Type of encounter
     */
    applyEncounterEffectsToEnemy(enemy, encounterType) {
        switch (encounterType) {
            case 'MUTANT_FRENZY':
                // Mutants get stronger as they take damage
                enemy.onDamage = function() {
                    this.actionPoints += 1;
                };
                enemy.health = 150; // More health
                break;
                
            case 'HIVE_EXECUTION':
                // Improved coordination
                enemy.accuracy += 10;
                break;
                
            case 'HUNTED_FOR_SPORT':
                // Powerful hunter with high accuracy
                enemy.health = 200;
                enemy.accuracy = 90;
                break;
                
            case 'PSYKER_ROGUE':
            case 'CORRUPTED_PSION':
                // Psykers can attack at longer range
                enemy.attackRange = 8;
                enemy.health = 120;
                break;
                
            case 'NIGHTMARE_FOG':
                // Enemies can teleport in fog
                enemy.canTeleport = true;
                break;
                
            case 'CANNIBAL_FEAST':
                // Cannibals heal when they attack
                enemy.onAttack = function() {
                    this.health = Math.min(this.health + 5, this.maxHealth);
                };
                break;
        }
    }
}