import * as THREE from 'three';

export function createPlanetaryBase() {
  const baseGroup = new THREE.Group();
  
  // Main dome with more detail
  const domeGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.4,
    emissive: 0x00ff9d,
    emissiveIntensity: 0.2
  });
  const dome = new THREE.Mesh(domeGeometry, domeMaterial);
  baseGroup.add(dome);
  
  // Dome structure ribs
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ribGeometry = new THREE.TorusGeometry(2, 0.05, 8, 32, Math.PI / 2);
    const ribMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aa77,
      transparent: true,
      opacity: 0.7
    });
    const rib = new THREE.Mesh(ribGeometry, ribMaterial);
    rib.rotation.y = angle;
    rib.rotation.x = -Math.PI / 2;
    baseGroup.add(rib);
  }
  
  // Circular ribs around dome
  for (let i = 1; i <= 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(2 * Math.sin(Math.PI/2 * (i/3)), 0.03, 8, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aa77,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 2 * Math.cos(Math.PI/2 * (i/3));
    ring.rotation.x = Math.PI/2;
    baseGroup.add(ring);
  }
  
  // Base platform
  const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.5, 32);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aa77,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00aa77,
    emissiveIntensity: 0.1
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.25;
  baseGroup.add(base);
  
  // Base detail rings
  const baseRingGeometry = new THREE.TorusGeometry(2.1, 0.05, 8, 32);
  const baseRing = new THREE.Mesh(baseRingGeometry, baseMaterial);
  baseRing.position.y = -0.25;
  baseRing.rotation.x = Math.PI/2;
  baseGroup.add(baseRing);
  
  // Add detailed towers
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const distance = 1.5;
    
    // Main tower structure
    const towerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
    const towerMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ddaa,
      transparent: true,
      opacity: 0.6
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(Math.sin(angle) * distance, 0.5, Math.cos(angle) * distance);
    baseGroup.add(tower);
    
    // Add tower details
    // Base platform for the tower
    const towerBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
    const towerBase = new THREE.Mesh(towerBaseGeometry, baseMaterial);
    towerBase.position.set(Math.sin(angle) * distance, -0.2, Math.cos(angle) * distance);
    baseGroup.add(towerBase);
    
    // Top section of tower
    const towerTopGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.2, 8);
    const towerTop = new THREE.Mesh(towerTopGeometry, towerMaterial);
    towerTop.position.set(Math.sin(angle) * distance, 1.3, Math.cos(angle) * distance);
    baseGroup.add(towerTop);
    
    // Different antenna types for variety
    if (i % 2 === 0) {
      // Pointed antenna
      const antennaGeometry = new THREE.ConeGeometry(0.1, 0.8, 8);
      const antenna = new THREE.Mesh(antennaGeometry, towerMaterial);
      antenna.position.set(Math.sin(angle) * distance, 1.8, Math.cos(angle) * distance);
      baseGroup.add(antenna);
      
      // Small sphere at tip
      const tipGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const tipMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
      });
      const tip = new THREE.Mesh(tipGeometry, tipMaterial);
      tip.position.set(Math.sin(angle) * distance, 2.2, Math.cos(angle) * distance);
      baseGroup.add(tip);
    } else {
      // Satellite dish antenna
      const dishGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI);
      const dishMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaffee,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const dish = new THREE.Mesh(dishGeometry, dishMaterial);
      dish.position.set(Math.sin(angle) * distance, 1.7, Math.cos(angle) * distance);
      // Point in random direction
      dish.rotation.set(
        Math.random() * Math.PI/2,
        Math.random() * Math.PI*2,
        0
      );
      baseGroup.add(dish);
    }
    
    // Add blinking lights
    const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(
      Math.sin(angle) * distance, 
      1.1,
      Math.cos(angle) * distance
    );
    baseGroup.add(light);
  }
  
  // Add landing pad
  const padGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 16);
  const padMaterial = new THREE.MeshPhongMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.5,
    emissive: 0xffcc00,
    emissiveIntensity: 0.3
  });
  const pad = new THREE.Mesh(padGeometry, padMaterial);
  pad.position.set(-3, 0, 0);
  baseGroup.add(pad);
  
  // Landing pad markings
  const markingsGeometry = new THREE.RingGeometry(0.6, 0.8, 16);
  const markingsMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5500,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
  markings.position.set(-3, 0.06, 0);
  markings.rotation.x = -Math.PI/2;
  baseGroup.add(markings);
  
  // Landing pad lights
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const lightGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.1);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.8
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(
      -3 + Math.sin(angle) * 0.95,
      0.07,
      Math.cos(angle) * 0.95
    );
    baseGroup.add(light);
  }
  
  // Add connecting walkways between main dome and landing pad
  const pathGeometry = new THREE.BoxGeometry(3, 0.1, 0.4);
  const pathMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aa77,
    transparent: true,
    opacity: 0.7
  });
  const path = new THREE.Mesh(pathGeometry, pathMaterial);
  path.position.set(-1.5, 0, 0);
  baseGroup.add(path);
  
  // Add support columns for walkway
  for (let i = 0; i < 3; i++) {
    const columnGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const column = new THREE.Mesh(columnGeometry, pathMaterial);
    column.position.set(-3 + i * 1.5, -0.2, 0);
    baseGroup.add(column);
  }
  
  // Small satellite dish on main dome
  const mainDishGeometry = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI);
  const mainDishMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaffee,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  const mainDish = new THREE.Mesh(mainDishGeometry, mainDishMaterial);
  mainDish.position.set(0, 2, 0);
  mainDish.rotation.x = -Math.PI/2;
  baseGroup.add(mainDish);
  
  // Terrain base with more detailed surface
  const terrainGeometry = new THREE.CylinderGeometry(6, 6, 0.1, 32);
  const terrainMaterial = new THREE.MeshPhongMaterial({
    color: 0x553311,
    transparent: true,
    opacity: 0.5
  });
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.position.y = -0.5;
  baseGroup.add(terrain);
  
  // Add terrain details - rocks, craters
  for (let i = 0; i < 30; i++) {
    const radius = Math.random() * 5 + 0.5;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    
    if (Math.sqrt(x*x + z*z) > 2) { // Don't place too close to center
      if (Math.random() > 0.7) {
        // Create rock
        const rockGeometry = new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.2, 0);
        const rockMaterial = new THREE.MeshPhongMaterial({
          color: 0x775533,
          transparent: true,
          opacity: 0.7
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, -0.4, z);
        rock.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        rock.scale.y = 0.7; // Flatten slightly
        baseGroup.add(rock);
      } else {
        // Create crater
        const craterGeometry = new THREE.CircleGeometry(0.1 + Math.random() * 0.3, 16);
        const craterMaterial = new THREE.MeshPhongMaterial({
          color: 0x442200,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        const crater = new THREE.Mesh(craterGeometry, craterMaterial);
        crater.position.set(x, -0.44, z);
        crater.rotation.x = -Math.PI/2;
        baseGroup.add(crater);
      }
    }
  }
  
  return baseGroup;
}