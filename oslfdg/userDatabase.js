// userDatabase.js - Manages simulated user identification using localStorage

// Load Zhe'nariq glyphs for ID symbols via synchronous XHR
const ALLOWED_SYMBOLS = '!@#$%^*()-_=+[]{}|;:,.<>?~';
let ALLOWED_GLYPHS = [];
try {
    const xhr = new XMLHttpRequest();
    const jsonPath = '/oslfdg/osl-fdg/osl/data/json/Zhe\'nariq.json';
    xhr.open('GET', jsonPath, false);
    xhr.send(null);
    if (xhr.status !== 200) throw new Error(`HTTP ${xhr.status}`);
    const resp = xhr.responseText;
    if (!resp) throw new Error('Empty JSON');
    const jsonData = JSON.parse(resp);
    ALLOWED_GLYPHS = jsonData.glyphs.map(g => g.symbol);
} catch (e) {
    console.error("Failed to load Zhe'nariq glyphs, falling back to symbols", e);
    ALLOWED_GLYPHS = ALLOWED_SYMBOLS.split('');
}

const USER_ID_KEY = 'resonantEchoUserId';
const ALLOWED_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
const ALLOWED_DIGITS = '23456789';

/**
 * Generates a random character from a given string.
 * @param {string} characterSet - The string of characters to choose from.
 * @returns {string} A random character from the set.
 */
function getRandomChar(characterSet) {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet[randomIndex];
}

/**
 * Generate a deterministic pseudo-location in Colorado from a string (e.g., cookie value)
 * Colorado bounds: lat 37–41, lon -109–-102
 * @param {string} seedStr
 * @returns {{latitude: number, longitude: number}}
 */
function pseudoColoradoLocation(seedStr) {
    // Simple hash from string
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0;
    }
    // Normalize to 0-1
    const norm = (n) => (Math.abs(n) % 10000) / 10000;
    const lat = 37 + norm(hash) * (41 - 37);
    const lon = -109 + norm(hash * 13) * (102 - 109);
    return { latitude: lat, longitude: lon };
}

/**
 * Get cookie value by name
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

/**
 * Generates a fallback unique 9-character user identifier (legacy method).
 * Format: 9 Zhe'nariq glyphs.
 * @returns {string} The generated user ID.
 */
function generateRandomUserId() {
    // Generate a 9-character ID entirely from Zhe'nariq glyphs
    const idChars = [];
    for (let i = 0; i < 9; i++) {
        idChars.push(getRandomChar(ALLOWED_GLYPHS));
    }
    return idChars.join('');
}

/**
 * Generates a unique user ID based on current time and pseudo-location.
 * @param {string} isoTime - ISO string of current time (e.g., 2025-04-14T15:30:44-06:00)
 * @param {object} location - {latitude, longitude}
 * @returns {string} Encoded user ID
 */
function generateTimeGeoId(isoTime, location) {
    try {
        const timePart = isoTime ? isoTime.split('T')[1].split('-')[0].replace(/:/g, '') : '';
        const lat = location && location.latitude !== undefined ? Math.round(location.latitude * 1000) : 0;
        const lon = location && location.longitude !== undefined ? Math.round(location.longitude * 1000) : 0;
        const raw = `${timePart}_${lat}_${lon}`;
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash) + raw.charCodeAt(i);
            hash |= 0;
        }
        // Build base ID and inject glyphs into last two positions
        const chars = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).split('');
        if (ALLOWED_GLYPHS.length >= 2) {
            chars[4] = getRandomChar(ALLOWED_GLYPHS);
            chars[5] = getRandomChar(ALLOWED_GLYPHS);
        }
        return chars.join('');
    } catch (e) {
        return generateRandomUserId();
    }
}

/**
 * Initializes the user session by checking for an existing ID in localStorage
 * or generating and storing a new one based on time and pseudo-location.
 * Uses localStorage to provide persistence within the same browser.
 * @param {string} isoTime - ISO string of current time (passed in from server or app)
 * @returns {string} The user's ID for this session/browser.
 */
export function initializeUser(isoTime) {
    let userId = null;
    try {
        userId = localStorage.getItem(USER_ID_KEY);
        if (!userId) {
            // Use passphraseEntered cookie as seed for pseudo-location
            let pseudoLoc = null;
            const cookieVal = getCookie('passphraseEntered');
            if (cookieVal) {
                pseudoLoc = pseudoColoradoLocation(cookieVal);
            } else {
                // Fallback: generate a random pseudo-location, store in sessionStorage for repeatability
                let stored = sessionStorage.getItem('pseudoColoLoc');
                if (stored) {
                    pseudoLoc = JSON.parse(stored);
                } else {
                    // Random lat/lon in Colorado bounds
                    const lat = 37 + Math.random() * (41 - 37);
                    const lon = -109 + Math.random() * (102 - 109);
                    pseudoLoc = { latitude: lat, longitude: lon };
                    sessionStorage.setItem('pseudoColoLoc', JSON.stringify(pseudoLoc));
                }
            }
            // Generate purely glyph-based ID
            userId = generateRandomUserId();
            localStorage.setItem(USER_ID_KEY, userId);
            console.log(`New User ID generated and stored: ${userId}`);
        } else {
            console.log(`Existing User ID found: ${userId}`);
        }
    } catch (e) {
        console.error("localStorage access error. Using session-only ID.", e);
        if (!userId) {
            userId = generateRandomUserId();
            console.log(`Generated session-only User ID: ${userId}`);
        }
    }
    return userId;
}

export function getUserIdentifier() {
    try {
        return localStorage.getItem(USER_ID_KEY);
    } catch (e) {
        console.error("Failed to retrieve user ID from localStorage.", e);
        return null;
    }
}

export function clearUserSession() {
    try {
        localStorage.removeItem(USER_ID_KEY);
        console.log("User session data cleared (localStorage).");
    } catch (e) {
        console.error("Failed to remove user ID from localStorage.", e);
    }
    document.cookie = 'passphraseEntered=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    console.log("Passphrase cookie cleared.");
    try {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('pseudoColoLoc');
        console.log("Admin session state and pseudoColoLoc cleared.");
    } catch (e) {
         console.error("Failed to remove admin state from sessionStorage.", e);
    }
}