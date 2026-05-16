/** Learn More modal — hero CTA, Figma copy layout. */

const CLOSE_MS = 520

export function initLearnMoreModal(): void {
  const openBtn = document.getElementById('btn-learn-more')
  const modal = document.getElementById('modal-learn-more')
  if (!openBtn || !modal) return

  const closeTriggers = modal.querySelectorAll<HTMLElement>('[data-modal-close]')
  let isOpen = false
  let closeTimer: ReturnType<typeof window.setTimeout> | null = null

  const open = (): void => {
    if (isOpen) return
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      closeTimer = null
    }

    isOpen = true
    modal.removeAttribute('hidden')
    modal.classList.add('modal--backdrop-on')
    document.body.classList.add('has-modal-open')
    openBtn.setAttribute('aria-expanded', 'true')

    requestAnimationFrame(() => {
      modal.classList.add('modal--learn-open')
    })
  }

  const close = (): void => {
    if (!isOpen) return
    isOpen = false

    modal.classList.remove('modal--learn-open', 'modal--backdrop-on')
    openBtn.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('has-modal-open')

    closeTimer = window.setTimeout(() => {
      modal.setAttribute('hidden', '')
      closeTimer = null
    }, CLOSE_MS)
  }

  openBtn.addEventListener('click', open)
  closeTriggers.forEach((el) => el.addEventListener('click', close))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close()
  })
}
