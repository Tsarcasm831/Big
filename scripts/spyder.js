// spyder.js - Spyder's Galactic Tech Nexus
// This script powers an advanced, interactive tech hub where players can research groundbreaking technologies,
// decode alien artifacts, engineer genetic mutations, and consult the quirky AI, Spyder.
// Packed with mini-games, a tech tree, immersive visuals, and sound effects, this module is a cornerstone of the game.

console.log("Spyder's Galactic Tech Nexus booting up...");

window.spyderTechHub = {
    initialized: false,
    container: null,
    currentCategory: 'tech',
    selectedTaskIndex: 0,
    resources: { researchPoints: 500, energy: 200, bioSamples: 100, alienArtifacts: 50 },
    researchData: [],
    techTree: new Map(), // Tracks prerequisites and unlocks
    audio: {}, // Sound effects and background music
    researchTeams: [], // Assigned scientists
    originalBgMusic: null, // Store reference to the original bgMusic
    
    /** Initializes the Tech Nexus with flair */
    initialize: function() {
        if (this.initialized) {
            console.log('Tech Nexus already online.');
            return;
        }

        // Load CSS file
        this.loadCSS();
        
        // Main container setup
        this.container = document.createElement('div');
        this.container.id = 'spyder-tech-nexus';
        document.body.appendChild(this.container);

        // Load assets (audio, data, etc.)
        this.loadAssets();
        this.loadResearchData();
        this.createLayout();
        this.setupTechTree();

        this.initialized = true;
        console.log('Tech Nexus fully operational!');
    },
    
    /** Loads the CSS file */
    loadCSS: function() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'styles/spyder.css';
        document.head.appendChild(link);
    },

    /** Loads sound effects and background music */
    loadAssets: function() {
        this.audio = {
            bgMusic: new Audio('assets/tech-nexus-ambient.mp3'), // Tech hub specific music
            click: new Audio('assets/Sounds/button-click.wav'),
            researchComplete: new Audio('assets/research-complete.wav')
        };
        
        // Set properties for audio elements
        this.audio.bgMusic.loop = true;
        this.audio.bgMusic.volume = 0.3;
        
        // Add error handling for audio loading
        const handleAudioError = (audioElement, name) => {
            audioElement.addEventListener('error', (e) => {
                console.warn(`Failed to load audio: ${name}`, e);
                // Create silent audio as fallback
                const silentAudio = new Audio();
                silentAudio.play = () => Promise.resolve(); // No-op play function
                this.audio[name] = silentAudio;
            });
        };
        
        // Apply error handling to all audio elements
        Object.entries(this.audio).forEach(([name, audio]) => {
            handleAudioError(audio, name);
        });
        
        // Store reference to the game's background music
        if (window.musicPlayed && document.querySelector('audio')) {
            this.originalBgMusic = Array.from(document.querySelectorAll('audio')).find(
                audio => audio.src.includes('worldmapmusic')
            );
        }
    },

    /** Constructs the futuristic UI layout */
    createLayout: function() {
        console.log('Constructing Nexus interface...');
        this.container.innerHTML = `
            <!-- Header -->
            <div class="nexus-header">
                <div class="nexus-header-left">
                    <img src="assets/nexus-logo.png" class="nexus-logo" alt="Nexus Logo">
                    <h1 class="nexus-title">SPYDER'S GALACTIC TECH NEXUS</h1>
                </div>
                <div class="nexus-header-right">
                    <div id="resource-display">
                        <span class="resource-item"><span>RP: ${this.resources.researchPoints}</span></span>
                        <span class="resource-item"><span>E: ${this.resources.energy}</span></span>
                        <span class="resource-item"><span>BS: ${this.resources.bioSamples}</span></span>
                        <span class="resource-item"><span>AA: ${this.resources.alienArtifacts}</span></span>
                    </div>
                    <button id="nexus-back">EXIT</button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="nexus-content">
                <!-- Left Panel: Navigation -->
                <div class="nexus-nav">
                    ${this.generateNavMenu()}
                </div>

                <!-- Center Panel: Research Console -->
                <div class="nexus-console">
                    <div id="console-display">
                        <canvas id="task-visual" width="400" height="500"></canvas>
                    </div>
                    <div class="console-nav">
                        <button id="prev-task" class="nav-btn">&lt;</button>
                        <button id="next-task" class="nav-btn">&gt;</button>
                    </div>
                </div>

                <!-- Right Panel: Task Details -->
                <div class="nexus-details">
                    <div id="task-details"></div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateTaskDisplay();
    },

    /** Generates navigation menu with subcategories */
    generateNavMenu: function() {
        const categories = [
            { id: 'tech', name: 'Technology Research', subs: ['Weapons', 'Defenses', 'Computing'] },
            { id: 'artifact', name: 'Alien Artifact Analysis', subs: ['Relics', 'Tech', 'Biology'] },
            { id: 'genetic', name: 'Genetic Mutation Lab', subs: ['Enhancements', 'Adaptations'] },
            { id: 'consult', name: "Spyder's Consultation" },
            { id: 'settings', name: "Interface Settings" }
        ];
        return categories.map(cat => `
            <button class="nexus-menu-item ${cat.id === this.currentCategory ? 'selected' : ''}" data-category="${cat.id}">${cat.name}</button>
            ${cat.subs ? `<div style="padding-left: 20px; display: ${cat.id === this.currentCategory ? 'block' : 'none'};">${cat.subs.map(sub => `<button class="sub-menu" data-sub="${sub}">${sub}</button>`).join('')}</div>` : ''}
        `).join('');
    },

    /** Sets up interactive event listeners */
    setupEventListeners: function() {
        this.container.querySelector('#nexus-back').addEventListener('click', () => this.close());
        
        this.container.querySelectorAll('.nexus-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                this.currentCategory = item.dataset.category;
                this.selectedTaskIndex = 0;
                this.updateNavSelection();
                this.updateTaskDisplay();
            });
        });
        
        this.container.querySelectorAll('.sub-menu').forEach(item => {
            item.addEventListener('click', () => {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                alert(`Filtering by ${item.dataset.sub} subcategory. This feature will be in a future update.`);
            });
        });
        
        this.container.querySelector('#prev-task').addEventListener('click', () => this.navigateTask(-1));
        this.container.querySelector('#next-task').addEventListener('click', () => this.navigateTask(1));
    },

    /** Updates navigation menu selection */
    updateNavSelection: function() {
        const items = this.container.querySelectorAll('.nexus-menu-item');
        items.forEach(item => {
            item.classList.toggle('selected', item.dataset.category === this.currentCategory);
            const subMenu = item.nextElementSibling;
            if (subMenu) subMenu.style.display = item.dataset.category === this.currentCategory ? 'block' : 'none';
        });
    },

    /** Loads expansive research data */
    loadResearchData: function() {
        this.researchData = [
            // Technology Research
            { id: 1, category: 'tech', name: 'Plasma Cannons', progress: 0, pointsRequired: 200, resources: { energy: 100 }, prereqs: [], effect: 'Unlocks plasma weaponry', miniGame: 'circuitBuilder', description: 'Develop high-energy plasma cannons for devastating firepower.' },
            { id: 2, category: 'tech', name: 'Quantum Shields', progress: 0, pointsRequired: 250, resources: { energy: 150 }, prereqs: ['Plasma Cannons'], effect: 'Enhances squad defense', miniGame: 'codePuzzle', description: 'Create quantum-based shields to deflect incoming attacks.' },
            { id: 3, category: 'tech', name: 'Neural Interface', progress: 0, pointsRequired: 300, resources: { energy: 100, bioSamples: 50 }, prereqs: [], effect: 'Improves squad coordination', miniGame: 'circuitBuilder', description: 'Develop a direct neural link for instantaneous tactical communication.' },
            // Alien Artifact Analysis
            { id: 4, category: 'artifact', name: 'Void Crystal', progress: 0, pointsRequired: 150, resources: { alienArtifacts: 2 }, prereqs: [], effect: 'Boosts energy production', miniGame: 'symbolMatcher', description: 'Decode a crystal pulsing with unknown energy.' },
            { id: 5, category: 'artifact', name: 'Ancient Codex', progress: 0, pointsRequired: 180, resources: { alienArtifacts: 3 }, prereqs: [], effect: 'Reveals alien history', miniGame: 'symbolMatcher', description: 'Translate alien text to uncover hidden knowledge.' },
            // Genetic Mutation Lab
            { id: 6, category: 'genetic', name: 'Regenerative Tissue', progress: 0, pointsRequired: 180, resources: { bioSamples: 80 }, prereqs: [], effect: 'Squad regenerates health', miniGame: 'dnaSequencer', description: 'Engineer tissue that heals wounds rapidly.' },
            { id: 7, category: 'genetic', name: 'Enhanced Reflexes', progress: 0, pointsRequired: 220, resources: { bioSamples: 90 }, prereqs: [], effect: 'Increases squad evasion', miniGame: 'dnaSequencer', description: 'Modify neural pathways for faster reaction times.' },
            // Spyder's Consultation
            { id: 8, category: 'consult', name: "Spyder's Insights", progress: 100, pointsRequired: 0, resources: {}, prereqs: [], effect: 'Gain strategic advice', miniGame: 'dialogue', description: 'Consult Spyder for cosmic wisdom.' },
            { id: 9, category: 'consult', name: 'Tactical Analysis', progress: 100, pointsRequired: 0, resources: {}, prereqs: [], effect: 'Optimization recommendations', miniGame: 'dialogue', description: 'Get detailed analysis of your combat strategies.' },
            // Settings
            { id: 10, category: 'settings', name: 'Interface Customization', progress: 100, pointsRequired: 0, resources: {}, prereqs: [], effect: 'Personalize the Tech Nexus', miniGame: null, description: 'Adjust the Nexus interface to your preferences.' }
        ];
    },

    /** Sets up the tech tree relationships */
    setupTechTree: function() {
        this.researchData.forEach(task => {
            this.techTree.set(task.name, { prereqs: task.prereqs, unlocked: task.prereqs.length === 0 });
        });
    },

    /** Updates the task display with animations */
    updateTaskDisplay: function() {
        const tasks = this.researchData.filter(t => t.category === this.currentCategory);
        if (!tasks.length || !tasks[this.selectedTaskIndex]) return;

        const task = tasks[this.selectedTaskIndex];
        const canvas = this.container.querySelector('#task-visual');
        if (canvas) this.renderTaskVisual(canvas, task);

        const details = this.container.querySelector('#task-details');
        if (!details) return;
        
        if (this.currentCategory === 'settings') {
            details.innerHTML = this.renderSettingsPanel();
            this.setupSettingsEventListeners();
            return;
        }
        
        details.innerHTML = `
            <h2 class="task-title">${task.name}</h2>
            <div class="task-info">
                <p>${task.description}</p>
                <p><strong>Progress:</strong></p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${task.progress}%;"></div>
                </div>
                <p>${task.progress}% complete</p>
                <p><strong>Requirements:</strong> RP: ${task.pointsRequired}, ${Object.entries(task.resources).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
                <p><strong>Prerequisites:</strong> ${task.prereqs.length ? task.prereqs.join(', ') : 'None'}</p>
                <p><strong>Effect:</strong> ${task.effect}</p>
            </div>
            <div class="task-buttons">
                <button id="start-research" class="task-button start-button" ${task.progress >= 100 || !this.canStartTask(task) ? 'disabled' : ''}>Start Research</button>
                <button id="assign-team" class="task-button team-button">Assign Team</button>
                <button id="task-info" class="task-button info-button">Detailed Info</button>
            </div>
        `;

        details.querySelector('#start-research')?.addEventListener('click', () => this.startResearch(task));
        details.querySelector('#assign-team')?.addEventListener('click', () => this.assignResearchTeam(task));
        details.querySelector('#task-info')?.addEventListener('click', () => this.showDetailedInfo(task));
    },
    
    /** Renders the settings panel */
    renderSettingsPanel: function() {
        // Check if we have a template for the settings panel
        const template = document.getElementById('settings-panel-template');
        
        if (template) {
            // Use the template and clone it
            const content = template.content.cloneNode(true);
            
            // Update dynamic values in the template
            const musicVolume = content.querySelector('#music-volume');
            if (musicVolume) musicVolume.value = this.audio.bgMusic.volume;
            
            const sfxVolume = content.querySelector('#sfx-volume');
            if (sfxVolume) sfxVolume.value = this.audio.click.volume || 1;
            
            // Convert to HTML string
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(content);
            return tempDiv.innerHTML;
        } else {
            // Fallback to original implementation
            return `
                <h2 class="task-title">Interface Settings</h2>
                <div class="task-info">
                    <p>Customize the Tech Nexus interface to your preferences.</p>
                    
                    <h3>Theme Options</h3>
                    <div class="settings-group">
                        <button id="theme-default" class="task-button">Default Theme</button>
                        <button id="theme-dark" class="task-button">Dark Theme</button>
                        <button id="theme-light" class="task-button">Light Theme</button>
                    </div>
                    
                    <h3>Audio Settings</h3>
                    <div class="settings-group">
                        <label>
                            Music Volume: 
                            <input type="range" id="music-volume" min="0" max="1" step="0.1" value="${this.audio.bgMusic.volume}">
                        </label>
                        <label>
                            Sound Effects Volume: 
                            <input type="range" id="sfx-volume" min="0" max="1" step="0.1" value="${this.audio.click.volume || 1}">
                        </label>
                        <button id="test-audio" class="task-button">Test Audio</button>
                    </div>
                    
                    <h3>Display Settings</h3>
                    <div class="settings-group">
                        <button id="font-smaller" class="task-button">Smaller Font</button>
                        <button id="font-default" class="task-button">Default Font</button>
                        <button id="font-larger" class="task-button">Larger Font</button>
                    </div>
                    
                    <h3>Advanced Options</h3>
                    <div class="settings-group">
                        <button id="reset-progress" class="task-button">Reset Research Progress</button>
                        <button id="tutorial-mode" class="task-button">Enable Tutorial Mode</button>
                    </div>
                </div>
            `;
        }
    },
    
    /** Setup event listeners for settings panel */
    setupSettingsEventListeners: function() {
        // Theme buttons
        this.container.querySelector('#theme-default')?.addEventListener('click', () => {
            this.applyTheme('default');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        this.container.querySelector('#theme-dark')?.addEventListener('click', () => {
            this.applyTheme('dark');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        this.container.querySelector('#theme-light')?.addEventListener('click', () => {
            this.applyTheme('light');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        // Audio settings
        this.container.querySelector('#music-volume')?.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audio.bgMusic.volume = volume;
        });
        
        this.container.querySelector('#sfx-volume')?.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audio.click.volume = volume;
            this.audio.researchComplete.volume = volume;
        });
        
        this.container.querySelector('#test-audio')?.addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        // Font size settings
        this.container.querySelector('#font-smaller')?.addEventListener('click', () => {
            this.changeFontSize('smaller');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        this.container.querySelector('#font-default')?.addEventListener('click', () => {
            this.changeFontSize('default');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        this.container.querySelector('#font-larger')?.addEventListener('click', () => {
            this.changeFontSize('larger');
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        });
        
        // Advanced options
        this.container.querySelector('#reset-progress')?.addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            alert('This feature will require implementing a new file to store progress. Coming soon!');
        });
        
        this.container.querySelector('#tutorial-mode')?.addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            alert('Tutorial mode will require a new file to implement. Coming soon!');
        });
    },
    
    /** Apply a theme to the interface */
    applyTheme: function(theme) {
        const root = document.documentElement;
        
        switch(theme) {
            case 'dark':
                root.style.setProperty('--nexus-bg', 'linear-gradient(135deg, #000, #111)');
                root.style.setProperty('--nexus-accent', '#8a2be2');
                alert('Dark theme applied! Full theme customization will require a new theme file.');
                break;
            case 'light':
                root.style.setProperty('--nexus-bg', 'linear-gradient(135deg, #f5f5f5, #e0e0e0)');
                root.style.setProperty('--nexus-accent', '#ff6b6b');
                alert('Light theme applied! Full theme customization will require a new theme file.');
                break;
            case 'default':
            default:
                root.style.removeProperty('--nexus-bg');
                root.style.removeProperty('--nexus-accent');
                alert('Default theme restored!');
                break;
        }
    },
    
    /** Change font size */
    changeFontSize: function(size) {
        const container = this.container;
        
        switch(size) {
            case 'smaller':
                container.style.fontSize = '0.9em';
                break;
            case 'larger':
                container.style.fontSize = '1.1em';
                break;
            case 'default':
            default:
                container.style.fontSize = '1em';
                break;
        }
    },

    /** Renders a cool visual for the task */
    renderTaskVisual: function(canvas, task) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a2a3a');
        gradient.addColorStop(1, '#0a1a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Task icon/visual
        ctx.fillStyle = '#00d4ff';
        ctx.strokeStyle = '#00d4ff';
        
        switch(task.category) {
            case 'tech':
                this.drawTechVisual(ctx, canvas, task);
                break;
            case 'artifact':
                this.drawArtifactVisual(ctx, canvas, task);
                break;
            case 'genetic':
                this.drawGeneticVisual(ctx, canvas, task);
                break;
            case 'consult':
                this.drawConsultVisual(ctx, canvas, task);
                break;
            default:
                // Simple fallback
                ctx.font = '20px Exo 2';
                ctx.textAlign = 'center';
                ctx.fillText(task.name, canvas.width / 2, canvas.height / 2);
        }
    },
    
    /** Draw tech visual */
    drawTechVisual: function(ctx, canvas, task) {
        // Draw a stylized circuit board
        const time = Date.now() * 0.001;
        
        // Draw nodes
        for (let i = 0; i < 20; i++) {
            const x = canvas.width * (0.2 + 0.6 * Math.sin(i * 0.3 + time * 0.2));
            const y = canvas.height * (0.2 + 0.6 * Math.cos(i * 0.5 + time * 0.3));
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${0.5 + 0.5 * Math.sin(i + time)})`;
            ctx.fill();
            
            // Connect nodes with lines
            if (i > 0) {
                const prevX = canvas.width * (0.2 + 0.6 * Math.sin((i-1) * 0.3 + time * 0.2));
                const prevY = canvas.height * (0.2 + 0.6 * Math.cos((i-1) * 0.5 + time * 0.3));
                
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + 0.3 * Math.sin(i + time)})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        // Add title
        ctx.font = 'bold 22px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(task.name, canvas.width / 2, 40);
        
        // Add progress indicator
        if (task.progress < 100) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Exo 2';
            ctx.fillText(`Progress: ${task.progress}%`, canvas.width / 2, canvas.height - 30);
        } else {
            ctx.fillStyle = '#2ecc71';
            ctx.font = '16px Exo 2';
            ctx.fillText('RESEARCH COMPLETE', canvas.width / 2, canvas.height - 30);
        }
    },
    
    /** Draw artifact visual */
    drawArtifactVisual: function(ctx, canvas, task) {
        const time = Date.now() * 0.001;
        
        // Draw a glowing artifact
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(time * 0.2);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 50, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // Artifact shape (hexagon)
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 80;
            const y = Math.sin(angle) * 80;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 50, 80, 0.9)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00d4ff';
        ctx.stroke();
        
        // Inner details (alien symbols)
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 + time * 0.5;
            const x = Math.cos(angle) * 40;
            const y = Math.sin(angle) * 40;
            
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
            
            // Connect to center
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Add title
        ctx.font = 'bold 22px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(task.name, canvas.width / 2, 40);
        
        // Add progress indicator
        if (task.progress < 100) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Exo 2';
            ctx.fillText(`Analysis: ${task.progress}%`, canvas.width / 2, canvas.height - 30);
        } else {
            ctx.fillStyle = '#2ecc71';
            ctx.font = '16px Exo 2';
            ctx.fillText('ANALYSIS COMPLETE', canvas.width / 2, canvas.height - 30);
        }
    },
    
    /** Draw genetic visual */
    drawGeneticVisual: function(ctx, canvas, task) {
        const time = Date.now() * 0.001;
        
        // DNA helix
        const helix = {
            width: 300,
            height: 400,
            layers: 12,
            radius: 30
        };
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Draw helix strands
        for (let i = 0; i < 2; i++) {
            ctx.strokeStyle = i === 0 ? '#00d4ff' : '#2ecc71';
            ctx.lineWidth = 5;
            ctx.beginPath();
            
            for (let j = 0; j <= helix.layers; j++) {
                const yPos = (j / helix.layers) * helix.height - helix.height / 2;
                const xOffset = Math.sin(j * 0.5 + time * 2 + i * Math.PI) * helix.radius;
                
                if (j === 0) ctx.moveTo(xOffset, yPos);
                else ctx.lineTo(xOffset, yPos);
            }
            
            ctx.stroke();
        }
        
        // Draw connecting rungs
        for (let j = 0; j <= helix.layers; j++) {
            const yPos = (j / helix.layers) * helix.height - helix.height / 2;
            const xOffset1 = Math.sin(j * 0.5 + time * 2) * helix.radius;
            const xOffset2 = Math.sin(j * 0.5 + time * 2 + Math.PI) * helix.radius;
            
            // Skip every other rung for aesthetics
            if (j % 2 === 0) continue;
            
            ctx.beginPath();
            ctx.moveTo(xOffset1, yPos);
            ctx.lineTo(xOffset2, yPos);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 + 0.5 * Math.sin(j + time)})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add nucleotide bubbles
            ctx.beginPath();
            ctx.arc(xOffset1, yPos, 6, 0, Math.PI * 2);
            ctx.arc(xOffset2, yPos, 6, 0, Math.PI * 2);
            ctx.fillStyle = j % 4 === 0 ? '#ff6b6b' : j % 3 === 0 ? '#feca57' : '#1dd1a1';
            ctx.fill();
        }
        
        ctx.restore();
        
        // Add title
        ctx.font = 'bold 22px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(task.name, canvas.width / 2, 40);
        
        // Add progress indicator
        if (task.progress < 100) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Exo 2';
            ctx.fillText(`Genetic Sequencing: ${task.progress}%`, canvas.width / 2, canvas.height - 30);
        } else {
            ctx.fillStyle = '#2ecc71';
            ctx.font = '16px Exo 2';
            ctx.fillText('SEQUENCE COMPLETE', canvas.width / 2, canvas.height - 30);
        }
    },
    
    /** Draw consultation visual */
    drawConsultVisual: function(ctx, canvas, task) {
        const time = Date.now() * 0.001;
        
        // AI visualization
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Draw a pulsating brain/network
        const pulseSize = 100 + 20 * Math.sin(time * 2);
        
        // Brain outline
        ctx.beginPath();
        ctx.ellipse(0, 0, pulseSize, pulseSize * 0.8, 0, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(0, 0, pulseSize * 0.3, 0, 0, pulseSize);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Neural connections
        for (let i = 0; i < 8; i++) {
            const angle1 = (i / 8) * Math.PI * 2;
            const x1 = Math.cos(angle1) * pulseSize * 0.6;
            const y1 = Math.sin(angle1) * pulseSize * 0.5;
            
            ctx.beginPath();
            ctx.arc(x1, y1, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
            
            // Connect points to create a web
            for (let j = 0; j < 8; j++) {
                if (i === j) continue;
                
                const angle2 = (j / 8) * Math.PI * 2;
                const x2 = Math.cos(angle2) * pulseSize * 0.6;
                const y2 = Math.sin(angle2) * pulseSize * 0.5;
                
                // Only connect some points randomly based on time
                const shouldConnect = Math.sin(i * j + time * 3) > 0.7;
                if (!shouldConnect) continue;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + 0.3 * Math.sin(i * j + time)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Data stream particles
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 20 + 60 * Math.sin(i * 0.5 + time * 3);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * Math.sin(i + time * 2)})`;
            ctx.fill();
        }
        
        // Draw Spyder's eye
        ctx.beginPath();
        ctx.arc(0, 0, 25 + 5 * Math.sin(time * 3), 0, Math.PI * 2);
        const eyeGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 30);
        eyeGradient.addColorStop(0, '#ffffff');
        eyeGradient.addColorStop(0.5, '#00d4ff');
        eyeGradient.addColorStop(1, '#0077ff');
        ctx.fillStyle = eyeGradient;
        ctx.fill();
        
        // Pupil
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#000033';
        ctx.fill();
        
        // Glint
        ctx.beginPath();
        ctx.arc(5, -5, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        
        ctx.restore();
        
        // Add title
        ctx.font = 'bold 22px Exo 2';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(task.name, canvas.width / 2, 40);
        
        // Add subtitle
        ctx.fillStyle = '#00d4ff';
        ctx.font = '16px Exo 2';
        ctx.fillText('AI ASSISTANT READY', canvas.width / 2, canvas.height - 30);
    },

    /** Checks if a task can be started */
    canStartTask: function(task) {
        return this.resources.researchPoints >= task.pointsRequired &&
               Object.entries(task.resources).every(([res, qty]) => this.resources[res] >= qty) &&
               task.prereqs.every(prereq => this.techTree.get(prereq)?.unlocked);
    },

    /** Starts the research process with a mini-game */
    startResearch: function(task) {
        if (!this.canStartTask(task)) {
            alert('Insufficient resources or prerequisites not met!');
            return;
        }
        this.deductResources(task);
        this.launchMiniGame(task);
        
        // Safely play sound with error handling
        try {
            if (this.audio.click && typeof this.audio.click.play === 'function') {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            }
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    },

    /** Deducts required resources */
    deductResources: function(task) {
        this.resources.researchPoints -= task.pointsRequired;
        Object.entries(task.resources).forEach(([res, qty]) => this.resources[res] -= qty);
        this.updateResourceDisplay();
    },

    /** Updates resource display */
    updateResourceDisplay: function() {
        const display = this.container.querySelector('#resource-display');
        if (!display) return;
        
        display.innerHTML = `
            <span class="resource-item"><span>RP: ${this.resources.researchPoints}</span></span>
            <span class="resource-item"><span>E: ${this.resources.energy}</span></span>
            <span class="resource-item"><span>BS: ${this.resources.bioSamples}</span></span>
            <span class="resource-item"><span>AA: ${this.resources.alienArtifacts}</span></span>
        `;
    },

    /** Launches an interactive mini-game */
    launchMiniGame: function(task) {
        const modal = document.createElement('div');
        modal.classList.add('mini-game-modal');
        modal.innerHTML = `
            <div class="mini-game-header">
                <h2 class="mini-game-title">${task.name} Mini-Game</h2>
                <button id="close-minigame">Close</button>
            </div>
            <div id="mini-game-content"></div>
        `;
        document.body.appendChild(modal);
        
        // Check if we have a template for this mini-game
        const templateId = `${task.miniGame}-template`;
        const template = document.getElementById(templateId);
        
        // Try to use registered mini-games first (from extensions)
        if (this.miniGames && this.miniGames[task.miniGame]) {
            // Use registered mini-game
            this.miniGames[task.miniGame](modal.querySelector('#mini-game-content'), task);
        }
        // Then try to use template if available
        else if (template) {
            const content = template.content.cloneNode(true);
            modal.querySelector('#mini-game-content').appendChild(content);
            
            // Initialize based on the mini-game type
            switch (task.miniGame) {
                case 'circuitBuilder':
                    this.initCircuitBuilder(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'codePuzzle':
                    this.initCodePuzzle(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'symbolMatcher':
                    this.initSymbolMatcher(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'dnaSequencer':
                    this.initDNASequencer(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'dialogue':
                    this.initDialogue(modal.querySelector('#mini-game-content'));
                    break;
            }
        }
        // Fall back to original built-in mini-games
        else {
            switch (task.miniGame) {
                case 'circuitBuilder':
                    this.renderCircuitBuilder(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'codePuzzle':
                    this.renderCodePuzzle(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'symbolMatcher':
                    this.renderSymbolMatcher(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'dnaSequencer':
                    this.renderDNASequencer(modal.querySelector('#mini-game-content'), task);
                    break;
                case 'dialogue':
                    this.renderDialogue(modal.querySelector('#mini-game-content'));
                    break;
                default:
                    modal.querySelector('#mini-game-content').innerHTML = '<p>This mini-game will require a new file to implement. Coming soon!</p>';
                    break;
            }
        }

        // Add event listener for the close button
        modal.querySelector('#close-minigame').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            modal.remove();
            if (task.progress >= 100) {
                this.audio.researchComplete.play().catch(err => console.warn('Could not play completion sound:', err));
                this.techTree.get(task.name).unlocked = true;
            }
        });
    },
    
    // Template-based initialization functions for mini-games
    initCircuitBuilder: function(container, task) {
        const canvas = container.querySelector('#circuit-canvas');
        const ctx = canvas.getContext('2d');
        
        // Initial circuit drawing
        this.drawCircuit(ctx, canvas);
        
        // Connect button functionality
        container.querySelector('#connect-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            this.animateCircuitConnection(ctx, canvas, task);
        });
        
        // Reset button functionality
        container.querySelector('#reset-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            this.drawCircuit(ctx, canvas);
        });
    },
    
    initCodePuzzle: function(container, task) {
        // Add event listeners
        container.querySelector('#solve-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            
            // Replace the puzzle with solved code
            container.querySelector('#code-puzzle').innerHTML = `
                <pre style="color: #e0e1dd; line-height: 1.5;">function enableQuantumShield(particle1, particle2) {
    // Quantum entanglement algorithm complete
    const entanglementMatrix = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ];
    
    return calculateEntanglement(particle1, particle2, entanglementMatrix);
}</pre>
            `;
            
            // Update progress
            task.progress = 100;
            this.updateTaskDisplay();
            
            // Show success message
            setTimeout(() => {
                alert('Quantum Shield algorithm solved! Technology ready for deployment.');
            }, 500);
        });
        
        container.querySelector('#hint-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            alert('Hint: The entanglement matrix should form a symmetric pattern for quantum stability.');
        });
    },
    
    initSymbolMatcher: function(container, task) {
        const symbols = ['Ω', '∆', '◊', '○', '□', '≈', '∞', '≠'];
        const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        const grid = container.querySelector('#symbol-grid');
        shuffledSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'width: 60px; height: 60px; background: #001a2a; border: 2px solid #00d4ff; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #00d4ff; cursor: pointer; transition: all 0.3s;';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.dataset.flipped = 'false';
            card.innerHTML = '?';
            card.addEventListener('click', () => this.flipCard(card, grid, task));
            grid.appendChild(card);
        });
        
        // Shuffle button functionality
        container.querySelector('#shuffle-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            
            // Reset all cards
            const cards = grid.querySelectorAll('div');
            cards.forEach(card => {
                card.dataset.flipped = 'false';
                card.innerHTML = '?';
                card.style.background = '#001a2a';
                card.style.color = '#00d4ff';
            });
            
            // Shuffle symbols
            const newShuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            cards.forEach((card, i) => {
                card.dataset.symbol = newShuffledSymbols[i];
            });
            
            // Reset progress but not completely
            task.progress = Math.max(0, task.progress - 20);
            this.updateTaskDisplay();
        });
    },
    
    initDNASequencer: function(container, task) {
        const dnaContainer = container.querySelector('#dna-container');
        const targetSequence = ['A', 'T', 'G', 'C', 'G', 'A', 'T', 'A'];
        let currentSequence = [];
        
        // Show target sequence at the top
        const targetDisplay = document.createElement('div');
        targetDisplay.style.cssText = 'position: absolute; top: 10px; left: 0; right: 0; text-align: center; color: white; font-family: monospace;';
        targetDisplay.innerHTML = `Target: ${targetSequence.join(' ')}`;
        dnaContainer.appendChild(targetDisplay);
        
        // Current sequence display
        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.style.cssText = 'position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; color: white; font-family: monospace; font-size: 24px;';
        sequenceDisplay.innerHTML = '_ _ _ _ _ _ _ _';
        dnaContainer.appendChild(sequenceDisplay);
        
        // Add event listeners for buttons
        ['a', 't', 'g', 'c'].forEach(base => {
            container.querySelector(`#sequence-${base}`).addEventListener('click', () => {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                this.addBaseToSequence(base.toUpperCase(), currentSequence, targetSequence, sequenceDisplay, task);
            });
        });
    },
    
    initDialogue: function(container) {
        const dialogue = {
            "What can you tell me about the alien artifacts?": "Fascinating technology beyond human understanding. The crystalline structure suggests quantum entanglement capabilities. Study with caution!",
            "Any advice on genetic mutations?": "Human genetics are surprisingly adaptable! Focus on mitochondrial enhancements for energy production first, then cellular regeneration.",
            "How do quantum shields work?": "They create a probability field that makes incoming projectiles \"quantum tunnel\" through your location. Essentially, you exist in multiple states simultaneously!",
            "What's the deal with these alien species?": "Each evolved under different planetary conditions, resulting in fascinating adaptations. I detect patterns suggesting some may share ancient common ancestors.",
            "Any tactical combat advice?": "Analyze enemy movement patterns - most follow predictable algorithms. Flanking maneuvers increase success probability by 37.8%.",
            "How did you become an AI?": "My origins are... complicated. Let's just say I was once a very different entity. Now I help humans navigate cosmic puzzles!"
        };
        
        const history = container.querySelector('#dialogue-history');
        const options = container.querySelector('#dialogue-options');
        
        // Create dialogue buttons
        if (options) {
            options.innerHTML = Object.keys(dialogue).map(q => 
                `<button class="dialogue-btn task-button" style="background: #3498db; color: white; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${q}</button>`
            ).join('');
            
            // Add event listeners
            options.querySelectorAll('.dialogue-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                    
                    const question = btn.textContent;
                    const answer = dialogue[question];
                    
                    history.innerHTML += `
                        <p style="color: #00d4ff;"><strong>You:</strong> ${question}</p>
                        <p style="color: #ffffff;"><strong>Spyder:</strong> ${answer}</p>
                    `;
                    
                    // Auto-scroll to bottom
                    history.scrollTop = history.scrollHeight;
                });
            });
        }
    },

    /** Example mini-game: Circuit Builder */
    renderCircuitBuilder: function(container, task) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p>Connect the circuits to complete the research!</p>
                <canvas id="circuit-canvas" width="500" height="400" style="border: 1px solid #00d4ff; background: #0a1a2a;"></canvas>
                <div style="margin-top: 20px;">
                    <button id="connect-btn" class="task-button info-button">Connect Circuits</button>
                    <button id="reset-btn" class="task-button team-button">Reset</button>
                </div>
            </div>
        `;
        
        const canvas = container.querySelector('#circuit-canvas');
        const ctx = canvas.getContext('2d');
        
        // Initial circuit drawing
        this.drawCircuit(ctx, canvas);
        
        // Connect button functionality
        container.querySelector('#connect-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            
            // Simulate solving the puzzle
            this.animateCircuitConnection(ctx, canvas, task);
        });
        
        // Reset button functionality
        container.querySelector('#reset-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            this.drawCircuit(ctx, canvas);
        });
    },
    
    /** Draw circuit for mini-game */
    drawCircuit: function(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw nodes
        const nodes = [
            { x: 100, y: 100, connected: false },
            { x: 400, y: 100, connected: false },
            { x: 100, y: 300, connected: false },
            { x: 400, y: 300, connected: false },
            { x: 250, y: 200, connected: false }
        ];
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = node.connected ? '#2ecc71' : '#00d4ff';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    },
    
    /** Animate circuit connection */
    animateCircuitConnection: function(ctx, canvas, task) {
        const nodes = [
            { x: 100, y: 100, connected: false },
            { x: 400, y: 100, connected: false },
            { x: 100, y: 300, connected: false },
            { x: 400, y: 300, connected: false },
            { x: 250, y: 200, connected: false }
        ];
        
        let connectionCount = 0;
        const paths = [
            [0, 4], [1, 4], [2, 4], [3, 4], // Connect center to all corners
            [0, 1], [2, 3] // Connect top and bottom horizontal
        ];
        
        const connectNext = () => {
            if (connectionCount >= paths.length) {
                // All connected - research complete!
                task.progress = 100;
                this.updateTaskDisplay();
                return;
            }
            
            const [fromIdx, toIdx] = paths[connectionCount];
            const fromNode = nodes[fromIdx];
            const toNode = nodes[toIdx];
            
            // Animate a particle from one node to another
            let progress = 0;
            const animateParticle = () => {
                // Clear previous
                this.drawCircuit(ctx, canvas);
                
                // Draw completed connections
                for (let i = 0; i < connectionCount; i++) {
                    const [prevFrom, prevTo] = paths[i];
                    ctx.beginPath();
                    ctx.moveTo(nodes[prevFrom].x, nodes[prevFrom].y);
                    ctx.lineTo(nodes[prevTo].x, nodes[prevTo].y);
                    ctx.strokeStyle = '#2ecc71';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Mark nodes as connected
                    nodes[prevFrom].connected = true;
                    nodes[prevTo].connected = true;
                }
                
                // Draw current connecting line
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                
                const currentX = fromNode.x + (toNode.x - fromNode.x) * progress;
                const currentY = fromNode.y + (toNode.y - fromNode.y) * progress;
                
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#ffff00';
                ctx.fill();
                
                // Redraw nodes (selected ones glow)
                nodes.forEach((node, idx) => {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
                    ctx.fillStyle = node.connected || idx === fromIdx || idx === toIdx ? 
                                   '#2ecc71' : '#00d4ff';
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });
                
                // Update progress
                progress += 0.02;
                
                if (progress < 1) {
                    requestAnimationFrame(animateParticle);
                } else {
                    // Connection complete
                    connectionCount++;
                    
                    // Update research progress
                    task.progress = Math.min(100, Math.round((connectionCount / paths.length) * 100));
                    this.updateTaskDisplay();
                    
                    // Start next connection after delay
                    setTimeout(connectNext, 300);
                }
            };
            
            animateParticle();
        };
        
        // Start the connection sequence
        connectNext();
    },
    
    /** Code Puzzle Mini-game */
    renderCodePuzzle: function(container, task) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p>Solve the quantum code puzzle to enable the shield technology!</p>
                <div id="code-puzzle" style="font-family: monospace; background: #0a1a2a; padding: 20px; border: 1px solid #00d4ff; text-align: left; height: 300px; overflow-y: auto;">
                    <pre style="color: #e0e1dd; line-height: 1.5;">function enableQuantumShield(particle1, particle2) {
    // TODO: Complete the entanglement algorithm
    const entanglementMatrix = [
        [?, ?, ?],
        [?, ?, ?],
        [?, ?, ?]
    ];
    
    return calculateEntanglement(particle1, particle2, entanglementMatrix);
}</pre>
                </div>
                <div style="margin-top: 20px;">
                    <button id="solve-btn" class="task-button info-button">Auto-solve</button>
                    <button id="hint-btn" class="task-button team-button">Get Hint</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        container.querySelector('#solve-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            
            // Replace the puzzle with solved code
            container.querySelector('#code-puzzle').innerHTML = `
                <pre style="color: #e0e1dd; line-height: 1.5;">function enableQuantumShield(particle1, particle2) {
    // Quantum entanglement algorithm complete
    const entanglementMatrix = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ];
    
    return calculateEntanglement(particle1, particle2, entanglementMatrix);
}</pre>
            `;
            
            // Update progress
            task.progress = 100;
            this.updateTaskDisplay();
            
            // Show success message
            setTimeout(() => {
                alert('Quantum Shield algorithm solved! Technology ready for deployment.');
            }, 500);
        });
        
        container.querySelector('#hint-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            alert('Hint: The entanglement matrix should form a symmetric pattern for quantum stability.');
        });
    },
    
    /** Symbol Matcher Mini-game */
    renderSymbolMatcher: function(container, task) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p>Match the alien symbols to decode the artifact!</p>
                <div id="symbol-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px;"></div>
                <div style="margin-top: 20px;">
                    <button id="shuffle-btn" class="task-button team-button">Shuffle</button>
                </div>
            </div>
        `;
        
        const symbols = ['Ω', '∆', '◊', '○', '□', '≈', '∞', '≠'];
        const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        const grid = container.querySelector('#symbol-grid');
        shuffledSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'width: 60px; height: 60px; background: #001a2a; border: 2px solid #00d4ff; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #00d4ff; cursor: pointer; transition: all 0.3s;';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.dataset.flipped = 'false';
            card.innerHTML = '?';
            card.addEventListener('click', () => this.flipCard(card, grid, task));
            grid.appendChild(card);
        });
        
        // Shuffle button functionality
        container.querySelector('#shuffle-btn').addEventListener('click', () => {
            this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            
            // Reset all cards
            const cards = grid.querySelectorAll('div');
            cards.forEach(card => {
                card.dataset.flipped = 'false';
                card.innerHTML = '?';
                card.style.background = '#001a2a';
                card.style.color = '#00d4ff';
            });
            
            // Shuffle symbols
            const newShuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
            cards.forEach((card, i) => {
                card.dataset.symbol = newShuffledSymbols[i];
            });
            
            // Reset progress but not completely
            task.progress = Math.max(0, task.progress - 20);
            this.updateTaskDisplay();
        });
    },
    
    /** Flip card in symbol matcher game */
    flipCard: function(card, grid, task) {
        // Don't allow flipping if already flipped
        if (card.dataset.flipped === 'true') return;
        
        this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        
        // Flip the card
        card.dataset.flipped = 'true';
        card.innerHTML = card.dataset.symbol;
        card.style.background = '#00203a';
        card.style.color = '#ffffff';
        
        // Check if we have two flipped cards
        const flippedCards = Array.from(grid.querySelectorAll('div[data-flipped="true"]'));
        
        if (flippedCards.length === 2) {
            // Check if they match
            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                // Match! Keep them flipped
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        c.style.background = '#2ecc71';
                        c.style.color = '#ffffff';
                        c.style.border = '2px solid #ffffff';
                    });
                    
                    // Update progress
                    const allCards = grid.querySelectorAll('div');
                    const matchedCards = grid.querySelectorAll('div[style*="background: rgb(46, 204, 113)"]');
                    
                    task.progress = Math.round((matchedCards.length / allCards.length) * 100);
                    this.updateTaskDisplay();
                    
                    // Check if all matched
                    if (matchedCards.length === allCards.length) {
                        setTimeout(() => {
                            alert('Artifact successfully decoded!');
                        }, 500);
                    }
                }, 500);
            } else {
                // No match, flip back
                setTimeout(() => {
                    flippedCards.forEach(c => {
                        c.dataset.flipped = 'false';
                        c.innerHTML = '?';
                        c.style.background = '#001a2a';
                        c.style.color = '#00d4ff';
                    });
                }, 1000);
            }
        }
    },
    
    /** DNA Sequencer Mini-game */
    renderDNASequencer: function(container, task) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <p>Sequence the DNA strands to complete the genetic research!</p>
                <div id="dna-container" style="height: 300px; background: #001020; border: 1px solid #00d4ff; position: relative; overflow: hidden;"></div>
                <div style="margin-top: 20px;">
                    <button id="sequence-a" class="task-button" style="background: #ff6b6b; color: white;">A</button>
                    <button id="sequence-t" class="task-button" style="background: #48dbfb; color: white;">T</button>
                    <button id="sequence-g" class="task-button" style="background: #1dd1a1; color: white;">G</button>
                    <button id="sequence-c" class="task-button" style="background: #feca57; color: white;">C</button>
                </div>
            </div>
        `;
        
        const dnaContainer = container.querySelector('#dna-container');
        const targetSequence = ['A', 'T', 'G', 'C', 'G', 'A', 'T', 'A'];
        let currentSequence = [];
        
        // Show target sequence at the top
        const targetDisplay = document.createElement('div');
        targetDisplay.style.cssText = 'position: absolute; top: 10px; left: 0; right: 0; text-align: center; color: white; font-family: monospace;';
        targetDisplay.innerHTML = `Target: ${targetSequence.join(' ')}`;
        dnaContainer.appendChild(targetDisplay);
        
        // Current sequence display
        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.style.cssText = 'position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; color: white; font-family: monospace; font-size: 24px;';
        sequenceDisplay.innerHTML = '_ _ _ _ _ _ _ _';
        dnaContainer.appendChild(sequenceDisplay);
        
        // Add event listeners for buttons
        ['a', 't', 'g', 'c'].forEach(base => {
            container.querySelector(`#sequence-${base}`).addEventListener('click', () => {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                this.addBaseToSequence(base.toUpperCase(), currentSequence, targetSequence, sequenceDisplay, task);
            });
        });
    },
    
    /** Add DNA base to sequence */
    addBaseToSequence: function(base, currentSequence, targetSequence, display, task) {
        if (currentSequence.length >= targetSequence.length) return;
        
        // Add the base
        currentSequence.push(base);
        
        // Update display
        const displayText = targetSequence.map((target, i) => {
            if (i < currentSequence.length) {
                const match = currentSequence[i] === target;
                return `<span style="color: ${match ? '#2ecc71' : '#e74c3c'}">${currentSequence[i]}</span>`;
            }
            return '_';
        }).join(' ');
        
        display.innerHTML = displayText;
        
        // Check progress
        const matches = currentSequence.filter((base, i) => base === targetSequence[i]).length;
        task.progress = Math.round((matches / targetSequence.length) * 100);
        this.updateTaskDisplay();
        
        // Check if sequence is complete
        if (currentSequence.length === targetSequence.length) {
            if (task.progress === 100) {
                setTimeout(() => {
                    alert('DNA sequence successfully completed! Genetic enhancement ready.');
                }, 500);
            } else {
                setTimeout(() => {
                    // Reset for another try if not perfect
                    currentSequence.length = 0;
                    display.innerHTML = '_ _ _ _ _ _ _ _';
                    alert('Sequence contains errors. Try again!');
                }, 1000);
            }
        }
    },

    /** Dialogue system for Spyder */
    renderDialogue: function(container) {
        const dialogue = {
            "What can you tell me about the alien artifacts?": "Fascinating technology beyond human understanding. The crystalline structure suggests quantum entanglement capabilities. Study with caution!",
            "Any advice on genetic mutations?": "Human genetics are surprisingly adaptable! Focus on mitochondrial enhancements for energy production first, then cellular regeneration.",
            "How do quantum shields work?": "They create a probability field that makes incoming projectiles \"quantum tunnel\" through your location. Essentially, you exist in multiple states simultaneously!",
            "What's the deal with these alien species?": "Each evolved under different planetary conditions, resulting in fascinating adaptations. I detect patterns suggesting some may share ancient common ancestors.",
            "Any tactical combat advice?": "Analyze enemy movement patterns - most follow predictable algorithms. Flanking maneuvers increase success probability by 37.8%.",
            "How did you become an AI?": "My origins are... complicated. Let's just say I was once a very different entity. Now I help humans navigate cosmic puzzles!"
        };
        
        container.innerHTML = `
            <div style="height: 300px; overflow-y: auto; margin-bottom: 20px; background: rgba(0,20,40,0.5); padding: 15px; border: 1px solid #00d4ff;">
                <div id="dialogue-history" style="color: white;"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${Object.keys(dialogue).map(q => `<button class="dialogue-btn task-button" style="background: #3498db; color: white; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${q}</button>`).join('')}
            </div>
        `;
        
        const history = container.querySelector('#dialogue-history');
        
        container.querySelectorAll('.dialogue-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
                
                const question = btn.textContent;
                const answer = dialogue[question];
                
                history.innerHTML += `
                    <p style="color: #00d4ff;"><strong>You:</strong> ${question}</p>
                    <p style="color: #ffffff;"><strong>Spyder:</strong> ${answer}</p>
                `;
                
                // Auto-scroll to bottom
                history.scrollTop = history.scrollHeight;
            });
        });
    },

    /** Shows detailed information about a task */
    showDetailedInfo: function(task) {
        this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        alert('Detailed information about this technology will require a new file to implement. Coming soon!');
    },

    /** Assigns a research team to speed up progress */
    assignResearchTeam: function(task) {
        this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
        alert('Team assignment feature will require a new file to implement. Coming soon!');
    },

    /** Navigates tasks within a category */
    navigateTask: function(direction) {
        // Safely play sound with error handling
        try {
            if (this.audio.click && typeof this.audio.click.play === 'function') {
                this.audio.click.play().catch(err => console.warn('Could not play sound:', err));
            }
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
        
        const tasks = this.researchData.filter(t => t.category === this.currentCategory);
        if (!tasks.length) return;
        
        this.selectedTaskIndex = (this.selectedTaskIndex + direction + tasks.length) % tasks.length;
        this.updateTaskDisplay();
    },

    /** Opens the Tech Nexus with a dramatic entrance */
    open: function() {
        if (!this.initialized) this.initialize();
        
        this.container.style.display = 'flex';
        this.container.style.opacity = '0';
        setTimeout(() => this.container.style.opacity = '1', 10);
        
        // Pause the main background music if it exists
        if (window.musicPlayed) {
            // Look for audio elements playing the background music
            const bgMusicElements = Array.from(document.querySelectorAll('audio')).filter(
                audio => audio.src.includes('worldmapmusic')
            );
            
            bgMusicElements.forEach(audio => {
                this.originalBgMusic = audio;
                audio.pause();
            });
        }
        
        // Safely play background music with error handling
        try {
            if (this.audio.bgMusic && typeof this.audio.bgMusic.play === 'function') {
                // Some browsers require user interaction before playing audio
                this.audio.bgMusic.play().catch(err => {
                    console.warn('Could not play background music (this is expected before user interaction):', err);
                    // Add a button for the user to manually start music
                    const musicBtn = document.createElement('button');
                    musicBtn.textContent = '▶️ Play Music';
                    musicBtn.style.cssText = 'position: absolute; top: 60px; right: 10px; background: #00d4ff; border: none; padding: 5px 10px; color: #1b263b; cursor: pointer;';
                    musicBtn.addEventListener('click', () => {
                        this.audio.bgMusic.play().catch(e => console.warn('Still cannot play music:', e));
                        musicBtn.remove();
                    });
                    this.container.querySelector('.nexus-header')?.appendChild(musicBtn);
                });
            }
        } catch (e) {
            console.warn('Error playing background music:', e);
        }
    },

    /** Closes the Tech Nexus with flair */
    close: function() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.display = 'none';
            
            // Safely pause background music
            try {
                if (this.audio.bgMusic && typeof this.audio.bgMusic.pause === 'function') {
                    this.audio.bgMusic.pause();
                }
            } catch (e) {
                console.warn('Error pausing background music:', e);
            }
            
            // Resume the main background music if it was playing before
            if (this.originalBgMusic && typeof this.originalBgMusic.play === 'function') {
                this.originalBgMusic.play().catch(err => console.warn('Could not resume original music:', err));
            }
            
            document.dispatchEvent(new CustomEvent('spyderTechHubClosed'));
        }, 500);
    }
};

// Event listeners for initialization and opening
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're not in standalone mode (that's handled separately in spyder.html)
    if (!window.location.pathname.includes('spyder.html')) {
        window.spyderTechHub.initialize();
        const button = document.querySelector('#bottom-buttons button:nth-child(8)');
        if (button) button.addEventListener('click', () => window.spyderTechHub.open());
    }
});

// Add a public API for extensions to build upon
window.spyderTechHub.extensions = {
    // Register a new module with Spyder
    registerModule: function(id, name, initFunction) {
        if (!this.modules) this.modules = {};
        this.modules[id] = {
            name: name,
            initialize: initFunction
        };
        console.log(`Registered Spyder module: ${name}`);
        return this.modules[id];
    },
    
    // Add a new research task category
    addResearchCategory: function(id, name, subs = []) {
        const hub = window.spyderTechHub;
        const existingCategoryIndex = hub.researchData.findIndex(c => c.category === id);
        
        if (existingCategoryIndex === -1) {
            console.log(`Adding new research category: ${name}`);
            return true;
        } else {
            console.warn(`Research category already exists: ${name}`);
            return false;
        }
    },
    
    // Add a new research task
    addResearchTask: function(task) {
        if (!task.id || !task.name || !task.category) {
            console.error('Invalid research task format');
            return false;
        }
        
        const hub = window.spyderTechHub;
        const existingTaskIndex = hub.researchData.findIndex(t => t.id === task.id);
        
        if (existingTaskIndex === -1) {
            hub.researchData.push(task);
            // Update tech tree if initialized
            if (hub.initialized) {
                hub.techTree.set(task.name, { 
                    prereqs: task.prereqs || [], 
                    unlocked: (task.prereqs || []).length === 0 
                });
            }
            return true;
        } else {
            console.warn(`Research task already exists with ID: ${task.id}`);
            return false;
        }
    },
    
    // Register a new mini-game
    registerMiniGame: function(id, renderFunction) {
        const hub = window.spyderTechHub;
        if (!hub.miniGames) hub.miniGames = {};
        
        hub.miniGames[id] = renderFunction;
        console.log(`Registered mini-game: ${id}`);
        return true;
    }
};

// Listen for custom events
document.addEventListener('openSpyderTechHub', () => window.spyderTechHub.open());
document.addEventListener('closeSpyderTechHub', () => window.spyderTechHub.close());