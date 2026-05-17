import { query } from '../../core/dom.ts'
import { readCssTimeMs } from '../../core/timing.ts'

const OPEN_CLASS = 'mobile-menu--open'

function getMenuDurationMs(): number {
  return readCssTimeMs('--mobile-menu-duration', 720)
}

export function initMobileMenu(): void {
  const toggle = document.getElementById('menu-toggle')
  const closeBtn = document.getElementById('mobile-menu-close')
  const backdrop = document.getElementById('mobile-menu-backdrop')
  const header = query('.header')
  const mobileMenu = document.getElementById('mobile-menu')

  if (!toggle || !header || !mobileMenu) return

  const panel = mobileMenu.querySelector('.mobile-menu__panel')
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const isOpen = (): boolean =>
    header.classList.contains('header--menu-open')

  const clearCloseTimer = (): void => {
    if (closeTimer !== null) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  const finishClose = (): void => {
    clearCloseTimer()
    if (!mobileMenu.classList.contains(OPEN_CLASS)) {
      mobileMenu.hidden = true
    }
  }

  const setOpen = (open: boolean): void => {
    clearCloseTimer()

    header.classList.toggle('header--menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    mobileMenu.setAttribute('aria-hidden', String(!open))
    document.body.style.overflow = open ? 'hidden' : ''

    if (open) {
      mobileMenu.hidden = false
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mobileMenu.classList.add(OPEN_CLASS)
        })
      })
      return
    }

    mobileMenu.classList.remove(OPEN_CLASS)

    let closed = false
    const onTransitionEnd = (event: Event): void => {
      const transition = event as TransitionEvent
      if (transition.target !== panel || transition.propertyName !== 'transform') {
        return
      }
      if (closed) return
      closed = true
      panel?.removeEventListener('transitionend', onTransitionEnd)
      finishClose()
    }

    panel?.addEventListener('transitionend', onTransitionEnd)
    closeTimer = setTimeout(() => {
      if (closed) return
      closed = true
      panel?.removeEventListener('transitionend', onTransitionEnd)
      finishClose()
    }, getMenuDurationMs() + 100)
  }

  toggle.addEventListener('click', () => {
    setOpen(!isOpen())
  })

  closeBtn?.addEventListener('click', () => setOpen(false))
  backdrop?.addEventListener('click', () => setOpen(false))

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false)
  })

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })
}
