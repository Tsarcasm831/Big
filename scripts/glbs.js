// glbs.js
(function() {
    // List of GLB URLs to preload
    // To add more files, simply append new URLs to this array
    const glbUrls = [
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/anthromorph.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/avianos.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/behemoth.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/chiropteran.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/dengar.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/dengar_charger.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/kilrathi.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/shalrah_prime.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/vyraxus.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/talorian.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/tana_rhe.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/tal_ehn.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/xithrian.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/diamond.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/diamond_dancer.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/james.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/katia_f.glb',
      'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/oldman.glb',
      // Local Xris models - we add multiple to ensure at least one loads properly
      './home/assets/Xris/biped/Animation_Idle_withSkin.glb',
      './home/assets/Xris/biped/Animation_Stand_and_Chat_withSkin.glb',
      './home/assets/Xris/biped/Animation_Alert_withSkin.glb'
    ];
  
    // Initialize the GLTFLoader from Three.js
    // Make sure THREE is defined before trying to use it
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        
        // Add DRACOLoader to handle compressed models
        if (typeof THREE.DRACOLoader !== 'undefined') {
            try {
                const dracoLoader = new THREE.DRACOLoader();
                // Set the path to the Draco decoder
                dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
                // Optional: set decoder config
                dracoLoader.setDecoderConfig({ type: 'js' });
                // Attach the Draco loader to the GLTF loader
                loader.setDRACOLoader(dracoLoader);
                console.log('DRACOLoader initialized for compressed models');
            } catch (e) {
                console.error('Failed to initialize DRACOLoader:', e);
            }
        } else {
            console.warn('THREE.DRACOLoader is not available. Compressed models may not load correctly.');
        }
        
        // Object to cache the loaded GLB models
        const cache = {};
      
        // Preload each GLB file
        glbUrls.forEach(url => {
          loader.load(
            url,
            (gltf) => {
              // Extract the model name from the URL (e.g., 'anthromorph' from 'anthromorph.glb')
              const name = url.split('/').pop().replace('.glb', '');
              // Store the loaded gltf object in the cache
              cache[name] = gltf;
              console.log(`Loaded ${name}`);
            },
            undefined, // Progress callback (optional, omitted here)
            (error) => {
              // Handle any loading errors
              console.error(`Error loading ${url}:`, error);
            }
          );
        });
      
        // Expose a function to retrieve a cached GLB by name
        window.getGLB = function(name) {
          if (cache[name]) {
            return cache[name];
          } else {
            console.warn(`GLB ${name} not found or not loaded yet`);
            return null;
          }
        };
    } else {
        console.error('THREE.js or THREE.GLTFLoader is not available. Make sure the scripts are loaded correctly.');
        // Provide a fallback getGLB function that always returns null
        window.getGLB = function(name) {
            console.warn(`THREE.js not available, cannot load GLB models`);
            return null;
        };
    }
})();