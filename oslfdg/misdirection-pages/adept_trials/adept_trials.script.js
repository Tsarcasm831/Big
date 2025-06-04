// adept_trials.script.js - Handles logic for the Adept Trials page, specifically the access sequence.

import { initializeUser, getUserIdentifier } from '../../userDatabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user identity (standard practice)
    const userId = initializeUser();
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');
    if (userIdentifierDisplay && userId) {
        userIdentifierDisplay.textContent = `Resonant ID: #${userId}`;
    }
    if (userRankDisplay) {
        userRankDisplay.textContent = `Status: Neophyte`; // Default rank
    }
    console.log("Adept Trials script loaded. User ID:", userId);

    // --- Variables for Access Sequence ---
    let keySequence = "";
    const targetSequence = "asdf;lkj";
    const maxSequenceLength = targetSequence.length;

    // --- UI Elements ---
    const accessDeniedContent = document.getElementById('access-denied-content');
    const accessGrantedContent = document.getElementById('access-granted-content');

    // --- Function to Grant Access ---
    function grantAccess() {
        if (accessDeniedContent) accessDeniedContent.style.display = 'none';
        if (accessGrantedContent) accessGrantedContent.style.display = 'block';
        console.log("Adept Trials access granted!");

        // Optional: Add visual feedback like a quick flash or fade-in
        if (accessGrantedContent) {
            accessGrantedContent.style.opacity = '0';
            accessGrantedContent.style.transition = 'opacity 0.5s ease-in';
            setTimeout(() => { accessGrantedContent.style.opacity = '1'; }, 10);
        }
    }

    // --- Event Listener for Keyboard Sequence ---
    document.addEventListener('keydown', (event) => {
        // Ignore inputs in potential future form fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        // Ignore if modifier keys are pressed
        if (event.metaKey || event.ctrlKey || event.altKey) {
            return;
        }
        // Ignore if access is already granted
        if (accessGrantedContent && accessGrantedContent.style.display === 'block') {
            return;
        }

        // Append the pressed key (only if it's a single character or specific symbols like ';')
        if (event.key.length === 1) {
            keySequence += event.key;
            if (keySequence.length > maxSequenceLength) {
                keySequence = keySequence.slice(-maxSequenceLength);
            }

            // Check if the sequence matches
            if (keySequence === targetSequence) {
                grantAccess();
                keySequence = ""; // Reset sequence after successful entry
            }
        } else if (event.key === 'Backspace') {
            // Handle backspace if needed, though usually simpler to just let user restart typing
            keySequence = keySequence.slice(0, -1);
        }
    });

    console.log("Adept Trials sequence listener active.");
});