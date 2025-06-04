/**
 * AudioManager.js
 * 
 * Loads and controls all audio assets (ambient sounds, interaction sounds).
 * Manages playback of background audio and interaction feedback.
 */
import * as THREE from 'three';

class AudioManager {
    constructor(game) {
        this.game = game;
        this.audioListener = game.audioListener;
        this.soundLoader = game.soundLoader;
        this.sounds = {};
    }

    loadSounds() {
        // Use simple empty audio buffers instead of remote URLs
        this.createEmptySound('ambient', true, 0.5);
        this.createEmptySound('fireplaceSound');
        this.createEmptySound('bookshelfSound');
        this.createEmptySound('armchairSound');
        this.createEmptySound('quillSound');
        this.createEmptySound('doorSound');
        this.createEmptySound('footstep');
    }

    createEmptySound(name, loop = false, volume = 0.7) {
        // Create a placeholder silent sound
        const context = this.audioListener.context;
        const buffer = context.createBuffer(1, 1024, 22050);
        const source = buffer.getChannelData(0);
        for (let i = 0; i < 1024; i++) {
            source[i] = 0; // silence
        }
        
        const sound = new THREE.Audio(this.audioListener);
        sound.setBuffer(buffer);
        sound.setVolume(volume);
        if (loop) {
            sound.setLoop(true);
            // Removed automatic play to avoid AudioContext errors;
            // instead, mark the sound so it can be played after a user gesture.
            sound.autoPlay = true;
        }
        this.game.sounds[name] = sound;
    }

    loadSound(name, url, loop = false, volume = 0.7) {
        // Kept for reference but not used
        const sound = new THREE.Audio(this.audioListener);
        this.soundLoader.load(url, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(volume);
            if (loop) {
                sound.setLoop(true);
                sound.play();
            }
            this.game.sounds[name] = sound;
        });
    }

    playSound(name) {
        if (this.game.sounds[name] && !this.game.sounds[name].isPlaying) {
            this.game.sounds[name].play();
        }
    }

    stopSound(name) {
        if (this.game.sounds[name] && this.game.sounds[name].isPlaying) {
            this.game.sounds[name].stop();
        }
    }
    
    resumeAudio() {
        const context = this.audioListener.context;
        if (context.state === 'suspended') {
            context.resume().then(() => {
                console.log('Audio context resumed');
                // Auto-play sounds that were flagged to auto-play (e.g. ambient)
                for (const key in this.game.sounds) {
                    const snd = this.game.sounds[key];
                    if (snd.autoPlay && !snd.isPlaying) {
                        snd.play();
                    }
                }
            }).catch((e) => {
                console.error('Error resuming audio context:', e);
            });
        }
    }
}

export { AudioManager };