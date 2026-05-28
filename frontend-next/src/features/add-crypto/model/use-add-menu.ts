"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type MenuPhase = "closed" | "open" | "closing";

const OPEN_DURATION_MS = 920;
const CLOSE_DURATION_MS = 920;

/**
 * Drives the open/close animation of the "Add a Cryptocurrency" menu.
 *
 * Phases:
 * - `closed`  — menu hidden
 * - `open`    — menu visible, items fade in with stagger
 * - `closing` — items fade out with reverse stagger, then panel collapses
 */
export function useAddMenu() {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const open = useCallback(() => {
    clearTimer();
    setPhase("open");
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setPhase("closing");
    closeTimerRef.current = setTimeout(() => setPhase("closed"), CLOSE_DURATION_MS);
  }, []);

  const toggle = useCallback(() => {
    if (phase === "open") {
      close();
    } else if (phase === "closed") {
      open();
    }
  }, [phase, close, open]);

  useEffect(() => () => clearTimer(), []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (phase !== "open") return;

    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target && !target.closest("#crypto-add")) {
        close();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [phase, close]);

  return { phase, isOpen: phase === "open", isClosing: phase === "closing", toggle, open, close, OPEN_DURATION_MS };
}
