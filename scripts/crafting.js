// crafting.js

// --- Global Inventory and Data Structures ---
  
// Seed inventory (by default 5 wheat and 5 corn seeds)
var seedInventory = {
  wheat: 5,
  corn: 5
};

// Raw crops harvested from the field
var rawCropInventory = {
  wheat: 0,
  corn: 0
};

// Cooked food inventory
var cookedFoodInventory = {
  "Wheat Porridge": 0,
  "Corn Stew": 0
};

// Medicine inventory: herbs and crafted medicine
var medicineInventory = {
  herbs: 3,
  medicine: 0
};

// Crop grid: 16 slots (4x4). Each slot is null or an object representing the planted crop.
var cropGrid = new Array(16).fill(null);

// --- UI Update Functions ---
  
// Update the Grow Food grid
function updateCropGridUI() {
  const grid = document.getElementById('crop-grid');
  if (!grid) return;
  grid.innerHTML = ''; // clear grid
  cropGrid.forEach(function(crop, index) {
    const slot = document.createElement('div');
    slot.className = 'crop-slot';
    if (crop) { slot.classList.add('filled'); }
    const content = document.createElement('div');
    content.className = 'content';
    if (!crop) {
      content.innerHTML = 'Empty';
    } else {
      // Display the crop's state
      if (!crop.fertilized) {
        content.innerHTML = crop.seedType + '<br><button class="action-btn" onclick="fertilizeCrop(' + index + ')">Fertilize</button>';
      } else if (!crop.watered) {
        content.innerHTML = crop.seedType + ' (Fertilized)<br><button class="action-btn" onclick="waterCrop(' + index + ')">Water</button>';
      } else if (!crop.ready) {
        content.innerHTML = crop.seedType + ' (Growing)';
      } else {
        content.innerHTML = crop.seedType + ' (Ready)<br><button class="action-btn" onclick="harvestCrop(' + index + ')">Harvest</button>';
      }
    }
    slot.appendChild(content);
    // If slot is empty, allow click to open seed inventory
    if (!crop) {
      slot.addEventListener('click', function() {
        openSeedInventory(index);
      });
    }
    grid.appendChild(slot);
  });
}

// Update the Cook Food tab
function updateCookingUI() {
  const cookingSection = document.getElementById('cooking-section');
  if (!cookingSection) return;
  cookingSection.innerHTML = '';
  // Display current raw crop inventory
  const inventoryDiv = document.createElement('div');
  inventoryDiv.innerHTML = '<strong>Raw Crops:</strong> Wheat: ' + rawCropInventory.wheat + ' | Corn: ' + rawCropInventory.corn;
  cookingSection.appendChild(inventoryDiv);
  
  // Define recipes for cooking
  const recipes = [
    {
      name: "Wheat Porridge",
      ingredients: { wheat: 1 },
      result: "Wheat Porridge",
      cookTime: 3000
    },
    {
      name: "Corn Stew",
      ingredients: { corn: 1 },
      result: "Corn Stew",
      cookTime: 3000
    }
  ];
  
  recipes.forEach(function(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe';
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'recipe-details';
    detailsDiv.innerHTML = '<strong>' + recipe.name + '</strong><br>Requires: ' +
      Object.entries(recipe.ingredients).map(function(entry) {
        return entry[0] + ' x' + entry[1];
      }).join(', ');
    recipeDiv.appendChild(detailsDiv);
    const cookBtn = document.createElement('button');
    cookBtn.textContent = 'Cook';
    cookBtn.onclick = function() {
      cookRecipe(recipe);
    };
    recipeDiv.appendChild(cookBtn);
    cookingSection.appendChild(recipeDiv);
  });
}

// Update the Craft Medicine tab
function updateMedicineUI() {
  const medicineSection = document.getElementById('medicine-section');
  if (!medicineSection) return;
  medicineSection.innerHTML = '';
  const inventoryDiv = document.createElement('div');
  inventoryDiv.innerHTML = '<strong>Herbs:</strong> ' + medicineInventory.herbs + ' | <strong>Medicine:</strong> ' + medicineInventory.medicine;
  medicineSection.appendChild(inventoryDiv);
  const craftBtn = document.createElement('button');
  craftBtn.textContent = 'Craft Medicine (requires 2 Herbs)';
  craftBtn.onclick = craftMedicine;
  medicineSection.appendChild(craftBtn);
  // Progress bar for crafting
  const progressContainer = document.createElement('div');
  progressContainer.id = 'medicine-progress';
  const progressBar = document.createElement('div');
  progressBar.id = 'medicine-progress-bar';
  progressContainer.appendChild(progressBar);
  medicineSection.appendChild(progressContainer);
}

// --- Grow Food (Crop) Actions ---
  
// Open the seed inventory modal for a given crop slot index
function openSeedInventory(slotIndex) {
  let modal = document.getElementById('seed-inventory-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'seed-inventory-modal';
    modal.innerHTML = '<h3>Select Seed</h3><div id="seed-options"></div><button onclick="closeSeedInventory()">Cancel</button>';
    document.body.appendChild(modal);
  }
  const seedOptionsDiv = document.getElementById('seed-options');
  seedOptionsDiv.innerHTML = '';
  // List available seeds (only if count > 0)
  Object.keys(seedInventory).forEach(function(seedType) {
    if (seedInventory[seedType] > 0) {
      const btn = document.createElement('button');
      btn.textContent = seedType.charAt(0).toUpperCase() + seedType.slice(1) + ' Seed (' + seedInventory[seedType] + ')';
      btn.onclick = function() {
        plantSeed(slotIndex, seedType);
        closeSeedInventory();
      };
      seedOptionsDiv.appendChild(btn);
    }
  });
  modal.style.display = 'block';
}

function closeSeedInventory() {
  const modal = document.getElementById('seed-inventory-modal');
  if (modal) modal.style.display = 'none';
}

// Plant the chosen seed into the specified slot
function plantSeed(slotIndex, seedType) {
  if (seedInventory[seedType] > 0 && !cropGrid[slotIndex]) {
    seedInventory[seedType]--;
    cropGrid[slotIndex] = {
      seedType: seedType,
      fertilized: false,
      watered: false,
      ready: false
    };
    updateCropGridUI();
  } else {
    alert('Unable to plant seed here.');
  }
}

// Fertilize the crop in a slot
function fertilizeCrop(slotIndex) {
  const crop = cropGrid[slotIndex];
  if (crop && !crop.fertilized) {
    crop.fertilized = true;
    updateCropGridUI();
  }
}

// Water the crop in a slot and start the growth timer
function waterCrop(slotIndex) {
  const crop = cropGrid[slotIndex];
  if (crop && crop.fertilized && !crop.watered) {
    crop.watered = true;
    updateCropGridUI();
    // Simulate growth after watering (5 seconds)
    setTimeout(function() {
      crop.ready = true;
      updateCropGridUI();
    }, 5000);
  }
}

// Harvest a ready crop
function harvestCrop(slotIndex) {
  const crop = cropGrid[slotIndex];
  if (crop && crop.ready) {
    rawCropInventory[crop.seedType] = (rawCropInventory[crop.seedType] || 0) + 1;
    cropGrid[slotIndex] = null;
    updateCropGridUI();
    updateCookingUI();
  } else {
    alert('Crop is not ready to harvest.');
  }
}

// --- Cooking Actions ---
  
function cookRecipe(recipe) {
  // Verify sufficient ingredients are available
  let canCook = true;
  Object.keys(recipe.ingredients).forEach(function(ingredient) {
    if ((rawCropInventory[ingredient] || 0) < recipe.ingredients[ingredient]) {
      canCook = false;
    }
  });
  if (!canCook) {
    alert('Not enough ingredients to cook ' + recipe.name);
    return;
  }
  // Deduct required ingredients
  Object.keys(recipe.ingredients).forEach(function(ingredient) {
    rawCropInventory[ingredient] -= recipe.ingredients[ingredient];
  });
  updateCookingUI();
  // Simulate a cooking process delay
  setTimeout(function() {
    cookedFoodInventory[recipe.result] = (cookedFoodInventory[recipe.result] || 0) + 1;
    alert('Cooked ' + recipe.name + '!');
    updateCookingUI();
  }, recipe.cookTime);
}

// --- Medicine Crafting Action ---
  
function craftMedicine() {
  if (medicineInventory.herbs < 2) {
    alert('Not enough herbs to craft medicine.');
    return;
  }
  const craftBtn = document.querySelector('#medicine-section button');
  craftBtn.disabled = true;
  const progressBar = document.getElementById('medicine-progress-bar');
  progressBar.style.width = '0%';
  let progress = 0;
  const interval = setInterval(function() {
    progress += 10;
    progressBar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      medicineInventory.herbs -= 2;
      medicineInventory.medicine++;
      alert('Crafted 1 unit of medicine!');
      progressBar.style.width = '0%';
      craftBtn.disabled = false;
      updateMedicineUI();
    }
  }, 300);
}

// --- Overlay and Tab Management ---
  
function openCraftingOverlay() {
  let overlay = document.getElementById('crafting-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'crafting-overlay';
    
    // Header with title and close button
    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.textContent = 'Crafting Station';
    header.appendChild(title);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.onclick = closeCraftingOverlay;
    header.appendChild(closeBtn);
    overlay.appendChild(header);
    
    // Tab buttons
    const tabsContainer = document.createElement('div');
    tabsContainer.id = 'crafting-tabs';
    const tabNames = ['Grow Food', 'Cook Food', 'Craft Medicine'];
    tabNames.forEach(function(name, index) {
      const tabBtn = document.createElement('button');
      tabBtn.textContent = name;
      if (index === 0) tabBtn.classList.add('active');
      tabBtn.onclick = function() {
        switchTab(index);
      };
      tabsContainer.appendChild(tabBtn);
    });
    overlay.appendChild(tabsContainer);
    
    // Content area for tabs
    const contentArea = document.createElement('div');
    contentArea.id = 'crafting-content';
    
    // Grow Food Tab
    const growTab = document.createElement('div');
    growTab.id = 'tab-grow';
    growTab.innerHTML = '<h3>Grow Food</h3><p>Click an empty plot to plant a seed, then fertilize and water it to grow.</p><div id="crop-grid"></div>';
    contentArea.appendChild(growTab);
    
    // Cook Food Tab
    const cookTab = document.createElement('div');
    cookTab.id = 'tab-cook';
    cookTab.style.display = 'none';
    cookTab.innerHTML = '<h3>Cook Food</h3><div id="cooking-section"></div>';
    contentArea.appendChild(cookTab);
    
    // Craft Medicine Tab
    const medicineTab = document.createElement('div');
    medicineTab.id = 'tab-medicine';
    medicineTab.style.display = 'none';
    medicineTab.innerHTML = '<h3>Craft Medicine</h3><div id="medicine-section"></div>';
    contentArea.appendChild(medicineTab);
    
    overlay.appendChild(contentArea);
    document.body.appendChild(overlay);
    
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'crafting-backdrop';
    document.body.appendChild(backdrop);
    
    // Initialize UI elements
    updateCropGridUI();
    updateCookingUI();
    updateMedicineUI();
  }
  overlay.style.display = 'block';
  document.getElementById('crafting-backdrop').style.display = 'block';
  switchTab(0);
}

function closeCraftingOverlay() {
  const overlay = document.getElementById('crafting-overlay');
  if (overlay) overlay.style.display = 'none';
  const backdrop = document.getElementById('crafting-backdrop');
  if (backdrop) backdrop.style.display = 'none';
}

function switchTab(tabIndex) {
  const growTab = document.getElementById('tab-grow');
  const cookTab = document.getElementById('tab-cook');
  const medicineTab = document.getElementById('tab-medicine');
  growTab.style.display = 'none';
  cookTab.style.display = 'none';
  medicineTab.style.display = 'none';
  const tabs = document.querySelectorAll('#crafting-tabs button');
  tabs.forEach(function(btn, index) {
    if (index === tabIndex) { btn.classList.add('active'); }
    else { btn.classList.remove('active'); }
  });
  if (tabIndex === 0) { growTab.style.display = 'block'; updateCropGridUI(); }
  else if (tabIndex === 1) { cookTab.style.display = 'block'; updateCookingUI(); }
  else if (tabIndex === 2) { medicineTab.style.display = 'block'; updateMedicineUI(); }
}

// --- Attach Crafting Button to Bottom Bar ---
document.addEventListener('DOMContentLoaded', function() {
  const bottomButtons = document.getElementById('bottom-buttons');
  if (bottomButtons) {
    const craftingBtn = document.createElement('button');
    craftingBtn.id = 'crafting-btn';
    craftingBtn.textContent = 'Crafting';
    craftingBtn.style.display = 'inline-block';
    craftingBtn.style.marginLeft = '10px';
    bottomButtons.appendChild(craftingBtn);
    craftingBtn.addEventListener('click', function() {
      openCraftingOverlay();
    });
  }
});