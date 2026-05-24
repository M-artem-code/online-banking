"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface IntroContextValue {
  introComplete: boolean;
  onIntroComplete: (fn: () => void) => void;
  triggerIntroComplete: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  introComplete: false,
  onIntroComplete: () => {},
  triggerIntroComplete: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const callbacksRef = useRef<Array<() => void>>([]);

  const onIntroComplete = useCallback((fn: () => void) => {
    callbacksRef.current.push(fn);
  }, []);

  const triggerIntroComplete = useCallback(() => {
    setIntroComplete(true);
    callbacksRef.current.forEach((fn) => fn());
    callbacksRef.current = [];
  }, []);

  return (
    <IntroContext.Provider value={{ introComplete, onIntroComplete, triggerIntroComplete }}>
      {children}
    </IntroContext.Provider>
  );
}
