// Asset Loader and Cache Manager for Remnants of Destruction
const CACHE_NAME = 'rod-assets-v1';
const ASSET_BASE_URL = 'https://file.garden/Zy7B0LkdIVpGyzA1/assets';

// List of all assets from the file tree
const ASSETS = [
    // Root directory files
    'alex.png',
    'anthromorph.glb',
    'anthromorph2_nobg.png',
    'anthromorph3_nobg.png',
    'anthromorphs_nobg.png',
    'avianos.glb',
    'avianos_nobg.png',
    'behemoth.glb',
    'Behemoth_nobg.png',
    'blue_horse_nobg.png',
    'button-click.wav',
    'chiropteran.glb',
    'Chiropteran_nobg.png',
    'combat.png',
    'customize.png',
    'Dengar.glb',
    'dengar_charger.glb',
    'dengar_charger_nobg.png',
    'earth_texture.jpg',
    'equipment.png',
    'favicon.ico',
    'FDG_outpost_nobg.png',
    'grenade.png',
    'haywire.png',
    'jace.png',
    'katia.glb',
    'kilrathi.glb',
    'kilrathi.png',
    'light-em-up.png',
    'metal-clank.mp3',
    'missions.png',
    'nexus-logo.png',
    'noah.png',
    'no_bg_250303_122034.png',
    'no_bg_250303_122112.png',
    'overview.png',
    'player.png',
    'prometheus_outpost_nobg.png',
    'prosperity_nobg.png',
    'raider_outpost_nobg.png',
    'rank.png',
    'research-complete.wav',
    'scanning.png',
    'sci-fi-bg.png',
    'shalrah dengar_nobg.png',
    'shalrah prime_nobg.png',
    'shalrah_prime.glb',
    'shredder.png',
    'skillsandabilities.png',
    'smoke.png',
    'smoke.webp',
    'talehn.glb',
    'talehn.png',
    'talorian.glb',
    'talorian.png',
    'tanarhe.png',
    'tech-nexus-ambient.mp3',
    'training.png',
    't_ana_rhe.glb',
    'vyraxus.glb',
    'vyraxus_nobg.png',
    'white_horse_nobg.png',
    'xithrian.glb',
    'xithrian.png',
    'yellow_metal.webp',
    
    // Allies
    'Allies/alex.png',
    'Allies/Billy.png',
    'Allies/DALL·E 2025-03-17 07.56.14 - A full-body pixel art sprite of a former high-ranking officer from a strict military faction in a post-apocalyptic world. He is a hardened and imposin (2).png.png',
    'Allies/DALL·E 2025-03-17 07.56.14 - A full-body pixel art sprite of a former high-ranking officer from a strict military faction in a post-apocalyptic world. He is a hardened and imposin (3).png.png',
    'Allies/DALL·E 2025-03-17 08.15.00 - A full-body pixel art sprite of Spyder, a post-apocalyptic tech whiz. He has a wiry frame and an eccentric look, wearing a rugged, patched-up jacket w (1).png.png',
    'Allies/engineer.webp',
    'Allies/female_doctor1.webp',
    'Allies/Ivey.png',
    'Allies/Jace.png',
    'Allies/JohnReilly.png',
    'Allies/Kaanan.png',
    'Allies/male_doctor1.webp',
    'Allies/militia.webp',
    'Allies/Noah.png',
    'Allies/scout.webp',
    'Allies/settler.webp',
    'Allies/spyder.png',
    'Allies/t\'ana\'rhe.png',
    'Allies/t\'ana\'rhe2.png',
    'Allies/talehn.png',
    'Allies/xithrian.png',
    
    // Factions
    'Factions/anthromorph2_nobg.png',
    'Factions/anthromorph3_nobg.png',
    'Factions/anthromorphs_nobg.png',
    'Factions/avianos_nobg.png',
    'Factions/Behemoth_nobg.png',
    'Factions/Chiropteran_nobg.png',
    'Factions/dengar_charger_nobg.png',
    'Factions/fdgarchangel.webp',
    'Factions/fdgblackrose.webp',
    'Factions/fdgtrooper.webp',
    'Factions/fdgvalkyrie.webp',
    'Factions/fdgwarhawk.webp',
    'Factions/kilrathi.png',
    'Factions/no_bg_250303_122112.png',
    'Factions/shalrah dengar_nobg.png',
    'Factions/shalrah prime_nobg.png',
    'Factions/talorian.png',
    'Factions/tanarhe.png',
    'Factions/vyraxus_nobg.png',
    'Factions/xithrian.png',
    
    // Factions/FDG
    'Factions/FDG/archangel.webp',
    'Factions/FDG/black_rose.webp',
    'Factions/FDG/black_rose2.webp',
    'Factions/FDG/elite_trooper.webp',
    'Factions/FDG/officer.webp',
    'Factions/FDG/seraphim.webp',
    'Factions/FDG/trooper.webp',
    'Factions/FDG/trooper1.webp',
    'Factions/FDG/valkyrie.webp',
    'Factions/FDG/warhawk.webp',
    
    // Factions/HIVE
    'Factions/HIVE/drone.webp',
    'Factions/HIVE/infiltrator.webp',
    'Factions/HIVE/queen.webp',
    'Factions/HIVE/scout.webp',
    'Factions/HIVE/technician.webp',
    'Factions/HIVE/warrior.webp',
    
    // Factions/HIVE/Recon_scout/biped
    'Factions/HIVE/Recon_scout/biped/Animation_Alert_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Casual_Walk_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Formal_Bow_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Idle_03_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Running_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Run_02_withSkin.glb',
    'Factions/HIVE/Recon_scout/biped/Animation_Walking_withSkin.glb',
    
    // Factions/Mutants
    'Factions/Mutants/acid_spitter.webp',
    'Factions/Mutants/alpha.webp',
    'Factions/Mutants/berserker1.webp',
    'Factions/Mutants/Brute.webp',
    'Factions/Mutants/fleshwalker.webp',
    'Factions/Mutants/mutant_engineer.webp',
    'Factions/Mutants/stalker.webp',
    
    // Icons
    'icons/blue_horse_nobg.png',
    'icons/combat.png',
    'icons/combat.webp',
    'icons/customize.png',
    'icons/customize.webp',
    'icons/equipment.png',
    'icons/equipment.webp',
    'icons/favicon.ico',
    'icons/FDG_outpost_nobg.png',
    'icons/grenade.png',
    'icons/grenade.webp',
    'icons/haywire.png',
    'icons/haywire.webp',
    'icons/light-em-up.png',
    'icons/light-em-up.webp',
    'icons/missions.png',
    'icons/missions.webp',
    'icons/nexus-logo.png',
    'icons/no_bg_250303_122034.png',
    'icons/overview.png',
    'icons/overview.webp',
    'icons/prometheus_outpost_nobg.png',
    'icons/prosperity_nobg.png',
    'icons/raider_outpost_nobg.png',
    'icons/rank.png',
    'icons/rank.webp',
    'icons/scanning.png',
    'icons/scanning.webp',
    'icons/sci-fi-bg.png',
    'icons/sci-fi-bg.webp',
    'icons/shredder.png',
    'icons/shredder.webp',
    'icons/skillsandabilities.png',
    'icons/skillsandabilities.webp',
    'icons/training.png',
    'icons/training.webp',
    'icons/white_horse_nobg.png',
    
    // Marthas
    'Marthas/martha.png',
    'Marthas/patron.png',
    'Marthas/patron2.png',
    'Marthas/player.png',
    'Marthas/tavern_background.png',
    
    // New
    'New/bill.webp',
    'New/Ivey.webp',
    'New/noah.webp',
    'New/spyder.webp',
    'New/waterworks-mechanic.webp'
];

// Convert relative paths to full URLs
const ASSET_URLS = ASSETS.map(asset => `${ASSET_BASE_URL}/${asset.replace(/\\/g, '/')}`);

// Install event - cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSET_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Function to preload and cache all assets
async function preloadAssets() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedRequests = await cache.keys();
        const cachedUrls = new Set(cachedRequests.map(request => request.url));
        
        // Filter out already cached assets
        const assetsToCache = ASSET_URLS.filter(url => !cachedUrls.has(url));
        
        if (assetsToCache.length > 0) {
            console.log(`Caching ${assetsToCache.length} assets...`);
            await cache.addAll(assetsToCache);
            console.log('All assets cached successfully');
        } else {
            console.log('All assets are already cached');
        }
        
        return true;
    } catch (error) {
        console.error('Error caching assets:', error);
        return false;
    }
}

// Function to get a cached asset
async function getCachedAsset(url) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(url);
        
        if (response) {
            return await response.blob();
        }
        
        // If not in cache, fetch and cache it
        const networkResponse = await fetch(url);
        if (networkResponse.ok) {
            cache.put(url, networkResponse.clone());
            return await networkResponse.blob();
        }
        
        return null;
    } catch (error) {
        console.error(`Error getting cached asset ${url}:`, error);
        return null;
    }
}

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/assets/assetLoader.js');
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            
            // Start preloading assets
            await preloadAssets();
        } catch (error) {
            console.error('ServiceWorker registration failed: ', error);
        }
    });
}

export { preloadAssets, getCachedAsset };
