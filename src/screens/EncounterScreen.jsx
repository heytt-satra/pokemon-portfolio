import { useState, useEffect, useRef, useCallback } from 'react';
import { generateEntitySprite, generatePlayerBackSprite, generatePokeballSprite } from '../engine/spriteGenerator';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import '../screens/screens.css';

const PHASES = { INTRO: 'INTRO', MENU: 'MENU', INSPECT: 'INSPECT', CATCH_MENU: 'CATCH_MENU', CATCH_ANIM: 'CATCH_ANIM', RESULT: 'RESULT', DONE: 'DONE' };

export default function EncounterScreen({ setScreen }) {
  const store = useGameStore();
  const entity = store.currentEncounter;
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [menuIdx, setMenuIdx] = useState(0);
  const [subMenuIdx, setSubMenuIdx] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [showBall, setShowBall] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [caught, setCaught] = useState(false);
  const [entityVisible, setEntityVisible] = useState(true);
  const [slideIn, setSlideIn] = useState(true);

  const entityCanvasRef = useRef(null);
  const playerCanvasRef = useRef(null);

  const alreadyCaught = entity && store.caughtEntities.includes(entity.id);

  // Draw sprites
  useEffect(() => {
    if (!entity) return;
    // Entity sprite
    if (entityCanvasRef.current) {
      const c = entityCanvasRef.current;
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const sprite = generateEntitySprite(entity.type);
      ctx.drawImage(sprite, 0, 0, 32, 32, 0, 0, 64, 64);
    }
    // Player back sprite
    if (playerCanvasRef.current) {
      const c = playerCanvasRef.current;
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const sprite = generatePlayerBackSprite();
      ctx.drawImage(sprite, 0, 0, 32, 32, 0, 0, 64, 64);
    }
  }, [entity]);

  // Slide-in animation
  useEffect(() => {
    const t = setTimeout(() => setSlideIn(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Intro dialog  
  useEffect(() => {
    if (phase === PHASES.INTRO) {
      setDialog([`A wild ${entity?.name} appeared!`]);
    }
  }, [phase, entity]);

  const handleIntroComplete = useCallback(() => {
    setDialog(null);
    setPhase(PHASES.MENU);
  }, []);

  // Action menu
  const menuItems = ['INSPECT', 'RUN'];

  // Menu action handlers (shared by keyboard + mobile tap)
  const doMenuAction = useCallback((idx) => {
    if (idx === 0) {
      // INSPECT
      setPhase(PHASES.INSPECT);
      setDialog([entity.description]);
    } else {
      // RUN
      setDialog(['Got away safely!']);
      setPhase(PHASES.DONE);
    }
  }, [entity]);

  // Catch animation
  const startCatchAnimation = useCallback(() => {
    setPhase(PHASES.CATCH_ANIM);
    setShowBall(true);

    // Ball arc → entity disappears → wobble → catch
    setTimeout(() => setEntityVisible(false), 600);
    setTimeout(() => setWobble(true), 800);
    setTimeout(() => {
      setWobble(false);
      setCaught(true);
      if (alreadyCaught) {
        setDialog([
          `You already know about ${entity.name}.`,
          'But it\'s good to be reminded.',
        ]);
      } else {
        store.catchEntity(entity.id);
        setDialog([
          `${entity.name} was caught!`,
          'It has been added to your PROFILE.',
        ]);
      }
      setPhase(PHASES.RESULT);
    }, 1800);
  }, [entity, alreadyCaught, store]);

  const doCatchAction = useCallback((idx) => {
    if (idx === 0) {
      // CATCH
      startCatchAnimation();
    } else {
      // RELEASE — let it go and leave
      setDialog([`${entity?.name} was released.`, 'You let it go freely.']);
      setPhase(PHASES.DONE);
    }
  }, [entity, startCatchAnimation]);

  useInput((action) => {
    if (dialog) return;

    if (phase === PHASES.MENU) {
      if (action === 'UP' || action === 'DOWN') setMenuIdx(i => i === 0 ? 1 : 0);
      if (action === 'A') doMenuAction(menuIdx);
      if (action === 'B') {
        setDialog(['Got away safely!']);
        setPhase(PHASES.DONE);
      }
    }

    if (phase === PHASES.CATCH_MENU) {
      if (action === 'UP' || action === 'DOWN') setSubMenuIdx(i => i === 0 ? 1 : 0);
      if (action === 'A') doCatchAction(subMenuIdx);
      if (action === 'B') {
        setSubMenuIdx(0);
        setPhase(PHASES.MENU);
      }
    }
  }, [phase, menuIdx, subMenuIdx, dialog, entity, doMenuAction, doCatchAction]);

  // After inspect dialog — reset subMenuIdx so CATCH is highlighted by default
  const handleInspectComplete = useCallback(() => {
    setDialog(null);
    setSubMenuIdx(0);
    if (entity?.catchable) {
      setPhase(PHASES.CATCH_MENU);
    } else {
      setPhase(PHASES.MENU);
    }
  }, [entity]);

  // Handle dialog complete based on phase
  const handleDialogComplete = useCallback(() => {
    setDialog(null);
    if (phase === PHASES.INTRO) {
      setPhase(PHASES.MENU);
    } else if (phase === PHASES.INSPECT) {
      if (entity?.catchable) {
        setPhase(PHASES.CATCH_MENU);
      } else {
        setPhase(PHASES.MENU);
      }
    } else if (phase === PHASES.RESULT || phase === PHASES.DONE) {
      store.endEncounter();
      setScreen('overworld');
    }
  }, [phase, entity, store, setScreen]);

  if (!entity) return null;

  const typeColors = {
    FIRE: '#F85830', WATER: '#6890F0', ELECTRIC: '#F8D030',
    PSYCHIC: '#F85888', GRASS: '#78C850', STEEL: '#B8B8D0', NORMAL: '#A8A878',
  };
  const typeColor = typeColors[entity.type] || '#A8A878';

  return (
    <div className="encounter-fullscreen">
      {/* Battle background */}
      <div className="enc-bg">
        <div className="enc-bg-grass" />
      </div>

      {/* Enemy side — top right */}
      <div className={`enc-enemy-side ${slideIn ? 'slide-in-right' : ''}`}>
        {/* HP bar */}
        <div className="enc-hp-box enemy-hp">
          <div className="enc-hp-name">{entity.name}</div>
          <div className="enc-hp-row">
            <span className="enc-hp-label">HP</span>
            <div className="enc-hp-track">
              <div className="enc-hp-fill" style={{ width: '100%', background: typeColor }} />
            </div>
          </div>
          <div className="enc-hp-lvl">Lv{entity.level}</div>
          <div className="enc-type-chip" style={{ background: typeColor }}>
            {entity.type}
          </div>
        </div>
        {entityVisible && (
          <canvas ref={entityCanvasRef} className="enc-entity-canvas" style={{ imageRendering: 'pixelated' }} />
        )}
        {showBall && !caught && (
          <div className={`enc-pokeball ${wobble ? 'wobble-anim' : 'throw-anim'}`}>
            <PokeBallIcon />
          </div>
        )}
        {caught && (
          <div className="enc-catch-burst">✦</div>
        )}
      </div>

      {/* Player side — bottom left */}
      <div className={`enc-player-side ${slideIn ? 'slide-in-left' : ''}`}>
        <canvas ref={playerCanvasRef} className="enc-player-canvas" style={{ imageRendering: 'pixelated' }} />
        {/* Player info card */}
        <div className="enc-hp-box player-hp">
          <div className="enc-hp-name">HEYTT</div>
          <div className="enc-hp-row">
            <span className="enc-hp-label">HP</span>
            <div className="enc-hp-track">
              <div className="enc-hp-fill" style={{ width: '100%', background: '#58C848' }} />
            </div>
          </div>
          <div className="enc-hp-lvl">Lv4</div>
        </div>
      </div>

      {/* Action menu */}
      {phase === PHASES.MENU && !dialog && (
        <div className="enc-action-menu">
          <div className="enc-action-title">What will HEYTT do?</div>
          <div className="enc-action-grid">
            {menuItems.map((item, i) => (
              <div key={item}
                className={`enc-action-item ${i === menuIdx ? 'active' : ''}`}
                onClick={() => { setMenuIdx(i); doMenuAction(i); }}>
                {i === menuIdx ? '▶' : ' '} {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catch sub-menu */}
      {phase === PHASES.CATCH_MENU && !dialog && (
        <div className="enc-action-menu">
          <div className="enc-action-title">
            {alreadyCaught ? 'Already caught!' : 'Add to collection?'}
          </div>
          <div className="enc-action-grid">
            <div className={`enc-action-item ${subMenuIdx === 0 ? 'active' : ''}`}
              onClick={() => { setSubMenuIdx(0); doCatchAction(0); }}>
              {subMenuIdx === 0 ? '▶' : ' '} CATCH
            </div>
            <div className={`enc-action-item ${subMenuIdx === 1 ? 'active' : ''}`}
              onClick={() => { setSubMenuIdx(1); doCatchAction(1); }}>
              {subMenuIdx === 1 ? '▶' : ' '} RELEASE
            </div>
          </div>
        </div>
      )}

      {/* Dialog */}
      {dialog && (
        <div className="enc-dialog-wrapper">
          <DialogBox
            messages={dialog}
            onComplete={handleDialogComplete}
          />
        </div>
      )}

      {/* Rarity badge */}
      {entity.rarity === 'RARE' && (
        <div className="enc-rarity-badge">★ RARE</div>
      )}
    </div>
  );
}

function PokeBallIcon() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const c = ref.current;
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const ball = generatePokeballSprite();
    ctx.drawImage(ball, 0, 0, 16, 16, 0, 0, 32, 32);
  }, []);
  return <canvas ref={ref} style={{ width: 32, height: 32, imageRendering: 'pixelated' }} />;
}
