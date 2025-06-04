// modelData.js - Model data for combat units

/**
 * Configuration objects for unit types
 * Makes it easier to add new types of units to the game
 */
export const ModelData = {
    enemy: {
        types: [
            'anthromorph', 'avianos', 'behemoth', 'chiropteran', 'dengar', 'dengar_charger',
            'kilrathi', 'shalrah_prime', 'vyraxus', 'talorian', 'tana_rhe', 'tal_ehn', 'xithrian'
        ],
        stats: {
            // Default stats for each enemy type
            anthromorph: { health: 100, actionPoints: 2, attackRange: 4, damage: [15, 25], accuracy: 65 },
            avianos: { health: 90, actionPoints: 3, attackRange: 5, damage: [12, 20], accuracy: 75 },
            behemoth: { health: 200, actionPoints: 1, attackRange: 3, damage: [30, 40], accuracy: 60 },
            chiropteran: { health: 80, actionPoints: 4, attackRange: 4, damage: [10, 15], accuracy: 70 },
            dengar: { health: 120, actionPoints: 2, attackRange: 4, damage: [20, 30], accuracy: 70 },
            dengar_charger: { health: 150, actionPoints: 3, attackRange: 3, damage: [25, 35], accuracy: 65 },
            kilrathi: { health: 130, actionPoints: 2, attackRange: 5, damage: [22, 32], accuracy: 75 },
            shalrah_prime: { health: 110, actionPoints: 2, attackRange: 6, damage: [18, 28], accuracy: 80 },
            vyraxus: { health: 140, actionPoints: 2, attackRange: 4, damage: [24, 34], accuracy: 70 },
            talorian: { health: 100, actionPoints: 3, attackRange: 6, damage: [15, 25], accuracy: 85 },
            tana_rhe: { health: 90, actionPoints: 2, attackRange: 7, damage: [20, 25], accuracy: 80 },
            tal_ehn: { health: 110, actionPoints: 2, attackRange: 5, damage: [20, 30], accuracy: 80 },
            xithrian: { health: 70, actionPoints: 3, attackRange: 3, damage: [10, 15], accuracy: 75 },
        }
    },
    friendly: {
        types: ['katia_f', 'oldman', 'soldier', 'medic'],
        classes: {
            // Class definitions with special abilities and stats
            rifleman: { 
                attackRange: 6, 
                accuracy: 75, 
                damage: [20, 30],
                abilities: ['overwatch', 'focused_shot']
            },
            scout: { 
                attackRange: 4, 
                accuracy: 65, 
                damage: [15, 25],
                moveRange: 7,
                abilities: ['sprint', 'stealth']
            },
            heavy: { 
                attackRange: 5, 
                accuracy: 70, 
                damage: [25, 35],
                abilities: ['suppression', 'grenade']
            },
            medic: { 
                attackRange: 4, 
                accuracy: 60, 
                damage: [10, 20],
                abilities: ['heal', 'stim_pack']
            },
            sniper: { 
                attackRange: 8, 
                accuracy: 85, 
                damage: [30, 40],
                abilities: ['headshot', 'mark_target']
            }
        }
    }
};