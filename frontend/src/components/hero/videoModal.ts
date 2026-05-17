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
  const timeCurrent = modal.querySelector<HTMLElement>('.video-player__time-current')
  const timeDuration = modal.querySelector<HTMLElement>('.video-player__time-duration')
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
    !timeCurrent ||
    !timeDuration ||
    !volumeBtn ||
    !fullscreenBtn ||
    !player
  ) {
    return
  }

  const doc = document as DocumentWithWebkit
  const videoEl = video as VideoWithWebkit

  video.controls = false

  let isOpen = false
  let closeTimer: ReturnType<typeof window.setTimeout> | null = null
  let progressRaf: number | null = null
  let isScrubbing = false

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
      /* Player shell — keeps custom controls + click-to-pause in fullscreen */
      if (player.requestFullscreen) {
        await player.requestFullscreen()
        return
      }

      if (videoEl.webkitEnterFullscreen) {
        videoEl.webkitEnterFullscreen()
        return
      }

      if (video.requestFullscreen) {
        await video.requestFullscreen()
        return
      }
    } catch {
      /* fall through to CSS cinema mode */
    }

    player.classList.add('video-player--cinema')
    syncFullscreenUi()
  }

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    const total = Math.floor(seconds)
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const secs = total % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(secs)}`
    return `${minutes}:${pad(secs)}`
  }

  const updateTime = (): void => {
    timeCurrent.textContent = formatTime(video.currentTime)
    timeDuration.textContent = formatTime(video.duration)
  }

  const setProgress = (ratio: number): void => {
    const clamped = Math.min(1, Math.max(0, ratio))
    seek.value = String(clamped * 100)
    progressFill.style.setProperty('--progress', String(clamped))
  }

  const seekToRatio = (ratio: number): void => {
    const clamped = Math.min(1, Math.max(0, ratio))
    setProgress(clamped)
    if (video.duration) {
      const targetTime = clamped * video.duration
      video.currentTime = targetTime
      timeCurrent.textContent = formatTime(targetTime)
    } else {
      updateTime()
    }
  }

  const updateProgress = (): void => {
    if (isScrubbing) return
    setProgress(video.duration ? video.currentTime / video.duration : 0)
    updateTime()
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

  const togglePlayPause = (): void => {
    if (video.paused) void play()
    else pause()
  }

  const isPlayerChromeTarget = (target: EventTarget | null): boolean =>
    target instanceof Element &&
    Boolean(target.closest('.video-player__controls, .video-player__center-play'))

  player.addEventListener('click', (e) => {
    if (isPlayerChromeTarget(e.target)) return
    togglePlayPause()
  })

  video.addEventListener('loadedmetadata', updateProgress)
  video.addEventListener('durationchange', updateProgress)
  video.addEventListener('timeupdate', updateProgress)
  video.addEventListener('seeked', updateProgress)
  video.addEventListener('ended', () => {
    stopProgressLoop()
    setPlayingUi(false)
    updateProgress()
  })

  const endScrub = (): void => {
    isScrubbing = false
    player.classList.remove('video-player--seeking')
    updateProgress()
    if (!video.paused) startProgressLoop()
  }

  seek.addEventListener('pointerdown', () => {
    isScrubbing = true
    player.classList.add('video-player--seeking')
    stopProgressLoop()
  })

  seek.addEventListener('pointerup', endScrub)
  seek.addEventListener('pointercancel', endScrub)

  seek.addEventListener('input', () => {
    seekToRatio(Number(seek.value) / 100)
  })

  seek.addEventListener('change', () => {
    seekToRatio(Number(seek.value) / 100)
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
