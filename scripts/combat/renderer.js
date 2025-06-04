// renderer.js - THREE.js rendering and visualization with Lord Tsarcasm's House aesthetic

/**
 * Handles the 3D rendering for the combat system
 * Sets up scene, camera, lighting, and rendering loop
 * Styled to match Lord Tsarcasm's House aesthetic
 */
export class CombatRenderer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = null;
        this.animationFrame = null;
        this.hoverHighlight = null;
        this.highlightGroup = null;
        
        // Add CSS link for Lord Tsarcasm aesthetic
        this.loadStyles();
    }

    /**
     * Load the Tsarcasm-themed CSS styles for combat
     */
    loadStyles() {
        // Add the custom CSS file
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = './scripts/combat/css/combat.css';
        document.head.appendChild(linkElement);
        
        // Add Google Fonts for Cinzel font used in Tsarcasm house
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap';
        document.head.appendChild(fontLink);
        
        // Add the combat container class
        this.container.classList.add('combat-container');
    }

    /**
     * Initialize the THREE.js renderer and scene
     */
    initialize() {
        // THREE.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Camera positioning for a better isometric view
        this.camera.position.set(15, 15, 15); // Closer to the action
        this.camera.lookAt(10, 0, 10); // Look at the center of the 20x20 grid

        // Camera controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 40;
        this.controls.maxPolarAngle = Math.PI / 2.5;

        // Set up lighting
        this.setupLighting();
        
        // Add skybox
        this.addSkybox();
        
        // Animation clock
        this.clock = new THREE.Clock();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Show loading screen
        this.showLoadingScreen();
        
        return this;
    }
    
    /**
     * Display a Lord Tsarcasm styled loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'combat-loading';
        loadingScreen.innerHTML = `
            <div class="loader"></div>
            <h3>Preparing Combat Scenario...</h3>
        `;
        this.container.appendChild(loadingScreen);
        
        // Remove after a delay
        setTimeout(() => {
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
    }
    
    /**
     * Set up the scene lighting to match Lord Tsarcasm's House
     */
    setupLighting() {
        // Atmospheric lighting with orange-ish tint to match Tsarcasm aesthetic
        const ambientLight = new THREE.AmbientLight(0xbaa88f, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xff6400, 0.7);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Add secondary fill light
        const fillLight = new THREE.DirectionalLight(0xbaa88f, 0.4);
        fillLight.position.set(-5, 10, -5);
        this.scene.add(fillLight);
        
        // Add point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0xff6400, 0.5, 30);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff6400, 0.5, 30);
        pointLight2.position.set(15, 5, 15);
        this.scene.add(pointLight2);
    }
    
    /**
     * Add skybox to the scene with Tsarcasm theme
     */
    addSkybox() {
        // Create a more atmospheric background gradient instead of plain black
        const canvasSize = 512;
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const context = canvas.getContext('2d');
        
        // Create a dark gradient background with some atmosphere
        const gradient = context.createLinearGradient(0, 0, 0, canvasSize);
        gradient.addColorStop(0, '#1a0e06'); // Dark amber at top
        gradient.addColorStop(0.5, '#0a0807'); // Very dark brown/black in middle
        gradient.addColorStop(1, '#000000'); // Pure black at bottom
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvasSize, canvasSize);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.scene.background = texture;
        
        // Add fog for depth effect - matching Tsarcasm house aesthetic
        this.scene.fog = new THREE.FogExp2(0x0a0807, 0.02); // Reduced fog density
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Start the animation loop
     * @param {Function} updateCallback - Callback for updating units and animations
     */
    startAnimationLoop(updateCallback) {
        const animate = () => {
            this.animationFrame = requestAnimationFrame(animate);
            const delta = this.clock.getDelta();
            
            // Update TWEEN animations
            TWEEN.update();
            
            // Call the update callback
            if (updateCallback) {
                updateCallback(delta);
            }
            
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        
        // Start the animation loop
        animate();
    }
    
    /**
     * Stop the animation loop
     */
    stopAnimationLoop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Create and add ground plane to the scene
     * @param {number} gridWidth - Width of the grid
     * @param {number} gridHeight - Height of the grid
     */
    createGround(gridWidth, gridHeight) {
        const groundGeometry = new THREE.PlaneGeometry(gridWidth, gridHeight);
        let groundMaterial;
        
        try {
            // Try to use an existing texture from TopDown assets
            const textureLoader = new THREE.TextureLoader();
            const groundTexture = textureLoader.load('./TopDown/assets/ground/Dirt/cracked_dirt.webp', 
                // Success callback
                function(texture) {
                    console.log('Successfully loaded ground texture');
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(gridWidth, gridHeight);
                },
                // Progress callback
                undefined,
                // Error callback
                function(err) {
                    console.error('Failed to load ground texture, using fallback color', err);
                    groundMaterial.color = new THREE.Color(0x654321); // Fallback brown color
                }
            );
            groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, color: 0x9b7653 });
        } catch (error) {
            console.error('Error setting up ground texture, using fallback', error);
            groundMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 }); // Brown color
        }
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.set(gridWidth/2, 0, gridHeight/2); // Center the ground
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add grid helper
        this.addGridHelper(gridWidth, gridHeight);
        
        return ground;
    }
    
    /**
     * Add grid helper to visualize the grid
     * @param {number} gridWidth - Width of the grid
     * @param {number} gridHeight - Height of the grid 
     */
    addGridHelper(gridWidth, gridHeight) {
        const gridHelper = new THREE.GridHelper(
            Math.max(gridWidth, gridHeight), 
            Math.max(gridWidth, gridHeight), 
            0x888888, 
            0x888888
        );
        gridHelper.position.set(gridWidth/2, 0.01, gridHeight/2); // Center the grid
        this.scene.add(gridHelper);
        
        return gridHelper;
    }
    
    /**
     * Highlight reachable cells for movement
     * @param {Array} cells - Array of cells to highlight
     * @param {string} color - Color in hex format (0x000000)
     * @param {number} opacity - Opacity of highlights (0-1)
     */
    highlightCells(cells, color = 0x00ff00, opacity = 0.4) {
        // Remove existing highlights
        if (this.highlightGroup) {
            this.scene.remove(this.highlightGroup);
        }
        
        // Create new highlight group
        this.highlightGroup = new THREE.Group();
        
        // Create highlight for each cell
        const highlightGeometry = new THREE.PlaneGeometry(1, 1);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: opacity 
        });
        
        cells.forEach(cell => {
            const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
            highlight.position.set(cell.x + 0.5, 0.01, cell.y + 0.5); // Center highlight on grid cell
            highlight.rotation.x = -Math.PI / 2;
            this.highlightGroup.add(highlight);
        });
        
        this.scene.add(this.highlightGroup);
        
        return this.highlightGroup;
    }
    
    /**
     * Remove all cell highlights
     */
    clearHighlights() {
        if (this.highlightGroup) {
            this.scene.remove(this.highlightGroup);
            this.highlightGroup = null;
        }
        
        if (this.hoverHighlight) {
            this.scene.remove(this.hoverHighlight);
            this.hoverHighlight = null;
        }
    }
    
    /**
     * Create a hover highlight at the given grid position
     * @param {number} gridX - X position on grid
     * @param {number} gridY - Y position on grid
     * @param {string} color - Color in hex format (0x000000)
     */
    createHoverHighlight(gridX, gridY, color = 0xffff00) {
        // Remove existing hover highlight
        if (this.hoverHighlight) {
            this.scene.remove(this.hoverHighlight);
            this.hoverHighlight = null;
        }
        
        // Create more visible highlight
        const highlightGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.9);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.7,
            wireframe: false
        });
        
        // Create and position the highlight
        this.hoverHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        this.hoverHighlight.position.set(gridX + 0.5, 0.1, gridY + 0.5);
        
        // Add to scene
        this.scene.add(this.hoverHighlight);
        
        return this.hoverHighlight;
    }
}