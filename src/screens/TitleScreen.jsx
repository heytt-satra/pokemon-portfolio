import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import { generatePlayerSpritesheet } from '../engine/spriteGenerator';
import '../screens/screens.css';

export default function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const introComplete = useGameStore((s) => s.introComplete);
  const clearSave = useGameStore((s) => s.clearSave);
  const [menuMode, setMenuMode] = useState(!introComplete ? 'press' : 'menu');
  const [menuIndex, setMenuIndex] = useState(0);
  const playerRef = useRef(null);
  const canvasRef = useRef(null);

  // Draw player sprite on canvas
  useEffect(() => {
    playerRef.current = generatePlayerSpritesheet();
    const c = canvasRef.current;
    if (c && playerRef.current) {
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(playerRef.current, 0, 0, 16, 20, 0, 0, 64, 80);
    }
  }, []);

  useInput((action) => {
    if (menuMode === 'press') {
      if (['A', 'START'].includes(action)) {
        if (introComplete) {
          setMenuMode('menu');
        } else {
          setScreen('intro', 'FADE');
        }
      }
    } else if (menuMode === 'menu') {
      if (action === 'UP') setMenuIndex((i) => Math.max(0, i - 1));
      if (action === 'DOWN') setMenuIndex((i) => Math.min(1, i + 1));
      if (action === 'A') {
        if (menuIndex === 0) {
          setScreen('overworld', 'FADE');
        } else {
          if (clearSave) clearSave();
          setScreen('intro', 'FADE');
        }
      }
    }
  }, [menuMode, menuIndex, introComplete]);

  return (
    <div className="title-fullscreen">
      {/* Animated background */}
      <div className="title-bg-scroll" />

      {/* Logo */}
      <div className="title-logo-area">
        <h1 className="title-heytt">HEYTT</h1>
        <div className="title-version">VERSION</div>
      </div>

      {/* Player sprite */}
      <div className="title-character">
        <canvas ref={canvasRef} width={64} height={80} className="title-char-canvas" />
      </div>

      {/* Menu or press start */}
      {menuMode === 'press' ? (
        <div className="title-press-start-fs" onClick={() => {
          if (introComplete) setMenuMode('menu');
          else setScreen('intro', 'FADE');
        }}>▶ PRESS START</div>
      ) : (
        <div className="title-menu-fs">
          {['CONTINUE', 'NEW GAME'].map((item, i) => (
            <div key={item}
              className={`title-menu-item-fs ${menuIndex === i ? 'active' : ''}`}
              onClick={() => {
                setMenuIndex(i);
                if (i === 0) setScreen('overworld', 'FADE');
                else { if (clearSave) clearSave(); setScreen('intro', 'FADE'); }
              }}>
              {menuIndex === i ? '▶ ' : '  '}{item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
