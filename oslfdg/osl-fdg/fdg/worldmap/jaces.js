document.addEventListener('DOMContentLoaded', function() {
  // Inject modal styles for Jace's Pawn & Gun if not already added
  if (!document.getElementById('jaces-modal-styles')) {
    var style = document.createElement('style');
    style.id = 'jaces-modal-styles';
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        opacity: 0;
        animation: fadeIn 0.4s forwards;
      }
      .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        position: relative;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: scale(0.95);
        animation: scaleIn 0.4s forwards;
      }
      .modal-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #888;
        transition: color 0.2s;
      }
      .modal-close-btn:hover {
        color: #333;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); }
        to { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Select the "Jace's Pawn & Gun" button by its text content
  const jacesBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                         .find(btn => btn.textContent.trim() === "Jace's Pawn & Gun");
  if (!jacesBtn) {
    console.error("Jace's Pawn & Gun button not found.");
    return;
  }

  // Create the modal popup container for Jace's show grid view
  const popup = document.createElement('div');
  popup.id = 'jaces-show-popup';
  popup.className = 'modal-overlay';
  // Hide the popup initially so it doesn't appear on launch
  popup.style.display = 'none';
  
  // Inner content for the popup using modal-content class and improved elements
  popup.innerHTML = `
    <div id="jaces-show-content" class="modal-content">
      <button id="jaces-show-close" class="modal-close-btn">&times;</button>
      <h2 style="text-align: center; margin-bottom: 16px;">Jace's Pawn & Gun Show</h2>
      <svg width="500" height="500" viewBox="0 0 500 500" style="border: 1px solid #aaa; box-shadow: 2px 2px 8px rgba(0,0,0,0.5);">
        <!-- Main top showcase with refined styling -->
        <rect x="50" y="20" width="400" height="80" fill="#2F4F4F" stroke="#333" stroke-width="1"/>
        <text x="250" y="70" text-anchor="middle" fill="#fff" font-size="20" font-family="Verdana" font-weight="bold">
          Main Showcase
        </text>
        <!-- Left weapon display case -->
        <rect x="50" y="120" width="150" height="120" fill="#C0C0C0" stroke="#333" stroke-width="1"/>
        <text x="125" y="180" text-anchor="middle" fill="#000" font-size="14" font-family="Verdana">
          Weapon Display A
        </text>
        <!-- Right weapon display case -->
        <rect x="300" y="120" width="150" height="120" fill="#C0C0C0" stroke="#333" stroke-width="1"/>
        <text x="375" y="180" text-anchor="middle" fill="#000" font-size="14" font-family="Verdana">
          Weapon Display B
        </text>
        <!-- Center showcase -->
        <rect x="200" y="260" width="100" height="100" fill="#708090" stroke="#333" stroke-width="1"/>
        <text x="250" y="320" text-anchor="middle" fill="#fff" font-size="14" font-family="Verdana">
          Weapon Showcase
        </text>
        <!-- Bottom left display case -->
        <rect x="50" y="400" width="150" height="60" fill="#D3D3D3" stroke="#333" stroke-width="1"/>
        <text x="125" y="440" text-anchor="middle" fill="#000" font-size="14" font-family="Verdana">
          Display Case A
        </text>
        <!-- Bottom right display case -->
        <rect x="300" y="400" width="150" height="60" fill="#D3D3D3" stroke="#333" stroke-width="1"/>
        <text x="375" y="440" text-anchor="middle" fill="#000" font-size="14" font-family="Verdana">
          Display Case B
        </text>
      </svg>
    </div>
  `;
  document.body.appendChild(popup);

  // Function to show the popup (CSS animations will handle the fade and scale effects)
  function showJacesPopup() {
    popup.style.display = 'flex';
  }

  // Function to hide the popup
  function hideJacesPopup() {
    popup.style.display = 'none';
  }

  // Open the popup when the button is clicked
  jacesBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showJacesPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#jaces-show-close').addEventListener('click', hideJacesPopup);

  // Also hide the popup when clicking outside the content container
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideJacesPopup();
    }
  });
});