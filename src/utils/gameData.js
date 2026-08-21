// ─── CHALLENGES ─────────────────────────────────────────────────────────────
export const CHALLENGES = [
  {
    id: 'code_breaker',
    title: 'CODE BREAKER',
    subtitle: 'Pattern Recognition Protocol',
    description:
      'The enemy encrypted their access codes with a colour-sequence cipher. Memorise the pattern, then replay it perfectly to extract the key.',
    difficulty: 'MODERATE',
    icon: '⬡',
    color: '#00f5ff',
    achievementId: 'code_master',
    intel:
      'ACCESS CODES EXTRACTED → Alpha-7 · Bravo-3 · Charlie-9. Secondary firewall bypass confirmed.',
  },
  {
    id: 'data_vault',
    title: 'DATA VAULT',
    subtitle: 'Hidden Intelligence Recovery',
    description:
      'Classified intel is scattered across an encrypted vault. Match the symbol pairs before the system wipes the session.',
    difficulty: 'EASY',
    icon: '◈',
    color: '#7c3aed',
    achievementId: 'vault_cracker',
    intel:
      'FACILITY COORDINATES RECOVERED → 51.5074° N, 0.1278° W. Target building: sublevel 3.',
  },
  {
    id: 'mind_sync',
    title: 'MIND SYNC',
    subtitle: 'Identity Verification Protocol',
    description:
      'The network requires proof of intelligence before granting access. Answer 5 encrypted knowledge probes correctly to authenticate.',
    difficulty: 'MODERATE',
    icon: '◉',
    color: '#f59e0b',
    achievementId: 'mind_synced',
    intel:
      'ASSETS VERIFIED → Three operatives in position. Codenames: PHANTOM · ECHO · VECTOR.',
  },
  {
    id: 'signal_boost',
    title: 'SIGNAL BOOST',
    subtitle: 'Frequency Calibration Protocol',
    description:
      'An encrypted transmission is broadcasting on a hidden frequency. Tune the receiver to the exact wavelength and lock the signal.',
    difficulty: 'HARD',
    icon: '◊',
    color: '#10b981',
    achievementId: 'signal_locked',
    intel:
      'TIMING CONFIRMED → Operation launches at 03:00 hours. T-minus 72 hours from current timestamp.',
  },
  {
    id: 'final_transmission',
    title: 'FINAL TRANSMISSION',
    subtitle: 'Mission Briefing Decryption',
    description:
      'You have all the intel. One final encrypted transmission holds the complete mission briefing. Decrypt it layer by layer.',
    difficulty: 'LEGENDARY',
    icon: '❋',
    color: '#ef4444',
    achievementId: null,
    intel:
      'MISSION COMPLETE → All classified data extracted successfully. Report to command immediately.',
  },
]

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  {
    id: 'first_contact',
    name: 'FIRST CONTACT',
    description: 'Complete your first mission',
    icon: '🎯',
    rarity: 'COMMON',
  },
  {
    id: 'code_master',
    name: 'CODE MASTER',
    description: 'Complete the Code Breaker challenge',
    icon: '🔐',
    rarity: 'UNCOMMON',
  },
  {
    id: 'vault_cracker',
    name: 'VAULT CRACKER',
    description: 'Complete the Data Vault challenge',
    icon: '🗝️',
    rarity: 'UNCOMMON',
  },
  {
    id: 'mind_synced',
    name: 'MIND SYNCED',
    description: 'Complete the Mind Sync challenge',
    icon: '🧠',
    rarity: 'UNCOMMON',
  },
  {
    id: 'signal_locked',
    name: 'SIGNAL LOCKED',
    description: 'Complete the Signal Boost challenge',
    icon: '📡',
    rarity: 'UNCOMMON',
  },
  {
    id: 'perfect_mind',
    name: 'PERFECT SYNC',
    description: 'Answer all 5 Mind Sync questions correctly',
    icon: '⭐',
    rarity: 'RARE',
  },
  {
    id: 'speed_run',
    name: 'SPEED RUNNER',
    description: 'Complete all 5 challenges in under 8 minutes',
    icon: '⚡',
    rarity: 'RARE',
  },
  {
    id: 'all_intel',
    name: 'ALL INTEL',
    description: 'Collect all classified intel — mission complete',
    icon: '🏆',
    rarity: 'LEGENDARY',
  },
  {
    id: 'ghost_protocol',
    name: 'GHOST PROTOCOL',
    description: 'You found the hidden sequence…',
    icon: '👻',
    rarity: 'SECRET',
  },
]

// ─── QUIZ QUESTIONS ──────────────────────────────────────────────────────────
export const QUIZ_QUESTIONS = [
  {
    question: 'Which planet in our solar system has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 1,
    fact: 'Saturn has 146 confirmed moons as of 2024 — more than any other planet.',
  },
  {
    question: 'What percentage of the observable universe is dark matter and dark energy?',
    options: ['Around 30%', 'Around 50%', 'Around 68%', 'Around 95%'],
    correct: 3,
    fact: 'Roughly 95% of the universe is dark energy (~68%) and dark matter (~27%). Ordinary matter is just ~5%.',
  },
  {
    question: 'Which element has the chemical symbol "Au"?',
    options: ['Silver', 'Aluminum', 'Gold', 'Argon'],
    correct: 2,
    fact: '"Au" comes from the Latin "Aurum", meaning gold.',
  },
  {
    question: 'Approximately how many times does light travel around the Earth per second?',
    options: ['1 time', '7.5 times', '30 times', '100 times'],
    correct: 1,
    fact: 'Light travels at ~299,792 km/s. Earth\'s circumference is ~40,075 km. That\'s ~7.5 laps per second.',
  },
  {
    question: 'What was the first message sent over ARPANET — the predecessor to the internet?',
    options: ['"Hello, World"', '"LO" (a partial crash)', '"SYN"', '"test 1 2 3"'],
    correct: 1,
    fact: 'In 1969, the first message was "LOGIN" but the system crashed after "LO". The internet\'s first word was accidental.',
  },
]

// ─── RARITY COLOURS ──────────────────────────────────────────────────────────
export const RARITY_COLORS = {
  COMMON: '#94a3b8',
  UNCOMMON: '#10b981',
  RARE: '#7c3aed',
  LEGENDARY: '#f59e0b',
  SECRET: '#00f5ff',
}
