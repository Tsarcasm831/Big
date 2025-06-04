// Squad Management Screen
// Enhanced version with sci-fi aesthetics, interactivity, and soldier-specific GLB models

console.log('Squad management script loading...');

// Global squadManagement object
window.squadManagement = {
    initialized: false,
    container: null,
    currentSoldier: null,
    soldiers: [],
    selectedSoldierIndex: 0,
    // Ability descriptions for tooltips
    abilityDescriptions: {
        'Launch Grenade': 'Throws an explosive grenade at the target area, dealing area damage.',
        'Shredder': 'Attacks pierce through armor, ignoring enemy defenses.',
        'Demolition': 'Destroys environmental cover and obstacles with explosive force.',
        'Run & Gun': 'Enables an additional action after sprinting in combat.',
        'Light Em Up': 'Unleashes a rapid burst of gunfire on a single target.',
        'Suppression': 'Pins down enemies, reducing their accuracy and movement.',
        'Haywire Protocol': 'Hacks robotic enemies, potentially turning them against their allies.',
        'Combat Protocol': 'Delivers guaranteed electrical damage to mechanical units.',
        'Scanning Protocol': 'Reveals cloaked enemies within a wide radius.',
        'Master Tactician': 'Strategic genius that grants enhanced battlefield awareness and command abilities.',
        'Deadpan Strike': 'Delivers devastating attacks with perfect comedic timing, confusing enemies.',
        'Sardonic Blast': 'Unleashes a wave of ironic critique that demoralizes and weakens enemy units.'
    },

    initialize: function() {
        console.log('Initialize squad management called');
        if (this.initialized) return;

        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'squad-management-screen';
        this.container.className = 'screen';

        // Initial styles for transition
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: '9999',
            color: '#fff',
            fontFamily: "'Orbitron', sans-serif",
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            visibility: 'hidden',
            opacity: '0'
        });

        document.body.appendChild(this.container);
        this.createLayout();
        this.loadSampleSoldiers();
        this.initialized = true;
        console.log('%c SQUAD MANAGEMENT INITIALIZED ', 'background: #4682B4; color: white; padding: 5px; font-weight: bold;');
    },

    createLayout: function() {
        console.log('Create layout called');
        this.container.innerHTML = `
            <div class="squad-header">
                <h1>SQUAD MANAGEMENT</h1>
                <button id="squad-back-button">BACK</button>
            </div>
            <div class="squad-content">
                <div class="squad-left-panel">
                    <div class="menu-options">
                        <button class="menu-item selected" data-action="overview"><span class="menu-icon overview-icon"></span>OVERVIEW</button>
                        <button class="menu-item" data-action="equipment"><span class="menu-icon equipment-icon"></span>EQUIPMENT</button>
                        <button class="menu-item" data-action="skills"><span class="menu-icon skills-icon"></span>SKILLS & ABILITIES</button>
                        <button class="menu-item" data-action="training"><span class="menu-icon training-icon"></span>TRAINING</button>
                        <button class="menu-item" data-action="missions"><span class="menu-icon missions-icon"></span>MISSION HISTORY</button>
                        <button class="menu-item" data-action="customize"><span class="menu-icon customize-icon"></span>CUSTOMIZE</button>
                    </div>
                    <div class="option-description">
                        <p>View and manage your soldier's stats, equipment, and abilities.</p>
                    </div>
                </div>
                <div class="squad-center-panel">
                    <div class="character-model">
                        <div class="character-placeholder" id="character-display"></div>
                    </div>
                    <div class="character-navigation">
                        <button id="prev-soldier"><</button>
                        <button id="next-soldier">></button>
                    </div>
                </div>
                <div class="squad-right-panel" id="right-panel-content">
                    ${this.getRightPanelContent('overview')}
                </div>
            </div>
        `;
        this.setupEventListeners();
        console.log('Layout created successfully');
    },

    getRightPanelContent: function(action) {
        if (action === 'overview' || !action) {
            return `
                <div class="soldier-info">
                    <div class="soldier-rank-name">
                        <div class="rank-icon"></div>
                        <h2 id="soldier-name">SOLDIER NAME</h2>
                    </div>
                    <div class="soldier-status-grid">
                        <div class="status-section">
                            <div class="status-header">STATUS</div>
                            <div id="soldier-status" class="status-value available">AVAILABLE</div>
                        </div>
                        <div class="status-section">
                            <div class="status-header">MISSIONS</div>
                            <div id="soldier-missions" class="status-value">0</div>
                        </div>
                        <div class="status-section">
                            <div class="status-header">KILLS</div>
                            <div id="soldier-kills" class="status-value">0</div>
                        </div>
                    </div>
                    <div class="soldier-stats-grid">
                        <div class="stats-row"><span class="stat-label">AIM</span><span id="stat-aim" class="stat-value">65</span></div>
                        <div class="stats-row"><span class="stat-label">HEALTH</span><span id="stat-health" class="stat-value">4</span></div>
                        <div class="stats-row"><span class="stat-label">MOBILITY</span><span id="stat-mobility" class="stat-value">12</span></div>
                        <div class="stats-row"><span class="stat-label">WILL</span><span id="stat-will" class="stat-value">55</span></div>
                        <div class="stats-row"><span class="stat-label">ARMOR</span><span id="stat-armor" class="stat-value">0</span></div>
                        <div class="stats-row"><span class="stat-label">DODGE</span><span id="stat-dodge" class="stat-value">5</span></div>
                    </div>
                    <div class="soldier-abilities">
                        <h3>ABILITIES</h3>
                        <div id="abilities-container"></div>
                    </div>
                </div>
            `;
        } else {
            return `<div class="placeholder-content"><p>${action.toUpperCase()} - Under Construction</p></div>`;
        }
    },

    setupEventListeners: function() {
        console.log('Setup event listeners called');

        const backButton = this.container.querySelector('#squad-back-button');
        backButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        const menuItems = this.container.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                const action = item.getAttribute('data-action');
                this.updateOptionDescription(action);
                const rightPanel = this.container.querySelector('#right-panel-content');
                rightPanel.innerHTML = this.getRightPanelContent(action);
                if (action === 'overview') this.updateSoldierDisplay();
            });
        });

        const prevButton = this.container.querySelector('#prev-soldier');
        const nextButton = this.container.querySelector('#next-soldier');
        prevButton?.addEventListener('click', () => this.navigateSoldier(-1));
        nextButton?.addEventListener('click', () => this.navigateSoldier(1));
    },

    updateOptionDescription: function(action) {
        const descriptions = {
            'overview': 'View and manage your soldier\'s stats, equipment, and abilities.',
            'equipment': 'Equip your soldier with advanced weaponry and gear.',
            'skills': 'Enhance your soldier\'s combat prowess with unique abilities.',
            'training': 'Boost stats through rigorous training regimens.',
            'missions': 'Review past missions and commendations.',
            'customize': 'Personalize your soldier’s appearance and identity.'
        };
        const descElement = this.container.querySelector('.option-description p');
        descElement.textContent = descriptions[action] || '';
    },

    loadSampleSoldiers: function() {
        console.log('Load sample soldiers called');
        this.soldiers = [
            {
                id: 1, rank: 'SGT', firstName: 'KATIA', lastName: 'FLORES', nickname: 'JUNKYARD',
                missions: 8, kills: 12, status: 'AVAILABLE',
                stats: { aim: 65, health: 4, mobility: 12, will: 55, armor: 0, dodge: 5 },
                abilities: ['Launch Grenade', 'Shredder', 'Demolition'],
                modelName: 'katia_f'  // Link to katia_f.glb
            },
            {
                id: 2, rank: 'CPL', firstName: 'JAMES', lastName: 'RAMIREZ', nickname: 'GHOST',
                missions: 5, kills: 7, status: 'AVAILABLE',
                stats: { aim: 72, health: 3, mobility: 10, will: 60, armor: 1, dodge: 5 },
                abilities: ['Run & Gun', 'Light Em Up', 'Suppression'],
                modelName: 'james'  // Link to james.glb
            },
            {
                id: 3, rank: 'SPC', firstName: 'ALEX', lastName: 'ZHANG', nickname: 'CIRCUITS',
                missions: 3, kills: 4, status: 'WOUNDED',
                stats: { aim: 63, health: 2, mobility: 9, will: 50, armor: 0, dodge: 10 },
                abilities: ['Haywire Protocol', 'Combat Protocol', 'Scanning Protocol'],
                modelName: 'oldman'  // Link to oldman.glb
            },
            {
                id: 4, rank: 'MAJ', firstName: 'XRIS', lastName: 'HAWKINS', nickname: 'LORD TSARCASM',
                missions: 42, kills: 108, status: 'AVAILABLE',
                stats: { aim: 85, health: 6, mobility: 14, will: 90, armor: 3, dodge: 15 },
                abilities: ['Master Tactician', 'Deadpan Strike', 'Sardonic Blast'],
                // Try different models in case one fails to load
                modelName: 'Animation_Stand_and_Chat_withSkin',
                alternativeModels: ['Animation_Idle_withSkin', 'Animation_Alert_withSkin']
            }
        ];
        this.selectedSoldierIndex = 0;
        this.currentSoldier = this.soldiers[0];
        this.updateSoldierDisplay();
    },

    updateSoldierDisplay: function() {
        console.log('Update soldier display called');
        if (!this.currentSoldier) return;

        // Update soldier information
        const nameElement = this.container.querySelector('#soldier-name');
        if (nameElement) nameElement.textContent = `${this.currentSoldier.rank}. ${this.currentSoldier.firstName} '${this.currentSoldier.nickname}' ${this.currentSoldier.lastName}`;

        const statusElement = this.container.querySelector('#soldier-status');
        if (statusElement) {
            statusElement.textContent = this.currentSoldier.status;
            statusElement.className = `status-value ${this.currentSoldier.status.toLowerCase()}`;
        }

        this.updateStatElement('#soldier-missions', this.currentSoldier.missions);
        this.updateStatElement('#soldier-kills', this.currentSoldier.kills);

        const stats = this.currentSoldier.stats;
        this.updateStatElement('#stat-aim', stats.aim);
        this.updateStatElement('#stat-health', stats.health);
        this.updateStatElement('#stat-mobility', stats.mobility);
        this.updateStatElement('#stat-will', stats.will);
        this.updateStatElement('#stat-armor', stats.armor);
        this.updateStatElement('#stat-dodge', stats.dodge);

        const abilitiesContainer = this.container.querySelector('#abilities-container');
        if (abilitiesContainer) {
            abilitiesContainer.innerHTML = '';
            this.currentSoldier.abilities.forEach(ability => {
                const abilityClass = ability.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
                const abilityElement = document.createElement('div');
                abilityElement.className = 'ability-item';
                abilityElement.innerHTML = `
                    <div class="ability-icon ${abilityClass}-icon"></div>
                    <div class="ability-name">${ability}</div>
                `;
                abilityElement.setAttribute('data-tooltip', this.abilityDescriptions[ability] || 'No description available.');
                abilitiesContainer.appendChild(abilityElement);
            });
        }

        // Update soldier model display with GLB
        const modelContainer = this.container.querySelector('#character-display');
        if (modelContainer) {
            modelContainer.innerHTML = ''; // Clear previous content
            if (this.currentSoldier.modelName && typeof getGLB === 'function') {
                // Try primary model first
                let glb = getGLB(this.currentSoldier.modelName);
                
                // If main model fails, try alternatives if available
                if (!glb && this.currentSoldier.alternativeModels && this.currentSoldier.alternativeModels.length > 0) {
                    console.log(`Primary model ${this.currentSoldier.modelName} failed to load, trying alternatives...`);
                    for (const altModel of this.currentSoldier.alternativeModels) {
                        glb = getGLB(altModel);
                        if (glb) {
                            console.log(`Successfully loaded alternative model: ${altModel}`);
                            break;
                        }
                    }
                }
                
                if (glb) {
                    // Set up Three.js scene
                    const scene = new THREE.Scene();
                    scene.background = new THREE.Color(0x222222);

                    const aspectRatio = modelContainer.clientWidth / modelContainer.clientHeight;
                    const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
                    camera.position.z = 5;

                    const renderer = new THREE.WebGLRenderer({
                        antialias: true,
                        alpha: true,
                        logarithmicDepthBuffer: true
                    });
                    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.outputColorSpace = THREE.SRGBColorSpace;
                    renderer.physicallyCorrectLights = true;
                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    renderer.toneMappingExposure = 1.2;
                    modelContainer.appendChild(renderer.domElement);

                    const model = glb.scene.clone();
                    model.traverse(function(child) {
                        if (child.isMesh && child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    if (mat.color) mat.color.multiplyScalar(1.2);
                                    mat.emissive = mat.emissive || new THREE.Color(0x222222);
                                    mat.emissiveIntensity = 0.2;
                                    mat.needsUpdate = true;
                                });
                            } else {
                                if (child.material.color) child.material.color.multiplyScalar(1.2);
                                child.material.emissive = child.material.emissive || new THREE.Color(0x222222);
                                child.material.emissiveIntensity = 0.2;
                                child.material.needsUpdate = true;
                            }
                        }
                    });

                    scene.add(model);

                    // Properly center and scale model
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    model.position.sub(center); // Center the model
                    
                    // Adjust vertical position - special handling for Xris model
                    if (this.currentSoldier.firstName === 'XRIS') {
                        model.position.y -= 0.5; // Adjust for Xris model specifics
                    } else {
                        model.position.y += 0.5; // Standard adjustment for other models
                    }

                    // Calculate appropriate scale to fit in view
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    let scale = 3.5 / maxDim;
                    
                    // Special scale handling for Xris model to prevent stretching
                    if (this.currentSoldier.firstName === 'XRIS') {
                        scale = 2.0 / maxDim; // Use a more conservative scale
                        model.scale.set(scale, scale, scale); // Set uniform scale to prevent stretching
                    } else {
                        model.scale.multiplyScalar(scale);
                    }
                    
                    // Start with a reasonable rotation
                    model.rotation.y = Math.PI / 6;

                    function animate() {
                        requestAnimationFrame(animate);
                        model.rotation.y += 0.01;
                        renderer.render(scene, camera);
                    }
                    animate();

                    window.addEventListener('resize', function() {
                        if (modelContainer.clientWidth > 0 && modelContainer.clientHeight > 0) {
                            camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
                            camera.updateProjectionMatrix();
                            renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
                        }
                    });
                } else {
                    modelContainer.innerHTML = '<p>Model not loaded yet.</p>';
                }
            } else {
                modelContainer.innerHTML = '<p>No model available.</p>';
            }
        }

        // Update navigation tooltips
        const prevButton = this.container.querySelector('#prev-soldier');
        const nextButton = this.container.querySelector('#next-soldier');
        if (prevButton && nextButton) {
            const prevIndex = (this.selectedSoldierIndex - 1 + this.soldiers.length) % this.soldiers.length;
            const nextIndex = (this.selectedSoldierIndex + 1) % this.soldiers.length;
            prevButton.title = `Previous: ${this.soldiers[prevIndex].firstName} ${this.soldiers[prevIndex].lastName}`;
            nextButton.title = `Next: ${this.soldiers[nextIndex].firstName} ${this.soldiers[nextIndex].lastName}`;
        }
    },

    updateStatElement: function(selector, value) {
        const element = this.container.querySelector(selector);
        if (element) element.textContent = value;
    },

    navigateSoldier: function(direction) {
        this.selectedSoldierIndex = (this.selectedSoldierIndex + direction + this.soldiers.length) % this.soldiers.length;
        this.currentSoldier = this.soldiers[this.selectedSoldierIndex];
        this.updateSoldierDisplay();
    },

    open: function() {
        console.log('Open squad management called');
        if (!this.initialized) this.initialize();
        if (!this.container) return;
        this.container.style.visibility = 'visible';
        this.container.style.opacity = '1';
        document.addEventListener('keydown', this.handleKeydown);
    },

    close: function() {
        console.log('Close squad management called');
        if (!this.container) return;
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.visibility = 'hidden';
        }, 300);
        document.removeEventListener('keydown', this.handleKeydown);
        document.dispatchEvent(new CustomEvent('squadManagementClosed'));
    },

    handleKeydown: (event) => {
        if (event.key === 'ArrowLeft') window.squadManagement.navigateSoldier(-1);
        else if (event.key === 'ArrowRight') window.squadManagement.navigateSoldier(1);
        else if (event.key === 'Escape') window.squadManagement.close();
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded in squad_management.js');
    document.addEventListener('openSquadManagement', () => {
        console.log('openSquadManagement event received');
        window.squadManagement.open();
    });
});

document.addEventListener('openSquadManagement', () => {
    console.log('openSquadManagement event received (outside DOMContentLoaded)');
    window.squadManagement.open();
});