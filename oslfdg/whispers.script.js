// Import Utilities
import {
    createScene,
    createSharedMaterials,
    createFallbackEnvironment,
    createAmbientParticles,
    createUserGlyph
} from './babylonUtils.js';
// Import UI Handlers
import {
    showWhisperInput,
    hideWhisperInput,
    displayWhisperText,
    hideWhisperDisplay,
    isWhisperInputActive
} from './whispersUI.js';

// Assign BABYLON from global scope for safety and clarity
const BABYLON = window.BABYLON;

// Guard against BABYLON not being loaded
if (!BABYLON) {
    console.error("Babylon.js core not loaded!");
    // Display an error message to the user
    const errorDiv = document.getElementById('error-indicator');
    if (errorDiv) errorDiv.style.display = 'block';
    // Hide loading indicator if it exists
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) loadingDiv.style.display = 'none';

} else {
    // Destructure necessary components AFTER confirming BABYLON exists
    // Use direct BABYLON access for potentially optional modules (GridMaterial, GlowLayer, etc.)
    const {
        Engine, Scene, Vector3, Color3, Color4,
        MeshBuilder, PBRMaterial, Animation
        // PointerEventTypes, StandardMaterial, HemisphericLight, PointLight, DirectionalLight, GlowLayer, SceneLoader, Texture, CubeTexture - Moved to utils or unused
    } = BABYLON;
    const GUI = BABYLON.GUI; // Access GUI namespace

    // --- Global Variables for this Script ---
    const whisperObjects = []; // Store whisper data & meshes: [{ id, text, mesh, timestamp, originalAlpha, originalEmissive }]
    const otherUserGlyphs = {}; // Store other users: { userId: mesh }
    let engine;
    let scene;
    let userGlyph = null; // Player's representation
    let advancedTexture; // For GUI
    let hoverMaterial; // Material for highlighting whispers
    let baseWhisperMaterial; // Base material for whispers
    let websocket = null; // WebSocket connection (Placeholder)

    document.addEventListener('DOMContentLoaded', async () => {
        // --- UI Indicators ---
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorIndicator = document.getElementById('error-indicator');

        // Show loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'block';

        // --- Constants ---
        const WHISPER_LIFESPAN_MS = 24 * 60 * 60 * 1000; // 24 hours
        const WHISPER_FADE_START_RATIO = 0.9; // Start fading last 10% of lifespan

        // --- Canvas and Engine ---
        const canvas = document.getElementById("renderCanvas");
        if (!canvas) {
            console.error("Render canvas not found!");
            if (errorIndicator) errorIndicator.style.display = 'block';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            return;
        }

        try {
            engine = new Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true,
                antialias: true
            }, true);
        } catch (e) {
            console.error("Failed to initialize Babylon Engine:", e);
            if (errorIndicator) errorIndicator.style.display = 'block';
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            return;
        }

        // --- Scene Setup and Initialization ---
        try {
            // Hide loading indicator immediately (Babylon will handle showing canvas)
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            // Create the scene using the imported utility function
            scene = createScene(engine, canvas); // Assign to scope variable

            if (!scene) {
                console.error("Scene creation returned null or undefined.");
                throw new Error("Scene creation failed.");
            }

            // Wait for the scene to be ready (assets loaded, etc.)
            await scene.whenReadyAsync(); // Use standard async await
            console.log("Scene is ready.");

            // Now that the scene is ready, setup everything else
            const materials = createSharedMaterials(scene); // Get materials from util
            baseWhisperMaterial = materials.baseWhisperMaterial;
            hoverMaterial = materials.hoverMaterial;

            // Check if materials were created successfully
            if (!baseWhisperMaterial || !hoverMaterial) {
                console.warn("Shared materials were not created successfully. Visuals might be affected.");
                // Assign fallback materials if needed, or handle the error appropriately
            }

            createFallbackEnvironment(scene); // Create ground/skybox
            createAmbientParticles(scene); // Create particles

            // Initialize GUI *after* scene exists and is ready
            if (GUI && GUI.AdvancedDynamicTexture) { // Check if GUI is loaded
                advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
                advancedTexture.idealWidth = 1920; // Set ideal size for scaling
                advancedTexture.idealHeight = 1080;
                advancedTexture.renderAtIdealSize = true; // Enable scaling
                advancedTexture.useSmallestIdeal = true; // Adjust scaling mode if needed
            } else {
                console.warn("Babylon.GUI not fully loaded. UI elements disabled.");
            }

            // Player Representation *after* scene exists and is ready
            userGlyph = createUserGlyph(scene); // Create glyph using util

            // Set camera target AFTER user glyph is created
            if (userGlyph && scene.activeCamera) {
                scene.activeCamera.setTarget(userGlyph.position.add(new Vector3(0, 0.2, 0)));
                // Set initial camera position relative to glyph
                scene.activeCamera.alpha = -Math.PI / 2; // Behind
                scene.activeCamera.beta = Math.PI / 3;   // Angled down
                scene.activeCamera.radius = 5;          // Distance
            } else {
                 console.warn("User glyph or active camera not available for setting target.");
            }

            // --- Setup Pointer Interactions ---
            setupPointerInteractions(scene);

            // --- Connect WebSocket (Placeholder) ---
            // connectWebSocket();

            // --- Start Render Loop ---
            engine.runRenderLoop(() => {
                if (scene && scene.activeCamera) { // Check scene/camera status
                    try {
                        updateWhisperVisuals(); // Update whisper fading first
                        scene.render(); // Then render the scene
                    } catch (renderError) {
                        console.error("Error during scene render:", renderError);
                        // Consider stopping the loop if errors persist
                        // engine.stopRenderLoop();
                    }
                }
            });

            // Handle resize
            window.addEventListener("resize", () => {
                engine.resize();
            });

            // Show canvas after scene is ready and render loop started
            canvas.style.opacity = 1;

        } catch (error) {
            console.error("Error during initialization or scene setup:", error);
            // Display error message to the user
            if (errorIndicator) errorIndicator.style.display = 'block';
            if (loadingIndicator) loadingIndicator.style.display = 'none'; // Ensure loading is hidden on error
        }
    }); // <-- End of DOMContentLoaded listener

    // --- Function Definitions outside DOMContentLoaded ---

    // Update Whisper Visuals (Fade, Remove Old)
    function updateWhisperVisuals() {
        const currentTime = Date.now();
        const whispersToRemoveIndices = []; // Collect indices to remove

        // Iterate through whispers
        for (let i = whisperObjects.length - 1; i >= 0; i--) {
            const whisper = whisperObjects[i];

            // Basic validation
            if (!whisper || !whisper.mesh || !whisper.mesh.material) {
                console.warn(`Invalid whisper object or properties at index ${i}, marking for removal.`);
                whispersToRemoveIndices.push(i);
                if (whisper && whisper.mesh) { // Attempt to dispose mesh if it exists
                    whisper.mesh.dispose();
                }
                continue; // Skip to next whisper
            }

            const elapsed = currentTime - whisper.timestamp;
            const lifespan = WHISPER_LIFESPAN_MS; // Use constant
            const fadeStart = lifespan * WHISPER_FADE_START_RATIO; // Use constant

            if (elapsed > lifespan) {
                // Mark for removal and dispose mesh
                whispersToRemoveIndices.push(i);
                whisper.mesh.dispose();
            } else if (elapsed > fadeStart) {
                // Calculate fade based on remaining time
                // Ensure fadeFactor doesn't go below 0
                const fadeDuration = lifespan * (1 - WHISPER_FADE_START_RATIO);
            }
        }
    }

    // Function to setup pointer interactions
    function setupPointerInteractions(scene) {
        scene.onPointerDown = (evt, pickInfo) => {
            // --- Handle Pointer Down ---
            // Check if clicked on a whisper
            if (pickInfo.hit && pickInfo.pickedMesh && pickInfo.pickedMesh.metadata && pickInfo.pickedMesh.metadata.whisperId) {
                const whisperId = pickInfo.pickedMesh.metadata.whisperId;
                const whisperData = whisperObjects.find(data => data.id === whisperId);
                if (whisperData) {
                    displayWhisperText(whisperData);
                }
                // Prevent ground click logic if a whisper was clicked
                return;
            }

            // Check if clicked on the ground
            if (pickInfo.hit && pickInfo.pickedMesh && pickInfo.pickedMesh.name === "ground") {
                // Ground click - show input only if not already shown
                showWhisperInput(scene, advancedTexture);
            } else {
                // Clicked something else or empty space - hide input/display
                hideWhisperInput();
                hideWhisperDisplay();
            }
        };

        // --- Handle Pointer Move (Hover) ---
        let lastHoveredWhisper = null;
        scene.onPointerMove = (evt, pickInfo) => {
            const pointerX = scene.pointerX;
            const pointerY = scene.pointerY;
            const result = scene.pick(pointerX, pointerY, (mesh) => mesh.isPickable && mesh.isVisible && mesh.isEnabled() && mesh.metadata && mesh.metadata.whisperId);

            const currentHovered = (result && result.hit) ? result.pickedMesh : null;

            // If hovering over a whisper
            if (currentHovered) {
                // If it's different from the last hovered whisper
                if (lastHoveredWhisper !== currentHovered) {
                    // Restore the previous one if it exists and needs restoring
                    if (lastHoveredWhisper && lastHoveredWhisper.material !== baseWhisperMaterial) {
                        const prevWhisperData = whisperObjects.find(w => w.mesh === lastHoveredWhisper);
                        if (prevWhisperData) {
                            // Only restore if the material isn't already the base
                            if (lastHoveredWhisper.material !== baseWhisperMaterial) {
                                lastHoveredWhisper.material = baseWhisperMaterial;
                            }
                        }
                    }
                    // Apply hover material to the current one if needed
                    if (currentHovered.material !== hoverMaterial && hoverMaterial) {
                        currentHovered.material = hoverMaterial;
                    }
                    lastHoveredWhisper = currentHovered;
                }
            } else { // Not hovering over any whisper
                // Restore the last hovered whisper if there was one and it needs restoring
                if (lastHoveredWhisper && lastHoveredWhisper.material !== baseWhisperMaterial) {
                    const prevWhisperData = whisperObjects.find(w => w.mesh === lastHoveredWhisper);
                    if (prevWhisperData) {
                        // Only restore if the material isn't already the base
                        if (lastHoveredWhisper.material !== baseWhisperMaterial) {
                            lastHoveredWhisper.material = baseWhisperMaterial;
                        }
                    }
                }
                lastHoveredWhisper = null; // Reset last hovered
            }
        };
    }
}