/**
 * HUDSystem.js
 * 
 * Already exists as a separate module for HUD elements; will be integrated as-is with minor adjustments.
 * Manages heads-up display elements including stamina bar, compass, and interaction indicators.
 */

class HUDSystem {
    constructor(game) {
        this.game = game;
        this.hudContainer = document.createElement('div');
        this.hudContainer.id = 'hud-container';
        
        // Create HUD elements
        this.createStaminaBar();
        this.createCompass();
        this.createInteractionIndicator();
        
        // Initial setup
        document.getElementById('game-container').appendChild(this.hudContainer);
        this.update();
    }
    
    createStaminaBar() {
        const staminaContainer = document.createElement('div');
        staminaContainer.id = 'stamina-container';
        
        const staminaLabel = document.createElement('div');
        staminaLabel.id = 'stamina-label';
        staminaLabel.textContent = 'STAMINA';
        
        const staminaBar = document.createElement('div');
        staminaBar.id = 'stamina-bar';
        
        const staminaFill = document.createElement('div');
        staminaFill.id = 'stamina-fill';
        
        staminaBar.appendChild(staminaFill);
        staminaContainer.appendChild(staminaLabel);
        staminaContainer.appendChild(staminaBar);
        this.hudContainer.appendChild(staminaContainer);
        
        this.staminaFill = staminaFill;
        this.currentStamina = 100;
    }
    
    createCompass() {
        const compass = document.createElement('div');
        compass.id = 'compass';
        
        const directions = ['N', 'E', 'S', 'W'];
        directions.forEach(dir => {
            const marker = document.createElement('span');
            marker.className = 'compass-marker';
            marker.textContent = dir;
            compass.appendChild(marker);
        });
        
        const needle = document.createElement('div');
        needle.id = 'compass-needle';
        compass.appendChild(needle);
        
        this.hudContainer.appendChild(compass);
        this.compass = compass;
        this.compassNeedle = needle;
    }
    
    createInteractionIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'interaction-indicator';
        indicator.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="#ddc28f" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#ddc28f"/></svg>';
        this.hudContainer.appendChild(indicator);
        
        this.interactionIndicator = indicator;
        this.interactionIndicator.style.opacity = '1'; // Make visible by default
    }
    
    updateStamina(value) {
        this.currentStamina = Math.max(0, Math.min(100, value));
        this.staminaFill.style.width = `${this.currentStamina}%`;
        
        // Change color based on stamina level
        if (this.currentStamina < 30) {
            this.staminaFill.style.backgroundColor = '#cc3333';
        } else if (this.currentStamina < 60) {
            this.staminaFill.style.backgroundColor = '#cc9933';
        } else {
            this.staminaFill.style.backgroundColor = '#66cc33';
        }
    }
    
    updateCompass(rotation) {
        // Convert rotation to degrees and normalize to 0-360
        const degrees = (rotation * (180/Math.PI)) % 360;
        this.compassNeedle.style.transform = `rotate(${-degrees}deg)`;
    }
    
    showInteractionIndicator(show) {
        this.interactionIndicator.style.opacity = show ? '1' : '0';
    }
    
    update() {
        // Update stamina based on sprinting status
        if (this.game.playerControls.isSprinting && 
            (this.game.playerControls.moveForward || this.game.playerControls.moveBackward || 
            this.game.playerControls.moveLeft || this.game.playerControls.moveRight)) {
            // Depletes faster when sprinting
            this.updateStamina(this.currentStamina - 2.0); // Increased from 1.5 for faster stamina drain
        } else if (!this.game.playerControls.isSprinting && 
            !(this.game.playerControls.moveForward || this.game.playerControls.moveBackward || 
            this.game.playerControls.moveLeft || this.game.playerControls.moveRight)) {
            // Regenerate when standing still
            this.updateStamina(this.currentStamina + 0.8); // Increased from 0.5 for faster regen
        }
        
        // Update compass based on camera rotation
        if (this.game.camera) {
            this.updateCompass(this.game.camera.rotation.y);
        }
        
        // Update interaction indicator
        this.showInteractionIndicator(this.game.highlightedObject !== null);
    }
    
    hide() {
        this.hudContainer.style.opacity = '0';
        this.hudContainer.style.pointerEvents = 'none';
    }
    
    show() {
        this.hudContainer.style.opacity = '1';
        this.hudContainer.style.pointerEvents = 'auto';
    }
}

export { HUDSystem };