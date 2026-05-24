"use client";

import { useEffect, useRef } from "react";
import { useIntro } from "../model/intro-context";

const HOLD_MS = 450;
const OPEN_MS = 1050;
const REVEAL_START_AFTER_CURTAIN_MS = Math.round(OPEN_MS * 0.5);
const HERO_INTRO_ANIM_MS = 780 + 950;

function playHeroVideo() {
  document.querySelector<HTMLVideoElement>(".hero__video")?.play().catch(() => {});
}

function initCryptoScrollReveal() {
  const hub = document.getElementById("crypto");
  if (!hub) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hub.classList.add("crypto-hub--in-view");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        hub.classList.add("crypto-hub--in-view");
        observer.disconnect();
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  observer.observe(hub);
}

export function IntroCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const { triggerIntroComplete } = useIntro();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const html = document.documentElement;
    const body = document.body;
    const curtain = curtainRef.current;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      html.classList.remove("is-intro-pending");
      body.classList.remove("is-intro-pending");
      html.classList.add("page--revealed", "page--ready", "page--intro-done");
      html.classList.remove("page--intro");
      body.classList.add("page--revealed", "page--ready", "page--intro-done");
      body.classList.remove("page--intro");
      curtain?.remove();
      initCryptoScrollReveal();
      triggerIntroComplete();
      playHeroVideo();
      return;
    }

    setTimeout(() => {
      curtain?.classList.add("intro-curtain--open");
      playHeroVideo();
    }, HOLD_MS);

    setTimeout(() => {
      html.classList.add("page--revealed");
      body.classList.add("page--revealed");
      requestAnimationFrame(() => {
        html.classList.remove("is-intro-pending");
        body.classList.remove("is-intro-pending");
      });
    }, HOLD_MS + REVEAL_START_AFTER_CURTAIN_MS);

    setTimeout(() => {
      if (curtain) {
        curtain.classList.add("intro-curtain--done");
        curtain.remove();
      }
      document.getElementById("intro-critical")?.remove();
      html.classList.remove("page--intro");
      html.classList.add("page--ready");
      body.classList.remove("page--intro");
      body.classList.add("page--ready");
      initCryptoScrollReveal();
      triggerIntroComplete();
    }, HOLD_MS + OPEN_MS + 60);

    setTimeout(() => {
      html.classList.add("page--intro-done");
      body.classList.add("page--intro-done");
    }, HOLD_MS + REVEAL_START_AFTER_CURTAIN_MS + HERO_INTRO_ANIM_MS);
  }, [triggerIntroComplete]);

  return <div id="intro-curtain" className="intro-curtain" aria-hidden="true" ref={curtainRef} />;
}
