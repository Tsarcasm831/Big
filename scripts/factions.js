// Factions functionality
document.addEventListener('DOMContentLoaded', function() {
  // Factions popup functionality
  const factionsButton = document.getElementById('factions-button');
  const factionsPopup = document.getElementById('factions-popup');
  const factionsPopupClose = document.getElementById('factions-popup-close');
  const factionButtons = document.querySelectorAll('.faction-button');
  
  // Faction units popup functionality
  const factionUnitsContainer = document.getElementById('faction-units-container');
  const factionUnitsClose = document.getElementById('faction-units-close');
  const factionUnitsTitle = document.getElementById('faction-units-title');
  
  // Unit lists for each faction
  const hiveUnits = document.getElementById('hive-units');
  const fdgUnits = document.getElementById('fdg-units');
  const alliesUnits = document.getElementById('allies-units');
  const aliensUnits = document.getElementById('aliens-units');
  
  // New unit lists for additional factions
  const prometheusUnits = document.getElementById('prometheus-units');
  const questionUnits = document.getElementById('question-units'); // for "?????" faction
  const acesUnits = document.getElementById('aces-units');
  const mutantsUnits = document.getElementById('mutants-units');
  
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
  
  // Open the factions popup when the button is clicked
  factionsButton.addEventListener('click', function() {
    factionsPopup.style.display = 'block';
  });
  
  // Close the popup when the close button is clicked
  factionsPopupClose.addEventListener('click', function() {
    factionsPopup.style.display = 'none';
  });
  
  // Close the popup when clicking outside of it
  document.addEventListener('click', function(e) {
    if (factionsPopup.style.display === 'block' && 
        !factionsPopup.contains(e.target) && 
        e.target !== factionsButton) {
      factionsPopup.style.display = 'none';
    }
    
    if (factionUnitsContainer.style.display === 'block' && 
        !factionUnitsContainer.contains(e.target)) {
      factionUnitsContainer.style.display = 'none';
    }
  });
  
  // Close the units popup when the close button is clicked
  factionUnitsClose.addEventListener('click', function() {
    factionUnitsContainer.style.display = 'none';
  });
  
  // Function to show the units for a specific faction
  function showFactionUnits(faction) {
    // Hide all unit lists first
    hiveUnits.style.display = 'none';
    fdgUnits.style.display = 'none';
    alliesUnits.style.display = 'none';
    aliensUnits.style.display = 'none';
    prometheusUnits.style.display = 'none';
    questionUnits.style.display = 'none';
    acesUnits.style.display = 'none';
    mutantsUnits.style.display = 'none';
    
    // Clear any previous title styling
    factionUnitsTitle.style.color = '';
    factionUnitsTitle.style.textShadow = '';
    
    // Set the title based on the faction
    let title = '';
    
    // Show the appropriate unit list and apply faction-specific styling
    switch(faction) {
      case 'hive':
        hiveUnits.style.display = 'grid';
        title = 'H.I.V.E. Units';
        factionUnitsTitle.style.color = 'yellow';
        break;
      case 'fdg':
        fdgUnits.style.display = 'grid';
        title = 'FDG Units';
        factionUnitsTitle.style.color = 'green';
        break;
      case 'allies':
        alliesUnits.style.display = 'grid';
        title = 'Allies Units';
        break;
      case 'aliens':
        aliensUnits.style.display = 'grid';
        title = 'Alien Races';
        factionUnitsTitle.style.color = 'purple';
        break;
      case 'prometheus':
        prometheusUnits.style.display = 'grid';
        title = 'Prometheus Units';
        factionUnitsTitle.style.color = 'green';
        factionUnitsTitle.style.textShadow = '1px 1px 2px steelblue';
        break;
      case '?????':
        questionUnits.style.display = 'grid';
        title = generateRandomNonLetterSequence() + ' Units';
        break;
      case 'aces':
        acesUnits.style.display = 'grid';
        title = 'The Aces Units';
        factionUnitsTitle.style.color = 'red';
        break;
      case 'mutants':
        mutantsUnits.style.display = 'grid';
        title = 'Mutants Units';
        factionUnitsTitle.style.color = 'orange';
        factionUnitsTitle.style.textShadow = '1px 1px 2px purple';
        break;
      default:
        title = 'Units';
        break;
    }
    
    // Set the title and show the container
    factionUnitsTitle.textContent = title;
    factionUnitsContainer.style.display = 'block';
  }
  
  // Add click event listeners to the faction buttons
  factionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const faction = this.getAttribute('data-faction');
      console.log(`Selected faction: ${faction}`);
      
      // Close the factions popup
      factionsPopup.style.display = 'none';
      
      // Show the units for the selected faction
      showFactionUnits(faction);
    });
  });
  
  // Add click event listeners to unit items
  document.querySelectorAll('.unit-item').forEach(item => {
    item.addEventListener('click', function() {
      const unitName = this.textContent;
      console.log(`Selected unit: ${unitName}`);
      
      // Here you can add code to handle the unit selection
      // For example, show details about the unit
      
      // Close the units popup after selection
      factionUnitsContainer.style.display = 'none';
    });
  });

  // Expose the showFactionUnits function globally so it can be used by other scripts
  window.showFactionUnits = showFactionUnits;
});
