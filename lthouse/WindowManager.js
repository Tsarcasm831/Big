/**
 * WindowManager.js
 * 
 * Previously handled the creation and management of windows in the scene.
 * Left here as a placeholder for future window implementations.
 */
import * as THREE from 'three';

class WindowManager {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.textureLoader = game.textureLoader;
        this.colliders = game.colliders;
    }

    createWindow(parentWall) {
        // Window creation functionality removed as requested
        // No window will be created in the scene
    }

    createStars(sky) {
        // Stars functionality removed as it was part of the window
    }
}

export { WindowManager };