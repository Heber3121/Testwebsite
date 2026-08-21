import { useGameState } from './hooks/useGameState'
import { CHALLENGES } from './utils/gameData'

// Components
import ParticleCanvas       from './components/ParticleCanvas'
import Navigation           from './components/Navigation'
import AchievementToast     from './components/AchievementToast'
import EasterEgg            from './components/EasterEgg'

// Sections
import HeroSection          from './sections/HeroSection'
import OnboardingSection    from './sections/OnboardingSection'
import HubSection           from './sections/HubSection'
import AchievementsSection  from './sections/AchievementsSection'
import CompletionSection    from './sections/CompletionSection'

// Challenges
import CodeBreaker          from './challenges/CodeBreaker'
import DataVault            from './challenges/DataVault'
import MindSync             from './challenges/MindSync'
import SignalBoost          from './challenges/SignalBoost'
import FinalTransmission    from './challenges/FinalTransmission'

/** Maps challenge id → challenge component */
const CHALLENGE_MAP = {
  code_breaker:        CodeBreaker,
  data_vault:          DataVault,
  mind_sync:           MindSync,
  signal_boost:        SignalBoost,
  final_transmission:  FinalTransmission,
}

export default function App() {
  const game = useGameState()

  // Determine which challenge component to render
  const ActiveChallenge = game.currentChallenge
    ? CHALLENGE_MAP[game.currentChallenge]
    : null

  const activeChallengeData = game.currentChallenge
    ? CHALLENGES.find((c) => c.id === game.currentChallenge)
    : null

  return (
    <>
      {/* Background particles (visible on all screens) */}
      <ParticleCanvas />

      {/* Persistent navigation */}
      <Navigation
        phase={game.phase}
        completedChallenges={game.completedChallenges}
        onOpenGallery={game.openGallery}
      />

      {/* Achievement toast notification */}
      <AchievementToast
        achievement={game.pendingToast}
        onDismiss={game.dismissToast}
      />

      {/* Easter egg Konami code listener */}
      <EasterEgg
        onFound={game.findEasterEgg}
        alreadyFound={game.easterEggFound}
      />

      {/* ── Phase routing ─────────────────────────────────────────────────── */}

      {game.phase === 'intro' && (
        <HeroSection onStart={game.startExperience} />
      )}

      {game.phase === 'onboarding' && (
        <OnboardingSection onInitialize={game.initializeAgent} />
      )}

      {game.phase === 'hub' && (
        <HubSection
          playerName={game.playerName}
          completedChallenges={game.completedChallenges}
          onEnterChallenge={game.enterChallenge}
          onOpenGallery={game.openGallery}
          onGoToCompletion={game.goToCompletion}
        />
      )}

      {game.phase === 'challenge' && ActiveChallenge && activeChallengeData && (
        <ActiveChallenge
          challenge={activeChallengeData}
          onComplete={game.completeChallenge}
          onExit={game.exitChallenge}
        />
      )}

      {game.phase === 'gallery' && (
        <AchievementsSection
          completedChallenges={game.completedChallenges}
          unlockedAchievements={game.unlockedAchievements}
          onBack={game.closeGallery}
        />
      )}

      {game.phase === 'complete' && (
        <CompletionSection
          playerName={game.playerName}
          unlockedAchievements={game.unlockedAchievements}
          elapsedMs={game.elapsedMs}
          onRestart={game.restartGame}
          onOpenGallery={game.openGallery}
        />
      )}
    </>
  )
}
