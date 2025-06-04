import * as THREE from 'three';

export function createSatelliteArray() {
  const arrayGroup = new THREE.Group();
  
  // Central hub
  const hubGeometry = new THREE.SphereGeometry(1, 24, 24);
  const hubMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.6,
    emissive: 0x00ff9d,
    emissiveIntensity: 0.3
  });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  arrayGroup.add(hub);
  
  // Hub details - add a band around the equator
  const bandGeometry = new THREE.TorusGeometry(1.02, 0.05, 8, 48);
  const bandMaterial = new THREE.MeshPhongMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00aaff,
    emissiveIntensity: 0.3
  });
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.rotation.x = Math.PI/2;
  arrayGroup.add(band);

  // Add surface details to hub
  const detailsGroup = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const size = 0.05 + Math.random() * 0.1;
    const detailGeometry = new THREE.BoxGeometry(size, size, 0.05);
    const detailMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ddaa,
      transparent: true,
      opacity: 0.8
    });
    const detail = new THREE.Mesh(detailGeometry, detailMaterial);
    
    // Random position on sphere
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    detail.position.set(
      Math.sin(phi) * Math.cos(theta) * 1.02,
      Math.sin(phi) * Math.sin(theta) * 1.02,
      Math.cos(phi) * 1.02
    );
    
    // Orient normal to sphere
    detail.lookAt(0, 0, 0);
    detailsGroup.add(detail);
  }
  arrayGroup.add(detailsGroup);
  
  // Satellite dishes
  const dishGeometry = new THREE.SphereGeometry(0.8, 24, 24, 0, Math.PI);
  const dishMaterial = new THREE.MeshPhongMaterial({
    color: 0xaaffee,
    transparent: true,
    opacity: 0.5,
    emissive: 0xaaffee,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide
  });
  
  // Add more detailed dishes
  for (let i = 0; i < 6; i++) {
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    const angle = (i / 6) * Math.PI * 2;
    const elevation = (i % 2 === 0) ? 0.5 : -0.5; // Alternate elevation
    dish.position.set(
      Math.sin(angle) * 3, 
      elevation,
      Math.cos(angle) * 3
    );
    dish.lookAt(0, 0, 0);
    dish.rotation.y = Math.PI;
    arrayGroup.add(dish);
    
    // Add dish frame
    const frameGeometry = new THREE.TorusGeometry(0.8, 0.04, 8, 32, Math.PI);
    const frameMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffdd,
      transparent: true,
      opacity: 0.8
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.copy(dish.position);
    frame.rotation.copy(dish.rotation);
    frame.rotation.z = Math.PI/2;
    arrayGroup.add(frame);
    
    // Add connecting struts
    const strutGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const strutMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.7
    });
    const strut = new THREE.Mesh(strutGeometry, strutMaterial);
    strut.position.set(
      Math.sin(angle) * 1.5, 
      elevation/2,
      Math.cos(angle) * 1.5
    );
    // Rotate to point from center to dish
    strut.lookAt(dish.position);
    strut.rotateX(Math.PI/2);
    arrayGroup.add(strut);
    
    // Add support beams between dishes
    if (i > 0) {
      const prevAngle = ((i-1) / 6) * Math.PI * 2;
      const prevElevation = ((i-1) % 2 === 0) ? 0.5 : -0.5;
      
      const supportPoints = [];
      supportPoints.push(new THREE.Vector3(
        Math.sin(angle) * 3, 
        elevation,
        Math.cos(angle) * 3
      ));
      supportPoints.push(new THREE.Vector3(
        Math.sin(prevAngle) * 3, 
        prevElevation,
        Math.cos(prevAngle) * 3
      ));
      
      const supportGeometry = new THREE.BufferGeometry().setFromPoints(supportPoints);
      const supportMaterial = new THREE.LineBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.5
      });
      const support = new THREE.Line(supportGeometry, supportMaterial);
      arrayGroup.add(support);
    }
  }
  
  // Add multiple rings
  const ringGeometries = [
    new THREE.TorusGeometry(2, 0.1, 16, 100),
    new THREE.TorusGeometry(2.5, 0.05, 16, 100),
    new THREE.TorusGeometry(3.2, 0.08, 16, 100)
  ];
  
  const ringMaterials = [
    new THREE.MeshPhongMaterial({
      color: 0x00ffdd,
      transparent: true,
      opacity: 0.3,
      emissive: 0x00ffdd,
      emissiveIntensity: 0.2
    }),
    new THREE.MeshPhongMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.2,
      emissive: 0x00ddff,
      emissiveIntensity: 0.1
    }),
    new THREE.MeshPhongMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0.25,
      emissive: 0x00ffaa,
      emissiveIntensity: 0.15
    })
  ];
  
  ringGeometries.forEach((geometry, i) => {
    const ring = new THREE.Mesh(geometry, ringMaterials[i]);
    ring.rotation.x = Math.PI/2;
    // Add slight tilt to each ring
    ring.rotation.y = Math.PI * 0.1 * i;
    arrayGroup.add(ring);
  });
  
  // Add central energy core
  const coreGeometry = new THREE.IcosahedronGeometry(0.5, 1);
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  arrayGroup.add(core);
  
  // Add data transmission beams
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 8, 8);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2
    });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.position.set(
      Math.sin(angle) * 4,
      0,
      Math.cos(angle) * 4
    );
    beam.rotation.z = Math.PI/2;
    beam.rotation.y = angle;
    arrayGroup.add(beam);
  }
  
  return arrayGroup;
}