/**
 * Encounter entities for the tall-grass system.
 * Categories: SKILL, FACT, ACHIEVEMENT
 * Rarity: COMMON(60%), UNCOMMON(30%), RARE(10%)
 * Zone pools: 'skills' | 'facts' | 'achievements'
 */

export const ENCOUNTER_POOL = [
    // ═══════ SKILLS (zone: 'skills') ═══════
    {
        id: 'react_001', name: 'REACTMON', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 90, type: 'FIRE', catchable: true,
        description: 'A powerful component-based UI beast. HEYTT has been training with this one for years. It evolves when given hooks.',
    },
    {
        id: 'js_001', name: 'SCRIPTEON', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 92, type: 'FIRE', catchable: true,
        description: 'The backbone of the web. Versatile and unpredictable — just like its type coercion. HEYTT mastered it anyway.',
    },
    {
        id: 'python_001', name: 'PYTHORN', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 88, type: 'GRASS', catchable: true,
        description: 'Elegant, readable, and dangerously flexible. HEYTT uses this for AI/ML, web backends, and quantum computing.',
    },
    {
        id: 'node_001', name: 'NODOSAUR', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 82, type: 'WATER', catchable: true,
        description: 'A server-side runtime that never sleeps. Asynchronous and event-driven. HEYTT built full-stack apps with this one.',
    },
    {
        id: 'tensor_001', name: 'TENSAURA', category: 'SKILL', zone: 'skills',
        rarity: 'UNCOMMON', level: 78, type: 'PSYCHIC', catchable: true,
        description: 'Deep learning framework of legendary power. HEYTT trained sign detection models and built OCR systems with it.',
    },
    {
        id: 'postgres_001', name: 'QUERYDON', category: 'SKILL', zone: 'skills',
        rarity: 'UNCOMMON', level: 80, type: 'WATER', catchable: true,
        description: 'Relational database guardian. Reliable, structured, ACID-compliant. Powers StackIt and other HEYTT projects.',
    },
    {
        id: 'qiskit_001', name: 'QUBITITE', category: 'SKILL', zone: 'skills',
        rarity: 'RARE', level: 65, type: 'ELECTRIC', catchable: true,
        description: 'A quantum computing framework. Very few trainers even know this one exists. HEYTT built a password generator with it on IBM Quantum.',
    },
    {
        id: 'ros2_001', name: 'ROBOCORE', category: 'SKILL', zone: 'skills',
        rarity: 'RARE', level: 70, type: 'STEEL', catchable: true,
        description: 'Robot Operating System. Controls rovers, drones, and mechanical beasts. HEYTT used this for the Mars Rover project.',
    },
    {
        id: 'tailwind_001', name: 'WINDTAIL', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 85, type: 'FIRE', catchable: true,
        description: 'Utility-first CSS framework. Makes styling fast and consistent. HEYTT ships pixel-perfect UIs with it.',
    },
    {
        id: 'git_001', name: 'GITGEIST', category: 'SKILL', zone: 'skills',
        rarity: 'COMMON', level: 90, type: 'ELECTRIC', catchable: true,
        description: 'Version control master. Tracks every commit, branch, and merge. HEYTT has never lost code. (Almost never.)',
    },

    // ═══════ FACTS (zone: 'facts') ═══════
    {
        id: 'fact_001', name: 'NIGHTBUG', category: 'FACT', zone: 'facts',
        rarity: 'COMMON', level: '??', type: 'PSYCHIC', catchable: false,
        description: 'HEYTT once debugged a production website at 3 AM and fixed it by adding a single missing semicolon. The client never knew.',
    },
    {
        id: 'fact_002', name: 'ORBITFACT', category: 'FACT', zone: 'facts',
        rarity: 'UNCOMMON', level: '??', type: 'STEEL', catchable: false,
        description: 'HEYTT interned at STAR where he calculated Hohmann transfer orbits and built Excel simulations for rocket propulsion. Actual rocket science.',
    },
    {
        id: 'fact_003', name: 'THREEWEB', category: 'FACT', zone: 'facts',
        rarity: 'COMMON', level: '??', type: 'FIRE', catchable: false,
        description: 'During the Scarbluu internship, HEYTT shipped 3 full websites in a single summer and reduced page load times by 25%.',
    },
    {
        id: 'fact_004', name: 'QUANTUMR', category: 'FACT', zone: 'facts',
        rarity: 'RARE', level: '??', type: 'ELECTRIC', catchable: false,
        description: 'HEYTT has actually run code on a real IBM quantum computer. Not a simulator. A real quantum processor. Let that sink in.',
    },
    {
        id: 'fact_005', name: 'PAPERFACT', category: 'FACT', zone: 'facts',
        rarity: 'UNCOMMON', level: '??', type: 'PSYCHIC', catchable: false,
        description: 'HEYTT co-authored a peer-reviewed research paper on Explainable AI, accepted by CRC Press Taylor & Francis. Published author before graduating.',
    },
    {
        id: 'fact_006', name: 'HINDOCR', category: 'FACT', zone: 'facts',
        rarity: 'UNCOMMON', level: '??', type: 'PSYCHIC', catchable: false,
        description: 'HEYTT trained a custom Hindi OCR model for 56,000 iterations. That is a LOT of iterations. The model can read Hindi text offline.',
    },
    {
        id: 'fact_007', name: 'FULLSTACK', category: 'FACT', zone: 'facts',
        rarity: 'COMMON', level: '??', type: 'FIRE', catchable: false,
        description: 'HEYTT can go from Figma to deployed production app in a weekend. Frontend, backend, database, deployment — the whole thing.',
    },

    // ═══════ ACHIEVEMENTS (zone: 'achievements') ═══════
    {
        id: 'ach_001', name: 'ROVERKING', category: 'ACHIEVEMENT', zone: 'achievements',
        rarity: 'RARE', level: 9, type: 'STEEL', catchable: true,
        description: 'Team Kosmos secured 9th place at their DEBUT attempt at the International Rover Challenge. Named Emerging Team of the Year.',
    },
    {
        id: 'ach_002', name: 'DRONEACE', category: 'ACHIEVEMENT', zone: 'achievements',
        rarity: 'RARE', level: 3, type: 'ELECTRIC', catchable: true,
        description: '3rd place at the International Space Drone Challenge. Autonomous aerial robotics at an international stage. HEYTT does not just code — he flies.',
    },
    {
        id: 'ach_003', name: 'FIRSTSHIP', category: 'ACHIEVEMENT', zone: 'achievements',
        rarity: 'UNCOMMON', level: 1, type: 'FIRE', catchable: true,
        description: 'Co-founded Team Kosmos — a student-led Mars Rover team from scratch. Built the team, built the rover, competed internationally.',
    },
    {
        id: 'ach_004', name: 'PUBLISHED', category: 'ACHIEVEMENT', zone: 'achievements',
        rarity: 'RARE', level: 1, type: 'PSYCHIC', catchable: true,
        description: 'Published a research paper with CRC Press Taylor & Francis before even graduating. Academic certified. Peer reviewed. The real deal.',
    },
    {
        id: 'ach_005', name: 'LOADKILL', category: 'ACHIEVEMENT', zone: 'achievements',
        rarity: 'UNCOMMON', level: 25, type: 'WATER', catchable: true,
        description: 'Reduced website load times by 25% during the Scarbluu internship through thorough testing and optimization. Users never noticed — which is the point.',
    },
];

// Rarity weights
export const RARITY_WEIGHTS = { COMMON: 0.60, UNCOMMON: 0.30, RARE: 0.10 };

/**
 * Pick a random encounter from a specific zone pool using rarity weights.
 */
export function pickEncounter(zone) {
    const pool = ENCOUNTER_POOL.filter((e) => e.zone === zone);
    if (!pool.length) return pool[0] || ENCOUNTER_POOL[0];

    // Build weighted list
    const roll = Math.random();
    let rarity;
    if (roll < RARITY_WEIGHTS.COMMON) rarity = 'COMMON';
    else if (roll < RARITY_WEIGHTS.COMMON + RARITY_WEIGHTS.UNCOMMON) rarity = 'UNCOMMON';
    else rarity = 'RARE';

    let filtered = pool.filter((e) => e.rarity === rarity);
    if (!filtered.length) filtered = pool; // fallback
    return filtered[Math.floor(Math.random() * filtered.length)];
}
