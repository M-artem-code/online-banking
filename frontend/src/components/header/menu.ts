import { query } from '../../core/dom.ts'

export function initMobileMenu(): void {
  const toggle = document.getElementById('menu-toggle')
  const header = query('.header')
  if (!toggle || !header) return

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('header--menu-open')
    toggle.setAttribute('aria-expanded', String(isOpen))
  })

  document.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('header--menu-open')
      toggle.setAttribute('aria-expanded', 'false')
    })
  })
}
