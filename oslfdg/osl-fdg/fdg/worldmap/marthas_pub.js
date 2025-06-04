document.addEventListener('DOMContentLoaded', function() {
  // Select the "Martha's Pub" button by its text content
  const marthasPubBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                            .find(btn => btn.textContent.trim() === "Martha's Pub");
  if (!marthasPubBtn) {
    console.error("Martha's Pub button not found.");
    return;
  }

  // Create the modal popup container for the tavern grid view
  const popup = document.createElement('div');
  popup.id = 'marthas-pub-popup';
  // Style the popup overlay
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100%';
  popup.style.height = '100%';
  popup.style.background = 'rgba(0, 0, 0, 0.7)';
  popup.style.display = 'none';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = '3000';

  // Inner content for the tavern blueprint popup
  popup.innerHTML = `
    <div id="marthas-pub-content" style="background: white; padding: 20px; border-radius: 8px; position: relative; max-width:90%; max-height:90%; overflow: auto;">
      <button id="marthas-pub-close" style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <h2 style="text-align: center;">Martha's Pub Tavern</h2>
      <svg width="500" height="500" viewBox="0 0 500 500" style="border: 1px solid #aaa; box-shadow: 2px 2px 8px rgba(0,0,0,0.5);">
        <rect x="0" y="0" width="500" height="500" fill="#F5F5DC" stroke="black"/>
        <rect x="50" y="20" width="400" height="80" fill="#8B4513" stroke="black" />
        <text x="250" y="70" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Bar</text>
        <circle cx="150" cy="200" r="30" fill="#D2B48C" stroke="black" />
        <text x="150" y="210" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Table 1</text>
        <circle cx="350" cy="200" r="30" fill="#D2B48C" stroke="black" />
        <text x="350" y="210" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Table 2</text>
        <circle cx="150" cy="350" r="30" fill="#D2B48C" stroke="black" />
        <text x="150" y="360" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Table 3</text>
        <circle cx="350" cy="350" r="30" fill="#D2B48C" stroke="black" />
        <text x="350" y="360" text-anchor="middle" fill="black" font-size="12" font-family="Arial">Table 4</text>
      </svg>
    </div>
  `;
  document.body.appendChild(popup);

  // Function to show the popup
  function showTavernPopup() {
    popup.style.display = 'flex';
  }

  // Function to hide the popup
  function hideTavernPopup() {
    popup.style.display = 'none';
  }

  // Open the tavern popup when the "Martha's Pub" button is clicked
  marthasPubBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showTavernPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#marthas-pub-close').addEventListener('click', hideTavernPopup);

  // Also hide the popup when clicking outside the inner content
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideTavernPopup();
    }
  });
});