document.addEventListener('DOMContentLoaded', function() {
  // Select the "Noah's Wasteland Supply" button by its text content
  const noahsBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                        .find(btn => btn.textContent.trim() === "Noah's Wasteland Supply");
  if (!noahsBtn) {
    console.error("Noah's Wasteland Supply button not found.");
    return;
  }

  // Create the modal popup container for Noah's Supply Shop grid view popup
  const popup = document.createElement('div');
  popup.id = 'noahs-supply-popup';
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

  // Inner content for the Noah's Supply Shop grid view popup
  popup.innerHTML = `
    <div id="noahs-supply-content" style="background: white; padding: 20px; border-radius: 8px; position: relative; max-width:90%; max-height:90%; overflow: auto;">
      <button id="noahs-supply-close" style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <h2 style="text-align: center;">Noah's Supply Shop</h2>
      <svg width="500" height="500" viewBox="0 0 500 500" style="border: 1px solid #aaa; box-shadow: 2px 2px 8px rgba(0,0,0,0.5);">
        <rect x="0" y="0" width="500" height="500" fill="#FDF5E6" stroke="black"/>
        <!-- Top banner -->
        <rect x="50" y="20" width="400" height="60" fill="#4682B4" stroke="black"/>
        <text x="250" y="55" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Noah's Supply Shop</text>
        <!-- Gun Case -->
        <rect x="50" y="100" width="150" height="150" fill="#808080" stroke="black"/>
        <text x="125" y="175" text-anchor="middle" fill="white" font-size="16" font-family="Arial">Gun Case</text>
        <!-- Armor Display Cases -->
        <rect x="250" y="100" width="200" height="70" fill="#B0C4DE" stroke="black"/>
        <text x="350" y="145" text-anchor="middle" fill="black" font-size="16" font-family="Arial">Armor Display A</text>
        <rect x="250" y="190" width="200" height="70" fill="#B0C4DE" stroke="black"/>
        <text x="350" y="235" text-anchor="middle" fill="black" font-size="16" font-family="Arial">Armor Display B</text>
        <rect x="250" y="280" width="200" height="70" fill="#B0C4DE" stroke="black"/>
        <text x="350" y="325" text-anchor="middle" fill="black" font-size="16" font-family="Arial">Armor Display C</text>
        <rect x="250" y="370" width="200" height="70" fill="#B0C4DE" stroke="black"/>
        <text x="350" y="415" text-anchor="middle" fill="black" font-size="16" font-family="Arial">Armor Display D</text>
      </svg>
    </div>
  `;
  document.body.appendChild(popup);

  // Functions to show and hide the popup
  function showNoahsPopup() {
    popup.style.display = 'flex';
  }
  function hideNoahsPopup() {
    popup.style.display = 'none';
  }

  // Open the popup when the "Noah's Wasteland Supply" button is clicked
  noahsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showNoahsPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#noahs-supply-close').addEventListener('click', hideNoahsPopup);

  // Also hide the popup when clicking outside the inner content
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideNoahsPopup();
    }
  });
});