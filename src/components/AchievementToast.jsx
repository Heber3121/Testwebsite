import { useEffect } from 'react'
import { RARITY_COLORS } from '../utils/gameData'

/**
 * Slide-in achievement notification toast.
 * Auto-dismisses after 4 seconds. Also dismissible by click.
 */
export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  if (!achievement) return null

  const color = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.COMMON

  return (
    <div
      className="achievement-toast"
      role="alert"
      aria-live="assertive"
      aria-label={`Achievement unlocked: ${achievement.name}`}
      style={{ '--toast-color': color }}
      id="achievement-toast"
    >
      <div className="toast-icon" aria-hidden="true">
        {achievement.icon}
      </div>
      <div>
        <div className="toast-label">ACHIEVEMENT UNLOCKED</div>
        <div className="toast-name">{achievement.name}</div>
        <div className="toast-desc">{achievement.description}</div>
      </div>
      <button
        className="toast-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss achievement notification"
      >
        ×
      </button>
    </div>
  )
}
