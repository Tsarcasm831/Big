// osl-fdg/osl/scripts/osl_portal.js
// Use absolute path defined in import map
import { initializeUser, getUserIdentifier, clearUserSession } from '/oslfdg/userDatabase.js';
import { allEntries } from '../data/bestiaryData.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("OSL Portal Script Initializing...");

    // Initialize user identity
    const userId = initializeUser();
    console.log("OSL Portal Script Loaded. User ID:", userId);

    // --- UI Elements ---
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');
    const logoutButton = document.getElementById('logout-button');
    const navLinks = document.querySelectorAll('#portal-nav .nav-link');
    const operationsMapContainer = document.getElementById('operations-map-container'); // Container for BG image
    const operationsListContainer = document.getElementById('operations-list');
    const mapMarkersGroup = document.getElementById('operation-markers'); // SVG group for markers
    const operationsMapSvg = document.getElementById('operations-map-svg'); // The SVG overlay element

    // --- Check if Admin ---
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    // --- Update Header Info ---
    if (userIdentifierDisplay && userId) {
        userIdentifierDisplay.textContent = `Resonant ID: #${userId}`;
    } else if (userIdentifierDisplay) {
        userIdentifierDisplay.textContent = `Resonant ID: #UNKNOWN`;
    }
    if (userRankDisplay) {
        // Use admin status if available, otherwise default to Agent
        userRankDisplay.textContent = `Status: ${isAdmin ? 'Overseer' : 'Agent'}`;
    }

    // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout initiated.");
            clearUserSession();
            // Redirect to the main OSL::FDG login or threshold page
            window.location.href = '../osl-fdg_index.html'; // Redirect to login
        });
    }

    // --- Simplified Navigation Handling (Allowing Default) ---
    // The primary navigation is now handled by standard href links.
    // This script only needs to handle logout and dynamic content
    // on the specific page it's loaded on.
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = link.getAttribute('href');
            // Only log the click, allow default browser navigation
            console.log(`Navigating to: ${targetHref}`);
        });
    });

    // --- Modal Setup ---
    const modal = document.getElementById('entity-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    function openModal(entry) {
        modalContent.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = `${entry.id}: ${entry.name}`;
        modalContent.appendChild(title);
        const idMatch = entry.id.match(/([e|u])-\d+/i);
        if (idMatch) {
            const img = document.createElement('img');
            img.src = `/oslfdg/osl-fdg/osl/data/assets/${idMatch[0].toLowerCase()}.png`;
            img.alt = entry.name;
            img.className = 'modal-image';
            modalContent.appendChild(img);
        }
        const desc = document.createElement('p');
        desc.textContent = entry.description;
        modalContent.appendChild(desc);
        const detailsList = document.createElement('ul');
        [
            `Classification: ${entry.classification}`,
            `Threat: ${entry.threat}`,
            `Last Sighting: ${entry.lastSighting}`,
            `Disposition: ${entry.disposition}`
        ].forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            detailsList.appendChild(li);
        });
        modalContent.appendChild(detailsList);
        modal.classList.add('active');
    }

    // --- Sighting Cards Click to Bestiary ---
    const sightingCards = document.querySelectorAll('.sighting-card');
    if (sightingCards.length) {
        sightingCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const codeElem = card.querySelector('.entity-code');
                if (!codeElem) return;
                const id = codeElem.textContent.replace(/\[|\]/g, '');
                const entry = allEntries.find(e => e.id === id);
                if (entry) openModal(entry);
            });
        });
    }

    // --- Operations Map Initialization (Only run if on operations.html) ---
    // Check if the specific elements for the operations map exist on this page
    // Updated check to use the SVG overlay and list container
    // Check the current page filename to ensure this only runs on operations.html
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'operations.html' && operationsMapSvg && operationsListContainer && mapMarkersGroup) {
        initializeOperationsMap();
    } else if (document.getElementById('dashboard-section')) {
        // Initialize dashboard specific elements if needed
        console.log("Dashboard section found. Initializing dashboard elements (if any)...");
        // Example: update dynamic counters (if fetching data)
        // updateDashboardCounters();
    }
    // No specific JS needed for bestiary index page, handled by bestiary.js

    // If the current page is operations.html (or an SPA view simulating it)
    function initializeOperationsMap() {
        console.log("Initializing Colorado Operations Map...");

        // Make sure the background is set correctly via CSS
        const mapContainer = document.getElementById('operations-map-container');
        if (mapContainer) {
            // The background should be handled by osl_portal.css
            console.log("Operations map container found, background set via CSS.");
        }

        // --- Sample Operations Data (Updated for Colorado) ---
        // Coordinates are relative to an 800x600 SVG viewBox
        const operationsData = [
            { id: 'OP-448', entity: '[E-734]', location: 'Denver Metro Area', status: 'Active Engagement', coords: { x: 450, y: 300 }, threat: 'high' },
            { id: 'OP-447', entity: '[E-112]', location: 'Pueblo South Sector', status: 'Surveillance', coords: { x: 470, y: 450 }, threat: 'medium' },
            { id: 'OP-445', entity: 'Unknown Anomaly', location: 'Grand Junction Vicinity', status: 'Pending Assessment', coords: { x: 150, y: 320 }, threat: 'unknown' },
            { id: 'OP-501', entity: '[E-088]', location: 'Near Denver Outskirts', status: 'Monitoring', coords: { x: 470, y: 315 }, threat: 'low' },
            { id: 'OP-502', entity: '[E-455]', location: 'Near Colorado Springs', status: 'Containment Watch', coords: { x: 460, y: 380 }, threat: 'high' },
            // Add more sample operations if needed
        ];

        // Clear previous content
        const loadingLi = operationsListContainer.querySelector('.loading-operations');
        if (loadingLi) loadingLi.remove(); // Remove loading placeholder

        operationsListContainer.innerHTML = '';
        mapMarkersGroup.innerHTML = ''; // Clear old markers

        if (operationsData.length === 0) {
             operationsListContainer.innerHTML = '<li class="info-message">No active operations reported in Colorado Sector.</li>';
             return;
        }

        operationsData.forEach(op => {
            // Add Marker to Map SVG Overlay
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            marker.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-op-marker');
            // Adjust coordinates for marker size (center the 10x10 icon)
            marker.setAttribute('x', op.coords.x - 5);
            marker.setAttribute('y', op.coords.y - 5);
            marker.setAttribute('width', '10');
            marker.setAttribute('height', '10');
            marker.classList.add('op-marker', `op-marker-${op.threat}`);
            marker.dataset.opId = op.id; // Link marker to list item
            marker.setAttribute('aria-label', `Operation ${op.id}: ${op.entity} at ${op.location}`);
            marker.setAttribute('tabindex', '0'); // Make focusable

            // Add Tooltip (Simple SVG title)
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `Op ${op.id}: ${op.entity} - ${op.location} (${op.status})`;
            marker.appendChild(title);

            mapMarkersGroup.appendChild(marker);

            // Add Item to List
            const listItem = document.createElement('li');
            listItem.className = `operation-item ${op.threat}`;
            listItem.dataset.opId = op.id; // Link list item to marker

            let statusClass = '';
            if (op.status.toLowerCase().includes('active')) statusClass = 'status-active';
            else if (op.status.toLowerCase().includes('surveillance')) statusClass = 'status-surveillance';
            else if (op.status.toLowerCase().includes('pending')) statusClass = 'status-pending';
            // Add specific class for monitoring if needed
            else if (op.status.toLowerCase().includes('monitoring')) statusClass = 'status-monitoring';
            else if (op.status.toLowerCase().includes('containment')) statusClass = 'status-active'; // Treat containment watch as active for styling

            listItem.innerHTML = `
                <div>
                    <svg class="op-list-icon op-marker-${op.threat}" viewBox="0 0 10 10"><use href="#icon-op-marker"/></svg>
                    <strong>${op.id}:</strong> ${op.entity}
                </div>
                <div class="op-location">Location: ${op.location}</div>
                <div class="op-status ${statusClass || 'status-pending'}">Status: ${op.status}</div>
            `;
            operationsListContainer.appendChild(listItem);

            // Create modal popup for operation details
            // First check if modal container exists, if not create it
            let modalContainer = document.getElementById('op-modal-container');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'op-modal-container';
                modalContainer.style.position = 'absolute';
                modalContainer.style.top = '0';
                modalContainer.style.left = '0';
                modalContainer.style.width = '100%';
                modalContainer.style.height = '100%';
                modalContainer.style.pointerEvents = 'none';
                modalContainer.style.zIndex = '50';
                operationsMapContainer.appendChild(modalContainer);
            }
            
            // Helper function to show/hide modal and highlight
            const toggleOperationDetails = (id, show, event) => {
                const markerEl = mapMarkersGroup.querySelector(`.op-marker[data-op-id="${id}"]`);
                const listItemEl = operationsListContainer.querySelector(`li[data-op-id="${id}"]`);
                const operation = operationsData.find(o => o.id === id);
                
                // Toggle highlight classes
                if (markerEl) markerEl.classList.toggle('highlight', show);
                if (listItemEl) listItemEl.classList.toggle('highlight-list', show);
                
                // Handle modal
                if (show && operation) {
                    // Create or update modal
                    let modal = document.getElementById(`op-modal-${id}`);
                    if (!modal) {
                        modal = document.createElement('div');
                        modal.id = `op-modal-${id}`;
                        modal.className = `op-modal ${operation.threat}`;
                        modalContainer.appendChild(modal);
                    }
                    
                    // Position modal directly next to the marker
                    // First, get the SVG viewBox dimensions
                    const svgViewBox = operationsMapSvg.viewBox.baseVal;
                    const svgWidth = svgViewBox.width;
                    const svgHeight = svgViewBox.height;
                    
                    // Get the actual displayed dimensions of the SVG
                    const mapRect = operationsMapSvg.getBoundingClientRect();
                    const displayWidth = mapRect.width;
                    const displayHeight = mapRect.height;
                    
                    // Calculate scaling factors
                    const scaleX = displayWidth / svgWidth;
                    const scaleY = displayHeight / svgHeight;
                    
                    // Get marker position in SVG coordinates
                    const markerX = parseInt(markerEl.getAttribute('x')) + 5; // Center of marker
                    const markerY = parseInt(markerEl.getAttribute('y')) + 5;
                    
                    // Convert SVG coordinates to screen coordinates
                    const x = markerX * scaleX + 15; // Add offset
                    const y = markerY * scaleY + 15;
                    
                    // Ensure modal stays within map bounds
                    modal.style.left = `${x}px`;
                    modal.style.top = `${y}px`;
                    
                    // Update modal content
                    modal.innerHTML = `
                        <div class="op-modal-header">
                            <svg class="op-modal-icon op-marker-${operation.threat}" viewBox="0 0 10 10"><use href="#icon-op-marker"/></svg>
                            <h3 class="op-modal-title">${operation.id}</h3>
                        </div>
                        <div class="op-modal-entity">${operation.entity}</div>
                        <div class="op-modal-location">${operation.location}</div>
                        <div class="op-modal-status">${operation.status}</div>
                    `;
                    
                    // Show modal
                    modal.classList.add('visible');
                } else {
                    // Hide all modals
                    const modals = document.querySelectorAll('.op-modal');
                    modals.forEach(m => m.classList.remove('visible'));
                }
            };
            
            // Add event listeners for marker
            marker.addEventListener('mouseenter', (e) => toggleOperationDetails(op.id, true, e));
            marker.addEventListener('mouseleave', () => toggleOperationDetails(op.id, false));
            marker.addEventListener('focus', (e) => toggleOperationDetails(op.id, true, e));
            marker.addEventListener('blur', () => toggleOperationDetails(op.id, false));
            
            // Add event listeners for list item
            listItem.addEventListener('mouseenter', (e) => toggleOperationDetails(op.id, true, e));
            listItem.addEventListener('mouseleave', () => toggleOperationDetails(op.id, false));
        });

        // Removed simple Pan/Zoom logic as it's complex with background images

        console.log("Operations Map Initialized.");
    } // End initializeOperationsMap

     // Add highlight styles and modal popup styles if they don't exist
     if (!document.getElementById('map-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'map-highlight-styles';
        style.textContent = `
            .op-marker.highlight {
                filter: drop-shadow(0 0 5px white);
                transition: filter 0.15s ease-out;
            }
            .operations-list li.highlight-list {
                background-color: rgba(136, 170, 221, 0.1);
                border-left: 3px solid var(--accent-color);
                padding-left: 7px; /* Adjust padding for border */
            }
            
            /* Operation Modal Popup Styles */
            .op-modal {
                position: absolute;
                background-color: var(--background-tertiary);
                border: 1px solid var(--border-strong);
                border-radius: 5px;
                padding: 12px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                z-index: 100;
                min-width: 200px;
                max-width: 300px;
                pointer-events: none;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.2s ease, transform 0.2s ease;
            }
            
            .op-modal.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .op-modal-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                border-bottom: 1px solid var(--border-subtle);
                padding-bottom: 8px;
            }
            
            .op-modal-title {
                font-weight: 600;
                color: var(--text-highlight);
                margin: 0;
                font-size: 1.1em;
            }
            
            .op-modal-entity {
                color: var(--text-accent);
                margin-bottom: 5px;
            }
            
            .op-modal-location {
                color: var(--text-secondary);
                font-style: italic;
                margin-bottom: 5px;
                font-size: 0.9em;
            }
            
            .op-modal-status {
                display: inline-block;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 0.9em;
                background-color: rgba(0, 0, 0, 0.2);
                margin-top: 5px;
            }
            
            .op-modal-icon {
                width: 20px;
                height: 20px;
                margin-right: 8px;
            }
            
            .op-modal.high .op-modal-status {
                color: var(--text-threat-high);
                border-left: 3px solid var(--text-threat-high);
                padding-left: 5px;
            }
            
            .op-modal.medium .op-modal-status {
                color: var(--text-threat-medium);
                border-left: 3px solid var(--text-threat-medium);
                padding-left: 5px;
            }
            
            .op-modal.low .op-modal-status {
                color: var(--text-threat-low);
                border-left: 3px solid var(--text-threat-low);
                padding-left: 5px;
            }
            
            .op-modal.unknown .op-modal-status {
                color: var(--text-muted);
                border-left: 3px solid var(--text-muted);
                padding-left: 5px;
            }
            
            /* Remove cursor styles for pan/zoom */
            /* #operations-map-container { cursor: grab; } */
            /* #operations-map-container:active { cursor: grabbing; } */
        `;
        document.head.appendChild(style);
    }

    console.log("OSL Portal Script Setup Complete.");
});