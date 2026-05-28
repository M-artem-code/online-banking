"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useVideoModal } from "../model/store";

const CLOSE_MS = 520;

function formatTime(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoModal() {
  const { isOpen, close } = useVideoModal();
  const [visible, setVisible] = useState(false);
  const [animOpen, setAnimOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Open / close lifecycle (mirrors learn-more modal).
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimOpen(true)));
      document.body.classList.add("has-modal-open");
    } else {
      setAnimOpen(false);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
      setPlaying(false);
      const t = setTimeout(() => setVisible(false), CLOSE_MS);
      document.body.classList.remove("has-modal-open");
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, close]);

  // Progress tick.
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const v = videoRef.current;
      const fill = playerRef.current?.querySelector<HTMLElement>(".video-player__progress-fill");
      if (v && fill && !seeking) {
        const progress = v.duration ? v.currentTime / v.duration : 0;
        fill.style.setProperty("--progress", String(progress));
        setCurrentTime(formatTime(v.currentTime));
        if (seekRef.current) seekRef.current.value = String(progress * 100);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, seeking]);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        playerRef.current?.classList.remove("video-player--cinema");
        setFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const handleSeekInput = () => {
    const v = videoRef.current;
    const fill = playerRef.current?.querySelector<HTMLElement>(".video-player__progress-fill");
    if (v && seekRef.current && fill) {
      const ratio = parseFloat(seekRef.current.value) / 100;
      fill.style.setProperty("--progress", String(ratio));
      v.currentTime = ratio * v.duration;
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (!document.fullscreenElement) {
      player.requestFullscreen?.().catch(() => player.classList.add("video-player--cinema"));
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  const cls = [
    "modal",
    "modal--video",
    animOpen ? "modal--video-open" : "",
    animOpen ? "modal--backdrop-on" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      id="modal-video"
      role="dialog"
      aria-modal="true"
      aria-label="Promo video"
      hidden={!visible}
    >
      <div className="modal__backdrop" data-modal-close aria-hidden="true" onClick={close}></div>
      <div className="modal__content modal__content--video">
        <div className="modal__video-wrap">
          <div className="modal__video-stage">
            <div
              className={`video-player${playing ? " video-player--playing" : ""}${seeking ? " video-player--seeking" : ""}`}
              id="video-player"
              ref={playerRef}
              onClick={togglePlay}
            >
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
              <button
                type="button"
                className="video-player__center-play"
                aria-label="Play video"
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              >
                <span className="video-player__play-icon" aria-hidden="true"></span>
              </button>
              <div className="video-player__controls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="video-player__play-toggle"
                  aria-label={playing ? "Pause" : "Play"}
                  aria-pressed={playing}
                  onClick={togglePlay}
                >
                  <svg className="video-player__icon video-player__icon--play" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6.5v11l10-5.5-10-5.5z" fill="currentColor" />
                  </svg>
                  <svg className="video-player__icon video-player__icon--pause" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 6h3.5v12H7V6zm6.5 0H17v12h-3.5V6z" fill="currentColor" />
                  </svg>
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
                    onPointerDown={() => setSeeking(true)}
                    onPointerUp={() => setSeeking(false)}
                    onPointerCancel={() => setSeeking(false)}
                    onInput={handleSeekInput}
                    onChange={handleSeekInput}
                  />
                </div>
                <button
                  type="button"
                  className={`video-player__volume${muted ? " video-player__volume--muted" : ""}`}
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={toggleMute}
                >
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
                <button
                  type="button"
                  className={`video-player__fullscreen${fullscreen ? " video-player__fullscreen--active" : ""}`}
                  aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                  onClick={toggleFullscreen}
                >
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
          <button
            type="button"
            className="modal__close modal__close--corner"
            data-modal-close
            aria-label="Close video"
            onClick={close}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
