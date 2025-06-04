import * as THREE from 'three';

export function createFarhavenBase() {
  const baseGroup = new THREE.Group();
  
  // Calculate dimensions in 3D units (scaled)
  const width = 4; // 1/4 mile equivalent
  const length = 8; // 1/2 mile equivalent 
  const wallHeight = 0.6;
  
  // Create the base platform with enhanced visuals
  const platformGeometry = new THREE.PlaneGeometry(width, length, 32, 64);
  const platformMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    wireframe: false,
    emissive: 0x222222,
    emissiveIntensity: 0.2,
    shininess: 30
  });
  
  // Add terrain height variation
  const vertices = platformGeometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    // Skip the edges to keep the perimeter flat
    const x = vertices[i];
    const z = vertices[i+2];
    if (Math.abs(x) < width/2 - 0.3 && Math.abs(z) < length/2 - 0.3) {
      // Apply noise-based height variation
      vertices[i+1] = (Math.sin(x * 5) * Math.cos(z * 3) * 0.03) + 
                      (Math.cos(x * 8) * Math.sin(z * 8) * 0.02);
    }
  }
  platformGeometry.computeVertexNormals();
  
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  baseGroup.add(platform);
  
  // Add grid lines to platform with glowing effect
  const gridHelper = new THREE.GridHelper(Math.max(width, length), 20);
  gridHelper.position.y = 0.01; // Slightly above the platform
  gridHelper.material.opacity = 0.4;
  gridHelper.material.transparent = true;
  gridHelper.material.color.set(0x00ff9d);
  baseGroup.add(gridHelper);
  
  // Add perimeter scanner effect - a moving line
  const scannerGeometry = new THREE.PlaneGeometry(width-0.1, 0.05);
  const scannerMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
  scanner.rotation.x = -Math.PI / 2;
  scanner.position.y = 0.02;
  scanner.position.z = -length/2 + 0.5;
  baseGroup.add(scanner);
  
  // Animate the scanner
  const animateScanner = () => {
    scanner.position.z += 0.03;
    if (scanner.position.z > length/2 - 0.5) {
      scanner.position.z = -length/2 + 0.5;
    }
    requestAnimationFrame(animateScanner);
  };
  animateScanner();
  
  // Create enhanced walls with force field effect
  const wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.5,
    emissive: 0x00ff9d,
    emissiveIntensity: 0.2,
    shininess: 90
  });
  
  // North wall with shield effect
  const northWallGeometry = new THREE.BoxGeometry(width, wallHeight, 0.05);
  const northWall = new THREE.Mesh(northWallGeometry, wallMaterial);
  northWall.position.set(0, wallHeight/2, -length/2);
  baseGroup.add(northWall);
  
  // Add shield effect overlay to north wall
  const northShieldGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const northShieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const northShield = new THREE.Mesh(northShieldGeometry, northShieldMaterial);
  northShield.position.set(0, wallHeight/2, -length/2 + 0.03);
  northShield.userData.pulseDirection = 1;
  baseGroup.add(northShield);
  
  // South wall with same shield effect
  const southWallGeometry = new THREE.BoxGeometry(width, wallHeight, 0.05);
  const southWall = new THREE.Mesh(southWallGeometry, wallMaterial);
  southWall.position.set(0, wallHeight/2, length/2);
  baseGroup.add(southWall);
  
  const southShieldGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const southShieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const southShield = new THREE.Mesh(southShieldGeometry, southShieldMaterial);
  southShield.position.set(0, wallHeight/2, length/2 - 0.03);
  southShield.userData.pulseDirection = 1;
  baseGroup.add(southShield);
  
  // East and West walls with shields
  const eastWallGeometry = new THREE.BoxGeometry(0.05, wallHeight, length);
  const eastWall = new THREE.Mesh(eastWallGeometry, wallMaterial);
  eastWall.position.set(width/2, wallHeight/2, 0);
  baseGroup.add(eastWall);
  
  const eastShieldGeometry = new THREE.PlaneGeometry(length, wallHeight);
  const eastShieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const eastShield = new THREE.Mesh(eastShieldGeometry, eastShieldMaterial);
  eastShield.position.set(width/2 - 0.03, wallHeight/2, 0);
  eastShield.rotation.y = Math.PI / 2;
  eastShield.userData.pulseDirection = 1;
  baseGroup.add(eastShield);
  
  const westWallGeometry = new THREE.BoxGeometry(0.05, wallHeight, length);
  const westWall = new THREE.Mesh(westWallGeometry, wallMaterial);
  westWall.position.set(-width/2, wallHeight/2, 0);
  baseGroup.add(westWall);
  
  const westShieldGeometry = new THREE.PlaneGeometry(length, wallHeight);
  const westShieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const westShield = new THREE.Mesh(westShieldGeometry, westShieldMaterial);
  westShield.position.set(-width/2 + 0.03, wallHeight/2, 0);
  westShield.rotation.y = Math.PI / 2;
  westShield.userData.pulseDirection = 1;
  baseGroup.add(westShield);
  
  // Animate shield pulsing
  const animateShields = () => {
    const shields = [northShield, southShield, eastShield, westShield];
    shields.forEach(shield => {
      shield.material.opacity += 0.005 * shield.userData.pulseDirection;
      if (shield.material.opacity > 0.4) {
        shield.userData.pulseDirection = -1;
      } else if (shield.material.opacity < 0.1) {
        shield.userData.pulseDirection = 1;
      }
    });
    requestAnimationFrame(animateShields);
  };
  animateShields();
  
  // Enhanced corner towers with energy effects
  const towerGeometry = new THREE.CylinderGeometry(0.3, 0.3, wallHeight * 1.5, 16);
  const towerMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ddaa,
    transparent: true,
    opacity: 0.6,
    emissive: 0x00ddaa,
    emissiveIntensity: 0.3,
    shininess: 80
  });
  
  // Add enhanced towers at each corner
  const cornerPositions = [
    [-width/2, 0, -length/2], // Northwest
    [width/2, 0, -length/2],  // Northeast
    [width/2, 0, length/2],   // Southeast
    [-width/2, 0, length/2]   // Southwest
  ];
  
  cornerPositions.forEach((pos, index) => {
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(pos[0], wallHeight * 0.75, pos[2]);
    baseGroup.add(tower);
    
    // Add energy beam from towers
    const beamGeometry = new THREE.CylinderGeometry(0.05, 0.02, 3, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(pos[0], wallHeight * 1.5 + 1.5, pos[2]);
    
    // Different angles for each tower
    if (index === 0) beam.rotation.x = Math.PI / 4;
    if (index === 1) beam.rotation.z = -Math.PI / 4;
    if (index === 2) beam.rotation.x = -Math.PI / 4;
    if (index === 3) beam.rotation.z = Math.PI / 4;
    
    baseGroup.add(beam);
    
    // Add pulsing light on top of each tower
    const lightGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      emissive: 0xff3300,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.9
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(pos[0], wallHeight * 1.5, pos[2]);
    light.userData = { pulseDirection: 1, initialScale: 1 };
    baseGroup.add(light);
    
    // Animate tower lights
    const animateLight = () => {
      light.scale.x = light.scale.y = light.scale.z = 
        light.userData.initialScale + Math.sin(Date.now() * 0.005) * 0.2;
      
      light.material.opacity = 0.7 + Math.sin(Date.now() * 0.003) * 0.3;
      
      requestAnimationFrame(animateLight);
    };
    animateLight();
  });
  
  // Add holographic gate with energy field
  const gateWidth = 1;
  const gateHeight = wallHeight * 0.7;
  
  // Create gate frame
  const gateFrameGeometry = new THREE.BoxGeometry(gateWidth + 0.2, gateHeight + 0.2, 0.1);
  const gateFrameMaterial = new THREE.MeshPhongMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.7,
    emissive: 0xffcc00,
    emissiveIntensity: 0.3
  });
  const gateFrame = new THREE.Mesh(gateFrameGeometry, gateFrameMaterial);
  gateFrame.position.set(0, gateHeight/2, length/2);
  baseGroup.add(gateFrame);
  
  // Add energy gate field
  const gateGeometry = new THREE.PlaneGeometry(gateWidth, gateHeight, 16, 16);
  const gateMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const gate = new THREE.Mesh(gateGeometry, gateMaterial);
  gate.position.set(0, gateHeight/2, length/2);
  
  // Add displacement to energy field
  const animateGate = () => {
    const positions = gateGeometry.attributes.position.array;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Skip edges
      const x = positions[i];
      const y = positions[i+1];
      
      if (Math.abs(x) < gateWidth/2 - 0.1 && Math.abs(y) < gateHeight/2 - 0.1) {
        positions[i+2] = Math.sin(x * 10 + time) * Math.cos(y * 10 + time) * 0.05;
      }
    }
    
    gateGeometry.attributes.position.needsUpdate = true;
    gate.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
    
    requestAnimationFrame(animateGate);
  };
  animateGate();
  
  baseGroup.add(gate);
  
  // Add futuristic buildings inside the base
  const buildingCount = 12;
  const buildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.7,
    emissive: 0x0055aa,
    emissiveIntensity: 0.3,
    shininess: 70
  });
  
  for (let i = 0; i < buildingCount; i++) {
    // Random position within walls
    const posX = (Math.random() * (width - 1)) - (width/2 - 0.5);
    const posZ = (Math.random() * (length - 1)) - (length/2 - 0.5);
    
    // Random building height and size
    const buildingHeight = 0.3 + Math.random() * 0.8;
    const buildingWidth = 0.3 + Math.random() * 0.5;
    const buildingLength = 0.3 + Math.random() * 0.5;
    
    // Different building shapes
    let buildingGeometry;
    const buildingType = Math.floor(Math.random() * 4);
    
    if (buildingType === 0) {
      // Dome building
      buildingGeometry = new THREE.SphereGeometry(
        Math.max(buildingWidth, buildingLength) * 0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2
      );
      buildingGeometry.scale(1, buildingHeight * 1.5, 1);
    } else if (buildingType === 1) {
      // Pyramid building
      buildingGeometry = new THREE.ConeGeometry(
        Math.max(buildingWidth, buildingLength) * 0.6, buildingHeight, 4
      );
    } else if (buildingType === 2) {
      // Cylindrical building
      buildingGeometry = new THREE.CylinderGeometry(
        buildingWidth * 0.6, buildingWidth * 0.7, buildingHeight, 12
      );
    } else {
      // Box building
      buildingGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingLength);
    }
    
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    
    // Special positioning for dome buildings
    if (buildingType === 0) {
      building.position.set(posX, 0, posZ);
    } else {
      building.position.set(posX, buildingHeight/2, posZ);
    }
    
    // Random rotation for variety
    building.rotation.y = Math.random() * Math.PI * 2;
    
    baseGroup.add(building);
    
    // Add light to building
    if (Math.random() > 0.5) {
      const windowGeometry = new THREE.PlaneGeometry(0.1, 0.1);
      const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      
      const windowLight = new THREE.Mesh(windowGeometry, windowMaterial);
      const height = Math.random() * buildingHeight * 0.6 + buildingHeight * 0.3;
      windowLight.position.set(
        posX + Math.sin(building.rotation.y) * buildingWidth * 0.6, 
        height, 
        posZ + Math.cos(building.rotation.y) * buildingLength * 0.6
      );
      windowLight.lookAt(windowLight.position.x * 2, windowLight.position.y, windowLight.position.z * 2);
      
      baseGroup.add(windowLight);
    }
  }
  
  // Enhanced command center with holographic effects
  const commandGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
  const commandMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.8,
    emissive: 0x00ff9d,
    emissiveIntensity: 0.4,
    shininess: 90
  });
  const commandCenter = new THREE.Mesh(commandGeometry, commandMaterial);
  commandCenter.position.set(0, 0.5, 0);
  baseGroup.add(commandCenter);
  
  // Add details to command center
  const detailGeometry = new THREE.BoxGeometry(1.6, 0.1, 1.6);
  const detailMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00aaff,
    emissiveIntensity: 0.3
  });
  const detail = new THREE.Mesh(detailGeometry, detailMaterial);
  detail.position.set(0, 1.05, 0);
  baseGroup.add(detail);
  
  // Add holographic projection above command center
  const holoGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const holoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.4,
    wireframe: true
  });
  const hologram = new THREE.Mesh(holoGeometry, holoMaterial);
  hologram.position.set(0, 1.7, 0);
  baseGroup.add(hologram);
  
  // Animate hologram
  const animateHologram = () => {
    hologram.rotation.y += 0.01;
    hologram.rotation.x += 0.005;
    
    const time = Date.now() * 0.001;
    hologram.scale.x = hologram.scale.y = hologram.scale.z = 
      1 + Math.sin(time) * 0.1;
    
    hologram.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1;
    
    requestAnimationFrame(animateHologram);
  };
  animateHologram();
  
  // Add communication antenna on top of command center
  const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  const antenna = new THREE.Mesh(antennaGeometry, detailMaterial);
  antenna.position.set(0, 1.75, 0);
  baseGroup.add(antenna);
  
  // Add a dish at the top of the antenna
  const dishGeometry = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI);
  const dishMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaffee,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    emissive: 0x00aaff,
    emissiveIntensity: 0.3
  });
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.position.set(0, 2.5, 0);
  dish.rotation.x = Math.PI/2;
  baseGroup.add(dish);
  
  // Add energy beam from dish
  const beamGeometry = new THREE.CylinderGeometry(0.03, 0.01, 3, 8);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.set(0, 4, 0);
  baseGroup.add(beam);
  
  // Animate the beam
  const animateBeam = () => {
    beam.rotation.y += 0.01;
    beam.material.opacity = 0.3 + Math.sin(Date.now() * 0.002) * 0.2;
    requestAnimationFrame(animateBeam);
  };
  animateBeam();
  
  return baseGroup;
}