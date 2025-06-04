document.addEventListener('DOMContentLoaded', function() {
  // Select the "Noah's Wasteland Supply" button by its text content
  const noahsBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                        .find(btn => btn.textContent.trim() === "Noah's Wasteland Supply");
  if (!noahsBtn) {
    console.error("Noah's Wasteland Supply button not found.");
    return;
  }

  // Inject custom styles if not already present
  if (!document.getElementById('noahs-styles')) {
    const style = document.createElement('style');
    style.id = 'noahs-styles';
    style.textContent = `
      .noahs-modal-overlay { 
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
        animation: noahsModalFadeIn 0.4s forwards;
      }
      .noahs-modal-content {
        background: linear-gradient(135deg, #f0f0f0, #ffffff);
        padding: 20px;
        border-radius: 10px;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        animation: noahsModalScaleIn 0.4s forwards;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .noahs-close-btn {
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
      .noahs-close-btn:hover {
        color: #3498db;
      }
      .noahs-svg {
        border: 1px solid #aaa;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        background: #f9f9f9;
      }
      @keyframes noahsModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes noahsModalScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .noahs-display-case {
        transition: fill 0.2s ease;
        cursor: pointer;
      }
      .noahs-display-case:hover {
        fill: #e0e0e0;
      }
      .noahs-item {
        opacity: 0.8;
        transition: transform 0.3s ease, opacity 0.3s ease;
        cursor: pointer;
      }
      .noahs-item:hover {
        opacity: 1;
        transform: scale(1.05);
      }
      #noahs-character {
        position: absolute;
        width: 30px;
        height: 30px;
        background-image: url('/assets/player.png');
        background-size: contain;
        background-repeat: no-repeat;
        z-index: 3100;
        transition: all 0.4s ease;
      }
      #noahs-dialog {
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
      .noahs-interact-button {
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .noahs-interact-button:hover {
        background: #2980b9;
      }
      .noahs-character-animation {
        animation: noahsCharacterStep 0.4s infinite;
      }
      @keyframes noahsCharacterStep {
        0% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
        100% { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Create the modal popup container for Noah's Supply Shop
  const popup = document.createElement('div');
  popup.id = 'noahs-supply-popup';
  popup.className = 'noahs-modal-overlay';

  // Inner content for the popup
  popup.innerHTML = `
    <div id="noahs-supply-content" class="noahs-modal-content">
      <button id="noahs-supply-close" class="noahs-close-btn">&times;</button>
      <h2 style="text-align: center; margin-bottom: 10px;">Noah's Wasteland Supply</h2>
      <div id="noahs-shop-container" style="position: relative; width: 600px; height: 500px;">
        <svg class="noahs-svg" width="600" height="500" viewBox="0 0 600 500">
          <!-- Background -->
          <rect x="0" y="0" width="600" height="500" fill="#f5f5f5" stroke="#333" stroke-width="2"/>
          
          <!-- Main counter -->
          <rect x="40" y="20" width="520" height="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="300" y="65" text-anchor="middle" fill="#fff" font-size="20" font-family="Arial" font-weight="bold">
            Supply Counter
          </text>
          
          <!-- Survival Gear Section -->
          <rect x="40" y="120" width="240" height="140" fill="#A9A9A9" stroke="#333" stroke-width="1" class="noahs-display-case" data-case="survival"/>
          <text x="160" y="140" text-anchor="middle" fill="#333" font-size="16" font-family="Arial" font-weight="bold">
            Survival Gear
          </text>
          
          <!-- Survival gear items -->
          <g class="noahs-item" data-item="canteen">
            <rect x="80" y="160" width="20" height="30" rx="2" fill="#B87333"/>
            <rect x="87" y="150" width="6" height="10" fill="#B87333"/>
          </g>
          
          <g class="noahs-item" data-item="sleepingbag">
            <rect x="120" y="160" width="30" height="40" rx="5" fill="#556B2F"/>
          </g>
          
          <g class="noahs-item" data-item="compass">
            <circle cx="185" cy="170" r="15" fill="#D2B48C"/>
            <line x1="185" y1="160" x2="185" y2="180" stroke="#333" stroke-width="2"/>
            <line x1="175" y1="170" x2="195" y2="170" stroke="#333" stroke-width="2"/>
          </g>
          
          <g class="noahs-item" data-item="map">
            <rect x="220" y="160" width="35" height="25" fill="#F5F5DC"/>
            <line x1="225" y1="165" x2="250" y2="165" stroke="#8B4513" stroke-width="1"/>
            <line x1="225" y1="170" x2="250" y2="170" stroke="#8B4513" stroke-width="1"/>
            <line x1="225" y1="175" x2="240" y2="175" stroke="#8B4513" stroke-width="1"/>
          </g>
          
          <g class="noahs-item" data-item="flashlight">
            <rect x="80" y="210" width="15" height="30" fill="#696969"/>
            <circle cx="87" cy="210" r="8" fill="#F0E68C"/>
          </g>
          
          <g class="noahs-item" data-item="rations">
            <rect x="120" y="220" width="30" height="20" fill="#CD853F"/>
            <rect x="125" y="225" width="20" height="10" fill="#A0522D"/>
          </g>
          
          <g class="noahs-item" data-item="firstaid">
            <rect x="180" y="210" width="30" height="20" fill="#F5F5F5"/>
            <rect x="185" y="205" width="20" height="30" fill="#F5F5F5"/>
            <rect x="185" y="205" width="20" height="30" stroke="#8B0000" stroke-width="2"/>
            <rect x="180" y="210" width="30" height="20" stroke="#8B0000" stroke-width="2"/>
            <line x1="195" y1="210" x2="195" y2="230" stroke="#8B0000" stroke-width="2"/>
            <line x1="180" y1="220" x2="210" y2="220" stroke="#8B0000" stroke-width="2"/>
          </g>
          
          <!-- Equipment Section -->
          <rect x="320" y="120" width="240" height="140" fill="#A9A9A9" stroke="#333" stroke-width="1" class="noahs-display-case" data-case="equipment"/>
          <text x="440" y="140" text-anchor="middle" fill="#333" font-size="16" font-family="Arial" font-weight="bold">
            Equipment & Tools
          </text>
          
          <!-- Equipment items -->
          <g class="noahs-item" data-item="axe">
            <rect x="350" y="160" width="6" height="40" fill="#8B4513"/>
            <polygon points="350,160 356,160 368,145 362,145" fill="#A9A9A9"/>
          </g>
          
          <g class="noahs-item" data-item="pickaxe">
            <rect x="390" y="160" width="6" height="40" fill="#8B4513"/>
            <polygon points="390,160 396,160 405,150 395,145" fill="#A9A9A9"/>
            <polygon points="396,160 390,160 381,150 391,145" fill="#A9A9A9"/>
          </g>
          
          <g class="noahs-item" data-item="hammer">
            <rect x="430" y="175" width="6" height="30" fill="#8B4513"/>
            <rect x="420" y="160" width="25" height="15" fill="#A9A9A9"/>
          </g>
          
          <g class="noahs-item" data-item="shovel">
            <rect x="470" y="160" width="5" height="40" fill="#8B4513"/>
            <path d="M470,160 Q472,150 475,160" fill="#A9A9A9" stroke="#333"/>
          </g>
          
          <g class="noahs-item" data-item="rope">
            <circle cx="360" cy="220" r="15" fill="#DEB887"/>
            <circle cx="360" cy="220" r="8" fill="#F5F5DC"/>
          </g>
          
          <g class="noahs-item" data-item="lantern">
            <rect x="395" y="210" width="10" height="5" fill="#696969"/>
            <rect x="390" y="215" width="20" height="20" fill="#B8860B"/>
            <rect x="395" y="235" width="10" height="5" fill="#696969"/>
          </g>
          
          <g class="noahs-item" data-item="pot">
            <rect x="440" y="225" width="20" height="15" fill="#778899"/>
            <line x1="440" y1="230" x2="460" y2="230" stroke="#333"/>
          </g>
          
          <!-- Weapons Section -->
          <rect x="40" y="280" width="240" height="120" fill="#A9A9A9" stroke="#333" stroke-width="1" class="noahs-display-case" data-case="weapons"/>
          <text x="160" y="300" text-anchor="middle" fill="#333" font-size="16" font-family="Arial" font-weight="bold">
            Basic Weapons
          </text>
          
          <!-- Weapon items -->
          <g class="noahs-item" data-item="huntingrifle">
            <rect x="70" y="330" width="60" height="8" fill="#8B4513"/>
            <rect x="120" y="328" width="20" height="12" fill="#696969"/>
          </g>
          
          <g class="noahs-item" data-item="pistol">
            <rect x="170" y="330" width="25" height="15" fill="#696969"/>
            <rect x="175" y="345" width="10" height="8" fill="#696969"/>
          </g>
          
          <g class="noahs-item" data-item="knife">
            <rect x="220" y="330" width="10" height="5" fill="#8B4513"/>
            <polygon points="230,327 230,337 245,332" fill="#C0C0C0"/>
          </g>
          
          <!-- Clothing Section -->
          <rect x="320" y="280" width="240" height="120" fill="#A9A9A9" stroke="#333" stroke-width="1" class="noahs-display-case" data-case="clothing"/>
          <text x="440" y="300" text-anchor="middle" fill="#333" font-size="16" font-family="Arial" font-weight="bold">
            Clothing & Armor
          </text>
          
          <!-- Clothing items -->
          <g class="noahs-item" data-item="jacket">
            <rect x="350" y="330" width="30" height="40" rx="5" fill="#00008B"/>
            <rect x="335" y="330" width="15" height="30" rx="5" fill="#00008B"/>
            <rect x="380" y="330" width="15" height="30" rx="5" fill="#00008B"/>
          </g>
          
          <g class="noahs-item" data-item="boots">
            <rect x="430" y="350" width="15" height="20" fill="#8B4513"/>
            <rect x="450" y="350" width="15" height="20" fill="#8B4513"/>
          </g>
          
          <g class="noahs-item" data-item="helmet">
            <path d="M500,330 Q520,330 520,350 Q520,370 500,370 Q480,370 480,350 Q480,330 500,330" fill="#BDB76B"/>
          </g>
          
          <!-- Noah's spot (shopkeeper) -->
          <rect x="40" y="420" width="520" height="60" fill="#8B4513" stroke="#333" stroke-width="2"/>
          <text x="300" y="455" text-anchor="middle" fill="#FFF" font-size="18" font-family="Arial">
            Noah's Workbench
          </text>
          <circle cx="300" cy="435" r="15" fill="#FFD700" class="noahs-item" data-item="noah"/>
        </svg>
        
        <!-- Interactive elements outside the SVG -->
        <div id="noahs-character" style="left: 300px; top: 470px;"></div>
        <div id="noahs-dialog"></div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  popup.style.display = 'none';

  // Initialize variables
  const character = document.getElementById('noahs-character');
  const dialog = document.getElementById('noahs-dialog');
  const shopContainer = document.getElementById('noahs-shop-container');
  let isMoving = false;
  
  // Item descriptions
  const itemDescriptions = {
    "canteen": "A sturdy metal canteen. Essential for carrying clean water.",
    "sleepingbag": "Insulated sleeping bag for cold nights in the wasteland.",
    "compass": "Never get lost again with this reliable compass.",
    "map": "Detailed map of the local region. Shows key landmarks and danger zones.",
    "flashlight": "Hand-cranked flashlight. No batteries needed.",
    "rations": "Preserved food rations. Not tasty, but will keep you alive.",
    "firstaid": "Basic first aid kit with bandages, antiseptic, and pain relievers.",
    "axe": "Multi-purpose axe. Good for chopping wood or self-defense.",
    "pickaxe": "Strong pickaxe for mining ore or breaking through stone.",
    "hammer": "Heavy-duty hammer for construction and repairs.",
    "shovel": "Sturdy shovel for digging. Useful for building shelters or fortifications.",
    "rope": "50 feet of durable rope. Countless uses in survival situations.",
    "lantern": "Oil lantern that provides warm, steady light for hours.",
    "pot": "Metal cooking pot. Use it to boil water and cook food.",
    "huntingrifle": "Basic hunting rifle. Good accuracy at medium range.",
    "pistol": "Standard 10mm pistol. Reliable for self-defense.",
    "knife": "Sharp survival knife. Your most versatile tool.",
    "jacket": "Reinforced jacket that provides protection against the elements.",
    "boots": "Durable hiking boots with good ankle support.",
    "helmet": "Protective helmet to guard against head injuries.",
    "noah": "Noah says: \"Welcome to my shop! I've got everything you need to survive out there. What are you looking for today?\""
  };
  
  // Case descriptions
  const caseDescriptions = {
    "survival": "Essential survival gear for life in the wasteland.",
    "equipment": "Quality tools that will last for years with proper care.",
    "weapons": "Basic weapons for hunting and self-defense.",
    "clothing": "Protective clothing and armor for harsh environments."
  };

  // Sound effect for button click
  const clickSound = new Audio('/assets/Sounds/button-click.wav');
  clickSound.volume = 0.2;

  // Function to show the popup with animation
  function showNoahsPopup() {
    popup.style.display = 'flex';
    // Reset character position
    if (character) {
      character.style.left = '300px';
      character.style.top = '470px';
    }
    try {
      clickSound.play().catch(e => console.log("Audio playback prevented:", e));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  // Function to hide the popup
  function hideNoahsPopup() {
    popup.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
  }

  // Handle character movement
  if (shopContainer) {
    shopContainer.addEventListener('click', function(e) {
      // Don't move if clicking on an item or if already moving
      if (e.target.closest('.noahs-item') || isMoving || e.target.id === 'noahs-dialog') {
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
    character.classList.add('noahs-character-animation');
    
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
        character.classList.remove('noahs-character-animation');
        isMoving = false;
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Handle item interactions
  const items = document.querySelectorAll('.noahs-item');
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
  const cases = document.querySelectorAll('.noahs-display-case');
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
      <button class="noahs-interact-button" data-action="examine" data-item="${itemType}">Examine</button>
      ${itemType !== 'noah' ? '<button class="noahs-interact-button" data-action="price" data-item="' + itemType + '">Ask Price</button>' : ''}
    `;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.noahs-interact-button');
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
      <button class="noahs-interact-button" data-action="browse" data-case="${caseType}">Browse Items</button>
    `;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Add event listeners to dialog buttons
    const buttons = dialog.querySelectorAll('.noahs-interact-button');
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
          <button class="noahs-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'price':
        const prices = {
          canteen: "25 caps",
          sleepingbag: "75 caps",
          compass: "50 caps",
          map: "60 caps",
          flashlight: "30 caps",
          rations: "15 caps per pack",
          firstaid: "100 caps",
          axe: "70 caps",
          pickaxe: "65 caps",
          hammer: "40 caps",
          shovel: "45 caps",
          rope: "35 caps",
          lantern: "55 caps",
          pot: "30 caps",
          huntingrifle: "350 caps",
          pistol: "250 caps",
          knife: "45 caps",
          jacket: "120 caps",
          boots: "90 caps",
          helmet: "150 caps"
        };
        const price = prices[itemType] || "Ask Noah for pricing";
        dialog.innerHTML = `
          <p>Noah says: "The ${itemType}? That'll cost you ${price}."</p>
          <button class="noahs-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'browse':
        let items;
        switch (caseType) {
          case 'survival':
            items = "canteens, sleeping bags, compasses, maps, flashlights, rations, and first aid kits";
            break;
          case 'equipment':
            items = "axes, pickaxes, hammers, shovels, rope, lanterns, and cooking pots";
            break;
          case 'weapons':
            items = "hunting rifles, pistols, and knives";
            break;
          case 'clothing':
            items = "reinforced jackets, durable boots, and protective helmets";
            break;
          default:
            items = "various survival items";
        }
        dialog.innerHTML = `
          <p>You browse the ${caseType} section. It contains ${items}.</p>
          <button class="noahs-interact-button" data-action="close">Close</button>
        `;
        break;
      case 'close':
        dialog.style.display = 'none';
        break;
    }
    
    // Re-add event listeners to new buttons
    const newButtons = dialog.querySelectorAll('.noahs-interact-button');
    newButtons.forEach(button => {
      button.addEventListener('click', handleDialogAction);
    });
  }

  // Open the popup when the button is clicked
  noahsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showNoahsPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#noahs-supply-close').addEventListener('click', hideNoahsPopup);

  // Also hide the popup when clicking outside the content container
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideNoahsPopup();
    }
  });
});