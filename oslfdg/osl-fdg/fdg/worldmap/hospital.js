document.addEventListener('DOMContentLoaded', function() {
  // Select the "Hospital" button by its text content
  const hospitalBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                           .find(btn => btn.textContent.trim() === "Hospital");
  if (!hospitalBtn) {
    console.error("Hospital button not found.");
    return;
  }

  // Create the modal popup container for the hospital grid view
  const popup = document.createElement('div');
  popup.id = 'hospital-popup';
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

  // Inner content for the hospital blueprint popup
  popup.innerHTML = `
    <div id="hospital-content" style="background: white; padding: 20px; border-radius: 8px; position: relative; max-width:90%; max-height:90%; overflow: auto;">
      <button id="hospital-close" style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      <h2 style="text-align: center;">Hospital</h2>
      <svg width="500" height="500" viewBox="0 0 500 500" style="border: 1px solid #aaa; box-shadow: 2px 2px 8px rgba(0,0,0,0.5);">
        <!-- Background -->
        <rect x="0" y="0" width="500" height="500" fill="#F5F5F5" stroke="black"/>
        <!-- Reception Desk -->
        <rect x="150" y="20" width="200" height="60" fill="#8B0000" stroke="black"/>
        <text x="250" y="55" text-anchor="middle" fill="white" font-size="20" font-family="Arial">Reception</text>
        <!-- Beds: arranged as 3 columns, 2 rows -->
        <!-- First row -->
        <rect x="35" y="110" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="95" y="170" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 1</text>
        <rect x="190" y="110" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="250" y="170" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 2</text>
        <rect x="345" y="110" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="405" y="170" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 3</text>
        <!-- Second row -->
        <rect x="35" y="225" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="95" y="285" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 4</text>
        <rect x="190" y="225" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="250" y="285" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 5</text>
        <rect x="345" y="225" width="120" height="100" fill="#B0E0E6" stroke="black"/>
        <text x="405" y="285" text-anchor="middle" fill="black" font-size="14" font-family="Arial">Bed 6</text>
      </svg>
    </div>
  `;
  document.body.appendChild(popup);

  // Function to show the popup
  function showHospitalPopup() {
    popup.style.display = 'flex';
  }

  // Function to hide the popup
  function hideHospitalPopup() {
    popup.style.display = 'none';
  }

  // Open the hospital popup when the "Hospital" button is clicked
  hospitalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showHospitalPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#hospital-close').addEventListener('click', hideHospitalPopup);

  // Also hide the popup when clicking outside the inner content
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideHospitalPopup();
    }
  });
});