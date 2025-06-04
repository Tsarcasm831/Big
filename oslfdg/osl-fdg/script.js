// osl-fdg/script.js - Handles logic for the OSL::FDG Access Portal
import { initializeUser, getUserIdentifier } from '../userDatabase.js';
import { LocalDatabase } from '../localDatabase.js';

// Initialize the room (global scope)
const room = new LocalDatabase();
const AGENT_COLLECTION_TYPE = 'agents'; // Changed to use our local agents store

document.addEventListener('DOMContentLoaded', async () => {
    console.log("OSL::FDG Portal Script Initializing...");

    // Initialize user identity
    const userId = initializeUser();
    console.log("OSL::FDG Portal Script Loaded. User ID:", userId);

    // --- UI Elements ---
    const userIdentifierDisplay = document.getElementById('user-identifier');
    const userRankDisplay = document.getElementById('user-rank');
    const usernameInput = document.getElementById('auth-username');
    const passwordInput = document.getElementById('auth-password');
    const submitButton = document.getElementById('auth-submit-button');
    const authFeedback = document.getElementById('auth-feedback');
    // const authForm = document.getElementById('auth-form'); // Not currently needed as we handle click

    // --- Update Header Info ---
    if (userIdentifierDisplay && userId) {
        userIdentifierDisplay.textContent = `Resonant ID: #${userId}`;
    } else if (userIdentifierDisplay) {
        userIdentifierDisplay.textContent = `Resonant ID: #UNKNOWN`;
    }
    if (userRankDisplay) {
        userRankDisplay.textContent = `Status: Candidate`;
    }

    // --- Ensure Test Agents Exist ---
    async function ensureTestAgent() {
        try {
            console.log(`Checking/Ensuring test agents in collection: ${AGENT_COLLECTION_TYPE}`);

            // Get the collection and then filter it
            const agentCollection = await room.collection(AGENT_COLLECTION_TYPE);

            // Check and create the OSL test agent
            const existingOslAgents = await agentCollection.filter({ agent_identifier: 'agent-test-osl' }).getList();
            if (existingOslAgents.length === 0) {
                console.log(`Creating OSL test agent: agent-test-osl`);
                await agentCollection.create({
                    agent_identifier: "agent-test-osl",
                    authentication_code: "test", // Store hashed passwords in production
                    organization: "OSL",
                    admin: true, // Assuming test agents are admins for now
                    id: Date.now() + 1 // Simple unique ID for IndexedDB
                });
                console.log("OSL test agent created.");
            } else {
                console.log(`OSL test agent already exists (Count: ${existingOslAgents.length}).`);
            }

            // Check and create the FDG test agent
            const existingFdgAgents = await agentCollection.filter({ agent_identifier: 'agent-test-fdg' }).getList();
            if (existingFdgAgents.length === 0) {
                console.log(`Creating FDG test agent: agent-test-fdg`);
                await agentCollection.create({
                    agent_identifier: "agent-test-fdg",
                    authentication_code: "test", // Store hashed passwords in production
                    organization: "FDG",
                    admin: true, // Assuming test agents are admins for now
                    id: Date.now() + 2 // Simple unique ID for IndexedDB
                });
                console.log("FDG test agent created.");
            } else {
                console.log(`FDG test agent already exists (Count: ${existingFdgAgents.length}).`);
            }

            // Check and create the ALL test agent
            const existingAllAgents = await agentCollection.filter({ agent_identifier: 'agent-test-all' }).getList();
            if (existingAllAgents.length === 0) {
                console.log(`Creating ALL test agent: agent-test-all`);
                await agentCollection.create({
                    agent_identifier: "agent-test-all",
                    authentication_code: "test", // Store hashed passwords in production
                    organization: "ALL",
                    admin: true, // Assuming test agents are admins for now
                    id: Date.now() + 3 // Simple unique ID for IndexedDB
                });
                console.log("ALL test agent created.");
            } else {
                console.log(`ALL test agent already exists (Count: ${existingAllAgents.length}).`);
            }

            // Check and create the PLAYER test agent
            const existingPlayerAgents = await agentCollection.filter({ agent_identifier: 'player' }).getList();
            if (existingPlayerAgents.length === 0) {
                console.log(`Creating PLAYER test agent: player`);
                await agentCollection.create({
                    agent_identifier: "player",
                    authentication_code: "test", // Store hashed passwords in production
                    organization: "PLAYER",
                    admin: false, // Not an admin
                    id: Date.now() + 4 // Simple unique ID for IndexedDB
                });
                console.log("PLAYER test agent created.");
            } else {
                console.log(`PLAYER test agent already exists (Count: ${existingPlayerAgents.length}).`);
            }

        } catch (error) {
            console.error("Error ensuring test agents exist:", error);
            displayFeedback("Database error during setup. Please try again later.", "error");
        }
    }

    // Run setup but don't block the UI from loading
    ensureTestAgent().catch(err => console.error("Background agent setup failed:", err));

    // --- Authentication Logic using Database ---
    async function handleAuthenticationAttempt() {
        console.log("Authentication attempt started.");

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (authFeedback) {
            authFeedback.textContent = '';
            authFeedback.className = 'auth-feedback';
        }
        if (submitButton) submitButton.disabled = true;

        if (!username || !password) {
            displayFeedback("Error: Identifier and Authentication Code required.", "error");
            if (submitButton) submitButton.disabled = false;
            console.log("Auth aborted: Missing input.");
            return;
        }

        displayFeedback("Authenticating...", "info");
        console.log(`Attempting auth for: ${username}`);

        try {
            // Wait for DB init if it hasn't finished
            await room.initPromise;

            // Query the database for the agent identifier
            const agentCollection = await room.collection(AGENT_COLLECTION_TYPE);
            const agents = await agentCollection.filter({ agent_identifier: username }).getList();

            if (agents.length > 0) {
                const agent = agents[0];
                // IMPORTANT: In a real application, never store or compare plain text passwords.
                // Use a secure hashing library (like bcrypt) on the server-side.
                // This client-side comparison is only for this simulation.
                if (agent.authentication_code === password) {
                    // Authentication successful
                    displayFeedback("Authentication successful.", "success");
                    console.log(`Agent ${username} authenticated successfully. Org: ${agent.organization}, Admin: ${agent.admin}`);

                    // Store admin status in session storage for use on the target page
                    if (agent.admin) {
                        sessionStorage.setItem('isAdmin', 'true');
                    } else {
                        sessionStorage.removeItem('isAdmin'); // Clear if not admin
                    }

                    // Redirect based on organization
                    setTimeout(() => {
                        switch (agent.organization?.toUpperCase()) {
                            case "OSL":
                                window.location.href = 'osl.html';
                                break;
                            case "FDG":
                                window.location.href = 'fdg.html';
                                break;
                            case "ALL":
                                window.location.href = 'all.html';
                                break;
                            case "PLAYER":
                                window.location.href = `${window.location.origin}/osl-fdg/worlds/FarHaven/index.html`;
                                break;
                            default:
                                console.error("Unknown or missing organization:", agent.organization);
                                displayFeedback("Authentication Error: Invalid agent configuration.", "error");
                                if (submitButton) submitButton.disabled = false;
                                break;
                        }
                    }, 500); // Delay redirect slightly to show success message
                } else {
                    // Incorrect password
                    displayFeedback("Invalid authentication code.", "error");
                    console.log(`Auth failed for ${username}: Incorrect password.`);
                    if (submitButton) submitButton.disabled = false;
                }
            } else {
                // Agent identifier not found
                displayFeedback("Agent identifier not found.", "error");
                console.log(`Auth failed: Agent identifier "${username}" not found.`);
                if (submitButton) submitButton.disabled = false;
            }

        } catch (error) {
            console.error("Error during authentication query:", error);
            displayFeedback("Authentication Error: Could not verify credentials.", "error");
            if (submitButton) submitButton.disabled = false;
        }
    }

    function displayFeedback(message, type = 'info') {
        if (authFeedback) {
            authFeedback.textContent = message;
            authFeedback.className = 'auth-feedback'; // Reset classes first
            if (type === 'error' || type === 'success') { // Only add specific classes
                authFeedback.classList.add(type);
            }
            console.log(`Feedback displayed (${type}): ${message}`); // Log feedback
        } else {
            console.warn("authFeedback element not found, cannot display message:", message);
        }
    }

    // --- Event Listeners ---
    if (submitButton) {
        submitButton.addEventListener('click', handleAuthenticationAttempt);
        console.log("Click event listener attached to button.");
    } else {
        console.error("Authentication button not found!");
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log("Enter pressed in password field."); // Log enter press
                handleAuthenticationAttempt();
            }
        });
        console.log("Enter key listener attached to password input.");
    } else {
         console.error("Password input not found!");
    }

     if (usernameInput) {
        usernameInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log("Enter pressed in username field."); // Log enter press
                 // Move focus to password or submit if password already filled
                 if(passwordInput && !passwordInput.value) {
                    passwordInput.focus();
                 } else {
                     handleAuthenticationAttempt();
                 }
            }
        });
         console.log("Enter key listener attached to username input.");
    } else {
        console.error("Username input not found!");
    }

    // --- Initial Focus ---
    if (usernameInput) {
        usernameInput.focus();
    }

    console.log("OSL::FDG Portal Script Setup Complete.");
});