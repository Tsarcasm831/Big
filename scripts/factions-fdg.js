// factions-fdg.js - Handles the F.D.G. faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var fdgPopupContainer = document.getElementById('fdg-popup-container');
    var fdgPopupClose = document.getElementById('fdg-popup-close');
    var fdgGridContainer = document.getElementById('fdg-units-grid');

    // F.D.G. faction units data
    var fdgUnitsData = {
        trooper: {
            name: "Trooper",
            description: "Standard infantry unit equipped with basic weapons and armor.",
            imageSrc: "assets/Factions/FDG/trooper.webp",
            abilities: ["Standard Combat", "Basic Firearms", "Light Armor"],
            stats: { STR: 65, DEX: 70, AGI: 65, VIT: 70, COM: 60, INT: 55, PER: 60, CHA: 50, PSY: 40 }
        },
        elite_trooper: {
            name: "Elite Trooper",
            description: "Highly skilled infantry with specialized combat training.",
            imageSrc: "assets/Factions/FDG/elite_trooper.webp",
            abilities: ["Advanced Combat", "Specialized Weapons", "Tactical Movement"],
            stats: { STR: 70, DEX: 75, AGI: 70, VIT: 75, COM: 70, INT: 65, PER: 70, CHA: 55, PSY: 45 }
        },
        warhawk: {
            name: "Warhawk",
            description: "Squad leader with tactical expertise and command abilities.",
            imageSrc: "assets/Factions/FDG/warhawk.webp",
            abilities: ["Tactical Leadership", "Advanced Combat", "Squad Coordination"],
            stats: { STR: 70, DEX: 75, AGI: 70, VIT: 75, COM: 80, INT: 70, PER: 70, CHA: 65, PSY: 50 }
        },
        black_rose: {
            name: "Black Rose",
            description: "Special operations soldier trained for high-risk missions.",
            imageSrc: "assets/Factions/FDG/black_rose.webp",
            abilities: ["Stealth Operations", "Advanced Weapons", "Tactical Insertion"],
            stats: { STR: 80, DEX: 85, AGI: 85, VIT: 75, COM: 70, INT: 75, PER: 80, CHA: 55, PSY: 60 }
        },
        valkyrie: {
            name: "Valkyrie",
            description: "Field medic trained to provide medical support during combat.",
            imageSrc: "assets/Factions/FDG/valkyrie.webp",
            abilities: ["Field Medicine", "Support Combat", "First Aid"],
            stats: { STR: 60, DEX: 80, AGI: 70, VIT: 65, COM: 60, INT: 85, PER: 75, CHA: 70, PSY: 65 }
        },
        officer: {
            name: "Officer",
            description: "Command personnel with leadership and strategic planning skills.",
            imageSrc: "assets/Factions/FDG/officer.webp",
            abilities: ["Strategic Command", "Leadership", "Tactical Analysis"],
            stats: { STR: 65, DEX: 70, AGI: 65, VIT: 70, COM: 90, INT: 85, PER: 80, CHA: 85, PSY: 70 }
        },
        archangel: {
            name: "Archangel",
            description: "Elite commander with advanced combat and strategic capabilities.",
            imageSrc: "assets/Factions/FDG/archangel.webp",
            abilities: ["Strategic Mastery", "Elite Combat", "Inspirational Leadership"],
            stats: { STR: 75, DEX: 80, AGI: 75, VIT: 80, COM: 95, INT: 90, PER: 85, CHA: 90, PSY: 80 }
        },
        seraphim: {
            name: "Seraphim",
            description: "Specialized operative with unique tactical abilities.",
            imageSrc: "assets/Factions/FDG/seraphim.webp",
            abilities: ["Special Tactics", "Advanced Technology", "Precision Combat"],
            stats: { STR: 70, DEX: 90, AGI: 85, VIT: 70, COM: 75, INT: 80, PER: 85, CHA: 70, PSY: 75 }
        }
    };

    // Show the FDG popup when the FDG faction button is clicked
    function handleFdgFactionButtonClick() {
        var fdgButton = document.querySelector('.faction-button[data-faction="fdg"]');
        if (fdgButton) {
            fdgButton.addEventListener('click', function() {
                setTimeout(displayFdgPopup, 50);
            });
        }
    }
    handleFdgFactionButtonClick();

    // Display the FDG popup and populate its grid
    function displayFdgPopup() {
        fdgPopupContainer.style.display = 'block';
        populateFdgGrid();
    }

    // Populate the FDG grid with cards for each unit
    function populateFdgGrid() {
        fdgGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in fdgUnitsData) {
            if (fdgUnitsData.hasOwnProperty(key)) {
                var unit = fdgUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'fdg-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Factions/FDG/trooper.webp'" 
                         alt="${unit.name}" 
                         class="fdg-unit-icon">
                    <div class="fdg-unit-name">${unit.name}</div>
                    <div class="fdg-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayFdgUnitDetails(currentKey, fdgUnitsData, fdgPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                fdgGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific FDG unit
    function displayFdgUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'fdg');
    }

    // Function to close a specific FDG unit details modal
    function closeFdgUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'fdg');
    }

    // Close the FDG popup when its close button is clicked
    if (fdgPopupClose) {
        fdgPopupClose.addEventListener('click', function() {
            fdgPopupContainer.style.display = 'none';
            // Close all fdg modals when closing the popup
            FactionModals.closeAllModals('fdg');
        });
    }

    // Clicking outside of the FDG popup container will close it
    document.addEventListener('click', function(e) {
        if (fdgPopupContainer && 
            fdgPopupContainer.style.display === 'block' &&
            !fdgPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="fdg"]')) {
            fdgPopupContainer.style.display = 'none';
            // Close all fdg modals when closing the popup
            FactionModals.closeAllModals('fdg');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.fdg-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeFdgUnitDetails(unitKey);
            } else if (fdgPopupContainer && fdgPopupContainer.style.display === 'block') {
                fdgPopupContainer.style.display = 'none';
                // Close all fdg modals when closing the popup
                FactionModals.closeAllModals('fdg');
            }
        }
    });
});