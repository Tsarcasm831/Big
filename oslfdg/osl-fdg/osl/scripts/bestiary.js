// osl-fdg/osl/scripts/bestiary.js
import { initializeUser, getUserIdentifier, clearUserSession } from '/oslfdg/userDatabase.js';
// Import the bestiary data from the new file
import { allEntries } from '../data/bestiaryData.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("OSL Bestiary Script Initializing...");

    // Initialize user identity
    const userId = initializeUser();
    console.log("OSL Bestiary Script Loaded. User ID:", userId);

    // --- UI Elements ---
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');
    const logoutButton = document.getElementById('logout-button');
    const entityContainer = document.getElementById('entity-list-container');
    const anomalyContainer = document.getElementById('anomaly-list-container');
    const sortSelect = document.getElementById('sort-select');

    // --- Update Header Info ---
    if (userIdentifierDisplay && userId) {
        userIdentifierDisplay.textContent = `Resonant ID: #${userId}`;
    } else if (userIdentifierDisplay) {
        userIdentifierDisplay.textContent = `Resonant ID: #UNKNOWN`;
    }
    if (userRankDisplay) {
        // Check session storage for admin status from login
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        userRankDisplay.textContent = isAdmin ? `Status: Overseer` : 'Status: Agent'; // Reflect admin status
    }

    // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout initiated from Bestiary.");
            clearUserSession();
            // Corrected path relative to bestiary.js
            window.location.href = '../../osl-fdg_index.html'; 
        });
    }

    // --- Render Bestiary ---
    function renderBestiary() {
        if (!entityContainer || !anomalyContainer) {
            console.error("Bestiary list containers not found!");
            return;
        }

        // Separate entries
        // Entities: IDs starting with E-
        const entities = allEntries.filter(entry => typeof entry.id === 'string' && entry.id.startsWith('E-'));
        // Anomalies: IDs starting with U-
        const anomalies = allEntries.filter(entry => typeof entry.id === 'string' && entry.id.startsWith('U-'));

        // Sort by numerical part of ID
        function sortById(a, b) {
            const numA = parseInt((a.id.match(/\d+/) || [0])[0], 10);
            const numB = parseInt((b.id.match(/\d+/) || [0])[0], 10);
            return numA - numB;
        }

        function getThreatRank(threat) {
            const t = threat.toLowerCase().split('/')[0].trim();
            switch (t) {
                case 'extreme': return 0;
                case 'high': return 1;
                case 'medium': return 2;
                case 'low': return 3;
                default: return 4;
            }
        }
        function sortByThreat(a, b) {
            return getThreatRank(a.threat) - getThreatRank(b.threat);
        }
        const sortValue = sortSelect ? sortSelect.value : 'id';
        if (sortValue === 'threat') {
            entities.sort(sortByThreat);
            anomalies.sort(sortByThreat);
        } else {
            entities.sort(sortById);
            anomalies.sort(sortById);
        }

        // We'll dynamically check for image existence rather than using a hardcoded list

        // Helper to create image element with fallback
        function createImageOrPlaceholder(imagePath, altText, entityId) {
            const container = document.createElement('div');
            container.className = 'entity-image-container';
            
            // Make sure we have a valid entity ID
            let entityIdForImage = null;
            if (entityId) {
                // Extract just the ID part (e.g., "e-001" from "E-001")
                const idMatch = entityId.match(/([e|u])-\d+/i);
                if (idMatch) {
                    // Convert to lowercase for consistency
                    entityIdForImage = idMatch[0].toLowerCase();
                }
            }
            
            // Always try to load the image if we have a valid entity ID
            if (entityIdForImage) {
                const img = document.createElement('img');
                img.className = 'entity-image';
                img.alt = altText || 'Entity image';
                
                // Use the absolute path from server root
                const correctPath = `/oslfdg/osl-fdg/osl/data/assets/${entityIdForImage}.png`;
                console.log(`Attempting to load image from: ${correctPath}`);
                
                // Set up error handling before setting src
                img.onerror = function() {
                    console.log(`Failed to load image for ${entityIdForImage}`);
                    container.innerHTML = `<span class="image-placeholder-text">No Available Data</span>`;
                    container.classList.add('placeholder');
                };
                
                img.src = correctPath;
                container.appendChild(img);
            } else {
                // No valid entity ID
                container.innerHTML = `<span class="image-placeholder-text">No Available Data</span>`;
                container.classList.add('placeholder');
                console.log(`No valid entity ID for ${entityId || 'unknown entity'}`);
            }
            return container;
        }

        // Render entities
        entityContainer.innerHTML = '';
        if (entities.length === 0) {
            entityContainer.innerHTML = '<p class="info-message">No entities cataloged.</p>';
        } else {
            entities.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'bestiary-entry';
                // expose entry metadata for export
                entryDiv.dataset.id = entry.id;
                entryDiv.dataset.name = entry.name;
                entryDiv.dataset.description = entry.description;

                // Image (from root directory or assets folder)
                const imagePath = entry.image ? entry.image : null;
                entryDiv.appendChild(createImageOrPlaceholder(imagePath, entry.name, entry.id));

                // Name and threat level
                const nameElem = document.createElement('h3');
                nameElem.className = 'entity-name';
                nameElem.textContent = (entry.id ? entry.id + ': ' : '') + (entry.name || 'Unknown Entity');
                entryDiv.appendChild(nameElem);

                // Threat level
                const threatLevel = document.createElement('div');
                threatLevel.className = 'entity-threat-level';
                let displayThreat = entry.threat;
                let threatClass = entry.threat.toLowerCase();
                if (threatClass.includes('/')) {
                    // Use the first part for class, keep display text as is
                    threatClass = threatClass.split('/')[0].trim();
                }
                // Handle potential 'extreme' threat level for class
                if (threatClass === 'extreme') {
                    threatClass = 'extreme'; // Ensure 'extreme' class exists or is styled
                } else if (threatClass === 'high') {
                    threatClass = 'high';
                } else if (threatClass === 'medium') {
                    threatClass = 'medium';
                } else if (threatClass === 'low') {
                    threatClass = 'low';
                } else {
                    threatClass = 'unknown'; // Default for safety
                }
                threatLevel.className += ` ${threatClass}`;
                threatLevel.textContent = displayThreat.toUpperCase();
                entryDiv.appendChild(threatLevel);

                // Description
                const descriptionElem = document.createElement('p');
                descriptionElem.textContent = entry.description;
                entryDiv.appendChild(descriptionElem);

                // Data list
                const dataList = document.createElement('ul');
                dataList.className = 'data-list';
                const classificationItem = document.createElement('li');
                classificationItem.textContent = `Classification: ${entry.classification}`;
                dataList.appendChild(classificationItem);
                const lastSightingItem = document.createElement('li');
                lastSightingItem.textContent = `Last Sighting: ${entry.lastSighting}`;
                dataList.appendChild(lastSightingItem);
                const dispositionItem = document.createElement('li');
                dispositionItem.textContent = `Disposition: ${entry.disposition}`;
                dataList.appendChild(dispositionItem);
                entryDiv.appendChild(dataList);

                // Add to container
                entityContainer.appendChild(entryDiv);
                entryDiv.addEventListener('click', () => openModal(entry));
            });
        }

        // Render anomalies (similar logic)
        anomalyContainer.innerHTML = '';
        if (anomalies.length === 0) {
            anomalyContainer.innerHTML = '<p class="info-message">No anomalies cataloged.</p>';
        } else {
            anomalies.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'bestiary-entry';
                // expose entry metadata for export
                entryDiv.dataset.id = entry.id;
                entryDiv.dataset.name = entry.name;
                entryDiv.dataset.description = entry.description;

                const imagePath = entry.image ? entry.image : null;
                entryDiv.appendChild(createImageOrPlaceholder(imagePath, entry.name, entry.id));
                const nameElem = document.createElement('h3');
                nameElem.className = 'entity-name';
                nameElem.textContent = (entry.id ? entry.id + ': ' : '') + (entry.name || 'Unknown Anomaly');
                entryDiv.appendChild(nameElem);

                // Threat level
                const threatLevel = document.createElement('div');
                threatLevel.className = 'entity-threat-level';
                let displayThreat = entry.threat;
                let threatClass = entry.threat.toLowerCase();
                if (threatClass.includes('/')) {
                    // Use the first part for class, keep display text as is
                    threatClass = threatClass.split('/')[0].trim();
                }
                // Handle potential 'extreme' threat level for class
                if (threatClass === 'extreme') {
                    threatClass = 'extreme'; // Ensure 'extreme' class exists or is styled
                } else if (threatClass === 'high') {
                    threatClass = 'high';
                } else if (threatClass === 'medium') {
                    threatClass = 'medium';
                } else if (threatClass === 'low') {
                    threatClass = 'low';
                } else {
                    threatClass = 'unknown'; // Default for safety
                }
                threatLevel.className += ` ${threatClass}`;
                threatLevel.textContent = displayThreat.toUpperCase();
                entryDiv.appendChild(threatLevel);

                // Description
                const descriptionElem = document.createElement('p');
                descriptionElem.textContent = entry.description;
                entryDiv.appendChild(descriptionElem);

                // Data list
                const dataList = document.createElement('ul');
                dataList.className = 'data-list';
                const classificationItem = document.createElement('li');
                classificationItem.textContent = `Classification: ${entry.classification}`;
                dataList.appendChild(classificationItem);
                const lastSightingItem = document.createElement('li');
                lastSightingItem.textContent = `Last Sighting: ${entry.lastSighting}`;
                dataList.appendChild(lastSightingItem);
                const dispositionItem = document.createElement('li');
                dispositionItem.textContent = `Disposition: ${entry.disposition}`;
                dataList.appendChild(dispositionItem);
                entryDiv.appendChild(dataList);

                anomalyContainer.appendChild(entryDiv);
                entryDiv.addEventListener('click', () => openModal(entry));
            });
        }
    }

    // Initial Render
    renderBestiary();

    if (sortSelect) sortSelect.addEventListener('change', renderBestiary);

    // Add styles for threat levels if not already in osl_portal.css
    // This part is redundant if styles are correctly in osl_portal.css, but safe to keep
    const styleId = 'bestiary-threat-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .bestiary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
            }
            .bestiary-entry h2 {
                font-size: 1.2em;
                margin-bottom: 8px;
                margin-top: 0; /* Adjust spacing now that image is first */
                color: var(--text-highlight);
            }
            .entity-threat-level {
                font-size: 0.9em;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 3px;
                display: inline-block;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: 1px solid;
            }
            .entity-threat-level.extreme { background-color: rgba(255, 50, 50, 0.2); color: #ff3232; border-color: #ff3232; }
            .entity-threat-level.high { background-color: rgba(255, 123, 123, 0.1); color: var(--text-threat-high); border-color: var(--text-threat-high); }
            .entity-threat-level.medium { background-color: rgba(255, 213, 128, 0.1); color: var(--text-threat-medium); border-color: var(--text-threat-medium); }
            .entity-threat-level.low { background-color: rgba(174, 198, 207, 0.1); color: var(--text-threat-low); border-color: var(--text-threat-low); }
            .entity-threat-level.unknown { background-color: rgba(150, 150, 150, 0.1); color: var(--text-muted); border-color: var(--text-muted); }
            .bestiary-entry .data-list { margin-top: 15px; padding-left: 0; list-style: none; } /* Ensure no default list styles */
            .bestiary-entry .data-list li { margin-bottom: 5px; }
            .bestiary-entry .widget-link { margin-top: 15px; display: block; }
            .info-message, .loading-placeholder {
                grid-column: 1 / -1;
                text-align: center;
                color: var(--text-muted);
                font-style: italic;
                padding: 20px;
            }
            .entity-image-container {
                width: 100%;
                aspect-ratio: 16 / 10;
                background-color: rgba(0,0,0,0.2);
                border: 1px solid var(--border-subtle);
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 15px;
            }
            .entity-image {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .entity-image-container.placeholder {
                background-color: rgba(0,0,0,0.3);
            }
            .image-placeholder-text {
                font-size: 0.9em;
                color: var(--text-muted);
                font-style: italic;
            }
            hr.section-separator {
                border: none;
                height: 1px;
                background: linear-gradient(to right, transparent, var(--border-color), transparent);
                margin: 40px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Modal functionality
    const modal = document.getElementById('entity-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
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
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

    // Auto-open modal if navigated with entity query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const entityParam = urlParams.get('entity');
    if (entityParam) {
        const entry = allEntries.find(e => e.id === entityParam);
        if (entry) openModal(entry);
    }

    console.log("OSL Bestiary Script Setup Complete.");

    // Export full entries for missing images
    const exportButton = document.getElementById('export-missing-button');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const missing = allEntries.filter(entry => {
                const entryDiv = document.querySelector(`.bestiary-entry[data-id="${entry.id}"]`);
                if (!entryDiv) return false;
                const imgContainer = entryDiv.querySelector('.entity-image-container');
                return !imgContainer.querySelector('img') || imgContainer.classList.contains('placeholder');
            });
            const blob = new Blob([JSON.stringify(missing, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'missing_images.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
});