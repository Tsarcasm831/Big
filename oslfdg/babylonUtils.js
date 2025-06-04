// --- Babylon Utility Functions ---

// Assign BABYLON from global scope for safety and clarity
const BABYLON = window.BABYLON;
const GUI = BABYLON.GUI;

// Destructure necessary components AFTER confirming BABYLON exists
// Use direct BABYLON access for potentially optional modules (GridMaterial, GlowLayer, etc.)
const {
    Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, PointLight, DirectionalLight, Color3, Color4,
    MeshBuilder, StandardMaterial, PBRMaterial, GlowLayer, Animation, SceneLoader, Texture, CubeTexture,
    PointerEventTypes, Scalar, Space 
} = BABYLON;


// --- Scene Creation Function ---
export function createScene(engine, canvas) {
    if (!Scene || !ArcRotateCamera || !Vector3 || !DirectionalLight || !PointLight || !Color3 || !Color4) {
         console.error("Core BABYLON components missing for scene creation.");
         return null;
    }
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.005, 0.005, 0.01, 1); // Even darker background
    scene.collisionsEnabled = true; // Enable collisions for camera/player later if needed
    scene.gravity = new Vector3(0, -0.9, 0); // Optional gravity

    // --- Camera ---
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.8, 20, new Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 40;
    camera.wheelPrecision = 100; // Slower zoom
    camera.checkCollisions = true; // Prevent camera clipping through ground/objects
    camera.collisionRadius = new Vector3(0.5, 0.5, 0.5);
    camera.angularSensibilityX = 3000; // Adjust rotation speed
    camera.angularSensibilityY = 3000;
    window.camera = camera; // Make accessible for debugging if needed

    // --- Lighting ---
    const dirLight = new DirectionalLight("dir01", new Vector3(-0.2, -1, -0.3), scene);
    dirLight.position = new Vector3(20, 40, 20);
    dirLight.intensity = 0.1;
    dirLight.diffuse = new Color3(0.8, 0.8, 1.0);
    dirLight.specular = new Color3(0.1, 0.1, 0.2);

    const pointLight = new PointLight("pointLight", new Vector3(0, 5, 0), scene);
    pointLight.intensity = 0.3;
    pointLight.diffuse = new Color3(0.7, 0.7, 1.0);
    pointLight.specular = new Color3(0.2, 0.2, 0.3);
    pointLight.range = 30;

    // --- Glow Layer (Check if available) ---
    if (BABYLON.GlowLayer) { // Check directly on BABYLON object
        const glowLayer = new BABYLON.GlowLayer("glow", scene, {
            mainTextureRatio: 0.75,
            blurKernelSize: 32
        });
        glowLayer.intensity = 0.5;
    } else {
        console.warn("GlowLayer component not found (babylonjs.materials?). Glow effect disabled.");
    }

    return scene;
}

// --- Shared Materials ---
export function createSharedMaterials(scene) {
    if (!scene || !PBRMaterial || !Color3) {
        console.error("Cannot create shared materials: Scene or PBRMaterial/Color3 not available.");
        return { baseWhisperMaterial: null, hoverMaterial: null }; // Return nulls on failure
    }
    // Create materials
    const baseWhisperMaterial = new PBRMaterial("whisperBaseMat", scene);
    baseWhisperMaterial.albedoColor = new Color3(0.1, 0.1, 0.2);
    baseWhisperMaterial.emissiveColor = new Color3(0.3, 0.3, 0.7); 
    baseWhisperMaterial.metallic = 0.3; 
    baseWhisperMaterial.roughness = 0.5; 
    baseWhisperMaterial.alpha = 0.75; 
    baseWhisperMaterial.backFaceCulling = false;
    baseWhisperMaterial.emissiveIntensity = 0.8; 
    baseWhisperMaterial.ambientColor = new Color3(0.1, 0.1, 0.2); 
    baseWhisperMaterial.useAmbientOcclusionFromMetallicTextureRed = true; 
    baseWhisperMaterial.useRoughnessFromMetallicTextureGreen = true;
    baseWhisperMaterial.useMetallnessFromMetallicTextureBlue = true;
    baseWhisperMaterial.environmentIntensity = 0.5; 

    const hoverMaterial = new PBRMaterial("whisperHoverMat", scene);
    hoverMaterial.albedoColor = new Color3(0.2, 0.2, 0.3);
    hoverMaterial.emissiveColor = new Color3(0.8, 0.8, 1.0); 
    hoverMaterial.metallic = 0.4;
    hoverMaterial.roughness = 0.4;
    hoverMaterial.alpha = 0.9;
    hoverMaterial.backFaceCulling = false;
    hoverMaterial.emissiveIntensity = 1.3; 
    hoverMaterial.ambientColor = new Color3(0.2, 0.2, 0.3);
    hoverMaterial.useAmbientOcclusionFromMetallicTextureRed = true;
    hoverMaterial.useRoughnessFromMetallicTextureGreen = true;
    hoverMaterial.useMetallnessFromMetallicTextureBlue = true;
    hoverMaterial.environmentIntensity = 0.6;

    return { baseWhisperMaterial, hoverMaterial };
}

// --- Fallback Environment ---
export function createFallbackEnvironment(scene) {
    if (!scene || !MeshBuilder || !StandardMaterial || !Color3) {
        console.error("Cannot create fallback environment: Scene or core components not available.");
        return;
    }
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBoxMat", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;

    const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

    // Check specifically for GridMaterial availability on BABYLON object
    console.log(`Checking for BABYLON.GridMaterial in createFallbackEnvironment. Found: ${typeof BABYLON.GridMaterial !== 'undefined' ? 'Yes' : 'No'}`);
    // Use a more robust typeof check
    if (typeof BABYLON.GridMaterial !== 'undefined') {
        console.log("Attempting to apply GridMaterial.");
         try { // Add try-catch around instantiation
            const groundMaterial = new BABYLON.GridMaterial("groundMat", scene); // Use BABYLON.GridMaterial directly
            groundMaterial.majorUnitFrequency = 10;
            groundMaterial.minorUnitVisibility = 0.3;
            groundMaterial.gridRatio = 1;
            groundMaterial.backFaceCulling = false;
            groundMaterial.mainColor = new Color3(0.05, 0.05, 0.1);
            groundMaterial.lineColor = new Color3(0.3, 0.3, 0.5);
            groundMaterial.opacity = 0.9;
            ground.material = groundMaterial;
            console.log("GridMaterial applied successfully.");
         } catch (e) {
             console.error("Error instantiating BABYLON.GridMaterial:", e);
             // Fallback if instantiation fails even if type check passed
             console.warn("Using fallback StandardMaterial due to GridMaterial instantiation error.");
             const fallbackMaterial = new StandardMaterial("fallbackGroundMat", scene);
             fallbackMaterial.diffuseColor = new Color3(0.15, 0.15, 0.2);
             fallbackMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
             ground.material = fallbackMaterial;
         }
    } else {
        console.warn("BABYLON.GridMaterial class not found on BABYLON object when checked. Using fallback StandardMaterial for ground.");
        const fallbackMaterial = new StandardMaterial("fallbackGroundMat", scene);
        fallbackMaterial.diffuseColor = new Color3(0.15, 0.15, 0.2);
        fallbackMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        ground.material = fallbackMaterial;
    }

    ground.checkCollisions = true;
    ground.isPickable = true; // Make ground pickable for floor clicks
}

// --- Ambient Particles ---
export function createAmbientParticles(scene) {
    // Check if ParticleSystem and Texture are available on BABYLON
    if (!scene || !BABYLON.ParticleSystem || !BABYLON.Texture || !Vector3 || !Color4) {
        console.warn("Cannot create ambient particles: Scene, ParticleSystem or Texture not available (babylonjs.particles?). Particles disabled.");
        return;
    }
    const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    try {
        // Using a known working particle texture URL
        particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", scene);
    } catch (e) {
        console.error("Failed to load particle texture:", e);
        return; // Don't proceed if texture fails
    }

    particleSystem.emitter = new Vector3(0, 15, 0);
    particleSystem.minEmitBox = new Vector3(-50, -5, -50);
    particleSystem.maxEmitBox = new Vector3(50, 5, 50);

    particleSystem.color1 = new Color4(0.7, 0.7, 1.0, 0.1);
    particleSystem.color2 = new Color4(0.5, 0.5, 0.8, 0.05);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    particleSystem.minLifeTime = 5.0;
    particleSystem.maxLifeTime = 15.0;

    particleSystem.emitRate = 50;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.gravity = new Vector3(0, -0.05, 0);

    particleSystem.minAngularSpeed = -0.5;
    particleSystem.maxAngularSpeed = 0.5;

    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1.5;
    particleSystem.updateSpeed = 0.01;

    particleSystem.start();
}

// --- User Glyph Creation ---
export function createUserGlyph(scene) {
    if (!scene || !MeshBuilder || !PBRMaterial || !Animation || !Vector3 || !Color3) {
        console.error("Cannot create user glyph: Scene or required components not available.");
        return null; // Return null on failure
    }
    // Create glyph
    const userGlyph = MeshBuilder.CreatePolyhedron("playerGlyph", { type: 2, size: 0.25 }, scene);
    const glyphMat = new PBRMaterial("glyphMat", scene);
    glyphMat.albedoColor = new Color3(0.1, 0.1, 0.15);
    glyphMat.emissiveColor = new Color3(0.9, 0.9, 1.0);
    glyphMat.metallic = 0.3;
    glyphMat.roughness = 0.4;
    glyphMat.alpha = 0.95;
    glyphMat.emissiveIntensity = 1.5;

    // Add to glow layer if available
    const glowLayerInstance = scene.getGlowLayerByName("glow"); // Get by name
    if (glowLayerInstance) {
        glowLayerInstance.addIncludedOnlyMesh(userGlyph);
    } else {
        console.warn("Glow layer not found when creating user glyph.");
    }

    userGlyph.material = glyphMat;
    userGlyph.position = new Vector3(0, 0.5, 0);
    userGlyph.checkCollisions = true;
    userGlyph.ellipsoid = new Vector3(0.25, 0.5, 0.25);
    userGlyph.isPickable = false; // User glyph shouldn't be clicked

    // Rotation Animation
    const rotAnim = new Animation("glyphRotate", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const rotKeys = [];
    rotKeys.push({ frame: 0, value: 0 });
    rotKeys.push({ frame: 300, value: Math.PI * 2 });
    rotAnim.setKeys(rotKeys);
    userGlyph.animations.push(rotAnim);
    scene.beginAnimation(userGlyph, 0, 300, true);

    // Pulse Animation
    const pulseAnim = new Animation("glyphPulse", "material.emissiveIntensity", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const pulseKeys = [];
    pulseKeys.push({ frame: 0, value: 1.5 });
    pulseKeys.push({ frame: 60, value: 1.0 });
    pulseKeys.push({ frame: 120, value: 1.5 });
    pulseAnim.setKeys(pulseKeys);
    // Check if material exists before adding animation
    if (userGlyph.material) {
        userGlyph.animations.push(pulseAnim);
        scene.beginAnimation(userGlyph, 0, 120, true, 1.0);
    }

    return userGlyph; // Return the created glyph
}

// --- Whisper Mesh Creation ---
export function createWhisperMesh(scene, whisperData, material) {
    if (!scene || !whisperData || !MeshBuilder || !material || !Animation || !Vector3 || !Scalar) {
        console.error("Cannot create whisper mesh: Scene, data, material, or required components missing.");
        return null;
    }
    const whisperMesh = MeshBuilder.CreateIcoSphere(`whisper_${whisperData.id}`, { radius: 0.5 + Math.random() * 0.3, subdivisions: 3 }, scene);
    whisperMesh.material = material;
    whisperMesh.metadata = { whisperId: whisperData.id };
    whisperMesh.isPickable = true;

    // Position randomly within a radius
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 15; 
    const yPos = 0.5 + Math.random() * 2; 
    whisperMesh.position = new Vector3(
        radius * Math.cos(angle),
        yPos,
        radius * Math.sin(angle)
    );

    // Check collisions for whispers? Maybe not, let them float through things
    // whisperMesh.checkCollisions = true;
    // whisperMesh.ellipsoid = new Vector3(0.5, 0.5, 0.5);

    // Add subtle animations
    // 1. Slow Rotation (different axis and speed per whisper)
    const rotAxis = Vector3.Random(-1, 1).normalize();
    const rotSpeed = (Math.random() - 0.5) * 0.005; 
    scene.onBeforeRenderObservable.add(() => {
        if (whisperMesh && !whisperMesh.isDisposed()) {
            whisperMesh.rotate(rotAxis, rotSpeed, Space.WORLD);
        }
    });

    // 2. Gentle Bobbing Animation
    const bobAnim = new Animation("whisperBob", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const bobKeys = [];
    const startY = whisperMesh.position.y;
    bobKeys.push({ frame: 0, value: startY });
    bobKeys.push({ frame: 90, value: startY + 0.2 + Math.random() * 0.2 }); 
    bobKeys.push({ frame: 180, value: startY });
    bobAnim.setKeys(bobKeys);
    whisperMesh.animations.push(bobAnim);
    scene.beginAnimation(whisperMesh, 0, 180, true, 1.0 + Math.random() * 0.5); 

    // 3. Fade-in Animation (optional, handle via material alpha instead for simplicity now)
    whisperMesh.visibility = 0; 
    Animation.CreateAndStartAnimation('whisperFadeIn', whisperMesh, 'visibility', 30, 30, 0, 1.0, Animation.ANIMATIONLOOPMODE_CONSTANT);

    return whisperMesh;
}
