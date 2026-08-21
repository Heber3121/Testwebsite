import { useState, useEffect, useRef } from 'react'
import GlitchText from '../components/GlitchText'

/** Animated counter that counts up from 0 to a target value. */
function Counter({ target, suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    let start = null
    const duration = 2000

    function step(timestamp) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }

    // Trigger on mount
    const timer = setTimeout(() => requestAnimationFrame(step), 1200)
    return () => clearTimeout(timer)
  }, [target])

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {value.toLocaleString()}{suffix}
    </span>
  )
}

/**
 * Full-screen hero landing section.
 * Includes animated title, tagline, and the primary Start Experience CTA.
 */
export default function HeroSection({ onStart }) {
  const [clicked, setClicked] = useState(false)

  function handleStart() {
    if (clicked) return
    setClicked(true)
    // Brief click animation before transitioning
    setTimeout(onStart, 600)
  }

  return (
    <main className="hero" id="hero" aria-label="NEXUS Intelligence Network — Home">
      {/* Subtle grid overlay */}
      <div className="hero-bg-grid" aria-hidden="true" />

      {/* Animated scanning line */}
      <div className="hero-scanline" aria-hidden="true" />

      <div className="hero-content">
        {/* Eyebrow */}
        <p className="hero-eyebrow font-display" aria-label="Classified Intelligence Network">
          ⬡ CLASSIFIED INTELLIGENCE NETWORK ⬡
        </p>

        {/* Main title with glitch effect */}
        <h1 className="hero-title">
          <GlitchText tag="span">NEXUS</GlitchText>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle font-display" aria-hidden="true">
          DIGITAL INTELLIGENCE EXPERIENCE · EST. 2024
        </p>

        {/* Tagline */}
        <p className="hero-tagline">
          Five classified missions. Five secrets waiting to be unlocked.
          <strong> Are you skilled enough to handle them?</strong>
        </p>

        {/* CTA */}
        <div className="hero-cta-wrap">
          <button
            className={`btn btn-primary btn-xl ${clicked ? 'animate-pulse' : ''}`}
            onClick={handleStart}
            id="start-experience"
            aria-label="Start the NEXUS experience"
            disabled={clicked}
          >
            {clicked ? '[ INITIALISING... ]' : '[ ENTER THE NEXUS ]'}
          </button>

          <p className="hero-hint font-mono" aria-hidden="true">
            ↑ ↑ ↓ ↓ ← → ← → B A &nbsp;·&nbsp; find the ghost
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="hero-stats" aria-label="Experience statistics" role="list">
        <div className="hero-stat" role="listitem">
          <div className="hero-stat-value">
            <Counter target={5} />
          </div>
          <div className="hero-stat-label">Missions</div>
        </div>
        <div className="hero-stat" role="listitem">
          <div className="hero-stat-value">
            <Counter target={9} />
          </div>
          <div className="hero-stat-label">Achievements</div>
        </div>
        <div className="hero-stat" role="listitem">
          <div className="hero-stat-value">
            <Counter target={1} />
          </div>
          <div className="hero-stat-label">Secret</div>
        </div>
      </div>
    </main>
  )
}
