/**
 * Triggers the crypto-hub line-draw animation the first time the section
 * scrolls into view. Adds `.is-animated` to `.crypto-hub`, then disconnects
 * (play-once). Falls back to immediate activation when IntersectionObserver
 * is unavailable or the user prefers reduced motion.
 */
export function initCryptoHubScrollAnimation(): void {
  const section = document.querySelector<HTMLElement>('.crypto-hub')
  if (!section) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    section.classList.add('is-animated')
    return
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          section.classList.add('is-animated')
          obs.disconnect()
          break
        }
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
  )

  observer.observe(section)
}
