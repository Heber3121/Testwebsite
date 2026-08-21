import { ACHIEVEMENTS, CHALLENGES, RARITY_COLORS } from '../utils/gameData'

/**
 * Intel & Achievement gallery.
 * Shows all collected intel pieces and all achievements (locked/unlocked).
 */
export default function AchievementsSection({
  completedChallenges,
  unlockedAchievements,
  onBack,
}) {
  const earnedCount = unlockedAchievements.length
  const total       = ACHIEVEMENTS.length

  // Collect intel from completed challenges
  const intel = CHALLENGES
    .filter((c) => completedChallenges.includes(c.id))
    .map((c) => ({ title: c.title, text: c.intel }))

  return (
    <section className="gallery" aria-label="Intel and achievement gallery">
      {/* Back button */}
      <button
        className="btn btn-ghost"
        onClick={onBack}
        style={{ marginBottom: 'var(--space-xl)' }}
        id="back-to-hub"
        aria-label="Return to mission control hub"
      >
        ← RETURN TO HUB
      </button>

      <h1 className="gallery-title">INTEL GALLERY</h1>
      <p className="gallery-subtitle text-muted">
        {earnedCount}/{total} achievements unlocked ·{' '}
        {intel.length}/{CHALLENGES.length} intel pieces collected
      </p>

      {/* Collected Intel */}
      <div className="intel-section">
        <h2 className="intel-section-title">
          CLASSIFIED INTEL
        </h2>

        {intel.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No intel collected yet. Complete missions to extract classified data.
          </p>
        ) : (
          intel.map((item, i) => (
            <div
              key={i}
              className="intel-item"
              style={{ animationDelay: `${i * 60}ms` }}
              aria-label={`Intel from ${item.title}`}
            >
              <div className="intel-item-label">{item.title}</div>
              {item.text}
            </div>
          ))
        )}
      </div>

      {/* Achievements */}
      <h2
        className="intel-section-title"
        style={{ borderColor: 'rgba(245,158,11,0.2)', color: 'var(--amber)' }}
      >
        ACHIEVEMENTS
      </h2>

      <div className="gallery-grid" role="list">
        {ACHIEVEMENTS.map((ach, i) => {
          const unlocked = unlockedAchievements.includes(ach.id)
          const color    = RARITY_COLORS[ach.rarity] || RARITY_COLORS.COMMON

          return (
            <div
              key={ach.id}
              role="listitem"
              className={`ach-badge ${unlocked ? 'unlocked' : 'locked'}`}
              style={{
                '--ach-color': color,
                animationDelay: `${i * 50}ms`,
              }}
              aria-label={`${ach.name}: ${unlocked ? 'unlocked' : 'locked'}. ${ach.description}`}
            >
              <div className="ach-icon" aria-hidden="true">
                {unlocked ? ach.icon : '🔒'}
              </div>
              <div className="ach-info">
                <div className="ach-rarity">{ach.rarity}</div>
                <div className="ach-name">{ach.name}</div>
                <div className="ach-desc">
                  {unlocked ? ach.description : '???'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <button
          className="btn btn-ghost"
          onClick={onBack}
          id="gallery-back-bottom"
          aria-label="Return to mission control hub"
        >
          ← RETURN TO HUB
        </button>
      </div>
    </section>
  )
}
