# 🎮 Pokémon Portfolio

A **Pokémon Red-inspired portfolio website** built entirely in React + Canvas. Instead of a traditional portfolio, visitors explore a pixel-art town, interact with NPCs, read signs, and discover projects, skills, and experience — all through the lens of a classic Game Boy RPG.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Canvas](https://img.shields.io/badge/Canvas-2D-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Pixel-art overworld** — 30×25 tile town with trees, houses, fences, water, caves, and tall grass — all sprites generated programmatically via Canvas
- **NPC interactions** — 9 unique NPCs with witty, humorous dialog praising achievements
- **Pokédex-style project viewer** — Browse 15 real projects with tech stacks and descriptions
- **Skill badges** — Organized by type (Fire/Web Dev, Water/Backend, Electric/DevOps, Psychic/AI-ML, Grass/Languages, Steel/Robotics)
- **Career route** — Experience timeline styled as a Pokémon route with landmarks
- **Wild encounters** — Walk through tall grass to trigger battle-style encounters with fun facts and achievements
- **Trainer card** — Intro sequence with animated trainer card showing name, role, and specialty
- **Full keyboard + mobile controls** — WASD/Arrows to move, Z/Space/Enter to interact, X/Escape to exit dialogs, Shift for menu
- **Responsive** — Scales to any screen size with mobile D-pad and A/B buttons

## 🕹️ Controls

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move | WASD / Arrow Keys | D-Pad |
| Interact / Advance dialog | Z / Space / Enter | A Button |
| Exit dialog / Back | X / Escape / Backspace | B Button |
| Pause menu | Shift | B Button |

## 🏗️ Tech Stack

- **React 18** + **Vite** — Fast dev server and optimized builds
- **HTML5 Canvas** — All sprites, tiles, and characters generated programmatically (zero image assets)
- **Zustand** — Lightweight state management for game state, screens, encounters
- **Framer Motion** — Screen transitions (fade, wipe, flash)
- **Press Start 2P** — Authentic retro pixel font

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/heytt-satra/pokemon-portfolio.git
cd pokemon-portfolio

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # DialogBox, ScreenManager
├── data/             # mapData, encounterData, projects, experience, skills
├── engine/           # spriteGenerator (all pixel art generated in code)
├── hooks/            # useInput (universal keyboard/touch/gamepad hook)
├── screens/          # Boot, Title, Intro, Overworld, Encounter, Skills, Projects, Experience, About, Contact, Collection
├── store/            # Zustand game store
└── index.css         # Global styles
```

## 🎯 About the Developer

**Heytt Satra** — AI/ML & Software Engineer

- 🔥 Builds software that matters and changes lives
- 🚀 Published researcher (CRC Press, Taylor & Francis)
- 🤖 Co-founded Team Kosmos (Mars Rover team — 9th IRC, Emerging Team of Year)
- 🏭 Associate SWE Intern @ Accenture
- 🌐 Shipped 3 production websites in one summer

## 📄 License

MIT — feel free to fork and make your own Pokémon-style portfolio!
