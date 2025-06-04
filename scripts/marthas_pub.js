document.addEventListener('DOMContentLoaded', function() {
  // Select the "Martha's Pub" button from the main game interface
  const marthasPubBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
    .find(btn => btn.textContent.trim() === "Martha's Pub");
  
  // Also look for the home scene button that might open Martha's pub
  const homeMarhasPubBtn = document.getElementById('home-marthas-pub');
  
  if (!marthasPubBtn && !homeMarhasPubBtn) {
    console.error("Martha's Pub buttons not found.");
    return;
  }

  try {
    // Initialize EasyStar.js for pathfinding
    const easystar = new EasyStar.js();
    const gridSize = 10;
    const gridWidth = 80;  // Width of tavern container divided by gridSize
    const gridHeight = 60; // Height of tavern container divided by gridSize
    
    // Create a simple grid for pathfinding (0 = walkable, 1 = blocked)
    const grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
    
    // Mark tables as obstacles
    function markTableAsObstacle(tableId) {
      const table = document.getElementById(tableId);
      if (table) {
        // Extract numeric values from style.left and style.top
        const leftStr = table.style.left || "0px";
        const topStr = table.style.top || "0px";
        const tableX = Math.floor(parseInt(leftStr) / gridSize);
        const tableY = Math.floor(parseInt(topStr) / gridSize);
        
        // Mark a 10x10 area as blocked
        for (let y = tableY; y < tableY + 10; y++) {
          for (let x = tableX; x < tableX + 10; x++) {
            if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
              grid[y][x] = 1;
            }
          }
        }
      }
    }
    
    // Add bar as obstacle
    function markBarAsObstacle() {
      const bar = document.getElementById('bar');
      if (bar) {
        // Mark bar area as blocked (from 100,50 to 700,150)
        const barX = Math.floor(100 / gridSize);
        const barY = Math.floor(50 / gridSize);
        const barWidth = Math.floor(600 / gridSize);
        const barHeight = Math.floor(100 / gridSize);
        
        for (let y = barY; y < barY + barHeight; y++) {
          for (let x = barX; x < barX + barWidth; x++) {
            if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
              grid[y][x] = 1;
            }
          }
        }
      }
    }
    
    // Add boundaries as obstacles
    function markBoundariesAsObstacles() {
      // Mark a border around the edges to prevent characters from walking off screen
      const borderWidth = 1;
      
      // Top and bottom borders
      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < borderWidth; y++) {
          grid[y][x] = 1;
        }
        for (let y = gridHeight - borderWidth; y < gridHeight; y++) {
          grid[y][x] = 1;
        }
      }
      
      // Left and right borders
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < borderWidth; x++) {
          grid[y][x] = 1;
        }
        for (let x = gridWidth - borderWidth; x < gridWidth; x++) {
          grid[y][x] = 1;
        }
      }
    }
    
    // Mark all tables as obstacles
    markTableAsObstacle('table1');
    markTableAsObstacle('table2');
    markTableAsObstacle('table3');
    markTableAsObstacle('table4');
    markBarAsObstacle();
    markBoundariesAsObstacles();
    
    // Set up the grid for EasyStar
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.enableDiagonals();
    easystar.enableCornerCutting();
    // Set calculation iterations per calculation to improve performance
    easystar.setIterationsPerCalculation(1000);

    const popup = document.getElementById('marthas-pub-popup');
    const closeBtn = document.getElementById('marthas-pub-close');
    const martha = document.getElementById('martha');
    const player = document.getElementById('player');
    const chairs = document.querySelectorAll('.chair');
    const patrons = document.querySelectorAll('.patron');
    const conversationPopup = document.getElementById('conversation-popup');
    const conversationText = document.getElementById('conversation-text');
    const orderDrinkBtn = document.getElementById('order-drink');
    const conversationClose = document.getElementById('conversation-close');
    const patronPopup = document.getElementById('patron-popup');
    const patronText = document.getElementById('patron-text');
    const patronClose = document.getElementById('patron-close');
    const drinkOptions = document.getElementById('drink-options');
    const tavernAmbience = document.getElementById('tavern-ambience');

    // Initialize character positions if not already set
    function initializePosition(element, defaultX, defaultY) {
      if (element) {
        if (!element.style.left) element.style.left = defaultX + "px";
        if (!element.style.top) element.style.top = defaultY + "px";
      }
    }
    
    // Initialize positions for all characters
    initializePosition(martha, 350, 100);
    initializePosition(player, 400, 300);
    initializePosition(document.getElementById('patron1'), 200, 250);
    initializePosition(document.getElementById('patron2'), 600, 350);
    initializePosition(document.getElementById('patron3'), 300, 450);

    // Patron dialog options
    const patronDialogs = {
      patron1: [
        "Been hearing strange rumors about those alien visitors. You know anything?",
        "Martha makes the best drinks in the wastes, don't let anyone tell you different.",
        "Have you been north of here? They say there's some tech facility up there."
      ],
      patron2: [
        "FDG patrol came through yesterday. Tension's high these days.",
        "Need a job? I heard the trading post is hiring guards for their caravans.",
        "Saw some strange lights in the sky last night. More aliens, I reckon."
      ],
      patron3: [
        "They say New Cheyenne is as close to pre-war living as you can get these days.",
        "Watch out for raiders on the eastern road. Lost my cargo there last week.",
        "If you're looking for work, Bill's always needing reliable scouts."
      ]
    };

    // Show/hide popup functions
    function showTavernPopup() {
      if (popup) {
        popup.style.display = 'flex';
        startPatronMovement();
        // Start ambient sound if available
        if (tavernAmbience) {
          tavernAmbience.volume = 0.3;
          tavernAmbience.play().catch(e => console.log("Audio playback prevented:", e));
        }
      } else {
        console.error("Martha's Pub popup element not found");
      }
    }

    function hideTavernPopup() {
      if (popup) popup.style.display = 'none';
      if (conversationPopup) conversationPopup.style.display = 'none';
      if (patronPopup) patronPopup.style.display = 'none';
      if (drinkOptions) drinkOptions.style.display = 'none';
      stopPatronMovement();
      // Stop ambient sound
      if (tavernAmbience) {
        tavernAmbience.pause();
        tavernAmbience.currentTime = 0;
      }
    }

    // Event listeners for opening the tavern
    if (marthasPubBtn) {
      marthasPubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showTavernPopup();
      });
    }
    
    if (homeMarhasPubBtn) {
      homeMarhasPubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showTavernPopup();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', hideTavernPopup);
    }
    
    if (popup) {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) hideTavernPopup();
      });
    }

    // Move player to chair with animation
    chairs.forEach(chair => {
      chair.addEventListener('click', () => {
        const table = chair.parentElement;
        const position = chair.dataset.position;
        let newTop, newLeft;
        
        // Extract numeric values from style.left and style.top
        const tableLeft = parseInt(table.style.left || "0px");
        const tableTop = parseInt(table.style.top || "0px");
        
        switch (position) {
          case 'top': newTop = tableTop - 40; newLeft = tableLeft + 35; break;
          case 'bottom': newTop = tableTop + 100; newLeft = tableLeft + 35; break;
          case 'left': newTop = tableTop + 35; newLeft = tableLeft - 40; break;
          case 'right': newTop = tableTop + 35; newLeft = tableLeft + 100; break;
          default: newTop = tableTop; newLeft = tableLeft;
        }
        
        if (player) {
          // Get current player position
          const currentLeft = parseInt(player.style.left || "0px");
          const currentTop = parseInt(player.style.top || "0px");
          
          // Convert to grid coordinates
          const startX = Math.floor(currentLeft / gridSize);
          const startY = Math.floor(currentTop / gridSize);
          const endX = Math.floor(newLeft / gridSize);
          const endY = Math.floor(newTop / gridSize);
          
          // Use pathfinding to move to the chair
          easystar.findPath(startX, startY, endX, endY, (path) => {
            if (path && path.length > 0) {
              moveCharacter(player, path);
            } else {
              // If no path found, just teleport
              player.style.top = `${newTop}px`;
              player.style.left = `${newLeft}px`;
            }
          });
          easystar.calculate();
        } else {
          console.error("Player element not found");
        }
      });
    });

    // Move character along a path with improved animation
    function moveCharacter(character, path, callback) {
      if (character && path && path.length > 0) {
        let step = 0;
        
        // Add animation class for walking effect
        character.style.animation = 'characterStep 0.4s infinite';
        
        const interval = setInterval(() => {
          if (step >= path.length) {
            clearInterval(interval);
            // Remove animation when done walking
            character.style.animation = '';
            if (callback) callback();
            return;
          }
          character.style.top = `${path[step].y * gridSize}px`;
          character.style.left = `${path[step].x * gridSize}px`;
          step++;
        }, 150); // Slightly faster movement
      } else {
        console.error("Character element not found or invalid path");
        if (callback) callback();
      }
    }

    // Martha interaction
    if (martha) {
      martha.addEventListener('click', () => {
        if (conversationText) {
          conversationText.textContent = "Welcome to Martha's Pub! What can I get for you traveler?";
        }
        if (conversationPopup) {
          conversationPopup.style.display = 'block';
          if (drinkOptions) drinkOptions.style.display = 'none';
        }
      });
    }

    // Show drink options
    if (orderDrinkBtn) {
      orderDrinkBtn.addEventListener('click', () => {
        if (drinkOptions) {
          drinkOptions.style.display = 'block';
        } else {
          // Default behavior if drink options element not found
          serveDrink('ale');
        }
      });
    }

    // Handle drink selection
    const drinkButtons = document.querySelectorAll('.drink-option');
    drinkButtons.forEach(button => {
      button.addEventListener('click', () => {
        const drinkType = button.dataset.drink;
        serveDrink(drinkType);
      });
    });

    // Serve the selected drink
    function serveDrink(drinkType) {
      let drinkMessage = '';
      
      switch(drinkType) {
        case 'ale':
          drinkMessage = "Here's your Wasteland Ale. Locally brewed, not too irradiated.";
          break;
        case 'whiskey':
          drinkMessage = "Radiated Whiskey coming right up! It's got a real kick to it.";
          break;
        case 'special':
          drinkMessage = "Martha's Special! Don't ask what's in it, but it'll cure what ails ya.";
          break;
        default:
          drinkMessage = "I'll bring your drink right over!";
      }
      
      if (conversationText) {
        conversationText.textContent = drinkMessage;
      }
      
      if (drinkOptions) {
        drinkOptions.style.display = 'none';
      }
      
      // After a delay, Martha brings the drink
      setTimeout(() => {
        if (conversationPopup) {
          conversationPopup.style.display = 'none';
        }
        
        if (martha && player) {
          deliverDrink();
        }
      }, 1500);
    }

    // Improved drink delivery with better pathfinding
    function deliverDrink() {
      // Get current positions
      const marthaLeft = parseInt(martha.style.left || "0px");
      const marthaTop = parseInt(martha.style.top || "0px");
      const playerLeft = parseInt(player.style.left || "0px");
      const playerTop = parseInt(player.style.top || "0px");
      
      // Convert to grid coordinates
      const startX = Math.floor(marthaLeft / gridSize);
      const startY = Math.floor(marthaTop / gridSize);
      
      // Target a position near the player
      // Find the closest valid position to the player
      const playerX = Math.floor(playerLeft / gridSize);
      const playerY = Math.floor(playerTop / gridSize);
      
      // Try positions around the player
      const possiblePositions = [
        {x: playerX, y: playerY - 1},    // Above
        {x: playerX + 1, y: playerY},    // Right
        {x: playerX, y: playerY + 1},    // Below
        {x: playerX - 1, y: playerY},    // Left
        {x: playerX + 1, y: playerY - 1}, // Upper right
        {x: playerX - 1, y: playerY - 1}, // Upper left
        {x: playerX + 1, y: playerY + 1}, // Lower right
        {x: playerX - 1, y: playerY + 1}  // Lower left
      ];
      
      // Find a valid position
      let targetPosition = null;
      for (const pos of possiblePositions) {
        if (pos.x >= 0 && pos.x < gridWidth && pos.y >= 0 && pos.y < gridHeight && grid[pos.y][pos.x] === 0) {
          targetPosition = pos;
          break;
        }
      }
      
      // If no valid positions found, use player position
      if (!targetPosition) {
        targetPosition = {x: playerX, y: playerY};
      }
      
      // Find path to the target position
      easystar.findPath(startX, startY, targetPosition.x, targetPosition.y, (path) => {
        if (path && path.length > 0) {
          moveCharacter(martha, path, () => {
            // Show a brief notification when Martha delivers the drink
            const notification = document.createElement('div');
            notification.textContent = "🍺";
            notification.style.position = 'absolute';
            notification.style.top = `${playerTop - 20}px`;
            notification.style.left = `${playerLeft + 10}px`;
            notification.style.fontSize = '24px';
            notification.style.zIndex = '3200';
            notification.style.transition = 'all 1s ease';
            document.getElementById('tavern-container').appendChild(notification);
            
            // Animate the notification
            setTimeout(() => {
              notification.style.top = `${playerTop - 40}px`;
              notification.style.opacity = '0';
              setTimeout(() => {
                notification.remove();
              }, 1000);
            }, 100);
            
            // Return to original position after delivery
            setTimeout(() => {
              const returnX = Math.floor(350 / gridSize);
              const returnY = Math.floor(100 / gridSize);
              
              easystar.findPath(targetPosition.x, targetPosition.y, returnX, returnY, (returnPath) => {
                if (returnPath && returnPath.length > 0) moveCharacter(martha, returnPath);
              });
              easystar.calculate();
            }, 2000);
          });
        }
      });
      easystar.calculate();
    }

    if (conversationClose) {
      conversationClose.addEventListener('click', () => {
        if (conversationPopup) {
          conversationPopup.style.display = 'none';
        }
        if (drinkOptions) {
          drinkOptions.style.display = 'none';
        }
      });
    }

    // Enhanced patron interaction with unique dialogues
    patrons.forEach(patron => {
      if (patron) {
        patron.addEventListener('click', () => {
          if (patronText) {
            // Get random dialog for this patron
            const patronId = patron.id;
            const dialogs = patronDialogs[patronId] || ["Hello there! Enjoying Martha's fine establishment?"];
            const randomDialog = dialogs[Math.floor(Math.random() * dialogs.length)];
            
            patronText.textContent = `${patronId === 'patron1' ? 'Tom' : 
                                      patronId === 'patron2' ? 'Jack' : 
                                      patronId === 'patron3' ? 'Sarah' : patronId} says: "${randomDialog}"`;
          }
          if (patronPopup) {
            patronPopup.style.display = 'block';
          }
          
          // Move player close to the patron if clicked from far away
          const patronLeft = parseInt(patron.style.left || "0px");
          const patronTop = parseInt(patron.style.top || "0px");
          const playerLeft = parseInt(player.style.left || "0px");
          const playerTop = parseInt(player.style.top || "0px");
          
          // Calculate distance
          const distance = Math.sqrt(
            Math.pow(patronLeft - playerLeft, 2) + 
            Math.pow(patronTop - playerTop, 2)
          );
          
          // If too far away, move closer
          if (distance > 120) {
            // Find a position near the patron
            const patronX = Math.floor(patronLeft / gridSize);
            const patronY = Math.floor(patronTop / gridSize);
            const playerX = Math.floor(playerLeft / gridSize);
            const playerY = Math.floor(playerTop / gridSize);
            
            // Calculate a position that's closer to the patron
            const directionX = patronX - playerX;
            const directionY = patronY - playerY;
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            
            // Normalize and get a position 3 cells away
            const targetX = Math.floor(patronX - (directionX / length) * 3);
            const targetY = Math.floor(patronY - (directionY / length) * 3);
            
            // Ensure target is within bounds
            const boundedTargetX = Math.max(0, Math.min(gridWidth - 1, targetX));
            const boundedTargetY = Math.max(0, Math.min(gridHeight - 1, targetY));
            
            // Move player to this position
            easystar.findPath(playerX, playerY, boundedTargetX, boundedTargetY, (path) => {
              if (path && path.length > 0) moveCharacter(player, path);
            });
            easystar.calculate();
          }
        });
      }
    });

    if (patronClose) {
      patronClose.addEventListener('click', () => {
        if (patronPopup) {
          patronPopup.style.display = 'none';
        }
      });
    }

    // Improved patron wandering
    let patronIntervals = [];
    function startPatronMovement() {
      patrons.forEach(patron => {
        if (patron) {
          const move = () => {
            // Skip movement sometimes to make it more natural
            if (Math.random() < 0.3) return;
            
            // Get current position
            const patronLeft = parseInt(patron.style.left || "0px");
            const patronTop = parseInt(patron.style.top || "0px");
            
            // Convert to grid coordinates
            const currentX = Math.floor(patronLeft / gridSize);
            const currentY = Math.floor(patronTop / gridSize);
            
            // Generate random destination within reasonable bounds
            // Keep patrons in the central area of the tavern
            const centerX = Math.floor(gridWidth / 2);
            const centerY = Math.floor(gridHeight / 2);
            
            // Generate random offset from current position (-5 to +5 cells)
            const offsetX = Math.floor(Math.random() * 11) - 5;
            const offsetY = Math.floor(Math.random() * 11) - 5;
            
            // Apply offset but keep within tavern bounds
            let newX = Math.max(5, Math.min(gridWidth - 6, currentX + offsetX));
            let newY = Math.max(5, Math.min(gridHeight - 6, currentY + offsetY));
            
            // Occasionally bias movement toward the center or the bar
            if (Math.random() < 0.2) {
              // Move toward center
              newX = Math.floor((newX + centerX) / 2);
              newY = Math.floor((newY + centerY) / 2);
            } else if (Math.random() < 0.3) {
              // Move toward bar
              const barY = Math.floor(70 / gridSize);
              newY = Math.floor((newY + barY) / 2);
            }
            
            // Ensure valid coordinates
            if (!isNaN(currentX) && !isNaN(currentY) && !isNaN(newX) && !isNaN(newY) &&
                currentX >= 0 && currentX < gridWidth && currentY >= 0 && currentY < gridHeight &&
                newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
              
              easystar.findPath(currentX, currentY, newX, newY, (path) => {
                if (path && path.length > 0) moveCharacter(patron, path);
              });
              easystar.calculate();
            }
          };
          
          // Randomize initial movement delay for more natural feel
          const initialDelay = 500 + Math.random() * 2000;
          
          // Randomize interval for each patron
          const moveInterval = 4000 + Math.random() * 6000;
          
          // Start movement with staggered delays
          setTimeout(() => {
            move(); // Initial move
            patronIntervals.push(setInterval(move, moveInterval));
          }, initialDelay);
        }
      });
    }

    function stopPatronMovement() {
      patronIntervals.forEach(interval => clearInterval(interval));
      patronIntervals = [];
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only process if tavern is visible
      if (popup && popup.style.display === 'flex' && 
          player && 
          !conversationPopup.style.display === 'block' && 
          !patronPopup.style.display === 'block') {
        
        const playerLeft = parseInt(player.style.left || "0px");
        const playerTop = parseInt(player.style.top || "0px");
        const playerX = Math.floor(playerLeft / gridSize);
        const playerY = Math.floor(playerTop / gridSize);
        
        let targetX = playerX;
        let targetY = playerY;
        
        // Handle arrow keys
        switch(e.key) {
          case 'ArrowUp':
            targetY = Math.max(0, playerY - 1);
            break;
          case 'ArrowDown':
            targetY = Math.min(gridHeight - 1, playerY + 1);
            break;
          case 'ArrowLeft':
            targetX = Math.max(0, playerX - 1);
            break;
          case 'ArrowRight':
            targetX = Math.min(gridWidth - 1, playerX + 1);
            break;
          default:
            return; // Exit if not arrow key
        }
        
        // Check if target position is walkable
        if (targetX >= 0 && targetX < gridWidth && 
            targetY >= 0 && targetY < gridHeight && 
            grid[targetY][targetX] === 0) {
          player.style.left = `${targetX * gridSize}px`;
          player.style.top = `${targetY * gridSize}px`;
          
          // Add walking animation
          player.style.animation = 'characterStep 0.4s';
          setTimeout(() => {
            player.style.animation = '';
          }, 400);
        }
        
        e.preventDefault(); // Prevent scrolling
      }
    });
  } catch (error) {
    console.error("Error initializing Martha's Pub:", error);
  }
});