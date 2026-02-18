import { useEffect, useState, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import { playTrack, onTrackEnd } from '../engine/musicEngine';
import '../screens/screens.css';

export default function BootScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [phase, setPhase] = useState(0); // 0=black, 1=show text, 2=fadeout
  const skippedRef = useRef(false);
  const timersRef = useRef([]);

  useEffect(() => {
    // Start gamefreak music
    playTrack('gamefreak');

    // Show text after brief delay
    const t1 = setTimeout(() => setPhase(1), 400);
    timersRef.current.push(t1);

    // When the gamefreak music ends, transition automatically
    const cleanup = onTrackEnd('gamefreak', () => {
      if (!skippedRef.current) {
        setPhase(2);
        const t = setTimeout(() => setScreen('title'), 800);
        timersRef.current.push(t);
      }
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      if (cleanup) cleanup();
    };
  }, [setScreen]);

  // Allow skip with any button/key press
  useInput((action) => {
    if (!skippedRef.current) {
      skippedRef.current = true;
      setPhase(2);
      setTimeout(() => setScreen('title'), 400);
    }
  }, [setScreen]);

  return (
    <div className="boot-fullscreen" onClick={() => {
      if (!skippedRef.current) {
        skippedRef.current = true;
        setPhase(2);
        setTimeout(() => setScreen('title'), 400);
      }
    }}>
      <div className={`boot-content ${phase === 1 ? 'visible' : ''} ${phase === 2 ? 'fade-out' : ''}`}>
        <div className="boot-logo">HEYTT</div>
        <div className="boot-sub">STUDIOS</div>
        <div className="boot-presents">— PRESENTS —</div>
      </div>
      {phase === 1 && (
        <div className="boot-skip-hint">Press any key to skip</div>
      )}
    </div>
  );
}
