"use client";

import { useEffect, useState } from "react";
import { useLearnMoreModal } from "../model/store";

const CLOSE_MS = 520;

export function LearnMoreModal() {
  const { isOpen, close } = useLearnMoreModal();
  const [visible, setVisible] = useState(false);
  const [animOpen, setAnimOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimOpen(true)));
      document.body.classList.add("has-modal-open");
    } else {
      setAnimOpen(false);
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

  const cls = [
    "modal",
    "modal--learn-more",
    animOpen ? "modal--learn-open" : "",
    animOpen ? "modal--backdrop-on" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cls}
      id="modal-learn-more"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-learn-more-title"
      hidden={!visible}
    >
      <div className="modal__backdrop" data-modal-close aria-hidden="true" onClick={close}></div>
      <div className="modal__content modal__content--learn">
        <div className="modal__learn-wrap">
          <div className="modal__learn-stage">
            <div className="modal__learn-scroll">
              <h2 className="modal__title text-display" id="modal-learn-more-title">
                <span className="modal__title-line">THE DIGITAL BRIDGE</span>
                <span className="modal__title-line">BETWEEN REALITY AND</span>
                <span className="modal__title-line">TOMORROW</span>
              </h2>
              <div className="modal__body">
                <p className="modal__text">
                  <span className="modal__text-line">When you turn on your smart alarm clock in the morning of 2026, it already knows you slept seventeen minutes</span>
                  <span className="modal__text-line">less than usual. The algorithm picks a morning playlist based on your heart rate and the current moon phase.</span>
                  <span className="modal__text-line">Your voice assistant, trained on thousands of previous conversations, doesn&apos;t just say &quot;good morning&quot; - it</span>
                  <span className="modal__text-line">reminds you: &quot;Don&apos;t forget to pick up your package from the drone post before 10:30 AM.&quot; You step up to the</span>
                  <span className="modal__text-line">mirror, and instead of your reflection, you see graphs of your hydration levels, your daily schedule, and a</span>
                  <span className="modal__text-line">suggestion: &quot;You might want to take extra vitamin D - it&apos;s going to be cloudy today.&quot;</span>
                </p>
                <p className="modal__text">
                  <span className="modal__text-line">In the evening, you activate &quot;dark matter&quot; mode at home: the lights dim gradually. Following your movement: the</span>
                  <span className="modal__text-line">Wi-Fi reallocates bandwidth to stream a movie in 32K; and the lounge chair warms up exactly the spot on your</span>
                  <span className="modal__text-line">back that got tired from sitting. On screen - not just a film: a generative neural network adjusts the subtitles,</span>
                  <span className="modal__text-line">replaces store signs with brands you recognize, and even redubs the actors if you whisper a request.</span>
                </p>
                <p className="modal__text">
                  <span className="modal__text-line">When you turn on your smart alarm clock in the morning of 2026, it already knows you slept seventeen minutes</span>
                  <span className="modal__text-line">less than usual. The algorithm picks a morning playlist based on your heart rate and the current moon phase.</span>
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="modal__close modal__close--corner"
            data-modal-close
            aria-label="Close dialog"
            onClick={close}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
