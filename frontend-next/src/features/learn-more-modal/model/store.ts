"use client";

import { create } from "zustand";

interface LearnMoreModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useLearnMoreModal = create<LearnMoreModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
