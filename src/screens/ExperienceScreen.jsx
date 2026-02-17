import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import { EXPERIENCE_DATA } from '../data/experience';
import '../screens/screens.css';

export default function ExperienceScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dialog, setDialog] = useState(null);

  useInput((action) => {
    if (dialog) return;
    if (action === 'B') setScreen('overworld', 'FADE');
    if (action === 'UP') setSelectedIndex((i) => Math.max(0, i - 1));
    if (action === 'DOWN') setSelectedIndex((i) => Math.min(EXPERIENCE_DATA.length - 1, i + 1));
    if (action === 'A') {
      const exp = EXPERIENCE_DATA[selectedIndex];
      setDialog([
        `${exp.company} — ${exp.role}`,
        exp.description,
        ...exp.highlights.map(h => `• ${h}`),
      ]);
    }
  }, [selectedIndex, dialog]);

  return (
    <div className="screen-fullscreen experience-bg">
      <div className="screen-panel">
        <div className="panel-header">
          <h2 className="panel-title" style={{ color: '#78C850' }}>ROUTE 1</h2>
          <div className="panel-subtitle">THE CAREER PATH</div>
        </div>

        <div className="exp-route">
          {EXPERIENCE_DATA.map((exp, i) => (
            <div key={i} className="exp-stop">
              {/* Connector */}
              {i > 0 && <div className="exp-connector-fs">│<br/>│<br/>│</div>}

              <div
                className={`exp-landmark ${selectedIndex === i ? 'selected' : ''} ${i === 0 ? 'current' : ''}`}
                onClick={() => { setSelectedIndex(i); }}
              >
                <div className="exp-icon-fs">
                  {i === 0 ? '⭐' : '🏢'}
                </div>
                <div className="exp-details-fs">
                  <div className="exp-company-fs">{exp.company}</div>
                  <div className="exp-role-fs">{exp.role}</div>
                  <div className="exp-date-fs">{exp.dateRange}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {dialog && (
        <div className="screen-dialog-area">
          <DialogBox messages={dialog} onComplete={() => setDialog(null)} speed={20} />
        </div>
      )}
      <div className="screen-back-fs">B: Back</div>
    </div>
  );
}
