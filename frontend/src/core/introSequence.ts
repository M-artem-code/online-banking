/**
 * Шторка: полный экран → сходится к центру.
 * UI reveal стартует только после 50% открытия шторки.
 */

const HOLD_MS = 450
/** Длительность анимации шторки — синхрон с intro.css */
export const INTRO_CURTAIN_OPEN_MS = 1050
const OPEN_MS = INTRO_CURTAIN_OPEN_MS
/** Задержка reveal от момента старта шторки (50% прогресса) */
const REVEAL_START_AFTER_CURTAIN_MS = Math.round(OPEN_MS * 0.5)
/** Самая длинная hero-анимация после reveal (auth-card delay + duration) */
const HERO_INTRO_ANIM_MS = 780 + 950
type IntroDoneFn = () => void

let onIntroDone: IntroDoneFn | null = null

export function onIntroComplete(fn: IntroDoneFn): void {
  onIntroDone = fn
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function initCryptoScrollReveal(): void {
  const hub = document.getElementById('crypto')
  if (!hub) return

  if (prefersReducedMotion()) {
    hub.classList.add('crypto-hub--in-view')
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        hub.classList.add('crypto-hub--in-view')
        observer.disconnect()
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )

  observer.observe(hub)
}

function playHeroVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('.hero__video')
  video?.play().catch(() => {
    /* autoplay blocked */
  })
}

function runPostCurtainReveal(html: HTMLElement, body: HTMLElement): void {
  html.classList.add('page--revealed')
  body.classList.add('page--revealed')

  requestAnimationFrame(() => {
    html.classList.remove('is-intro-pending')
    body.classList.remove('is-intro-pending')
    void body.offsetHeight
  })
}

function removeCurtain(curtain: HTMLElement | null): void {
  if (!curtain) return
  curtain.classList.add('intro-curtain--done')
  curtain.remove()
}

function unlockPageScroll(html: HTMLElement, body: HTMLElement): void {
  html.classList.remove('page--intro')
  html.classList.add('page--ready')
  body.classList.remove('page--intro')
  body.classList.add('page--ready')
}

function markIntroAnimationsDone(html: HTMLElement, body: HTMLElement): void {
  html.classList.add('page--intro-done')
  body.classList.add('page--intro-done')
}

function finishIntro(html: HTMLElement, body: HTMLElement): void {
  document.getElementById('intro-critical')?.remove()
  unlockPageScroll(html, body)

  initCryptoScrollReveal()
  onIntroDone?.()
}

export function initIntroSequence(): void {
  const html = document.documentElement
  const body = document.body
  const curtain = document.getElementById('intro-curtain')

  html.classList.add('page--intro')
  body.classList.add('page--intro')

  if (prefersReducedMotion()) {
    html.classList.remove('is-intro-pending')
    body.classList.remove('is-intro-pending')
    runPostCurtainReveal(html, body)
    removeCurtain(curtain)
    finishIntro(html, body)
    markIntroAnimationsDone(html, body)
    playHeroVideo()
    return
  }

  /* 1. Пауза на синем */
  window.setTimeout(() => {
    curtain?.classList.add('intro-curtain--open')
    playHeroVideo()
  }, HOLD_MS)

  /* 2. UI — только когда шторка открылась минимум на 50% */
  window.setTimeout(() => {
    runPostCurtainReveal(html, body)
  }, HOLD_MS + REVEAL_START_AFTER_CURTAIN_MS)

  /* 3. Убрать шторку + вернуть скролл и нижнюю секцию */
  window.setTimeout(() => {
    removeCurtain(curtain)
    finishIntro(html, body)
  }, HOLD_MS + OPEN_MS + 60)

  /* 4. Hover/transition на кнопках — после окончания intro-анимаций */
  window.setTimeout(() => {
    markIntroAnimationsDone(html, body)
  }, HOLD_MS + REVEAL_START_AFTER_CURTAIN_MS + HERO_INTRO_ANIM_MS)
}
