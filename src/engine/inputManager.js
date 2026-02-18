/**
 * InputManager — Singleton input system for the entire game.
 *
 * EXACTLY ONE keydown listener on window. Ever.
 * Components subscribe via subscribe(). When a key fires,
 * all subscribers are notified. Each subscriber decides
 * whether to handle it based on its own context.
 *
 * This eliminates:
 * - Duplicate event listeners from React re-renders
 * - StrictMode double-mount issues
 * - useEffect dependency array race conditions
 * - Stale closure problems
 */

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

// Subscriber list — ordered array so we can iterate predictably
const subscribers = [];

// Track raw key state for polling (used by Overworld movement)
export const keyState = {};

// ── THE ONE AND ONLY keydown listener ──
window.addEventListener('keydown', (e) => {
    // Track raw key state (for movement polling)
    keyState[e.key] = true;

    // Ignore OS key-repeat for action dispatch
    if (e.repeat) return;

    const action = KEY_MAP[e.key];
    if (!action) return;
    e.preventDefault();

    // Dispatch to all subscribers (newest first = highest priority)
    // We copy the array to avoid mutation issues during iteration
    const subs = subscribers.slice();
    for (let i = subs.length - 1; i >= 0; i--) {
        subs[i].callback(action, 'down');
    }
});

window.addEventListener('keyup', (e) => {
    keyState[e.key] = false;

    const action = KEY_MAP[e.key];
    if (!action) return;
    e.preventDefault();

    const subs = subscribers.slice();
    for (let i = subs.length - 1; i >= 0; i--) {
        subs[i].callback(action, 'up');
    }
});

/**
 * Subscribe a callback to receive input events.
 * Returns an unsubscribe function.
 * 
 * The callback ref pattern means we register a stable wrapper
 * that always calls the latest callback, so the subscriber
 * identity never changes.
 */
export function subscribe(callbackRef) {
    const entry = { callback: (action, type) => callbackRef.current(action, type) };
    subscribers.push(entry);
    return () => {
        const idx = subscribers.indexOf(entry);
        if (idx !== -1) subscribers.splice(idx, 1);
    };
}

/**
 * Clear specific keys from raw keyState.
 * Used after dialog closes to prevent re-triggering.
 */
export function clearKeys(...keys) {
    for (const k of keys) {
        keyState[k] = false;
    }
}
