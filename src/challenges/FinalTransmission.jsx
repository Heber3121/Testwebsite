import { useState, useEffect, useRef } from 'react'
import { glitchify } from '../utils/helpers'

const TOTAL_STAGES = 5

const FULL_MESSAGE = `CLASSIFIED — EYES ONLY

MISSION DESIGNATION: NEXUS EXTRACTION
CLEARANCE LEVEL: OMEGA

ALL INTELLIGENCE SUCCESSFULLY EXTRACTED AND VERIFIED.

CONFIRMED ASSETS:
  · ACCESS CODES: Alpha-7 · Bravo-3 · Charlie-9
  · FACILITY LOCATION: 51.5074° N, 0.1278° W — sublevel 3
  · OPERATIVE STATUS: PHANTOM · ECHO · VECTOR — standing by
  · MISSION TIMELINE: Operation launches 03:00 hrs · T-72h

AGENT STATUS: ELITE — MISSION COMPLETE

You infiltrated a classified network, solved five encrypted
challenges, and extracted all intelligence without detection.

You have proven your capabilities as a NEXUS operative.
Stand by for extraction. Command out.

END TRANSMISSION`

/**
 * Animated decrypt reveal — click through 5 stages to expose the full message.
 * No fail state. This is the final reward for completing all other challenges.
 */
export default function FinalTransmission({ challenge, onComplete, onExit }) {
  const [stage, setStage]         = useState(0)           // 0 = fully encrypted → 5 = fully revealed
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const intervalRef = useRef(null)

  // Generate text display based on current stage
  function renderText(currentStage) {
    const revealFraction = currentStage / TOTAL_STAGES
    return glitchify(FULL_MESSAGE, revealFraction)
  }

  // Update display text with glitch animation effect
  useEffect(() => {
    setDisplayText(renderText(0))
  }, []) // renderText is stable (no deps)

  // Glitch animation loop while partially revealed
  useEffect(() => {
    if (stage > 0 && stage < TOTAL_STAGES) {
      intervalRef.current = setInterval(() => {
        setDisplayText(renderText(stage))
      }, 100)
    } else if (stage === TOTAL_STAGES) {
      clearInterval(intervalRef.current)
      setDisplayText(FULL_MESSAGE)
    }

    return () => clearInterval(intervalRef.current)
  }, [stage])

  async function handleDecrypt() {
    if (isAnimating || stage >= TOTAL_STAGES) return
    setIsAnimating(true)

    const nextStage = stage + 1
    setStage(nextStage)

    // Brief animation delay
    await new Promise((r) => setTimeout(r, 800))
    setIsAnimating(false)

    if (nextStage === TOTAL_STAGES) {
      await new Promise((r) => setTimeout(r, 1000))
      setShowSuccess(true)
    }
  }

  if (showSuccess) {
    return (
      <div className="challenge-success" role="dialog" aria-modal="true" aria-label="Final transmission decrypted">
        <div className="success-icon" aria-hidden="true">🎉</div>
        <h2 className="success-title" style={{ color: 'var(--amber)', textShadow: 'var(--glow-amber)' }}>
          TRANSMISSION DECRYPTED
        </h2>
        <p className="success-subtitle font-display">
          MISSION BRIEFING — FULLY EXTRACTED
        </p>
        <div className="success-intel-box" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <p className="success-intel-label font-display" style={{ color: 'var(--amber)' }}>
            FINAL INTEL
          </p>
          <p className="success-intel-text">{challenge.intel}</p>
        </div>
        <div className="success-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onComplete(challenge.id)}
            id="reward-unlock"
            autoFocus
            style={{
              borderColor: 'var(--amber)',
              color: 'var(--amber)',
              boxShadow: 'var(--glow-amber)',
            }}
          >
            🏆 MISSION COMPLETE
          </button>
        </div>
      </div>
    )
  }

  const pct = Math.round((stage / TOTAL_STAGES) * 100)

  const textClass = stage === 0
    ? 'encrypted'
    : stage === TOTAL_STAGES
    ? 'revealed'
    : 'decrypting'

  return (
    <div className="challenge-wrapper">
      <header className="challenge-header">
        <div className="challenge-meta">
          <p className="challenge-label font-display">⬡ FINAL MISSION</p>
          <h1
            className="challenge-title"
            style={{ color: 'var(--amber)' }}
          >
            {challenge.title}
          </h1>
          <p className="challenge-subtitle-text">{challenge.subtitle}</p>
        </div>
        <button className="btn btn-ghost" onClick={onExit} id="challenge-back">← ABORT</button>
      </header>

      <p
        className="challenge-desc"
        style={{ borderLeftColor: 'var(--amber)' }}
      >
        {challenge.description}
      </p>

      <div className="final-transmission">
        {/* Terminal display */}
        <div
          className="transmission-terminal"
          role="region"
          aria-label="Encrypted transmission terminal"
          aria-live="polite"
        >
          <div className="terminal-header" aria-hidden="true">
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <span className="terminal-title font-mono">
              NEXUS//OMEGA//TRANSMISSION
            </span>
          </div>
          <div className="terminal-body">
            <pre
              className={`terminal-text ${textClass}`}
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              aria-label={
                stage === TOTAL_STAGES
                  ? 'Decrypted transmission: ' + FULL_MESSAGE
                  : 'Encrypted transmission — decrypting...'
              }
            >
              {displayText || renderText(0)}
            </pre>
          </div>
        </div>

        {/* Decrypt progress bar */}
        <div className="decrypt-progress">
          <div className="decrypt-label font-display">
            DECRYPTION: {pct}%
          </div>
          <div
            className="decrypt-bar-track"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Decryption progress: ${pct}%`}
          >
            <div className="decrypt-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="decrypt-label font-mono" style={{ fontSize: '0.65rem' }}>
            {stage}/{TOTAL_STAGES} LAYERS DECRYPTED
          </div>
        </div>

        {/* Decrypt button */}
        {stage < TOTAL_STAGES && (
          <button
            className={`btn btn-primary btn-lg ${isAnimating ? 'animate-pulse' : ''}`}
            onClick={handleDecrypt}
            disabled={isAnimating}
            id="decrypt-button"
            aria-label={`Decrypt layer ${stage + 1} of ${TOTAL_STAGES}`}
            style={{
              borderColor: 'var(--amber)',
              color: 'var(--amber)',
              boxShadow: 'var(--glow-amber)',
            }}
          >
            {isAnimating
              ? '[ DECRYPTING... ]'
              : `[ DECRYPT LAYER ${stage + 1}/${TOTAL_STAGES} ]`}
          </button>
        )}

        {stage === TOTAL_STAGES && (
          <p className="font-display text-center animate-pulse" style={{ color: 'var(--amber)', fontSize: '0.75rem', letterSpacing: '0.3em' }}>
            TRANSMISSION FULLY DECRYPTED — COLLECTING INTEL…
          </p>
        )}
      </div>
    </div>
  )
}
