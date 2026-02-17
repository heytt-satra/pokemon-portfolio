import { useState } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import { PROJECT_DATA } from '../data/projects';
import '../screens/screens.css';

export default function ProjectsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailView, setDetailView] = useState(false);
  const [dialog, setDialog] = useState(null);

  useInput((action) => {
    if (dialog) return;

    if (detailView) {
      if (action === 'B') setDetailView(false);
      if (action === 'A') {
        const proj = PROJECT_DATA[selectedIndex];
        if (proj.liveUrl) window.open(proj.liveUrl, '_blank');
      }
      return;
    }

    if (action === 'B') {
      setScreen('overworld', 'FADE');
    }
    if (action === 'UP') setSelectedIndex((i) => Math.max(0, i - 1));
    if (action === 'DOWN') setSelectedIndex((i) => Math.min(PROJECT_DATA.length - 1, i + 1));
    if (action === 'A') {
      setDetailView(true);
      setDialog([PROJECT_DATA[selectedIndex].description]);
    }
  }, [selectedIndex, detailView, dialog]);

  const proj = PROJECT_DATA[selectedIndex];

  if (detailView) {
    return (
      <div className="screen-fullscreen projects-detail-bg">
        <div className="screen-panel-wide">
          <div className="pd-header-fs">
            <span className="pd-num-fs">No.{String(selectedIndex + 1).padStart(3, '0')}</span>
            <span className="pd-name-fs">{proj.name}</span>
          </div>

          <div className="pd-body-fs">
            <div className="pd-thumb-fs">{proj.icon || '📦'}</div>
            <div className="pd-meta-fs">
              <div className="pd-types-fs">
                {proj.techStack.map((t) => (
                  <span key={t} className="pd-chip-fs">{t}</span>
                ))}
              </div>
              <div className="pd-status-fs">STATUS: {proj.status}</div>
            </div>
          </div>

          <div className="pd-actions-fs">
            {proj.liveUrl && (
              <button className="pd-btn-fs" onClick={() => window.open(proj.liveUrl, '_blank')}>
                ▶ VIEW LIVE
              </button>
            )}
            {proj.repoUrl && (
              <button className="pd-btn-fs" onClick={() => window.open(proj.repoUrl, '_blank')}>
                ▶ SEE CODE
              </button>
            )}
          </div>
        </div>

        {dialog && (
          <div className="screen-dialog-area">
            <DialogBox messages={dialog} onComplete={() => setDialog(null)} speed={20} />
          </div>
        )}
        <div className="screen-back-fs">B: Back to list</div>
      </div>
    );
  }

  return (
    <div className="screen-fullscreen projects-bg">
      <div className="screen-panel">
        <div className="panel-header">
          <h2 className="panel-title" style={{ color: '#F85830' }}>POKéDEX</h2>
          <div className="panel-subtitle">PROJECT ENTRIES</div>
        </div>

        <div className="pokedex-list-fs">
          {PROJECT_DATA.map((p, i) => (
            <div
              key={p.id}
              className={`pokedex-item-fs ${selectedIndex === i ? 'selected' : ''}`}
              onClick={() => { setSelectedIndex(i); setDetailView(true); }}
            >
              <span className="pi-cursor">{selectedIndex === i ? '▶' : ' '}</span>
              <span className="pi-num">No.{String(i + 1).padStart(3, '0')}</span>
              <span className="pi-icon">{p.icon || '📦'}</span>
              <span className="pi-name">{p.name}</span>
              <span className="pi-status">{p.status === 'OWNED' ? '●' : '○'}</span>
            </div>
          ))}
        </div>

        {/* Preview at bottom */}
        <div className="pokedex-preview-fs">
          <span className="pprev-icon">{proj.icon || '📦'}</span>
          <div className="pprev-info">
            <div className="pprev-name">{proj.name}</div>
            <div className="pprev-types">
              {proj.techStack.slice(0, 3).map(t => (
                <span key={t} className="pprev-chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="screen-back-fs">B: Back to overworld</div>
    </div>
  );
}
