/**
 * random_encounters.js
 * Module for handling random encounters in the game
 */

// Initialize the RandomEncounters module
window.RandomEncounters = (function() {
  // Private variables
  let map;
  let playerMarker;
  let activeMarkers = []; // Track active markers
  let lastSpawnTime = null; // To track the last game hour when an encounter was spawned
  let despawnCheckIntervalId = null; // To track the despawn check interval
  let currentGameTime = null; // Current game time from the event
  let openEncounterPopups = []; // Track open popups for live updates

  // DMZ coordinates between HIVE and FDG territories
  const DMZ_BOUNDS = {
    north: 45.0, // Northern boundary
    south: 35.0, // Southern boundary
    east: -95.0, // Eastern boundary (HIVE side)
    west: -105.616 // Western boundary (FDG side, "The Wall")
  };

  // US mainland boundaries
  const US_BOUNDS = {
    north: 49.0,
    south: 25.0,
    east: -66.0,
    west: -125.0
  };

  // Initialize the module
  function init(gameMap, playerMrk) {
    console.log('RandomEncounters module initializing...');
    console.log('Map provided:', gameMap);
    console.log('Player marker provided:', playerMrk);
    
    // If parameters are not provided, try to use global variables
    map = gameMap || window.map;
    playerMarker = playerMrk || window.playerMarker;
    
    if (!map) {
      console.error('RandomEncounters: No map provided!');
      return;
    }
    
    if (!playerMarker) {
      console.warn('RandomEncounters: No player marker provided!');
    }

    // Clear any existing markers
    clearAllMarkers();

    console.log('RandomEncounters: Starting to spawn events...');
    // Start spawning encounters, with an initial delay to avoid immediate spawn
    scheduleNextEvent();
    
    // Don't spawn an encounter immediately
    // setTimeout(() => spawnEvent(), 2000);

    // Listen for game time changes to determine when to spawn encounters
    document.addEventListener('gameHourChanged', function(e) {
      const currentHour = e.detail.hour;
      const currentDay = e.detail.day;
      
      // Store current game time for future reference
      currentGameTime = e.detail.gameTime;
      
      // Track which hour we're in for spawning purposes
      const timeKey = `${currentDay}-${currentHour}`;
      
      console.log(`RandomEncounters: Game hour changed to ${currentDay}:${currentHour}`);
      
      // Always check for encounter despawn due to duration timeout first
      console.log(`RandomEncounters: Checking for encounter timeouts at game day ${currentDay}, hour ${currentHour}`);
      checkEncounterDespawn();
      
      // Update any open popups with new time information
      updateOpenPopups();
      
      // Then, if we haven't spawned an encounter yet this hour, consider spawning one
      // Only spawn every 3-4 hours to make encounters less frequent
      if (lastSpawnTime !== timeKey && currentHour % 3 === 0) {
        // 25% chance to spawn an encounter (reduced from 50%)
        if (Math.random() < 0.25) {
          console.log(`RandomEncounters: Spawning event for hour ${currentHour}`);
          spawnEvent();
          lastSpawnTime = timeKey;
        }
      }
    });
    
    // Listen for in-game time updates (non-hour changes) to update popup times
    document.addEventListener('gameTimeUpdated', function(e) {
      // Store current game time for future reference
      currentGameTime = e.detail.gameTime;
      
      // Update any open popups with new time information
      updateOpenPopups();
    });

    // Return public methods
    return {
      spawnEvent,
      scheduleNextEvent,
      clearAllMarkers
    };
  }

  /**
   * Clear all active markers from the map
   */
  function clearAllMarkers() {
    console.log('RandomEncounters: Clearing all markers');
    activeMarkers.forEach(marker => {
      if (map && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    activeMarkers = [];
    openEncounterPopups = [];
  }
  
  /**
   * Calculate game-time based expiration for an encounter
   * @param {Object} marker - The encounter marker
   * @returns {Object} - Object with expiration information
   */
  function calculateGameTimeExpiration(marker) {
    if (!marker || !marker.spawnTime || !marker.encounterInfo || !marker.encounterInfo.duration) {
      console.error('Invalid marker data for expiration calculation');
      return { minutesRemaining: 'Unknown', formattedTime: 'Unknown' };
    }
    
    // Get current time - use game time if available, otherwise use real time
    const nowTime = currentGameTime ? currentGameTime.getTime() : Date.now();
    
    // Calculate the real-world milliseconds per game minute (speed factor)
    // This is typically 60 real seconds = 6 game hours = 360 game minutes
    // So 1 game minute = (60 * 1000) / 360 = 166.67 real milliseconds
    // The 20 divisor is a scaling factor - encounters should last longer in game time than real time
    // Increased from 10 to 20 to make encounters last longer
    const realMsPerGameMinute = 166.67 / 20; 
    
    // Convert the duration from real ms to equivalent game minutes
    const durationInGameMinutes = marker.encounterInfo.duration / realMsPerGameMinute;
    
    // Calculate how many real ms have elapsed since spawn
    const elapsedRealMs = Date.now() - marker.spawnTime;
    
    // Convert to elapsed game minutes
    const elapsedGameMinutes = elapsedRealMs / realMsPerGameMinute;
    
    // Calculate remaining game minutes
    const remainingGameMinutes = Math.max(0, durationInGameMinutes - elapsedGameMinutes);
    
    // Format as hours and minutes if > 60 minutes
    let formattedTime;
    if (remainingGameMinutes > 60) {
      const hours = Math.floor(remainingGameMinutes / 60);
      const minutes = Math.floor(remainingGameMinutes % 60);
      formattedTime = `${hours}h ${minutes}m`;
    } else {
      formattedTime = `${Math.floor(remainingGameMinutes)}m`;
    }
    
    return {
      minutesRemaining: Math.floor(remainingGameMinutes),
      formattedTime: formattedTime
    };
  }
  
  /**
   * Update all open encounter popups with current time information
   */
  function updateOpenPopups() {
    if (!openEncounterPopups.length) return;
    
    console.log(`RandomEncounters: Updating ${openEncounterPopups.length} open popups`);
    
    // Update each popup with new time information
    openEncounterPopups.forEach(popupInfo => {
      // Get the popup and marker
      const { popup, marker } = popupInfo;
      
      if (!popup || !marker) return;
      
      // Only update if the popup is open
      if (popup.isOpen()) {
        // Calculate new expiration time
        const expiration = calculateGameTimeExpiration(marker);
        
        // Find and update the expiration text
        const popupElement = popup.getElement();
        if (popupElement) {
          const expirationElement = popupElement.querySelector('.encounter-expiration');
          if (expirationElement) {
            expirationElement.textContent = `Expires in ${expiration.formattedTime} (game time)`;
          }
        }
      } else {
        // If popup is closed, remove it from our tracking array
        const index = openEncounterPopups.indexOf(popupInfo);
        if (index > -1) {
          openEncounterPopups.splice(index, 1);
        }
      }
    });
  }

  /**
   * Check if any encounters need to despawn based on their duration
   */
  function checkEncounterDespawn() {
    const currentTime = Date.now();
    const markersToRemove = [];
    
    console.log(`RandomEncounters: Checking for expired encounters at ${new Date(currentTime).toLocaleTimeString()}`);
    
    activeMarkers.forEach(marker => {
      // Check if the marker has a spawn time and encounter type
      if (marker.spawnTime && marker.encounterType) {
        const encounterInfo = window.EncounterTypes.ENCOUNTER_TYPES[marker.encounterType];
        if (encounterInfo && encounterInfo.duration) {
          const despawnTime = marker.spawnTime + encounterInfo.duration;
          const timeRemaining = Math.floor((despawnTime - currentTime) / 1000 / 60); // Minutes remaining
          
          console.log(`RandomEncounters: Encounter ${marker.encounterType} has ${timeRemaining} minutes remaining`);
          
          // If it's time to despawn
          if (currentTime >= despawnTime) {
            console.log(`RandomEncounters: Encounter ${marker.encounterType} has expired and will be removed`);
            markersToRemove.push(marker);
          }
        }
      } else {
        console.warn(`RandomEncounters: Found marker without proper spawn time or encounter type data`);
      }
    });
    
    // Remove the markers that need to be despawned
    markersToRemove.forEach(marker => {
      console.log(`RandomEncounters: Despawning encounter ${marker.encounterType} due to timeout`);
      if (map && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
      const index = activeMarkers.indexOf(marker);
      if (index > -1) {
        activeMarkers.splice(index, 1);
      }
    });
    
    // Log remaining encounters count
    console.log(`RandomEncounters: ${activeMarkers.length} encounters remain active after timeout check`);
  }

  /**
   * Generate a location for the encounter
   * 75% chance to be near player, 25% chance to be elsewhere in the US
   */
  function getEncounterLocation() {
    // Check if player marker exists
    if (!playerMarker) {
      console.warn('RandomEncounters: No player marker, using random location');
      // Default to original DMZ location logic
      const inDMZ = Math.random() < 0.75;
      
      let lat, lng;
      
      if (inDMZ) {
        // Generate coordinates within DMZ
        lat = DMZ_BOUNDS.south + Math.random() * (DMZ_BOUNDS.north - DMZ_BOUNDS.south);
        lng = DMZ_BOUNDS.west + Math.random() * (DMZ_BOUNDS.east - DMZ_BOUNDS.west);
        console.log('RandomEncounters: Spawning in DMZ');
      } else {
        // Generate coordinates in US mainland, but outside DMZ
        lat = US_BOUNDS.south + Math.random() * (US_BOUNDS.north - US_BOUNDS.south);
        lng = US_BOUNDS.west + Math.random() * (US_BOUNDS.east - US_BOUNDS.west);
        console.log('RandomEncounters: Spawning outside DMZ');
      }
      
      return { lat, lng };
    }
    
    // 95% chance to spawn very close to player
    const nearPlayer = Math.random() < 0.95;
    
    if (nearPlayer) {
      // Get player position
      const playerPos = playerMarker.getLatLng();
      
      // Spawn VERY close to player (within 0.05-0.2 degrees, roughly 3-14 miles)
      // This ensures the player can actually see the encounter
      const randomOffset = (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? -1 : 1);
      const randomOffset2 = (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? -1 : 1);
      
      const lat = playerPos.lat + randomOffset;
      const lng = playerPos.lng + randomOffset2;
      
      console.log('RandomEncounters: Spawning very close to player at', lat, lng);
      return { lat, lng };
    } else {
      // Generate coordinates in US mainland, but still relatively close to player
      const playerPos = playerMarker.getLatLng();
      const maxDistance = 1.0; // Max 1 degree distance (roughly 70 miles)
      const randomOffset = (Math.random() * maxDistance) * (Math.random() < 0.5 ? -1 : 1);
      const randomOffset2 = (Math.random() * maxDistance) * (Math.random() < 0.5 ? -1 : 1);
      
      const lat = playerPos.lat + randomOffset;
      const lng = playerPos.lng + randomOffset2;
      
      console.log('RandomEncounters: Spawning at medium distance from player at', lat, lng);
      return { lat, lng };
    }
  }

  /**
   * Spawn a random encounter on the map as a custom Leaflet layer 
   * that stays fixed regardless of zoom level
   * @param {string} [forceType] - Optional parameter to force a specific encounter type
   */
  function spawnEvent(forceType) {
    if (!map) {
      console.error('RandomEncounters: Cannot spawn event - map not available');
      return;
    }
    
    console.log('RandomEncounters: Spawning a new event');
    
    // Get location for the encounter
    const location = getEncounterLocation();
    const eventLat = location.lat;
    const eventLng = location.lng;
    
    // Determine encounter type
    const encounterType = forceType || window.EncounterTypes.getRandomEncounterType();
    const encounterInfo = window.EncounterTypes.ENCOUNTER_TYPES[encounterType];
    
    if (!encounterInfo) {
      console.error(`RandomEncounters: Unknown encounter type: ${encounterType}`);
      return;
    }
    
    console.log(`RandomEncounters: Spawning encounter of type: ${encounterInfo.name}`);
    
    // Create a permanent Circle Marker instead of a regular marker
    // Circle markers stay in the same position regardless of zoom level
    const circleMarker = L.circleMarker([eventLat, eventLng], {
      radius: 8, // Small circle
      color: '#ffffff', // White border
      weight: 2, // Border width
      fillColor: encounterInfo.color, // Use the color from the encounter type
      fillOpacity: 1.0,
      opacity: 1.0,
      interactive: true,
      bubblingMouseEvents: true,
      className: `encounter-marker encounter-${encounterType.toLowerCase()}`,
      zIndexOffset: 1000,
      pane: 'overlayPane', // Use overlay pane to ensure it's always on top
      permanent: true, // Mark this layer as permanent (custom option we'll check)
      renderer: L.svg() // Ensure we use SVG for best cross-browser support
    }).addTo(map);
    
    // Add encounter data to the marker
    circleMarker.encounterType = encounterType;
    circleMarker.encounterInfo = encounterInfo;
    circleMarker.spawnTime = Date.now();
    
    // Calculate game-time based expiration
    const expiration = calculateGameTimeExpiration(circleMarker);
    
    // Create tooltip with encounter name and expiration time
    circleMarker.bindTooltip(`${encounterInfo.name} (Expires in: ${expiration.formattedTime})`, {
      permanent: false,
      direction: 'top',
      opacity: 0.9,
      className: 'encounter-tooltip'
    });
    
    // Update tooltip content on mouseover to show current time
    circleMarker.on('mouseover', function() {
      const updatedExpiration = calculateGameTimeExpiration(circleMarker);
      circleMarker.setTooltipContent(`${encounterInfo.name} (Expires in: ${updatedExpiration.formattedTime})`);
    });
    
    // Set up an event listener for zoom changes to adjust the marker radius
    // to keep it a consistent size in screen space
    const onZoom = function() {
      // Base radius at zoom level 8
      const baseRadius = 8;
      const baseZoom = 8;
      
      // Current zoom level
      const zoom = map.getZoom();
      
      // Scale radius to keep visual size consistent
      // (halves size for each zoom level increase)
      const scaleFactor = Math.pow(0.75, zoom - baseZoom);
      const newRadius = baseRadius * scaleFactor;
      
      // Update the radius
      circleMarker.setRadius(Math.max(4, newRadius)); // Minimum size of 4px
    };
    
    // Initial size adjustment based on current zoom
    onZoom();
    
    // Listen for zoom events
    map.on('zoomend', onZoom);
    
    // Add to active markers array
    activeMarkers.push(circleMarker);
    
    console.log(`RandomEncounters: ${encounterInfo.name} marker added at`, eventLat, eventLng);
    
    // Add click handler to marker
    circleMarker.on('click', function() {
      console.log(`Encounter marker clicked: ${encounterInfo.name}`);
      
      // Calculate game-time based expiration
      const expiration = calculateGameTimeExpiration(circleMarker);
      
      // Create a detailed popup with encounter information
      const popupContent = `
        <div class="encounter-popup">
          <h3>${encounterInfo.name}</h3>
          <p>${encounterInfo.description}</p>
          <p class="encounter-type ${encounterInfo.type}-type">Type: ${encounterInfo.type}</p>
          <p class="encounter-expiration">Expires in ${expiration.formattedTime} (game time)</p>
          <button class="engage-button">Engage</button>
          <button class="ignore-button">Ignore</button>
        </div>
      `;
      
      // Open the popup
      const popup = L.popup()
        .setLatLng(circleMarker.getLatLng())
        .setContent(popupContent)
        .openOn(map);
        
      // Add this popup to the list of open popups to update
      openEncounterPopups.push({ popup, marker: circleMarker });
      
      // Set up events to remove popup from tracking when closed
      popup.on('remove', function() {
        const index = openEncounterPopups.findIndex(p => p.popup === popup);
        if (index > -1) {
          openEncounterPopups.splice(index, 1);
        }
      });
      
      // Add event listeners to the buttons in the popup
      setTimeout(() => {
        const engageButton = document.querySelector('.engage-button');
        const ignoreButton = document.querySelector('.ignore-button');
        
        if (engageButton) {
          engageButton.addEventListener('click', function() {
            console.log(`Starting ${encounterInfo.type} encounter: ${encounterInfo.name}`);
            
            // For combat encounters, start combat directly
            if (encounterInfo.type === 'combat') {
              console.log('Starting combat encounter from random_encounters.js');
              
              // First dispatch the action2Clicked event for backward compatibility
              document.dispatchEvent(new CustomEvent('action2Clicked', {
                detail: { 
                  latlng: circleMarker.getLatLng(),
                  encounterType: encounterType,
                  encounterInfo: encounterInfo
                }
              }));
              
              // Define a function to check if startCombat is available and retry if needed
              const tryStartCombat = function(retryCount = 0) {
                if (typeof window.startCombat === 'function') {
                  console.log('Directly calling startCombat with:', encounterType);
                  
                  // Create a callback for when combat ends
                  const onCombatEnd = function(result) {
                    console.log('Combat ended with result:', result);
                    // Handle post-combat results here
                  };
                  
                  // Start the combat
                  window.startCombat('WASTELAND', encounterType, onCombatEnd);
                } else {
                  if (retryCount < 10) { // Try a few times before giving up
                    console.log(`startCombat not available yet, retrying in 500ms (attempt ${retryCount + 1})`);
                    setTimeout(() => tryStartCombat(retryCount + 1), 500);
                  } else {
                    console.error('startCombat function not available after multiple attempts. Combat module may not be loaded correctly.');
                    alert('Could not load combat system. Please refresh the page and try again.');
                  }
                }
              };
              
              // Start the retry process
              tryStartCombat();
            } else {
              // For non-combat encounters, dispatch a different event
              document.dispatchEvent(new CustomEvent('nonCombatEncounterEngaged', {
                detail: { 
                  latlng: circleMarker.getLatLng(),
                  encounterType: encounterType,
                  encounterInfo: encounterInfo
                }
              }));
            }
            
            // Close the popup
            map.closePopup();
            
            // Remove the marker
            map.removeLayer(circleMarker);
            
            // Remove from active markers
            const index = activeMarkers.indexOf(circleMarker);
            if (index > -1) {
              activeMarkers.splice(index, 1);
            }
          });
        }
        
        if (ignoreButton) {
          ignoreButton.addEventListener('click', function() {
            // Close the popup
            map.closePopup();
          });
        }
      }, 100); // Small delay to ensure DOM is updated
    });
    
    // Make the circle marker pulse with CSS animation
    if (circleMarker._path) {
      circleMarker._path.classList.add('pulse-circle');
      // Add encounter-specific class for styling
      circleMarker._path.classList.add(`encounter-${encounterType.toLowerCase()}-pulse`);
    }
    
    return circleMarker; // Return the marker for testing
  }

  /**
   * Schedule the next random encounter and start the timeout check interval
   * This is a backup for the hour-based spawning and despawning
   */
  function scheduleNextEvent() {
    // Schedule an encounter every 180-240 minutes of game time (increased from 60-90)
    const nextDelay = Math.random() * 60000 + 180000;
    console.log('RandomEncounters: Backup scheduled check in', Math.round(nextDelay/1000), 'seconds');
    
    // Set up a periodic check for encounter timeouts if not already running
    if (!despawnCheckIntervalId) {
      console.log('RandomEncounters: Setting up periodic timeout check every 15 minutes');
      despawnCheckIntervalId = setInterval(function() {
        console.log('RandomEncounters: Running periodic timeout check');
        checkEncounterDespawn();
      }, 15 * 60 * 1000); // Check every 15 minutes (increased from 5)
    }
    
    setTimeout(function() {
      // Only trigger an encounter if there are fewer than 3 active markers
      if (activeMarkers.length < 3) {
        // 35% chance to actually spawn an encounter
        if (Math.random() < 0.35) {
          spawnEvent();
        }
      }
      scheduleNextEvent();
    }, nextDelay);
  }

  // Return the public API
  return {
    init,
    spawnEvent,
    clearAllMarkers: function() {
      if (typeof clearAllMarkers === 'function') {
        clearAllMarkers();
      }
    },
    getActiveMarkers: function() {
      return activeMarkers;
    },
    spawnCombatEncounter: function() {
      return spawnEvent(window.EncounterTypes.getRandomCombatEncounter());
    },
    spawnNonCombatEncounter: function() {
      return spawnEvent(window.EncounterTypes.getRandomNonCombatEncounter());
    },
    spawnSpecificEncounter: function(encounterType) {
      return spawnEvent(encounterType);
    },
    spawnTopDownAreaEncounter: function() {
      // Spawn our custom TopDown area encounter
      return spawnEvent("TOPDOWN_AREA");
    }
  };
})();

// Export the module
window.RandomEncounters = RandomEncounters;

// Auto-initialize if the document is already loaded and map is available
document.addEventListener('DOMContentLoaded', function() {
  console.log('RandomEncounters: DOM loaded, checking for map...');
  setTimeout(function() {
    if (window.map && !RandomEncounters.initialized) {
      console.log('RandomEncounters: Auto-initializing with global map');
      RandomEncounters.init(window.map, window.playerMarker);
      RandomEncounters.initialized = true;
    }
  }, 1000); // Give a second for other scripts to initialize
  
  // Setup mutation observer for SVG elements added to the DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        // Look for added SVG paths that might be our circle markers
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeName && node.nodeName.toLowerCase() === 'path') {
            // Find parent with encounter-marker class
            let parent = node.parentNode;
            while (parent) {
              if (parent.classList && parent.classList.contains('encounter-marker')) {
                // Add pulsing animation
                node.classList.add('pulse-circle');
                
                // Find encounter type class for specific styling
                Array.from(parent.classList).forEach(className => {
                  if (className.startsWith('encounter-') && className !== 'encounter-marker') {
                    node.classList.add(`${className}-pulse`);
                  }
                });
                
                break;
              }
              parent = parent.parentNode;
            }
          }
        });
      }
    });
  });

  // Start observing the document for added SVG elements
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Add a listener for the non-combat encounter event
  document.addEventListener('nonCombatEncounterEngaged', function(e) {
    console.log('Non-combat encounter engaged:', e.detail);
    
    // Special handling for TopDown area encounter
    if (e.detail.encounterType === 'TOPDOWN_AREA') {
      console.log('Triggering TopDown area encounter');
      // No need to do anything here as the TopDownAreaEncounter module
      // will handle the event directly
      return;
    }
    
    // For other non-combat encounters, show a simple alert
    alert(`${e.detail.encounterInfo.name}: ${e.detail.encounterInfo.description}`);
  });
});
