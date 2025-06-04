// bills_car_lot.js
document.addEventListener('DOMContentLoaded', function() {
  // Inject custom styles if not already present
  if (!document.getElementById('bills-car-lot-styles')) {
    const style = document.createElement('style');
    style.id = 'bills-car-lot-styles';
    style.textContent = `
      .bills-modal-overlay { 
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        opacity: 0;
        animation: billsModalFadeIn 0.4s forwards;
      }
      .bills-modal-content {
        background: linear-gradient(135deg, #f0f0f0, #ffffff);
        padding: 20px;
        border-radius: 10px;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        animation: billsModalScaleIn 0.4s forwards;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .bills-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #333;
        transition: color 0.2s ease;
      }
      .bills-close-btn:hover {
        color: #3498db;
      }
      @keyframes billsModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes billsModalScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .bills-svg {
        border: 1px solid #aaa;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        background: #f9f9f9;
      }
      .bills-car {
        opacity: 0.8;
        transition: transform 0.3s ease, opacity 0.3s ease;
        cursor: pointer;
      }
      .bills-car:hover {
        opacity: 1;
        transform: scale(1.05);
      }
      .bills-parking-spot {
        transition: fill 0.2s ease;
        cursor: pointer;
      }
      .bills-parking-spot:hover {
        fill: #e0e0e0;
      }
      #bills-character {
        position: absolute;
        width: 30px;
        height: 30px;
        background-image: url('/assets/player.png');
        background-size: contain;
        background-repeat: no-repeat;
        z-index: 3100;
        transition: all 0.4s ease;
      }
      #bills-dialog {
        position: absolute;
        background: white;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 10px;
        max-width: 220px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        z-index: 3200;
        display: none;
        font-size: 14px;
      }
      .bills-interact-button {
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 10px;
        margin-right: 5px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .bills-interact-button:hover {
        background: #2980b9;
      }
      .bills-character-animation {
        animation: billsCharacterStep 0.4s infinite;
      }
      @keyframes billsCharacterStep {
        0% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
        100% { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Locate the "Bill's Car Lot" button by its text content
  const billsBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
    .find(btn => btn.textContent.trim() === "Bill's Car Lot");
  if (!billsBtn) {
    console.error("Bill's Car Lot button not found.");
    return;
  }

  // Create modal overlay container
  const popup = document.createElement('div');
  popup.id = 'bills-car-lot-popup';
  popup.className = 'bills-modal-overlay';
  popup.style.display = 'none'; // Initially hidden

  // Create inner content container
  popup.innerHTML = `
    <div id="bills-car-lot-content" class="bills-modal-content">
      <button id="bills-car-lot-close" class="bills-close-btn" aria-label="Close">&times;</button>
      <h2 style="text-align: center; margin-bottom: 10px;">Bill's Car Lot</h2>
      <div id="bills-lot-container" style="position: relative; width: 600px; height: 500px;">
        <svg class="bills-svg" width="600" height="500" viewBox="0 0 600 500">
          <!-- Background -->
          <rect x="0" y="0" width="600" height="500" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
          
          <!-- Car Lot Ground -->
          <rect x="20" y="20" width="560" height="400" fill="#A9A9A9" stroke="#333" stroke-width="1"/>
          
          <!-- Office Building -->
          <rect x="450" y="30" width="120" height="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <rect x="490" y="80" width="40" height="30" fill="#A0522D" stroke="#333"/>
          <text x="510" y="65" text-anchor="middle" fill="#FFF" font-size="16" font-family="Arial" font-weight="bold">
            Bill's Office
          </text>
          <circle cx="510" cy="45" r="15" fill="#FFD700" class="bills-car" data-item="bill"/>
          
          <!-- Parking Spots Row 1 -->
          <rect x="40" y="30" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="1"/>
          <rect x="170" y="30" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="2"/>
          <rect x="300" y="30" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="3"/>
          
          <!-- Parking Spots Row 2 -->
          <rect x="40" y="230" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="4"/>
          <rect x="170" y="230" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="5"/>
          <rect x="300" y="230" width="120" height="180" fill="#D3D3D3" stroke="#333" class="bills-parking-spot" data-spot="6"/>
          
          <!-- Cars in spots -->
          <g class="bills-car" data-item="car1" transform="translate(70,90)">
            <rect x="0" y="0" width="60" height="25" rx="5" fill="#e74c3c" stroke="#333"/>
            <rect x="10" y="-10" width="40" height="15" rx="3" fill="#e74c3c" stroke="#333"/>
            <circle cx="15" cy="25" r="6" fill="#333"/>
            <circle cx="45" cy="25" r="6" fill="#333"/>
          </g>
          
          <g class="bills-car" data-item="car2" transform="translate(200,90)">
            <rect x="0" y="0" width="60" height="25" rx="5" fill="#3498db" stroke="#333"/>
            <rect x="10" y="-10" width="40" height="15" rx="3" fill="#3498db" stroke="#333"/>
            <circle cx="15" cy="25" r="6" fill="#333"/>
            <circle cx="45" cy="25" r="6" fill="#333"/>
          </g>
          
          <g class="bills-car" data-item="car3" transform="translate(330,90)">
            <rect x="0" y="0" width="60" height="30" rx="5" fill="#2ecc71" stroke="#333"/>
            <rect x="15" y="-15" width="30" height="20" rx="3" fill="#2ecc71" stroke="#333"/>
            <circle cx="15" cy="30" r="6" fill="#333"/>
            <circle cx="45" cy="30" r="6" fill="#333"/>
          </g>
          
          <g class="bills-car" data-item="car4" transform="translate(70,290)">
            <rect x="0" y="0" width="60" height="35" rx="5" fill="#f39c12" stroke="#333"/>
            <rect x="5" y="-10" width="50" height="15" rx="3" fill="#f39c12" stroke="#333"/>
            <circle cx="15" cy="35" r="7" fill="#333"/>
            <circle cx="45" cy="35" r="7" fill="#333"/>
          </g>
          
          <g class="bills-car" data-item="car5" transform="translate(200,290)">
            <rect x="0" y="0" width="60" height="25" rx="5" fill="#9b59b6" stroke="#333"/>
            <rect x="10" y="-10" width="40" height="15" rx="3" fill="#9b59b6" stroke="#333"/>
            <circle cx="15" cy="25" r="6" fill="#333"/>
            <circle cx="45" cy="25" r="6" fill="#333"/>
          </g>
          
          <g class="bills-car" data-item="car6" transform="translate(330,290)">
            <rect x="0" y="0" width="60" height="25" rx="5" fill="#1abc9c" stroke="#333"/>
            <rect x="10" y="-10" width="40" height="15" rx="3" fill="#1abc9c" stroke="#333"/>
            <circle cx="15" cy="25" r="6" fill="#333"/>
            <circle cx="45" cy="25" r="6" fill="#333"/>
          </g>
          
          <!-- Decorative Elements -->
          <rect x="40" y="440" width="380" height="40" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="230" y="465" text-anchor="middle" fill="#FFF" font-size="16" font-family="Arial">
            Parts & Repair Shop
          </text>
          
          <rect x="450" y="440" width="120" height="40" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="510" y="465" text-anchor="middle" fill="#FFF" font-size="16" font-family="Arial">
            Storage
          </text>
          
          <!-- Fencing -->
          <line x1="20" y1="20" x2="580" y2="20" stroke="#333" stroke-width="3" stroke-dasharray="5,5"/>
          <line x1="20" y1="20" x2="20" y2="420" stroke="#333" stroke-width="3" stroke-dasharray="5,5"/>
          <line x1="20" y1="420" x2="580" y2="420" stroke="#333" stroke-width="3" stroke-dasharray="5,5"/>
          <line x1="580" y1="20" x2="580" y2="420" stroke="#333" stroke-width="3" stroke-dasharray="5,5"/>
        </svg>
        
        <!-- Interactive elements outside the SVG -->
        <div id="bills-character" style="left: 300px; top: 450px;"></div>
        <div id="bills-dialog"></div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Initialize variables
  const character = document.getElementById('bills-character');
  const dialog = document.getElementById('bills-dialog');
  const lotContainer = document.getElementById('bills-lot-container');
  let isMoving = false;
  
  // Sound effect for button click
  const clickSound = new Audio('/assets/Sounds/button-click.wav');
  clickSound.volume = 0.2;
  
  // Car descriptions and prices
  const carInfo = {
    car1: {
      name: "Red Coupe",
      description: "A compact red coupe. Good on fuel, easy to maintain.",
      price: "650 caps",
      condition: "Good condition with minor wear and tear. About 70,000 miles on it."
    },
    car2: {
      name: "Blue Sedan",
      description: "A reliable blue sedan. Spacious interior, smooth ride.",
      price: "800 caps",
      condition: "Excellent condition. Recently serviced and ready to go."
    },
    car3: {
      name: "Green SUV",
      description: "A sturdy green SUV. Great for rough terrain and carrying supplies.",
      price: "1200 caps",
      condition: "Fair condition. Needs some work on the suspension, but engine runs well."
    },
    car4: {
      name: "Orange Truck",
      description: "A heavy-duty orange truck. Perfect for hauling cargo.",
      price: "1500 caps",
      condition: "Good condition. Heavy duty frame with reinforced bed."
    },
    car5: {
      name: "Purple Compact",
      description: "A sleek purple compact car. Nimble and fuel efficient.",
      price: "700 caps",
      condition: "Very good condition. Low mileage and well maintained."
    },
    car6: {
      name: "Teal Hatchback",
      description: "A practical teal hatchback. Versatile and reliable.",
      price: "750 caps",
      condition: "Good condition with a few cosmetic scratches. Strong engine."
    },
    bill: {
      name: "Bill",
      description: "Bill says: \"See anything you like? I've got the best deals in the wasteland!\"",
      specials: "Bill says: \"Today's special is the Blue Sedan. I'll throw in a full tank of fuel!\""
    }
  };
  
  // Parking spot descriptions
  const spotDescriptions = {
    1: "Parking spot #1 - Currently occupied by a Red Coupe",
    2: "Parking spot #2 - Currently occupied by a Blue Sedan",
    3: "Parking spot #3 - Currently occupied by a Green SUV",
    4: "Parking spot #4 - Currently occupied by an Orange Truck",
    5: "Parking spot #5 - Currently occupied by a Purple Compact",
    6: "Parking spot #6 - Currently occupied by a Teal Hatchback"
  };

  // Function to show the popup with animation
  function showBillsCarLotPopup() {
    popup.style.display = 'flex';
    // Reset character position
    if (character) {
      character.style.left = '300px';
      character.style.top = '450px';
    }
    try {
      clickSound.play().catch(e => console.log("Audio playback prevented:", e));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  // Function to hide the popup
  function hideBillsCarLotPopup() {
    popup.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
  }

  // Handle character movement
  if (lotContainer) {
    lotContainer.addEventListener('click', function(e) {
      // Don't move if clicking on a car or if already moving
      if (e.target.closest('.bills-car') || e.target.closest('.bills-parking-spot') || isMoving || e.target.id === 'bills-dialog') {
        return;
      }
      
      const rect = lotContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Hide dialog when moving
      if (dialog) dialog.style.display = 'none';
      
      moveCharacter(x, y);
    });
  }

  // Function to move character with animation
  function moveCharacter(targetX, targetY) {
    if (!character) return;
    
    isMoving = true;
    character.classList.add('bills-character-animation');
    
    // Calculate movement parameters
    const startX = parseInt(character.style.left);
    const startY = parseInt(character.style.top);
    const diffX = targetX - startX;
    const diffY = targetY - startY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    
    // Speed: 100 pixels per second
    const speed = 100;
    const duration = distance / speed * 1000; // ms
    
    // Start animation
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + diffX * progress;
      const currentY = startY + diffY * progress;
      
      character.style.left = `${currentX}px`;
      character.style.top = `${currentY}px`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        character.classList.remove('bills-character-animation');
        isMoving = false;
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Handle car interactions
  const cars = document.querySelectorAll('.bills-car');
  cars.forEach(car => {
    car.addEventListener('click', function() {
      const carType = this.getAttribute('data-item');
      const carData = carInfo[carType] || {name: "Unknown Car", description: "A vehicle of some kind."};
      
      if (!character || isMoving) return;
      
      // Get car position
      const bbox = this.getBBox();
      const targetX = bbox.x + bbox.width/2;
      const targetY = bbox.y + bbox.height/2 + 30; // Position slightly below car
      
      // Get character position
      const charX = parseInt(character.style.left);
      const charY = parseInt(character.style.top);
      
      // Calculate distance
      const distance = Math.sqrt(Math.pow(targetX - charX, 2) + Math.pow(targetY - charY, 2));
      
      // If too far, move closer first
      if (distance > 100) {
        // Calculate a position closer to the car
        const angle = Math.atan2(targetY - charY, targetX - charX);
        const newX = charX + Math.cos(angle) * (distance - 70);
        const newY = charY + Math.sin(angle) * (distance - 70);
        
        moveCharacter(newX, newY);
        
        // Show dialog after movement completes
        setTimeout(() => {
          showCarDialog(carType, bbox);
        }, distance / 100 * 1000 + 100); // Based on movement duration
      } else {
        // Already close enough, show dialog immediately
        showCarDialog(carType, bbox);
      }
    });
  });
  
  // Handle parking spot interactions
  const spots = document.querySelectorAll('.bills-parking-spot');
  spots.forEach(spot => {
    spot.addEventListener('click', function() {
      const spotNumber = this.getAttribute('data-spot');
      const description = spotDescriptions[spotNumber] || "An empty parking spot";
      
      if (!character || isMoving) return;
      
      // Get spot position
      const bbox = this.getBBox();
      const targetX = bbox.x + bbox.width/2;
      const targetY = bbox.y + bbox.height + 10; // Position below spot
      
      // Get character position
      const charX = parseInt(character.style.left);
      const charY = parseInt(character.style.top);
      
      // Calculate distance
      const distance = Math.sqrt(Math.pow(targetX - charX, 2) + Math.pow(targetY - charY, 2));
      
      // If too far, move closer first
      if (distance > 100) {
        // Calculate a position closer to the spot
        const angle = Math.atan2(targetY - charY, targetX - charX);
        const newX = charX + Math.cos(angle) * (distance - 70);
        const newY = charY + Math.sin(angle) * (distance - 70);
        
        moveCharacter(newX, newY);
        
        // Show dialog after movement completes
        setTimeout(() => {
          showSpotDialog(spotNumber, bbox);
        }, distance / 100 * 1000 + 100); // Based on movement duration
      } else {
        // Already close enough, show dialog immediately
        showSpotDialog(spotNumber, bbox);
      }
    });
  });
  
  // Show dialog for cars
  function showCarDialog(carType, bbox) {
    if (!dialog) return;
    
    const carData = carInfo[carType] || {name: "Unknown Car", description: "A vehicle of some kind."};
    
    // Position dialog near the car
    dialog.style.left = `${bbox.x + bbox.width + 10}px`;
    dialog.style.top = `${bbox.y}px`;
    
    // Set dialog content
    if (carType === 'bill') {
      dialog.innerHTML = `
        <p>${carData.description}</p>
        <button class="bills-interact-button" data-action="specials" data-car="${carType}">Ask About Specials</button>
        <button class="bills-interact-button" data-action="close">Close</button>
      `;
    } else {
      dialog.innerHTML = `
        <p><strong>${carData.name}</strong>: ${carData.description}</p>
        <button class="bills-interact-button" data-action="examine" data-car="${carType}">Examine Vehicle</button>
        <button class="bills-interact-button" data-action="price" data-car="${carType}">Ask Price</button>
      `;
    }
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.bills-interact-button');
    buttons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }
  
  // Show dialog for parking spots
  function showSpotDialog(spotNumber, bbox) {
    if (!dialog) return;
    
    const description = spotDescriptions[spotNumber] || "An empty parking spot";
    
    // Position dialog near the spot
    dialog.style.left = `${bbox.x + bbox.width/2 - 100}px`;
    dialog.style.top = `${bbox.y + bbox.height/2 - 50}px`;
    
    // Set dialog content
    dialog.innerHTML = `
      <p>${description}</p>
      <button class="bills-interact-button" data-action="close">Close</button>
    `;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.bills-interact-button');
    buttons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }
  
  // Handle dialog button actions
  function handleDialogAction(e) {
    const action = this.getAttribute('data-action');
    const carType = this.getAttribute('data-car');
    const carData = carInfo[carType] || {name: "Unknown Car", description: "A vehicle of some kind."};
    
    switch (action) {
      case 'examine':
        dialog.innerHTML = `
          <p><strong>${carData.name}</strong>: ${carData.condition}</p>
          <button class="bills-interact-button" data-action="price" data-car="${carType}">Ask Price</button>
          <button class="bills-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'price':
        dialog.innerHTML = `
          <p>Bill says: "The ${carData.name}? That'll cost you ${carData.price}."</p>
          <button class="bills-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'specials':
        dialog.innerHTML = `
          <p>${carInfo.bill.specials}</p>
          <button class="bills-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'close':
        dialog.style.display = 'none';
        break;
    }
    
    // Re-add event listeners to new buttons
    const newButtons = dialog.querySelectorAll('.bills-interact-button');
    newButtons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }

  // Event listeners to open/close the modal
  billsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showBillsCarLotPopup();
  });
  
  document.getElementById('bills-car-lot-close').addEventListener('click', hideBillsCarLotPopup);
  
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideBillsCarLotPopup();
    }
  });
});
