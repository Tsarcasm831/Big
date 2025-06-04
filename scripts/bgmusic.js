// bgmusic.js

// Function to play background music
let musicPlayed = false;
let bgAudio; // Declare bgAudio variable

function playBackgroundMusic() {
    if (!musicPlayed) {
        bgAudio = new Audio('https://file.garden/Zy7B0LkdIVpGyzA1/RODDevAssets/worldmapmusic.mp3'); // Use FileGarden link
        bgAudio.volume = 0.4; // Set volume to 40%
        bgAudio.play();
        musicPlayed = true;

        bgAudio.addEventListener('ended', () => {
            bgAudio.currentTime = 0; // Restart the song
            bgAudio.play();
        });
    }
}

// Function to mute and unmute background music
function toggleMute() {
    if (bgAudio) {
        bgAudio.muted = !bgAudio.muted; // Toggle mute status
    }
}

// Event listener to play music on game area click
const gameArea = document.getElementById('map');
if (gameArea) {
    gameArea.addEventListener('click', () => {
        playBackgroundMusic();
    });
}

// Add event listener to the mute button after DOM content has loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the mute button
    document.getElementById('mute-music').addEventListener('click', toggleMute);
});
