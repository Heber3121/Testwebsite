import { useState, useCallback } from 'react'
import { ACHIEVEMENTS, CHALLENGES } from '../utils/gameData'

/**
 * Central game-state hook.
 * All state lives here; sections/challenges receive callbacks as props.
 */
export function useGameState() {
  const [phase, setPhase] = useState('intro')           // 'intro' | 'onboarding' | 'hub' | 'challenge' | 'gallery' | 'complete'
  const [playerName, setPlayerNameState] = useState('')
  const [completedChallenges, setCompletedChallenges] = useState([]) // array of challenge ids
  const [unlockedAchievements, setUnlockedAchievements] = useState([]) // array of achievement ids
  const [currentChallenge, setCurrentChallenge] = useState(null)      // challenge id string
  const [pendingToast, setPendingToast] = useState(null)              // achievement object to show in toast
  const [startTime, setStartTime] = useState(null)
  const [easterEggFound, setEasterEggFound] = useState(false)
  const [quizPerfect, setQuizPerfect] = useState(false)

  // ── Helpers ──────────────────────────────────────────────────────────────
  const unlockAchievement = useCallback((id) => {
    const ach = ACHIEVEMENTS.find((a) => a.id === id)
    if (!ach) return
    setUnlockedAchievements((prev) => {
      if (prev.includes(id)) return prev
      setPendingToast(ach)
      return [...prev, id]
    })
  }, [])

  const dismissToast = useCallback(() => setPendingToast(null), [])

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Hero → Onboarding */
  const startExperience = useCallback(() => {
    setPhase('onboarding')
  }, [])

  /** Onboarding → Hub */
  const initializeAgent = useCallback((name) => {
    setPlayerNameState(name.trim() || 'AGENT')
    setStartTime(Date.now())
    setPhase('hub')
  }, [])

  /** Hub → Challenge */
  const enterChallenge = useCallback((id) => {
    setCurrentChallenge(id)
    setPhase('challenge')
  }, [])

  /** Back to Hub without completing */
  const exitChallenge = useCallback(() => {
    setCurrentChallenge(null)
    setPhase('hub')
  }, [])

  /** Challenge complete → back to Hub (or completion) */
  const completeChallenge = useCallback(
    (id, extras = {}) => {
      setCompletedChallenges((prev) => {
        if (prev.includes(id)) return prev
        const next = [...prev, id]

        // Challenge-specific achievement
        const challenge = CHALLENGES.find((c) => c.id === id)
        if (challenge?.achievementId) unlockAchievement(challenge.achievementId)

        // First contact
        if (next.length === 1) unlockAchievement('first_contact')

        // Perfect Mind Sync
        if (id === 'mind_sync' && extras.perfect) {
          setQuizPerfect(true)
          unlockAchievement('perfect_mind')
        }

        // All intel (all 5 challenges done)
        if (next.length === CHALLENGES.length) {
          unlockAchievement('all_intel')
          // Speed run check (8 minutes = 480 000 ms)
          if (startTime && Date.now() - startTime < 480_000) {
            unlockAchievement('speed_run')
          }
        }

        return next
      })

      setCurrentChallenge(null)
      setPhase('hub')
    },
    [unlockAchievement, startTime],
  )

  /** Hub → Achievement gallery */
  const openGallery = useCallback(() => setPhase('gallery'), [])

  /** Gallery → Hub */
  const closeGallery = useCallback(() => setPhase('hub'), [])

  /** Hub → Completion screen (only when all 5 done) */
  const goToCompletion = useCallback(() => setPhase('complete'), [])

  /** Completion → restart */
  const restartGame = useCallback(() => {
    setPhase('intro')
    setPlayerNameState('')
    setCompletedChallenges([])
    setUnlockedAchievements([])
    setCurrentChallenge(null)
    setPendingToast(null)
    setStartTime(null)
    setEasterEggFound(false)
    setQuizPerfect(false)
  }, [])

  /** Konami code easter egg */
  const findEasterEgg = useCallback(() => {
    if (!easterEggFound) {
      setEasterEggFound(true)
      unlockAchievement('ghost_protocol')
    }
  }, [easterEggFound, unlockAchievement])

  const elapsedMs = startTime ? Date.now() - startTime : 0

  return {
    // State
    phase,
    playerName,
    completedChallenges,
    unlockedAchievements,
    currentChallenge,
    pendingToast,
    easterEggFound,
    elapsedMs,
    quizPerfect,
    allComplete: completedChallenges.length === CHALLENGES.length,
    // Actions
    startExperience,
    initializeAgent,
    enterChallenge,
    exitChallenge,
    completeChallenge,
    openGallery,
    closeGallery,
    goToCompletion,
    restartGame,
    findEasterEgg,
    dismissToast,
  }
}
