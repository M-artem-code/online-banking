"use client";

import { useEffect, useState, type RefObject } from "react";

interface Options {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionOnce<T extends Element>(
  ref: RefObject<T | null>,
  options: Options = {}
): boolean {
  const [intersected, setIntersected] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || intersected) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.25,
        rootMargin: options.rootMargin ?? "0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, intersected, options.threshold, options.rootMargin]);

  return intersected;
}
