/**
 * Pokemon FireRed-authentic tile & sprite generator
 * All tiles 16x16, all character sprites 16x20
 * Drawn pixel-by-pixel on Canvas for maximum authenticity
 */

const TILE_SIZE = 16;

// ============ PALETTES ============
const C = {
    // Grass — rich GBA green
    g1: '#90D860', g2: '#78C850', g3: '#60A840', g4: '#489030', g5: '#387828',
    ga: '#A8E878',
    // Tall grass  
    tg1: '#58A830', tg2: '#408820', tg3: '#306818', tg4: '#68B838',
    // Path / Dirt
    p1: '#E0C878', p2: '#C8B060', p3: '#B09840', p4: '#988028', p5: '#D8C068',
    // Road (brick)
    r1: '#E8D0A0', r2: '#D8C090', r3: '#C8B080', r4: '#B8A070',
    // Trees
    tl1: '#68B838', tl2: '#50A028', tl3: '#408818', tl4: '#307010', tl5: '#286008',
    tt1: '#A07038', tt2: '#885828', tt3: '#704820',
    // Water
    w1: '#80C8F8', w2: '#60A8E0', w3: '#4890C8', w4: '#3878B0', w5: '#98D8F8',
    // Building walls
    wl: '#F0EDE0', wm: '#D8D4C8', wd: '#B8B4A8', we: '#A0A098',
    // Windows
    wb: '#88C0F8', wbd: '#5890C8', wbr: '#A8D8F8',
    // Roofs
    rr: '#E04830', rrd: '#C03828', rrl: '#F06848',
    rb: '#5898F8', rbd: '#4070C0', rbl: '#78B0F8',
    rgr: '#48B878', rgd: '#389060', rgl: '#60D090',
    // Doors
    db: '#A06020', dbd: '#784818', dbl: '#C08030',
    // Pokemon Center  
    pcr: '#F06060', pcrd: '#C04040', pcrl: '#F88080',
    // Cave
    cr1: '#A89070', cr2: '#887058', cr3: '#685040', cr4: '#584030', cr5: '#B8A080',
    cen: '#181018',
    // Fence
    fl: '#E8D098', fd: '#C0A868', fs: '#D0B878',
    // Sign
    sw: '#C09050', swd: '#986830', sf: '#F0E8D0',
    // Flowers
    fr: '#F85858', fy: '#F8D030', fw: '#F8F8F8', fp: '#F890B8',
    // Skin tones
    sk: '#F8B878', skd: '#E0A060', skl: '#F8C898',
    // Dark
    bk: '#181818', wt: '#F8F8F8',
    // UI
    hp: '#58C848', hpy: '#F8D030', hpr: '#F85830',
};

function createCanvas(w = TILE_SIZE, h = TILE_SIZE) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
}

function px(ctx, x, y, c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

// Dithering helper: checker pattern
function dither(ctx, x, y, w, h, c1, c2) {
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            px(ctx, x + dx, y + dy, (dx + dy) % 2 === 0 ? c1 : c2);
        }
    }
}

// ============ TILE DRAWING FUNCTIONS ============

function drawGrass(ctx) {
    rect(ctx, 0, 0, 16, 16, C.g2);
    // Varied pixel texture
    const pattern = [
        [2, 1, C.g1], [5, 3, C.ga], [9, 2, C.g1], [13, 1, C.g3], [1, 5, C.g3], [7, 6, C.g1],
        [11, 5, C.ga], [3, 8, C.g1], [14, 7, C.g3], [6, 10, C.g3], [10, 9, C.g1], [2, 12, C.ga],
        [8, 11, C.g3], [12, 12, C.g1], [4, 14, C.g3], [14, 13, C.ga], [0, 7, C.g4], [9, 14, C.g1],
        [7, 0, C.g3], [15, 9, C.g1], [1, 10, C.g1], [13, 4, C.g1], [6, 13, C.ga], [11, 1, C.g4],
    ];
    pattern.forEach(([x, y, c]) => px(ctx, x, y, c));
    // Subtle dark edge pixels
    px(ctx, 0, 15, C.g4); px(ctx, 15, 15, C.g4);
}

function drawTallGrass(ctx) {
    rect(ctx, 0, 0, 16, 16, C.tg1);
    // Blade pattern — thick distinct blades like FireRed
    const blades = [
        // Left blade cluster
        [1, 3], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
        // Center-left
        [5, 4], [6, 3], [6, 4], [6, 5], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],
        // Center-right
        [9, 3], [10, 2], [10, 3], [10, 4], [10, 5], [11, 1], [11, 2], [11, 3], [11, 4],
        // Right blade
        [13, 4], [14, 3], [14, 4], [14, 5], [13, 2], [13, 3],
    ];
    blades.forEach(([x, y]) => px(ctx, x, y, C.tg2));
    // Lighter tips
    const tips = [[3, 0], [7, 1], [11, 0], [14, 2], [2, 1], [6, 2], [10, 1]];
    tips.forEach(([x, y]) => px(ctx, x, y, C.tg4));
    // Base ground  
    rect(ctx, 0, 8, 16, 8, C.tg1);
    dither(ctx, 0, 8, 16, 2, C.tg1, C.tg2);
    // Lower blade roots
    const roots = [[1, 8], [3, 7], [5, 9], [7, 8], [9, 7], [11, 9], [13, 8], [14, 7]];
    roots.forEach(([x, y]) => px(ctx, x, y, C.tg3));
}

function drawPath(ctx) {
    rect(ctx, 0, 0, 16, 16, C.p2);
    // Rich dirt texture
    const t = [
        [1, 1, C.p1], [4, 2, C.p5], [8, 1, C.p1], [12, 3, C.p5], [2, 5, C.p3], [6, 4, C.p1],
        [10, 6, C.p5], [14, 5, C.p3], [3, 8, C.p1], [7, 9, C.p5], [11, 8, C.p1], [0, 10, C.p3],
        [5, 11, C.p5], [9, 12, C.p1], [13, 10, C.p3], [2, 13, C.p1], [7, 14, C.p5], [11, 14, C.p3],
        [15, 12, C.p1], [4, 7, C.p3], [14, 1, C.p1], [0, 3, C.p5], [8, 13, C.p3],
    ];
    t.forEach(([x, y, c]) => px(ctx, x, y, c));
    // Occasional pebble
    px(ctx, 3, 3, C.p4); px(ctx, 10, 10, C.p4); px(ctx, 13, 7, C.p4);
}

function drawRoad(ctx) {
    rect(ctx, 0, 0, 16, 16, C.r1);
    // Brick grid pattern — authentic FireRed sidewalk
    for (let y = 0; y < 16; y += 4) {
        rect(ctx, 0, y, 16, 1, C.r3);
        const off = (y / 4) % 2 === 0 ? 0 : 4;
        for (let x = off; x < 16; x += 8) {
            rect(ctx, x, y, 1, 4, C.r3);
        }
    }
    // Highlight
    for (let y = 1; y < 16; y += 4) {
        rect(ctx, 0, y, 16, 1, C.r2);
    }
}

function drawWater(ctx, frame = 0) {
    rect(ctx, 0, 0, 16, 16, C.w2);
    const off = frame * 2;
    // Wave highlights
    for (let y = 0; y < 16; y += 4) {
        for (let x = 0; x < 16; x += 5) {
            const wx = (x + off + y) % 16;
            rect(ctx, wx, y, 3, 1, C.w1);
            px(ctx, wx, y, C.w5);
            rect(ctx, (wx + 2) % 16, y + 2, 2, 1, C.w3);
        }
    }
    // Deeper water pixels
    const deep = [[3, 3], [8, 7], [12, 11], [1, 13], [6, 1], [14, 5], [10, 14], [5, 9]];
    deep.forEach(([x, y]) => px(ctx, x, y, C.w4));
    // Shimmer  
    const shimmer = [[1, 0], [7, 4], [13, 8], [4, 12], [10, 2], [0, 6]];
    shimmer.forEach(([x, y]) => px(ctx, x, y, C.w5));
}

function drawTreeTop(ctx) {
    rect(ctx, 0, 0, 16, 16, C.g2); // bg
    // Round canopy shape — 3 shade layers
    // Darkest core
    rect(ctx, 3, 4, 10, 10, C.tl3);
    rect(ctx, 5, 3, 6, 12, C.tl3);
    rect(ctx, 2, 5, 12, 8, C.tl3);
    // Mid layer
    rect(ctx, 3, 3, 10, 10, C.tl2);
    rect(ctx, 4, 2, 8, 12, C.tl2);
    rect(ctx, 2, 4, 12, 8, C.tl2);
    // Highlight (top-left light source)
    rect(ctx, 4, 2, 6, 4, C.tl1);
    rect(ctx, 3, 3, 4, 3, C.tl1);
    rect(ctx, 2, 4, 3, 3, C.tl1);
    // Bright spots
    px(ctx, 5, 3, C.ga); px(ctx, 6, 2, C.ga); px(ctx, 4, 4, C.ga);
    // Dark shadow (bottom-right)
    rect(ctx, 8, 11, 5, 3, C.tl4);
    rect(ctx, 10, 10, 4, 4, C.tl4);
    rect(ctx, 12, 9, 2, 3, C.tl5);
    // Leaf texture dots
    const leafDots = [[5, 6, C.tl1], [8, 5, C.tl3], [7, 8, C.tl1], [11, 7, C.tl4], [4, 9, C.tl1], [9, 10, C.tl4]];
    leafDots.forEach(([x, y, c]) => px(ctx, x, y, c));
}

function drawTreeBottom(ctx) {
    rect(ctx, 0, 0, 16, 16, C.g2); // bg
    // Canopy bottom   
    rect(ctx, 2, 0, 12, 6, C.tl3);
    rect(ctx, 3, 0, 10, 8, C.tl3);
    rect(ctx, 4, 0, 8, 9, C.tl2);
    // Shadow on canopy bottom
    rect(ctx, 2, 0, 12, 3, C.tl4);
    rect(ctx, 3, 0, 10, 2, C.tl5);
    // Leaf detail
    px(ctx, 5, 4, C.tl1); px(ctx, 8, 3, C.tl1); px(ctx, 11, 5, C.tl4);
    // Trunk
    rect(ctx, 6, 7, 4, 9, C.tt1);
    rect(ctx, 7, 7, 2, 9, C.tt2);
    // Trunk highlight  
    px(ctx, 6, 8, C.tt1); px(ctx, 6, 10, C.tt1);
    // Trunk bark
    px(ctx, 8, 9, C.tt3); px(ctx, 7, 12, C.tt3); px(ctx, 8, 14, C.tt3);
    // Ground shadow
    rect(ctx, 4, 14, 8, 2, C.g4);
    dither(ctx, 3, 14, 1, 2, C.g2, C.g4);
    dither(ctx, 12, 14, 1, 2, C.g2, C.g4);
    // Roots
    px(ctx, 5, 15, C.tt2); px(ctx, 10, 15, C.tt2);
}

function drawRoof(ctx, light, mid, dark) {
    rect(ctx, 0, 0, 16, 16, C.g2); // bg
    // Roof shape  
    rect(ctx, 0, 3, 16, 13, mid);
    // Ridge cap
    rect(ctx, 0, 3, 16, 2, dark);
    rect(ctx, 0, 3, 16, 1, light); // top highlight
    // Tile rows  
    for (let y = 5; y < 16; y += 3) {
        rect(ctx, 0, y, 16, 1, dark);
        // Offset tile edges
        const off = ((y - 5) / 3) % 2 === 0 ? 4 : 0;
        for (let x = off; x < 16; x += 8) {
            px(ctx, x, y + 1, dark);
        }
    }
    // Highlight along top
    for (let x = 0; x < 16; x += 3) px(ctx, x, 4, light);
}

function drawHouseWall(ctx) {
    rect(ctx, 0, 0, 16, 16, C.wl);
    // Brick pattern  
    for (let y = 0; y < 16; y += 4) {
        rect(ctx, 0, y, 16, 1, C.wm);
        const off = (y / 4) % 2 === 0 ? 0 : 4;
        for (let x = off; x < 16; x += 8) {
            rect(ctx, x, y, 1, 4, C.wm);
        }
    }
    // Subtle texture
    px(ctx, 2, 2, C.wd); px(ctx, 10, 6, C.wd); px(ctx, 5, 10, C.wd); px(ctx, 13, 14, C.wd);
}

function drawHouseWallWindow(ctx) {
    drawHouseWall(ctx);
    // Window frame
    rect(ctx, 3, 2, 10, 10, C.wd);
    // Glass
    rect(ctx, 4, 3, 8, 8, C.wb);
    // Reflection
    rect(ctx, 4, 3, 3, 3, C.wbr);
    px(ctx, 5, 4, C.wt);
    // Crossbar
    rect(ctx, 7, 3, 2, 8, C.wm);
    rect(ctx, 4, 6, 8, 2, C.wm);
    // Sill
    rect(ctx, 2, 12, 12, 2, C.we);
    rect(ctx, 2, 12, 12, 1, C.wd);
}

function drawDoor(ctx) {
    drawHouseWall(ctx);
    // Door frame
    rect(ctx, 3, 1, 10, 15, C.dbd);
    // Door
    rect(ctx, 4, 2, 8, 14, C.db);
    // Panels
    rect(ctx, 5, 3, 6, 4, C.dbl);
    rect(ctx, 5, 3, 6, 1, C.db);
    rect(ctx, 5, 9, 6, 4, C.dbl);
    rect(ctx, 5, 9, 6, 1, C.db);
    // Knob
    rect(ctx, 10, 10, 2, 2, C.wt);
    px(ctx, 11, 11, C.wm);
    // Welcome mat
    rect(ctx, 3, 14, 10, 2, C.p2);
    dither(ctx, 3, 14, 10, 1, C.p2, C.p3);
}

function drawPCRoof(ctx) {
    rect(ctx, 0, 0, 16, 16, C.pcr);
    rect(ctx, 0, 0, 16, 2, C.pcrd);
    rect(ctx, 0, 1, 16, 1, C.pcrl);
    for (let y = 3; y < 16; y += 3) {
        rect(ctx, 0, y, 16, 1, C.pcrd);
        const off = ((y - 3) / 3) % 2 === 0 ? 0 : 4;
        for (let x = off; x < 16; x += 8) px(ctx, x, y + 1, C.pcrd);
    }
    for (let x = 1; x < 16; x += 4) px(ctx, x, 2, C.pcrl);
}

function drawPCWall(ctx) {
    rect(ctx, 0, 0, 16, 16, C.wl);
    // Brick
    for (let y = 0; y < 16; y += 4) {
        rect(ctx, 0, y, 16, 1, C.wm);
    }
    // P symbol (red cross/P)
    rect(ctx, 5, 2, 6, 12, C.pcr);
    rect(ctx, 6, 3, 4, 4, C.wt);
    rect(ctx, 6, 8, 2, 5, C.wt);
    // Cross highlight
    px(ctx, 6, 3, C.pcrl);
}

function drawPCDoor(ctx) {
    rect(ctx, 0, 0, 16, 16, C.wl);
    // Auto door
    rect(ctx, 2, 0, 12, 16, C.wb);
    // Center seam
    rect(ctx, 7, 0, 2, 16, C.wbd);
    // Frame
    rect(ctx, 1, 0, 1, 16, C.we);
    rect(ctx, 14, 0, 1, 16, C.we);
    // Reflection
    rect(ctx, 3, 2, 3, 4, C.wbr);
    px(ctx, 4, 3, C.wt);
    // Mat
    rect(ctx, 2, 14, 12, 2, C.pcr);
    dither(ctx, 2, 14, 12, 1, C.pcr, C.pcrd);
}

function drawCaveTop(ctx) {
    rect(ctx, 0, 0, 16, 16, C.cr2);
    // Rocky texture with depth
    const tex = [
        [1, 1, C.cr5], [4, 2, C.cr1], [8, 1, C.cr5], [12, 3, C.cr1], [2, 5, C.cr3], [7, 4, C.cr5],
        [10, 6, C.cr1], [14, 5, C.cr3], [3, 8, C.cr5], [11, 8, C.cr3], [6, 10, C.cr1], [13, 10, C.cr5],
        [2, 12, C.cr3], [8, 13, C.cr1], [14, 12, C.cr3], [5, 14, C.cr5], [10, 14, C.cr3],
        [0, 3, C.cr4], [15, 7, C.cr4], [1, 11, C.cr4], [9, 3, C.cr4],
    ];
    tex.forEach(([x, y, c]) => px(ctx, x, y, c));
    // Bottom shadow edge
    rect(ctx, 0, 14, 16, 2, C.cr3);
    rect(ctx, 0, 15, 16, 1, C.cr4);
    // Cracked lines
    rect(ctx, 3, 6, 4, 1, C.cr4); rect(ctx, 9, 9, 5, 1, C.cr4);
}

function drawCaveEntrance(ctx) {
    rect(ctx, 0, 0, 16, 16, C.cr2);
    // Stone arch frame
    rect(ctx, 0, 0, 3, 16, C.cr2); rect(ctx, 13, 0, 3, 16, C.cr2);
    // Dark opening
    rect(ctx, 3, 2, 10, 14, C.cen);
    rect(ctx, 4, 3, 8, 13, '#0C080C');
    // Arch top
    rect(ctx, 3, 0, 10, 3, C.cr3);
    rect(ctx, 4, 0, 8, 2, C.cr4);
    // Stone detail on frame
    px(ctx, 1, 3, C.cr5); px(ctx, 0, 7, C.cr1); px(ctx, 1, 11, C.cr5);
    px(ctx, 14, 4, C.cr5); px(ctx, 15, 8, C.cr1); px(ctx, 14, 12, C.cr5);
    // Depth gradient inside
    rect(ctx, 3, 2, 1, 14, C.cr4); rect(ctx, 12, 2, 1, 14, C.cr4);
    // Stalagmites hint
    px(ctx, 5, 14, C.cr3); px(ctx, 7, 15, C.cr3); px(ctx, 10, 14, C.cr3);
}

function drawFence(ctx) {
    rect(ctx, 0, 0, 16, 16, C.g2);
    // Posts
    rect(ctx, 1, 3, 3, 13, C.fl);
    rect(ctx, 12, 3, 3, 13, C.fl);
    // Post shadows
    rect(ctx, 3, 3, 1, 13, C.fd); rect(ctx, 14, 3, 1, 13, C.fd);
    // Post caps
    rect(ctx, 1, 3, 3, 1, C.fd); rect(ctx, 12, 3, 3, 1, C.fd);
    // Horizontal rails
    rect(ctx, 0, 5, 16, 3, C.fl);
    rect(ctx, 0, 10, 16, 3, C.fl);
    // Rail shadows
    rect(ctx, 0, 8, 16, 1, C.fd); rect(ctx, 0, 13, 16, 1, C.fd);
    // Rail highlights
    rect(ctx, 0, 5, 16, 1, C.fs);
    rect(ctx, 0, 10, 16, 1, C.fs);
    // Nail dots
    px(ctx, 2, 6, C.fd); px(ctx, 13, 6, C.fd);
    px(ctx, 2, 11, C.fd); px(ctx, 13, 11, C.fd);
}

function drawSign(ctx) {
    rect(ctx, 0, 0, 16, 16, C.g2);
    // Post
    rect(ctx, 7, 9, 2, 7, C.swd);
    px(ctx, 7, 9, C.sw);
    // Board
    rect(ctx, 2, 1, 12, 9, C.sw);
    rect(ctx, 3, 2, 10, 7, C.sf);
    // Border
    rect(ctx, 2, 1, 12, 1, C.swd); rect(ctx, 2, 9, 12, 1, C.swd);
    rect(ctx, 2, 1, 1, 9, C.swd); rect(ctx, 13, 1, 1, 9, C.swd);
    // Text lines
    rect(ctx, 4, 3, 8, 1, C.swd);
    rect(ctx, 4, 5, 6, 1, C.swd);
    rect(ctx, 4, 7, 7, 1, C.swd);
    // Shadow
    rect(ctx, 5, 15, 6, 1, C.g4);
}

function drawFlowers(ctx) {
    drawGrass(ctx);
    // Red flower (4 petals)
    px(ctx, 3, 4, C.fr); px(ctx, 2, 5, C.fr); px(ctx, 4, 5, C.fr);
    px(ctx, 3, 6, C.fr); px(ctx, 3, 5, C.fy);
    // White flower
    px(ctx, 10, 8, C.fw); px(ctx, 9, 9, C.fw); px(ctx, 11, 9, C.fw);
    px(ctx, 10, 10, C.fw); px(ctx, 10, 9, C.fy);
    // Pink flower
    px(ctx, 6, 12, C.fp); px(ctx, 5, 13, C.fp); px(ctx, 7, 13, C.fp);
    px(ctx, 6, 14, C.fp); px(ctx, 6, 13, C.fy);
    // Yellow flower
    px(ctx, 13, 2, C.fy); px(ctx, 12, 3, C.fy); px(ctx, 14, 3, C.fy);
    px(ctx, 13, 4, C.fy); px(ctx, 13, 3, C.fr);
    // Stems
    px(ctx, 3, 7, C.g4); px(ctx, 10, 11, C.g4); px(ctx, 6, 15, C.g4); px(ctx, 13, 5, C.g4);
}

function drawLedge(ctx) {
    rect(ctx, 0, 0, 16, 11, C.g2);
    // Grass on top
    const gd = [[2, 1, C.g1], [6, 0, C.ga], [10, 2, C.g3], [14, 1, C.g1]];
    gd.forEach(([x, y, c]) => px(ctx, x, y, c));
    // Edge highlight
    rect(ctx, 0, 10, 16, 1, C.ga);
    // Cliff face
    rect(ctx, 0, 11, 16, 5, C.g4);
    // Darker at bottom
    rect(ctx, 0, 14, 16, 2, C.g5);
    // Texture
    px(ctx, 3, 12, C.g3); px(ctx, 8, 13, C.g3); px(ctx, 12, 12, C.g3);
}

// ============ SPRITE GENERATORS ============

function generatePlayerSpritesheet() {
    const fw = 16, fh = 20, cols = 3, rows = 4;
    const canvas = createCanvas(fw * cols, fh * rows);
    const ctx = canvas.getContext('2d');
    const dirs = ['down', 'up', 'left', 'right'];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            drawPlayer(ctx, c * fw, r * fh, dirs[r], c);
    return canvas;
}

function drawPlayer(ctx, ox, oy, dir, frame) {
    const hat = '#E03030', hatD = '#B02020', hatL = '#F04848';
    const hair = '#383838', hairL = '#505050';
    const shirt = '#4888F8', shirtD = '#3060C0', shirtL = '#68A8F8';
    const pants = '#3058A8', pantsD = '#204080';
    const shoe = '#C04040', shoeD = '#903030';
    const step = frame === 1 ? -1 : frame === 2 ? 1 : 0;

    if (dir === 'down') {
        // Hat
        rect(ctx, ox + 4, oy + 0, 8, 4, hat); rect(ctx, ox + 3, oy + 1, 10, 2, hat);
        rect(ctx, ox + 4, oy + 3, 8, 1, hatD); px(ctx, ox + 5, oy + 0, hatL); px(ctx, ox + 6, oy + 0, hatL);
        // Hair
        rect(ctx, ox + 4, oy + 4, 8, 2, hair); px(ctx, ox + 3, oy + 4, hair); px(ctx, ox + 12, oy + 4, hair);
        // Face
        rect(ctx, ox + 4, oy + 5, 8, 4, C.sk);
        px(ctx, ox + 4, oy + 5, C.skl); px(ctx, ox + 5, oy + 5, C.skl);
        // Eyes (2x1 dark)
        rect(ctx, ox + 5, oy + 6, 2, 1, C.bk); rect(ctx, ox + 9, oy + 6, 2, 1, C.bk);
        // Eye highlight
        px(ctx, ox + 5, oy + 6, '#F8F8F8'); px(ctx, ox + 9, oy + 6, '#F8F8F8');
        // Mouth
        px(ctx, ox + 7, oy + 8, '#D08070'); px(ctx, ox + 8, oy + 8, '#D08070');
        // Shirt
        rect(ctx, ox + 3, oy + 9, 10, 5, shirt); rect(ctx, ox + 5, oy + 9, 6, 1, shirtD);
        rect(ctx, ox + 7, oy + 10, 2, 3, C.wt); // stripe
        // Arms
        rect(ctx, ox + 2, oy + 10, 2, 4, shirt); rect(ctx, ox + 12, oy + 10, 2, 4, shirt);
        px(ctx, ox + 2, oy + 14, C.sk); px(ctx, ox + 13, oy + 14, C.sk);
        // Arm highlight
        px(ctx, ox + 2, oy + 10, shirtL); px(ctx, ox + 12, oy + 10, shirtL);
        // Pants
        rect(ctx, ox + 4, oy + 14, 8, 3, pants); px(ctx, ox + 7, oy + 14, pantsD); px(ctx, ox + 8, oy + 14, pantsD);
        // Shoes
        rect(ctx, ox + 4 + step, oy + 17, 3, 3, shoe); rect(ctx, ox + 9 - step, oy + 17, 3, 3, shoe);
        px(ctx, ox + 4 + step, oy + 17, shoeD); px(ctx, ox + 9 - step, oy + 17, shoeD);
    } else if (dir === 'up') {
        rect(ctx, ox + 4, oy + 0, 8, 5, hat); rect(ctx, ox + 3, oy + 1, 10, 3, hat);
        rect(ctx, ox + 5, oy + 0, 6, 1, hatD); px(ctx, ox + 6, oy + 0, hatL);
        rect(ctx, ox + 4, oy + 4, 8, 3, hair); rect(ctx, ox + 3, oy + 5, 10, 2, hair);
        px(ctx, ox + 5, oy + 4, hairL); px(ctx, ox + 8, oy + 4, hairL);
        rect(ctx, ox + 4, oy + 6, 8, 3, hair);
        rect(ctx, ox + 3, oy + 9, 10, 5, shirt); rect(ctx, ox + 6, oy + 9, 4, 5, shirtD);
        rect(ctx, ox + 4, oy + 10, 2, 3, '#88C848'); rect(ctx, ox + 10, oy + 10, 2, 3, '#88C848');
        rect(ctx, ox + 4, oy + 14, 8, 3, pants);
        rect(ctx, ox + 4 + step, oy + 17, 3, 3, shoe); rect(ctx, ox + 9 - step, oy + 17, 3, 3, shoe);
    } else if (dir === 'left') {
        rect(ctx, ox + 3, oy + 0, 8, 4, hat); rect(ctx, ox + 2, oy + 1, 9, 2, hat);
        rect(ctx, ox + 2, oy + 3, 4, 1, hatD); px(ctx, ox + 4, oy + 0, hatL);
        rect(ctx, ox + 4, oy + 4, 7, 2, hair); px(ctx, ox + 3, oy + 4, hair);
        rect(ctx, ox + 3, oy + 5, 7, 4, C.sk);
        px(ctx, ox + 3, oy + 5, C.skl);
        rect(ctx, ox + 4, oy + 6, 2, 1, C.bk); px(ctx, ox + 4, oy + 6, '#F8F8F8');
        rect(ctx, ox + 3, oy + 9, 9, 5, shirt); rect(ctx, ox + 5, oy + 9, 2, 4, C.wt);
        rect(ctx, ox + 2, oy + 10 + step, 2, 4, shirt); px(ctx, ox + 2, oy + 14 + step, C.sk);
        rect(ctx, ox + 4, oy + 14, 7, 3, pants);
        rect(ctx, ox + 4, oy + 17, 3, 3, shoe); rect(ctx, ox + 8, oy + 17, 3, 3, shoe);
    } else { // right
        rect(ctx, ox + 5, oy + 0, 8, 4, hat); rect(ctx, ox + 5, oy + 1, 9, 2, hat);
        rect(ctx, ox + 10, oy + 3, 4, 1, hatD); px(ctx, ox + 9, oy + 0, hatL);
        rect(ctx, ox + 5, oy + 4, 7, 2, hair); px(ctx, ox + 12, oy + 4, hair);
        rect(ctx, ox + 6, oy + 5, 7, 4, C.sk);
        px(ctx, ox + 12, oy + 5, C.skl);
        rect(ctx, ox + 10, oy + 6, 2, 1, C.bk); px(ctx, ox + 11, oy + 6, '#F8F8F8');
        rect(ctx, ox + 4, oy + 9, 9, 5, shirt); rect(ctx, ox + 9, oy + 9, 2, 4, C.wt);
        rect(ctx, ox + 12, oy + 10 + step, 2, 4, shirt); px(ctx, ox + 13, oy + 14 + step, C.sk);
        rect(ctx, ox + 5, oy + 14, 7, 3, pants);
        rect(ctx, ox + 5, oy + 17, 3, 3, shoe); rect(ctx, ox + 9, oy + 17, 3, 3, shoe);
    }
}

// Player back sprite (for battle screen)
function generatePlayerBackSprite() {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    // Hat
    rect(ctx, 8, 0, 16, 8, '#E03030'); rect(ctx, 6, 2, 20, 4, '#E03030');
    rect(ctx, 10, 0, 12, 2, '#B02020'); px(ctx, 12, 1, '#F04848');
    // Hair
    rect(ctx, 8, 6, 16, 6, '#383838'); rect(ctx, 6, 8, 20, 4, '#383838');
    // Shirt
    rect(ctx, 6, 12, 20, 10, '#4888F8'); rect(ctx, 10, 12, 12, 8, '#3060C0');
    // Backpack
    rect(ctx, 7, 14, 4, 6, '#88C848'); rect(ctx, 21, 14, 4, 6, '#88C848');
    // Belt
    rect(ctx, 6, 22, 20, 2, '#3058A8');
    // Arms
    rect(ctx, 3, 14, 4, 8, '#4888F8'); rect(ctx, 25, 14, 4, 8, '#4888F8');
    px(ctx, 4, 22, C.sk); px(ctx, 27, 22, C.sk);
    // Pants
    rect(ctx, 8, 24, 16, 4, '#3058A8');
    // Shoes
    rect(ctx, 8, 28, 6, 4, '#C04040'); rect(ctx, 18, 28, 6, 4, '#C04040');
    return canvas;
}

function generateNPCSpritesheet(variant = 0) {
    const fw = 16, fh = 20;
    const canvas = createCanvas(fw, fh);
    const ctx = canvas.getContext('2d');
    const v = [
        { hat: '#50A878', hatD: '#389060', shirt: '#F89058', shirtD: '#D07038', hair: '#584838' },
        { hat: '#F868B0', hatD: '#D04890', shirt: '#F8F858', shirtD: '#D0D040', hair: '#A06030' },
        { hat: '#5888C0', hatD: '#4068A0', shirt: '#F8F8F8', shirtD: '#D0D0D0', hair: '#282828' },
        { hat: '#F8D030', hatD: '#D0A820', shirt: '#60A840', shirtD: '#488030', hair: '#704830' },
        { hat: '#A850C8', hatD: '#8038A0', shirt: '#F8A850', shirtD: '#D08830', hair: '#181818' },
    ][variant % 5];

    rect(ctx, 4, 0, 8, 4, v.hat); rect(ctx, 3, 1, 10, 2, v.hat);
    rect(ctx, 4, 3, 8, 1, v.hatD); px(ctx, 5, 0, v.hatD);
    rect(ctx, 4, 4, 8, 2, v.hair); px(ctx, 3, 4, v.hair); px(ctx, 12, 4, v.hair);
    rect(ctx, 4, 5, 8, 4, C.sk); px(ctx, 4, 5, C.skl);
    rect(ctx, 5, 6, 2, 1, C.bk); rect(ctx, 9, 6, 2, 1, C.bk);
    px(ctx, 5, 6, '#F8F8F8'); px(ctx, 9, 6, '#F8F8F8');
    px(ctx, 7, 8, '#D08070'); px(ctx, 8, 8, '#D08070');
    rect(ctx, 3, 9, 10, 5, v.shirt); rect(ctx, 5, 9, 6, 1, v.shirtD);
    rect(ctx, 2, 10, 2, 4, v.shirt); rect(ctx, 12, 10, 2, 4, v.shirt);
    px(ctx, 2, 14, C.sk); px(ctx, 13, 14, C.sk);
    rect(ctx, 4, 14, 8, 3, '#3058A8');
    rect(ctx, 4, 17, 3, 3, '#484848'); rect(ctx, 9, 17, 3, 3, '#484848');
    return canvas;
}

function generateProfessorSprite() {
    const fw = 16, fh = 20;
    const canvas = createCanvas(fw, fh);
    const ctx = canvas.getContext('2d');
    rect(ctx, 4, 0, 8, 3, '#A0A0A0'); rect(ctx, 3, 1, 10, 2, '#909090');
    rect(ctx, 4, 3, 8, 2, '#808080'); px(ctx, 5, 1, '#B8B8B8');
    rect(ctx, 4, 4, 8, 5, C.skl);
    px(ctx, 4, 4, C.sk);
    rect(ctx, 5, 5, 2, 1, C.bk); rect(ctx, 9, 5, 2, 1, C.bk);
    px(ctx, 5, 5, '#F8F8F8'); px(ctx, 9, 5, '#F8F8F8');
    px(ctx, 7, 7, '#D08070'); px(ctx, 8, 7, '#D08070');
    rect(ctx, 2, 9, 12, 6, '#F0F0F0'); rect(ctx, 3, 9, 10, 1, '#D8D8D8');
    rect(ctx, 1, 10, 2, 5, '#F0F0F0'); rect(ctx, 13, 10, 2, 5, '#F0F0F0');
    rect(ctx, 6, 10, 4, 4, '#B85830');
    rect(ctx, 4, 15, 8, 2, '#585048');
    rect(ctx, 4, 17, 3, 3, '#383028'); rect(ctx, 9, 17, 3, 3, '#383028');
    return canvas;
}

function generateNurseSprite() {
    const fw = 16, fh = 20;
    const canvas = createCanvas(fw, fh);
    const ctx = canvas.getContext('2d');
    rect(ctx, 3, 0, 10, 4, '#F890B0'); rect(ctx, 4, 0, 8, 1, '#F8A8C0');
    rect(ctx, 5, 0, 6, 2, '#F8F8F8'); px(ctx, 7, 0, '#F06060'); px(ctx, 8, 0, '#F06060');
    rect(ctx, 4, 4, 8, 5, C.skl); px(ctx, 4, 4, C.sk);
    rect(ctx, 5, 5, 2, 1, C.bk); rect(ctx, 9, 5, 2, 1, C.bk);
    px(ctx, 5, 5, '#F8F8F8'); px(ctx, 9, 5, '#F8F8F8');
    px(ctx, 7, 7, '#F86080'); px(ctx, 8, 7, '#F86080');
    rect(ctx, 3, 9, 10, 6, '#F8F8F8');
    rect(ctx, 6, 9, 4, 4, '#F89098'); rect(ctx, 7, 10, 2, 2, '#F06060');
    rect(ctx, 2, 10, 2, 4, '#F8F8F8'); rect(ctx, 12, 10, 2, 4, '#F8F8F8');
    rect(ctx, 3, 14, 10, 3, '#F890B0');
    rect(ctx, 4, 17, 3, 3, '#F8F8F8'); rect(ctx, 9, 17, 3, 3, '#F8F8F8');
    return canvas;
}

// ============ ENCOUNTER ENTITY SPRITES ============

function generateEntitySprite(type) {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    const typeColors = {
        FIRE: ['#F85830', '#E04020', '#F87850', '#F8A070'],
        WATER: ['#6890F0', '#4870C8', '#88B0F8', '#A8C8F8'],
        ELECTRIC: ['#F8D030', '#D0A820', '#F8E060', '#F8F0A0'],
        PSYCHIC: ['#F85888', '#D04068', '#F878A0', '#F8A0C0'],
        GRASS: ['#78C850', '#58A830', '#98E070', '#B0F090'],
        NORMAL: ['#A8A878', '#888860', '#C8C8A0', '#E0E0C0'],
    };
    const c = typeColors[type] || typeColors.NORMAL;
    // Body shape
    rect(ctx, 8, 4, 16, 20, c[0]);
    rect(ctx, 6, 6, 20, 16, c[0]);
    rect(ctx, 10, 2, 12, 24, c[0]);
    // Highlight
    rect(ctx, 8, 4, 8, 8, c[2]);
    rect(ctx, 6, 6, 6, 6, c[2]);
    rect(ctx, 10, 2, 6, 4, c[3]);
    // Shadow
    rect(ctx, 16, 16, 8, 8, c[1]);
    rect(ctx, 20, 12, 6, 12, c[1]);
    // Eyes
    rect(ctx, 10, 10, 4, 4, C.wt);
    rect(ctx, 18, 10, 4, 4, C.wt);
    rect(ctx, 11, 11, 2, 2, C.bk);
    rect(ctx, 19, 11, 2, 2, C.bk);
    // Eye shine
    px(ctx, 11, 11, C.wt);
    px(ctx, 19, 11, C.wt);
    // Mouth
    rect(ctx, 12, 18, 8, 2, c[1]);
    return canvas;
}

// ============ POKEBALL SPRITE ============

function generatePokeballSprite() {
    const canvas = createCanvas(16, 16);
    const ctx = canvas.getContext('2d');
    // Top half (red)
    rect(ctx, 4, 2, 8, 5, '#F83030');
    rect(ctx, 2, 3, 12, 4, '#F83030');
    rect(ctx, 3, 2, 10, 5, '#F83030');
    px(ctx, 5, 2, '#F85050'); px(ctx, 4, 3, '#F85050');
    // Center band
    rect(ctx, 2, 7, 12, 2, C.bk);
    // Button
    rect(ctx, 6, 6, 4, 4, C.wt);
    rect(ctx, 7, 7, 2, 2, C.bk);
    // Bottom half (white)
    rect(ctx, 4, 9, 8, 5, C.wt);
    rect(ctx, 2, 9, 12, 4, C.wt);
    rect(ctx, 3, 9, 10, 5, C.wt);
    px(ctx, 5, 13, '#D0D0D0'); px(ctx, 10, 13, '#D0D0D0');
    // Outline
    const outline = [
        [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1],
        [3, 2], [12, 2], [2, 3], [13, 3], [1, 4], [14, 4], [1, 5], [14, 5], [1, 6], [14, 6],
        [1, 7], [14, 7], [1, 8], [14, 8], [1, 9], [14, 9], [1, 10], [14, 10],
        [2, 11], [13, 11], [3, 12], [12, 12], [4, 13], [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13], [11, 13],
    ];
    outline.forEach(([x, y]) => px(ctx, x, y, C.bk));
    return canvas;
}

// ============ TILESET COMPILATION ============

export const TILE_IDS = {
    GRASS: 0, PATH: 1, ROAD: 2, WATER: 3,
    TREE_TOP: 4, TREE_BOTTOM: 5,
    HOUSE_ROOF_L: 6, HOUSE_ROOF_R: 7,
    HOUSE_WALL: 8, HOUSE_WALL_WIN: 9, HOUSE_DOOR: 10,
    PC_ROOF: 11, PC_WALL: 12, PC_DOOR: 13,
    CAVE_TOP: 14, CAVE_ENTRANCE: 15,
    FENCE: 16, SIGN: 17, FLOWERS: 18, TALL_GRASS: 19, LEDGE: 20,
    HOUSE_ROOF_L_BLUE: 21, HOUSE_ROOF_R_BLUE: 22,
    HOUSE_ROOF_L_GREEN: 23, HOUSE_ROOF_R_GREEN: 24,
};

export function generateTileset() {
    const ids = Object.keys(TILE_IDS);
    const cols = 8, rows = Math.ceil(ids.length / cols);
    const canvas = createCanvas(cols * TILE_SIZE, rows * TILE_SIZE);
    const ctx = canvas.getContext('2d');

    const fns = [
        drawGrass, drawPath, drawRoad, c => drawWater(c, 0),
        drawTreeTop, drawTreeBottom,
        c => drawRoof(c, C.rrl, C.rr, C.rrd), c => drawRoof(c, C.rrl, C.rr, C.rrd),
        drawHouseWall, drawHouseWallWindow, drawDoor,
        drawPCRoof, drawPCWall, drawPCDoor,
        drawCaveTop, drawCaveEntrance,
        drawFence, drawSign, drawFlowers, drawTallGrass, drawLedge,
        c => drawRoof(c, C.rbl, C.rb, C.rbd), c => drawRoof(c, C.rbl, C.rb, C.rbd),
        c => drawRoof(c, C.rgl, C.rgr, C.rgd), c => drawRoof(c, C.rgl, C.rgr, C.rgd),
    ];

    fns.forEach((fn, i) => {
        const tc = createCanvas();
        const tctx = tc.getContext('2d');
        fn(tctx);
        ctx.drawImage(tc, (i % cols) * TILE_SIZE, Math.floor(i / cols) * TILE_SIZE);
    });

    return canvas;
}

export {
    generatePlayerSpritesheet, generatePlayerBackSprite,
    generateNPCSpritesheet, generateProfessorSprite, generateNurseSprite,
    generateEntitySprite, generatePokeballSprite,
    TILE_SIZE,
};
