import { useEffect, useRef } from 'react';
import { subscribe } from '../engine/inputManager';

/**
 * useInput — React hook that subscribes to the global InputManager.
 *
 * NO event listeners are added here. The InputManager singleton
 * handles the ONE global keydown listener. This hook just subscribes
 * a callback and unsubscribes on unmount.
 *
 * The deps parameter is intentionally IGNORED — the callback ref
 * pattern ensures the latest callback is always used without
 * re-registering the subscription.
 *
 * callback(action, type) where type = 'down' | 'up'
 */
export default function useInput(callback) {
    const cbRef = useRef(callback);
    cbRef.current = callback;

    useEffect(() => {
        // Subscribe to the singleton InputManager.
        // Returns an unsubscribe function for cleanup.
        const unsubscribe = subscribe(cbRef);
        return unsubscribe;
    }, []); // ALWAYS empty. cbRef handles freshness.
}
