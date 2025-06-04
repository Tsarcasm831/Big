// factions-prometheus.js - Handles the Prometheus faction functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    var prometheusPopupContainer = document.getElementById('prometheus-popup-container');
    var prometheusPopupClose = document.getElementById('prometheus-popup-close');
    var prometheusGridContainer = document.getElementById('prometheus-units-grid');

    // Prometheus faction units data
    var prometheusUnitsData = {
        researcher: {
            name: "Researcher",
            description: "Scientific expert specializing in data analysis and experimental research.",
            imageSrc: "assets/icons/prometheus_outpost.png",
            abilities: ["Scientific Analysis", "Research Specialization", "Laboratory Expertise"],
            stats: { STR: 40, DEX: 70, AGI: 55, VIT: 50, COM: 60, INT: 95, PER: 85, CHA: 60, PSY: 65 }
        },
        technician: {
            name: "Advanced Technician",
            description: "Engineering specialist with expertise in high-tech systems and equipment.",
            imageSrc: "assets/icons/prometheus_outpost.png",
            abilities: ["Technical Engineering", "System Optimization", "Equipment Maintenance"],
            stats: { STR: 55, DEX: 85, AGI: 60, VIT: 60, COM: 75, INT: 90, PER: 80, CHA: 50, PSY: 55 }
        },
        fieldAgent: {
            name: "Field Agent",
            description: "Operative trained to collect specimens and data from hazardous environments.",
            imageSrc: "assets/icons/prometheus_outpost.png",
            abilities: ["Specimen Collection", "Environmental Assessment", "Adaptive Response"],
            stats: { STR: 70, DEX: 75, AGI: 80, VIT: 75, COM: 65, INT: 80, PER: 85, CHA: 60, PSY: 70 }
        },
        bioEngineer: {
            name: "Bio-Engineer",
            description: "Specialist in genetic modification and biological systems engineering.",
            imageSrc: "assets/icons/prometheus_outpost.png",
            abilities: ["Genetic Engineering", "Biological Analysis", "Synthetic Development"],
            stats: { STR: 45, DEX: 80, AGI: 60, VIT: 55, COM: 70, INT: 95, PER: 80, CHA: 55, PSY: 75 }
        },
        director: {
            name: "Project Director",
            description: "Senior leadership responsible for research direction and resource allocation.",
            imageSrc: "assets/icons/prometheus_outpost.png",
            abilities: ["Strategic Planning", "Team Management", "Resource Allocation"],
            stats: { STR: 50, DEX: 60, AGI: 50, VIT: 65, COM: 90, INT: 90, PER: 75, CHA: 85, PSY: 80 }
        }
    };

    // Show the prometheus popup when the prometheus faction button is clicked
    function handlePrometheusFactionButtonClick() {
        var prometheusButton = document.querySelector('.faction-button[data-faction="prometheus"]');
        if (prometheusButton) {
            prometheusButton.addEventListener('click', function() {
                setTimeout(displayPrometheusPopup, 50);
            });
        }
    }
    handlePrometheusFactionButtonClick();

    // Display the prometheus popup and populate its grid
    function displayPrometheusPopup() {
        prometheusPopupContainer.style.display = 'block';
        populatePrometheusGrid();
    }

    // Populate the prometheus grid with cards for each unit
    function populatePrometheusGrid() {
        prometheusGridContainer.innerHTML = ''; // Clear previous content
        
        for (var key in prometheusUnitsData) {
            if (prometheusUnitsData.hasOwnProperty(key)) {
                var unit = prometheusUnitsData[key];
                
                var unitElement = document.createElement('div');
                unitElement.className = 'prometheus-unit-item';
                unitElement.innerHTML = `
                    <img src="${unit.imageSrc}" 
                         onerror="this.onerror=null; this.src='assets/icons/prometheus_outpost_nobg.png'" 
                         alt="${unit.name}" 
                         class="prometheus-unit-icon">
                    <div class="prometheus-unit-name">${unit.name}</div>
                    <div class="prometheus-unit-description">${unit.description}</div>
                `;
                
                // Create a button to view details
                var detailsButton = document.createElement('button');
                detailsButton.className = 'view-details-button';
                detailsButton.textContent = 'View Details';
                
                // Using a closure to capture the current key value
                (function(currentKey) {
                    detailsButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        displayPrometheusUnitDetails(currentKey, prometheusUnitsData, prometheusPopupContainer);
                    });
                })(key);
                
                unitElement.appendChild(detailsButton);
                prometheusGridContainer.appendChild(unitElement);
            }
        }
    }

    // Function to display details for a specific prometheus unit
    function displayPrometheusUnitDetails(unitKey, unitsData, popupContainer) {
        // Use the shared FactionModals module to display the unit details
        FactionModals.displayUnitDetails(unitKey, unitsData, popupContainer, 'prometheus');
    }

    // Function to close a specific prometheus unit details modal
    function closePrometheusUnitDetails(unitKey) {
        // Use the shared FactionModals module to close the unit details
        FactionModals.closeUnitDetails(unitKey, 'prometheus');
    }

    // Close the prometheus popup when its close button is clicked
    if (prometheusPopupClose) {
        prometheusPopupClose.addEventListener('click', function() {
            prometheusPopupContainer.style.display = 'none';
            // Close all prometheus modals when closing the popup
            FactionModals.closeAllModals('prometheus');
        });
    }

    // Clicking outside of the prometheus popup container will close it
    document.addEventListener('click', function(e) {
        if (prometheusPopupContainer && 
            prometheusPopupContainer.style.display === 'block' &&
            !prometheusPopupContainer.contains(e.target) &&
            !e.target.closest('.faction-button[data-faction="prometheus"]')) {
            prometheusPopupContainer.style.display = 'none';
            // Close all prometheus modals when closing the popup
            FactionModals.closeAllModals('prometheus');
        }
    });

    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.faction-details-modal.prometheus-details-modal.show');
            if (openModal) {
                const unitKey = openModal.getAttribute('data-unit');
                closePrometheusUnitDetails(unitKey);
            } else if (prometheusPopupContainer && prometheusPopupContainer.style.display === 'block') {
                prometheusPopupContainer.style.display = 'none';
                // Close all prometheus modals when closing the popup
                FactionModals.closeAllModals('prometheus');
            }
        }
    });
});