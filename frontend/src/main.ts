import './main.css'
import { parseAuthFromUrl, redirectToGoogleAuth, renderUserProfile } from './app/auth.ts'
import { renderCryptoGrid, setConnectionStatus, updateCryptoCard } from './app/cryptoCards.ts'
import { initMobileMenu } from './app/menu.ts'
import { CryptoSocket } from './services/cryptoSocket.ts'

function initAuth(): void {
  const user = parseAuthFromUrl()
  if (user) {
    renderUserProfile(user)
  }

  const handleAuth = () => redirectToGoogleAuth()
  document.getElementById('google-auth')?.addEventListener('click', handleAuth)
}

function initHeroVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('.hero__video')
  if (!video) return

  video.muted = true
  video.playsInline = true

  const play = () => {
    video.play().catch(() => {
      /* autoplay blocked until user interaction */
    })
  }

  play()
  document.addEventListener('click', play, { once: true })
}

function initCrypto(): void {
  const grid = document.getElementById('crypto-grid')
  if (!grid) return

  renderCryptoGrid(grid)

  const socket = new CryptoSocket(
    (update) => updateCryptoCard(update, true),
    (connected) => setConnectionStatus(connected),
  )

  socket.connect()

  window.addEventListener('beforeunload', () => socket.disconnect())
}

function init(): void {
  initAuth()
  initHeroVideo()
  initCrypto()
  initMobileMenu()
}

init()
