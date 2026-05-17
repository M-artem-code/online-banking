export function initHeroVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('.hero__video')
  if (!video) return

  video.muted = true
  video.playsInline = true

  document.addEventListener(
    'click',
    () => {
      video.play().catch(() => {
        /* autoplay blocked */
      })
    },
    { once: true },
  )
}
