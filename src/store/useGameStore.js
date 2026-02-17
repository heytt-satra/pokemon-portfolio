import { create } from 'zustand';

const useGameStore = create((set, get) => ({
    // ── Screen management ──
    screen: 'boot',
    prevScreen: null,
    transition: 'FADE',
    introComplete: false,

    setScreen: (screen, transition = 'FADE') =>
        set((s) => ({ screen, prevScreen: s.screen, transition })),
    setIntroComplete: () => set({ introComplete: true }),
    clearSave: () => {
        localStorage.removeItem('heytt_caught');
        localStorage.removeItem('heytt_seen');
        set({ introComplete: false, caughtEntities: [], encounteredEntities: [] });
    },

    // ── Building exit persistence ──
    lastDoorPosition: null,
    setLastDoorPosition: (pos) => set({ lastDoorPosition: pos }),
    clearDoorPosition: () => set({ lastDoorPosition: null }),

    // ── Encounter state ──
    encounterCooldown: 0,
    currentEncounter: null,
    encounterPhase: 'NONE', // NONE | TRIGGER_ANIM | ENCOUNTER_SCREEN | INSPECT | CATCH_ANIM | RESULT
    caughtEntities: JSON.parse(localStorage.getItem('heytt_caught') || '[]'),
    encounteredEntities: JSON.parse(localStorage.getItem('heytt_seen') || '[]'),

    decrementCooldown: () =>
        set((s) => ({ encounterCooldown: Math.max(0, s.encounterCooldown - 1) })),

    triggerEncounter: (entity) =>
        set({
            currentEncounter: entity,
            encounterPhase: 'TRIGGER_ANIM',
            encounterCooldown: 5,
        }),

    setEncounterPhase: (phase) => set({ encounterPhase: phase }),

    catchEntity: (id) => {
        const s = get();
        if (s.caughtEntities.includes(id)) return;
        const next = [...s.caughtEntities, id];
        localStorage.setItem('heytt_caught', JSON.stringify(next));
        set({ caughtEntities: next });
    },

    markEncountered: (id) => {
        const s = get();
        if (s.encounteredEntities.includes(id)) return;
        const next = [...s.encounteredEntities, id];
        localStorage.setItem('heytt_seen', JSON.stringify(next));
        set({ encounteredEntities: next });
    },

    endEncounter: () =>
        set({ currentEncounter: null, encounterPhase: 'NONE' }),
}));

export default useGameStore;
