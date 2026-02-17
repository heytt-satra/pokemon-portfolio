import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import useInput from '../hooks/useInput';
import DialogBox from '../components/DialogBox';
import { generateNurseSprite } from '../engine/spriteGenerator';
import '../screens/screens.css';

const ENTRY_DIALOG = [
  'Welcome to the POKEMON CENTER!',
  'I can restore your messages to full health!',
  'What would you like to send?',
];

export default function ContactScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [phase, setPhase] = useState('intro');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [healing, setHealing] = useState(false);
  const nurseRef = useRef(null);

  useEffect(() => {
    const sprite = generateNurseSprite();
    if (nurseRef.current) {
      const ctx = nurseRef.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0, 0, 16, 20, 0, 0, 64, 80);
    }
  }, []);

  useInput((action) => {
    if (action === 'B' && phase !== 'intro') {
      setScreen('overworld', 'FADE');
    }
  }, [phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(['Oh my! Your message appears incomplete...', 'Please fill in all fields.']);
      return;
    }

    setSending(true);
    // Simulate send (replace with EmailJS/Formspree)
    setTimeout(() => {
      setSending(false);
      setHealing(true);
      setTimeout(() => {
        setHealing(false);
        setSent(true);
      }, 1800);
    }, 800);
  };

  return (
    <div className="screen-fullscreen contact-bg">
      {/* Nurse Joy */}
      <div className="contact-nurse-area">
        <div className="contact-counter-fs" />
        <canvas ref={nurseRef} width={64} height={80} className="contact-nurse-canvas" />
      </div>

      {/* Healing animation */}
      {healing && (
        <div className="heal-overlay-fs">
          <div className="heal-bar-fs" />
          <div className="heal-text-fs">Sending...</div>
        </div>
      )}

      {/* Intro dialog */}
      {phase === 'intro' && (
        <div className="screen-dialog-area">
          <DialogBox
            messages={ENTRY_DIALOG}
            onComplete={() => setPhase('form')}
            speed={30}
          />
        </div>
      )}

      {/* Error dialog */}
      {error && (
        <div className="screen-dialog-area">
          <DialogBox
            messages={error}
            onComplete={() => setError(null)}
            speed={25}
          />
        </div>
      )}

      {/* Form */}
      {phase === 'form' && !sent && !healing && (
        <div className="screen-panel contact-panel-fs">
          <form onSubmit={handleSubmit} className="contact-form-fs">
            <div className="contact-field-fs">
              <label className="contact-label-fs">TRAINER NAME</label>
              <input
                className="contact-input-fs"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div className="contact-field-fs">
              <label className="contact-label-fs">POKé-MAIL</label>
              <input
                className="contact-input-fs"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="contact-field-fs">
              <label className="contact-label-fs">MESSAGE</label>
              <textarea
                className="contact-input-fs contact-textarea-fs"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your message here..."
                rows={3}
              />
            </div>
            <button type="submit" className="contact-submit-fs" disabled={sending}>
              {sending ? 'SENDING...' : 'SEND MESSAGE ▶'}
            </button>
          </form>
        </div>
      )}

      {/* Success */}
      {sent && (
        <div className="screen-panel">
          <div className="contact-success-fs">
            <div>✨</div>
            <div>Your message has been sent!</div>
            <div className="contact-success-sub">We hope to hear back from HEYTT soon!</div>
          </div>
        </div>
      )}

      <div className="screen-back-fs">B: Back</div>
    </div>
  );
}
