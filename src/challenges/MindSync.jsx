import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../utils/gameData'

const PASS_SCORE = 3
const OPTION_LABELS = ['A', 'B', 'C', 'D']

/**
 * Multiple-choice trivia quiz.
 * 5 questions — score 3/5 or better to unlock the intel.
 * Shows correct/incorrect feedback after each answer with a fact blurb.
 */
export default function MindSync({ challenge, onComplete, onExit }) {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected]       = useState(null)    // selected option index
  const [results, setResults]         = useState([])      // 'correct' | 'wrong' per question
  const [phase, setPhase]             = useState('quiz')  // quiz | complete
  const [showFact, setShowFact]       = useState(false)

  const q      = QUIZ_QUESTIONS[questionIdx]
  const isLast = questionIdx === QUIZ_QUESTIONS.length - 1
  const score  = results.filter((r) => r === 'correct').length

  function handleAnswer(optIdx) {
    if (selected !== null) return
    const isCorrect = optIdx === q.correct
    setSelected(optIdx)
    setShowFact(true)
    setResults((prev) => [...prev, isCorrect ? 'correct' : 'wrong'])
  }

  function handleNext() {
    if (isLast) {
      setPhase('complete')
      return
    }
    setQuestionIdx((i) => i + 1)
    setSelected(null)
    setShowFact(false)
  }

  function handleRetry() {
    setQuestionIdx(0)
    setSelected(null)
    setShowFact(false)
    setResults([])
    setPhase('quiz')
  }

  const isPerfect = score === QUIZ_QUESTIONS.length

  // ── Success overlay ────────────────────────────────────────────────────────
  if (phase === 'complete' && score >= PASS_SCORE) {
    return (
      <div className="challenge-success" role="dialog" aria-modal="true" aria-label="Mind sync complete">
        <div className="success-icon" aria-hidden="true">🧠</div>
        <h2 className="success-title">SYNCED</h2>
        <p className="success-subtitle font-display">
          IDENTITY VERIFICATION — COMPLETE
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85em' }}>
            Score: {score}/{QUIZ_QUESTIONS.length}
            {isPerfect && ' · PERFECT SYNC ⭐'}
          </span>
        </p>
        <div className="success-intel-box">
          <p className="success-intel-label font-display">INTEL EXTRACTED</p>
          <p className="success-intel-text">{challenge.intel}</p>
        </div>
        <div className="success-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onComplete(challenge.id, { perfect: isPerfect })}
            id="challenge-complete"
            autoFocus
          >
            ✓ COLLECT INTEL
          </button>
        </div>
      </div>
    )
  }

  // ── Fail screen ────────────────────────────────────────────────────────────
  if (phase === 'complete' && score < PASS_SCORE) {
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
          <div className="fail-icon" aria-hidden="true">🧠</div>
          <h2 className="fail-title">SYNC FAILED</h2>
          <p className="fail-desc">
            You scored {score}/{QUIZ_QUESTIONS.length}.
            You need at least {PASS_SCORE} correct to pass.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRetry} id="quiz-retry">
              ↺ TRY AGAIN
            </button>
            <button className="btn btn-ghost" onClick={onExit} id="challenge-exit-fail">← ABORT</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active quiz ────────────────────────────────────────────────────────────
  return (
    <div className="challenge-wrapper">
      <header className="challenge-header">
        <div className="challenge-meta">
          <p className="challenge-label font-display">⬡ ACTIVE MISSION</p>
          <h1 className="challenge-title">{challenge.title}</h1>
          <p className="challenge-subtitle-text">{challenge.subtitle}</p>
        </div>
        <button className="btn btn-ghost" onClick={onExit} id="challenge-back">← ABORT</button>
      </header>

      <p className="challenge-desc">{challenge.description}</p>

      <div className="mind-sync">
        {/* Progress dots */}
        <div
          className="quiz-progress"
          role="group"
          aria-label={`Question ${questionIdx + 1} of ${QUIZ_QUESTIONS.length}`}
        >
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`quiz-dot ${
                i < results.length
                  ? results[i]
                  : i === questionIdx
                  ? 'current'
                  : ''
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Question card */}
        <div
          className="quiz-question-card"
          key={questionIdx}
          role="region"
          aria-live="polite"
          aria-label={`Question ${questionIdx + 1}`}
        >
          <p className="quiz-q-num font-display">
            PROBE {questionIdx + 1} / {QUIZ_QUESTIONS.length}
          </p>
          <p className="quiz-q-text">{q.question}</p>

          {/* Options */}
          <div
            className="quiz-options"
            role="group"
            aria-label="Answer options"
          >
            {q.options.map((opt, i) => {
              let cls = ''
              if (selected !== null) {
                if (i === q.correct)  cls = 'correct'
                else if (i === selected) cls = 'wrong'
              }
              return (
                <button
                  key={i}
                  className={`quiz-option ${cls}`}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  aria-label={`Option ${OPTION_LABELS[i]}: ${opt}${cls === 'correct' ? ' (correct)' : cls === 'wrong' ? ' (incorrect)' : ''}`}
                  id={`quiz-option-${i}`}
                >
                  <span className="quiz-option-letter" aria-hidden="true">
                    {OPTION_LABELS[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Fact reveal */}
          {showFact && (
            <div className="quiz-fact" role="note" aria-label="Intelligence fact">
              💡 {q.fact}
            </div>
          )}
        </div>

        {/* Next / Submit */}
        {selected !== null && (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            id="quiz-submit"
            aria-label={isLast ? 'Submit all answers' : 'Next question'}
            style={{ alignSelf: 'flex-end' }}
          >
            {isLast ? '[ SUBMIT ANSWERS ]' : '[ NEXT PROBE →]'}
          </button>
        )}
      </div>
    </div>
  )
}
