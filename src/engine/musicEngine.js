/**
 * Music Engine — Plays MP3 soundtrack files for each game screen.
 * Files served from public/music/.
 *
 * Usage:
 *   import { playTrack, stopMusic, toggleMute, isMuted } from './musicEngine';
 *   playTrack('overworld');
 *   stopMusic();
 *   toggleMute();
 */

const TRACK_FILES = {
    gamefreak: '/music/gamefreak.mp3',
    title: '/music/title.mp3',
    intro: '/music/title.mp3',     // same track as title
    overworld: '/music/overworld.mp3',
    encounter: '/music/encounter.mp3',
    menu: '/music/gym.mp3',
};

// Track-specific config: which should loop, which play once
const TRACK_CONFIG = {
    gamefreak: { loop: false, volume: 0.5 },
    title: { loop: true, volume: 0.4 },
    intro: { loop: true, volume: 0.3 },
    overworld: { loop: true, volume: 0.4 },
    encounter: { loop: false, volume: 0.5 },
    menu: { loop: true, volume: 0.35 },
};

let currentAudio = null;
let currentTrack = null;
let muted = false;
let masterVolume = 1.0;

// Cache loaded Audio objects
const audioCache = {};

function getAudio(trackName) {
    if (!audioCache[trackName]) {
        const url = TRACK_FILES[trackName];
        if (!url) return null;
        const audio = new Audio(url);
        audio.preload = 'auto';
        audioCache[trackName] = audio;
    }
    return audioCache[trackName];
}

export function playTrack(trackName) {
    if (currentTrack === trackName && currentAudio && !currentAudio.paused) return;

    stopMusic();
    currentTrack = trackName;

    const audio = getAudio(trackName);
    if (!audio) return;

    const config = TRACK_CONFIG[trackName] || { loop: true, volume: 0.4 };
    audio.loop = config.loop;
    audio.volume = muted ? 0 : config.volume * masterVolume;
    audio.currentTime = 0;

    // Handle autoplay restrictions — retry on user interaction
    const playPromise = audio.play();
    if (playPromise) {
        playPromise.catch(() => {
            // Autoplay blocked — try again on next user click
            const resume = () => {
                if (currentTrack === trackName) {
                    audio.play().catch(() => { });
                }
                document.removeEventListener('click', resume);
                document.removeEventListener('keydown', resume);
                document.removeEventListener('touchstart', resume);
            };
            document.addEventListener('click', resume, { once: true });
            document.addEventListener('keydown', resume, { once: true });
            document.addEventListener('touchstart', resume, { once: true });
        });
    }

    currentAudio = audio;

    // For non-looping tracks (gamefreak, encounter), fire onended
    if (!config.loop) {
        audio.onended = () => {
            // Non-looping track ended — let ScreenManager handle transition
            currentTrack = null;
            currentAudio = null;
        };
    }
}

export function stopMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.onended = null;
    }
    currentTrack = null;
    currentAudio = null;
}

export function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
    if (currentAudio && currentTrack) {
        const config = TRACK_CONFIG[currentTrack] || { volume: 0.4 };
        currentAudio.volume = muted ? 0 : config.volume * masterVolume;
    }
}

export function toggleMute() {
    muted = !muted;
    if (currentAudio && currentTrack) {
        const config = TRACK_CONFIG[currentTrack] || { volume: 0.4 };
        currentAudio.volume = muted ? 0 : config.volume * masterVolume;
    }
    return muted;
}

export function isMuted() {
    return muted;
}

export function getCurrentTrack() {
    return currentTrack;
}
