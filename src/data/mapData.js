/**
 * Map Data — 30×25 tile town
 * Tile IDs match spriteGenerator.js TILE_IDS
 * Tall grass tiles have zone tags for encounter pools
 */

// Tile constants (must match TILE_IDS in spriteGenerator)
const G = 0;   // GRASS
const P = 1;   // PATH
const R = 2;   // ROAD
const W = 3;   // WATER
const TT = 4;  // TREE_TOP
const TB = 5;  // TREE_BOTTOM
const RL = 6;  // HOUSE_ROOF_L (red)
const RR = 7;  // HOUSE_ROOF_R (red)
const HW = 8;  // HOUSE_WALL
const HWW = 9; // HOUSE_WALL_WINDOW
const HD = 10; // HOUSE_DOOR
const PR = 11; // PC_ROOF
const PW = 12; // PC_WALL
const PD = 13; // PC_DOOR
const CT = 14; // CAVE_TOP
const CE = 15; // CAVE_ENTRANCE
const FE = 16; // FENCE
const SN = 17; // SIGN
const FL = 18; // FLOWERS
const TG = 19; // TALL_GRASS
const LE = 20; // LEDGE
const BL = 21; // HOUSE_ROOF_L_BLUE
const BR = 22; // HOUSE_ROOF_R_BLUE
const GL = 23; // HOUSE_ROOF_L_GREEN
const GR = 24; // HOUSE_ROOF_R_GREEN

export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 25;

// prettier-ignore
export const MAP_DATA = [
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
    TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, // 0
    TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, TB, // 1
    TT, TT, G, G, G, G, G, G, TG, TG, G, G, G, G, G, G, G, G, TG, TG, G, G, G, G, G, G, G, G, TT, TT, // 2
    TB, TB, G, RL, RR, G, G, G, TG, TG, P, P, P, P, P, G, BL, BR, G, TG, TG, G, G, CT, CT, CT, G, G, TB, TB, // 3
    TT, G, G, HWW, HW, G, SN, G, G, G, P, G, G, G, P, G, HWW, HW, G, G, TG, G, G, CE, CT, CT, G, G, G, TT, // 4
    TB, G, G, HW, HD, G, G, G, G, G, P, G, FL, G, P, G, HW, HD, G, G, G, G, G, G, G, G, G, G, G, TB, // 5
    G, G, G, G, P, P, P, P, P, P, P, G, G, G, P, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G,  // 6
    G, FE, FE, FE, P, G, G, G, G, FL, G, G, G, G, G, G, G, G, FL, G, G, G, G, G, P, FE, FE, FE, G, G,  // 7
    G, G, G, G, P, G, TG, TG, TG, G, G, G, G, G, G, G, G, G, G, TG, TG, TG, G, G, P, G, G, G, G, G,  // 8
    G, G, TG, TG, P, G, TG, TG, TG, G, G, PR, PR, PR, PR, G, G, G, G, TG, TG, TG, G, G, P, TG, TG, G, G, G,  // 9
    G, G, TG, TG, P, G, G, TG, G, G, G, PW, PW, PW, PD, G, G, G, G, G, TG, G, G, G, P, TG, TG, G, G, G,  // 10
    G, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G,  // 11
    FE, FE, FE, G, G, G, G, G, FL, G, G, G, G, G, G, G, G, FL, G, G, G, G, G, G, G, G, FE, FE, FE, FE,  // 12
    G, G, G, G, G, TG, TG, G, G, G, G, GL, GR, G, G, G, G, G, G, G, G, TG, TG, G, G, G, G, G, G, G,  // 13
    G, G, G, G, G, TG, TG, G, G, P, P, HWW, HW, P, P, G, G, G, G, G, G, TG, TG, G, G, G, G, G, G, G,  // 14
    G, TG, TG, G, G, G, G, G, G, P, G, HW, HD, G, P, G, G, G, G, G, G, G, G, G, G, TG, TG, G, G, G,  // 15
    G, TG, TG, G, G, G, G, G, P, P, P, P, P, P, P, P, P, G, G, G, G, G, G, G, G, TG, TG, G, G, G,  // 16
    G, G, G, G, FE, FE, G, G, P, G, G, G, G, G, G, G, P, G, G, FE, FE, G, G, G, G, G, G, G, G, G,  // 17
    G, G, G, G, G, G, G, G, P, G, G, W, W, W, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G,  // 18
    G, G, FL, G, G, G, G, G, P, G, W, W, W, W, W, G, P, G, G, G, G, G, G, FL, G, G, G, G, G, G,  // 19
    G, G, G, G, TG, TG, G, G, P, G, W, W, W, W, W, G, P, G, G, TG, TG, G, G, G, G, G, G, G, G, G,  // 20
    LE, LE, LE, LE, TG, TG, G, G, P, P, G, W, W, W, G, P, P, G, G, TG, TG, LE, LE, LE, LE, LE, LE, LE, LE, LE, // 21
    TT, TT, G, G, G, G, G, G, G, P, P, P, P, P, P, P, G, G, G, G, G, G, G, TT, TT, TT, TT, TT, TT, TT, // 22
    TB, TB, G, G, G, G, G, FL, G, G, G, G, G, G, G, G, G, FL, G, G, G, G, G, TB, TB, TB, TB, TB, TB, TB, // 23
    TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, TT, // 24
];

// Solid (impassable) tiles
export const SOLID_TILES = new Set([
    TT, TB, // Trees
    HW, HWW, // Walls
    PW, // PC wall
    CT, // Cave rock
    FE, // Fence
    W,  // Water
    LE, // Ledge
]);

/**
 * Zone data — each zone is a door/entry leading to a screen.
 * doorX/doorY = tile the player stands on to enter.
 */
export const ZONES = [
    {
        id: 'skills',
        screen: 'skills',
        label: 'SKILL DOJO',
        doorX: 4,
        doorY: 5,
        dialog: ['Welcome to the SKILL DOJO!', 'HEYTT\'s abilities are displayed here.'],
    },
    {
        id: 'projects',
        screen: 'projects',
        label: 'PROJECT LAB',
        doorX: 17,
        doorY: 5,
        dialog: ['Entering PROJECT LAB...', 'HEYTT\'s creations await inside.'],
    },
    {
        id: 'experience',
        screen: 'experience',
        label: 'CAREER CAVE',
        doorX: 23,
        doorY: 4,
        dialog: ['The CAREER CAVE...', 'HEYTT\'s journey is inscribed on the walls.'],
    },
    {
        id: 'about',
        screen: 'about',
        label: 'HEYTT\'S HOME',
        doorX: 12,
        doorY: 15,
        dialog: ['This is HEYTT\'s house.', 'Come on in!'],
    },
    {
        id: 'contact',
        screen: 'contact',
        label: 'POKE CENTER',
        doorX: 14,
        doorY: 10,
        dialog: ['Welcome to the POKEMON CENTER!', 'We\'ll take care of your messages.'],
    },
];

/**
 * Tall grass zone mapping.
 * Defines which encounter pool zone each tall grass area belongs to.
 * Format: { x, y } → zone string
 * For simplicity we use rectangular regions.
 */
export const GRASS_ZONES = [
    // Left-side grass (near skill house) → 'skills'
    { x1: 1, y1: 1, x2: 10, y2: 10, zone: 'skills' },
    // Center grass → 'facts'
    { x1: 5, y1: 11, x2: 22, y2: 17, zone: 'facts' },
    // Right-side grass → 'skills'
    { x1: 18, y1: 1, x2: 28, y2: 10, zone: 'skills' },
    // Bottom grass near cave → 'achievements'
    { x1: 1, y1: 18, x2: 28, y2: 23, zone: 'achievements' },
];

export function getGrassZone(x, y) {
    for (const gz of GRASS_ZONES) {
        if (x >= gz.x1 && x <= gz.x2 && y >= gz.y1 && y <= gz.y2) return gz.zone;
    }
    return 'facts'; // default
}

/**
 * NPCs — witty and quirky, praising HEYTT.
 */
export const NPCS = [
    {
        id: 'npc_fan',
        x: 7,
        y: 7,
        variant: 0,
        dialog: [
            'Oh my GOD you\'re standing next\nto HEYTT\'s pixels right now!',
            'He built a quantum password\ngenerator on IBM\'s ACTUAL\nquantum computer.',
            'Meanwhile I still use\n\"password123\" for everything.',
            'He\'s operating on a different\nplane of existence. Literally.',
        ],
    },
    {
        id: 'npc_dev',
        x: 15,
        y: 7,
        variant: 1,
        dialog: [
            'I once tried to code-review\nHEYTT\'s pull request.',
            'It was so clean, my linter\nstarted complimenting ME.',
            'His code has better structure\nthan my life decisions.',
            'Legend says he deploys on\nFridays and nothing breaks.',
        ],
    },
    {
        id: 'npc_prof',
        x: 11,
        y: 14,
        variant: 2,
        dialog: [
            'Fun fact: HEYTT published a\nresearch paper BEFORE\ngraduating.',
            'CRC Press. Taylor & Francis.\nThe big leagues.',
            'I\'ve been \"almost done\" with\nmy first draft for 3 years.',
            'At this rate he\'ll have a\nNobel Prize before I finish\nmy abstract.',
        ],
    },
    {
        id: 'npc_rover',
        x: 22,
        y: 5,
        variant: 3,
        dialog: [
            'Team Kosmos — 9th place at\ntheir DEBUT IRC attempt!',
            'Emerging Team of the Year!\nCo-founded from absolute zero.',
            'He builds Mars rovers for fun.\nI can barely assemble IKEA\nfurniture.',
            'The rover actually drives.\nMy Roomba gets stuck on\ncarpet.',
        ],
    },
    {
        id: 'npc_intern',
        x: 4,
        y: 8,
        variant: 4,
        dialog: [
            'HEYTT shipped THREE production\nwebsites in ONE summer.',
            'While the rest of us were\nstill configuring our .env\nfiles.',
            'He cut load times by 25%.\nMy website loads so slow,\nusers age visibly.',
            'Absolute menace. In the best\nway possible.',
        ],
    },
    {
        id: 'npc_space',
        x: 20,
        y: 13,
        variant: 0,
        dialog: [
            'HEYTT interned at STAR doing\nLITERAL rocket science.',
            'Hohmann transfer orbits.\nGMAT simulations.\nThe whole orbital buffet.',
            'I struggle to parallel park\nand this man is calculating\nplanetary trajectories.',
            'He reaches for the stars.\nExcept he actually does the\nmath to get there.',
        ],
    },
    {
        id: 'npc_drone',
        x: 8,
        y: 17,
        variant: 1,
        dialog: [
            '3rd place at the International\nSpace Drone Challenge!',
            'AUTONOMOUS aerial robotics.\nAt an INTERNATIONAL stage.',
            'HEYTT doesn\'t just write code.\nHe makes things FLY.',
            'Some people dream big.\nHEYTT deploys big.\nAt 30,000 feet.',
        ],
    },
    {
        id: 'npc_ocr',
        x: 15,
        y: 17,
        variant: 2,
        dialog: [
            'HEYTT trained a Hindi OCR model\nfor FIFTY-SIX THOUSAND\niterations.',
            '56,000! My GPU started crying\nat 100 epochs.',
            'The model reads Hindi offline.\nMy model can barely read\nEnglish WITH internet.',
            'This man has more patience\nthan a Buddhist monk\nwith fiber optic WiFi.',
        ],
    },
    {
        id: 'npc_sign1',
        x: 6,
        y: 4,
        variant: 3,
        dialog: [
            'You know this ENTIRE town was\nbuilt in React and Canvas?',
            'Every pixel. Every sprite.\nEvery blade of grass.\nProgrammatically generated.',
            'HEYTT is basically a human GPU\nwith entrepreneurial ambitions.',
            'I asked ChatGPT to center a div\nand it told me to ask HEYTT.',
        ],
    },
];

/**
 * Sign data — interactive signs on the map.
 */
export const SIGNS = [
    { x: 6, y: 4, text: ['SKILL DOJO →', 'Master your craft inside.'] },
    { x: 12, y: 11, text: ['HEYTT TOWN', 'Pop. 1 developer.', 'Est. 2022.'] },
];

export const PLAYER_START = { x: 8, y: 14 };
