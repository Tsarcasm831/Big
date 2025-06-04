import { initializeUser, getUserIdentifier } from './userDatabase.js';

const targetPhrase = "Tell me, what survives?";
let currentInput = "";
const symbolContainer = document.getElementById('symbol-container');
const typedLettersContainer = document.getElementById('typed-letters-container');
const container = document.getElementById('container');
const successMessage = document.getElementById('success-message');
const resonantLogo = document.getElementById('resonant-logo');
const idleMessageContainer = document.getElementById('idle-message-container');
const idleMessageText = document.getElementById('idle-message-text');
const intruderMessageContainer = document.getElementById('intruder-message');

// --- Idle Timer Variables ---
let idleTimer;
let idleTimeout = 17000;
let idleMessageIndex = 0;
let isIdleActive = false;
const idleMessages = [
    "are you there?",
    "you know why you're here...",
    "Tell me, what survives?"
];
let typingTimeoutId = null;
let fadeOutTimeoutId = null;
let isTyping = false;
const TYPING_SPEED_MS = 100;

// --- Intruder Detection Variables ---
let incorrectAttempts = 0;
const MAX_INCORRECT_ATTEMPTS = 3;
let isIntruderDetected = false;
const adminOverrideCode = "17666"; // Admin override code
let adminSequence = ""; // Stores the sequence typed during intruder state

// --- Check for existing user session ---
function checkExistingSession() {
    const userId = getUserIdentifier(); 
    if (userId) {
        const passphraseCookie = document.cookie.split('; ').find(row => row.startsWith('passphraseEntered='));
        if (passphraseCookie && passphraseCookie.split('=')[1] === 'true') {
            console.log("User ID and Passphrase cookie found. Redirecting to threshold...");
            container.style.opacity = '0';
            window.location.href = 'threshold.html';
            return true; 
        } else {
            console.log("User ID found, but passphrase cookie not set. Staying on index.");
        }
    } else {
        console.log("No User ID found in localStorage.");
    }
    return false; 
}

// --- Audio Variables ---
let audioCtx = null;
let alarmIntervalId = null;
const ALARM_INTERVAL_MS = 1200;
const TONE_DURATION_S = 0.15;
const TONE_GAP_S = 0.05;

// Add audio files for passphrase feedback
const successAudio = new Audio('assets/access-granted.mp3');
const errorAudio = new Audio('assets/error.mp3');

// --- Audio Functions ---
function initializeAudioContext() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext initialized.");
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.", e);
        }
    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log("AudioContext resumed.");
        }).catch(err => {
            console.error("Failed to resume AudioContext:", err);
        });
    }
}

function playTone(frequency, duration, startTime) {
    if (!audioCtx || audioCtx.state !== 'running') return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playAlarmSequence() {
    if (!audioCtx || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const tone1Start = now;
    const tone2Start = tone1Start + TONE_DURATION_S + TONE_GAP_S;
    const tone3Start = tone2Start + TONE_DURATION_S + TONE_GAP_S;

    playTone(1200, TONE_DURATION_S, tone1Start);
    playTone(900, TONE_DURATION_S, tone2Start);
    playTone(1200, TONE_DURATION_S, tone3Start);
}

function startAlarmSound() {
    if (!audioCtx || audioCtx.state !== 'running') {
        initializeAudioContext();
        if (!audioCtx || audioCtx.state !== 'running') {
            console.warn("Cannot start alarm sound: AudioContext not running.");
            return;
        }
    }

    if (alarmIntervalId) return;

    console.log("Starting alarm sound...");
    playAlarmSequence();
    alarmIntervalId = setInterval(playAlarmSequence, ALARM_INTERVAL_MS);
}

function stopAlarmSound() {
    if (alarmIntervalId) {
        console.log("Stopping alarm sound.");
        clearInterval(alarmIntervalId);
        alarmIntervalId = null;
    }
}

// --- Idle Timer Functions ---
function startIdleTimer() {
    if (isIdleActive || isIntruderDetected) return;
    console.log("Starting idle timer...");
    isIdleActive = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showNextIdleMessage, idleTimeout);
}

function resetIdleTimer() {
    if (!isIdleActive || isIntruderDetected) return;
    console.log("Resetting idle timer due to activity.");
    clearTimeout(idleTimer);
    hideIdleMessage();
    idleTimer = setTimeout(showNextIdleMessage, idleTimeout);
}

function stopIdleTimer() {
    console.log("Stopping idle timer.");
    clearTimeout(idleTimer);
    isIdleActive = false;
    hideIdleMessage();
    idleMessageIndex = 0;
}

// --- Typing Animation Function ---
function typeMessage(message, element, index = 0) {
    if (isIntruderDetected) return;
    isTyping = true;
    if (index === 0) {
        element.textContent = '';
        element.classList.remove('visible');
    }

    if (index < message.length && isTyping && !isIntruderDetected) {
        element.textContent += message[index];
        typingTimeoutId = setTimeout(() => typeMessage(message, element, index + 1), TYPING_SPEED_MS);
    } else if (index >= message.length && !isIntruderDetected) {
        isTyping = false;
        typingTimeoutId = null;
        element.classList.add('visible');
        startFadeOutTimer();
    } else {
        isTyping = false;
        typingTimeoutId = null;
        element.textContent = '';
        idleMessageContainer.style.display = 'none';
    }
}

// --- Start Timer for Message Fade Out ---
function startFadeOutTimer() {
    clearTimeout(fadeOutTimeoutId);
    fadeOutTimeoutId = setTimeout(() => {
        hideIdleMessage(true);

        if (isIdleActive && !isIntruderDetected) {
            idleMessageIndex++;
            if (idleMessageIndex >= idleMessages.length) {
                idleMessageIndex = 0;
            }
            clearTimeout(idleTimer);
            idleTimer = setTimeout(showNextIdleMessage, idleTimeout);
        }

    }, 4000);
}

function showNextIdleMessage() {
    if (!isIdleActive || isIntruderDetected) return;

    console.log(`Showing idle message ${idleMessageIndex + 1}`);
    idleMessageContainer.style.display = 'flex';
    typeMessage(idleMessages[idleMessageIndex], idleMessageText);

}

// Modified hideIdleMessage to handle stopping typing and fade out timers
function hideIdleMessage(calledFromFadeOut = false) {
    if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        typingTimeoutId = null;
    }
    if (fadeOutTimeoutId && !calledFromFadeOut) {
        clearTimeout(fadeOutTimeoutId);
        fadeOutTimeoutId = null;
    }
    isTyping = false;

    idleMessageText.classList.remove('visible');

    idleMessageText.textContent = '';

    setTimeout(() => {
        if (!idleMessageText.classList.contains('visible') && !isTyping && !isIntruderDetected) {
            idleMessageContainer.style.display = 'none';
        }
    }, 1000);
}

// --- Main Logic ---
const userId = initializeUser();
console.log(`User Initialized with ID: ${userId}`);

if (checkExistingSession()) {
} else {
    function handleKeydown(event) {
        if (!audioCtx || audioCtx.state === 'suspended') {
            initializeAudioContext();
        }

        const key = event.key;

        if (isIntruderDetected) {
            if (key.length === 1 && /\d/.test(key)) {
                adminSequence += key;
                if (adminSequence.length > adminOverrideCode.length) {
                    adminSequence = adminSequence.slice(-adminOverrideCode.length);
                }
                console.log("Admin sequence:", adminSequence);
                if (adminSequence === adminOverrideCode) {
                    handleAdminOverride();
                }
            } else if (key === 'Backspace') {
                adminSequence = adminSequence.slice(0, -1);
                console.log("Admin sequence:", adminSequence);
            } else if (key !== 'Enter' && key.length === 1) {
                adminSequence = "";
            }
            return;
        }

        resetIdleTimer();

        if (symbolContainer.classList.contains('correct') || symbolContainer.classList.contains('incorrect') || isTyping) {
            if (!symbolContainer.classList.contains('correct') && !symbolContainer.classList.contains('incorrect')) {
                stopIdleTimer();
            }
            return;
        }

        if (key === 'Enter') {
            event.preventDefault();
            validateInput();
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
        } else if (event.metaKey || event.ctrlKey || event.altKey) {
            return;
        } else if (key.length === 1) {
            currentInput += key;
            displayFloatingLetter(key);
        }
    }

    function displayFloatingLetter(letter) {
        if (isIntruderDetected) return;
        resetIdleTimer();

        if (symbolContainer.classList.contains('correct') || symbolContainer.classList.contains('incorrect')) {
            return;
        }
        const letterSpan = document.createElement('span');
        letterSpan.classList.add('floating-letter');
        letterSpan.textContent = letter;

        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 20;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        letterSpan.style.left = `${x}%`;
        letterSpan.style.top = `${y}%`;
        letterSpan.style.transformOrigin = 'center center';
        letterSpan.style.transform = 'translate(-50%, -50%)';

        typedLettersContainer.appendChild(letterSpan);

        letterSpan.addEventListener('animationend', () => {
            if (!letterSpan.classList.contains('incorrect')) {
                letterSpan.remove();
            }
        });
    }

    function validateInput() {
        stopIdleTimer();
        stopAlarmSound();
        if (isIntruderDetected) return;
        const isCorrect = currentInput.toLowerCase() === targetPhrase.toLowerCase();

        if (isCorrect) {
            handleCorrectInput();
        } else {
            handleIncorrectInput();
        }
    }

    function handleCorrectInput() {
        if (isIntruderDetected) return;
        stopIdleTimer();
        stopAlarmSound();
        successAudio.play();
        console.log("Correct!");
        document.cookie = "passphraseEntered=true; path=/; SameSite=Lax; max-age=" + (30 * 24 * 60 * 60); 


        symbolContainer.classList.add('correct');
        resonantLogo.classList.add('correct');

        typedLettersContainer.innerHTML = '';

        setTimeout(() => {
            if (!isIntruderDetected) {
                successMessage.style.display = 'block';
            }
        }, 800);

        setTimeout(() => {
            if (!isIntruderDetected) {
                window.location.href = 'threshold.html';
            }
        }, 2000);
    }

    function handleIncorrectInput() {
        if (isIntruderDetected) return;

        incorrectAttempts++;
        console.log(`Incorrect attempt ${incorrectAttempts} of ${MAX_INCORRECT_ATTEMPTS}.`);
        errorAudio.play();
        if (incorrectAttempts >= MAX_INCORRECT_ATTEMPTS) {
            handleIntruderDetection();
            return;
        }

        stopIdleTimer();
        symbolContainer.classList.add('incorrect');

        typedLettersContainer.querySelectorAll('.floating-letter').forEach(span => {
            span.classList.add('incorrect');
            span.addEventListener('animationend', () => span.remove());
        });

        setTimeout(() => {
            if (!isIntruderDetected) {
                symbolContainer.classList.remove('incorrect');
                startIdleTimer();
            }
        }, 400);

        currentInput = "";
    }

    function handleIntruderDetection() {
        if (isIntruderDetected) return;

        console.error("INTRUDER DETECTED!");
        isIntruderDetected = true;
        adminSequence = "";
        stopIdleTimer();
        startAlarmSound();

        container.style.transition = 'opacity 0.5s ease-out';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';

        idleMessageContainer.style.display = 'none';
        hideIdleMessage();

        if (intruderMessageContainer) {
            intruderMessageContainer.style.display = 'flex';
            setTimeout(() => {
                if (isIntruderDetected) intruderMessageContainer.classList.add('visible');
            }, 10);
        }

        document.body.classList.add('intruder-detected-state');
    }

    function handleAdminOverride() {
        console.log("ADMIN OVERRIDE ACCEPTED.");
        isIntruderDetected = false;
        adminSequence = "";
        stopAlarmSound();

        document.body.classList.remove('intruder-detected-state');
        if (intruderMessageContainer) {
            intruderMessageContainer.classList.remove('visible');
            setTimeout(() => {
                if (!isIntruderDetected) intruderMessageContainer.style.display = 'none';
            }, 500);
        }

        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
        currentInput = "";
        typedLettersContainer.innerHTML = '';
        incorrectAttempts = 0;

        symbolContainer.classList.remove('correct', 'incorrect');
        resonantLogo.classList.remove('correct');

        startIdleTimer();
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousemove', () => {
        resetIdleTimer();
        initializeAudioContext(); 
    }, { once: true });
    document.addEventListener('mousedown', () => {
        resetIdleTimer();
        initializeAudioContext(); 
    }, { once: true });
    document.addEventListener('touchstart', () => {
        resetIdleTimer();
        initializeAudioContext(); 
    }, { once: true });

    console.log("Landing page script loaded. Listening for input...");

    startIdleTimer();
}