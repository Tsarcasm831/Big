// factions-cross.js - Handles the ???? (CROSS) faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var crossPopupContainer = document.getElementById('question-popup-container');
    var crossPopupClose = document.getElementById('question-popup-close');
    var crossGridContainer = document.getElementById('question-units-grid');

    // Helper function to generate a random sequence of 5 non-letter characters (last two are the same)
    function generateRandomNonLetterSequence() {
        const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
        function pick() {
            return symbols[Math.floor(Math.random() * symbols.length)];
        }
        let c1 = pick();
        let c2 = pick();
        let c3 = pick();
        let c4 = pick();
        return c1 + c2 + c3 + c4 + c4;
    }

    // CROSS faction units data - intentionally obscured with code names
    var crossUnitsData = {
        tech: {
            name: "Tech Specialist",
            description: "Technical expert skilled in electronics, programming, and systems hacking.",
            imageSrc: "assets/Factions/Cross/tech_specialist.png",
            abilities: ["System Hacking", "Technical Repair", "Electronic Warfare"],
            stats: { STR: 50, DEX: 85, AGI: 60, VIT: 55, COM: 65, INT: 90, PER: 75, CHA: 60, PSY: 50 }
        },
        operative: {
            name: "Field Operative",
            description: "Versatile agent trained in covert operations, intelligence gathering, and combat.",
            imageSrc: "assets/Factions/Cross/field_operative.png",
            abilities: ["Covert Infiltration", "Combat Training", "Intelligence Collection"],
            stats: { STR: 75, DEX: 80, AGI: 85, VIT: 70, COM: 75, INT: 80, PER: 85, CHA: 70, PSY: 65 }
        },
        analyst: {
            name: "Intelligence Analyst",
            description: "Expert in data interpretation, pattern recognition, and strategic planning.",
            imageSrc: "assets/Factions/Cross/intelligence_analyst.png",
            abilities: ["Data Analysis", "Tactical Assessment", "Strategic Planning"],
            stats: { STR: 45, DEX: 70, AGI: 60, VIT: 50, COM: 80, INT: 95, PER: 90, CHA: 65, PSY: 60 }
        },
        commander: {
            name: "Field Commander",
            description: "Leadership position responsible for mission execution and team management.",
            imageSrc: "assets/Factions/Cross/field_commander.png",
            abilities: ["Tactical Command", "Team Leadership", "Crisis Management"],
            stats: { STR: 70, DEX: 75, AGI: 70, VIT: 75, COM: 90, INT: 85, PER: 80, CHA: 85, PSY: 70 }
        },
        director: {
            name: "Operations Director",
            description: "High-ranking official overseeing strategic operations and organizational direction.",
            imageSrc: "assets/Factions/Cross/operations_director.png",
            abilities: ["Strategic Command", "Organizational Leadership", "Political Navigation"],
            stats: { STR: 60, DEX: 70, AGI: 65, VIT: 65, COM: 95, INT: 90, PER: 85, CHA: 90, PSY: 80 }
        }
    };

    // Show the CROSS popup when the CROSS faction button is clicked
    function handleCrossFactionButtonClick() {
        var crossButton = document.querySelector('.faction-button[data-faction="?????"]');
        if (crossButton) {
            crossButton.addEventListener('click', function() {
                setTimeout(displayCrossPopup, 50);
            });
        }
    }
    handleCrossFactionButtonClick();

    // Display the CROSS popup and populate its grid
    function displayCrossPopup() {
        crossPopupContainer.style.display = 'block';
        populateCrossGrid();
    }

    // Populate the CROSS grid with cards for each unit
    function populateCrossGrid() {
        crossGridContainer.innerHTML = ''; // Clear previous content
        
        // Display a randomly generated title for the faction
        const randomSequence = generateRandomNonLetterSequence();
        const factionTitle = document.getElementById('faction-units-title');
        if (factionTitle) {
            factionTitle.textContent = randomSequence + ' Units';
            factionTitle.style.fontFamily = 'monospace';
            factionTitle.style.textShadow = '0 0 8px #fff';
        }
        
        for (var key in crossUnitsData) {
            if (crossUnitsData.hasOwnProperty(key)) {
                var unit = crossUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'cross-unit-item';
                unitElement.style.fontFamily = 'monospace';
                unitElement.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                unitElement.style.background = 'rgba(0, 0, 0, 0.7)';
                
                // Call the name function to get a randomized designation
                const unitName = typeof unit.name === 'function' ? unit.name() : unit.name;
                
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/Factions/Cross/default_agent.png'" 
                         alt="${unitName}" 
                         class="cross-unit-icon"
                         style="filter: grayscale(70%) brightness(70%);">
                    <div class="cross-unit-name" style="color: #00ffaa; letter-spacing: 1px;">${unitName}</div>
                    <div class="cross-unit-description" style="font-style: italic; opacity: 0.7;">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'ACCESS FILE';
                detailsButton.style.background = '#111';
                detailsButton.style.color = '#00ffaa';
                detailsButton.style.border = '1px solid #00ffaa';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayCrossUnitDetails(currentKey, crossUnitsData, crossPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                crossGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific CROSS unit
    function displayCrossUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'cross');
    }

    // Function to close a specific CROSS unit details modal
    function closeCrossUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'cross');
    }

    // Close the CROSS popup when its close button is clicked
    if (crossPopupClose) {
        crossPopupClose.addEventListener('click', function() {
            crossPopupContainer.style.display = 'none';
            // Close all cross modals when closing the popup
            FactionModals.closeAllModals('cross');
        });
    }

    // Clicking outside of the CROSS popup container will close it
    document.addEventListener('click', function(e) {
        if (crossPopupContainer && 
            crossPopupContainer.style.display === 'block' &&
            !crossPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="?????"]')) {
            crossPopupContainer.style.display = 'none';
            // Close all cross modals when closing the popup
            FactionModals.closeAllModals('cross');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.cross-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closeCrossUnitDetails(unitKey);
            } else if (crossPopupContainer && crossPopupContainer.style.display === 'block') {
                crossPopupContainer.style.display = 'none';
                // Close all cross modals when closing the popup
                FactionModals.closeAllModals('cross');
            }
        }
    });
});