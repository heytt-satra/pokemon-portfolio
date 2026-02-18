/**
 * Music Engine — Plays MP3 soundtrack files for each game screen.
 * Files served from public/music/.
 *
 * Usage:
 *   import { playTrack, stopMusic, toggleMute, isMuted, playSfx, onTrackEnd } from './musicEngine';
 *   playTrack('overworld');
 *   playSfx('obtained');         // play a one-shot sound over current music
 *   onTrackEnd('gamefreak', cb); // run callback when track finishes naturally
 *   stopMusic();
 *   toggleMute();
 */

const TRACK_FILES = {
    gamefreak: '/music/gamefreak.mp3',
    title: '/music/title.mp3',
    intro: '/music/professor_oak.mp3',
    overworld: '/music/overworld.mp3',
    battle: '/music/battle.mp3',
    obtained: '/music/encounter.mp3',
    menu: '/music/gym.mp3',
};

// Track-specific config
const TRACK_CONFIG = {
    gamefreak: { loop: false, volume: 0.5 },
    title: { loop: true, volume: 0.4 },
    intro: { loop: true, volume: 0.35 },
    overworld: { loop: true, volume: 0.4 },
    battle: { loop: true, volume: 0.45 },
    obtained: { loop: false, volume: 0.5 },
    menu: { loop: true, volume: 0.35 },
};

let currentAudio = null;
let currentTrack = null;
let muted = false;
let masterVolume = 1.0;
let sfxAudio = null;

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
    // Return a clone if already in-use to allow overlap for SFX
    return audioCache[trackName];
}

function tryPlay(audio, trackName) {
    const playPromise = audio.play();
    if (playPromise) {
        playPromise.catch(() => {
            const resume = () => {
                if (currentTrack === trackName || sfxAudio === audio) {
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
    audio.onended = null;

    tryPlay(audio, trackName);
    currentAudio = audio;
}

/**
 * Register a callback for when a specific track ends naturally (non-looping).
 * Returns a cleanup function.
 */
export function onTrackEnd(trackName, callback) {
    const audio = getAudio(trackName);
    if (!audio) return () => { };

    const handler = () => {
        if (currentTrack === trackName) {
            callback();
        }
    };
    audio.addEventListener('ended', handler);
    return () => audio.removeEventListener('ended', handler);
}

/**
 * Play a one-shot sound effect OVER the current music (e.g. "obtained" jingle).
 * The background music is ducked (lowered) while the SFX plays, then restored.
 */
export function playSfx(trackName) {
    const url = TRACK_FILES[trackName];
    if (!url) return;

    // Duck current music
    if (currentAudio) {
        currentAudio.volume = muted ? 0 : 0.1;
    }

    sfxAudio = new Audio(url);
    const config = TRACK_CONFIG[trackName] || { volume: 0.5 };
    sfxAudio.volume = muted ? 0 : config.volume * masterVolume;
    sfxAudio.loop = false;

    sfxAudio.onended = () => {
        // Restore background music volume
        if (currentAudio && currentTrack) {
            const bgConfig = TRACK_CONFIG[currentTrack] || { volume: 0.4 };
            currentAudio.volume = muted ? 0 : bgConfig.volume * masterVolume;
        }
        sfxAudio = null;
    };

    tryPlay(sfxAudio, trackName);
}

export function stopMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.onended = null;
    }
    if (sfxAudio) {
        sfxAudio.pause();
        sfxAudio = null;
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
    if (sfxAudio) {
        sfxAudio.volume = muted ? 0 : 0.5 * masterVolume;
    }
    return muted;
}

export function isMuted() {
    return muted;
}

export function getCurrentTrack() {
    return currentTrack;
}
