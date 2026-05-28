"use client";

import type { ReactNode } from "react";
import { IntroProvider } from "@/features/intro-sequence";

export function AppProviders({ children }: { children: ReactNode }) {
  return <IntroProvider>{children}</IntroProvider>;
}
