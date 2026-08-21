/**
 * Shuffle an array using Fisher-Yates algorithm.
 * Returns a new shuffled array — does not mutate the original.
 */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Format elapsed milliseconds as MM:SS
 */
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Sleep for a given number of milliseconds (returns a Promise).
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate a random integer between min and max (inclusive).
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Replace characters in a string with random "glitch" characters.
 * Used for the encrypted text effect.
 */
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?<>[]{}|~'
export function glitchify(str, revealFraction = 0) {
  return str
    .split('')
    .map((char, i) => {
      if (char === ' ' || char === '\n') return char
      if (i / str.length < revealFraction) return char
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    })
    .join('')
}
