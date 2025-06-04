// whispersUI.js - Handles GUI elements for the Chamber of Whispers

const GUI = window.BABYLON.GUI;

// Variables to hold GUI elements (managed by this module)
let whisperInputContainer = null;
let whisperDisplayContainer = null;
let displayTimeoutId = null;

const WHISPER_DISPLAY_TIMEOUT_MS = 7000; // How long whisper text stays visible

// --- UI Interaction Functions ---
export function showWhisperInput(scene, advancedTexture, onWhisperSubmit) {
    if (whisperInputContainer || !advancedTexture || !GUI) return;

    whisperInputContainer = new GUI.Rectangle("whisperInput");
    whisperInputContainer.width = "400px";
    whisperInputContainer.height = "150px";
    whisperInputContainer.cornerRadius = 10;
    whisperInputContainer.color = "rgba(150, 150, 180, 0.8)";
    whisperInputContainer.thickness = 1;
    whisperInputContainer.background = "rgba(10, 10, 20, 0.7)";
    whisperInputContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    whisperInputContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    whisperInputContainer.isPointerBlocker = true; // Block clicks behind input
    whisperInputContainer.zIndex = 100; // Ensure it's above other UI if needed
    advancedTexture.addControl(whisperInputContainer);

    const inputText = new GUI.InputText("whisperText");
    inputText.width = 0.9;
    inputText.maxWidth = "380px";
    inputText.height = "80px";
    inputText.text = "";
    inputText.color = "white";
    inputText.background = "rgba(0, 0, 0, 0.5)";
    inputText.focusedBackground = "rgba(0, 0, 0, 0.8)";
    inputText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    inputText.paddingTop = "10px";
    inputText.promptMessage = "Share your resonance...";
    inputText.autoStretchWidth = false; // Prevent automatic resizing

    whisperInputContainer.addControl(inputText);

    const submitButton = GUI.Button.CreateSimpleButton("submit", "Whisper");
    submitButton.width = "100px";
    submitButton.height = "40px";
    submitButton.color = "white";
    submitButton.background = "rgba(80, 80, 120, 0.8)";
    submitButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    submitButton.paddingBottom = "10px";
    submitButton.onPointerUpObservable.add(() => {
        const text = inputText.text.trim();
        if (text) {
            onWhisperSubmit(text); // Call the provided callback
        }
        hideWhisperInput();
    });
    whisperInputContainer.addControl(submitButton);

    // Ensure the input field gets focus
    setTimeout(() => {
        if (advancedTexture) { // Check if still exists
            advancedTexture.executeOnAllControls(control => {
                if (control === inputText) {
                    inputText.focus();
                }
            });
        }
    }, 50); // Small delay might help ensure focus works
}

export function hideWhisperInput() {
    if (whisperInputContainer) {
        whisperInputContainer.dispose();
        whisperInputContainer = null;
    }
}

export function displayWhisperText(advancedTexture, whisperData) {
    if (!advancedTexture || !GUI || !whisperData) return; // Ensure GUI is ready and data exists

    hideWhisperDisplay(); // Clear previous display first

    whisperDisplayContainer = new GUI.Rectangle("whisperDisplay");
    whisperDisplayContainer.width = "300px";
    whisperDisplayContainer.height = "auto";
    whisperDisplayContainer.cornerRadius = 5;
    whisperDisplayContainer.color = "rgba(180, 180, 200, 0.9)";
    whisperDisplayContainer.thickness = 1;
    whisperDisplayContainer.background = "rgba(20, 20, 30, 0.85)";
    whisperDisplayContainer.paddingTop = "10px";
    whisperDisplayContainer.paddingBottom = "10px";
    whisperDisplayContainer.paddingLeft = "10px";
    whisperDisplayContainer.paddingRight = "10px";
    whisperDisplayContainer.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    whisperDisplayContainer.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    whisperDisplayContainer.adaptHeightToChildren = true;
    whisperDisplayContainer.isPointerBlocker = true;
    whisperDisplayContainer.zIndex = 100;
    advancedTexture.addControl(whisperDisplayContainer);

    const textBlock = new GUI.TextBlock("displayText");
    textBlock.text = whisperData.text;
    textBlock.color = "white";
    textBlock.fontSize = 14;
    textBlock.textWrapping = true;
    textBlock.resizeToFit = false; // Let container handle resizing based on text
    textBlock.width = "100%";
    textBlock.height = "auto"; // Adapt height to content
    textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    whisperDisplayContainer.addControl(textBlock);

    displayTimeoutId = setTimeout(() => {
        hideWhisperDisplay();
    }, WHISPER_DISPLAY_TIMEOUT_MS);
}

export function hideWhisperDisplay() {
    if (displayTimeoutId) {
        clearTimeout(displayTimeoutId);
        displayTimeoutId = null;
    }
    if (whisperDisplayContainer) {
        whisperDisplayContainer.dispose();
        whisperDisplayContainer = null;
    }
}

// Function to check if the input UI is currently active
export function isWhisperInputActive() {
    return !!whisperInputContainer;
}