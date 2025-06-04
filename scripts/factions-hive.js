// factions-hive.js - Handles the H.I.V.E. faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var hivePopupContainer = document.getElementById('hive-popup-container');
    var hivePopupClose = document.getElementById('hive-popup-close');
    var hiveGridContainer = document.getElementById('hive-units-grid');

    // H.I.V.E. faction units data
    var hiveUnitsData = {
        scout: {
            name: "Scout",
            description: "Recon unit with enhanced mobility and detection capabilities.",
            imageSrc: "assets/Factions/HIVE/scout.webp",
            abilities: ["Recon", "Stealth Detection", "Quick Movement"],
            stats: { STR: 40, DEX: 80, AGI: 90, VIT: 50, COM: 70, INT: 60, PER: 95, CHA: 30, PSY: 20 }
        },
        drone: {
            name: "Drone",
            description: "Standard infantry unit with balanced combat capabilities.",
            imageSrc: "assets/Factions/HIVE/drone.webp",
            abilities: ["Basic Combat", "Group Tactics", "Moderate Armor"],
            stats: { STR: 60, DEX: 65, AGI: 65, VIT: 70, COM: 60, INT: 50, PER: 60, CHA: 20, PSY: 25 }
        },
        warrior: {
            name: "Warrior",
            description: "Front-line combat unit specialized in close-quarters engagement.",
            imageSrc: "assets/Factions/HIVE/warrior.webp",
            abilities: ["Heavy Combat", "Melee Specialist", "Heavy Armor"],
            stats: { STR: 90, DEX: 70, AGI: 60, VIT: 85, COM: 50, INT: 40, PER: 50, CHA: 15, PSY: 20 }
        },
        queen: {
            name: "Queen",
            description: "Command unit with tactical oversight and leadership abilities.",
            imageSrc: "assets/Factions/HIVE/queen.webp",
            abilities: ["Command Aura", "Strategic Planning", "Psionic Resistance"],
            stats: { STR: 50, DEX: 60, AGI: 40, VIT: 90, COM: 95, INT: 90, PER: 80, CHA: 70, PSY: 85 }
        },
        technician: {
            name: "Technician",
            description: "Support unit specialized in repairs and technological assistance.",
            imageSrc: "assets/Factions/HIVE/technician.webp",
            abilities: ["Repair", "Tech Support", "Field Engineering"],
            stats: { STR: 45, DEX: 90, AGI: 60, VIT: 55, COM: 80, INT: 95, PER: 70, CHA: 30, PSY: 40 }
        }
    };

    // Show the hive popup when the hive faction button is clicked
    function handleHiveFactionButtonClick() {
        var hiveButton = document.querySelector('.faction-button[data-faction="hive"]');
        if (hiveButton) {
            hiveButton.addEventListener('click', function() {
                setTimeout(displayHivePopup, 50);
            });
        }
    }
    handleHiveFactionButtonClick();

    // Display the hive popup and populate its grid
    function displayHivePopup() {
        hivePopupContainer.style.display = 'block';
        populateHiveGrid();
    }

    // Populate the hive grid with cards for each unit
    function populateHiveGrid() {
        hiveGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in hiveUnitsData) {
            if (hiveUnitsData.hasOwnProperty(key)) {
                var unit = hiveUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'hive-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Factions/HIVE/drone.webp'" 
                         alt="${unit.name}" 
                         class="hive-unit-icon">
                    <div class="hive-unit-name">${unit.name}</div>
                    <div class="hive-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayHiveUnitDetails(currentKey, hiveUnitsData, hivePopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                hiveGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific hive unit
    function displayHiveUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'hive');
    }

    // Function to close a specific hive unit details modal
    function closeHiveUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'hive');
    }

    // Close the hive popup when its close button is clicked
    if (hivePopupClose) {
        hivePopupClose.addEventListener('click', function() {
            hivePopupContainer.style.display = 'none';
            // Close all hive modals when closing the popup
            FactionModals.closeAllModals('hive');
        });
    }

    // Clicking outside of the hive popup container will close it
    document.addEventListener('click', function(e) {
        if (hivePopupContainer && 
            hivePopupContainer.style.display === 'block' &&
            !hivePopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="hive"]')) {
            hivePopupContainer.style.display = 'none';
            // Close all hive modals when closing the popup
            FactionModals.closeAllModals('hive');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.hive-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeHiveUnitDetails(unitKey);
            } else if (hivePopupContainer && hivePopupContainer.style.display === 'block') {
                hivePopupContainer.style.display = 'none';
                // Close all hive modals when closing the popup
                FactionModals.closeAllModals('hive');
            }
        }
    });
});