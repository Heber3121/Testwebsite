/**
 * Text rendered with a CSS glitch animation.
 * Uses ::before and ::after pseudo-elements (driven by CSS).
 */
export default function GlitchText({ children, className = '', tag: Tag = 'span' }) {
  return (
    <Tag
      className={`glitch-wrapper ${className}`}
      data-text={children}
      aria-label={children}
    >
      {children}
    </Tag>
  )
}
