// glbsilluminator.js
// This script enhances lighting for all GLB models in the application

(function() {
    // Original THREE.Scene.add method reference
    const originalSceneAdd = THREE.Scene.prototype.add;

    // Override the Scene.add method to automatically enhance lighting for GLB models
    THREE.Scene.prototype.add = function(object) {
        // Call the original add method first
        const result = originalSceneAdd.call(this, object);

        // Check if this is a scene that contains a GLB model
        // We'll look for a scene that has just had a model added to it
        if (object && object.type === 'Group' && object.isObject3D) {
            // This is likely a GLB model being added to the scene
            enhanceLighting(this);
        }

        return result;
    };

    // Function to enhance lighting in a scene
    function enhanceLighting(scene) {
        // Remove any existing lights to avoid duplication
        const existingLights = scene.children.filter(child => 
            child instanceof THREE.Light
        );
        
        // Keep track of light types we've already added
        const lightTypes = {
            ambient: false,
            directional: false,
            hemisphere: false,
            point: []
        };
        
        // Check existing lights to avoid duplicates
        existingLights.forEach(light => {
            if (light instanceof THREE.AmbientLight) lightTypes.ambient = true;
            if (light instanceof THREE.DirectionalLight) lightTypes.directional = true;
            if (light instanceof THREE.HemisphereLight) lightTypes.hemisphere = true;
            if (light instanceof THREE.PointLight) lightTypes.point.push(light);
        });
        
        // Add enhanced ambient light if not already present
        if (!lightTypes.ambient) {
            const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Significantly increased intensity
            scene.add(ambientLight);
        }
        
        // Add hemisphere light if not already present (simulates sky and ground reflection)
        if (!lightTypes.hemisphere) {
            const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x404040, 1.0); // Increased intensity and lighter ground color
            scene.add(hemisphereLight);
        }
        
        // Add enhanced directional light if not already present
        if (!lightTypes.directional) {
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Significantly increased intensity
            directionalLight.position.set(5, 5, 5);
            
            // Add shadows for better depth perception
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            
            scene.add(directionalLight);
            
            // Add a second directional light from another angle for better coverage
            const secondaryDirLight = new THREE.DirectionalLight(0xffffff, 1.5);
            secondaryDirLight.position.set(-5, 3, 2);
            scene.add(secondaryDirLight);
        }
        
        // Add point lights for more dynamic lighting if not already present
        if (lightTypes.point.length < 3) {
            // Front light (brighter)
            const frontLight = new THREE.PointLight(0xffffff, 1.5);
            frontLight.position.set(0, 0, 5);
            scene.add(frontLight);
            
            // Back rim light for better silhouette (brighter)
            const backLight = new THREE.PointLight(0xddeeff, 1.2);
            backLight.position.set(-5, 5, -5);
            scene.add(backLight);
            
            // Bottom fill light to reduce harsh shadows
            const fillLight = new THREE.PointLight(0xffffee, 0.8);
            fillLight.position.set(0, -5, 0);
            scene.add(fillLight);
        }
    }

    // Global function to manually apply enhanced lighting to any scene
    window.enhanceGLBLighting = function(scene) {
        if (scene instanceof THREE.Scene) {
            enhanceLighting(scene);
            return true;
        }
        return false;
    };

    console.log('GLB Illuminator initialized - all 3D models will have enhanced lighting');
})();
