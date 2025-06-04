/**
 * PlayerControls.js
 * 
 * Manages player movement, collision detection, and interaction checking.
 * Handles keyboard input, camera controls, and physics.
 */
import * as THREE from 'three';

class PlayerControls {
    constructor(game) {
        this.game = game;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;
        this.isJumping = false;
        this.isSprinting = false;

        // Add camera smoothing
        this.mouseSensitivity = 0.65; 
        this.cameraRotationXTarget = 0;
        this.cameraRotationYTarget = 0;
        this.cameraSmoothing = 0.8;  

        // Physics
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.playerHeight = 1.7;
        this.speed = 8.0;
        this.sprintMultiplier = 2.0;
        this.jumpStrength = 10.0;
        this.gravity = 25.0;

        // Event listeners
        document.addEventListener('keydown', (event) => {
            if (this.game.paused) return;
            
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'KeyE':
                    if (this.game.highlightedObject) {
                        this.game.interactWithObject(this.game.highlightedObject);
                    }
                    break;
                case 'KeyF':
                    this.game.toggleFullscreen();
                    break;
                case 'Space':
                    if (this.canJump) {
                        this.velocity.y = this.jumpStrength;
                        this.canJump = false;
                        this.isJumping = true;
                    }
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isSprinting = true;
                    break;
                case 'Tab':
                    event.preventDefault(); 
                    break;
                case 'Escape':
                    if (!this.game.paused) {
                        this.game.controls.unlock();
                    }
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isSprinting = false;
                    break;
            }
        });
    }

    update() {
        const time = performance.now();
        const delta = (time - this.game.lastTime) / 1000;
        
        if (!this.game.paused) {
            // Apply gravity and handle jumping
            this.velocity.y -= this.gravity * delta;
            
            // Horizontal movement
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            
            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
            this.direction.normalize();
            
            // Apply sprint multiplier if sprinting
            const currentSpeed = this.isSprinting ? this.speed * this.sprintMultiplier : this.speed;
            
            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * currentSpeed * delta;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * currentSpeed * delta;
            
            // Update player position
            this.game.controls.moveRight(-this.velocity.x * delta);
            this.game.controls.moveForward(-this.velocity.z * delta);
            
            // Apply vertical movement (jumping)
            this.game.camera.position.y += this.velocity.y * delta;
            
            // Check if player is on the ground
            if (this.game.camera.position.y < this.playerHeight) {
                this.velocity.y = 0;
                this.game.camera.position.y = this.playerHeight;
                this.canJump = true;
                this.isJumping = false;
            }
            
            // Update stamina in HUD based on sprinting
            if (this.game.hud && this.isSprinting && (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight)) {
                this.game.hud.updateStamina(this.game.hud.currentStamina - 1.5);
                
                // Stop sprinting if out of stamina
                if (this.game.hud.currentStamina <= 5) {
                    this.isSprinting = false;
                }
            }
        }
    }
}

export { PlayerControls };