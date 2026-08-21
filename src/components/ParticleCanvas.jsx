import { useEffect, useRef } from 'react'

/**
 * Animated particle canvas background.
 * Draws floating particles that connect to nearby particles with faint lines.
 * Fully accessible — hidden from assistive technologies.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // ── Config ─────────────────────────────────────────────────────────────
    const PARTICLE_COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 14000))
    const MAX_DIST       = 130
    const PARTICLE_COLOR = '0,245,255'
    const LINE_COLOR     = '0,245,255'
    const SPEED          = 0.3

    // ── Resize ─────────────────────────────────────────────────────────────
    let width  = canvas.offsetWidth
    let height = canvas.offsetHeight

    function resize() {
      width  = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width  = width
      canvas.height = height
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Particles ──────────────────────────────────────────────────────────
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:    Math.random() * width,
      y:    Math.random() * height,
      vx:   (Math.random() - 0.5) * SPEED,
      vy:   (Math.random() - 0.5) * SPEED,
      size: Math.random() * 2 + 0.5,
    }))

    // ── Animation loop ────────────────────────────────────────────────────
    let raf

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // Move + bounce particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width)  p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${PARTICLE_COLOR},0.6)`
        ctx.fill()
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${LINE_COLOR},${alpha})`
            ctx.lineWidth   = 0.8
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
      role="presentation"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
