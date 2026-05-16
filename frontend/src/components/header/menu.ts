import { query } from '../../core/dom.ts'

export function initMobileMenu(): void {
  const toggle = document.getElementById('menu-toggle')
  const closeBtn = document.getElementById('mobile-menu-close')
  const header = query('.header')
  const mobileMenu = document.getElementById('mobile-menu')

  if (!toggle || !header || !mobileMenu) return

  const setOpen = (open: boolean): void => {
    header.classList.toggle('header--menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    mobileMenu.hidden = !open
    mobileMenu.setAttribute('aria-hidden', String(!open))
    document.body.style.overflow = open ? 'hidden' : ''
  }

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('header--menu-open'))
  })

  closeBtn?.addEventListener('click', () => setOpen(false))

  document.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })
}
