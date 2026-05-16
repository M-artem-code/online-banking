import { query } from '../../core/dom.ts'

export function initMobileMenu(): void {
  const toggle = document.getElementById('menu-toggle')
  const closeBtn = document.getElementById('mobile-menu-close')
  const backdrop = document.getElementById('mobile-menu-backdrop')
  const header = query('.header')
  const mobileMenu = document.getElementById('mobile-menu')

  if (!toggle || !header || !mobileMenu) return

  const isOpen = (): boolean =>
    header.classList.contains('header--menu-open')

  const setOpen = (open: boolean): void => {
    header.classList.toggle('header--menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    mobileMenu.hidden = !open
    mobileMenu.setAttribute('aria-hidden', String(!open))
    document.body.style.overflow = open ? 'hidden' : ''
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
