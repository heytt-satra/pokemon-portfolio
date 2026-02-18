/**
 * Chiptune Music Engine — Procedural 8-bit music via Web Audio API.
 * No audio files needed. Each track is composed of note sequences
 * played through square/triangle/noise oscillators.
 *
 * Usage:
 *   import { playTrack, stopMusic, setVolume, toggleMute } from './musicEngine';
 *   playTrack('overworld');   // start a track (loops)
 *   stopMusic();              // stop all music
 *   setVolume(0.5);           // 0–1
 *   toggleMute();             // mute/unmute
 */

let audioCtx = null;
let masterGain = null;
let currentNodes = [];
let currentTrack = null;
let loopTimeoutId = null;
let muted = false;
let volume = 0.3;

// ── Note frequency table ──
const NOTE_FREQ = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50,
    // Sharps
    'C#3': 138.59, 'D#3': 155.56, 'F#3': 185.00, 'G#3': 207.65, 'A#3': 233.08,
    'C#4': 277.18, 'D#4': 311.13, 'F#4': 369.99, 'G#4': 415.30, 'A#4': 466.16,
    'C#5': 554.37, 'D#5': 622.25, 'F#5': 739.99, 'G#5': 830.61, 'A#5': 932.33,
    // Flats (aliases)
    Eb3: 155.56, Bb3: 233.08, Ab3: 207.65,
    Eb4: 311.13, Bb4: 466.16, Ab4: 415.30,
    Eb5: 622.25, Bb5: 932.33, Ab5: 830.61,
};

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// ── Play a single note ──
function playNote(freq, startTime, duration, type = 'square', vol = 0.15) {
    const ctx = getCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.01);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);

    currentNodes.push(osc);
    osc.onended = () => {
        const idx = currentNodes.indexOf(osc);
        if (idx > -1) currentNodes.splice(idx, 1);
    };
}

// ── Play a sequence of notes ──
function playSequence(notes, bpm, startOffset = 0, type = 'square', vol = 0.15) {
    const ctx = getCtx();
    const beatDur = 60 / bpm;
    let time = ctx.currentTime + startOffset;

    notes.forEach(([note, beats]) => {
        if (note === '_') {
            // Rest
            time += beatDur * beats;
        } else {
            const freq = NOTE_FREQ[note];
            if (freq) {
                playNote(freq, time, beatDur * beats * 0.9, type, vol);
            }
            time += beatDur * beats;
        }
    });

    return time - ctx.currentTime;
}

// ── Track definitions ──
const TRACKS = {
    // --- Title screen: upbeat, heroic intro ---
    title: {
        bpm: 140,
        melody: [
            ['E4', 0.5], ['G4', 0.5], ['B4', 0.5], ['E5', 1],
            ['D5', 0.5], ['B4', 0.5], ['G4', 0.5], ['A4', 1],
            ['G4', 0.5], ['E4', 0.5], ['F#4', 0.5], ['G4', 1],
            ['A4', 0.5], ['B4', 0.5], ['C5', 0.5], ['D5', 1],
            ['E5', 0.5], ['D5', 0.5], ['C5', 0.5], ['B4', 1],
            ['A4', 0.5], ['G4', 0.5], ['A4', 0.5], ['B4', 1],
            ['G4', 0.5], ['E4', 0.5], ['D4', 0.5], ['E4', 1.5],
            ['_', 0.5],
        ],
        bass: [
            ['E3', 1], ['_', 0.5], ['E3', 0.5], ['G3', 1], ['_', 0.5], ['G3', 0.5],
            ['A3', 1], ['_', 0.5], ['A3', 0.5], ['B3', 1], ['_', 0.5], ['B3', 0.5],
            ['C4', 1], ['_', 0.5], ['C4', 0.5], ['D4', 1], ['_', 0.5], ['D4', 0.5],
            ['E3', 1], ['_', 0.5], ['E3', 0.5], ['E3', 1.5], ['_', 0.5],
        ],
    },

    // --- Overworld: classic walking theme ---
    overworld: {
        bpm: 120,
        melody: [
            ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['C5', 1],
            ['B4', 0.5], ['A4', 0.5], ['G4', 1],
            ['F4', 0.5], ['A4', 0.5], ['C5', 0.5], ['A4', 1],
            ['G4', 0.5], ['F4', 0.5], ['E4', 1],
            ['D4', 0.5], ['F4', 0.5], ['A4', 0.5], ['G4', 1],
            ['F4', 0.5], ['E4', 0.5], ['D4', 1],
            ['C4', 0.5], ['E4', 0.5], ['G4', 0.5], ['E4', 1],
            ['C4', 1.5], ['_', 0.5],
        ],
        bass: [
            ['C3', 1], ['_', 0.5], ['G3', 0.5], ['C3', 1], ['_', 0.5], ['G3', 0.5],
            ['F3', 1], ['_', 0.5], ['C3', 0.5], ['F3', 1], ['_', 0.5], ['C3', 0.5],
            ['G3', 1], ['_', 0.5], ['D3', 0.5], ['G3', 1], ['_', 0.5], ['D3', 0.5],
            ['C3', 1], ['_', 0.5], ['G3', 0.5], ['C3', 1.5], ['_', 0.5],
        ],
    },

    // --- Encounter: intense battle music ---
    encounter: {
        bpm: 160,
        melody: [
            ['E4', 0.25], ['E4', 0.25], ['E5', 0.5], ['D#5', 0.5], ['D5', 0.5],
            ['C5', 0.25], ['C5', 0.25], ['B4', 0.5], ['A4', 0.5],
            ['G4', 0.25], ['G4', 0.25], ['A4', 0.5], ['B4', 0.5], ['C5', 0.5],
            ['B4', 0.25], ['A4', 0.25], ['G4', 0.5], ['E4', 1],
            ['E4', 0.25], ['E4', 0.25], ['E5', 0.5], ['D#5', 0.5], ['D5', 0.5],
            ['C5', 0.25], ['C5', 0.25], ['D5', 0.5], ['E5', 0.5],
            ['D5', 0.25], ['C5', 0.25], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5],
            ['E4', 0.5], ['_', 0.5],
        ],
        bass: [
            ['E3', 0.5], ['E3', 0.5], ['E3', 0.5], ['E3', 0.5],
            ['A3', 0.5], ['A3', 0.5], ['A3', 0.5], ['A3', 0.5],
            ['C3', 0.5], ['C3', 0.5], ['D3', 0.5], ['D3', 0.5],
            ['E3', 0.5], ['E3', 0.5], ['E3', 1],
            ['E3', 0.5], ['E3', 0.5], ['E3', 0.5], ['E3', 0.5],
            ['A3', 0.5], ['A3', 0.5], ['A3', 0.5], ['A3', 0.5],
            ['B3', 0.5], ['B3', 0.5], ['C3', 0.5], ['C3', 0.5],
            ['E3', 0.5], ['_', 0.5],
        ],
    },

    // --- Menu / Screens: calm, atmospheric ---
    menu: {
        bpm: 90,
        melody: [
            ['E4', 1], ['G4', 1], ['B4', 1], ['A4', 1],
            ['G4', 1], ['E4', 1], ['D4', 1], ['E4', 1],
            ['C4', 1], ['E4', 1], ['G4', 1], ['F4', 1],
            ['E4', 1], ['D4', 1], ['C4', 1], ['_', 1],
        ],
        bass: [
            ['C3', 2], ['E3', 2], ['F3', 2], ['G3', 2],
            ['A3', 2], ['F3', 2], ['C3', 2], ['_', 2],
        ],
    },

    // --- Intro sequence: mysterious, building ---
    intro: {
        bpm: 100,
        melody: [
            ['E4', 1], ['_', 0.5], ['G4', 0.5], ['A4', 1], ['B4', 1],
            ['C5', 1], ['_', 0.5], ['B4', 0.5], ['A4', 1], ['G4', 1],
            ['E4', 1], ['_', 0.5], ['D4', 0.5], ['E4', 1], ['G4', 1],
            ['A4', 2], ['_', 1], ['_', 1],
        ],
        bass: [
            ['C3', 2], ['E3', 2], ['A3', 2], ['G3', 2],
            ['C3', 2], ['D3', 2], ['E3', 2], ['_', 2],
        ],
    },
};

// ── Public API ──

export function playTrack(trackName) {
    if (currentTrack === trackName) return; // already playing
    stopMusic();
    currentTrack = trackName;

    const track = TRACKS[trackName];
    if (!track) return;

    const scheduleLoop = () => {
        if (currentTrack !== trackName) return;

        const melodyDur = playSequence(track.melody, track.bpm, 0.05, 'square', 0.12);
        playSequence(track.bass, track.bpm, 0.05, 'triangle', 0.10);

        const totalDur = melodyDur * 1000;
        loopTimeoutId = setTimeout(scheduleLoop, totalDur - 100);
    };

    scheduleLoop();
}

export function stopMusic() {
    currentTrack = null;
    if (loopTimeoutId) {
        clearTimeout(loopTimeoutId);
        loopTimeoutId = null;
    }
    currentNodes.forEach(osc => {
        try { osc.stop(); } catch (_) { /* already stopped */ }
    });
    currentNodes = [];
}

export function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) {
        masterGain.gain.value = muted ? 0 : volume;
    }
}

export function toggleMute() {
    muted = !muted;
    if (masterGain) {
        masterGain.gain.value = muted ? 0 : volume;
    }
    return muted;
}

export function isMuted() {
    return muted;
}

export function getCurrentTrack() {
    return currentTrack;
}
