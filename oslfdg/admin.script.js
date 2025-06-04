// admin.script.js - Handles logic for the admin page

import { initializeUser, getUserIdentifier, clearUserSession } from './userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const userIdentifier = initializeUser(); // Ensure user is initialized
    const actualAdminCode = "17666"; // The code required for access

    // UI Elements
    const accessGate = document.getElementById('admin-access-gate');
    const adminContent = document.getElementById('admin-content');
    const codeInput = document.getElementById('admin-code-input');
    const submitButton = document.getElementById('admin-submit-button');
    const errorMessage = document.getElementById('admin-error-message');
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');
    const adminLogoutButton = document.getElementById('admin-logout-button');

    // --- Initial Setup ---
    function updateUserDisplay() {
        const currentId = getUserIdentifier();
        if (userIdentifierDisplay && currentId) {
            userIdentifierDisplay.textContent = `Resonant ID: #${currentId}`;
        }
        // Rank display might be updated based on admin status later if needed
        if (userRankDisplay) {
            userRankDisplay.textContent = `Status: Neophyte`; // Default for now
        }
    }

    function checkSessionAccess() {
        // Use sessionStorage to track if admin was authenticated *in this session*
        if (sessionStorage.getItem('adminAuthenticated') === 'true') {
            showAdminContent();
        } else {
            showAccessGate();
        }
    }

    function showAccessGate() {
        if (accessGate) accessGate.style.display = 'block';
        if (adminContent) adminContent.style.display = 'none';
        if (adminLogoutButton) adminLogoutButton.style.display = 'none';
        if (codeInput) codeInput.focus();
    }

    function showAdminContent() {
        if (accessGate) accessGate.style.display = 'none';
        if (adminContent) adminContent.style.display = 'block';
        if (adminLogoutButton) adminLogoutButton.style.display = 'inline-flex'; // Show logout
        // Update user rank display if desired
        if (userRankDisplay) {
             userRankDisplay.textContent = `Status: Overseer`;
        }
    }

    function handleAuthentication() {
        if (!codeInput || !errorMessage) return;
        const enteredCode = codeInput.value;

        if (enteredCode === actualAdminCode) {
            errorMessage.style.display = 'none';
            sessionStorage.setItem('adminAuthenticated', 'true'); // Mark as authenticated for this session
            showAdminContent();
            console.log("Admin authentication successful.");
        } else {
            errorMessage.textContent = 'Invalid Code.';
            errorMessage.style.display = 'block';
            codeInput.value = '';
            codeInput.focus();
            console.warn("Admin authentication failed.");
            // Optional: Add shake animation
             accessGate.classList.add('shake');
             setTimeout(() => accessGate.classList.remove('shake'), 300);
        }
    }

     function handleLogout() {
        console.log("Admin logging out.");
        sessionStorage.removeItem('adminAuthenticated');
        // Optional: Clear user session entirely if admin logout should reset ID?
        // clearUserSession(); // Uncomment if full reset is desired
        window.location.href = 'threshold.html'; // Redirect to threshold after logout
    }


    // --- Event Listeners ---
    if (submitButton) {
        submitButton.addEventListener('click', handleAuthentication);
    }

    if (codeInput) {
        codeInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent potential form submission
                handleAuthentication();
            }
        });
    }

     if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', handleLogout);
    }

    // --- Page Initialization ---
    updateUserDisplay();
    checkSessionAccess();

    // Add shake animation style if not present elsewhere (copied from tenets.script)
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            .shake {
                animation: horizontal-shake 0.3s ease-in-out;
            }
            @keyframes horizontal-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-2px); }
            }
        `;
        document.head.appendChild(style);
    }

    console.log("Admin page script loaded.");
});