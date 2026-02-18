import { useEffect, useRef, useState, useCallback } from 'react';
import {
  generateTileset, generatePlayerSpritesheet, generateNPCSpritesheet,
  TILE_SIZE, TILE_IDS,
} from '../engine/spriteGenerator';
import {
  MAP_DATA, MAP_WIDTH, MAP_HEIGHT, SOLID_TILES,
  ZONES, NPCS, SIGNS, PLAYER_START, getGrassZone,
} from '../data/mapData';
import { pickEncounter } from '../data/encounterData';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import '../screens/screens.css';

const SCALE = 3;
const WALK_SPEED = 12; // frames to move one tile (higher = slower)

export default function Overworld({ setScreen }) {
  const canvasRef = useRef(null);
  const assetsRef = useRef(null);
  const stateRef = useRef({
    px: PLAYER_START.x, py: PLAYER_START.y,
    dir: 'down', frame: 0, walkTimer: 0,
    moving: false, targetX: PLAYER_START.x, targetY: PLAYER_START.y,
    animX: PLAYER_START.x * TILE_SIZE, animY: PLAYER_START.y * TILE_SIZE,
  });
  const keysRef = useRef({});
  const [dialog, _setDialog] = useState(null);
  const dialogRef = useRef(null);
  const [paused, _setPaused] = useState(false);
  const pausedRef = useRef(false);
  const interactCooldown = useRef(0);
  const [pauseIdx, setPauseIdx] = useState(0);
  const [banner, setBanner] = useState('HEYTT TOWN');
  const [encounterFlash, setEncounterFlash] = useState(false);

  // Sync React state with refs so the 60fps game loop reads current values
  const setDialog = useCallback((v) => { dialogRef.current = v; _setDialog(v); }, []);
  const setPaused = useCallback((v) => {
    if (typeof v === 'function') {
      _setPaused(prev => { const next = v(prev); pausedRef.current = next; return next; });
    } else {
      pausedRef.current = v; _setPaused(v);
    }
  }, []);

  const store = useGameStore();

  // ── Restore position from door ──
  useEffect(() => {
    if (store.lastDoorPosition) {
      const { x, y } = store.lastDoorPosition;
      const s = stateRef.current;
      s.px = x; s.py = y;
      s.targetX = x; s.targetY = y;
      s.animX = x * TILE_SIZE; s.animY = y * TILE_SIZE;
      s.dir = 'down';
      store.clearDoorPosition();
    }
  }, []);

  // ── Load assets ──
  useEffect(() => {
    const tileset = generateTileset();
    const player = generatePlayerSpritesheet();
    const npcSprites = {};
    const variants = new Set(NPCS.map(n => n.variant));
    variants.forEach(v => { npcSprites[v] = generateNPCSpritesheet(v); });
    assetsRef.current = { tileset, player, npcSprites };
  }, []);

  // ── Banner timer ──
  useEffect(() => {
    if (banner) {
      const t = setTimeout(() => setBanner(null), 2500);
      return () => clearTimeout(t);
    }
  }, [banner]);

  // ── Input ──
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // ── Pause menu ──
  const pauseItems = ['RESUME', 'COLLECTION', 'SAVE', 'EXIT'];
  useInput((action) => {
    if (dialog) return;
    if (action === 'START' || (action === 'B' && !paused)) {
      setPaused(p => !p);
      setPauseIdx(0);
      return;
    }
    if (paused) {
      if (action === 'UP') setPauseIdx(i => Math.max(0, i - 1));
      if (action === 'DOWN') setPauseIdx(i => Math.min(pauseItems.length - 1, i + 1));
      if (action === 'A') {
        const sel = pauseItems[pauseIdx];
        if (sel === 'RESUME') setPaused(false);
        if (sel === 'COLLECTION') {
          setPaused(false);
          store.setLastDoorPosition({ x: stateRef.current.px, y: stateRef.current.py });
          setScreen('collection');
        }
        if (sel === 'EXIT') {
          setPaused(false);
          setScreen('title');
        }
      }
      if (action === 'B') setPaused(false);
    }
  }, [paused, pauseIdx, dialog]);

  // ── Encounter trigger check ──
  const checkEncounter = useCallback((tx, ty) => {
    const tileIdx = ty * MAP_WIDTH + tx;
    const tile = MAP_DATA[tileIdx];
    if (tile !== TILE_IDS.TALL_GRASS) return;

    store.decrementCooldown();
    if (store.encounterCooldown > 0) return;
    if (Math.random() >= 0.20) return;

    // Trigger!
    const zone = getGrassZone(tx, ty);
    const entity = pickEncounter(zone);
    store.markEncountered(entity.id);
    store.triggerEncounter(entity);

    // Flash animation then transition
    setEncounterFlash(true);
    setTimeout(() => {
      setEncounterFlash(false);
      store.setLastDoorPosition({ x: stateRef.current.px, y: stateRef.current.py });
      store.setEncounterPhase('ENCOUNTER_SCREEN');
      setScreen('encounter');
    }, 600);
  }, [store, setScreen]);

  // ── NPC / Sign / Zone interaction ──
  const interact = useCallback(() => {
    const s = stateRef.current;
    const dx = s.dir === 'left' ? -1 : s.dir === 'right' ? 1 : 0;
    const dy = s.dir === 'up' ? -1 : s.dir === 'down' ? 1 : 0;
    const fx = s.px + dx, fy = s.py + dy;

    // Check NPCs
    const npc = NPCS.find(n => n.x === fx && n.y === fy);
    if (npc) { setDialog(npc.dialog); return; }

    // Check signs
    const sign = SIGNS.find(sg => sg.x === fx && sg.y === fy);
    if (sign) { setDialog(sign.text); return; }
  }, []);

  // ── Zone door checks ──
  const checkZone = useCallback((tx, ty) => {
    const zone = ZONES.find(z => z.doorX === tx && z.doorY === ty);
    if (zone) {
      store.setLastDoorPosition({ x: tx, y: ty });
      setDialog(zone.dialog);
      // After dialog, go to screen
      setDialog(zone.dialog);
      // We handle transition in dialog onComplete below
      stateRef.current._pendingZone = zone;
    }
  }, [store]);

  const handleDialogComplete = useCallback(() => {
    const pending = stateRef.current._pendingZone;
    if (pending) {
      stateRef.current._pendingZone = null;
      setScreen(pending.screen);
    }
    setDialog(null);
    // Set cooldown so interact() doesn't immediately re-trigger
    interactCooldown.current = 15;
    // Clear interaction keys
    const keys = keysRef.current;
    keys['z'] = false; keys['Z'] = false; keys[' '] = false; keys['Enter'] = false;
  }, [setScreen, setDialog]);

  // ── Game loop ──
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      if (!assetsRef.current) { animId = requestAnimationFrame(loop); return; }
      const { tileset, player, npcSprites } = assetsRef.current;
      const s = stateRef.current;
      const keys = keysRef.current;
      const ts = TILE_SIZE * SCALE;

      // Tick interaction cooldown
      if (interactCooldown.current > 0) interactCooldown.current--;

      // ── Movement logic ── (use refs for current state)
      if (!s.moving && !dialogRef.current && !pausedRef.current) {
        let dx = 0, dy = 0, dir = s.dir;
        if (keys['ArrowUp'] || keys['w'] || keys['W']) { dy = -1; dir = 'up'; }
        else if (keys['ArrowDown'] || keys['s'] || keys['S']) { dy = 1; dir = 'down'; }
        else if (keys['ArrowLeft'] || keys['a'] || keys['A']) { dx = -1; dir = 'left'; }
        else if (keys['ArrowRight'] || keys['d'] || keys['D']) { dx = 1; dir = 'right'; }

        s.dir = dir;
        if (dx !== 0 || dy !== 0) {
          const nx = s.px + dx, ny = s.py + dy;
          if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
            const tileIdx = ny * MAP_WIDTH + nx;
            const tile = MAP_DATA[tileIdx];
            // Block movement into NPC tiles or sign tiles
            const npcBlocking = NPCS.some(n => n.x === nx && n.y === ny);
            const signBlocking = SIGNS.some(sg => sg.x === nx && sg.y === ny);
            if (!SOLID_TILES.has(tile) && !npcBlocking && !signBlocking) {
              s.targetX = nx; s.targetY = ny;
              s.moving = true; s.walkTimer = 0;
              s.frame = s.frame === 0 ? 1 : s.frame === 1 ? 2 : 1;
            }
          }
        }

        // Interaction — only if cooldown expired
        if (interactCooldown.current <= 0 && (keys['z'] || keys['Z'] || keys[' '] || keys['Enter'])) {
          keys['z'] = false; keys['Z'] = false; keys[' '] = false; keys['Enter'] = false;
          interact();
        }
      }

      // Animate movement
      if (s.moving) {
        s.walkTimer++;
        const t = s.walkTimer / WALK_SPEED;
        s.animX = ((1 - t) * s.px + t * s.targetX) * TILE_SIZE;
        s.animY = ((1 - t) * s.py + t * s.targetY) * TILE_SIZE;

        if (s.walkTimer >= WALK_SPEED) {
          s.px = s.targetX; s.py = s.targetY;
          s.animX = s.px * TILE_SIZE; s.animY = s.py * TILE_SIZE;
          s.moving = false; s.walkTimer = 0;
          // Check encounters & zones
          checkEncounter(s.px, s.py);
          checkZone(s.px, s.py);
        }
      }

      // ── Camera ──
      const camX = s.animX * SCALE - canvas.width / 2 + (TILE_SIZE * SCALE) / 2;
      const camY = s.animY * SCALE - canvas.height / 2 + (TILE_SIZE * SCALE) / 2;
      const maxCamX = MAP_WIDTH * ts - canvas.width;
      const maxCamY = MAP_HEIGHT * ts - canvas.height;
      const cx = Math.max(0, Math.min(camX, maxCamX));
      const cy = Math.max(0, Math.min(camY, maxCamY));

      // ── Draw ──
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#4E8834';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / ts) + 2;
      const rows = Math.ceil(canvas.height / ts) + 2;
      const startCol = Math.max(0, Math.floor(cx / ts));
      const startRow = Math.max(0, Math.floor(cy / ts));

      // Tiles
      for (let r = startRow; r < Math.min(startRow + rows, MAP_HEIGHT); r++) {
        for (let c = startCol; c < Math.min(startCol + cols, MAP_WIDTH); c++) {
          const tile = MAP_DATA[r * MAP_WIDTH + c];
          const sx = (tile % 8) * TILE_SIZE;
          const sy = Math.floor(tile / 8) * TILE_SIZE;
          ctx.drawImage(tileset, sx, sy, TILE_SIZE, TILE_SIZE,
            c * ts - cx, r * ts - cy, ts, ts);
        }
      }

      // NPCs
      NPCS.forEach(npc => {
        const sprite = npcSprites[npc.variant];
        if (!sprite) return;
        const nx = npc.x * ts - cx;
        const ny = npc.y * ts - cy - (4 * SCALE); // offset for 16x20 sprite
        if (nx > -ts && nx < canvas.width + ts && ny > -ts && ny < canvas.height + ts) {
          ctx.drawImage(sprite, 0, 0, 16, 20, nx, ny, 16 * SCALE, 20 * SCALE);
        }
      });

      // Player
      const dirRow = { down: 0, up: 1, left: 2, right: 3 }[s.dir];
      const sprCol = s.moving ? s.frame : 0;
      const psx = sprCol * 16, psy = dirRow * 20;
      const ppx = s.animX * SCALE - cx;
      const ppy = s.animY * SCALE - cy - (4 * SCALE);
      ctx.drawImage(player, psx, psy, 16, 20, ppx, ppy, 16 * SCALE, 20 * SCALE);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [dialog, paused, interact, checkEncounter, checkZone]);

  // ── Mobile touch handlers ──
  const mobileMove = (dir) => { keysRef.current[`Arrow${dir.charAt(0).toUpperCase()+dir.slice(1)}`] = true; };
  const mobileStop = (dir) => { keysRef.current[`Arrow${dir.charAt(0).toUpperCase()+dir.slice(1)}`] = false; };

  return (
    <div className="overworld-fullscreen">
      <canvas ref={canvasRef} className="game-canvas" />

      {banner && <div className="ow-location-banner">{banner}</div>}

      {/* Encounter flash overlay */}
      {encounterFlash && <div className="encounter-flash-overlay" />}

      {/* Pause menu */}
      {paused && (
        <>
          <div className="ow-pause-overlay" />
          <div className="ow-pause-menu">
            <div className="ow-pause-title">MENU</div>
            {pauseItems.map((item, i) => (
              <div key={item} className={`ow-pause-item ${i === pauseIdx ? 'active' : ''}`}>
                {i === pauseIdx ? '▶ ' : '  '}{item}
              </div>
            ))}
            <div className="ow-pause-hint">↑↓ Navigate · Z Select · X Back</div>
          </div>
        </>
      )}

      {/* Dialog */}
      {dialog && (
        <div className="ow-dialog-wrapper">
          <DialogBox messages={dialog} onComplete={handleDialogComplete} />
        </div>
      )}

      {/* Controls hint */}
      {!dialog && !paused && (
        <div className="controls-hint">WASD/Arrows Move · Z Interact · X/Esc/Backspace Back · Shift Menu</div>
      )}

      {/* Mobile controls */}
      <div className="mobile-controls">
        <div className="mobile-dpad">
          <button className="m-btn m-up"
            onTouchStart={(e) => { e.preventDefault(); mobileMove('up'); }}
            onTouchEnd={(e) => { e.preventDefault(); mobileStop('up'); }}>▲</button>
          <button className="m-btn m-left"
            onTouchStart={(e) => { e.preventDefault(); mobileMove('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); mobileStop('left'); }}>◀</button>
          <button className="m-btn m-right"
            onTouchStart={(e) => { e.preventDefault(); mobileMove('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); mobileStop('right'); }}>▶</button>
          <button className="m-btn m-down"
            onTouchStart={(e) => { e.preventDefault(); mobileMove('down'); }}
            onTouchEnd={(e) => { e.preventDefault(); mobileStop('down'); }}>▼</button>
        </div>
        <div className="mobile-ab">
          <button className="m-btn m-b"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'x', bubbles: true })); }}>B</button>
          <button className="m-btn m-a"
            onTouchStart={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'z', bubbles: true })); }}>A</button>
        </div>
      </div>
    </div>
  );
}
