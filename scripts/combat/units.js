// units.js - Unit classes for combat system
import { ModelData } from './modelData.js';

/**
 * Base Unit class with expanded features
 * Handles stats, abilities, status effects, and more
 */
export class Unit {
    constructor(faction, x, y, modelName) {
        // Core properties
        this.faction = faction;
        this.x = x; // x-coordinate on the grid (maps to x in 3D)
        this.y = y; // y-coordinate on the grid (maps to z in 3D)
        this.modelName = modelName;
        
        // Stats (with defaults that can be overridden)
        this.health = 100;
        this.maxHealth = 100;
        this.actionPoints = 2;
        this.maxActionPoints = 2;
        this.attackRange = 5;
        this.moveRange = 5;
        this.accuracy = 70;
        this.damageRange = [15, 25]; // [min, max] damage
        this.critChance = 10; // 10% critical hit chance
        this.critMultiplier = 1.5; // 50% extra damage on crit
        
        // Inventory and equipment
        this.items = [];
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };
        
        // Status effects (poison, stun, etc)
        this.statusEffects = [];
        
        // 3D representation
        this.model = null; // Three.js object for the 3D model
        this.animations = []; // Animation clips from the GLB
        this.mixer = null; // Animation mixer for playing animations
        this.healthBar = null; // Health bar above unit
        this.statusIcons = []; // Visual indicators for status effects
        
        // Abilities (skills the unit can use)
        this.abilities = [];
        
        // Internal tracking
        this.hasMoved = false;
        this.hasAttacked = false;
    }
    
    // Apply a status effect to the unit
    applyStatusEffect(effect) {
        // Don't stack the same effect
        if (!this.statusEffects.some(e => e.type === effect.type)) {
            this.statusEffects.push(effect);
            // Apply immediate effect if any
            if (effect.onApply) {
                effect.onApply(this);
            }
            return true;
        }
        return false;
    }
    
    // Remove a status effect
    removeStatusEffect(effectType) {
        const index = this.statusEffects.findIndex(e => e.type === effectType);
        if (index !== -1) {
            const effect = this.statusEffects[index];
            if (effect.onRemove) {
                effect.onRemove(this);
            }
            this.statusEffects.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // Process status effects at the start of turn
    processStatusEffects() {
        // Create a copy to avoid problems if an effect removes itself
        const effects = [...this.statusEffects];
        
        for (const effect of effects) {
            // Process effect
            if (effect.onTurn) {
                effect.onTurn(this);
            }
            
            // Reduce duration
            effect.duration--;
            
            // Remove if duration is over
            if (effect.duration <= 0) {
                this.removeStatusEffect(effect.type);
            }
        }
    }
    
    // Calculate damage dealt by this unit (with variation)
    calculateDamage() {
        // Base damage with random variation
        const [min, max] = this.damageRange;
        let damage = Math.floor(min + Math.random() * (max - min + 1));
        
        // Critical hit check
        const isCritical = Math.random() * 100 < this.critChance;
        if (isCritical) {
            damage = Math.floor(damage * this.critMultiplier);
        }
        
        // Apply status effect modifiers
        for (const effect of this.statusEffects) {
            if (effect.damageModifier) {
                damage = effect.damageModifier(damage);
            }
        }
        
        return { damage, isCritical };
    }
    
    // Reset at the start of turn
    resetForNewTurn() {
        this.actionPoints = this.maxActionPoints;
        this.hasMoved = false;
        this.hasAttacked = false;
        this.processStatusEffects();
    }
    
    // Check if unit can still act this turn
    canAct() {
        return this.actionPoints > 0 && this.statusEffects.every(e => !e.preventsAction);
    }
}

/**
 * Soldier subclass for player units with class specialization
 * Handles class-specific abilities and progression
 */
export class Soldier extends Unit {
    constructor(faction, x, y, modelName, soldierClass = 'rifleman') {
        super(faction, x, y, modelName);
        
        // Set class and apply class-specific stats and abilities
        this.setClass(soldierClass);
        
        // Experience and progression
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
    }
    
    // Set or change the soldier's class
    setClass(className) {
        if (!ModelData.friendly.classes[className]) {
            console.warn(`Class ${className} not found, defaulting to rifleman`);
            className = 'rifleman';
        }
        
        // Store the class name
        this.class = className;
        
        // Apply class stats
        const classData = ModelData.friendly.classes[className];
        this.attackRange = classData.attackRange;
        this.accuracy = classData.accuracy;
        this.damageRange = classData.damage;
        
        // Apply class-specific move range if defined
        if (classData.moveRange) {
            this.moveRange = classData.moveRange;
        }
        
        // Set abilities
        this.abilities = [...classData.abilities];
    }
    
    // Gain experience and check for level up
    gainExperience(amount) {
        this.experience += amount;
        
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
            return true;
        }
        
        return false;
    }
    
    // Level up the character
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Improve stats
        this.maxHealth += 10;
        this.health = this.maxHealth;
        
        // Class-specific improvements
        switch(this.class) {
            case 'rifleman':
                this.accuracy += 2;
                this.damageRange[1] += 3;
                break;
            case 'scout':
                this.moveRange += 1;
                this.critChance += 3;
                break;
            case 'heavy':
                this.maxHealth += 5;
                this.damageRange[0] += 2;
                this.damageRange[1] += 2;
                break;
            case 'medic':
                // Healing abilities improve
                this.maxActionPoints += 1;
                break;
            case 'sniper':
                this.attackRange += 1;
                this.accuracy += 3;
                this.critChance += 2;
                break;
        }
    }
}

/**
 * Enemy subclass with enhanced AI behavior
 * Handles enemy-specific stats and abilities
 */
export class Enemy extends Unit {
    constructor(faction, x, y, modelName) {
        super(faction, x, y, modelName);
        
        // Set type and apply type-specific stats
        this.type = modelName;
        this.setEnemyStats();
        
        // AI behavior type
        this.behavior = 'aggressive'; // aggressive, defensive, support, etc.
        
        // Special abilities based on enemy type
        this.setupAbilities();
    }
    
    // Apply stats based on enemy type
    setEnemyStats() {
        const stats = ModelData.enemy.stats[this.type];
        if (stats) {
            this.health = stats.health;
            this.maxHealth = stats.health;
            this.actionPoints = stats.actionPoints;
            this.maxActionPoints = stats.actionPoints;
            this.attackRange = stats.attackRange;
            this.damageRange = stats.damage;
            this.accuracy = stats.accuracy;
        } else {
            console.warn(`No stats found for enemy type ${this.type}, using defaults`);
        }
    }
    
    // Setup special abilities based on enemy type
    setupAbilities() {
        switch(this.type) {
            case 'behemoth':
                this.abilities.push('charge', 'slam');
                this.behavior = 'aggressive';
                break;
            case 'chiropteran':
                this.abilities.push('fly', 'screech');
                this.behavior = 'hit_and_run';
                break;
            case 'tana_rhe':
                this.abilities.push('psychic_blast', 'mind_control');
                this.behavior = 'support';
                break;
            case 'talorian':
                this.abilities.push('overwatch', 'suppression');
                this.behavior = 'tactical';
                break;
            case 'dengar_charger':
                this.abilities.push('charge', 'trample');
                this.behavior = 'aggressive';
                break;
            // Add more enemy-specific abilities as needed
        }
    }
}