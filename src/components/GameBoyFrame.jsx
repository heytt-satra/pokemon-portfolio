import ScreenManager from './ScreenManager';
import useGameStore from '../store/useGameStore';
import './GameBoyFrame.css';

export default function GameBoyFrame() {
  const setScreen = useGameStore((s) => s.setScreen);
  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);

  const handleDPad = (direction) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}` }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}` }));
    }, 120);
  };

  const handleButton = (key) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }));
    }, 80);
  };

  return (
    <div className="gb-wrapper">
      <div className="gb-shell">
        {/* Power LED */}
        <div className="gb-power-led"></div>

        {/* Top label */}
        <div className="gb-top-label">
          <span className="gb-dot"></span>
          <span className="gb-label-text">HEYTT VERSION</span>
        </div>

        {/* Screen bezel */}
        <div className="gb-bezel">
          <div className="gb-screen">
            <ScreenManager />
            {/* Mute indicator */}
            <div className="gb-mute-indicator" onClick={toggleMute}>
              {muted ? '🔇' : '🔊'}
            </div>
          </div>
        </div>

        {/* Controls area */}
        <div className="gb-controls">
          {/* D-Pad */}
          <div className="gb-dpad">
            <button className="gb-dpad-btn gb-dpad-up" onClick={() => handleDPad('up')} aria-label="Up">
              <span>▲</span>
            </button>
            <button className="gb-dpad-btn gb-dpad-left" onClick={() => handleDPad('left')} aria-label="Left">
              <span>◀</span>
            </button>
            <div className="gb-dpad-center"></div>
            <button className="gb-dpad-btn gb-dpad-right" onClick={() => handleDPad('right')} aria-label="Right">
              <span>▶</span>
            </button>
            <button className="gb-dpad-btn gb-dpad-down" onClick={() => handleDPad('down')} aria-label="Down">
              <span>▼</span>
            </button>
          </div>

          {/* A/B Buttons */}
          <div className="gb-ab-buttons">
            <button className="gb-btn gb-btn-b" onClick={() => handleButton('x')} aria-label="B Button">
              B
            </button>
            <button className="gb-btn gb-btn-a" onClick={() => handleButton('z')} aria-label="A Button">
              A
            </button>
          </div>
        </div>

        {/* Start/Select */}
        <div className="gb-system-buttons">
          <button className="gb-sys-btn" onClick={toggleMute} aria-label="Select">
            SELECT
          </button>
          <button className="gb-sys-btn" onClick={() => handleButton('Shift')} aria-label="Start">
            START
          </button>
        </div>

        {/* Speaker grills */}
        <div className="gb-speaker">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="gb-speaker-dot"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
