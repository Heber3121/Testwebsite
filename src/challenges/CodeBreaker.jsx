import { useState, useEffect, useCallback, useRef } from 'react'
import { sleep, randomInt } from '../utils/helpers'

const COLORS = [
  { id: 'cyan',   label: 'Cyan',   hex: '#00f5ff' },
  { id: 'purple', label: 'Purple', hex: '#7c3aed' },
  { id: 'amber',  label: 'Amber',  hex: '#f59e0b' },
  { id: 'green',  label: 'Green',  hex: '#10b981' },
]

const ROUNDS = [4, 6, 8] // sequence lengths per round
const MAX_LIVES = 3

/** Generate a random color-index sequence of given length. */
function genSequence(len) {
  return Array.from({ length: len }, () => randomInt(0, COLORS.length - 1))
}

/** Shared challenge wrapper header (title, back button, description). */
function ChallengeHeader({ challenge, onBack }) {
  return (
    <header className="challenge-header">
      <div className="challenge-meta">
        <p className="challenge-label font-display">⬡ ACTIVE MISSION</p>
        <h1 className="challenge-title">{challenge.title}</h1>
        <p className="challenge-subtitle-text">{challenge.subtitle}</p>
      </div>
      <button
        className="btn btn-ghost"
        onClick={onBack}
        id="challenge-back"
        aria-label="Abandon mission and return to hub"
      >
        ← ABORT
      </button>
    </header>
  )
}

/**
 * Simon Says pattern memory game.
 * 3 rounds with increasing sequence lengths.
 * 3 lives — losing all restarts the current round.
 */
export default function CodeBreaker({ challenge, onComplete, onExit }) {
  const [round, setRound]             = useState(0)          // 0-2
  const [sequence, setSequence]       = useState([])
  const [active, setActive]           = useState(null)       // currently lit color id
  const [phase, setPhase]             = useState('idle')     // idle | watch | input | success | fail
  const [playerSeq, setPlayerSeq]     = useState([])
  const [lives, setLives]             = useState(MAX_LIVES)
  const [inputError, setInputError]   = useState(null)       // color id that was wrong
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFail, setShowFail]       = useState(false)
  const isPlaying = useRef(false)

  // ── Start a round ──────────────────────────────────────────────────────────
  const startRound = useCallback(async (roundIdx, seq) => {
    if (isPlaying.current) return
    isPlaying.current = true

    const newSeq = seq || genSequence(ROUNDS[roundIdx])
    setSequence(newSeq)
    setPlayerSeq([])
    setPhase('watch')

    await sleep(600) // brief pause before playback

    for (const colorIdx of newSeq) {
      setActive(COLORS[colorIdx].id)
      await sleep(600)
      setActive(null)
      await sleep(200)
    }

    setPhase('input')
    isPlaying.current = false
  }, [])

  // Auto-start first round on mount
  useEffect(() => {
    startRound(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handle player tap ─────────────────────────────────────────────────────
  async function handleTap(colorIdx) {
    if (phase !== 'input') return

    // Briefly flash the tapped button
    setActive(COLORS[colorIdx].id)
    await sleep(150)
    setActive(null)

    const newPlayerSeq = [...playerSeq, colorIdx]
    const pos = newPlayerSeq.length - 1

    // Check correctness
    if (newPlayerSeq[pos] !== sequence[pos]) {
      // Wrong tap
      setInputError(COLORS[colorIdx].id)
      setPhase('idle')

      const newLives = lives - 1
      setLives(newLives)

      await sleep(600)
      setInputError(null)

      if (newLives <= 0) {
        setShowFail(true)
        return
      }

      // Replay same sequence
      setPlayerSeq([])
      startRound(round, sequence)
      return
    }

    setPlayerSeq(newPlayerSeq)

    // Completed the full sequence
    if (newPlayerSeq.length === sequence.length) {
      setPhase('idle')

      if (round < ROUNDS.length - 1) {
        // Next round
        const nextRound = round + 1
        setRound(nextRound)
        await sleep(800)
        startRound(nextRound)
      } else {
        // All rounds done — challenge complete!
        setShowSuccess(true)
      }
    }
  }

  function handleRetry() {
    setShowFail(false)
    setLives(MAX_LIVES)
    setRound(0)
    setPlayerSeq([])
    startRound(0)
  }

  if (showFail) {
    return (
      <div className="challenge-wrapper">
        <ChallengeHeader challenge={challenge} onBack={onExit} />
        <div className="challenge-fail">
          <div className="fail-icon" aria-hidden="true">💀</div>
          <h2 className="fail-title">SIGNAL LOST</h2>
          <p className="fail-desc">You ran out of attempts. The sequence reset.</p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRetry} id="challenge-retry">
              ↺ TRY AGAIN
            </button>
            <button className="btn btn-ghost" onClick={onExit} id="challenge-exit-fail">
              ← ABORT
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="challenge-success" role="dialog" aria-modal="true" aria-label="Challenge complete">
        <div className="success-icon" aria-hidden="true">🔐</div>
        <h2 className="success-title">DECODED</h2>
        <p className="success-subtitle font-display">PATTERN RECOGNITION PROTOCOL — COMPLETE</p>
        <div className="success-intel-box">
          <p className="success-intel-label font-display">INTEL EXTRACTED</p>
          <p className="success-intel-text">{challenge.intel}</p>
        </div>
        <div className="success-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onComplete(challenge.id)}
            id="challenge-complete"
            autoFocus
          >
            ✓ COLLECT INTEL
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="challenge-wrapper">
      <ChallengeHeader challenge={challenge} onBack={onExit} />

      <p className="challenge-desc">{challenge.description}</p>

      <div className="code-breaker">
        {/* Round + Lives */}
        <div
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 360 }}
        >
          <div className="round-indicator font-display">
            ROUND <span>{round + 1}</span> / {ROUNDS.length}
          </div>
          <div
            className="lives"
            role="img"
            aria-label={`${lives} of ${MAX_LIVES} lives remaining`}
          >
            {Array.from({ length: MAX_LIVES }, (_, i) => (
              <div key={i} className={`life ${i >= lives ? 'lost' : ''}`} />
            ))}
          </div>
        </div>

        {/* Status */}
        <p className="simon-status" aria-live="polite">
          {phase === 'watch' && 'MEMORISE THE SEQUENCE…'}
          {phase === 'input' && 'REPEAT THE SEQUENCE'}
          {phase === 'idle'  && 'PREPARING…'}
        </p>

        {/* Sequence progress dots */}
        <div
          className="simon-sequence-len"
          role="group"
          aria-label={`Sequence progress: ${playerSeq.length} of ${sequence.length}`}
        >
          {sequence.map((_, i) => {
            const filled  = i < playerSeq.length
            const correct = filled && playerSeq[i] === sequence[i]
            return (
              <div
                key={i}
                className={`seq-dot ${filled ? (correct ? 'correct' : 'wrong') : ''} ${i === playerSeq.length && phase === 'input' ? 'filled' : ''}`}
                aria-hidden="true"
              />
            )
          })}
        </div>

        {/* Simon buttons */}
        <div
          className="simon-grid"
          role="group"
          aria-label="Pattern input buttons"
        >
          {COLORS.map((c, idx) => (
            <button
              key={c.id}
              className={`simon-btn ${active === c.id ? 'active' : ''} ${inputError === c.id ? 'error' : ''}`}
              data-color={c.id}
              onClick={() => handleTap(idx)}
              disabled={phase !== 'input'}
              aria-label={`${c.label} button`}
              aria-pressed={active === c.id}
              style={{ cursor: phase === 'input' ? 'pointer' : 'not-allowed' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
