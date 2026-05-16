/** Video modal — Play Video CTA, custom player (/video/HP.mp4). */

const CLOSE_MS = 520

type VideoWithWebkit = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

type DocumentWithWebkit = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

export function initVideoModal(): void {
  const openBtn = document.getElementById('btn-play-video')
  const modal = document.getElementById('modal-video')
  if (!openBtn || !modal) return

  const video = modal.querySelector<HTMLVideoElement>('.video-player__media')
  const centerPlay = modal.querySelector<HTMLButtonElement>('.video-player__center-play')
  const playToggle = modal.querySelector<HTMLButtonElement>('.video-player__play-toggle')
  const seek = modal.querySelector<HTMLInputElement>('.video-player__seek')
  const progressFill = modal.querySelector<HTMLElement>('.video-player__progress-fill')
  const volumeBtn = modal.querySelector<HTMLButtonElement>('.video-player__volume')
  const fullscreenBtn = modal.querySelector<HTMLButtonElement>('.video-player__fullscreen')
  const player = modal.querySelector<HTMLElement>('.video-player')
  const closeTriggers = modal.querySelectorAll<HTMLElement>('[data-modal-close]')

  if (
    !video ||
    !centerPlay ||
    !playToggle ||
    !seek ||
    !progressFill ||
    !volumeBtn ||
    !fullscreenBtn ||
    !player
  ) {
    return
  }

  const doc = document as DocumentWithWebkit
  const videoEl = video as VideoWithWebkit

  let isOpen = false
  let closeTimer: ReturnType<typeof window.setTimeout> | null = null
  let progressRaf: number | null = null

  const getFullscreenElement = (): Element | null =>
    document.fullscreenElement ?? doc.webkitFullscreenElement ?? null

  const isFullscreen = (): boolean => {
    const active = getFullscreenElement()
    if (active === player || active === video) return true
    return Boolean(videoEl.webkitDisplayingFullscreen)
  }

  const syncFullscreenUi = (): void => {
    fullscreenBtn.classList.toggle('video-player__fullscreen--active', isFullscreen())
  }

  const exitFullscreen = async (): Promise<void> => {
    player.classList.remove('video-player--cinema')

    if (videoEl.webkitDisplayingFullscreen && videoEl.webkitEnterFullscreen) {
      video.pause()
      return
    }

    const active = getFullscreenElement()
    if (!active) return

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen()
      }
    } catch {
      /* already exited */
    }
  }

  const enterFullscreen = async (): Promise<void> => {
    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen()
        return
      }

      if (videoEl.webkitEnterFullscreen) {
        videoEl.webkitEnterFullscreen()
        return
      }

      if (player.requestFullscreen) {
        await player.requestFullscreen()
        return
      }
    } catch {
      /* fall through to CSS cinema mode */
    }

    player.classList.add('video-player--cinema')
    syncFullscreenUi()
  }

  const setProgress = (ratio: number): void => {
    const clamped = Math.min(1, Math.max(0, ratio))
    seek.value = String(clamped * 100)
    progressFill.style.setProperty('--progress', String(clamped))
  }

  const updateProgress = (): void => {
    setProgress(video.duration ? video.currentTime / video.duration : 0)
  }

  const stopProgressLoop = (): void => {
    if (progressRaf !== null) {
      cancelAnimationFrame(progressRaf)
      progressRaf = null
    }
  }

  const progressLoop = (): void => {
    updateProgress()
    if (!video.paused && !video.ended) {
      progressRaf = requestAnimationFrame(progressLoop)
    } else {
      progressRaf = null
    }
  }

  const startProgressLoop = (): void => {
    if (progressRaf === null) {
      progressRaf = requestAnimationFrame(progressLoop)
    }
  }

  const setPlayingUi = (playing: boolean): void => {
    player.classList.toggle('video-player--playing', playing)
    playToggle.setAttribute('aria-label', playing ? 'Pause' : 'Play')
    playToggle.setAttribute('aria-pressed', String(playing))
  }

  const play = async (): Promise<void> => {
    try {
      await video.play()
      setPlayingUi(true)
      startProgressLoop()
    } catch {
      /* autoplay policy or missing source */
    }
  }

  const pause = (): void => {
    video.pause()
    setPlayingUi(false)
    stopProgressLoop()
    updateProgress()
  }

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
      modal.classList.add('modal--video-open')
    })
  }

  const close = (): void => {
    if (!isOpen) return
    isOpen = false

    pause()
    stopProgressLoop()
    video.currentTime = 0
    updateProgress()

    void exitFullscreen()

    modal.classList.remove('modal--video-open', 'modal--backdrop-on')
    openBtn.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('has-modal-open')

    closeTimer = window.setTimeout(() => {
      modal.setAttribute('hidden', '')
      closeTimer = null
    }, CLOSE_MS)
  }

  openBtn.addEventListener('click', open)

  closeTriggers.forEach((el) => {
    el.addEventListener('click', close)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close()
  })

  centerPlay.addEventListener('click', () => {
    void play()
  })

  playToggle.addEventListener('click', () => {
    if (video.paused) void play()
    else pause()
  })

  video.addEventListener('click', () => {
    if (video.paused) void play()
    else pause()
  })

  video.addEventListener('loadedmetadata', updateProgress)
  video.addEventListener('ended', () => {
    stopProgressLoop()
    setPlayingUi(false)
    updateProgress()
  })

  seek.addEventListener('pointerdown', () => {
    player.classList.add('video-player--seeking')
    stopProgressLoop()
  })

  seek.addEventListener('pointerup', () => {
    player.classList.remove('video-player--seeking')
    if (!video.paused) startProgressLoop()
  })

  seek.addEventListener('pointercancel', () => {
    player.classList.remove('video-player--seeking')
    if (!video.paused) startProgressLoop()
  })

  seek.addEventListener('input', () => {
    const ratio = Number(seek.value) / 100
    if (video.duration) {
      video.currentTime = ratio * video.duration
    }
    setProgress(ratio)
  })

  volumeBtn.addEventListener('click', () => {
    video.muted = !video.muted
    volumeBtn.classList.toggle('video-player__volume--muted', video.muted)
    volumeBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute')
  })

  fullscreenBtn.addEventListener('click', () => {
    if (isFullscreen()) {
      void exitFullscreen()
      return
    }
    void enterFullscreen()
  })

  document.addEventListener('fullscreenchange', syncFullscreenUi)
  document.addEventListener('webkitfullscreenchange', syncFullscreenUi)
  video.addEventListener('webkitbeginfullscreen', syncFullscreenUi)
  video.addEventListener('webkitendfullscreen', syncFullscreenUi)
}
