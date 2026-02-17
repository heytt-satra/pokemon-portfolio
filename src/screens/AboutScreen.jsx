import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import { generatePlayerSpritesheet } from '../engine/spriteGenerator';
import '../screens/screens.css';

const BIO_DIALOG = [
  'Hey! I\'m Heytt Satra.',
  'I build software that matters and changes lives.',
  'AI/ML, full-stack systems, and shipped products\nare what I live for.',
  'I\'ve published research, launched startups,\nand built Mars rovers.',
  'When I\'m not engineering the future,\nI\'m probably gaming.',
  'Want to see my work? Check the PROJECT LAB!',
];

const LINKS = [
  { label: 'GitHub', icon: '💻', url: 'https://github.com/heytt' },
  { label: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com/in/heytt' },
  { label: 'Twitter/X', icon: '🐦', url: 'https://x.com/heytt' },
  { label: 'RESUME ★', icon: '📄', url: '#' },
];

export default function AboutScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [showBio, setShowBio] = useState(true);
  const [linkIndex, setLinkIndex] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const sheet = generatePlayerSpritesheet();
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sheet, 0, 0, 16, 20, 0, 0, 96, 120);
    }
  }, []);

  useInput((action) => {
    if (showBio) return;
    if (action === 'B') setScreen('overworld', 'FADE');
    if (action === 'UP') setLinkIndex((i) => Math.max(0, i - 1));
    if (action === 'DOWN') setLinkIndex((i) => Math.min(LINKS.length - 1, i + 1));
    if (action === 'A') {
      const link = LINKS[linkIndex];
      if (link.url !== '#') window.open(link.url, '_blank');
    }
  }, [showBio, linkIndex]);

  return (
    <div className="screen-fullscreen about-bg">
      <div className="screen-panel">
        <div className="panel-header">
          <h2 className="panel-title">TRAINER INFO</h2>
        </div>

        <div className="about-main-fs">
          {/* Character */}
          <div className="about-char-fs">
            <canvas ref={canvasRef} width={96} height={120} className="about-canvas" />
          </div>

          {/* Info */}
          <div className="about-info-fs">
            <div className="about-stat-fs"><span className="about-lbl">NAME</span>Heytt Satra</div>
            <div className="about-stat-fs"><span className="about-lbl">ROLE</span>AI/ML & Software Engineer</div>
            <div className="about-stat-fs"><span className="about-lbl">LOCATION</span>Planet Earth</div>
            <div className="about-stat-fs"><span className="about-lbl">SPECIALTY</span>Software, AI & Entrepreneurship</div>
            <div className="about-stat-fs"><span className="about-lbl">PLAYTIME</span>2 YRS 3 MOS</div>
          </div>
        </div>

        {/* Links */}
        {!showBio && (
          <div className="about-links-fs">
            <div className="about-links-title-fs">KEY ITEMS</div>
            {LINKS.map((link, i) => (
              <div
                key={link.label}
                className={`about-link-fs ${linkIndex === i ? 'selected' : ''}`}
                onClick={() => { setLinkIndex(i); if (link.url !== '#') window.open(link.url, '_blank'); }}
              >
                {linkIndex === i ? '▶ ' : '  '}
                <span className="about-link-icon-fs">{link.icon}</span>
                {link.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bio dialog */}
      {showBio && (
        <div className="screen-dialog-area">
          <DialogBox
            messages={BIO_DIALOG}
            onComplete={() => setShowBio(false)}
            speed={30}
          />
        </div>
      )}

      <div className="screen-back-fs">B: Back</div>
    </div>
  );
}
