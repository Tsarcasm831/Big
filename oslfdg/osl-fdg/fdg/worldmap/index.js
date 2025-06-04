document.addEventListener('DOMContentLoaded', function() {
  // Register a service worker and set swReady when done
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(function(registration) {
        window.swReady = true;
        console.log('Service worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.error('Service worker registration failed:', error);
      });
  } else {
    console.warn('Service workers are not supported in this browser.');
  }

  // If no project id is set, use a default value to avoid errors
  if (!window.PROJECT_ID) {
    window.PROJECT_ID = 'default_project_id';
    console.warn('No project id found. Defaulting to "default_project_id".');
  }

  // ---- Dropdown Logic ----
  const factionsButton = document.getElementById('factions-button');
  const factionsDropdown = document.getElementById('factions-dropdown');

  if (factionsButton && factionsDropdown) {
    factionsButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent click from immediately closing dropdown
      factionsDropdown.style.display = (factionsDropdown.style.display === 'block') ? 'none' : 'block';
    });

    // Close dropdown if clicking outside
    document.addEventListener('click', function(e) {
      const container = document.getElementById('factions-container');
      if (container && !container.contains(e.target)) {
        factionsDropdown.style.display = 'none';
      }
    });
  } else {
      console.warn("Factions button or dropdown not found.");
  }

  // ---- Dynamic Aliens Submenu Generation ----
  const aliensSubmenuData = [
    { name: "Anthromorph Race", divisions: 3, units: ["Troop", "Grunt", "Sentry", "Brawler", "Juggernaut", "Titan"] },
    { name: "Avianos Race", divisions: 3, units: ["Troop", "Sky Guard", "Windstriker", "Thunderwing", "Stormrider", "Tempest"] },
    { name: "Behemoth Race", divisions: 3, units: ["Troop", "Crusher", "Mauler", "Titan", "Colossus", "Goliath"] },
    { name: "Chiropteran Race", divisions: 3, units: ["Troop", "Fury", "Screech", "Claw", "Nightwing", "Predator"] },
    { name: "Dengar Race", divisions: 3, units: ["Troop", "Fang", "Hunter", "Pursuer", "Predator", "Ravage"] },
    { name: "Kilrathi Race", divisions: 3, units: ["Troop", "Warrior", "Predator", "Enforcer", "Berserker", "Alpha"] },
    { name: "Shal'Rah Prime Race", divisions: 3, units: ["Troop", "Drone", "Elite Drone", "Officer", "Hornet", "Stinger"] },
    { name: "Tal'Ehn Race", divisions: 3, units: ["Troop", "Warlock", "Acolyte", "Invoker", "Magister", "Archmage"] },
    { name: "Talorian Race", divisions: 3, units: ["Troop", "Diplomat", "Advisor", "Emissary", "Envoy", "Prime Ambassador"] },
    { name: "T'ana'Rhe Race", divisions: 3, units: ["Troop", "Merchant", "Trader", "Soldier", "Warrior", "Fury"] },
    { name: "Vyraxus Race", divisions: 3, units: ["Troop", "Reptoid", "Lizard Warrior", "Tactical Soldier", "Warleader", "Alpha Hunter"] },
    { name: "Xithrian Race", divisions: 3, units: ["Troop", "Scholar", "Researcher", "Scientist", "Academic", "Master Scholar"] },
    // Add Zorvath later if needed
  ];

  const aliensSubmenuContent = document.getElementById('aliens-submenu-content');
  if (aliensSubmenuContent) {
      aliensSubmenuData.forEach(race => {
          const raceItem = document.createElement('div');
          raceItem.className = 'submenu-item submenu'; // Add submenu class for nesting behavior

          const raceTitle = document.createElement('a');
          raceTitle.className = 'submenu-title';
          raceTitle.textContent = `${race.name} \u25B6`; // Add right arrow
          raceItem.appendChild(raceTitle);

          const divisionsContent = document.createElement('div');
          divisionsContent.className = 'submenu-content'; // Nested submenu content

          for (let i = 1; i <= race.divisions; i++) {
              const divisionItem = document.createElement('div');
              divisionItem.className = 'submenu-item submenu'; // Division level

              const divisionTitle = document.createElement('a');
              divisionTitle.className = 'submenu-title division-title'; // Specific class for division title
              divisionTitle.textContent = `Division ${i} \u25B6`;
              divisionItem.appendChild(divisionTitle);

              const unitsContent = document.createElement('div');
              unitsContent.className = 'submenu-content'; // Units level

              race.units.forEach(unit => {
                  const unitItem = document.createElement('a');
                  // unitItem.href = "#"; // Add links later if needed
                  unitItem.textContent = unit;
                  unitsContent.appendChild(unitItem);
              });
              divisionItem.appendChild(unitsContent);
              divisionsContent.appendChild(divisionItem);
          }
          raceItem.appendChild(divisionsContent);
          aliensSubmenuContent.appendChild(raceItem);
      });
      // Add hover logic for nested submenus (handled by CSS :hover)
  } else {
      console.warn("Aliens submenu content container not found.");
  }

  // ---- Leaflet Map Initialization ----
  var map = L.map('map', {
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false
  }).setView([40.1673, -105.1019], 10);

  var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });
  var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Imagery &copy; Esri'
  });
  var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  });
  osmLayer.addTo(map);
  var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Satellite": satelliteLayer,
    "Topographic": topoLayer
  };
  L.control.layers(baseMaps).addTo(map);

  var wallCoords = [
    [31.0, -105.616],
    [41.0, -105.616],
    [41.0, -104.0],
    [49.0, -104.0]
  ];
  L.polyline(wallCoords, {color: 'red', weight: 4, dashArray: '10, 10'}).addTo(map);

  var fdgCoords = [
    [32.5, -117.1], [33.7, -118.2], [34.0, -120.0], [36.8, -121.8],
    [38.5, -123.0], [41.0, -124.2], [43.8, -124.2], [46.0, -124.0],
    [49.0, -124.7], [49.0, -104.0], [41.0, -104.0], [41.0, -105.616],
    [31.0, -105.616]
  ];
  var fdgPolygon = L.polygon(fdgCoords, {
    color: 'darkgreen', fillColor: 'darkgreen', fillOpacity: 0.5
  }).addTo(map);

  var hiveBorderCoords = [
    [49.0, -95.20], [47.21, -95.20], [45.0, -93.0], [43.0, -91.0],
    [38.63, -90.20], [35.15, -90.05], [29.95, -90.07]
  ];
  var hiveBorder = L.polyline(hiveBorderCoords, {color: 'yellow', weight: 4}).addTo(map);
  hiveBorder.bindTooltip("H.I.V.E. Border", {permanent: true, className: "border-label", offset: [0, -10]});

  var hiveCoords = [
    [49.0, -95.20], [47.21, -95.20], [45.0, -93.0], [43.0, -91.0],
    [38.63, -90.20], [35.15, -90.05], [29.95, -90.07], [29.95, -85.0],
    [35.0, -75.0], [40.0, -70.0], [45.0, -66.0], [49.0, -65.0],
    [49.0, -95.20]
  ];
  var hivePolygon = L.polygon(hiveCoords, {
    color: 'yellow', fillColor: 'yellow', fillOpacity: 0.5
  }).addTo(map);

  var playerIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    iconSize: [32,32], iconAnchor: [16,16]
  });
  var playerMarker = L.marker([40.1568, -105.1040], {icon: playerIcon, draggable: true}).addTo(map);

  var houseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [32, 32], iconAnchor: [16, 32]
  });
  var houseMarker = L.marker([40.1568, -105.1040], {icon: houseIcon}).addTo(map);
  houseMarker.bindPopup('<b>Return Home</b>');
  houseMarker.on('click', function() {
    map.setView([40.1568, -105.1040], map.getZoom());
    confirmMove(40.1568, -105.1040);
  });

  var whiteHorseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816589.png',
    iconSize: [32, 32], iconAnchor: [16, 16], className: 'white-horse'
  });
  L.marker([39.7439, -105.0201], {icon: whiteHorseIcon})
    .addTo(map).bindPopup("White Horse at Invesco Field");

  var blueHorseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1816/1816589.png',
    iconSize: [32, 32], iconAnchor: [16, 16], className: 'blue-horse'
  });
  L.marker([39.8561, -104.6737], {icon: blueHorseIcon})
    .addTo(map).bindPopup("Blue Horse at DIA");

  // --- Movement logic ---
  var moving = false, moveTotalTicks = 0, currentTick = 0;
  var deltaLat = 0, deltaLng = 0, moveDestGlobal = null;

  // Confirm-move function
  function confirmMove(destLat, destLng) {
    var dialog = document.getElementById('move-confirmation-dialog');
    dialog.style.display = 'block';
    document.getElementById('confirm-move').onclick = function() {
      var moveStart = playerMarker.getLatLng();
      var distanceMiles = getDistanceInMiles(moveStart.lat, moveStart.lng, destLat, destLng);
      moveTotalTicks = Math.ceil(distanceMiles / 5); // Assuming 5 miles per tick/minute
      if (moveTotalTicks < 1) moveTotalTicks = 1;
      deltaLat = (destLat - moveStart.lat) / moveTotalTicks;
      deltaLng = (destLng - moveStart.lng) / moveTotalTicks;
      moving = true;
      currentTick = 0;
      moveDestGlobal = L.latLng(destLat, destLng); // Store as LatLng object
      dialog.style.display = 'none';
    };
    document.getElementById('cancel-move').onclick = function() {
      dialog.style.display = 'none';
    };
  }

  // Haversine formula to get distance in miles
  function getDistanceInMiles(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    var R = 3958.8; // radius of Earth in miles
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // --- Event Listeners ---
  // Home button click
  const homeButton = document.querySelector('#bottom-buttons button:nth-child(1)');
  if (homeButton) {
      homeButton.addEventListener('click', function() {
          map.setView([40.1568, -105.1040], map.getZoom());
          confirmMove(40.1568, -105.1040);
      });
  }

  // Clicking on map to move
  map.on('click', function(e) {
    confirmMove(e.latlng.lat, e.latlng.lng);
  });

  // --- Game Time & Movement Ticks ---
  var gameTime = new Date();
  gameTime.setHours(12, 0, 0, 0); // Start at noon

  function updateGameTime() {
    gameTime.setMinutes(gameTime.getMinutes() + 1); // Advance 1 minute per second
    var hours = gameTime.getHours();
    var minutes = gameTime.getMinutes();
    var ampm = (hours >= 12) ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    var minutesStr = (minutes < 10) ? ('0' + minutes) : minutes;
    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutesStr} ${ampm}`;
    }

    // Move player if moving
    if (moving && moveDestGlobal) {
      if (currentTick < moveTotalTicks) {
        var newLat = playerMarker.getLatLng().lat + deltaLat;
        var newLng = playerMarker.getLatLng().lng + deltaLng;
        playerMarker.setLatLng([newLat, newLng]);
        currentTick++;
      } else {
        // Ensure final position is exact destination
        playerMarker.setLatLng(moveDestGlobal);
        moving = false;
        moveDestGlobal = null;
        console.log("Player arrived at destination.");
      }
    }
  }
  updateGameTime(); // Initial display
  setInterval(updateGameTime, 1000); // Update every second

  // --- Random Events ---
  window.randomEvents = {}; // Global store for event markers

  var eventIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Question mark icon
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  function spawnEvent() {
    // Spawn east of the wall
    var lat = Math.random() * (41 - 37) + 37; // Latitude range for CO
    var lng = Math.random() * ((-102) - (-105.616)) + (-105.616); // Longitude east of the wall

    var eventId = 'event-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    var eventMarker = L.marker([lat, lng], {icon: eventIcon}).addTo(map);
    var popupContent = `
      <div class="event-popup" id="${eventId}">
        <h3>Random Event</h3>
        <p>An event has occurred here.</p>
        <button data-action="action1">Action 1</button>
        <button data-action="action2">Action 2</button>
        <button data-action="close">Close</button>
      </div>
    `;
    eventMarker.bindPopup(popupContent);

    window.randomEvents[eventId] = eventMarker; // Store marker reference

    // Add event listener for popup content actions *after* it opens
    eventMarker.on('popupopen', function() {
      const popupElement = document.getElementById(eventId);
      if (popupElement) {
        popupElement.querySelector('[data-action="action1"]').onclick = () => alert('Action 1 triggered!');
        popupElement.querySelector('[data-action="action2"]').onclick = () => alert('Action 2 triggered!');
        popupElement.querySelector('[data-action="close"]').onclick = () => {
          if (map.hasLayer(eventMarker)) {
            map.removeLayer(eventMarker);
          }
          delete window.randomEvents[eventId];
        };
      }
    });

    // Remove event after 60 seconds (1 in-game hour)
    setTimeout(function() {
      if (window.randomEvents[eventId] && map.hasLayer(window.randomEvents[eventId])) {
        map.removeLayer(window.randomEvents[eventId]);
        delete window.randomEvents[eventId];
        console.log(`Event ${eventId} expired.`);
      }
    }, 60000);
     console.log(`Spawned Event ${eventId} at [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
  }

  function spawnAndSchedule() {
    spawnEvent();
    scheduleNextEvent();
  }

  function scheduleNextEvent() {
    var nextDelay = Math.random() * 30000 + 20000; // 20-50 seconds
    setTimeout(spawnAndSchedule, nextDelay);
     console.log(`Next event scheduled in ${Math.round(nextDelay/1000)}s`);
  }

  // Start the event spawning cycle
  spawnAndSchedule();

  console.log("Map and game logic initialized.");
}); // End DOMContentLoaded