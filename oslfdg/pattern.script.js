// pattern.script.js - Handles the pattern recognition game

document.addEventListener('DOMContentLoaded', () => {
    const patternMatrix = document.getElementById('pattern-matrix');
    const startButton = document.getElementById('start-pattern-btn');
    const levelDisplay = document.getElementById('pattern-level-display');
    const messageDisplay = document.getElementById('pattern-message');

    if (!patternMatrix || !startButton || !levelDisplay || !messageDisplay) {
        console.error("Pattern game elements not found.");
        return;
    }

    const dimension = parseInt(patternMatrix.dataset.dimension) || 3; // Default to 3x3
    const totalNodes = dimension * dimension;

    let level = 0;
    let sequence = [];
    let userSequence = [];
    let gameState = 'idle'; // 'idle', 'playingSequence', 'waitingForUser', 'gameOver'
    let sequencePlaybackTimeout;
    let nodeClickListeners = []; // Store listeners to remove later

    const SEQUENCE_DELAY_MS = 600; // Time between sequence node flashes
    const NODE_FLASH_DURATION_MS = 350; // How long a node stays lit during sequence
    const STARTING_LEVEL = 1;

    // --- Initialization ---
    function initializeMatrix() {
        patternMatrix.innerHTML = ''; // Clear previous nodes
        patternMatrix.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
        for (let i = 0; i < totalNodes; i++) {
            const node = document.createElement('div');
            node.classList.add('pattern-node');
            node.dataset.index = i;
            patternMatrix.appendChild(node);
        }
        setMatrixActive(false); // Initially inactive
        setMessage("Press Start to begin.");
        updateLevelDisplay();
    }

    // --- Game Logic ---
    function startGame() {
        level = STARTING_LEVEL;
        sequence = [];
        userSequence = [];
        updateLevelDisplay();
        startButton.textContent = "Restart"; // Change button text
        nextLevel();
    }

    function nextLevel() {
        userSequence = [];
        addToSequence();
        playSequence();
    }

    function addToSequence() {
        const randomIndex = Math.floor(Math.random() * totalNodes);
        sequence.push(randomIndex);
    }

    function playSequence() {
        gameState = 'playingSequence';
        setMatrixActive(false); // Disable clicks during playback
        setMessage("Watch carefully...");
        startButton.disabled = true; // Disable button during playback

        let delay = SEQUENCE_DELAY_MS; // Initial delay before first flash

        sequence.forEach((nodeIndex, i) => {
            sequencePlaybackTimeout = setTimeout(() => {
                flashNode(nodeIndex);
                // Check if this is the last node in sequence
                if (i === sequence.length - 1) {
                   sequencePlaybackTimeout = setTimeout(startUserTurn, SEQUENCE_DELAY_MS); // Wait after last flash
                }
            }, delay);
            delay += SEQUENCE_DELAY_MS; // Add delay for the next node
        });
    }

     function startUserTurn() {
        clearTimeout(sequencePlaybackTimeout);
        gameState = 'waitingForUser';
        setMessage("Your turn...");
        setMatrixActive(true); // Enable clicks
        userSequence = []; // Clear previous user input for this level
        startButton.disabled = false; // Re-enable button
    }


    function handleNodeClick(event) {
        if (gameState !== 'waitingForUser') return;

        const clickedNode = event.target;
        if (!clickedNode.classList.contains('pattern-node')) return;

        const index = parseInt(clickedNode.dataset.index);
        userSequence.push(index);

        // Visual feedback for user click
        flashNode(index, 'user-active', 150); // Shorter flash for user clicks

        // Check if the click was correct
        const currentStep = userSequence.length - 1;
        if (userSequence[currentStep] !== sequence[currentStep]) {
            handleIncorrectInput();
            return;
        }

        // Check if the level sequence is complete
        if (userSequence.length === sequence.length) {
            handleCorrectLevel();
        }
    }

    function handleCorrectLevel() {
        gameState = 'levelComplete'; // Temporary state
        setMatrixActive(false);
        setMessage("Correct!", "success");
        level++;
        updateLevelDisplay();
        // Wait a moment before starting the next level
        setTimeout(nextLevel, 1000);
    }

    function handleIncorrectInput() {
        gameState = 'gameOver';
        setMatrixActive(false);
        setMessage("Incorrect! Press Start to try again.", "error");
        flashNode(userSequence[userSequence.length - 1], 'error', 400); // Flash the wrong node
        startButton.textContent = "Start";
        startButton.disabled = false;
        level = 0; // Reset level
    }


    // --- Utility Functions ---
    function flashNode(index, activeClass = 'sequence-active', duration = NODE_FLASH_DURATION_MS) {
        const node = patternMatrix.querySelector(`.pattern-node[data-index="${index}"]`);
        if (node) {
            node.classList.add(activeClass);
            setTimeout(() => {
                node.classList.remove(activeClass);
            }, duration);
        }
    }

    function setMatrixActive(isActive) {
        if (isActive) {
            patternMatrix.classList.add('active');
            // Add listeners only when activating
            if (nodeClickListeners.length === 0) { // Prevent adding multiple listeners
                 patternMatrix.querySelectorAll('.pattern-node').forEach(node => {
                     const listener = handleNodeClick.bind(this); // Bind 'this' if needed
                     node.addEventListener('click', listener);
                     nodeClickListeners.push({ node, listener });
                 });
            }
        } else {
            patternMatrix.classList.remove('active');
             // Remove listeners when deactivating
            nodeClickListeners.forEach(({ node, listener }) => {
                node.removeEventListener('click', listener);
            });
            nodeClickListeners = []; // Clear the stored listeners
        }
    }

    function setMessage(msg, type = '') { // type can be 'error', 'success'
        messageDisplay.textContent = msg;
        messageDisplay.className = 'pattern-feedback'; // Reset classes
        if (type) {
            messageDisplay.classList.add(type);
        }
    }

    function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${level}`;
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);

    // --- Initial Setup ---
    initializeMatrix();

});