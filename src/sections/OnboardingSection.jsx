import { useState, useRef, useEffect } from 'react'

/** Typewriter hook — renders a string character by character. */
function useTypewriter(text, delayMs = 30) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(timer)
    }, delayMs)
    return () => clearInterval(timer)
  }, [text, delayMs])

  return displayed
}

const BRIEFING =
  'Agent — you have been selected to access the NEXUS classified intelligence network. ' +
  'Before granting you access to sensitive mission data, we require identity verification. ' +
  'Please provide your agent codename to proceed.'

/**
 * Onboarding screen — agent registers with a codename before entering the hub.
 */
export default function OnboardingSection({ onInitialize }) {
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)
  const briefing = useTypewriter(BRIEFING, 22)

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 800)
    return () => clearTimeout(timer)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (submitted) return
    setSubmitted(true)
    setTimeout(() => onInitialize(name || 'AGENT'), 800)
  }

  return (
    <section className="onboarding" aria-label="Agent registration">
      <div className="onboarding-card">
        <p className="onboarding-label font-display" aria-hidden="true">
          ⬡ AGENT REGISTRATION ⬡
        </p>

        <h1 className="onboarding-title">
          IDENTITY<br />VERIFICATION
        </h1>

        <p
          className="onboarding-body"
          aria-live="polite"
          aria-label="Security briefing"
        >
          {briefing}
          {briefing.length < BRIEFING.length && (
            <span className="onboarding-cursor" aria-hidden="true" />
          )}
        </p>

        <form onSubmit={handleSubmit} noValidate id="agent-registration-form">
          <div className="onboarding-input-wrap">
            <label className="sr-only" htmlFor="agent-name">
              Enter your agent codename
            </label>
            <input
              ref={inputRef}
              id="agent-name"
              name="agent-name"
              className="onboarding-input"
              type="text"
              placeholder="ENTER CODENAME..."
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 20))}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
              aria-label="Agent codename"
              aria-describedby="agent-name-hint"
              disabled={submitted}
            />
            <p id="agent-name-hint" className="sr-only">
              Enter a codename of up to 20 characters. Leave blank to use the default.
            </p>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${submitted ? 'animate-pulse' : ''}`}
            disabled={submitted}
            id="initialize-agent"
            aria-label="Initialize agent and enter the NEXUS hub"
            style={{ width: '100%' }}
          >
            {submitted ? '[ INITIALISING... ]' : '[ INITIALIZE AGENT ]'}
          </button>
        </form>

        {!submitted && (
          <p
            style={{
              marginTop: 'var(--space-lg)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}
            aria-live="polite"
          >
            Leave blank to proceed as <strong style={{ color: 'var(--cyan)' }}>AGENT</strong>
          </p>
        )}
      </div>
    </section>
  )
}
