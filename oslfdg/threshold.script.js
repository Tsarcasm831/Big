import { initializeUser, getUserIdentifier, clearUserSession } from './userDatabase.js'; // Import user DB functions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Threshold script loaded.");

    // --- User Initialization ---
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');

    // Helper: Set ID display
    function setUserIdDisplay(id) {
        if (userIdentifierDisplay && id) {
            userIdentifierDisplay.textContent = `Resonant ID: #${id}`;
        }
        if (userRankDisplay) {
            userRankDisplay.textContent = `Status: Neophyte`;
        }
    }

    // Use the server-provided time (from metadata or window.OSL_CURRENT_TIME)
    const OSL_CURRENT_TIME = window.OSL_CURRENT_TIME || '2025-04-14T15:30:44-06:00'; // fallback if not injected

    // No geolocation: use initializeUser with time only
    const userId = initializeUser(OSL_CURRENT_TIME);
    setUserIdDisplay(userId);

    // --- Navigation Links ---
    const tenetsLinkAccess = document.getElementById('link-tenets-access');
    const whispersLinkAccess = document.getElementById('link-whispers-access');
    const logoutButton = document.getElementById('logout-button');

    // --- Sequence Detection ---
    let keySequence = "";
    const targetSequence = "svt"; // Sequence to trigger redirect
    const targetUrl = 'osl-fdg/osl-fdg_index.html'; // Target redirect URL

    document.addEventListener('keydown', (event) => {
        // Ignore input if modifier keys are pressed or if focus is on an input/textarea
        if (event.metaKey || event.ctrlKey || event.altKey ||
            event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Append the pressed key (if it's a single character)
        if (event.key.length === 1) {
            keySequence += event.key.toLowerCase(); // Convert to lowercase for case-insensitive match
            // Keep only the last characters matching the target sequence length
            if (keySequence.length > targetSequence.length) {
                keySequence = keySequence.slice(-targetSequence.length);
            }

            // Check if the sequence matches the target
            if (keySequence === targetSequence) {
                console.log(`Sequence "${targetSequence}" detected. Redirecting to ${targetUrl}...`);
                window.location.href = targetUrl;
                keySequence = ""; // Reset sequence after triggering
            }
        } else {
             // Reset sequence if non-character key (like Shift, Enter, etc.) is pressed
             // keySequence = ""; // Optional: Reset on any non-character key, or only on specific ones if needed
        }
    });

    // --- Event Listeners for Links ---
    if (tenetsLinkAccess) {
        tenetsLinkAccess.addEventListener('click', (event) => {
            console.log("Clicked 'Learn More' for First Tenets. Navigating via href.");
        });
    } else {
        console.warn("Access point link for tenets not found.");
    }

    if (whispersLinkAccess) {
        whispersLinkAccess.addEventListener('click', (event) => {
            console.log("Clicked 'Enter' for Chamber of Whispers. Navigating via href.");
        });
    } else {
        console.warn("Access point link for whispers not found.");
    }

    // --- Logout Button Listener ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout button clicked.");
            clearUserSession();
            window.location.href = 'index.html';
        });
    } else {
        console.warn("Logout button not found.");
    }
});