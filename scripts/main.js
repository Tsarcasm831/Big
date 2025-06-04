//main.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map with all zoom animations disabled and minZoom set to 4
  var map = L.map('map', {
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false,
    worldCopyJump: true,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1.0,
    minZoom: 4,  // Prevents zooming out beyond level 4
    preferCanvas: true,  // Use Canvas renderer for better performance
    renderer: L.canvas(),  // Force canvas renderer
    doubleClickZoom: false  // Disable the default double-click zoom
  }).setView([40.1673, -105.1019], 13);

  window.gameResources = {
    steel: 100,
    circuits: 50,
    fuel: 30,
    rareMetals: 10
};

  var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors',
    noWrap: false
  });
  var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Imagery Esri',
    noWrap: false
  });
  var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: ' <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    noWrap: false
  });
  satelliteLayer.addTo(map);
  var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Satellite": satelliteLayer,
    "Topographic": topoLayer
  };
  L.control.layers(baseMaps).addTo(map);
  
  // Add map click handler to allow player movement
  map.on('dblclick', function(e) {
    confirmMove(e.latlng.lat, e.latlng.lng);
  });

  // "The wall": red dashed polyline
  var wallCoords = [
    [31.0, -105.616],
    [41.0, -105.616],
    [41.0, -104.0],
    [49.0, -104.0]
  ];
  L.polyline(wallCoords, {color: 'red', weight: 4, dashArray: '10, 10'}).addTo(map);

  // FDG territory
  var fdgCoords = [
    [32.5, -117.1],
    [33.7, -118.2],
    [34.0, -120.0],
    [36.8, -121.8],
    [38.5, -123.0],
    [41.0, -124.2],
    [43.8, -124.2],
    [46.0, -124.0],
    [49.0, -124.7],
    [49.0, -104.0],
    [41.0, -104.0],
    [41.0, -105.616],
    [31.0, -105.616]
  ];
  var fdgPolygon = L.polygon(fdgCoords, {
    color: 'darkgreen',
    fillColor: 'darkgreen',
    fillOpacity: 0.5
  }).addTo(map);

  // FDG logo (fixed 80×80)
  var fdgBounds = fdgPolygon.getBounds();
  var fdgCenter = fdgBounds.getCenter();
  var fdgLogoImg = new Image();
  fdgLogoImg.onload = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 80;
    canvas.height = 80;
    ctx.drawImage(fdgLogoImg, 0, 0, 80, 80);
    var fdgLogoIcon = L.divIcon({
      html:
        '<div style="width:80px;height:80px;background:rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;">' +
        '<img src="' + canvas.toDataURL() + '" style="max-width:100%;max-height:100%;" alt="FDG Logo"></div>',
      className: '',
      iconSize: [80,80]
    });
    L.marker(fdgCenter, { icon: fdgLogoIcon, interactive: false }).addTo(map);
  };
  fdgLogoImg.crossOrigin = "anonymous";
  fdgLogoImg.src = "https://file.garden/Zy7B0LkdIVpGyzA1/2DSprites/FGD.webp";

  // H.I.V.E. border and territory
  var hiveBorderCoords = [
    [49.0, -95.20],
    [47.21, -95.20],
    [45.0, -93.0],
    [43.0, -91.0],
    [38.63, -90.20],
    [35.15, -90.05],
    [29.95, -90.07]
  ];
  var hiveBorder = L.polyline(hiveBorderCoords, {color: 'yellow', weight: 4}).addTo(map);
  hiveBorder.bindTooltip("H.I.V.E. Border", {permanent: true, className: "border-label", offset: [0, -10]});

  var hiveCoords = [
    [49.0, -95.20],
    [47.21, -95.20],
    [45.0, -93.0],
    [43.0, -91.0],
    [38.63, -90.20],
    [35.15, -90.05],
    [29.95, -90.07],
    [29.95, -85.0],
    [35.0, -75.0],
    [40.0, -70.0],
    [45.0, -66.0],
    [49.0, -65.0],
    [49.0, -95.20]
  ];
  var hivePolygon = L.polygon(hiveCoords, {
    color: 'yellow',
    fillColor: 'yellow',
    fillOpacity: 0.5
  }).addTo(map);

  // H.I.V.E. logo (fixed 80×80)
  var hiveBounds = hivePolygon.getBounds();
  var hiveCenter = hiveBounds.getCenter();
  var hiveLogoImg = new Image();
  hiveLogoImg.onload = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 80;
    canvas.height = 80;
    ctx.drawImage(hiveLogoImg, 0, 0, 80, 80);
    var hiveLogoIcon = L.divIcon({
      html:
        '<div style="width:80px;height:80px;background:rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;">' +
        '<img src="' + canvas.toDataURL() + '" style="max-width:100%;max-height:100%;" alt="HIVE Logo"></div>',
      className: '',
      iconSize: [80,80]
    });
    L.marker(hiveCenter, { icon: hiveLogoIcon, interactive: false }).addTo(map);
  };
  hiveLogoImg.crossOrigin = "anonymous";
  hiveLogoImg.src = "https://file.garden/Zy7B0LkdIVpGyzA1/2DSprites/HIVE.webp";

  // Player marker at Longmont
  var playerIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    iconSize: [32,32],
    iconAnchor: [16,16]
  });
  var playerMarker = createWrappingMarker([40.1568, -105.1040], {icon: playerIcon, draggable: true});

  // Make map and playerMarker globally accessible for other modules
  window.map = map;
  window.playerMarker = playerMarker;

  // Home marker using a house icon
  var houseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
  var houseMarker = createWrappingMarker([40.1568, -105.1040], {icon: houseIcon});
  houseMarker.bindPopup('<b>Return Home</b>');
  houseMarker.on('click', function() {
    map.setView([40.1568, -105.1040], map.getZoom());
    // Use the same logic as the bottom button
    handleHomeButtonClick();
  });

  // White-horse marker
  var whiteHorseIcon = L.icon({
    iconUrl: 'assets/white_horse_nobg.png',
    iconSize: [32,32],
    iconAnchor: [16,16],
    className: 'white-horse'
  });
  var whiteHorseMarker = createWrappingMarker([39.7439, -105.0201], {icon: whiteHorseIcon})
    .bindPopup("White Horse at Invesco Field", {autoClose: true, closeOnClick: true});

  // Blue-horse marker
  var blueHorseIcon = L.icon({
    iconUrl: 'assets/blue_horse_nobg.png',
    iconSize: [32,32],
    iconAnchor: [16,16],
    className: 'blue-horse'
  });
  var blueHorseMarker = createWrappingMarker([39.8561, -104.6737], {icon: blueHorseIcon})
    .bindPopup("Blue Horse at DIA", {autoClose: true, closeOnClick: true});

  // Adding a marker for prosperity at Boulder, Colorado
  var prosperityMarker = createWrappingMarker([40.0150, -105.2705], {
    icon: L.icon({
      iconUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/2DSprites/prosperity.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'prosperity'
    })
  }).bindPopup('Prosperity');

  // Resource markers for the Forge workshop
  // Steel deposit at industrial site
  var steelMarker = createWrappingMarker([40.4233, -104.7091], {
    icon: L.icon({ 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2454/2454282.png', 
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).bindPopup('Steel Deposit: +50 Steel').on('click', function() {
    if (window.forgeWorkshop) {
      window.forgeWorkshop.resources.steel += 50;
      // Update display if forge is open
      const steelElement = document.getElementById('res-steel');
      if (steelElement) {
        steelElement.textContent = window.forgeWorkshop.resources.steel;
      }
      alert('Collected 50 Steel for the Forge!');
    }
  });

  // Rare Metals at Area 51
  var rareMetalsMarker = createWrappingMarker([37.2431, -115.7930], {
    icon: L.icon({ 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3547/3547982.png', 
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).bindPopup('Rare Metals: +15 Rare Metals').on('click', function() {
    if (window.forgeWorkshop) {
      window.forgeWorkshop.resources.rareMetals += 15;
      // Update display if forge is open
      const metalsElement = document.getElementById('res-rareMetals');
      if (metalsElement) {
        metalsElement.textContent = window.forgeWorkshop.resources.rareMetals;
      }
      alert('Collected 15 Rare Metals for the Forge!');
    }
  });

  // Circuits at Spyder's Tech Hub (using an existing location)
  var circuitsMarker = createWrappingMarker([39.7513, -104.9922], {
    icon: L.icon({ 
      iconUrl: 'https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/glbs/circuits.ico', 
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).bindPopup('Circuits: +30 Circuits').on('click', function() {
    if (window.forgeWorkshop) {
      window.forgeWorkshop.resources.circuits += 30;
      // Update display if forge is open
      const circuitsElement = document.getElementById('res-circuits');
      if (circuitsElement) {
        circuitsElement.textContent = window.forgeWorkshop.resources.circuits;
      }
      alert('Collected 30 Circuits for the Forge!');
    }
  });

  // Fuel at gas station
  var fuelMarker = createWrappingMarker([39.9526, -104.7764], {
    icon: L.icon({ 
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2930/2930949.png', 
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).bindPopup('Fuel: +25 Fuel').on('click', function() {
    if (window.forgeWorkshop) {
      window.forgeWorkshop.resources.fuel += 25;
      // Update display if forge is open
      const fuelElement = document.getElementById('res-fuel');
      if (fuelElement) {
        fuelElement.textContent = window.forgeWorkshop.resources.fuel;
      }
      alert('Collected 25 Fuel for the Forge!');
    }
  });

  // Adding a marker for New LA in Los Angeles
  var newLAMarker = createWrappingMarker([34.0522, -118.2437], {}).bindPopup('New LA');

  // Adding a marker for Silver City in Philadelphia
  var silverCityMarker = createWrappingMarker([39.9526, -75.1652], {}).bindPopup('Silver City');

  // Adding a marker for Area 51 in Roswell, NM
  var area51Marker = createWrappingMarker([33.3943, -104.5230], {}).bindPopup('Area 51');

  // Adding a marker for Kansas City
  var kansasCityMarker = createWrappingMarker([39.0997, -94.5786], {}).bindPopup('Kansas City');

  // Adding a marker for Houston
  var houstonMarker = createWrappingMarker([29.7604, -95.3698], {}).bindPopup('Houston');

  // Adding a marker for Sioux Falls
  var siouxFallsMarker = createWrappingMarker([43.5446, -96.7311], {}).bindPopup('Sioux Falls');

  // Adding a marker for Loveland, Colorado
  var lovelandMarker = createWrappingMarker([40.3970, -105.0740], {}).bindPopup('Loveland, CO');

  // Adding a marker for Greeley, Colorado
  var greeleyMarker = createWrappingMarker([40.4233, -104.7091], {}).bindPopup('Greeley, CO');

  // Adding a marker for Brighton, Colorado
  var brightonMarker = createWrappingMarker([39.9930, -104.8116], {}).bindPopup('Brighton, CO');

  // Adding a marker for New Cheyenne in Cheyenne, WY
  var newCheyenneMarker = createWrappingMarker([41.1399, -104.8202], {}).bindPopup('New Cheyenne');

  // Custom green icon for NORAD
  var greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  // Adding a marker for NORAD Command in Colorado Springs
  var noradMarker = createWrappingMarker([38.9072, -104.8824], {icon: greenIcon}).bindPopup('NORAD Command');

  // Function to create government facility markers
  function createGovMarker(lat, lng, name) {
    var marker = createWrappingMarker([lat, lng], {
      icon: L.divIcon({
        className: 'gov-marker',
        html: '<div style="width:16px;height:16px;background-color:#ff0000;border:2px solid #fff;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.7);"></div>',
        iconSize: [16, 16]
      })
    });
    marker.bindTooltip(name, {permanent: false, direction: 'top', className: 'gov-facility-label', offset: [0, -10]});
    marker.bindPopup('<div class="gov-facility-popup"><strong>' + name + '</strong><br>Government Facility</div>', {autoClose: true, closeOnClick: true});
    return marker;
  }
  
  // Government facility markers
  // 1. Cheyenne Mountain Complex (near Colorado Springs)
  var secretMarker1 = createGovMarker(38.7910, -104.7020, 'Cheyenne Mountain Complex');

  // 2. Raven Rock Mountain Complex (approximate)
  var secretMarker2 = createGovMarker(39.0000, -77.5000, 'Raven Rock Mountain Complex');

  // 3. Mount Weather Emergency Operations Center (Virginia)
  var secretMarker3 = createGovMarker(39.1292, -77.6140, 'Mount Weather Emergency Operations Center');

  // 4. The Greenbrier Bunker (West Virginia)
  var secretMarker4 = createGovMarker(37.7879, -80.3440, 'The Greenbrier Bunker');

  // 5. Site R (Alternate National Military Command Center)
  var secretMarker5 = createGovMarker(39.0458, -77.9794, 'Site R (Alternate NMCC)');

  // 6. Fort Detrick (Maryland)
  var secretMarker6 = createGovMarker(39.4100, -77.4100, 'Fort Detrick');

  // 7. Dugway Proving Ground (Utah)
  var secretMarker7 = createGovMarker(40.2500, -112.7500, 'Dugway Proving Ground');

  // 8. Redstone Arsenal (Alabama)
  var secretMarker8 = createGovMarker(34.7300, -86.6000, 'Redstone Arsenal');

  // 9. Wright-Patterson Air Force Base (Ohio)
  var secretMarker9 = createGovMarker(39.9000, -84.2000, 'Wright-Patterson AFB');

  // 10. Los Alamos National Laboratory (New Mexico)
  var secretMarker10 = createGovMarker(35.8800, -106.3000, 'Los Alamos National Laboratory');

  // 11. Oak Ridge National Laboratory (Tennessee)
  var secretMarker11 = createGovMarker(36.0100, -84.2700, 'Oak Ridge National Laboratory');

  // 12. Fort Meade (NSA, Maryland)
  var secretMarker12 = createGovMarker(39.1300, -77.1481, 'Fort Meade (NSA)');

  // 13. The Pentagon (Washington, DC)
  var secretMarker13 = createGovMarker(38.8719, -77.0563, 'The Pentagon');

  // 14. Camp Hero (Montauk, New York)
  var secretMarker14 = createGovMarker(41.0339, -71.8750, 'Camp Hero');

  // 15. Holloman Air Force Base (New Mexico)
  var secretMarker15 = createGovMarker(32.8750, -106.0000, 'Holloman AFB');

  // 16. Vandenberg Air Force Base (California)
  var secretMarker16 = createGovMarker(34.7420, -120.5724, 'Vandenberg AFB');

  // 17. Edwards Air Force Base (California)
  var secretMarker17 = createGovMarker(34.9054, -117.8830, 'Edwards AFB');

  // 18. White Sands Missile Range (New Mexico)
  var secretMarker18 = createGovMarker(32.4000, -106.5000, 'White Sands Missile Range');

  // 19. Fort Bliss (Texas)
  var secretMarker19 = createGovMarker(31.7619, -106.4850, 'Fort Bliss');

  // 20. Camp David (Secret Retreat, Maryland)
  var secretMarker20 = createGovMarker(39.6470, -77.7370, 'Camp David');

  // 21. Fort Gordon (NSA, Georgia)
  var secretMarker21 = createGovMarker(33.4400, -82.0100, 'Fort Gordon (NSA)');

  // 22. NAS Patuxent River (Secret Research, Maryland)
  var secretMarker22 = createGovMarker(38.3500, -76.4000, 'NAS Patuxent River');

  // 23. Peterson Air Force Base (Colorado)
  var secretMarker23 = createGovMarker(39.6000, -104.7000, 'Peterson AFB');

  // 24. Fort Irwin National Training Center (California)
  var secretMarker24 = createGovMarker(35.3000, -116.0000, 'Fort Irwin NTC');

  // 25. Camp Lejeune (North Carolina)
  var secretMarker25 = createGovMarker(34.6800, -76.8000, 'Camp Lejeune');
  
  // Function to view a specific gov facility
  function viewGovFacility(facilityNumber) {
    if (facilityNumber >= 1 && facilityNumber <= 25) {
      var markerVar = eval('secretMarker' + facilityNumber);
      var markerPos = markerVar.getLatLng();
      map.setView([markerPos.lat, markerPos.lng], 8);
      console.log('Centered on facility #' + facilityNumber);
    }
  }

  // Movement logic
  var moving = false, moveTotalTicks = 0, currentTick = 0;
  var moveDestGlobal = null; // Define moveDestGlobal variable globally
  
  // Default global player travel speed variable
  window.playerTravelSpeed = 5; // Default speed in miles per tick
  
  // Confirm-move function
  function confirmMove(destLat, destLng) {
    if (moving) return;
    
    var startLat = playerMarker.getLatLng().lat;
    var startLng = playerMarker.getLatLng().lng;
    
    // Distance calculation using Haversine formula (miles)
    var distanceMiles = getDistanceInMiles(startLat, startLng, destLat, destLng);
    
    // Show dialog with distance
    var dialog = document.getElementById('move-confirmation-dialog');
    dialog.querySelector('p').textContent = 
      `Do you want to move there? (Distance: ${distanceMiles.toFixed(1)} miles)`;
    dialog.style.display = 'block';
    
    document.getElementById('confirm-move').onclick = function() {
      dialog.style.display = 'none';
      
      // Start movement animation
      moving = true;
      
      // Calculate total ticks based on distance and player's travel speed
      moveTotalTicks = Math.ceil(distanceMiles / window.playerTravelSpeed);
      moveDestGlobal = { lat: destLat, lng: destLng }; // Store destination globally
      currentTick = 0;
      
      // Check if road following mode is active
      if (window.RoadMode && window.RoadMode.isRoadFollowingMode()) {
        console.log("Using road following mode");
        // Create a route using road-following mode
        window.RoadMode.createRoadRoute(
          map, 
          startLat, 
          startLng, 
          destLat, 
          destLng, 
          timeSpeed, 
          gameTime,
          function(ticks) { 
            moveTotalTicks = ticks;
            console.log("Route created, total ticks:", ticks);
          }
        );
      } else {
        console.log("Using direct movement mode");
        // Animation frame for direct movement
        function moveStep() {
          currentTick++;
          
          // Calculate interpolation amount
          var fractionDone = currentTick / moveTotalTicks;
          
          if (fractionDone >= 1) {
            // Final position
            playerMarker.setLatLng([destLat, destLng]);
            // Check if the marker is visible without using _checkIfVisible
            map.getBounds().contains(playerMarker.getLatLng());
            moving = false;
            
            // Check if arriving at a location of interest
            checkLocation(destLat, destLng);
            
            // Check if we should update bottom buttons visibility
            updateBottomButtonsVisibility();
            
            return;
          }
          
          // Interpolate position
          var newLat = startLat + fractionDone * (destLat - startLat);
          var newLng = startLng + fractionDone * (destLng - startLng);
          
          // Update marker position
          playerMarker.setLatLng([newLat, newLng]);
          // Check if the marker is visible without using _checkIfVisible
          map.getBounds().contains(playerMarker.getLatLng());
          
          // Continue animation in the next tick
          setTimeout(moveStep, 1000);
        }
        
        // Start direct movement animation
        moveStep();
      }
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
  
  // Function to check if player has arrived at a location of interest
  function checkLocation(lat, lng) {
    console.log("Checking location:", lat, lng);
    
    // Define points of interest and their coordinates
    const pointsOfInterest = [
      { name: "Prosperity", lat: 40.0150, lng: -105.2705, threshold: 0.2 },
      { name: "New LA", lat: 34.0522, lng: -118.2437, threshold: 0.2 },
      { name: "Silver City", lat: 39.9526, lng: -75.1652, threshold: 0.2 },
      { name: "Area 51", lat: 33.3943, lng: -104.5230, threshold: 0.2 },
      { name: "Kansas City", lat: 39.0997, lng: -94.5786, threshold: 0.2 },
      { name: "Houston", lat: 29.7604, lng: -95.3698, threshold: 0.2 },
      { name: "Sioux Falls", lat: 43.5446, lng: -96.7311, threshold: 0.2 },
      { name: "Loveland", lat: 40.3970, lng: -105.0740, threshold: 0.2 },
      { name: "Greeley", lat: 40.4233, lng: -104.7091, threshold: 0.2 },
      { name: "Brighton", lat: 39.9930, lng: -104.8116, threshold: 0.2 },
      { name: "New Cheyenne", lat: 41.1399, lng: -104.8202, threshold: 0.2 },
      { name: "NORAD Command", lat: 38.9072, lng: -104.8824, threshold: 0.2 },
      { name: "Blue Horse", lat: 39.8561, lng: -104.6737, threshold: 0.1 },
      { name: "White Horse", lat: 39.7439, lng: -105.0201, threshold: 0.1 }
    ];
    
    // Check each point of interest
    for (const poi of pointsOfInterest) {
      const distance = getDistanceInMiles(lat, lng, poi.lat, poi.lng);
      
      // If within threshold distance, trigger location event
      if (distance <= poi.threshold) {
        console.log(`Arrived at ${poi.name}`);
        
        // Show notification
        alert(`You have arrived at ${poi.name}`);
        
        // Dispatch a custom event for location arrival
        document.dispatchEvent(new CustomEvent('locationArrival', {
          detail: {
            location: poi.name,
            coordinates: { lat: poi.lat, lng: poi.lng }
          }
        }));
        
        // Only trigger for the closest POI if multiple are in range
        break;
      }
    }
  }

  // Game time & movement ticks (1 second = 1 in-game minute)
  var gameTime = new Date(2012, 0, 1, 12, 0, 0, 0); // Start from Jan 1, 2012 at 12:00 PM
  
  // Time control variables
  var timeRunning = true;
  var timeSpeed = 1; // 1 = normal, 2 = 2x speed, 3 = 3x speed
  var timeInterval;
  var lastGameTimeUpdate = 0; // Track when we last sent a gameTimeUpdated event

  function updateGameTime() {
    // Save previous hour for change detection
    var previousHour = gameTime.getHours();
    var previousDay = gameTime.getDate();
    
    // Only advance time if not paused
    if (timeRunning) {
      // Advance game time by 1, 2, or 3 minutes each second based on timeSpeed
      gameTime.setMinutes(gameTime.getMinutes() + timeSpeed);
    }
    
    var hours = gameTime.getHours();
    var minutes = gameTime.getMinutes();
    var ampm = (hours >= 12) ? 'PM' : 'AM';
    var displayHours = hours % 12;
    displayHours = displayHours ? displayHours : 12;
    var minutesStr = (minutes < 10) ? ('0' + minutes) : minutes;
    
    // Format date string: Month Day, Year
    var month = gameTime.toLocaleString('default', { month: 'short' });
    var day = gameTime.getDate();
    var year = gameTime.getFullYear();
    var dateStr = month + ' ' + day + ', ' + year;
    
    // Display time and date
    document.getElementById('time-display').textContent = dateStr + ' ' + displayHours + ':' + minutesStr + ' ' + ampm;
    
    // Emit gameTimeUpdated event every tick (useful for live UI updates)
    // Throttle to every 5 seconds of real time to avoid spam
    if (Math.floor(Date.now() / 5000) !== lastGameTimeUpdate) {
      lastGameTimeUpdate = Math.floor(Date.now() / 5000);
      document.dispatchEvent(new CustomEvent('gameTimeUpdated', {
        detail: {
          gameTime: new Date(gameTime),
          realTime: Date.now()
        }
      }));
    }
    
    // Detect hour changes and emit an event
    if (hours !== previousHour || day !== previousDay) {
      console.log(`Hour changed: ${previousHour} -> ${hours}`);
      document.dispatchEvent(new CustomEvent('gameHourChanged', { 
        detail: { 
          hour: hours,
          day: day,
          previous: previousHour,
          gameTime: new Date(gameTime)
        } 
      }));
    }

    // If moving, move step by step
    if (moving && moveDestGlobal) {
      if (window.RoadMode && window.RoadMode.isRoadFollowingMode()) {
        // Use road following mode from the RoadMode module
        const arrived = window.RoadMode.updateRoadPosition(
          playerMarker, 
          timeRunning, 
          timeSpeed, 
          moveTotalTicks, 
          function(tick) { currentTick = tick; }, 
          updateBottomButtonsVisibility, 
          moveDestGlobal, 
          map
        );
        
        if (arrived) {
          moving = false;
          console.log("Arrived at destination via road mode");
          
          // Check if arriving at a location of interest
          if (typeof checkLocation === 'function') {
            checkLocation(moveDestGlobal.lat, moveDestGlobal.lng);
          }
          
          // Close ETA popup
          if (etaPopupGlobal) {
            map.closePopup(etaPopupGlobal);
            etaPopupGlobal = null;
          }
        }
      } else {
        // Original direct movement logic
        if (currentTick < moveTotalTicks) {
          // Calculate how many steps to advance based on timeSpeed
          let stepsToAdvance = timeRunning ? timeSpeed : 0;
          
          // Get start and destination positions
          var startLat = playerMarker.getLatLng().lat;
          var startLng = playerMarker.getLatLng().lng;
          var destLat = moveDestGlobal.lat;
          var destLng = moveDestGlobal.lng;
          
          // Calculate delta per step
          var deltaLat = (destLat - startLat) / moveTotalTicks;
          var deltaLng = (destLng - startLng) / moveTotalTicks;
          
          // Move player multiple steps based on timeSpeed
          for (let i = 0; i < stepsToAdvance && currentTick < moveTotalTicks; i++) {
            var newLat = playerMarker.getLatLng().lat + deltaLat;
            var newLng = playerMarker.getLatLng().lng + deltaLng;
            playerMarker.setLatLng([newLat, newLng]);
            currentTick++;
          }
          
          // Check player location and update buttons visibility
          updateBottomButtonsVisibility();
        } else {
          // Arrived
          playerMarker.setLatLng([moveDestGlobal.lat, moveDestGlobal.lng]);
          moving = false;
          console.log("Arrived at destination via direct mode");
          
          // Check if arriving at a location of interest
          if (typeof checkLocation === 'function') {
            checkLocation(moveDestGlobal.lat, moveDestGlobal.lng);
          }
          
          // Check player location and update buttons visibility
          updateBottomButtonsVisibility();
          
          // Close ETA popup
          if (etaPopupGlobal) {
            map.closePopup(etaPopupGlobal);
            etaPopupGlobal = null;
          }
        }
      }
    }
  }
  updateGameTime();
  timeInterval = setInterval(updateGameTime, 1000);
  
  // Time control buttons
  document.getElementById('pause-time-btn').addEventListener('click', function() {
    timeRunning = !timeRunning;
    this.textContent = timeRunning ? '⏸️' : '▶️';
  });
  
  document.getElementById('fast-forward-btn').addEventListener('click', function() {
    if (timeSpeed >= 3) {
      timeSpeed = 1; // Reset to normal speed
      this.textContent = '⏩';
    } else {
      timeSpeed++;
      this.textContent = timeSpeed === 2 ? '⏩⏩' : '⏩⏩⏩';
    }
  });

  // --- Home Button & Popup Logic ---
  // Define home coordinates
  const homeLat = 40.1568, homeLng = -105.1040;
  
  // Function to check if player is at home and update bottom buttons visibility
  function updateBottomButtonsVisibility() {
    const currentPos = playerMarker.getLatLng();
    const distanceFromHome = getDistanceInMiles(currentPos.lat, currentPos.lng, homeLat, homeLng);
    const isAtHome = distanceFromHome < 0.001;
    
    // Get all buttons except the first one (Home button)
    const bottomButtons = document.querySelectorAll('#bottom-buttons button:not(:first-child)');
    
    // Show all buttons if at home, hide them if not at home
    bottomButtons.forEach(button => {
      button.style.display = isAtHome ? 'inline-block' : 'none';
    });
  }

  // Function to open the home scene popup
  function openHomeScenePopup() {
    // Create or get overlay
    let overlay = document.getElementById('home-scene-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'home-scene-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '2.5%',
            left: '2.5%',
            width: '95%',
            height: '95%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: '1000',
            display: 'none'
        });
        document.body.appendChild(overlay);
    }
    // Create or get backdrop
    let backdrop = document.getElementById('home-scene-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'home-scene-backdrop';
        Object.assign(backdrop.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '999',
            display: 'none'
        });
        document.body.appendChild(backdrop);
    }
    // Initialize popup contents once, preserving iframe between opens
    if (!overlay.dataset.initialized) {
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '1001'
        });
        closeBtn.onclick = () => {
            overlay.style.display = 'none';
            backdrop.style.display = 'none';
        };
        overlay.appendChild(closeBtn);
        // Iframe to home game
        const iframe = document.createElement('iframe');
        iframe.id = 'home-scene-iframe';
        iframe.src = 'home/index.html';
        Object.assign(iframe.style, { width: '100%', height: '100%', border: 'none' });
        overlay.appendChild(iframe);
        overlay.dataset.initialized = 'true';
    }
    // Show
    overlay.style.display = 'block';
    backdrop.style.display = 'block';
  }
  
  // Unified home button click handler
  function handleHomeButtonClick() {
    const currentPos = playerMarker.getLatLng();
    const distanceFromHome = getDistanceInMiles(currentPos.lat, currentPos.lng, homeLat, homeLng);
    
    // If player is already at home (within ~0.001 miles), open the home scene popup.
    if (distanceFromHome < 0.001) {
      openHomeScenePopup();
    } else {
      map.setView([homeLat, homeLng], map.getZoom());
      confirmMove(homeLat, homeLng);
    }
  }

  // Attach the home button click handler to the bottom buttons' first button
  document.querySelector('#bottom-buttons button:nth-child(1)').addEventListener('click', handleHomeButtonClick);
  
  // Attach Forge handler to the button with data-forge attribute
  document.querySelector('#bottom-buttons button[data-forge]').addEventListener('click', function() {
    // Dispatch custom event to open the forge workshop
    document.dispatchEvent(new Event('openForgeWorkshop'));
  });
  
  // Attach Squad Management handler to the third button
  document.querySelector('#bottom-buttons button:nth-child(3)').addEventListener('click', function() {
    // Initialize and open the squad management interface
    if (window.squadManagement) {
      window.squadManagement.initialize();
      window.squadManagement.open();
    } else {
      console.error('Squad management module not loaded');
    }
  });
  
  // Attach Lighthouse handler to the lighthouse button
  document.querySelector('#bottom-buttons button:nth-child(10)').addEventListener('click', function() {
    // Open Lord Tsarcasm's House in a popup overlay
    let overlay = document.createElement('div');
    overlay.id = 'lthouse-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      background: white;
      z-index: 1000;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      overflow: hidden;
    `;
    
    let backdrop = document.createElement('div');
    backdrop.id = 'lthouse-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    
    let iframe = document.createElement('iframe');
    iframe.src = 'lthouse/index.html';
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;
    
    let closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: #000;
      font-size: 24px;
      cursor: pointer;
      z-index: 1001;
    `;
    
    closeBtn.addEventListener('click', function() {
      document.body.removeChild(overlay);
      document.body.removeChild(backdrop);
    });
    
    overlay.appendChild(iframe);
    overlay.appendChild(closeBtn);
    document.body.appendChild(backdrop);
    document.body.appendChild(overlay);
  });
  
  // Initialize bottom buttons visibility based on starting position
  updateBottomButtonsVisibility();

  // Initialize road-following mode
  var etaPopupGlobal = null;
  
  // Initialize the road mode
  RoadMode.initRoadMode(map);
  
  // Create event icon for random encounters
  var eventIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5899/5899715.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Initialize random encounters
  RandomEncounters.init(map, playerMarker);
  
  // Optimize redrawing on zoom
  const optimizedRedraw = (function() {
    let pendingRedraw = false;
    
    return function() {
      if (!pendingRedraw) {
        pendingRedraw = true;
        
        requestAnimationFrame(() => {
          // Refresh all active markers when zooming or panning
          if (window.RandomEncounters && window.RandomEncounters.getActiveMarkers) {
            const activeMarkers = window.RandomEncounters.getActiveMarkers();
            activeMarkers.forEach(marker => {
              // Bring marker to front and ensure visibility
              if (marker && marker._path) {
                // For SVG circle markers
                marker._path.classList.add('pulse-circle');
                
                // Add encounter-specific pulse class if it exists
                if (marker.encounterType) {
                  marker._path.classList.add(`encounter-${marker.encounterType.toLowerCase()}-pulse`);
                }
                
                marker.bringToFront();
              }
            });
          }
          pendingRedraw = false;
        });
      }
    };
  })();

  // Make sure random encounters stay visible on zoom and move
  map.on('zoomend moveend', optimizedRedraw);
  
  // Listen for nonCombatEncounterEngaged event
  document.addEventListener('nonCombatEncounterEngaged', function(e) {
    console.log('Non-combat encounter engaged in main.js:', e.detail.encounterType);
    
    // Handle special non-combat encounter types
    switch (e.detail.encounterType) {
      case 'STRANGE_ARTIFACT':
        // Show a specific UI for artifact discovery
        displayArtifactDiscovery(e.detail);
        break;
        
      case 'DERELICT_MECH':
        // Potentially add the mech to inventory or trigger a special event
        handleDerelictMech(e.detail);
        break;
        
      case 'NOMAD_CARAVAN':
        // Open trading interface
        openNomadTrading(e.detail);
        break;
        
      default:
        // For other non-combat encounters, show a dialog with description
        displayEncounterDialog(e.detail);
        break;
    }
  });
  
  // Simple placeholder functions for non-combat encounters
  function displayArtifactDiscovery(encounterDetails) {
    // For now, just show an alert with more detailed info
    alert(`You discovered a strange artifact!\n\n${encounterDetails.encounterInfo.description}\n\nYou might want to investigate this further at a research facility.`);
  }
  
  function handleDerelictMech(encounterDetails) {
    // For now, just show an alert with more detailed info
    alert(`You found a derelict mech!\n\n${encounterDetails.encounterInfo.description}\n\nWith some repairs, this could be valuable.`);
  }
  
  function openNomadTrading(encounterDetails) {
    // For now, just show an alert with more detailed info
    alert(`You encountered nomad traders!\n\n${encounterDetails.encounterInfo.description}\n\nThey might have rare items for sale.`);
  }
  
  function displayEncounterDialog(encounterDetails) {
    // For now, just show an alert with encounter info
    alert(`${encounterDetails.encounterInfo.name}\n\n${encounterDetails.encounterInfo.description}`);
  }

  // Add keyboard shortcut to spawn random encounters (for testing)
  document.addEventListener('keydown', function(e) {
    // Press 'E' key to spawn an encounter
    if (e.key === 'e' || e.key === 'E') {
      console.log('Manual spawn of random encounter triggered');
      if (typeof RandomEncounters.spawnEvent === 'function') {
        RandomEncounters.spawnEvent();
        // Alert to make it clear to the user
        alert("Random encounter spawned! Look for a pulsing marker on the map.");
      }
    }
    
    // Press 'C' key to spawn a combat encounter
    if (e.key === 'c' || e.key === 'C') {
      console.log('Manual spawn of combat encounter triggered');
      if (typeof RandomEncounters.spawnCombatEncounter === 'function') {
        RandomEncounters.spawnCombatEncounter();
        alert("Combat encounter spawned! Look for a pulsing combat marker on the map.");
      }
    }
    
    // Press 'N' key to spawn a non-combat encounter
    if (e.key === 'n' || e.key === 'N') {
      console.log('Manual spawn of non-combat encounter triggered');
      if (typeof RandomEncounters.spawnNonCombatEncounter === 'function') {
        RandomEncounters.spawnNonCombatEncounter();
        alert("Non-combat encounter spawned! Look for a pulsing green marker on the map.");
      }
    }
    
    // Press 'T' key to spawn the TopDown area encounter
    if (e.key === 't' || e.key === 'T') {
      console.log('Manual spawn of TopDown area encounter triggered');
      if (typeof RandomEncounters.spawnTopDownAreaEncounter === 'function') {
        RandomEncounters.spawnTopDownAreaEncounter();
        alert("TopDown area encounter spawned! Look for the purple pulsing marker on the map.");
      }
    }
  });

  steelMarker.on('click', function() {
    window.gameResources.steel += 50;
    if (window.forgeWorkshop && window.forgeWorkshop.container.style.display === 'block') {
        document.getElementById('res-steel').textContent = window.gameResources.steel;
    }
    alert('Collected 50 Steel!');
});

rareMetalsMarker.on('click', function() {
    window.gameResources.rareMetals += 15;
    if (window.forgeWorkshop && window.forgeWorkshop.container.style.display === 'block') {
        document.getElementById('res-rareMetals').textContent = window.gameResources.rareMetals;
    }
    alert('Collected 15 Rare Metals!');
});

circuitsMarker.on('click', function() {
    window.gameResources.circuits += 30;
    if (window.forgeWorkshop && window.forgeWorkshop.container.style.display === 'block') {
        document.getElementById('res-circuits').textContent = window.gameResources.circuits;
    }
    alert('Collected 30 Circuits!');
});

fuelMarker.on('click', function() {
    window.gameResources.fuel += 25;
    if (window.forgeWorkshop && window.forgeWorkshop.container.style.display === 'block') {
        document.getElementById('res-fuel').textContent = window.gameResources.fuel;
    }
    alert('Collected 25 Fuel!');
});

  document.addEventListener('travelSpeedUpgraded', (e) => {
    window.playerTravelSpeed *= e.detail.multiplier;
    console.log(`Travel speed increased to: ${window.playerTravelSpeed}`);
  });

  document.addEventListener('defenseUpgraded', (e) => {
      window.playerDefense = (window.playerDefense || 0) + e.detail.bonus;
      console.log(`Defense increased to: ${window.playerDefense}`);
  });

  document.addEventListener('damageUpgraded', (e) => {
      window.playerDamageBonus = (window.playerDamageBonus || 0) + e.detail.bonus;
      console.log(`Damage bonus increased to: ${window.playerDamageBonus}`);
  });

  document.addEventListener('outpostCreated', (e) => {
      const { lat, lng } = e.detail;
      const outpostIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/1632/1632670.png',
          iconSize: [32, 32]
      });
      if (window.createWrappingMarker) {
          window.createWrappingMarker([lat, lng], { icon: outpostIcon })
              .bindPopup('Mobile Outpost: Fast Travel Hub');
          console.log(`Outpost created at ${lat}, ${lng}`);
      }
  });

  // Function to handle marker wrapping across the date line
  function createWrappingMarker(latlng, options) {
    // Create the primary marker
    var marker = L.marker(latlng, options).addTo(map);
    
    // Store the original lat/lng
    var originalLatlng = L.latLng(latlng);
    
    // Create a duplicate marker for the wrapped world
    var wrappedLatlngEast = L.latLng(originalLatlng.lat, originalLatlng.lng + 360);
    var wrappedMarkerEast = L.marker(wrappedLatlngEast, options).addTo(map);
    
    // Create another duplicate marker for the wrapped world to the west
    var wrappedLatlngWest = L.latLng(originalLatlng.lat, originalLatlng.lng - 360);
    var wrappedMarkerWest = L.marker(wrappedLatlngWest, options).addTo(map);
    
    // Ensure popups are synchronized
    if (options && options.bindPopup) {
      wrappedMarkerEast.bindPopup(options.bindPopup);
      wrappedMarkerWest.bindPopup(options.bindPopup);
    }
    
    // Return the original marker for chaining
    return marker;
  }

});