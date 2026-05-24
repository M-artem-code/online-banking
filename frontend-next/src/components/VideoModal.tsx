"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export function VideoModal() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const rafRef = useRef<number>(0);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const video = videoRef.current;
      const fill = playerRef.current?.querySelector<HTMLElement>(".video-player__progress-fill");
      if (video && fill && !seeking) {
        const progress = video.duration ? video.currentTime / video.duration : 0;
        fill.style.setProperty("--progress", String(progress));
        setCurrentTime(formatTime(video.currentTime));
        if (seekRef.current) seekRef.current.value = String(progress * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, seeking]);

  const closeModal = useCallback(() => {
    const modal = document.getElementById("modal-video");
    if (!modal) return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
    modal.classList.remove("modal--video-open");
    modal.classList.remove("modal--backdrop-on");
    document.body.classList.remove("has-modal-open");
    setTimeout(() => modal.setAttribute("hidden", ""), 520);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const handleSeekStart = () => setSeeking(true);
  const handleSeekEnd = () => {
    setSeeking(false);
    const video = videoRef.current;
    if (video && seekRef.current) {
      video.currentTime = (parseFloat(seekRef.current.value) / 100) * video.duration;
    }
  };
  const handleSeekInput = () => {
    const video = videoRef.current;
    const fill = playerRef.current?.querySelector<HTMLElement>(".video-player__progress-fill");
    if (video && seekRef.current && fill) {
      const val = parseFloat(seekRef.current.value) / 100;
      fill.style.setProperty("--progress", String(val));
      video.currentTime = val * video.duration;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (!document.fullscreenElement) {
      player.requestFullscreen?.().catch(() => {
        player.classList.add("video-player--cinema");
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        playerRef.current?.classList.remove("video-player--cinema");
        setFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const modal = document.getElementById("modal-video");
        if (modal && !modal.hasAttribute("hidden")) closeModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    <div className="modal modal--video" id="modal-video" role="dialog" aria-modal="true" aria-label="Promo video" hidden>
      <div className="modal__backdrop" data-modal-close aria-hidden="true" onClick={closeModal}></div>
      <div className="modal__content modal__content--video">
        <div className="modal__video-wrap">
          <div className="modal__video-stage">
            <div className={`video-player${playing ? " video-player--playing" : ""}${seeking ? " video-player--seeking" : ""}`} id="video-player" ref={playerRef} onClick={togglePlay}>
              <video
                className="video-player__media"
                ref={videoRef}
                src="/video/HP.mp4"
                preload="metadata"
                playsInline
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(formatTime(videoRef.current.duration));
                }}
                onEnded={() => setPlaying(false)}
                onClick={(e) => e.stopPropagation()}
              />
              <button type="button" className="video-player__center-play" aria-label="Play video" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                <span className="video-player__play-icon" aria-hidden="true"></span>
              </button>
              <div className="video-player__controls" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="video-player__play-toggle" aria-label="Play" aria-pressed={playing} onClick={togglePlay}>
                  <svg className="video-player__icon video-player__icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5v11l10-5.5-10-5.5z" fill="currentColor" /></svg>
                  <svg className="video-player__icon video-player__icon--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h3.5v12H7V6zm6.5 0H17v12h-3.5V6z" fill="currentColor" /></svg>
                </button>
                <span className="video-player__time" aria-hidden="true">
                  <span className="video-player__time-current">{currentTime}</span>
                  <span className="video-player__time-sep">/</span>
                  <span className="video-player__time-duration">{duration}</span>
                </span>
                <div className="video-player__progress-wrap">
                  <div className="video-player__progress-track" aria-hidden="true">
                    <div className="video-player__progress-fill"></div>
                  </div>
                  <input
                    type="range"
                    className="video-player__seek"
                    ref={seekRef}
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue="0"
                    aria-label="Seek"
                    onPointerDown={handleSeekStart}
                    onPointerUp={handleSeekEnd}
                    onPointerCancel={handleSeekEnd}
                    onInput={handleSeekInput}
                    onChange={handleSeekInput}
                  />
                </div>
                <button type="button" className={`video-player__volume${muted ? " video-player__volume--muted" : ""}`} aria-label="Mute" onClick={toggleMute}>
                  <svg className="video-player__icon video-player__icon--volume-on" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 5.5 6.5 9.5H3.5v5h3L11 18.5V5.5z" fill="currentColor" />
                    <path d="M14.2 8.8a4.2 4.2 0 0 1 0 6.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M16.6 6.4a7.6 7.6 0 0 1 0 11.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <svg className="video-player__icon video-player__icon--volume-off" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 5.5 6.5 9.5H3.5v5h3L11 18.5V5.5z" fill="currentColor" />
                    <path d="M15.5 9.5 18.5 12.5M18.5 9.5 15.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <button type="button" className={`video-player__fullscreen${fullscreen ? " video-player__fullscreen--active" : ""}`} aria-label="Fullscreen" onClick={toggleFullscreen}>
                  <svg className="video-player__icon video-player__icon--fullscreen" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5.5 9V5.5H9M15 5.5H18.5V9M18.5 15v3.5H15M9 18.5H5.5V15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg className="video-player__icon video-player__icon--fullscreen-exit" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 9.5V5.5H5M15 5.5h4V9.5M19 15v4h-4M9 18.5H5V15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="modal__close modal__close--corner" data-modal-close aria-label="Close video" onClick={closeModal}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
