/**
 * FireplaceManager.js
 * 
 * Handles fireplace effects, embers, and interactions.
 * Extracted from SceneSetup.js to modularize the code.
 */
import * as THREE from 'three';

class FireplaceManager {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.textureLoader = game.textureLoader;
        this.fireEmbers = [];
    }

    createFireLogs(x, y, z) {
        // Create recessed area for logs
        const recessGeometry = new THREE.BoxGeometry(0.8, 0.2, 1.2);
        const recessMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, // Changed to match cavity color
            roughness: 0.9,
            metalness: 0.1
        });
        
        const logRecess = new THREE.Mesh(recessGeometry, recessMaterial);
        logRecess.position.set(x - 0.2, y - 0.1, z);
        this.scene.add(logRecess);
        
        // Add some logs with better positioning
        const logGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const logMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        });

        // Arrange logs in a more natural pile inside the recess
        for (let i = 0; i < 4; i++) {
            const log = new THREE.Mesh(logGeometry, logMaterial);
            const xOffset = (Math.random() - 0.5) * 0.2;
            const zOffset = (Math.random() - 0.5) * 0.3;
            log.position.set(x - 0.2, y + i * 0.07, z + zOffset);
            log.rotation.z = Math.PI/2;
            log.rotation.x = i * Math.PI/3;
            log.rotation.y = Math.random() * Math.PI/4;
            log.castShadow = true;
            this.scene.add(log);
        }

        // Create fire effect in the recessed area
        this.createFireEffect(x - 0.2, y + 0.25, z);
    }

    createFireEffect(x, y, z) {
        // Create a more robust fire effect using particles
        const fireCount = 60; // Reduced count for better performance

        // Create a particle container
        for (let i = 0; i < fireCount; i++) {
            // Create different types of fire particles
            let emberGeometry, emberMaterial;

            if (i < fireCount * 0.7) { // Regular embers
                emberGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.05);
                emberMaterial = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color(
                        0.8 + Math.random() * 0.2,
                        0.3 + Math.random() * 0.3,
                        0.0
                    ),
                    transparent: true,
                    opacity: 0.7
                });
            } else { // Smoke particles
                emberGeometry = new THREE.SphereGeometry(0.04 + Math.random() * 0.06);
                emberMaterial = new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color(0.2, 0.2, 0.2),
                    transparent: true,
                    opacity: 0.3
                });
            }

            const ember = new THREE.Mesh(emberGeometry, emberMaterial);
            
            // Tighter spread within the recessed area
            const spread = i < fireCount * 0.7 ? 0.35 : 0.5;
            ember.position.set(
                x + (Math.random() - 0.5) * spread,
                y + Math.random() * 0.2,
                z + (Math.random() - 0.5) * spread
            );

            // Store initial positions and particle behavior with strict height constraints
            ember.userData = {
                initialX: ember.position.x,
                initialY: ember.position.y,
                initialZ: ember.position.z,
                speed: 0.01 + Math.random() * 0.03,
                rotSpeed: Math.random() * 0.04 - 0.02,
                opacity: ember.material.opacity,
                opacitySpeed: 0.005 + Math.random() * 0.01,
                flickerSpeed: 0.05 + Math.random() * 0.1,
                isSmoke: i >= fireCount * 0.7,
                // Strict max height to stay within recess
                maxHeight: i < fireCount * 0.7 ? 
                    y + 0.5 : // Fire particles stay lower
                    y + 0.7   // Smoke particles can rise a bit higher
            };

            this.fireEmbers.push(ember);
            this.scene.add(ember);
        }
    }
    
    updateFireEmbers() {
        // Update fire embers with improved behavior
        for (let i = 0; i < this.fireEmbers.length; i++) {
            const ember = this.fireEmbers[i];
            const userData = ember.userData;
            
            // More conservative movement to keep particles within recess
            if (userData.isSmoke) {
                ember.position.y += userData.speed * 0.6;
                ember.position.x += Math.sin(performance.now() * 0.001 + i) * 0.001;
                ember.position.z += Math.cos(performance.now() * 0.001 + i) * 0.001;
            } else {
                ember.position.y += userData.speed * 0.8;
                // Reduced wobble
                ember.position.x += Math.sin(performance.now() * 0.002 + i) * 0.0005;
                ember.position.z += Math.cos(performance.now() * 0.002 + i) * 0.0005;
            }
            
            // Rotate slightly
            ember.rotation.y += userData.rotSpeed;
            
            // Flicker fire embers
            if (!userData.isSmoke) {
                // Random flicker for fire
                ember.material.opacity = userData.opacity * (0.7 + Math.sin(performance.now() * userData.flickerSpeed) * 0.3);
            } else {
                // Fade out smoke as it rises
                ember.material.opacity -= userData.opacitySpeed * 0.7;
                ember.scale.x += 0.001;
                ember.scale.y += 0.001;
                ember.scale.z += 0.001;
            }
            
            // Strictly enforce maximum height
            if (ember.position.y > userData.maxHeight) {
                // For smoke, fade out at max height
                if (userData.isSmoke) {
                    ember.material.opacity -= userData.opacitySpeed * 2.0;
                } 
                // Cap the height
                ember.position.y = userData.maxHeight;
            }
            
            // Reset particles when they fade out or hit max height
            if (ember.material.opacity <= 0.05 || 
                (ember.position.y >= userData.maxHeight && !userData.isSmoke)) {
                ember.position.y = userData.initialY;
                if (userData.isSmoke) {
                    ember.scale.set(1, 1, 1);
                }
                ember.material.opacity = userData.opacity;
                
                // Randomize position slightly when resetting
                const spread = userData.isSmoke ? 0.5 : 0.35;
                ember.position.x = userData.initialX + (Math.random() - 0.5) * spread;
                ember.position.z = userData.initialZ + (Math.random() - 0.5) * spread;
            }
        }
    }
}

export { FireplaceManager };