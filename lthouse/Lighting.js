/**
 * Lighting.js
 * 
 * Sets up and manages all lighting, including ambient light, fireplace light, chandelier light, 
 * and the fireplace flicker effect.
 * Controls dynamic lighting effects and shadows throughout the scene.
 */
import * as THREE from 'three';

class Lighting {
    constructor(scene) {
        this.scene = scene;
        this.ambientLight = null;
        this.fireplaceLight = null;
        this.chandelierLight = null;
        this.wallLights = [];
        this.domeLight = null;
        // New properties for light toggling and default intensities
        this.fillLight = null;
        this.lightsAreOn = true;
        this.ambientDefault = 2.0;
        this.chandelierDefault = 0.8;
        this.domeDefault = 1.5;
        this.fillDefault = 0.4;
        this.wallLightDefault = 0.7;
        this.fireplaceIntensity = 1.0;
        this.paused = false;
    }

    setupLights() {
        // Ambient light (significantly brighter for better visibility)
        this.ambientLight = new THREE.AmbientLight(0x777777, 2.0);
        this.scene.add(this.ambientLight);

        // Fireplace light - position it deeper within the fireplace
        this.fireplaceLight = new THREE.PointLight(0xff6400, 2.0, 15);
        this.fireplaceLight.position.set(4.6, 1.2, 0);
        this.fireplaceLight.castShadow = true;
        this.fireplaceLight.shadow.bias = -0.001;
        this.fireplaceLight.shadow.mapSize.width = 1024;
        this.fireplaceLight.shadow.mapSize.height = 1024;
        this.scene.add(this.fireplaceLight);

        // Ceiling candle light (brighter)
        this.chandelierLight = new THREE.PointLight(parseInt('DDC999', 16), 0.8, 20);
        this.chandelierLight.position.set(0, 4, 0);
        this.chandelierLight.castShadow = true;
        this.scene.add(this.chandelierLight);
        
        // Add central dome light
        this.domeLight = new THREE.PointLight(0xFFFFFF, 1.5, 15);
        this.domeLight.position.set(0, 4.5, 0);
        this.domeLight.castShadow = true;
        this.domeLight.shadow.bias = -0.001;
        this.domeLight.shadow.mapSize.width = 1024;
        this.domeLight.shadow.mapSize.height = 1024;
        this.scene.add(this.domeLight);
        
        // Add an additional soft light for better visibility
        const fillLight = new THREE.PointLight(0xEEEEFF, 0.4, 25);
        fillLight.position.set(-3, 3, -3);
        this.scene.add(fillLight);
        this.fillLight = fillLight;
        
        // Add wall lights
        this.createWallLights();
        
        // Create dome light fixture
        this.createDomeLightFixture();
    }
    
    createWallLights() {
        // Position coordinates for the three wall lights
        const wallLightPositions = [
            { x: -4.7, y: 2.5, z: -3, rotation: Math.PI/2 },  // West wall
            { x: 0, y: 3.0, z: -4.7, rotation: 0 },          // North wall - moved higher from 2.5 to 3.0
            { x: 4.7, y: 2.5, z: 3, rotation: -Math.PI/2 }   // East wall
        ];
        
        // Create each wall light
        wallLightPositions.forEach(position => {
            // Create light source
            const light = new THREE.PointLight(0xFFC680, 0.7, 5);
            light.position.set(position.x, position.y, position.z);
            light.castShadow = true;
            this.scene.add(light);
            this.wallLights.push(light);
            
            // Create wall light fixture
            this.createWallLightFixture(position.x, position.y, position.z, position.rotation);
        });
    }
    
    createWallLightFixture(x, y, z, rotation) {
        // Create a simple wall sconce model
        const baseGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.15);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3f35,
            roughness: 0.8,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, y, z);
        base.rotation.y = rotation;
        this.scene.add(base);
        
        // Light cone/shade
        const shadeGeometry = new THREE.ConeGeometry(0.12, 0.2, 8);
        const shadeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFF4E0,
            roughness: 0.4,
            metalness: 0.5,
            emissive: 0xFFC680,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        
        // Position shade based on the wall orientation
        const offsetX = Math.sin(rotation) * 0.15;
        const offsetZ = Math.cos(rotation) * 0.15;
        
        shade.position.set(x + offsetX, y, z + offsetZ);
        shade.rotation.x = Math.PI/2;
        shade.rotation.y = rotation;
        this.scene.add(shade);
    }

    createDomeLightFixture() {
        // Create dome fixture
        const domeGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xFFFAF0,
            roughness: 0.2,
            metalness: 0.7,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.set(0, 4.98, 0);
        dome.rotation.x = Math.PI;
        this.scene.add(dome);
        
        // Create a light switch on the wall next to the door
        this.createLightSwitch(1.2, 1.5, -4.9);
    }
    
    createLightSwitch(x, y, z) {
        // Create switch base
        const baseGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.7,
            metalness: 0.3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(x, y, z);
        this.scene.add(base);
        
        // Make light switch interactable with toggling all lights (except the fireplace)
        base.userData = {
            interactable: true,
            type: 'lightSwitch',
            interaction: () => {
                if (this.lightsAreOn) {
                    if (this.ambientLight) this.ambientLight.intensity = 0;
                    if (this.chandelierLight) this.chandelierLight.intensity = 0;
                    if (this.domeLight) this.domeLight.intensity = 0;
                    if (this.fillLight) this.fillLight.intensity = 0;
                    this.wallLights.forEach(light => light.intensity = 0);
                    this.lightsAreOn = false;
                    if (this.scene.userData.game) {
                        this.scene.userData.game.showSarcasmMessage('Now the room glows only with the eerie flicker of the fireplace.');
                    }
                } else {
                    if (this.ambientLight) this.ambientLight.intensity = this.ambientDefault;
                    if (this.chandelierLight) this.chandelierLight.intensity = this.chandelierDefault;
                    if (this.domeLight) this.domeLight.intensity = this.domeDefault;
                    if (this.fillLight) this.fillLight.intensity = this.fillDefault;
                    this.wallLights.forEach(light => light.intensity = this.wallLightDefault);
                    this.lightsAreOn = true;
                    if (this.scene.userData.game) {
                        this.scene.userData.game.showSarcasmMessage('Let there be light... aside from that damn fireplace.');
                    }
                }
            }
        };
        
        return base;
    }

    fireplaceFlicker() {
        // Random flicker effect for fireplace with improved variation
        const flicker = () => {
            if (!this.paused) {
                // Create more dramatic and varied flickering
                const time = performance.now() * 0.001;
                const noise = Math.sin(time * 2) * 0.1 + Math.sin(time * 5) * 0.05;
                this.fireplaceIntensity = 0.8 + Math.random() * 0.3 + noise;

                // Change light color slightly
                const hue = 0.05 + Math.random() * 0.02; // orange-yellow variation
                const saturation = 0.7 + Math.random() * 0.3;
                this.fireplaceLight.color.setHSL(hue, saturation, 0.5);

                this.fireplaceLight.intensity = this.fireplaceIntensity;
            }
            setTimeout(flicker, 80 + Math.random() * 120);
        };
        flicker();
    }

    setPaused(paused) {
        this.paused = paused;
    }
}

export { Lighting };