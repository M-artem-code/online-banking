import './main.css'
import { initMobileMenu } from './components/header/index.ts'
import {
  parseAuthFromUrl,
  redirectToGoogleAuth,
  renderUserProfile,
} from './features/auth/index.ts'
import { initCryptoRows, setConnectionStatus, updateCryptoRow } from './features/crypto-live/index.ts'
import { CryptoSocket } from './services/cryptoSocket.ts'

function initAuth(): void {
  const user = parseAuthFromUrl()
  if (user) {
    renderUserProfile(user)
  }

  document.getElementById('google-auth')?.addEventListener('click', () => redirectToGoogleAuth())
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
  initCryptoRows()

  const socket = new CryptoSocket(
    (update) => updateCryptoRow(update, true),
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
