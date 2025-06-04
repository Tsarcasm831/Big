import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HUDSystem } from './HUDSystem.js';
import { SceneSetup } from './SceneSetup.js';
import { Furniture } from './Furniture.js';
import { Lighting } from './Lighting.js';
import { AudioManager } from './AudioManager.js';
import { PlayerControls } from './PlayerControls.js';
import { WindowManager } from './WindowManager.js';
import { FireplaceManager } from './FireplaceManager.js';
import { Recliner } from './Recliner.js';

// Wait for window load to avoid conflicts with React
window.addEventListener('load', function() {
    // Main game class
    class LordTsarcasmsHouse {
        constructor() {
            // DOM elements
            this.canvas = document.getElementById('game-canvas');
            this.loadingScreen = document.getElementById('loading-screen');
            this.interactionPrompt = document.getElementById('interaction-prompt');
            this.sarcasmMessage = document.getElementById('sarcasm-message');
            this.pauseMenu = document.getElementById('pause-menu');
            
            // Scene setup
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000);
            this.scene.fog = new THREE.FogExp2(0x000000, 0.02);
            
            // Camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 1.7, 0); // Height of a person
            
            // Renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.outputColorSpace = THREE.SRGBColorSpace; 
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.2; // Increased exposure for better visibility
            this.renderer.setClearColor(0x000000); // Explicitly set clear color
            
            // Setup cross-origin policy
            THREE.ImageUtils.crossOrigin = 'anonymous';
            
            // Controls
            this.controls = new PointerLockControls(this.camera, this.canvas);
            
            // Game state
            this.paused = true;
            this.objects = [];
            this.interactableObjects = [];
            this.raycaster = new THREE.Raycaster();
            this.highlightedObject = null;
            this.lastTime = performance.now();
            this.colliders = [];
            this.fireEmbers = [];
            
            // Loaders
            this.textureLoader = new THREE.TextureLoader();
            this.gltfLoader = new GLTFLoader();
            this.rgbeLoader = new RGBELoader();
            this.audioListener = new THREE.AudioListener();
            this.camera.add(this.audioListener);
            this.soundLoader = new THREE.AudioLoader();
            this.sounds = {};
            
            // Initialize modules
            this.lighting = new Lighting(this.scene);
            this.sceneSetup = new SceneSetup(this);
            this.furniture = new Furniture(this);
            this.audioManager = new AudioManager(this);
            // Ensure the AudioContext is resumed on the first user gesture.
            document.body.addEventListener('click', () => {
                this.audioManager.resumeAudio();
            }, { once: true });
            this.playerControls = new PlayerControls(this);
            this.windowManager = new WindowManager(this);
            this.fireplaceManager = new FireplaceManager(this);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start loading assets
            this.loadAssets();
        }
        
        setupEventListeners() {
            // Resize event
            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            });
            
            // Click to start - now works on the canvas directly and requires explicit user gesture
            this.canvas.addEventListener('click', () => {
                if (!this.controls.isLocked) {
                    // Request pointer lock within a user gesture event handler
                    this.controls.lock();
                }
            });
            
            // Modify pointer lock controls to use smoother camera movement
            if (this.controls) {
                // Override the default pointer lock onChange method
                const originalOnChange = this.controls.onMouseMove;
                this.controls.onMouseMove = (event) => {
                    // Apply sensitivity scaling
                    event.movementX *= this.playerControls?.mouseSensitivity || 0.65;
                    event.movementY *= this.playerControls?.mouseSensitivity || 0.65;
                    originalOnChange.call(this.controls, event);
                };
            }
            
            // Controls lock change
            this.controls.addEventListener('lock', () => {
                this.pauseMenu.classList.add('hidden');
                this.paused = false;
                
                // Resume audio context after pointer lock is acquired
                if (this.audioManager) {
                    this.audioManager.resumeAudio();
                }
                
                // Show HUD when game is active
                if (this.hud) this.hud.show();
            });
            
            // Show pause menu on unlock
            this.controls.addEventListener('unlock', () => {
                if (!this.loadingComplete) return;
                this.pauseMenu.classList.remove('hidden');
                this.paused = true;
                
                // Hide HUD when game is paused
                if (this.hud) this.hud.hide();
            });
            
            // UI buttons
            document.getElementById('resume-btn').addEventListener('click', () => {
                this.controls.lock();
            });
            
            document.getElementById('fullscreen-btn').addEventListener('click', () => {
                this.toggleFullscreen();
            });
            
            document.getElementById('exit-btn').addEventListener('click', () => {
                // For a web demo, we'll just reload the page
                window.location.reload();
            });
        }
        
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
        
        loadAssets() {
            // Instead of loading HDR which fails, create a simple environment
            const envColor = new THREE.Color(0x111111);
            this.scene.background = envColor;
            this.scene.environment = null;
            
            // Continue with other asset loading
            this.lighting.setupLights();
            this.lighting.fireplaceFlicker();
            
            // Add the light switch to interactive objects
            const lightSwitch = this.scene.children.find(
                child => child.userData && child.userData.type === 'lightSwitch'
            );
            if (lightSwitch) {
                this.interactableObjects.push(lightSwitch);
            }
            
            this.sceneSetup.createRoom();
            const northWall = this.scene.children.find(child => 
                child.position.z === -5 && child.position.y === 2.5);
            const eastWall = this.scene.children.find(child => 
                child.position.x === 5 && child.position.y === 2.5);
            const westWall = this.scene.children.find(child => 
                child.position.x === -5 && child.position.y === 2.5);
            
            this.sceneSetup.createDoor(northWall);
            this.sceneSetup.createFireplace(eastWall);
            this.sceneSetup.createRug();
            
            this.furniture.createBookshelf(-4.5, 0, -3);
            this.furniture.createBooks(-4.5, 1.1, -3);
            this.furniture.createDesk(3, 0, -4);
            this.furniture.createArmchair(2.5, 0, 0);
            this.furniture.createBed(-3, 0, 3);
            this.furniture.createPictureFrame(-2.5, 2.5, -4.8);
            this.furniture.createCabinet(2.5, 0, 4);
            this.furniture.createTableLamp(-2.5, 0, 2);
            const recliner = new Recliner(this);
            recliner.createRecliner(3, 0, -3); // Position chosen to avoid conflicts
            
            this.audioManager.loadSounds();
            
            // Create HUD after loading is complete
            this.hud = new HUDSystem(this);
            
            // Performance optimizations for the renderer
            this.renderer.powerPreference = "high-performance";
            
            // Lower shadow map size for better performance
            this.renderer.shadowMap.autoUpdate = false;
            this.renderer.shadowMap.needsUpdate = true;
            
            // Start the animation loop once everything is loaded
            this.loadingComplete = true;
            this.animate();
            
            // Hide loading screen but don't auto-lock controls
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                // Remove auto-start attempt after loading
            }, 1000);
        }
        
        showSarcasmMessage(message) {
            this.sarcasmMessage.textContent = message;
            this.sarcasmMessage.classList.remove('hidden');
            this.sarcasmMessage.style.transform = 'translateY(0)';
            
            clearTimeout(this.messageTimeout);
            this.messageTimeout = setTimeout(() => {
                this.sarcasmMessage.style.transform = 'translateY(-20px)';
                this.sarcasmMessage.classList.add('hidden');
            }, 5000);
        }
        
        interactWithObject(object) {
            if (object.userData && object.userData.interactable && object.userData.interaction) {
                object.userData.interaction();
            }
        }
        
        update() {
            const time = performance.now();
            
            if (!this.paused) {
                // Update player controls
                this.playerControls.update();
                
                // Play footstep sounds when moving
                if ((this.playerControls.moveForward || this.playerControls.moveBackward || 
                     this.playerControls.moveLeft || this.playerControls.moveRight) && 
                    this.sounds.footstep && !this.sounds.footstep.isPlaying) {
                    this.sounds.footstep.play();
                }
            }
            
            // Update fire effects - now calls fireplaceManager
            if (this.fireplaceManager) {
                this.fireplaceManager.updateFireEmbers();
            }
            
            this.lastTime = time;
        }
        
        handleCollisions() {
            // Simple collision detection
            const playerPosition = this.camera.position.clone();
            const playerRadius = 0.3; // Approximate player radius

            for (const collider of this.colliders) {
                // Safely skip colliders that are undefined or lack a geometry property
                if (!collider || !collider.geometry) continue;
                
                if (collider.geometry.type === 'PlaneGeometry') {
                    // Floor collision is now handled in PlayerControls.update()
                } else {
                    // Simple bounding box collision with walls and furniture
                    const box = new THREE.Box3().setFromObject(collider);
                    const sphere = new THREE.Sphere(playerPosition, playerRadius);
                    
                    if (box.intersectsSphere(sphere)) {
                        // Calculate push-back direction
                        const boxCenter = new THREE.Vector3();
                        box.getCenter(boxCenter);
                        
                        const pushDirection = playerPosition.clone().sub(boxCenter).normalize();
                        pushDirection.y = 0; // Keep on same Y level
                        
                        // Move player away from collision
                        this.camera.position.add(pushDirection.multiplyScalar(0.1));
                    }
                }
            }
        }
        
        checkInteractions() {
            // Only check interactions every few frames to reduce performance impact
            if (!this._interactionCheckCounter || this._interactionCheckCounter > 5) {
                this._interactionCheckCounter = 0;
                
                // Cast a ray from the camera
                this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
                
                // Check for interactable objects
                const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);
                
                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    
                    // Only highlight if it's interactable
                    if (object.userData && object.userData.interactable) {
                        // Highlight the object
                        if (this.highlightedObject !== object) {
                            // Reset previous highlighted object
                            if (this.highlightedObject) {
                                this.highlightedObject.material.emissive.set(0x000000);
                            }
                            
                            // Highlight new object
                            object.material.emissive.set(0x222222);
                            this.highlightedObject = object;
                            
                            // Show interaction prompt
                            this.interactionPrompt.classList.remove('hidden');
                        }
                        return;
                    }
                }
                
                // No interactable objects in sight
                if (this.highlightedObject) {
                    this.highlightedObject.material.emissive.set(0x000000);
                    this.highlightedObject = null;
                    this.interactionPrompt.classList.add('hidden');
                }
            } else {
                this._interactionCheckCounter++;
            }
        }
        
        animate() {
            requestAnimationFrame(() => this.animate());
            
            if (this.loadingComplete) {
                this.update();
                
                // Update HUD if it exists
                if (this.hud) {
                    this.hud.update();
                }
                
                // Check for interactions and collisions (but less frequently)
                this.checkInteractions();
                
                // Only check collisions every few frames
                if (!this._collisionCheckCounter || this._collisionCheckCounter > 3) {
                    this._collisionCheckCounter = 0;
                    this.handleCollisions();
                } else {
                    this._collisionCheckCounter++;
                }
                
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
    
    // Initialize the game when the DOM is loaded - moved inside window load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => new LordTsarcasmsHouse(), 100);
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => new LordTsarcasmsHouse(), 100);
        });
    }
});