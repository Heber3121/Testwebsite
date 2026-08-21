import { useState, useEffect } from 'react'

/** Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A */
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

/**
 * Listens for the Konami Code key sequence globally.
 * When detected, calls onFound and shows a brief celebration overlay.
 */
export default function EasterEgg({ onFound, alreadyFound }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let seq = []
    function handleKey(e) {
      seq = [...seq, e.key].slice(-KONAMI.length)
      if (seq.join(',') === KONAMI.join(',')) {
        if (!alreadyFound) onFound()
        setVisible(true)
        setTimeout(() => setVisible(false), 4000)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onFound, alreadyFound])

  if (!visible) return null

  return (
    <div
      className="easter-egg-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg discovered"
      id="easter-egg-popup"
    >
      <div className="egg-icon" aria-hidden="true">👻</div>
      <h2 className="egg-title">GHOST PROTOCOL</h2>
      <p className="egg-desc">
        You discovered the hidden Konami sequence.
        <br />
        <strong style={{ color: 'var(--cyan)' }}>Achievement unlocked.</strong>
      </p>
      <button
        className="btn btn-ghost"
        onClick={() => setVisible(false)}
        autoFocus
        aria-label="Close easter egg notification"
      >
        CLOSE
      </button>
    </div>
  )
}
