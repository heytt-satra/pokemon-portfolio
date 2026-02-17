import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  FADE: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  },
  WIPE: {
    initial: { clipPath: 'inset(0 100% 100% 0)' },
    animate: { clipPath: 'inset(0 0% 0% 0)' },
    exit: { clipPath: 'inset(0 0% 0% 0)', opacity: 0 },
    transition: { duration: 0.3 },
  },
  FLASH: {
    initial: { opacity: 0 },
    animate: { opacity: 1, backgroundColor: '#fff' },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
};

export default function TransitionOverlay({ type = 'WIPE', active }) {
  if (!active) return null;

  const v = variants[type] || variants.WIPE;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="transition-overlay"
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
          transition={v.transition}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: type === 'FLASH' ? '#FFFFFF' : '#0F0F0F',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}
