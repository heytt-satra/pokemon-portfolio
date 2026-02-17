import { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import '../screens/screens.css';

export default function BootScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [phase, setPhase] = useState(0); // 0=black, 1=show text, 2=fadeout

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setScreen('title'), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setScreen]);

  return (
    <div className="boot-fullscreen">
      <div className={`boot-content ${phase === 1 ? 'visible' : ''} ${phase === 2 ? 'fade-out' : ''}`}>
        <div className="boot-logo">HEYTT</div>
        <div className="boot-sub">STUDIOS</div>
        <div className="boot-presents">— PRESENTS —</div>
      </div>
    </div>
  );
}
