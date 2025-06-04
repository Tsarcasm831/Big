console.log('Loading The Forge: Wasteland Fabricator...');

class Forge {
    constructor() {
        this.initialized = false;
        this.container = null;
        this.resources = window.gameResources || {
            steel: 0,
            circuits: 0,
            fuel: 0,
            rareMetals: 0
        };
        this.currentTask = null;
        this.upgradeData = [];
        this.selectedTaskIndex = 0;
        this.forgeLevel = 1;
        this.audio = new Audio('assets/Sounds/metal-clank.mp3');
    }

    initialize() {
        if (this.initialized) return;
        console.log('Initializing The Forge: Wasteland Fabricator...');

        this.container = document.createElement('div');
        this.container.id = 'forge-workshop';
        this.container.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #222 url('https://i.imgur.com/PAhMZWu.jpg') no-repeat center/cover;
            z-index: 9999; display: none; color: #fff; font-family: 'Orbitron', sans-serif;
            overflow: hidden; border: 5px solid #b87333; box-shadow: inset 0 0 20px #000;
        `;
        document.body.appendChild(this.container);

        this.createLayout();
        this.loadUpgradeData();
        this.setupMiniGame();
        this.initialized = true;
        console.log('Forge initialized.');
    }

    createLayout() {
        console.log('Building Forge layout...');
        const resources = this.resources || {};
        this.container.innerHTML = `
            <div style="background: rgba(40,40,40,0.9); padding: 15px; border-bottom: 5px solid #b87333; display: flex; justify-content: space-between;">
                <h1 style="margin: 0; color: #b87333; font-size: 32px; text-shadow: 0 0 10px #b87333;">THE FORGE</h1>
                <button id="forge-back" style="background: #444; color: #fff; border: 2px solid #b87333; padding: 10px 20px; cursor: pointer;">EXIT</button>
            </div>
            <div style="display: flex; height: calc(100% - 70px);">
                <div style="width: 30%; background: rgba(50,50,50,0.9); padding: 20px; overflow-y: auto; border-right: 3px solid #b87333;">
                    <h2 style="color: #b87333; text-align: center;">BLUEPRINTS</h2>
                    <div id="blueprint-list"></div>
                </div>
                <div style="width: 40%; background: rgba(20,20,20,0.9); padding: 20px; text-align: center;">
                    <h2 style="color: #b87333;">FABRICATOR</h2>
                    <canvas id="forge-mini-game" width="300" height="300" style="border: 2px solid #b87333; background: #222;"></canvas>
                    <div id="task-details" style="margin-top: 20px;">
                        <p><strong>Name:</strong> <span id="task-name">--</span></p>
                        <p><strong>Progress:</strong> <span id="task-progress">0%</span></p>
                        <p><strong>Resources Needed:</strong> <span id="task-resources">--</span></p>
                    </div>
                    <button id="start-task" style="background: #b87333; color: #000; padding: 10px 20px; margin-top: 20px;">START FABRICATION</button>
                </div>
                <div style="width: 30%; background: rgba(50,50,50,0.9); padding: 20px; overflow-y: auto; border-left: 3px solid #b87333;">
                    <h2 style="color: #b87333; text-align: center;">RESOURCES</h2>
                    <p>Steel: <span id="res-steel">${resources.steel || 0}</span></p>
                    <p>Circuits: <span id="res-circuits">${resources.circuits || 0}</span></p>
                    <p>Fuel: <span id="res-fuel">${resources.fuel || 0}</span></p>
                    <p>Rare Metals: <span id="res-rareMetals">${resources.rareMetals || 0}</span></p>
                    <h2 style="color: #b87333; margin-top: 20px;">FORGE STATS</h2>
                    <p>Level: ${this.forgeLevel}</p>
                    <p>Upgrade Cost: ${this.forgeLevel * 100} Steel</p>
                    <button id="upgrade-forge" style="background: #b87333; color: #000; padding: 10px 20px; margin-top: 10px;">UPGRADE FORGE</button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('forge-back').addEventListener('click', () => this.close());
        document.getElementById('start-task').addEventListener('click', () => this.startTask());
        document.getElementById('upgrade-forge').addEventListener('click', () => this.upgradeForge());
    }

    loadUpgradeData() {
        this.upgradeData = [
            {
                id: 1, name: 'Wasteland Armor', type: 'gear',
                resources: { steel: 50, circuits: 20 },
                effect: 'Increases defense by 20%',
                description: 'A rugged suit forged from scrap metal.',
                progress: 0, maxProgress: 100
            },
            {
                id: 2, name: 'Plasma Cutter', type: 'weapon',
                resources: { steel: 30, circuits: 40, rareMetals: 5 },
                effect: 'Deals +30% damage to H.I.V.E. units',
                description: 'A fiery blade that slices through steel.',
                progress: 0, maxProgress: 150
            },
            {
                id: 3, name: 'Mobile Outpost', type: 'building',
                resources: { steel: 100, fuel: 50, circuits: 30 },
                effect: 'Unlocks a new travel hub',
                description: 'A fortified base for wasteland expeditions.',
                progress: 0, maxProgress: 200
            },
            {
                id: 4, name: 'Hover Bike', type: 'vehicle',
                resources: { steel: 80, fuel: 40, rareMetals: 15 },
                effect: 'Doubles travel speed on map',
                description: 'A fast ride to outrun mutants.',
                progress: 0, maxProgress: 180
            }
        ];
        this.currentTask = this.upgradeData[0];
        this.populateBlueprintList();
        this.updateTaskDisplay();
    }

    populateBlueprintList() {
        const list = document.getElementById('blueprint-list');
        list.innerHTML = '';
        this.upgradeData.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.cssText = `
                padding: 10px; border: 2px solid ${index === this.selectedTaskIndex ? '#b87333' : '#666'};
                margin-bottom: 10px; cursor: pointer; background: ${index === this.selectedTaskIndex ? 'rgba(184,115,51,0.3)' : '#333'};
            `;
            div.innerHTML = `<strong>${item.name}</strong><br>${item.effect}`;
            div.addEventListener('click', () => {
                this.selectedTaskIndex = index;
                this.currentTask = item;
                this.updateTaskDisplay();
                this.populateBlueprintList();
            });
            list.appendChild(div);
        });
    }

    updateTaskDisplay() {
        const task = this.currentTask;
        document.getElementById('task-name').textContent = task.name;
        document.getElementById('task-progress').textContent = `${Math.round((task.progress / task.maxProgress) * 100)}%`;
        document.getElementById('task-resources').textContent = Object.entries(task.resources)
            .map(([key, val]) => `${key}: ${val}`).join(', ');
    }

    setupMiniGame() {
        const canvas = document.getElementById('forge-mini-game');
        const ctx = canvas.getContext('2d');
        let hammerX = 150, hammerY = 50, targetX = 150, targetY = 200;

        function draw() {
            ctx.clearRect(0, 0, 300, 300);
            ctx.fillStyle = '#666';
            ctx.fillRect(100, 200, 100, 50); // Anvil
            ctx.fillStyle = '#b87333';
            ctx.fillRect(hammerX - 10, hammerY, 20, 40); // Hammer
            ctx.fillStyle = '#fff';
            ctx.fillRect(targetX - 5, targetY - 5, 10, 10); // Target
        }

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            hammerX = e.clientX - rect.left;
            hammerY = e.clientY - rect.top;
            if (Math.abs(hammerX - targetX) < 20 && Math.abs(hammerY - targetY) < 20 && this.currentTask.progress < this.currentTask.maxProgress) {
                const progressIncrement = 10 + (this.forgeLevel - 1) * 5;
                this.currentTask.progress += progressIncrement;
                this.audio.play();
                targetX = 100 + Math.random() * 100;
                this.updateTaskDisplay();
                if (this.currentTask.progress >= this.currentTask.maxProgress) {
                    this.completeTask();
                }
            }
            draw();
        });

        draw();
    }

    startTask() {
        if (!this.checkResources()) {
            alert('Insufficient resources!');
            return;
        }
        console.log(`Fabricating ${this.currentTask.name}...`);
        this.deductResources();
    }

    completeTask() {
        console.log(`${this.currentTask.name} completed!`);
        this.applyTaskEffect();
        this.currentTask.progress = 0;
        this.updateTaskDisplay();
    }

    checkResources() {
        const task = this.currentTask;
        return Object.entries(task.resources).every(([res, amt]) => this.resources[res] >= amt);
    }

    deductResources() {
        const task = this.currentTask;
        Object.entries(task.resources).forEach(([res, amt]) => {
            this.resources[res] -= amt;
            document.getElementById(`res-${res}`).textContent = this.resources[res];
        });
    }

    applyTaskEffect() {
        const effect = this.currentTask.effect;
        console.log(`Applying effect: ${effect}`);

        if (effect.includes('travel speed')) {
            document.dispatchEvent(new CustomEvent('travelSpeedUpgraded', { detail: { multiplier: 2 } }));
        } else if (effect.includes('defense')) {
            document.dispatchEvent(new CustomEvent('defenseUpgraded', { detail: { bonus: 20 } }));
        } else if (effect.includes('damage')) {
            document.dispatchEvent(new CustomEvent('damageUpgraded', { detail: { bonus: 30 } }));
        } else if (effect.includes('travel hub')) {
            const pos = window.playerMarker.getLatLng();
            document.dispatchEvent(new CustomEvent('outpostCreated', { detail: { lat: pos.lat, lng: pos.lng } }));
        }

        alert(`Forged ${this.currentTask.name}! Effect: ${effect}`);
    }

    upgradeForge() {
        const cost = this.forgeLevel * 100;
        if (this.resources.steel >= cost) {
            this.resources.steel -= cost;
            this.forgeLevel++;
            document.getElementById('res-steel').textContent = this.resources.steel;
            document.getElementById('upgrade-forge').previousElementSibling.textContent = `Upgrade Cost: ${this.forgeLevel * 100} Steel`;
            alert(`Forge upgraded to Level ${this.forgeLevel}! Faster crafting unlocked.`);
        } else {
            alert('Not enough steel to upgrade!');
        }
    }

    open() {
        if (!this.initialized) this.initialize();
        this.container.style.display = 'block';
        document.getElementById('res-steel').textContent = this.resources.steel;
        document.getElementById('res-circuits').textContent = this.resources.circuits;
        document.getElementById('res-fuel').textContent = this.resources.fuel;
        document.getElementById('res-rareMetals').textContent = this.resources.rareMetals;
    }

    close() {
        this.container.style.display = 'none';
        document.dispatchEvent(new CustomEvent('forgeWorkshopClosed'));
    }
}

window.forgeWorkshop = new Forge();

document.addEventListener('DOMContentLoaded', () => window.forgeWorkshop.initialize());
document.addEventListener('openForgeWorkshop', () => window.forgeWorkshop.open());