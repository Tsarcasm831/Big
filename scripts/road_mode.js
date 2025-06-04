// road_mode.js - Handles road following functionality for the map

// Variables for road mode
let roadFollowingMode = true;
let routeControl = null;
let routePoints = [];
let currentRouteIndex = 0;
let etaPopupGlobal = null;

// Initialize road mode
function initRoadMode(map) {
    // Add a control to toggle between direct path and road-following modes
    const pathModeControl = L.control({position: 'topright'});
    pathModeControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'path-mode-control');
        div.innerHTML = '<button id="toggle-path-mode" style="padding: 8px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">Road Mode: ON</button>';
        return div;
    };
    pathModeControl.addTo(map);
    
    // Add event listener for the road mode toggle button
    document.getElementById('toggle-path-mode').addEventListener('click', function() {
        roadFollowingMode = !roadFollowingMode;
        this.innerHTML = 'Road Mode: ' + (roadFollowingMode ? 'ON' : 'OFF');
    });
}

// Function to clear any existing route visualization
function clearExistingRoute(map) {
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
}

// Function to create a route using road-following mode
function createRoadRoute(map, startLat, startLng, destLat, destLng, timeSpeed, gameTime, moveTotalTicksCallback) {
    // Clear any existing routes
    clearExistingRoute(map);
    
    // Use Leaflet Routing Machine for road-following
    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng),
            L.latLng(destLat, destLng)
        ],
        lineOptions: {
            styles: [{color: 'blue', opacity: 0.6, weight: 4}],
            addWaypoints: false
        },
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
    }).addTo(map);
    
    // Hide the control UI but keep the route line
    routeControl.hide();
    
    routeControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        routePoints = routes[0].coordinates;
        
        // Set up movement along the route
        const moveTotalTicks = Math.ceil(summary.totalDistance / 80); // 80 meters per tick
        if (moveTotalTicksCallback) {
            moveTotalTicksCallback(moveTotalTicks);
        }
        
        // Calculate ETA based on game time and route distance
        // Each tick is one in-game minute
        const etaGameTime = new Date(gameTime.getTime());
        // We need real-time seconds to complete the journey (moveTotalTicks/timeSpeed)
        // For each real second, game time advances by timeSpeed minutes
        const realTimeSecondsToArrive = Math.ceil(moveTotalTicks / timeSpeed);
        let gameTimeMinutesToAdd = realTimeSecondsToArrive * timeSpeed;
        // Double the estimation as requested
        gameTimeMinutesToAdd = gameTimeMinutesToAdd * 2.5;
        etaGameTime.setMinutes(etaGameTime.getMinutes() + gameTimeMinutesToAdd);
        
        // Format ETA time
        let etaHours = etaGameTime.getHours();
        const etaMinutes = etaGameTime.getMinutes();
        const etaAmpm = (etaHours >= 12) ? 'PM' : 'AM';
        etaHours = etaHours % 12;
        etaHours = etaHours ? etaHours : 12;
        const etaMinutesStr = (etaMinutes < 10) ? ('0' + etaMinutes) : etaMinutes;
        
        // Format ETA date
        const etaMonth = etaGameTime.toLocaleString('default', { month: 'short' });
        const etaDay = etaGameTime.getDate();
        const etaYear = etaGameTime.getFullYear();
        const etaDateStr = etaMonth + ' ' + etaDay + ', ' + etaYear;
        
        // Create ETA popup at destination
        const etaPopup = L.popup()
            .setLatLng([destLat, destLng])
            .setContent('<strong>Estimated Time of Arrival:</strong><br>' + 
                        etaDateStr + ' ' + etaHours + ':' + etaMinutesStr + ' ' + etaAmpm)
            .openOn(map);
            
        // Store the popup to close it when player arrives
        etaPopupGlobal = etaPopup;
    });
    
    return routeControl;
}

// Function to update player position along the road route
function updateRoadPosition(playerMarker, timeRunning, timeSpeed, moveTotalTicks, currentTickCallback, updateBottomButtonsVisibility, moveDestGlobal, map) {
    if (routePoints && routePoints.length > 0) {
        // Road-following movement
        if (currentRouteIndex < routePoints.length - 1) {
            // Calculate how many steps to advance based on timeSpeed
            let stepsToAdvance = timeRunning ? timeSpeed : 0;
            
            // Move along the route based on timeSpeed
            for (let i = 0; i < stepsToAdvance; i++) {
                if (currentRouteIndex < routePoints.length - 1) {
                    // Move to next point on route
                    const nextPoint = routePoints[currentRouteIndex];
                    playerMarker.setLatLng([nextPoint.lat, nextPoint.lng]);
                    currentRouteIndex++;
                    
                    // Increment currentTick to track overall progress
                    if (currentTickCallback) {
                        const currentTick = Math.floor((currentRouteIndex / routePoints.length) * moveTotalTicks);
                        currentTickCallback(currentTick);
                    }
                } else {
                    break; // Reached the end of the route
                }
            }
            
            // Check player location and update buttons visibility
            if (updateBottomButtonsVisibility) {
                updateBottomButtonsVisibility();
            }
            
            return false; // Not yet arrived
        } else {
            // Arrived at destination
            if (moveDestGlobal) {
                playerMarker.setLatLng([moveDestGlobal.lat, moveDestGlobal.lng]);
            }
            
            // Clear the route
            clearExistingRoute(map);
            
            // Check player location and update buttons visibility
            if (updateBottomButtonsVisibility) {
                updateBottomButtonsVisibility();
            }
            
            // Close ETA popup
            if (etaPopupGlobal) {
                map.closePopup(etaPopupGlobal);
                etaPopupGlobal = null;
            }
            
            return true; // Arrived at destination
        }
    }
    
    return false;
}

// Export the road mode functionality
window.RoadMode = {
    isRoadFollowingMode: () => roadFollowingMode,
    initRoadMode,
    clearExistingRoute,
    createRoadRoute,
    updateRoadPosition,
    getRoutePoints: () => routePoints,
    getCurrentRouteIndex: () => currentRouteIndex,
    setCurrentRouteIndex: (index) => { currentRouteIndex = index; },
    resetRoute: () => {
        routePoints = [];
        currentRouteIndex = 0;
        if (etaPopupGlobal) {
            etaPopupGlobal = null;
        }
    }
};
