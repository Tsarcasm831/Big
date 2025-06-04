// factions-aliens-details.js - Handles the details popup functionality for alien races

// Define a namespace for alien details functionality
const AlienDetails = {
    /**
     * Initializes the alien details popup functionality
     * @param {Object} aliensData - The data for all alien races
     * @param {HTMLElement} aliensPopupContainer - The container element for the aliens popup
     */
    initAlienDetails: function(aliensData, aliensPopupContainer) {
        // Add keyboard event listener for Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.faction-details-modal.alien-details-modal.show');
                if (openModal) {
                    const alienKey = openModal.getAttribute('data-alien');
                    AlienDetails.closeAlienDetails(alienKey, aliensData);
                }
            }
        });
    },

    /**
     * Create and display a detailed modal for a selected alien race
     * @param {string} alienKey - The key of the alien to display
     * @param {Object} aliensData - The data for all alien races
     * @param {HTMLElement} aliensPopupContainer - The container element for the aliens popup
     */
    displayAlienDetails: function(alienKey, aliensData, aliensPopupContainer) {
        const alien = aliensData[alienKey];
        if (!alien) return;

        // First, make sure the aliens popup container is visible
        aliensPopupContainer.style.display = 'block';

        // Check if modal already exists
        let modal = document.querySelector(`.faction-details-modal.alien-details-modal[data-alien="${alienKey}"]`);
        if (!modal) {
            let imageSrc = alien.localSrc ? alien.localSrc : alien.remoteSrc;
            modal = document.createElement('div');
            modal.className = 'faction-details-modal alien-details-modal';
            modal.setAttribute('data-alien', alienKey);
            modal.setAttribute('aria-hidden', 'true');

            modal.innerHTML = `
                <div class="modal-content">
                    <button class="close-button" data-close-alien="${alienKey}">&times;</button>
                    <div class="left-column">
                        <img src="${imageSrc}" 
                             onerror="this.onerror=null; this.src='assets/icons/combat.webp'" 
                             alt="${alien.name}" 
                             class="alien-image">
                        <div id="alien-model-container-${alienKey}" class="model-container"></div>
                        <div class="basic-info">
                            <h3>Basic Information</h3>
                            <p>${alien.description}</p>
                        </div>
                    </div>
                    <div class="right-column">
                        <h2>${alien.name}</h2>
                        <div class="details-section">
                            <h3>Extended Description</h3>
                            <p>${alien.extendedDescription}</p>
                            <h3>History</h3>
                            <p>${alien.history}</p>
                            <h3>Abilities</h3>
                            <p>${alien.abilities}</p>
                            <h3>Culture</h3>
                            <p>${alien.culture}</p>
                            <h3>Stats</h3>
                            <div class="stats-grid">
                                ${Object.keys(alien.stats).map(function(stat) {
                                    return `
                                        <div class="stat-item">
                                            <div class="stat-name">${stat}</div>
                                            <div class="stat-value">${alien.stats[stat]}</div>
                                            <div class="stat-bar" style="width: ${Math.min(100, alien.stats[stat]/2)}%;"></div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Append the modal to the aliens popup container
            aliensPopupContainer.appendChild(modal);
            
            // Add event listener to close the modal when the close button is clicked
            modal.querySelector(`[data-close-alien="${alienKey}"]`).addEventListener('click', function(e) {
                e.stopPropagation();
                AlienDetails.closeAlienDetails(alienKey, aliensData);
            });
            
            // Add event listener to close the modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    AlienDetails.closeAlienDetails(alienKey, aliensData);
                }
            });
        }
        
        // Show the modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Prevent event propagation to stop closing the aliens popup
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Check for GLB model
        if (alien.modelName) {
            const modelContainer = document.getElementById(`alien-model-container-${alienKey}`);
            const imageElement = modal.querySelector('.alien-image');

            // Safely check if getGLB function exists and then try to get the model
            const glb = (typeof getGLB === 'function') ? getGLB(alien.modelName) : null;

            if (glb) {
                // Hide the image
                imageElement.style.display = 'none';
                // Clear any existing content in the model container
                modelContainer.innerHTML = '';
                // Show the model container
                modelContainer.style.display = 'block';
                
                // Set up Three.js scene
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0x222222); // Slightly lighter background for better contrast
                
                // Set up camera
                const aspectRatio = modelContainer.clientWidth / modelContainer.clientHeight;
                const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000); // Wider field of view
                camera.position.z = 5;
                
                // Set up renderer with improved settings
                const renderer = new THREE.WebGLRenderer({ 
                    antialias: true,
                    alpha: true,
                    logarithmicDepthBuffer: true // Better handling of depth
                });
                renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.outputColorSpace = THREE.SRGBColorSpace; // Better color representation
                renderer.physicallyCorrectLights = true; // More realistic lighting
                renderer.toneMapping = THREE.ACESFilmicToneMapping; // Improved tone mapping
                renderer.toneMappingExposure = 1.2; // Slightly brighter exposure
                modelContainer.appendChild(renderer.domElement);
                
                // Add the model to the scene
                const model = glb.scene.clone();
                
                // Apply initial material adjustments to increase visibility
                model.traverse(function(child) {
                    if (child.isMesh && child.material) {
                        // Make materials brighter
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                if (mat.color) mat.color.multiplyScalar(1.2); // Brighten colors
                                mat.emissive = mat.emissive || new THREE.Color(0x222222); // Add slight emissive
                                mat.emissiveIntensity = 0.2;
                                mat.needsUpdate = true;
                            });
                        } else {
                            if (child.material.color) child.material.color.multiplyScalar(1.2); // Brighten colors
                            child.material.emissive = child.material.emissive || new THREE.Color(0x222222); // Add slight emissive
                            child.material.emissiveIntensity = 0.2;
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                scene.add(model);
                
                // Center the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                
                // Elevate the model slightly to center it better visually
                model.position.y += 0.5;
                
                // Scale the model to fit in view
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.5 / maxDim; // Slightly larger scale
                model.scale.multiplyScalar(scale);
                
                // Add a slight initial rotation to show more of the model
                model.rotation.y = Math.PI / 6; // 30 degrees
                
                // Lighting is now handled by glbsilluminator.js
                // The illuminator will automatically enhance the lighting when the model is added to the scene
                
                // Add animation for rotation
                function animate() {
                    requestAnimationFrame(animate);
                    model.rotation.y += 0.01;
                    renderer.render(scene, camera);
                }
                animate();
                
                // Handle window resize
                window.addEventListener('resize', function() {
                    if (modelContainer.clientWidth > 0 && modelContainer.clientHeight > 0) {
                        camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
                    }
                });
            } else {
                // Show the image if no GLB model is available
                imageElement.style.display = 'block';
                modelContainer.style.display = 'none';
                modelContainer.innerHTML = '';
            }
        } else {
            // No model name specified, just show the image
            const imageElement = modal.querySelector('.alien-image');
            const modelContainer = document.getElementById(`alien-model-container-${alienKey}`);
            
            imageElement.style.display = 'block';
            modelContainer.style.display = 'none';
            modelContainer.innerHTML = '';
        }
    },

    /**
     * Close a specific alien details modal
     * @param {string} alienKey - The key of the alien modal to close
     * @param {Object} aliensData - The data for all alien races
     */
    closeAlienDetails: function(alienKey, aliensData) {
        const modal = document.querySelector(`.faction-details-modal.alien-details-modal[data-alien="${alienKey}"]`);
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // Optional: Remove the modal from the DOM after a short delay
            // This can help prevent potential memory leaks
            setTimeout(function() {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
            
            const modelContainer = document.getElementById(`alien-model-container-${alienKey}`);
            if (modelContainer) {
                modelContainer.innerHTML = '';
            }
        }
    },
};
