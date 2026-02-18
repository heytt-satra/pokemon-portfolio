import { useEffect, useRef } from 'react';

/**
 * Universal input hook – maps keyboard, touch, and gamepad
 * to game actions: UP, DOWN, LEFT, RIGHT, A, B, START, SELECT.
 *
 * Includes per-action timestamp debounce to prevent double-firing
 * from React StrictMode double-mounting or any other source.
 *
 * callback(action, type) where type = 'down' | 'up'
 */

// ── Global debounce map (shared across all useInput instances) ──
// This ensures that even if multiple useInput hooks fire on the same keypress,
// only the FIRST one processes the action.
const ACTION_DEBOUNCE_MS = 150; // minimum ms between same action
const lastActionTime = {};

export default function useInput(callback, deps = []) {
    const cbRef = useRef(callback);
    cbRef.current = callback;

    useEffect(() => {
        const KEY_MAP = {
            ArrowUp: 'UP', w: 'UP', W: 'UP',
            ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
            ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
            ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
            z: 'A', Z: 'A', Enter: 'A', ' ': 'A',
            x: 'B', X: 'B', Escape: 'B', Backspace: 'B',
            Shift: 'START',
            Control: 'SELECT',
        };

        const onDown = (e) => {
            if (e.repeat) return; // ignore OS key-repeat
            const action = KEY_MAP[e.key];
            if (!action) return;

            e.preventDefault();

            // Per-action timestamp debounce — prevent double-firing
            const now = performance.now();
            const lastTime = lastActionTime[action] || 0;
            if (now - lastTime < ACTION_DEBOUNCE_MS) return;
            lastActionTime[action] = now;

            cbRef.current(action, 'down');
        };

        const onUp = (e) => {
            const action = KEY_MAP[e.key];
            if (action) {
                e.preventDefault();
                cbRef.current(action, 'up');
            }
        };

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);
        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
        };
    }, deps);
}
