// factions-allies.js - Handles the Allies faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var alliesPopupContainer = document.getElementById('allies-popup-container');
    var alliesPopupClose = document.getElementById('allies-popup-close');
    var alliesGridContainer = document.getElementById('allies-units-grid');

    // Allies faction units data
    var alliesUnitsData = {
        settler: {
            name: "Settler",
            description: "Civilian colonist skilled in resource gathering and basic survival.",
            imageSrc: "assets/Allies/settler.webp",
            abilities: ["Resource Gathering", "Basic Construction", "Survival Skills"],
            stats: { STR: 50, DEX: 60, AGI: 50, VIT: 50, COM: 45, INT: 55, PER: 60, CHA: 50, PSY: 40 }
        },
        militia: {
            name: "Militia",
            description: "Civilian volunteer with basic combat training for local defense.",
            imageSrc: "assets/Allies/militia.webp",
            abilities: ["Basic Combat", "Community Defense", "Territorial Knowledge"],
            stats: { STR: 60, DEX: 65, AGI: 60, VIT: 60, COM: 50, INT: 50, PER: 55, CHA: 45, PSY: 40 }
        },
        engineer: {
            name: "Engineer",
            description: "Technical specialist capable of machinery repair and construction.",
            imageSrc: "assets/Allies/engineer.webp",
            abilities: ["Technical Repair", "Advanced Construction", "System Analysis"],
            stats: { STR: 55, DEX: 80, AGI: 60, VIT: 55, COM: 60, INT: 85, PER: 75, CHA: 50, PSY: 45 }
        },
        scout: {
            name: "Scout",
            description: "Reconnaissance specialist with tracking and survival expertise.",
            imageSrc: "assets/Allies/scout.webp",
            abilities: ["Tracking", "Stealth Movement", "Environmental Adaptation"],
            stats: { STR: 55, DEX: 75, AGI: 85, VIT: 60, COM: 55, INT: 65, PER: 90, CHA: 50, PSY: 40 }
        },
        medic: {
            name: "Settlement Medic",
            description: "Medical professional providing healthcare to settlement inhabitants.",
            imageSrc: "assets/Allies/male_doctor1.webp",
            abilities: ["Emergency Medicine", "Disease Treatment", "Psychological Care"],
            stats: { STR: 50, DEX: 75, AGI: 60, VIT: 65, COM: 60, INT: 80, PER: 70, CHA: 75, PSY: 60 }
        }
    };

    // Show the allies popup when the allies faction button is clicked
    function handleAlliesFactionButtonClick() {
        var alliesButton = document.querySelector('.faction-button[data-faction="allies"]');
        if (alliesButton) {
            alliesButton.addEventListener('click', function() {
                setTimeout(displayAlliesPopup, 50);
            });
        }
    }
    handleAlliesFactionButtonClick();

    // Display the allies popup and populate its grid
    function displayAlliesPopup() {
        alliesPopupContainer.style.display = 'block';
        populateAlliesGrid();
    }

    // Populate the allies grid with cards for each unit
    function populateAlliesGrid() {
        alliesGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in alliesUnitsData) {
            if (alliesUnitsData.hasOwnProperty(key)) {
                var unit = alliesUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'allies-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Allies/settler.webp'" 
                         alt="${unit.name}" 
                         class="allies-unit-icon">
                    <div class="allies-unit-name">${unit.name}</div>
                    <div class="allies-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayAlliesUnitDetails(currentKey, alliesUnitsData, alliesPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                alliesGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific allies unit
    function displayAlliesUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'allies');
    }

    // Function to close a specific allies unit details modal
    function closeAlliesUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'allies');
    }

    // Close the allies popup when its close button is clicked
    if (alliesPopupClose) {
        alliesPopupClose.addEventListener('click', function() {
            alliesPopupContainer.style.display = 'none';
            // Close all allies modals when closing the popup
            FactionModals.closeAllModals('allies');
        });
    }

    // Clicking outside of the allies popup container will close it
    document.addEventListener('click', function(e) {
        if (alliesPopupContainer && 
            alliesPopupContainer.style.display === 'block' &&
            !alliesPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="allies"]')) {
            alliesPopupContainer.style.display = 'none';
            // Close all allies modals when closing the popup
            FactionModals.closeAllModals('allies');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.allies-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeAlliesUnitDetails(unitKey);
            } else if (alliesPopupContainer && alliesPopupContainer.style.display === 'block') {
                alliesPopupContainer.style.display = 'none';
                // Close all allies modals when closing the popup
                FactionModals.closeAllModals('allies');
            }
        }
    });
});