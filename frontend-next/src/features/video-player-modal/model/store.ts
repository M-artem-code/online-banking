"use client";

import { create } from "zustand";

interface VideoModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useVideoModal = create<VideoModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
