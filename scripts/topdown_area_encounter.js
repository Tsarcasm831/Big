/**
 * topdown_area_encounter.js
 * Module for handling the TopDown area encounters
 */

window.TopDownAreaEncounter = (function() {
  // Private variables
  let overlay;
  let iframe;
  let closeButton;
  let loadingIndicator;
  let isActive = false;

  // Initialize the module
  function init() {
    console.log('TopDownAreaEncounter module initializing...');
    
    // Get DOM elements
    overlay = document.getElementById('topdown-area-overlay');
    iframe = document.getElementById('topdown-area-iframe');
    closeButton = document.querySelector('.topdown-area-close');
    loadingIndicator = document.querySelector('.topdown-area-loading');
    
    if (!overlay || !iframe || !closeButton) {
      console.error('TopDownAreaEncounter: Required DOM elements not found!');
      return;
    }
    
    // Set up event listeners
    closeButton.addEventListener('click', closeEncounter);
    
    // Listen for iframe load events
    iframe.addEventListener('load', function() {
      // Hide loading indicator when iframe has loaded
      if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
      }
    });
    
    // Listen for escape key to close the encounter
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isActive) {
        closeEncounter();
      }
    });

    // Listen for the non-combat encounter event specific to our type
    document.addEventListener('nonCombatEncounterEngaged', function(e) {
      if (e.detail && e.detail.encounterType === 'TOPDOWN_AREA') {
        openEncounter();
      }
    });
    
    console.log('TopDownAreaEncounter module initialized');
    
    return {
      openEncounter,
      closeEncounter,
      isOpen: function() { return isActive; }
    };
  }
  
  // Open the TopDown area encounter view
  function openEncounter() {
    console.log('Opening TopDown area encounter');
    
    if (!overlay || !iframe) {
      console.error('TopDownAreaEncounter: Required DOM elements not found!');
      return;
    }
    
    // Show loading indicator
    if (loadingIndicator) {
      loadingIndicator.classList.remove('hidden');
    }
    
    // Set the iframe source to the index.html in the topdown folder (corrected case and filename)
    iframe.src = 'topdown/index.html';
    
    // Show the overlay
    overlay.classList.add('active');
    isActive = true;
    
    // Pause game actions while exploring the topdown area
    if (window.gameState) {
      window.gameState.isEncounterActive = true;
    }
    
    console.log('TopDown area encounter opened');
  }
  
  // Close the TopDown area encounter view
  function closeEncounter() {
    console.log('Closing TopDown area encounter');
    
    if (!overlay) {
      console.error('TopDownAreaEncounter: Overlay element not found!');
      return;
    }
    
    // Hide the overlay
    overlay.classList.remove('active');
    isActive = false;
    
    // Reset iframe source to prevent continued execution
    setTimeout(() => {
      iframe.src = '';
    }, 300);
    
    // Resume game actions
    if (window.gameState) {
      window.gameState.isEncounterActive = false;
    }
    
    console.log('TopDown area encounter closed');
  }
  
  // Return the public API
  return {
    init,
    openEncounter,
    closeEncounter
  };
})();

// Auto-initialize if the document is already loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('TopDownAreaEncounter: DOM loaded, initializing...');
  window.TopDownAreaEncounter.init();
});