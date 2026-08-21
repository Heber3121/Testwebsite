# NEXUS — Digital Intelligence Experience

> A premium interactive game-website built with React + Vite. Five classified missions, nine achievements, one hidden easter egg, and a fully gamified user journey.

---

## ✨ Features

- **5 Playable Mini-Game Challenges**
  - **Code Breaker** — Simon Says pattern memory game (3 rounds)
  - **Data Vault** — 6-pair memory matching card game
  - **Mind Sync** — 5-question knowledge quiz (pass 3/5)
  - **Signal Boost** — Frequency slider tuning game
  - **Final Transmission** — 5-stage decrypt reveal sequence

- **Achievement System** — 9 achievements including a hidden easter egg
- **Intel Gallery** — Collect and review classified intel from completed missions
- **Progress Tracking** — Visual progress bar and nav-dot indicators
- **Konami Code Easter Egg** — `↑ ↑ ↓ ↓ ← → ← → B A`
- **Completion Screen** — Time tracking, full mission briefing, celebration confetti
- **Animated Particle Background** — Canvas-drawn particle network
- **Glitch Text Effects** — CSS pseudo-element glitch on the hero title
- **Responsive** — Mobile-first, touch-friendly, works on all screen sizes

---

## 🛠 Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool + dev server |
| Vanilla CSS | — | Styling (custom properties, keyframes) |
| Canvas API | — | Particle background |

No external CSS frameworks. No runtime animation libraries. All styling and motion is hand-crafted CSS.

---

## 🚀 Quick Start

### Requirements
- **Node.js** ≥ 18
- **npm** ≥ 9

### Install

```bash
git clone https://github.com/YOUR_USERNAME/nexus-experience.git
cd nexus-experience
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production build

```bash
npm run build
```

Output goes to the `dist/` directory.

### Preview the production build locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
nexus-experience/
├── public/
│   └── favicon.svg              # SVG favicon (hexagonal NEXUS icon)
├── src/
│   ├── components/
│   │   ├── AchievementToast.jsx # Slide-in achievement notification
│   │   ├── EasterEgg.jsx        # Konami code listener + popup
│   │   ├── GlitchText.jsx       # CSS glitch text animation wrapper
│   │   ├── Navigation.jsx       # Fixed top nav with progress dots
│   │   └── ParticleCanvas.jsx   # Animated canvas particle background
│   ├── challenges/
│   │   ├── CodeBreaker.jsx      # Simon Says memory game
│   │   ├── DataVault.jsx        # Memory card matching game
│   │   ├── FinalTransmission.jsx# Decrypt reveal sequence
│   │   ├── MindSync.jsx         # Multiple-choice quiz
│   │   └── SignalBoost.jsx      # Frequency slider game
│   ├── sections/
│   │   ├── AchievementsSection.jsx # Intel & achievement gallery
│   │   ├── CompletionSection.jsx   # Mission complete screen
│   │   ├── HeroSection.jsx         # Landing hero with animated title
│   │   ├── HubSection.jsx          # Challenge selection hub
│   │   └── OnboardingSection.jsx   # Agent name registration
│   ├── hooks/
│   │   └── useGameState.js      # Central game state hook
│   ├── utils/
│   │   ├── gameData.js          # Challenges, achievements, quiz questions
│   │   └── helpers.js           # shuffle, formatTime, glitchify, etc.
│   ├── styles/
│   │   └── globals.css          # All styles (design tokens, keyframes, components)
│   ├── App.jsx                  # Root — phase router
│   └── main.jsx                 # React entry point
├── index.html                   # HTML shell with SEO & Google Fonts
├── vite.config.js               # Vite config with code-splitting
├── .eslintrc.cjs                # ESLint config
├── .gitignore
└── README.md
```

---

## 🎮 Game Flow

```
[Hero]  →  [Onboarding]  →  [Hub]  →  [Challenge x5]  →  [Gallery]  →  [Complete]
               ↑                ↑_____________↑
               |                     (can replay or try others)
         Enter codename
```

1. **Hero** — Glitch-animated title, animated counters, `ENTER THE NEXUS` CTA
2. **Onboarding** — Typewriter briefing, codename input
3. **Hub** — Challenge grid, progress bar, intel preview (unlocked intel)
4. **Challenge** — One of 5 mini-games (all with lives/retry and success overlays)
5. **Gallery** — Intel collected + achievement badges (accessible at any time via nav)
6. **Complete** — Full mission briefing, stats, confetti, achievements earned

---

## 🏆 Achievements

| Achievement | Trigger | Rarity |
|------------|---------|--------|
| FIRST CONTACT | Complete first challenge | Common |
| CODE MASTER | Complete Code Breaker | Uncommon |
| VAULT CRACKER | Complete Data Vault | Uncommon |
| MIND SYNCED | Complete Mind Sync | Uncommon |
| SIGNAL LOCKED | Complete Signal Boost | Uncommon |
| PERFECT SYNC ⭐ | 5/5 on Mind Sync quiz | Rare |
| SPEED RUNNER ⚡ | All 5 in under 8 min | Rare |
| ALL INTEL 🏆 | Complete all 5 | Legendary |
| GHOST PROTOCOL 👻 | Enter Konami code | Secret |

**Konami Code:** `↑ ↑ ↓ ↓ ← → ← → B A`

---

## 🎨 Customising Content

### Change challenge data
Edit `src/utils/gameData.js`:
- `CHALLENGES` — titles, descriptions, intel text, colors, difficulty
- `ACHIEVEMENTS` — icons, names, descriptions, rarity
- `QUIZ_QUESTIONS` — questions, options, correct index, fact blurb

### Change the color palette
All design tokens live at the top of `src/styles/globals.css` under `:root`. Key variables:
```css
--cyan:   #00f5ff;   /* Primary accent */
--purple: #7c3aed;   /* Secondary accent */
--amber:  #f59e0b;   /* Gold / rewards */
--green:  #10b981;   /* Success / intel */
--red:    #ef4444;   /* Danger / lives */
```

### Change the site title / SEO
Edit `index.html` — update `<title>`, `<meta description>`, and Open Graph tags.

### Add a new challenge
1. Create `src/challenges/YourChallenge.jsx` — follow the pattern of existing challenges. Props: `{ challenge, onComplete, onExit }`.
2. Add the entry to `CHALLENGES` in `src/utils/gameData.js`.
3. Add the mapping in `CHALLENGE_MAP` in `src/App.jsx`.

---

## 📦 Deployment

### Netlify / Vercel (recommended)

Both platforms auto-detect Vite. Set:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 18+

### GitHub Pages (with `vite-plugin-gh-pages`)

```bash
npm install --save-dev vite-plugin-gh-pages
# add the plugin to vite.config.js, then:
npm run build && npm run deploy
```

Or use the [GitHub Actions Vite workflow](https://vitejs.dev/guide/static-deploy.html#github-pages).

### Manual / Any static host

```bash
npm run build
# Upload the contents of dist/ to your host
```

---

## 🔧 Adding Google Tag Manager (GTM)

When you're ready to add GTM, paste the GTM `<script>` snippet into `index.html`'s `<head>`. All interactive elements already have meaningful IDs and labels for easy event targeting:

| Element | ID | Description |
|---------|----|----|
| Start Experience button | `start-experience` | Hero CTA |
| Agent form | `agent-registration-form` | Onboarding form |
| Initialize button | `initialize-agent` | Onboarding submit |
| Challenge cards | `challenge-card-{id}` | Hub cards |
| Nav gallery | `nav-gallery` | Gallery button in nav |
| Explore button | `explore-button` | Hub gallery button |
| Challenge back | `challenge-back` | Abort challenge |
| Challenge complete | `challenge-complete` | Collect intel button |
| Quiz submit | `quiz-submit` | Next/submit in quiz |
| Signal lock | `signal-lock` | Lock frequency button |
| Decrypt button | `decrypt-button` | Final transmission decrypt |
| Reward unlock | `reward-unlock` | Final mission complete |
| Complete mission | `complete-mission` | Hub final CTA |
| Explore again | `explore-again` | Restart button |
| Achievement toast | `achievement-toast` | Toast notification |
| Easter egg popup | `easter-egg-popup` | Ghost Protocol reveal |

---

## 📜 License

MIT — use freely for personal and commercial projects.

---

*Built with React 18 + Vite 5. No external UI libraries. No tracking scripts.*
