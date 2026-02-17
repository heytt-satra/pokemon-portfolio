import { useEffect, useRef } from 'react';

/**
 * Universal input hook – maps keyboard, touch, and gamepad
 * to game actions: UP, DOWN, LEFT, RIGHT, A, B, START, SELECT.
 *
 * callback(action, type) where type = 'down' | 'up'
 */
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
            if (e.repeat) return; // ignore OS key-repeat so menus don't cycle too fast
            const action = KEY_MAP[e.key];
            if (action) {
                e.preventDefault();
                cbRef.current(action, 'down');
            }
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
