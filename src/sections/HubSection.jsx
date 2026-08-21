import { CHALLENGES } from '../utils/gameData'

const DIFF_CLASS = {
  EASY:      'difficulty-easy',
  MODERATE:  'difficulty-moderate',
  HARD:      'difficulty-hard',
  LEGENDARY: 'difficulty-legendary',
}

/**
 * Mission Control hub — displays all 5 challenge cards.
 * Completed challenges show their unlocked intel.
 */
export default function HubSection({
  playerName,
  completedChallenges,
  onEnterChallenge,
  onOpenGallery,
  onGoToCompletion,
}) {
  const count = completedChallenges.length
  const total = CHALLENGES.length
  const allDone = count === total
  const pct = Math.round((count / total) * 100)

  return (
    <section className="hub" aria-label="Mission control hub">
      {/* Header */}
      <header className="hub-header">
        <p className="hub-greeting font-display" aria-hidden="true">
          ⬡ MISSION CONTROL ⬡
        </p>
        <h1 className="hub-title">
          WELCOME, <span>{playerName}</span>
        </h1>

        {/* Progress */}
        <div
          className="hub-progress-bar-wrap"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${count} of ${total} challenges complete`}
        >
          <div className="hub-progress-label">
            <span>MISSION PROGRESS</span>
            <span>{count}/{total} COMPLETE</span>
          </div>
          <div className="hub-progress-track">
            <div
              className="hub-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Challenge grid */}
      <div className="hub-grid" role="list">
        {CHALLENGES.map((challenge, idx) => {
          const done = completedChallenges.includes(challenge.id)
          return (
            <article
              key={challenge.id}
              role="listitem"
              className={`challenge-card ${done ? 'completed' : ''}`}
              style={{
                '--card-accent': challenge.color,
                animationDelay: `${idx * 80}ms`,
              }}
              onClick={() => onEnterChallenge(challenge.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onEnterChallenge(challenge.id)
                }
              }}
              tabIndex={0}
              aria-label={`${challenge.title} — ${done ? 'Completed' : 'Start challenge'}`}
              id={`challenge-card-${challenge.id}`}
            >
              <div className="card-header">
                <span className="card-icon" aria-hidden="true">
                  {challenge.icon}
                </span>
                <span
                  className={`card-difficulty ${DIFF_CLASS[challenge.difficulty]}`}
                  aria-label={`Difficulty: ${challenge.difficulty}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <div>
                <h2 className="card-title">{challenge.title}</h2>
                <p className="card-subtitle">{challenge.subtitle}</p>
              </div>

              <p className="card-desc">{challenge.description}</p>

              {/* Show unlocked intel */}
              {done && (
                <div className="card-intel-preview" aria-label="Unlocked intel">
                  <span style={{ color: 'var(--green)', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: 4 }}>
                    ✓ INTEL EXTRACTED
                  </span>
                  {challenge.intel}
                </div>
              )}

              <div className="card-footer">
                <span>{done ? 'VIEW AGAIN' : 'INITIATE MISSION'}</span>
                <span className="card-arrow" aria-hidden="true">→</span>
              </div>
            </article>
          )
        })}
      </div>

      {/* Actions */}
      <div className="hub-actions">
        <button
          className="btn btn-ghost"
          onClick={onOpenGallery}
          id="explore-button"
          aria-label="View intel gallery and achievements"
        >
          ⬡ INTEL GALLERY
        </button>

        {allDone && (
          <button
            className="btn btn-primary btn-lg"
            onClick={onGoToCompletion}
            id="complete-mission"
            aria-label="Access final mission briefing"
            style={{ animation: 'pulseRing 2s ease-in-out infinite' }}
          >
            🏆 ACCESS FINAL BRIEFING
          </button>
        )}
      </div>
    </section>
  )
}
