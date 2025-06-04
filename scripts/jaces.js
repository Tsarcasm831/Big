document.addEventListener('DOMContentLoaded', function() {
  // Select the "Jace's Pawn & Gun" button by its text content
  const jacesBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                         .find(btn => btn.textContent.trim() === "Jace's Pawn & Gun");
  if (!jacesBtn) {
    console.error("Jace's Pawn & Gun button not found.");
    return;
  }

  // Inject custom styles if not already present
  if (!document.getElementById('jaces-styles')) {
    const style = document.createElement('style');
    style.id = 'jaces-styles';
    style.textContent = `
      .jaces-modal-overlay { 
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
        animation: jacesModalFadeIn 0.4s forwards;
      }
      .jaces-modal-content {
        background: linear-gradient(135deg, #f0f0f0, #ffffff);
        padding: 20px;
        border-radius: 10px;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        animation: jacesModalScaleIn 0.4s forwards;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .jaces-close-btn {
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
      .jaces-close-btn:hover {
        color: #3498db;
      }
      .jaces-svg {
        border: 1px solid #aaa;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        background: #f9f9f9;
      }
      @keyframes jacesModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes jacesModalScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .jaces-display-case {
        transition: fill 0.2s ease;
        cursor: pointer;
      }
      .jaces-display-case:hover {
        fill: #e0e0e0;
      }
      .jaces-item {
        opacity: 0.8;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      .jaces-item:hover {
        opacity: 1;
        transform: scale(1.05);
      }
      #jaces-character {
        position: absolute;
        width: 30px;
        height: 30px;
        background-image: url('/assets/player.png');
        background-size: contain;
        background-repeat: no-repeat;
        z-index: 3100;
        transition: all 0.4s ease;
      }
      #jaces-dialog {
        position: absolute;
        background: white;
        border: 2px solid #333;
        border-radius: 8px;
        padding: 10px;
        max-width: 200px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        z-index: 3200;
        display: none;
        font-size: 14px;
      }
      .jaces-interact-button {
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .jaces-interact-button:hover {
        background: #2980b9;
      }
      .jaces-character-animation {
        animation: jacesCharacterStep 0.4s infinite;
      }
      @keyframes jacesCharacterStep {
        0% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
        100% { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Create the modal popup container for Jace's shop
  const popup = document.createElement('div');
  popup.id = 'jaces-show-popup';
  popup.className = 'jaces-modal-overlay';
  
  // Inner content for the popup
  popup.innerHTML = `
    <div id="jaces-show-content" class="jaces-modal-content">
      <button id="jaces-show-close" class="jaces-close-btn">&times;</button>
      <h2 style="text-align: center; margin-bottom: 10px;">Jace's Pawn & Gun Shop</h2>
      <div id="jaces-shop-container" style="position: relative; width: 600px; height: 500px;">
        <svg class="jaces-svg" width="600" height="500" viewBox="0 0 600 500">
          <!-- Background -->
          <rect x="0" y="0" width="600" height="500" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
          <!-- Main counter -->
          <rect x="50" y="20" width="500" height="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="300" y="65" text-anchor="middle" fill="#fff" font-size="20" font-family="Arial" font-weight="bold">
            Main Counter
          </text>
          
          <!-- Gun Display Wall -->
          <rect x="50" y="120" width="240" height="120" fill="#A9A9A9" stroke="#333" stroke-width="1" class="jaces-display-case" data-case="guns"/>
          <text x="170" y="180" text-anchor="middle" fill="#333" font-size="16" font-family="Arial">
            Gun Display Wall
          </text>
          <!-- Gun icons -->
          <g class="jaces-item" data-item="rifle">
            <rect x="80" y="140" width="50" height="10" fill="#333"/>
            <rect x="90" y="150" width="10" height="20" fill="#8B4513"/>
          </g>
          <g class="jaces-item" data-item="pistol">
            <rect x="150" y="150" width="20" height="15" fill="#333"/>
          </g>
          <g class="jaces-item" data-item="shotgun">
            <rect x="200" y="140" width="60" height="8" fill="#333"/>
            <rect x="210" y="148" width="10" height="15" fill="#8B4513"/>
          </g>
          
          <!-- Armor Display Case -->
          <rect x="310" y="120" width="240" height="120" fill="#A9A9A9" stroke="#333" stroke-width="1" class="jaces-display-case" data-case="armor"/>
          <text x="430" y="180" text-anchor="middle" fill="#333" font-size="16" font-family="Arial">
            Armor Display Case
          </text>
          <!-- Armor icons -->
          <g class="jaces-item" data-item="vest">
            <rect x="340" y="150" width="40" height="30" rx="5" fill="#3A5F0B"/>
          </g>
          <g class="jaces-item" data-item="helmet">
            <circle cx="410" cy="150" r="15" fill="#5D5D5D"/>
          </g>
          <g class="jaces-item" data-item="boots">
            <rect x="460" y="150" width="15" height="25" fill="#8B4513"/>
            <rect x="480" y="150" width="15" height="25" fill="#8B4513"/>
          </g>
          
          <!-- Ammunition Display -->
          <rect x="50" y="260" width="240" height="100" fill="#D3D3D3" stroke="#333" stroke-width="1" class="jaces-display-case" data-case="ammo"/>
          <text x="170" y="310" text-anchor="middle" fill="#333" font-size="16" font-family="Arial">
            Ammunition Supplies
          </text>
          <!-- Ammo icons -->
          <g class="jaces-item" data-item="bullets">
            <rect x="80" y="280" width="30" height="15" fill="#B8860B"/>
            <circle cx="85" cy="275" r="2" fill="#B8860B"/>
            <circle cx="90" cy="275" r="2" fill="#B8860B"/>
            <circle cx="95" cy="275" r="2" fill="#B8860B"/>
          </g>
          <g class="jaces-item" data-item="shells">
            <rect x="150" y="280" width="30" height="15" fill="#CD5C5C"/>
            <circle cx="155" cy="275" r="2" fill="#CD5C5C"/>
            <circle cx="160" cy="275" r="2" fill="#CD5C5C"/>
            <circle cx="165" cy="275" r="2" fill="#CD5C5C"/>
          </g>
          
          <!-- Miscellaneous Items -->
          <rect x="310" y="260" width="240" height="100" fill="#D3D3D3" stroke="#333" stroke-width="1" class="jaces-display-case" data-case="misc"/>
          <text x="430" y="310" text-anchor="middle" fill="#333" font-size="16" font-family="Arial">
            Miscellaneous Items
          </text>
          <!-- Misc icons -->
          <g class="jaces-item" data-item="binoculars">
            <circle cx="350" cy="290" r="10" fill="#333"/>
            <circle cx="370" cy="290" r="10" fill="#333"/>
            <rect x="350" y="280" width="20" height="5" fill="#333"/>
          </g>
          <g class="jaces-item" data-item="compass">
            <circle cx="430" cy="290" r="15" fill="#F5DEB3"/>
            <line x1="430" y1="280" x2="430" y2="300" stroke="#333" stroke-width="1"/>
            <line x1="420" y1="290" x2="440" y2="290" stroke="#333" stroke-width="1"/>
          </g>
          <g class="jaces-item" data-item="medkit">
            <rect x="470" y="280" width="25" height="15" fill="#8B0000"/>
            <rect x="477" y="275" width="10" height="25" fill="#FFF"/>
          </g>
          
          <!-- Shop Owner's Area -->
          <rect x="50" y="380" width="500" height="100" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="300" y="430" text-anchor="middle" fill="#FFF" font-size="16" font-family="Arial">
            Jace's Workspace
          </text>
          <circle cx="300" cy="405" r="15" fill="#FFD700" class="jaces-item" data-item="jace"/>
        </svg>
        
        <!-- Interactive elements outside the SVG -->
        <div id="jaces-character" style="left: 300px; top: 450px;"></div>
        <div id="jaces-dialog"></div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  popup.style.display = 'none';

  // Initialize variables
  const character = document.getElementById('jaces-character');
  const dialog = document.getElementById('jaces-dialog');
  const shopContainer = document.getElementById('jaces-shop-container');
  let isMoving = false;
  
  // Item descriptions
  const itemDescriptions = {
    "rifle": "A sturdy hunting rifle. Good accuracy and power for medium range.",
    "pistol": "Standard 10mm pistol. Reliable sidearm for self-defense.",
    "shotgun": "Combat shotgun. Devastating at close range.",
    "vest": "Reinforced tactical vest. Offers decent protection against small caliber rounds.",
    "helmet": "Military grade helmet. Protects your head from trauma and shrapnel.",
    "boots": "Reinforced combat boots. Good ankle support for rough terrain.",
    "bullets": "Standard ammunition for rifles and pistols. Various calibers available.",
    "shells": "Shotgun shells. Makes a big boom with each trigger pull.",
    "binoculars": "High-powered binoculars. Spot danger before it spots you.",
    "compass": "Reliable compass. Never get lost in the wasteland again.",
    "medkit": "Basic medical supplies. Patch yourself up when things get rough.",
    "jace": "Jace says: \"See anything you like? I've got the best gear in the wasteland!\""
  };
  
  // Case descriptions
  const caseDescriptions = {
    "guns": "Jace's finest firearms. All tested and reliable.",
    "armor": "Protection gear for the cautious wastelander.",
    "ammo": "Can't shoot without these. Bulk discounts available.",
    "misc": "Odds and ends that might save your life out there."
  };

  // Sound effect for button click (using the button-click.wav from assets)
  const clickSound = new Audio('/assets/Sounds/button-click.wav');
  clickSound.volume = 0.2;

  // Function to show the popup with animation
  function showJacesPopup() {
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
  function hideJacesPopup() {
    popup.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
  }

  // Handle character movement
  if (shopContainer) {
    shopContainer.addEventListener('click', function(e) {
      // Don't move if clicking on an item or if already moving
      if (e.target.closest('.jaces-item') || isMoving || e.target.id === 'jaces-dialog') {
        return;
      }
      
      const rect = shopContainer.getBoundingClientRect();
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
    character.classList.add('jaces-character-animation');
    
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
        character.classList.remove('jaces-character-animation');
        isMoving = false;
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Handle item interactions
  const items = document.querySelectorAll('.jaces-item');
  items.forEach(item => {
    item.addEventListener('click', function() {
      const itemType = this.getAttribute('data-item');
      const description = itemDescriptions[itemType] || "An interesting item.";
      
      if (!character || isMoving) return;
      
      // Get item position
      const bbox = this.getBBox();
      const targetX = bbox.x + bbox.width/2;
      const targetY = bbox.y + bbox.height/2 + 30; // Position slightly below item
      
      // Get character position
      const charX = parseInt(character.style.left);
      const charY = parseInt(character.style.top);
      
      // Calculate distance
      const distance = Math.sqrt(Math.pow(targetX - charX, 2) + Math.pow(targetY - charY, 2));
      
      // If too far, move closer first
      if (distance > 100) {
        // Calculate a position closer to the item
        const angle = Math.atan2(targetY - charY, targetX - charX);
        const newX = charX + Math.cos(angle) * (distance - 70);
        const newY = charY + Math.sin(angle) * (distance - 70);
        
        moveCharacter(newX, newY);
        
        // Show dialog after movement completes
        setTimeout(() => {
          showItemDialog(itemType, bbox);
        }, distance / 100 * 1000 + 100); // Based on movement duration
      } else {
        // Already close enough, show dialog immediately
        showItemDialog(itemType, bbox);
      }
    });
  });
  
  // Handle display case interactions
  const cases = document.querySelectorAll('.jaces-display-case');
  cases.forEach(displayCase => {
    displayCase.addEventListener('click', function() {
      const caseType = this.getAttribute('data-case');
      const description = caseDescriptions[caseType] || "A display case with various items.";
      
      if (!character || isMoving) return;
      
      // Get case position
      const bbox = this.getBBox();
      const targetX = bbox.x + bbox.width/2;
      const targetY = bbox.y + bbox.height + 10; // Position below case
      
      // Get character position
      const charX = parseInt(character.style.left);
      const charY = parseInt(character.style.top);
      
      // Calculate distance
      const distance = Math.sqrt(Math.pow(targetX - charX, 2) + Math.pow(targetY - charY, 2));
      
      // If too far, move closer first
      if (distance > 100) {
        // Calculate a position closer to the case
        const angle = Math.atan2(targetY - charY, targetX - charX);
        const newX = charX + Math.cos(angle) * (distance - 70);
        const newY = charY + Math.sin(angle) * (distance - 70);
        
        moveCharacter(newX, newY);
        
        // Show dialog after movement completes
        setTimeout(() => {
          showCaseDialog(caseType, bbox);
        }, distance / 100 * 1000 + 100); // Based on movement duration
      } else {
        // Already close enough, show dialog immediately
        showCaseDialog(caseType, bbox);
      }
    });
  });
  
  // Show dialog for items
  function showItemDialog(itemType, bbox) {
    if (!dialog) return;
    
    const description = itemDescriptions[itemType] || "An interesting item.";
    
    // Position dialog near the item
    dialog.style.left = `${bbox.x + bbox.width + 10}px`;
    dialog.style.top = `${bbox.y}px`;
    
    // Set dialog content
    dialog.innerHTML = `
      <p>${description}</p>
      <button class="jaces-interact-button" data-action="examine" data-item="${itemType}">Examine</button>
      ${itemType !== 'jace' ? '<button class="jaces-interact-button" data-action="price" data-item="' + itemType + '">Ask Price</button>' : ''}
    `;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.jaces-interact-button');
    buttons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }
  
  // Show dialog for display cases
  function showCaseDialog(caseType, bbox) {
    if (!dialog) return;
    
    const description = caseDescriptions[caseType] || "A display case with various items.";
    
    // Position dialog near the case
    dialog.style.left = `${bbox.x + bbox.width/2 - 100}px`;
    dialog.style.top = `${bbox.y + bbox.height/2 - 50}px`;
    
    // Set dialog content
    dialog.innerHTML = `
      <p>${description}</p>
      <button class="jaces-interact-button" data-action="browse" data-case="${caseType}">Browse Items</button>
    `;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.jaces-interact-button');
    buttons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }
  
  // Handle dialog button actions
  function handleDialogAction(e) {
    const action = this.getAttribute('data-action');
    const itemType = this.getAttribute('data-item');
    const caseType = this.getAttribute('data-case');
    
    switch (action) {
      case 'examine':
        dialog.innerHTML = `
          <p>You examine the ${itemType}. It appears to be in good condition.</p>
          <button class="jaces-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'price':
        const prices = {
          rifle: "450 caps",
          pistol: "250 caps",
          shotgun: "350 caps",
          vest: "300 caps",
          helmet: "200 caps",
          boots: "150 caps",
          bullets: "50 caps per box",
          shells: "75 caps per box",
          binoculars: "100 caps",
          compass: "75 caps",
          medkit: "125 caps"
        };
        const price = prices[itemType] || "Ask Jace for pricing";
        dialog.innerHTML = `
          <p>Jace says: "The ${itemType}? That'll cost you ${price}."</p>
          <button class="jaces-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'browse':
        let items;
        switch (caseType) {
          case 'guns':
            items = "rifles, pistols, and shotguns";
            break;
          case 'armor':
            items = "vests, helmets, and boots";
            break;
          case 'ammo':
            items = "bullets and shotgun shells";
            break;
          case 'misc':
            items = "binoculars, compasses, and medkits";
            break;
          default:
            items = "various items";
        }
        dialog.innerHTML = `
          <p>You browse the ${caseType} case. It contains ${items}.</p>
          <button class="jaces-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'close':
        dialog.style.display = 'none';
        break;
    }
    
    // Re-add event listeners to new buttons
    const newButtons = dialog.querySelectorAll('.jaces-interact-button');
    newButtons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }

  // Open the popup when the button is clicked
  jacesBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showJacesPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#jaces-show-close').addEventListener('click', hideJacesPopup);

  // Also hide the popup when clicking outside the content container
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideJacesPopup();
    }
  });
});