"use client";

import { create } from "zustand";
import { COIN_IDS, type CoinId } from "@/entities/coin";

/** Initial layout: 3 coins on the left, 4 on the right. The rest go into the "Add" menu. */
const INITIAL_LEFT: CoinId[] = ["btc", "eth", "ada"];
const INITIAL_RIGHT: CoinId[] = ["bnb", "doge", "sui", "usdt"];

interface CryptoState {
  leftCoins: CoinId[];
  rightCoins: CoinId[];
  /** Coins not currently displayed — these are the ones offered in the "Add" menu. */
  addableCoins: () => CoinId[];
  /** Adds a coin to the column with fewer items (right wins on ties). */
  addCoin: (id: CoinId) => void;
  reset: () => void;
}

function buildAddable(left: CoinId[], right: CoinId[]): CoinId[] {
  const displayed = new Set<CoinId>([...left, ...right]);
  return COIN_IDS.filter((id) => !displayed.has(id));
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  leftCoins: INITIAL_LEFT,
  rightCoins: INITIAL_RIGHT,
  addableCoins: () => buildAddable(get().leftCoins, get().rightCoins),
  addCoin: (id) => {
    const { leftCoins, rightCoins } = get();
    if (leftCoins.includes(id) || rightCoins.includes(id)) return;
    if (leftCoins.length < rightCoins.length) {
      set({ leftCoins: [...leftCoins, id] });
    } else {
      set({ rightCoins: [...rightCoins, id] });
    }
  },
  reset: () => set({ leftCoins: INITIAL_LEFT, rightCoins: INITIAL_RIGHT }),
}));
