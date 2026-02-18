import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useGameStore from '../store/useGameStore';
import { playTrack, stopMusic, toggleMute, isMuted } from '../engine/musicEngine';
import BootScreen from '../screens/BootScreen';
import TitleScreen from '../screens/TitleScreen';
import IntroSequence from '../screens/IntroSequence';
import Overworld from '../screens/Overworld';
import EncounterScreen from '../screens/EncounterScreen';
import CollectionScreen from '../screens/CollectionScreen';
import SkillsScreen from '../screens/SkillsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

const transitions = {
  FADE: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  WIPE: {
    initial: { clipPath: 'inset(0 0 100% 0)' },
    animate: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.5 } },
    exit: { clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.4 } },
  },
  FLASH: {
    initial: { opacity: 0, filter: 'brightness(3)' },
    animate: { opacity: 1, filter: 'brightness(1)', transition: { duration: 0.5 } },
    exit: { opacity: 0, filter: 'brightness(3)', transition: { duration: 0.3 } },
  },
};

// Map screens to music tracks
const SCREEN_TRACKS = {
  boot: 'gamefreak',     // Game Freak logo music
  title: 'title',
  intro: 'intro',
  overworld: 'overworld',
  encounter: 'encounter',
  collection: 'menu',
  skills: 'menu',
  projects: 'menu',
  experience: 'menu',
  about: 'menu',
  contact: 'menu',
};

export default function ScreenManager() {
  const { screen, transition } = useGameStore();
  const setScreen = useGameStore((s) => s.setScreen);
  const [muted, setMuted] = useState(isMuted());

  // Play the right music track when screen changes
  useEffect(() => {
    const track = SCREEN_TRACKS[screen];
    if (track) {
      playTrack(track);
    } else {
      stopMusic();
    }
  }, [screen]);

  const handleMuteToggle = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  const screens = {
    boot: <BootScreen setScreen={setScreen} />,
    title: <TitleScreen setScreen={setScreen} />,
    intro: <IntroSequence setScreen={setScreen} />,
    overworld: <Overworld setScreen={setScreen} />,
    encounter: <EncounterScreen setScreen={setScreen} />,
    collection: <CollectionScreen setScreen={setScreen} />,
    skills: <SkillsScreen setScreen={setScreen} />,
    projects: <ProjectsScreen setScreen={setScreen} />,
    experience: <ExperienceScreen setScreen={setScreen} />,
    about: <AboutScreen setScreen={setScreen} />,
    contact: <ContactScreen setScreen={setScreen} />,
  };

  const t = transitions[transition] || transitions.FADE;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0F0F0F' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={t.initial}
          animate={t.animate}
          exit={t.exit}
          style={{ position: 'absolute', inset: 0 }}
        >
          {screens[screen] || screens.boot}
        </motion.div>
      </AnimatePresence>

      {/* Mute / Unmute toggle */}
      <button
        onClick={handleMuteToggle}
        className="music-toggle-btn"
        title={muted ? 'Unmute Music' : 'Mute Music'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
