import { CHALLENGES } from '../utils/gameData'

/**
 * Fixed top navigation bar.
 * Shows the NEXUS logo, a progress indicator, and the Intel Gallery button.
 * Only renders when the user has passed the intro phase.
 */
export default function Navigation({ phase, completedChallenges, onOpenGallery }) {
  // Hide nav during intro/onboarding
  if (phase === 'intro' || phase === 'onboarding') return null

  const count = completedChallenges.length
  const total = CHALLENGES.length

  return (
    <nav className="nav" role="navigation" aria-label="NEXUS main navigation">
      <span className="nav-logo" aria-label="NEXUS Intelligence Network">
        NEX<span>US</span>
      </span>

      <div className="nav-right">
        {/* Progress dots */}
        <div className="nav-progress" aria-label={`${count} of ${total} challenges complete`}>
          <div className="nav-dots" role="list">
            {CHALLENGES.map((c) => (
              <div
                key={c.id}
                role="listitem"
                className={`nav-dot ${completedChallenges.includes(c.id) ? 'completed' : ''}`}
                title={c.title}
                aria-label={`${c.title}: ${completedChallenges.includes(c.id) ? 'complete' : 'incomplete'}`}
              />
            ))}
          </div>
          <span aria-hidden="true">{count}/{total}</span>
        </div>

        {/* Gallery button - only once user has started playing */}
        {phase !== 'complete' && (
          <button
            className="nav-gallery-btn"
            onClick={onOpenGallery}
            aria-label="Open intel and achievement gallery"
            id="nav-gallery"
          >
            INTEL GALLERY
          </button>
        )}
      </div>
    </nav>
  )
}
