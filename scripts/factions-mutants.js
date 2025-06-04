// factions-mutants.js - Handles the Mutants faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var mutantsPopupContainer = document.getElementById('mutants-popup-container');
    var mutantsPopupClose = document.getElementById('mutants-popup-close');
    var mutantsGridContainer = document.getElementById('mutants-units-grid');

    // Mutants faction units data
    var mutantsUnitsData = {
        brute: {
            name: "Brute",
            description: "Massive mutant with extreme physical mutations and abnormal muscle growth.",
            imageSrc: "assets/Factions/Mutants/Brute.webp",
            abilities: ["Incredible Strength", "Thick Hide", "Demolishing Force"],
            stats: { STR: 120, DEX: 30, AGI: 30, VIT: 110, COM: 10, INT: 20, PER: 35, CHA: 5, PSY: 30 }
        },
        acid_spitter: {
            name: "Acid Spitter",
            description: "Grotesque mutant with the ability to project corrosive acid from specialized glands.",
            imageSrc: "assets/Factions/Mutants/acid_spitter.webp",
            abilities: ["Acid Projection", "Corrosive Touch", "Chemical Resistance"],
            stats: { STR: 60, DEX: 70, AGI: 65, VIT: 75, COM: 20, INT: 45, PER: 60, CHA: 10, PSY: 55 }
        },
        stalker: {
            name: "Stalker",
            description: "Stealthy mutant with enhanced senses and predatory instincts.",
            imageSrc: "assets/Factions/Mutants/stalker.webp",
            abilities: ["Stealth Movement", "Enhanced Perception", "Ambush Tactics"],
            stats: { STR: 70, DEX: 85, AGI: 90, VIT: 65, COM: 15, INT: 50, PER: 95, CHA: 15, PSY: 50 }
        },
        mutant_engineer: {
            name: "Mutant Engineer",
            description: "Rare mutation retaining technical knowledge with the ability to repurpose technology.",
            imageSrc: "assets/Factions/Mutants/mutant_engineer.webp",
            abilities: ["Technological Insight", "Improvised Weaponry", "Trap Construction"],
            stats: { STR: 55, DEX: 80, AGI: 60, VIT: 70, COM: 50, INT: 85, PER: 75, CHA: 30, PSY: 65 }
        },
        berserker: {
            name: "Berserker",
            description: "Frenzied mutant that enters an uncontrollable rage state during combat.",
            imageSrc: "assets/Factions/Mutants/berserker1.webp",
            abilities: ["Battle Frenzy", "Pain Suppression", "Adrenaline Surge"],
            stats: { STR: 100, DEX: 75, AGI: 80, VIT: 95, COM: 10, INT: 25, PER: 55, CHA: 5, PSY: 60 }
        },
        fleshwalker: {
            name: "Fleshwalker",
            description: "Horrific mutation with malleable flesh that can reshape itself to adapt to environments.",
            imageSrc: "assets/Factions/Mutants/fleshwalker.webp",
            abilities: ["Body Morphing", "Regeneration", "Environmental Adaptation"],
            stats: { STR: 65, DEX: 60, AGI: 70, VIT: 90, COM: 15, INT: 40, PER: 65, CHA: 5, PSY: 75 }
        },
        alpha: {
            name: "Alpha",
            description: "Elite mutant leader with enhanced intellect and physical capabilities that commands lesser mutations.",
            imageSrc: "assets/Factions/Mutants/alpha.webp",
            abilities: ["Tactical Command", "Psychic Dominance", "Advanced Mutations"],
            stats: { STR: 90, DEX: 80, AGI: 85, VIT: 100, COM: 70, INT: 95, PER: 90, CHA: 60, PSY: 100 }
        }
    };

    // Show the mutants popup when the mutants faction button is clicked
    function handleMutantsFactionButtonClick() {
        var mutantsButton = document.querySelector('.faction-button[data-faction="mutants"]');
        if (mutantsButton) {
            mutantsButton.addEventListener('click', function() {
                setTimeout(displayMutantsPopup, 50);
            });
        }
    }
    handleMutantsFactionButtonClick();

    // Display the mutants popup and populate its grid
    function displayMutantsPopup() {
        mutantsPopupContainer.style.display = 'block';
        populateMutantsGrid();
    }

    // Populate the mutants grid with cards for each unit
    function populateMutantsGrid() {
        mutantsGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in mutantsUnitsData) {
            if (mutantsUnitsData.hasOwnProperty(key)) {
                var unit = mutantsUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'mutants-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/icons/combat.webp'" 
                         alt="${unit.name}" 
                         class="mutants-unit-icon">
                    <div class="mutants-unit-name">${unit.name}</div>
                    <div class="mutants-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayMutantsUnitDetails(currentKey, mutantsUnitsData, mutantsPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                mutantsGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific mutants unit
    function displayMutantsUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'mutants');
    }

    // Function to close a specific mutants unit details modal
    function closeMutantsUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'mutants');
    }

    // Close the mutants popup when its close button is clicked
    if (mutantsPopupClose) {
        mutantsPopupClose.addEventListener('click', function() {
            mutantsPopupContainer.style.display = 'none';
            // Close all mutants modals when closing the popup
            FactionModals.closeAllModals('mutants');
        });
    }

    // Clicking outside of the mutants popup container will close it
    document.addEventListener('click', function(e) {
        if (mutantsPopupContainer && 
            mutantsPopupContainer.style.display === 'block' &&
            !mutantsPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="mutants"]')) {
            mutantsPopupContainer.style.display = 'none';
            // Close all mutants modals when closing the popup
            FactionModals.closeAllModals('mutants');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.mutants-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeMutantsUnitDetails(unitKey);
            } else if (mutantsPopupContainer && mutantsPopupContainer.style.display === 'block') {
                mutantsPopupContainer.style.display = 'none';
                // Close all mutants modals when closing the popup
                FactionModals.closeAllModals('mutants');
            }
        }
    });
});