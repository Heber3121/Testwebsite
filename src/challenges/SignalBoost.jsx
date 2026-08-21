import { useState } from 'react'
import { randomInt, clamp } from '../utils/helpers'

const MAX_LIVES    = 3
const TARGET_WIDTH = 12 // percentage width of the target zone
const BAR_COUNT    = 40  // waveform bars

/** Generate a new target zone [min, max] in the 10–80 range. */
function genTarget() {
  const min = randomInt(10, 88 - TARGET_WIDTH)
  return { min, max: min + TARGET_WIDTH }
}

/** How "close" is a value to the target? Returns 'perfect'|'hot'|'warm'|'cold'. */
function proximity(value, target) {
  const center = (target.min + target.max) / 2
  const dist   = Math.abs(value - center)
  if (value >= target.min && value <= target.max) return 'perfect'
  if (dist <= 15) return 'hot'
  if (dist <= 30) return 'warm'
  return 'cold'
}

/** Animated waveform using CSS animation delays. */
function Waveform({ frequency }) {
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const phase = (i / BAR_COUNT) * Math.PI * 2
    const height = 20 + Math.sin(phase + frequency * 0.05) * 40 + Math.random() * 10
    return clamp(height, 5, 80)
  })

  return (
    <div
      className="signal-canvas-wrap"
      aria-hidden="true"
      role="presentation"
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className="signal-bar"
          style={{
            height: `${h}%`,
            animationName: 'waveform',
            animationDuration: `${0.5 + (i % 7) * 0.1}s`,
            animationDelay: `${(i * 0.02).toFixed(2)}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: i % 2 === 0 ? 'alternate' : 'alternate-reverse',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Frequency tuner challenge.
 * Slide to the correct frequency range to intercept the transmission.
 * 3 lives. Target zone is hidden but a hot/cold indicator guides the player.
 */
export default function SignalBoost({ challenge, onComplete, onExit }) {
  const [target]        = useState(genTarget)
  const [frequency, setFrequency] = useState(50)
  const [lives, setLives]         = useState(MAX_LIVES)
  const [lockResult, setLockResult] = useState(null)  // null | 'success' | 'fail'
  const [phase, setPhase]           = useState('tuning') // tuning | locked
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFail, setShowFail]       = useState(false)
  const [attempts, setAttempts]       = useState(0)

  const prox = proximity(frequency, target)

  const hotcoldLabel = {
    perfect: '⬡ IN RANGE',
    hot:     '▲ VERY CLOSE',
    warm:    '△ GETTING CLOSER',
    cold:    '— OFF TARGET',
  }[prox]

  const hotcoldColor = {
    perfect: 'var(--green)',
    hot:     'var(--amber)',
    warm:    '#3b82f6',
    cold:    'var(--text-muted)',
  }[prox]

  function handleSlider(e) {
    if (phase !== 'tuning') return
    setFrequency(Number(e.target.value))
  }

  async function handleLock() {
    if (phase !== 'tuning') return
    setPhase('locked')
    setAttempts((a) => a + 1)

    await new Promise((r) => setTimeout(r, 600))

    if (prox === 'perfect') {
      setLockResult('success')
      setTimeout(() => setShowSuccess(true), 1200)
    } else {
      const newLives = lives - 1
      setLives(newLives)
      setLockResult('fail')

      if (newLives <= 0) {
        setTimeout(() => setShowFail(true), 1200)
      } else {
        setTimeout(() => {
          setLockResult(null)
          setPhase('tuning')
        }, 1500)
      }
    }
  }

  function handleRetry() {
    setLives(MAX_LIVES)
    setFrequency(50)
    setLockResult(null)
    setPhase('tuning')
    setAttempts(0)
    setShowFail(false)
  }

  if (showFail) {
    return (
      <div className="challenge-wrapper">
        <header className="challenge-header">
          <div className="challenge-meta">
            <p className="challenge-label font-display">⬡ ACTIVE MISSION</p>
            <h1 className="challenge-title">{challenge.title}</h1>
          </div>
          <button className="btn btn-ghost" onClick={onExit} id="challenge-back">← ABORT</button>
        </header>
        <div className="challenge-fail">
          <div className="fail-icon" aria-hidden="true">📡</div>
          <h2 className="fail-title">SIGNAL LOST</h2>
          <p className="fail-desc">The frequency window expired. Re-initialise receiver.</p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRetry} id="signal-retry">
              ↺ RE-INITIALISE
            </button>
            <button className="btn btn-ghost" onClick={onExit} id="challenge-exit-fail">← ABORT</button>
          </div>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="challenge-success" role="dialog" aria-modal="true" aria-label="Signal locked">
        <div className="success-icon" aria-hidden="true">📡</div>
        <h2 className="success-title">LOCKED</h2>
        <p className="success-subtitle font-display">
          FREQUENCY CALIBRATION — COMPLETE
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
            Locked on attempt {attempts}
          </span>
        </p>
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
      <header className="challenge-header">
        <div className="challenge-meta">
          <p className="challenge-label font-display">⬡ ACTIVE MISSION</p>
          <h1 className="challenge-title">{challenge.title}</h1>
          <p className="challenge-subtitle-text">{challenge.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div
            className="lives"
            role="img"
            aria-label={`${lives} of ${MAX_LIVES} attempts remaining`}
          >
            {Array.from({ length: MAX_LIVES }, (_, i) => (
              <div key={i} className={`life ${i >= lives ? 'lost' : ''}`} />
            ))}
          </div>
          <button className="btn btn-ghost" onClick={onExit} id="challenge-back">← ABORT</button>
        </div>
      </header>

      <p className="challenge-desc">{challenge.description}</p>

      <div className="signal-boost">
        {/* Waveform display */}
        <div className="signal-display" aria-label="Signal waveform visualiser">
          <Waveform frequency={frequency} />
          <div className="signal-freq-display">
            FREQUENCY: <span>{frequency.toFixed(1)}</span> MHz
          </div>
        </div>

        {/* Hot/cold proximity meter */}
        <div className="signal-meter" aria-label="Proximity meter">
          <div className="meter-label">
            <span>0 MHz</span>
            <span>100 MHz</span>
          </div>
          <div className="meter-track">
            <div
              className={`meter-fill ${prox}`}
              style={{ width: `${frequency}%` }}
            />
            {/* Show target zone after failure (hint) */}
            {(lockResult === 'fail' || attempts >= 2) && (
              <div
                className="meter-target-zone"
                style={{
                  left: `${target.min}%`,
                  width: `${TARGET_WIDTH}%`,
                }}
                aria-label={`Target zone: ${target.min} to ${target.max} MHz`}
              />
            )}
          </div>
        </div>

        {/* Hot/cold badge */}
        <span
          className="hotcold-badge font-display"
          style={{ color: hotcoldColor, borderColor: hotcoldColor }}
          aria-live="polite"
          aria-label={`Signal proximity: ${hotcoldLabel}`}
        >
          {hotcoldLabel}
        </span>

        {/* Slider */}
        <div className="signal-slider-wrap" aria-label="Frequency slider">
          <label htmlFor="freq-slider" className="sr-only">
            Frequency: {frequency} MHz
          </label>
          <input
            id="freq-slider"
            type="range"
            className="signal-slider"
            min={0}
            max={100}
            step={0.5}
            value={frequency}
            onChange={handleSlider}
            disabled={phase !== 'tuning'}
            aria-valuenow={frequency}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tune frequency slider"
          />
        </div>

        {/* Lock button */}
        <button
          className={`btn btn-primary btn-lg ${lockResult === 'success' ? 'text-green' : lockResult === 'fail' ? 'btn-danger' : ''}`}
          onClick={handleLock}
          disabled={phase !== 'tuning'}
          id="signal-lock"
          aria-label="Lock the current frequency"
          style={{ minWidth: 200 }}
        >
          {lockResult === 'success' && '✓ SIGNAL LOCKED'}
          {lockResult === 'fail'    && '✗ WRONG FREQUENCY'}
          {!lockResult              && '[ LOCK SIGNAL ]'}
        </button>
      </div>
    </div>
  )
}
