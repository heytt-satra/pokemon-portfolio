import { useState, useEffect, useRef, useCallback } from 'react';
import useInput from '../hooks/useInput';

/**
 * Fullscreen dialog box — renders at bottom of viewport.
 * Text types character by character. Press A/Space/Enter to advance or skip.
 */
export default function DialogBox({ messages = [], onComplete = () => {}, speed = 30 }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef(null);
  const charIndex = useRef(0);

  const currentMessage = messages[msgIndex] || '';

  // Type character by character
  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    charIndex.current = 0;

    if (!currentMessage) return;

    // Handle [PAUSE:ms] tokens
    const cleanMsg = currentMessage.replace(/\[PAUSE:\d+\]/g, '');

    timerRef.current = setInterval(() => {
      charIndex.current++;
      if (charIndex.current >= cleanMsg.length) {
        setDisplayText(cleanMsg);
        setIsTyping(false);
        clearInterval(timerRef.current);
      } else {
        setDisplayText(cleanMsg.slice(0, charIndex.current));
      }
    }, 1000 / speed);

    return () => clearInterval(timerRef.current);
  }, [msgIndex, currentMessage, speed]);

  const advance = useCallback(() => {
    if (isTyping) {
      // Skip to full text
      clearInterval(timerRef.current);
      const cleanMsg = currentMessage.replace(/\[PAUSE:\d+\]/g, '');
      setDisplayText(cleanMsg);
      setIsTyping(false);
    } else {
      // Next message or complete
      if (msgIndex < messages.length - 1) {
        setMsgIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }
  }, [isTyping, msgIndex, messages.length, onComplete, currentMessage]);

  useInput((action) => {
    if (action === 'A') {
      advance();
    }
    if (action === 'B') {
      clearInterval(timerRef.current);
      onComplete();
    }
  }, [advance, onComplete]);

  return (
    <div className="dialog-box-fullscreen" onClick={advance}>
      <div className="dialog-text-fs">
        {displayText.replace(/\[PLAYER_NAME\]/g, 'HEYTT')}
      </div>
      {!isTyping && (
        <div className="dialog-arrow-fs">▼</div>
      )}
    </div>
  );
}
