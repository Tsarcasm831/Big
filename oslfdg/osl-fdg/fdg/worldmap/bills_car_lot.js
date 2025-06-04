document.addEventListener('DOMContentLoaded', function() {
  // Inject custom styles for a polished modal popup if not already added
  if (!document.getElementById('bills-car-lot-styles')) {
    var style = document.createElement('style');
    style.id = 'bills-car-lot-styles';
    style.textContent = `
      /* Modal overlay styling */
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
        animation: fadeIn 0.3s forwards;
      }
      /* Modal content styling */
      .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: scaleIn 0.3s forwards;
      }
      /* Close button styling */
      .modal-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #555;
        transition: color 0.2s ease;
      }
      .modal-close-btn:hover {
        color: #000;
      }
      /* Fade and scale animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      /* Enhance the SVG appearance */
      .car-lot-svg {
        border: 1px solid #aaa;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: #f9f9f9;
      }
    `;
    document.head.appendChild(style);
  }

  // Select the "Bill's Car Lot" button by its text content
  const billsBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
    .find(btn => btn.textContent.trim() === "Bill's Car Lot");
  if (!billsBtn) {
    console.error("Bill's Car Lot button not found.");
    return;
  }

  // Create the modal popup container and assign the overlay class
  const popup = document.createElement('div');
  popup.id = 'bills-car-lot-popup';
  popup.classList.add('modal-overlay');
  popup.style.display = 'none'; // Initially hidden

  // Create inner content container with professional styling
  const content = document.createElement('div');
  content.id = 'bills-car-lot-content';
  content.classList.add('modal-content');
  content.innerHTML = `
    <button id="bills-car-lot-close" class="modal-close-btn">&times;</button>
    <h2 style="text-align: center; margin-bottom: 10px;">Bill's Car Lot</h2>
    <svg class="car-lot-svg" width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Define inline car icons with different colors -->
        <symbol id="car-icon-1" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#e74c3c" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
        <symbol id="car-icon-2" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#3498db" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
        <symbol id="car-icon-3" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#2ecc71" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
        <symbol id="car-icon-4" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#f39c12" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
        <symbol id="car-icon-5" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#9b59b6" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
        <symbol id="car-icon-6" viewBox="0 0 100 100">
          <rect x="20" y="40" width="60" height="20" fill="#1abc9c" rx="5" />
          <circle cx="35" cy="65" r="5" fill="#333" />
          <circle cx="65" cy="65" r="5" fill="#333" />
        </symbol>
      </defs>
      <!-- Parking lot background -->
      <rect x="10" y="10" width="580" height="380" fill="#D3D3D3" stroke="#333" stroke-width="2"></rect>
      
      <!-- 8 Parking spots arranged in 2 rows x 4 columns -->
      <!-- Row 1 parking spots -->
      <rect x="10" y="10" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="155" y="10" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="300" y="10" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="445" y="10" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <!-- Row 2 parking spots -->
      <rect x="10" y="200" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="155" y="200" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="300" y="200" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      <rect x="445" y="200" width="145" height="190" fill="#FFFFFF" stroke="#333"></rect>
      
      <!-- Insert car icons using inline SVG <use> elements -->
      <!-- First row: place cars in the first three spots -->
      <use href="#car-icon-1" x="42" y="65" width="80" height="80" />
      <use href="#car-icon-2" x="187" y="65" width="80" height="80" />
      <use href="#car-icon-3" x="332" y="65" width="80" height="80" />
      <!-- Second row: place cars in the first three spots of row 2 -->
      <use href="#car-icon-4" x="42" y="255" width="80" height="80" />
      <use href="#car-icon-5" x="187" y="255" width="80" height="80" />
      <use href="#car-icon-6" x="332" y="255" width="80" height="80" />
      
      <!-- Small shop building in the top right corner -->
      <rect x="500" y="20" width="80" height="60" fill="#8B4513" stroke="#333" stroke-width="2"></rect>
      <text x="540" y="55" text-anchor="middle" fill="#fff" font-size="12" font-family="Arial">Shop</text>
    </svg>
  `;

  // Append the content container to the popup and the popup to the body
  popup.appendChild(content);
  document.body.appendChild(popup);

  // Function to show the popup using CSS animations
  function showBillsCarLotPopup() {
    popup.style.display = 'flex';
  }
  // Function to hide the popup
  function hideBillsCarLotPopup() {
    popup.style.display = 'none';
  }

  // Open the popup when the "Bill's Car Lot" button is clicked
  billsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showBillsCarLotPopup();
  });

  // Close the popup when the close button is clicked
  content.querySelector('#bills-car-lot-close').addEventListener('click', hideBillsCarLotPopup);

  // Also hide the popup when clicking outside the inner content
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideBillsCarLotPopup();
    }
  });
});