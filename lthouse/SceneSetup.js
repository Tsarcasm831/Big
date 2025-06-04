/**
 * SceneSetup.js
 * 
 * Manages the creation of the room (walls, floor, ceiling), door, fireplace, window, rug, and fire embers.
 * Responsible for the overall structure of the 3D environment and interactive elements.
 */
import * as THREE from 'three';

class SceneSetup {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.textureLoader = game.textureLoader;
        this.colliders = game.colliders;
        this.interactableObjects = game.interactableObjects;
        
        // Store a reference to the game in the scene for the light switch
        this.scene.userData.game = game;
    }

    createRoom() {
        const roomSize = 10;
        const wallHeight = 5;

        // Updated floor and wall textures
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x553311,
            roughness: 0.9,
            metalness: 0.1
        });
        const wallTexture = this.textureLoader.load('stone.png');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(2, 1);
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            map: wallTexture,
            roughness: 0.7,
            metalness: 0.2
        });
        const ceilingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x776655,
            roughness: 0.8,
            metalness: 0.2
        });

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.scene.add(floor);
        this.colliders.push(floor);

        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = wallHeight;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // Walls
        const wallGeometry = new THREE.PlaneGeometry(roomSize, wallHeight);

        // North wall with door gap – split into three segments (left, right, top)
        const doorGapWidth = 1.5; // door width
        const doorHeight = 2.5;
        // Left segment: covers x from -5 to -0.75
        const leftWidth = 5 - 0.75; // 4.25
        const leftGeometry = new THREE.PlaneGeometry(leftWidth, doorHeight);
        const leftWall = new THREE.Mesh(leftGeometry, wallMaterial);
        // Center of left segment: (-5 + (-0.75))/2 = -2.875, y = doorHeight/2 = 1.25
        leftWall.position.set(-2.875, doorHeight/2, -roomSize/2);
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        this.colliders.push(leftWall);

        // Right segment: covers x from 0.75 to 5
        const rightWidth = 5 - 0.75; // 4.25
        const rightGeometry = new THREE.PlaneGeometry(rightWidth, doorHeight);
        const rightWall = new THREE.Mesh(rightGeometry, wallMaterial);
        // Center of right segment: (0.75+5)/2 = 2.875, y = 1.25
        rightWall.position.set(2.875, doorHeight/2, -roomSize/2);
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
        this.colliders.push(rightWall);

        // Top segment: covers entire width above the door (from y = doorHeight to wallHeight)
        const topHeight = wallHeight - doorHeight; // 2.5
        const topGeometry = new THREE.PlaneGeometry(roomSize, topHeight);
        const topWall = new THREE.Mesh(topGeometry, wallMaterial);
        // Center at (0, doorHeight + topHeight/2, -roomSize/2) = (0, 3.75, -roomSize/2)
        topWall.position.set(0, doorHeight + topHeight/2, -roomSize/2);
        topWall.receiveShadow = true;
        this.scene.add(topWall);
        this.colliders.push(topWall);

        // South wall
        const southWall = new THREE.Mesh(wallGeometry, wallMaterial);
        southWall.position.z = roomSize/2;
        southWall.position.y = wallHeight/2;
        southWall.rotation.y = Math.PI;
        southWall.receiveShadow = true;
        this.scene.add(southWall);
        this.colliders.push(southWall);

        // East wall (with fireplace)
        const eastWall = new THREE.Mesh(wallGeometry, wallMaterial);
        eastWall.position.x = roomSize/2;
        eastWall.position.y = wallHeight/2;
        eastWall.rotation.y = -Math.PI/2;
        eastWall.receiveShadow = true;
        this.scene.add(eastWall);
        this.colliders.push(eastWall);

        // West wall (with window)
        const westWall = new THREE.Mesh(wallGeometry, wallMaterial);
        westWall.position.x = -roomSize/2;
        westWall.position.y = wallHeight/2;
        westWall.rotation.y = Math.PI/2;
        westWall.receiveShadow = true;
        this.scene.add(westWall);
        this.colliders.push(westWall);

        // Make wall lights interactable
        if (this.game.lighting && this.game.lighting.wallLights) {
            this.game.lighting.wallLights.forEach((light, index) => {
                light.userData = {
                    interactable: true,
                    type: 'wallLight',
                    interaction: () => {
                        // Toggle the wall light on/off
                        light.intensity = light.intensity > 0 ? 0 : 0.7;
                        this.game.showSarcasmMessage('Yes, adjust the lighting. That will surely make this room less dreary.');
                    }
                };
                this.interactableObjects.push(light);
            });
        }
    }

    createDoor(parentWall) {
        const doorWidth = 1.5;
        const doorHeight = 2.5;
        // Create a pivot for the door (to act as the hinge)
        this.doorPivot = new THREE.Object3D();
        // Create the door mesh
        const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.1);
        const doorTexture = this.textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            map: doorTexture,
            roughness: 0.7,
            metalness: 0.3
        });
        this.door = new THREE.Mesh(doorGeometry, doorMaterial);
        // Shift the door so that its left edge aligns with the pivot (i.e. set x = doorWidth/2)
        this.door.position.x = doorWidth / 2;
        this.door.castShadow = true;
        // Add door mesh to the pivot
        this.doorPivot.add(this.door);
        // Position the pivot at the left hinge location of the door gap (door gap from -0.75 to 0.75; hinge at -0.75)
        this.doorPivot.position.set(-0.75, doorHeight / 2, -4.95);
        this.scene.add(this.doorPivot);

        // Initialize animation flag and door open state (false means closed)
        this.doorPivot.userData.isAnimating = false;
        this.doorPivot.userData.isOpen = false;

        // Make the door mesh interactable (it now carries the interaction callback)
        this.door.userData = {
            interactable: true,
            type: 'door',
            interaction: () => {
                if (!this.doorPivot.userData.isAnimating) {
                    this.animateDoorSwing();
                }
            }
        };

        // Add the door mesh (instead of the pivot) to the interactable objects for proper raycasting
        this.interactableObjects.push(this.door);
    }

    animateDoorSwing() {
        if (!this.doorPivot) return;
        if (this.doorPivot.userData.isAnimating) return;
        const pivot = this.doorPivot;
        pivot.userData.isAnimating = true;
        const duration = 1000; // animation duration in milliseconds
        const startRotation = pivot.rotation.y;
        // Toggle: if door is closed (isOpen false), open to -Math.PI/2; if open, close (set to 0)
        const endRotation = pivot.userData.isOpen ? 0 : -Math.PI / 2;
        const startTime = performance.now();
        const animate = (time) => {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1);
            pivot.rotation.y = startRotation + t * (endRotation - startRotation);
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                pivot.userData.isAnimating = false;
                pivot.userData.isOpen = !pivot.userData.isOpen; // Toggle door state
            }
        };
        requestAnimationFrame(animate);
    }

    createFireplace(parentWall) {
        // Fireplace base structure
        const baseGeometry = new THREE.BoxGeometry(2, 1.5, 0.5);
        const stoneMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B7765,
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true
        });

        const fireplace = new THREE.Mesh(baseGeometry, stoneMaterial);
        fireplace.position.set(4.8, 0.75, 0);
        fireplace.rotation.y = -Math.PI/2;
        fireplace.castShadow = true;
        fireplace.receiveShadow = true;
        this.scene.add(fireplace);
        this.colliders.push(fireplace);

        // Create a frame for the fireplace opening
        const frameGeometry = new THREE.BoxGeometry(1.5, 1.1, 0.6);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x665544,
            roughness: 0.85,
            metalness: 0.15
        });
        
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(4.55, 1.05, 0);
        frame.rotation.y = -Math.PI/2;
        frame.castShadow = true;
        this.scene.add(frame);

        // Create recessed fireplace cavity (black interior)
        const cavityGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.8);
        const blackMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.95,
            metalness: 0.05
        });

        const cavity = new THREE.Mesh(cavityGeometry, blackMaterial);
        cavity.position.set(4.45, 1.0, 0); 
        cavity.rotation.y = -Math.PI/2;
        this.scene.add(cavity);

        // Fireplace mantel (decorative shelf above) - clearly separated from the cavity
        const mantelGeometry = new THREE.BoxGeometry(2.4, 0.15, 0.7);
        const mantelMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.8,
            metalness: 0.2
        });
        const mantel = new THREE.Mesh(mantelGeometry, mantelMaterial);
        mantel.position.set(4.6, 1.7, 0);
        mantel.rotation.y = -Math.PI/2;
        mantel.castShadow = true;
        this.scene.add(mantel);

        // Add logs and fire effect with adjusted position
        this.game.fireplaceManager.createFireLogs(4.4, 0.65, 0); 

        // Make fireplace interactable
        fireplace.userData = {
            interactable: true,
            type: 'fireplace',
            interaction: () => {
                this.game.showSarcasmMessage('Ah yes, MORE fire. Because it was getting so cold in here with all this burning sarcasm.');
                if (this.game.sounds.fireplaceSound) {
                    this.game.sounds.fireplaceSound.play();
                }
            }
        };
        this.interactableObjects.push(fireplace);
    }

    createWindow(parentWall) {
        // Function kept as a placeholder but implementation removed
        // Window Manager's createWindow method is now empty
    }

    createRug() {
        // Create a simple rug in front of the fireplace
        const rugGeometry = new THREE.PlaneGeometry(3, 2);
        const rugTexture = this.textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
        rugTexture.wrapS = rugTexture.wrapT = THREE.RepeatWrapping;
        rugTexture.repeat.set(0.5, 0.5);

        const rugMaterial = new THREE.MeshStandardMaterial({ 
            map: rugTexture,
            roughness: 0.9,
            metalness: 0.0,
            color: 0x834240
        });

        const rug = new THREE.Mesh(rugGeometry, rugMaterial);
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(3, 0.01, 0); 
        rug.receiveShadow = true;
        this.scene.add(rug);
    }
}

export { SceneSetup };