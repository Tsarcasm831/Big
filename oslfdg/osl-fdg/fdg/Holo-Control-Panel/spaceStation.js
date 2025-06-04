import * as THREE from 'three';

export function createSpaceStation() {
  const stationGroup = new THREE.Group();
  
  // Core cube with more detailed geometry
  const coreGeometry = new THREE.BoxGeometry(2, 2, 2);
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.5,
    wireframe: false,
    emissive: 0x00ff9d,
    emissiveIntensity: 0.3
  });
  const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
  const coreLine = new THREE.LineSegments(coreWireframe);
  coreLine.material.color = new THREE.Color(0x00ff9d);
  coreLine.material.transparent = true;
  coreLine.material.opacity = 0.8;
  
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  stationGroup.add(core);
  stationGroup.add(coreLine);
  
  // Add control room sphere at the top of the core
  const controlRoomGeometry = new THREE.SphereGeometry(0.6, 24, 24);
  const controlRoomMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00ffcc,
    emissiveIntensity: 0.4
  });
  const controlRoom = new THREE.Mesh(controlRoomGeometry, controlRoomMaterial);
  controlRoom.position.set(0, 1.5, 0);
  stationGroup.add(controlRoom);
  
  // Add modules around the core
  const modulePositions = [
    [2, 0, 0], [-2, 0, 0], [0, 2, 0], 
    [0, -2, 0], [0, 0, 2], [0, 0, -2],
    [1.5, 1.5, 1.5], [-1.5, -1.5, -1.5] // Additional diagonal modules
  ];
  
  modulePositions.forEach((pos, index) => {
    // Alternate between box and cylinder modules for variety
    let moduleGeometry;
    if (index % 2 === 0) {
      const size = 1 + Math.random() * 0.5;
      moduleGeometry = new THREE.BoxGeometry(size, size, size);
    } else {
      moduleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    }
    
    const moduleMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.5,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.3
    });
    
    const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
    module.position.set(pos[0], pos[1], pos[2]);
    
    // Orient cylinders correctly
    if (index % 2 !== 0) {
      if (pos[0] !== 0) module.rotation.z = Math.PI/2;
      if (pos[1] !== 0) module.rotation.x = Math.PI/2;
    }
    
    const moduleWireframe = new THREE.WireframeGeometry(moduleGeometry);
    const moduleLine = new THREE.LineSegments(moduleWireframe);
    moduleLine.material.color = new THREE.Color(0x00ff9d);
    moduleLine.material.transparent = true;
    moduleLine.material.opacity = 0.8;
    moduleLine.position.set(pos[0], pos[1], pos[2]);
    
    // Apply the same rotation to wireframe
    if (index % 2 !== 0) {
      if (pos[0] !== 0) moduleLine.rotation.z = Math.PI/2;
      if (pos[1] !== 0) moduleLine.rotation.x = Math.PI/2;
    }
    
    stationGroup.add(module);
    stationGroup.add(moduleLine);
  });
  
  // Add connecting lines between modules
  modulePositions.forEach(startPos => {
    modulePositions.forEach(endPos => {
      if (startPos !== endPos) {
        const distance = Math.sqrt(
          Math.pow(startPos[0] - endPos[0], 2) + 
          Math.pow(startPos[1] - endPos[1], 2) + 
          Math.pow(startPos[2] - endPos[2], 2)
        );
        
        // Only connect nearby modules
        if (distance < 3.5) {
          const points = [];
          points.push(new THREE.Vector3(startPos[0], startPos[1], startPos[2]));
          points.push(new THREE.Vector3(endPos[0], endPos[1], endPos[2]));
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff9d,
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          stationGroup.add(line);
        }
      }
    });
  });
  
  // Add solar panels
  const solarPanelGeometry = new THREE.BoxGeometry(4, 0.1, 1);
  const solarPanelMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.3,
    emissive: 0x00aaff,
    emissiveIntensity: 0.2
  });
  
  // Main solar panels on sides
  const solarPanel1 = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
  solarPanel1.position.set(4, 0, 0);
  stationGroup.add(solarPanel1);
  
  const solarPanel2 = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
  solarPanel2.position.set(-4, 0, 0);
  stationGroup.add(solarPanel2);
  
  // Add secondary solar panels
  const solarPanel3 = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
  solarPanel3.position.set(0, 0, 4);
  solarPanel3.rotation.y = Math.PI/2;
  stationGroup.add(solarPanel3);
  
  const solarPanel4 = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
  solarPanel4.position.set(0, 0, -4);
  solarPanel4.rotation.y = Math.PI/2;
  stationGroup.add(solarPanel4);
  
  // Add communication dish
  const dishGeometry = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI);
  const dishMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaffee,
    transparent: true,
    opacity: 0.5,
    emissive: 0xaaffee,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.position.set(0, 3, 0);
  dish.rotation.x = Math.PI/2;
  stationGroup.add(dish);
  
  // Add antenna array
  for (let i = 0; i < 4; i++) {
    const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const antenna = new THREE.Mesh(antennaGeometry, solarPanelMaterial);
    const angle = (i / 4) * Math.PI * 2;
    antenna.position.set(
      Math.sin(angle) * 0.5,
      3.5,
      Math.cos(angle) * 0.5
    );
    stationGroup.add(antenna);
  }
  
  // Add station propulsion engines
  for (let i = 0; i < 4; i++) {
    const engineGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.6,
      emissive: 0xff3300,
      emissiveIntensity: 0.5
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    const angle = (i / 4) * Math.PI * 2;
    engine.position.set(
      Math.sin(angle) * 1.5,
      -1.5,
      Math.cos(angle) * 1.5
    );
    engine.rotation.x = Math.PI/2;
    stationGroup.add(engine);
    
    // Add engine glow
    const glowGeometry = new THREE.ConeGeometry(0.4, 0.8, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(
      Math.sin(angle) * 1.5,
      -2.2,
      Math.cos(angle) * 1.5
    );
    glow.rotation.x = Math.PI/2;
    stationGroup.add(glow);
  }
  
  return stationGroup;
}