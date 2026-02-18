import { useState, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import { SKILL_DATA } from '../data/skills';
import '../screens/screens.css';

const TYPE_COLORS = {
  FIRE: '#F85830',
  WATER: '#6890F0',
  ELECTRIC: '#F8D030',
  PSYCHIC: '#F85888',
  GRASS: '#78C850',
  NORMAL: '#A8A878',
};

export default function SkillsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [selectedBadge, setSelectedBadge] = useState(0);
  const selectedBadgeRef = useRef(0);
  selectedBadgeRef.current = selectedBadge;
  const [dialog, setDialog] = useState(null);

  useInput((action) => {
    if (dialog) return;
    if (action === 'B') {
      setScreen('overworld', 'FADE');
    }
    if (action === 'LEFT') setSelectedBadge((i) => Math.max(0, i - 1));
    if (action === 'RIGHT') setSelectedBadge((i) => Math.min(SKILL_DATA.length - 1, i + 1));
    if (action === 'A') {
      const cat = SKILL_DATA[selectedBadgeRef.current];
      setDialog([`${cat.label}`, ...cat.skills.map(s => `  ${s.name}: LV.${s.level}`)]);
    }
  }, []);

  const cat = SKILL_DATA[selectedBadge];

  return (
    <div className="screen-fullscreen skills-bg">
      <div className="screen-panel">
        {/* Header */}
        <div className="panel-header">
          <h2 className="panel-title">TRAINER SKILLS</h2>
          <div className="panel-subtitle">BADGE CASE</div>
        </div>

        {/* Badge row */}
        <div className="badge-row">
          {SKILL_DATA.map((s, i) => (
            <div
              key={s.type}
              className={`badge-fs ${selectedBadge === i ? 'selected' : ''}`}
              style={{ borderColor: TYPE_COLORS[s.type] || '#aaa' }}
              onClick={() => setSelectedBadge(i)}
            >
              <span className="badge-icon-fs">{s.icon}</span>
              <span className="badge-type-fs">{s.type}</span>
            </div>
          ))}
        </div>

        {/* Stat bars */}
        <div className="panel-section-title" style={{ color: TYPE_COLORS[cat.type] }}>
          {cat.label}
        </div>
        <div className="skill-bars-fs">
          {cat.skills.map((skill) => (
            <div key={skill.name} className="skill-row-fs">
              <span className="skill-name-fs">{skill.name}</span>
              <div className="skill-track-fs">
                <div
                  className="skill-fill-fs"
                  style={{
                    width: `${skill.level}%`,
                    background: TYPE_COLORS[cat.type],
                  }}
                />
              </div>
              <span className="skill-lvl-fs">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog */}
      {dialog && (
        <div className="screen-dialog-area">
          <DialogBox messages={dialog} onComplete={() => setDialog(null)} speed={20} />
        </div>
      )}

      <div className="screen-back-fs">B: Back</div>
    </div>
  );
}
