import { useEffect, useState } from 'react'
import { CHALLENGES, ACHIEVEMENTS, RARITY_COLORS } from '../utils/gameData'
import { formatTime } from '../utils/helpers'

/** Creates a simple CSS confetti burst effect. */
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#00f5ff','#7c3aed','#f59e0b','#10b981','#ef4444'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 10,
  }))

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 1.4,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Mission complete — final celebration screen.
 * Shows time, achievements earned, and the full decoded mission briefing.
 */
export default function CompletionSection({
  playerName,
  unlockedAchievements,
  elapsedMs,
  onRestart,
  onOpenGallery,
}) {
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const earnedAchs = ACHIEVEMENTS.filter((a) =>
    unlockedAchievements.includes(a.id),
  )

  return (
    <>
      {confetti && <Confetti />}

      <section className="completion" aria-label="Mission complete screen" id="completion-screen">
        <div className="completion-badge" aria-hidden="true">🏆</div>

        <p className="completion-label font-display">MISSION COMPLETE</p>

        <h1 className="completion-title">
          OUTSTANDING,<br />{playerName}
        </h1>

        <p className="completion-subtitle">
          You have successfully infiltrated the NEXUS network, extracted all
          classified intel, and proven your worth as an elite agent.
        </p>

        {/* Stats */}
        <div className="completion-stats" role="list">
          <div className="stat-box" role="listitem" aria-label={`${CHALLENGES.length} missions completed`}>
            <div className="stat-val">{CHALLENGES.length}</div>
            <div className="stat-lbl">MISSIONS</div>
          </div>
          <div className="stat-box" role="listitem" aria-label={`${earnedAchs.length} achievements earned`}>
            <div className="stat-val">{earnedAchs.length}</div>
            <div className="stat-lbl">ACHIEVEMENTS</div>
          </div>
          <div className="stat-box" role="listitem" aria-label={`Time: ${formatTime(elapsedMs)}`}>
            <div className="stat-val" style={{ fontSize: '1.4rem' }}>{formatTime(elapsedMs)}</div>
            <div className="stat-lbl">TIME</div>
          </div>
        </div>

        {/* Full briefing */}
        <div className="completion-briefing" aria-label="Complete mission briefing">
          <p className="briefing-label font-display">COMPLETE MISSION BRIEFING</p>
          <div className="briefing-text">
            <p><strong>► ACCESS CODES:</strong> Alpha-7 · Bravo-3 · Charlie-9.</p>
            <p><strong>► FACILITY:</strong> 51.5074° N, 0.1278° W — sublevel 3.</p>
            <p><strong>► ASSETS:</strong> PHANTOM · ECHO · VECTOR — in position.</p>
            <p><strong>► TIMING:</strong> Operation launches at 03:00 hrs. T-72h.</p>
            <p style={{ marginTop: 'var(--space-md)', color: 'var(--green)' }}>
              <strong>► STATUS:</strong> All intel extracted. Mission success. Stand by for extraction.
            </p>
          </div>
        </div>

        {/* Achievements earned */}
        {earnedAchs.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              justifyContent: 'center',
              marginBottom: 'var(--space-2xl)',
              maxWidth: 640,
            }}
            aria-label="Achievements earned"
          >
            {earnedAchs.map((a) => (
              <span
                key={a.id}
                title={a.description}
                aria-label={`${a.name}: ${a.description}`}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${RARITY_COLORS[a.rarity]}`,
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.1em',
                  color: RARITY_COLORS[a.rarity],
                }}
              >
                {a.icon} {a.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="completion-actions">
          <button
            className="btn btn-ghost"
            onClick={onOpenGallery}
            id="completion-gallery"
            aria-label="View full intel gallery"
          >
            ⬡ VIEW GALLERY
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={onRestart}
            id="explore-again"
            aria-label="Restart the NEXUS experience"
          >
            ↺ EXPLORE AGAIN
          </button>
        </div>
      </section>
    </>
  )
}
