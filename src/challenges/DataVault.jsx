import { useState, useEffect, useCallback } from 'react'
import { shuffle } from '../utils/helpers'

/** Six distinct symbols used for the vault pairs. */
const SYMBOLS = ['⬡', '◈', '◉', '◊', '❋', '⊕']

function buildCards() {
  const pairs = [...SYMBOLS, ...SYMBOLS]
  return shuffle(pairs).map((symbol, i) => ({
    id: i,
    symbol,
    isFlipped: false,
    isMatched: false,
  }))
}

/**
 * Memory card-matching challenge.
 * Find all 6 symbol pairs to unlock the vault.
 * No lives — as many attempts as needed.
 */
export default function DataVault({ challenge, onComplete, onExit }) {
  const [cards, setCards]         = useState(buildCards)
  const [flipped, setFlipped]     = useState([])   // IDs of currently flipped (unmatched) cards
  const [isChecking, setIsChecking] = useState(false)
  const [moves, setMoves]         = useState(0)
  const [matches, setMatches]     = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalPairs = SYMBOLS.length

  // ── Card click handler ───────────────────────────────────────────────────
  const handleFlip = useCallback((id) => {
    if (isChecking) return

    setCards((prev) => {
      const card = prev.find((c) => c.id === id)
      if (!card || card.isFlipped || card.isMatched) return prev
      return prev.map((c) => c.id === id ? { ...c, isFlipped: true } : c)
    })

    setFlipped((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }, [isChecking])

  // ── Check for match after 2 flipped ──────────────────────────────────────
  useEffect(() => {
    if (flipped.length < 2) return

    setIsChecking(true)
    setMoves((m) => m + 1)

    const [id1, id2] = flipped
    const timer = setTimeout(() => {
      setCards((prev) => {
        const c1 = prev.find((c) => c.id === id1)
        const c2 = prev.find((c) => c.id === id2)
        const isMatch = c1.symbol === c2.symbol

        if (isMatch) {
          setMatches((m) => {
            const next = m + 1
            if (next === totalPairs) {
              setTimeout(() => setShowSuccess(true), 400)
            }
            return next
          })
          return prev.map((c) =>
            c.id === id1 || c.id === id2
              ? { ...c, isMatched: true }
              : c,
          )
        } else {
          return prev.map((c) =>
            c.id === id1 || c.id === id2
              ? { ...c, isFlipped: false }
              : c,
          )
        }
      })

      setFlipped([])
      setIsChecking(false)
    }, 900)

    return () => clearTimeout(timer)
  }, [flipped, totalPairs])

  function handleReset() {
    setCards(buildCards())
    setFlipped([])
    setMoves(0)
    setMatches(0)
    setShowSuccess(false)
    setIsChecking(false)
  }

  if (showSuccess) {
    return (
      <div className="challenge-success" role="dialog" aria-modal="true" aria-label="Data vault cracked">
        <div className="success-icon" aria-hidden="true">🗝️</div>
        <h2 className="success-title">VAULT CRACKED</h2>
        <p className="success-subtitle font-display">
          HIDDEN INTELLIGENCE RECOVERY — COMPLETE
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>
            Completed in {moves} moves
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
        <button className="btn btn-ghost" onClick={onExit} id="challenge-back">
          ← ABORT
        </button>
      </header>

      <p className="challenge-desc">{challenge.description}</p>

      <div className="data-vault">
        {/* Stats */}
        <div
          className="vault-stats"
          role="status"
          aria-label={`${matches} of ${totalPairs} pairs found in ${moves} moves`}
        >
          <span>PAIRS FOUND: <span>{matches}/{totalPairs}</span></span>
          <span>MOVES: <span>{moves}</span></span>
        </div>

        {/* Card grid */}
        <div
          className="vault-grid"
          role="grid"
          aria-label="Data vault card grid"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              role="gridcell"
              className={`vault-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => {
                if (!card.isFlipped && !card.isMatched) handleFlip(card.id)
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !card.isFlipped && !card.isMatched) {
                  e.preventDefault()
                  handleFlip(card.id)
                }
              }}
              tabIndex={card.isMatched ? -1 : 0}
              aria-label={
                card.isMatched
                  ? `Matched: ${card.symbol}`
                  : card.isFlipped
                  ? `Flipped: ${card.symbol}`
                  : 'Hidden card'
              }
              aria-pressed={card.isFlipped || card.isMatched}
            >
              <div className="vault-card-inner">
                <div className="vault-card-front" aria-hidden="true" />
                <div className="vault-card-back" aria-hidden="true">
                  {card.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <button
          className="btn btn-ghost"
          onClick={handleReset}
          id="vault-reset"
          aria-label="Reset the card grid"
        >
          ↺ RESET VAULT
        </button>
      </div>
    </div>
  )
}
