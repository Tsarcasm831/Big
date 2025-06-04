/**
 * transitions.js - Animation effects for combat transitions
 * Styled to match Lord Tsarcasm's House aesthetic
 */

export class CombatTransitions {
    constructor(container) {
        this.container = container;
    }
    
    /**
     * Create a transition effect between scenes
     * @param {string} type - Type of transition ('fade', 'wipe', 'flash')
     * @param {Function} callback - Callback to execute after transition
     */
    transition(type = 'fade', callback = null) {
        switch(type) {
            case 'wipe':
                this.wipeTransition(callback);
                break;
            case 'flash':
                this.flashTransition(callback);
                break;
            case 'fade':
            default:
                this.fadeTransition(callback);
                break;
        }
    }
    
    /**
     * Create a fade transition effect
     * @param {Function} callback - Callback to execute after transition
     */
    fadeTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            z-index: 3000;
        `;
        
        this.container.appendChild(overlay);
        
        // Force reflow
        overlay.offsetHeight;
        
        // Fade in
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            // Execute callback
            if (callback) callback();
            
            // Fade out
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.remove();
            }, 1000);
        }, 1000);
    }
    
    /**
     * Create a wipe transition effect
     * @param {Function} callback - Callback to execute after transition
     */
    wipeTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background-color: #ff6400;
            transition: width 1s ease-in-out;
            z-index: 3000;
        `;
        
        this.container.appendChild(overlay);
        
        // Force reflow
        overlay.offsetHeight;
        
        // Wipe in
        overlay.style.width = '100%';
        
        setTimeout(() => {
            // Execute callback
            if (callback) callback();
            
            // Wipe out
            overlay.style.left = '100%';
            overlay.style.width = '0%';
            
            setTimeout(() => {
                overlay.remove();
            }, 1000);
        }, 1000);
    }
    
    /**
     * Create a flash transition effect
     * @param {Function} callback - Callback to execute after transition
     */
    flashTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ff6400;
            opacity: 0;
            z-index: 3000;
        `;
        
        this.container.appendChild(overlay);
        
        // Flash sequence
        setTimeout(() => { overlay.style.opacity = '0.8'; }, 0);
        setTimeout(() => { overlay.style.opacity = '0'; }, 200);
        setTimeout(() => { overlay.style.opacity = '0.6'; }, 400);
        setTimeout(() => { overlay.style.opacity = '0'; }, 600);
        setTimeout(() => { overlay.style.opacity = '1'; }, 800);
        
        setTimeout(() => {
            // Execute callback
            if (callback) callback();
            
            // Fade out
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.remove();
            }, 400);
        }, 1000);
    }
    
    /**
     * Create a sarcastic message overlay
     * @param {string} message - Message to display
     * @param {number} duration - Duration to show message (ms)
     */
    showSarcasticMessage(message, duration = 3000) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: #ff6400;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #4a3f35;
            font-family: 'Cinzel', serif;
            font-size: 24px;
            max-width: 80%;
            text-align: center;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        overlay.textContent = message;
        this.container.appendChild(overlay);
        
        // Force reflow
        overlay.offsetHeight;
        
        // Fade in
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            // Fade out
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, duration);
    }
}