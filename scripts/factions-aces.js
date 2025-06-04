// factions-aces.js - Handles The Aces faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var acesPopupContainer = document.getElementById('aces-popup-container');
    var acesPopupClose = document.getElementById('aces-popup-close');
    var acesGridContainer = document.getElementById('aces-units-grid');

    // The Aces faction units data
    var acesUnitsData = {
        pilot: {
            name: "Combat Pilot",
            description: "Elite aircraft operator with advanced aerial combat training.",
            imageSrc: "assets/Factions/Aces/combat_pilot.png",
            abilities: ["Aerial Combat", "Evasive Maneuvers", "Precision Targeting"],
            stats: { STR: 60, DEX: 90, AGI: 85, VIT: 65, COM: 80, INT: 75, PER: 90, CHA: 70, PSY: 60 }
        },
        mechanic: {
            name: "Air Mechanic",
            description: "Technical specialist responsible for aircraft maintenance and repairs.",
            imageSrc: "assets/Factions/Aces/air_mechanic.png",
            abilities: ["Aircraft Repair", "System Diagnosis", "Field Modifications"],
            stats: { STR: 70, DEX: 85, AGI: 65, VIT: 70, COM: 60, INT: 85, PER: 80, CHA: 55, PSY: 50 }
        },
        commander: {
            name: "Squadron Commander",
            description: "Leadership role responsible for tactical planning and mission supervision.",
            imageSrc: "assets/Factions/Aces/squadron_commander.png",
            abilities: ["Tactical Command", "Squadron Leadership", "Strategic Planning"],
            stats: { STR: 65, DEX: 75, AGI: 70, VIT: 75, COM: 95, INT: 85, PER: 80, CHA: 90, PSY: 75 }
        },
        scout: {
            name: "Aerial Scout",
            description: "Reconnaissance specialist using lightweight aircraft for intelligence gathering.",
            imageSrc: "assets/Factions/Aces/aerial_scout.png",
            abilities: ["Aerial Reconnaissance", "Stealth Flying", "Environment Assessment"],
            stats: { STR: 55, DEX: 85, AGI: 90, VIT: 60, COM: 75, INT: 80, PER: 95, CHA: 65, PSY: 70 }
        },
        ace: {
            name: "Ace Pilot",
            description: "Legendary pilot with exceptional combat record and specialized aircraft.",
            imageSrc: "assets/Factions/Aces/ace_pilot.png",
            abilities: ["Unmatched Piloting", "Combat Mastery", "Aerial Dominance"],
            stats: { STR: 70, DEX: 100, AGI: 95, VIT: 75, COM: 85, INT: 80, PER: 95, CHA: 85, PSY: 80 }
        }
    };

    // Show the aces popup when the aces faction button is clicked
    function handleAcesFactionButtonClick() {
        var acesButton = document.querySelector('.faction-button[data-faction="aces"]');
        if (acesButton) {
            acesButton.addEventListener('click', function() {
                setTimeout(displayAcesPopup, 50);
            });
        }
    }
    handleAcesFactionButtonClick();

    // Display the aces popup and populate its grid
    function displayAcesPopup() {
        acesPopupContainer.style.display = 'block';
        populateAcesGrid();
    }

    // Populate the aces grid with cards for each unit
    function populateAcesGrid() {
        acesGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in acesUnitsData) {
            if (acesUnitsData.hasOwnProperty(key)) {
                var unit = acesUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'aces-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Factions/Aces/default_pilot.png'" 
                         alt="${unit.name}" 
                         class="aces-unit-icon">
                    <div class="aces-unit-name">${unit.name}</div>
                    <div class="aces-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayAcesUnitDetails(currentKey, acesUnitsData, acesPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                acesGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific aces unit
    function displayAcesUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'aces');
    }

    // Function to close a specific aces unit details modal
    function closeAcesUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'aces');
    }

    // Close the aces popup when its close button is clicked
    if (acesPopupClose) {
        acesPopupClose.addEventListener('click', function() {
            acesPopupContainer.style.display = 'none';
            // Close all aces modals when closing the popup
            FactionModals.closeAllModals('aces');
        });
    }

    // Clicking outside of the aces popup container will close it
    document.addEventListener('click', function(e) {
        if (acesPopupContainer && 
            acesPopupContainer.style.display === 'block' &&
            !acesPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="aces"]')) {
            acesPopupContainer.style.display = 'none';
            // Close all aces modals when closing the popup
            FactionModals.closeAllModals('aces');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.aces-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeAcesUnitDetails(unitKey);
            } else if (acesPopupContainer && acesPopupContainer.style.display === 'block') {
                acesPopupContainer.style.display = 'none';
                // Close all aces modals when closing the popup
                FactionModals.closeAllModals('aces');
            }
        }
    });
});