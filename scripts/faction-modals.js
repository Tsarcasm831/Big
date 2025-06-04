// faction-modals.js - Shared functionality for faction details modals

const FactionModals = (function() {
    // Private variables and functions
    const modalCache = new Map();
    
    /**
     * Displays a unit details modal with the given data
     * @param {string} unitKey - The key of the unit to display
     * @param {Object} unitsData - Object containing unit data
     * @param {HTMLElement} popupContainer - The container element for the popup
     * @param {string} factionClass - CSS class for faction-specific styling (e.g., 'fdg', 'mutants')
     */
    function displayUnitDetails(unitKey, unitsData, popupContainer, factionClass) {
        const unit = unitsData[unitKey];
        if (!unit) return;

        // Make sure the popup container is visible
        popupContainer.style.display = 'block';

        // Create a unique modal ID based on faction and unit
        const modalId = `${factionClass}-${unitKey}`;

        // Check if modal already exists in cache
        let modal = modalCache.get(modalId);
        
        if (!modal) {
            // Create new modal if it doesn't exist
            modal = document.createElement('div');
            modal.className = `faction-details-modal ${factionClass}-details-modal`;
            modal.setAttribute('data-unit', unitKey);
            modal.setAttribute('aria-hidden', 'true');

            modal.innerHTML = `
                <div class="modal-content">
                    <button class="close-button" data-close-unit="${unitKey}">&times;</button>
                    <div class="unit-detail-header">
                        <img src="${unit.imageSrc}" 
                             onerror="this.onerror=null; this.src='assets/icons/combat.webp'" 
                             alt="${unit.name}" 
                             class="unit-image">
                        <h2>${unit.name}</h2>
                    </div>
                    <div class="unit-detail-body">
                        <p class="unit-description">${unit.description}</p>
                        <div class="unit-abilities">
                            <h3>Abilities</h3>
                            <ul>
                                ${unit.abilities.map(ability => `<li>${ability}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="unit-stats">
                            <h3>Stats</h3>
                            <div class="stats-grid">
                                ${Object.keys(unit.stats).map(function(stat) {
                                    return `
                                        <div class="stat-item">
                                            <div class="stat-name">${stat}</div>
                                            <div class="stat-value">${unit.stats[stat]}</div>
                                            <div class="stat-bar" style="width: ${Math.min(100, unit.stats[stat]/2)}%;"></div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Append the modal to the popup container
            popupContainer.appendChild(modal);
            
            // Add event listener to close the modal when the close button is clicked
            modal.querySelector(`[data-close-unit="${unitKey}"]`).addEventListener('click', function(e) {
                e.stopPropagation();
                closeUnitDetails(unitKey, factionClass);
            });
            
            // Add event listener to close the modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeUnitDetails(unitKey, factionClass);
                }
            });
            
            // Add to cache
            modalCache.set(modalId, modal);
        }
        
        // Show the modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Prevent event propagation to stop closing the popup
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    /**
     * Closes a specific unit details modal
     * @param {string} unitKey - The key of the unit to close
     * @param {string} factionClass - The faction CSS class
     */
    function closeUnitDetails(unitKey, factionClass) {
        const modalId = `${factionClass}-${unitKey}`;
        const modal = modalCache.get(modalId);
        
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            
            // We don't remove from DOM, just hide to keep in cache
        }
    }

    /**
     * Closes all modals for a faction when the popup is closed
     * @param {string} factionClass - The faction CSS class
     */
    function closeAllModals(factionClass) {
        modalCache.forEach((modal, id) => {
            if (id.startsWith(factionClass)) {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Public API
    return {
        displayUnitDetails,
        closeUnitDetails,
        closeAllModals
    };
})();

// Export for other modules to use
window.FactionModals = FactionModals;