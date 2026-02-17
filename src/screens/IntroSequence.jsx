import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import DialogBox from '../components/DialogBox';
import { generatePlayerSpritesheet, generateProfessorSprite } from '../engine/spriteGenerator';
import '../screens/screens.css';

const STEPS = [
  {
    visual: 'blank',
    dialog: ['Hello there!', 'Welcome to the world of HEYTT!'],
  },
  {
    visual: 'professor',
    dialog: ['My name is OAK.', 'People call me the Portfolio Prof.'],
  },
  {
    visual: 'professor',
    dialog: [
      'This world is inhabited by a rare kind of creator...',
      'A developer who actually ships things.',
    ],
  },
  {
    visual: 'silhouette',
    dialog: ['Now then...', 'Are you ready to meet him?'],
  },
  {
    visual: 'reveal',
    dialog: [
      'This is HEYTT!',
      'He builds things that matter and changes the lives of people.',
      'And occasionally breaks stuff. On purpose. For science.',
    ],
  },
  {
    visual: 'trainerCard',
    dialog: ['Here is his trainer profile.', 'Study it well.'],
  },
  {
    visual: 'fadeout',
    dialog: ['Your adventure starts now.', 'Good luck!'],
  },
];

export default function IntroSequence() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setIntroComplete = useGameStore((s) => s.setIntroComplete);
  const [step, setStep] = useState(0);
  const [showDialog, setShowDialog] = useState(true);
  const profCanvasRef = useRef(null);
  const playerCanvasRef = useRef(null);

  // Draw professor sprite
  useEffect(() => {
    if (profCanvasRef.current) {
      const sprite = generateProfessorSprite();
      const ctx = profCanvasRef.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0, 0, 16, 20, 0, 0, 96, 120);
    }
  }, [step]);

  // Draw player sprite
  useEffect(() => {
    if (playerCanvasRef.current) {
      const sheet = generatePlayerSpritesheet();
      const ctx = playerCanvasRef.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sheet, 0, 0, 16, 20, 0, 0, 96, 120);
    }
  }, [step]);

  const handleDialogComplete = () => {
    if (step < STEPS.length - 1) {
      setShowDialog(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setShowDialog(true);
      }, 300);
    } else {
      setIntroComplete();
      setScreen('overworld', 'FADE');
    }
  };

  const current = STEPS[step];
  const visual = current.visual;

  return (
    <div className="intro-fullscreen">
      {/* Visual area */}
      <div className="intro-visual">
        {visual === 'blank' && (
          <div className="intro-blank-area" />
        )}

        {visual === 'professor' && (
          <div className="intro-sprite-area">
            <canvas ref={profCanvasRef} width={96} height={120} className="intro-sprite-canvas" />
            <div className="intro-sprite-name">PROF. OAK</div>
          </div>
        )}

        {visual === 'silhouette' && (
          <div className="intro-sprite-area">
            <div className="intro-silhouette" />
            <div className="intro-sprite-name">???</div>
          </div>
        )}

        {visual === 'reveal' && (
          <div className="intro-sprite-area reveal-anim-fs">
            <canvas ref={playerCanvasRef} width={96} height={120} className="intro-sprite-canvas" />
            <div className="intro-sprite-name">HEYTT</div>
          </div>
        )}

        {visual === 'trainerCard' && (
          <div className="intro-trainer-card">
            <div className="tc-header-fs">TRAINER CARD</div>
            <div className="tc-body-fs">
              <div className="tc-avatar-fs">
                <canvas ref={playerCanvasRef} width={96} height={120} className="tc-canvas" />
              </div>
              <div className="tc-details">
                <div className="tc-detail-row"><span className="tc-lbl">NAME</span><span>Heytt Satra</span></div>
                <div className="tc-detail-row"><span className="tc-lbl">ROLE</span><span>AI/ML & Software Engineer</span></div>
                <div className="tc-detail-row"><span className="tc-lbl">LOCATION</span><span>Planet Earth</span></div>
                <div className="tc-detail-row"><span className="tc-lbl">SPECIALTY</span><span>Software, AI & Entrepreneurship</span></div>
                <div className="tc-detail-row"><span className="tc-lbl">PLAYTIME</span><span>2 YRS 3 MOS</span></div>
              </div>
            </div>
          </div>
        )}

        {visual === 'fadeout' && (
          <div className="intro-blank-area intro-fadeout-fs" />
        )}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="intro-dialog-area">
          <DialogBox
            messages={current.dialog}
            onComplete={handleDialogComplete}
            speed={30}
          />
        </div>
      )}
    </div>
  );
}
