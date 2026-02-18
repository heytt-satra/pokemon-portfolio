import { useState, useEffect, useRef, useCallback } from 'react';
import useInput from '../hooks/useInput';

/**
 * Fullscreen dialog box with proper state machine.
 * States: TYPING → WAITING → (next message or COMPLETE)
 * 
 * - Press A/Space: if TYPING → skip to full text. If WAITING → advance.
 * - Press B: close dialog immediately.
 * - Holding keys does NOT auto-advance (debounce in useInput prevents it).
 */
const DIALOG_STATES = { TYPING: 'TYPING', WAITING: 'WAITING', COMPLETE: 'COMPLETE' };

export default function DialogBox({ messages = [], onComplete = () => {}, speed = 30 }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [dialogState, setDialogState] = useState(DIALOG_STATES.TYPING);
  const timerRef = useRef(null);
  const charIndex = useRef(0);
  const completeCalled = useRef(false);

  const currentMessage = messages[msgIndex] || '';
  const cleanMsg = currentMessage.replace(/\[PAUSE:\d+\]/g, '');

  // Type character by character
  useEffect(() => {
    setDisplayText('');
    setDialogState(DIALOG_STATES.TYPING);
    charIndex.current = 0;

    if (!cleanMsg) return;

    timerRef.current = setInterval(() => {
      charIndex.current++;
      if (charIndex.current >= cleanMsg.length) {
        setDisplayText(cleanMsg);
        setDialogState(DIALOG_STATES.WAITING);
        clearInterval(timerRef.current);
      } else {
        setDisplayText(cleanMsg.slice(0, charIndex.current));
      }
    }, 1000 / speed);

    return () => clearInterval(timerRef.current);
  }, [msgIndex, cleanMsg, speed]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const advance = useCallback(() => {
    if (completeCalled.current) return;

    if (dialogState === DIALOG_STATES.TYPING) {
      // Skip to full text
      clearInterval(timerRef.current);
      setDisplayText(cleanMsg);
      setDialogState(DIALOG_STATES.WAITING);
    } else if (dialogState === DIALOG_STATES.WAITING) {
      if (msgIndex < messages.length - 1) {
        // Go to next message
        setMsgIndex(i => i + 1);
        // State resets to TYPING in the useEffect above
      } else {
        // Last message — close dialog
        setDialogState(DIALOG_STATES.COMPLETE);
        completeCalled.current = true;
        onComplete();
      }
    }
    // If COMPLETE, do nothing (dialog is closing)
  }, [dialogState, msgIndex, messages.length, onComplete, cleanMsg]);

  const forceClose = useCallback(() => {
    if (completeCalled.current) return;
    clearInterval(timerRef.current);
    setDialogState(DIALOG_STATES.COMPLETE);
    completeCalled.current = true;
    onComplete();
  }, [onComplete]);

  useInput((action) => {
    if (action === 'A') {
      advance();
    }
    if (action === 'B') {
      forceClose();
    }
  }, [advance, forceClose]);

  return (
    <div className="dialog-box-fullscreen" onClick={advance}>
      <div className="dialog-text-fs">
        {displayText.replace(/\[PLAYER_NAME\]/g, 'HEYTT')}
      </div>
      {dialogState === DIALOG_STATES.WAITING && (
        <div className="dialog-arrow-fs">▼</div>
      )}
    </div>
  );
}
