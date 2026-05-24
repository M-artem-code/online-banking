"use client";

import { useEffect, useRef } from "react";
import { AuthCard } from "@/features/auth-google";
import { useLearnMoreModal } from "@/features/learn-more-modal";
import { useVideoModal } from "@/features/video-player-modal";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const openLearnMore = useLearnMoreModal((s) => s.open);
  const openVideo = useVideoModal((s) => s.open);

  useEffect(() => {
    const handleClick = () => {
      videoRef.current?.play().catch(() => {});
    };
    document.addEventListener("click", handleClick, { once: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <section id="hero" className="hero section" data-component="hero" aria-label="Hero">
      <video
        className="hero__video"
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/video/HP.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" aria-hidden="true"></div>

      <div className="hero__layout container">
        <div className="hero__copy">
          <h1 className="hero__title text-display text-display--xl">
            <span className="hero__title-line">FROM THE</span>
            <span className="hero__title-line">FIELD OF ALL</span>
            <span className="hero__title-line">POSSIBILITY</span>
          </h1>
          <p className="hero__subtitle text-body-muted">
            <span className="hero__subtitle-line">This is an emergent space where ideas are not created, but carefully discovered. We</span>
            <span className="hero__subtitle-line">navigate the vast potential to bring forth only the most resonant patterns and coherent</span>
            <span className="hero__subtitle-line">forms. Here, the future is curated from the infinite.</span>
          </p>
          <div className="hero__actions">
            <button
              type="button"
              className="btn-split btn-split--learn"
              id="btn-learn-more"
              aria-haspopup="dialog"
              aria-controls="modal-learn-more"
              aria-expanded="false"
              onClick={openLearnMore}
            >
              <span className="btn-split__label">Learn More</span>
              <span className="btn-split__icon" aria-hidden="true"></span>
            </button>
            <button
              type="button"
              className="btn-split btn-split--video"
              id="btn-play-video"
              aria-haspopup="dialog"
              aria-controls="modal-video"
              aria-expanded="false"
              onClick={openVideo}
            >
              <span className="btn-split__label">Play Video</span>
              <span className="btn-split__icon btn-split__icon--play" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <AuthCard />
      </div>
    </section>
  );
}
