function initHomeScene() {
  console.log('homeScene.js is running');

  const canvas = document.getElementById('three-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  console.log('Renderer size set to', canvas.clientWidth, canvas.clientHeight);

  // Position the camera slightly above the ground
  camera.position.set(0, 2, 10);

  // Ground with better material
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Buildings with enhanced visuals
  function createBuilding(x, z, width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x - 5, height / 2, z - 5); // Adjusted positions to be closer to camera
    scene.add(building);
    return building;
  }

  const buildings = {
    house: createBuilding(2, 2, 1, 1, 1, 0x8b4513),
    spider: createBuilding(4, 2, 1, 1, 1, 0x8b4513),
    question: createBuilding(6, 2, 1, 1, 1, 0x555555),
    waterDrop: createBuilding(2, 4, 1, 1, 1, 0x555555),
    school: createBuilding(4, 4, 1, 1, 1, 0x8b4513),
    burger: createBuilding(6, 4, 1, 1, 1, 0x8b4513),
    wrench: createBuilding(6, 6, 1, 1, 1, 0x555555),
    shirt: createBuilding(4, 6, 1, 1, 1, 0x8b4513),
    hospital: createBuilding(4.5, 8.5, 2, 2, 2, 0x555555),
    cluster1: createBuilding(1, 7, 1, 1, 1, 0x8b4513),
    cluster2: createBuilding(2, 7, 1, 1, 1, 0x8b4513),
    cluster3: createBuilding(3, 7, 1, 1, 1, 0x8b4513),
    cluster4: createBuilding(1, 8, 1, 1, 1, 0x8b4513),
    cluster5: createBuilding(2, 8, 1, 1, 1, 0x8b4513),
    checkered: createBuilding(6.5, 7.5, 2, 0.1, 2, 0x8b4513)
  };

  // Improved lighting
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, -5);
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Simple sky color instead of skybox to avoid texture dimension issues
  scene.background = new THREE.Color(0x87CEEB); // Light sky blue
  
  // Add fog for depth effect
  scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);

  // First-person controls
  const controls = new THREE.PointerLockControls(camera, canvas);
  
  // Make controls accessible globally so we can unlock it when closing
  window.homeSceneControls = controls;
  
  // Add error handling for pointer lock
  function onPointerLockError(event) {
    console.warn('Pointer lock error:', event);
  }
  
  // Only attempt to lock if the canvas is visible and in the DOM
  function attemptPointerLock() {
    if (document.contains(canvas) && 
        canvas.offsetWidth > 0 && 
        canvas.offsetHeight > 0) {
      controls.lock();
    }
  }
  
  // Setup pointer lock event listeners
  document.addEventListener('click', (event) => {
    // Only lock when clicking directly on the canvas
    if (event.target === canvas) {
      attemptPointerLock();
    }
  });
  
  document.addEventListener('pointerlockchange', () => {
    console.log('Pointer lock state changed');
  });
  
  document.addEventListener('pointerlockerror', onPointerLockError);

  const moveSpeed = 0.1;
  const keys = { w: false, a: false, s: false, d: false };

  document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key.toLowerCase())) keys[event.key.toLowerCase()] = true;
  });
  document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key.toLowerCase())) keys[event.key.toLowerCase()] = false;
  });

  function updateMovement() {
    if (keys.w) controls.moveForward(moveSpeed);
    if (keys.s) controls.moveForward(-moveSpeed);
    if (keys.a) controls.moveRight(-moveSpeed);
    if (keys.d) controls.moveRight(moveSpeed);
  }

  // Building interaction with raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('mousedown', (event) => {
    if (!controls.isLocked) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(buildings));
    if (intersects.length > 0) {
      const selected = intersects[0].object;
      if (selected === buildings.house) alert('House selected!');
      else if (selected === buildings.spider) alert('Spider building selected!');
      else if (selected === buildings.question) alert('Mystery building selected!');
      else if (selected === buildings.waterDrop) alert('Water facility selected!');
      else if (selected === buildings.school) alert('School selected!');
      else if (selected === buildings.burger) alert('Burger joint selected!');
      else if (selected === buildings.wrench) alert('Repair shop selected!');
      else if (selected === buildings.shirt) alert('Clothing store selected!');
      else if (selected === buildings.hospital) alert('Hospital selected!');
      else if ([buildings.cluster1, buildings.cluster2, buildings.cluster3, buildings.cluster4, buildings.cluster5].includes(selected)) alert('Residential building selected!');
      else if (selected === buildings.checkered) alert('Checkered plaza selected!');
    }
  });

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
  }
  animate();

  console.log('Scene setup complete, children:', scene.children.length);
}

// Expose the function globally
window.initHomeScene = initHomeScene;