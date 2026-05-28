"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BinanceSocket, type TickerUpdate } from "../api/binance-socket";
import { COIN_BY_SYMBOL, COIN_LIST, type CoinId } from "@/entities/coin";

export interface LivePrice {
  price: number;
  direction: "up" | "down" | null;
}

export type PriceMap = Partial<Record<CoinId, LivePrice>>;

interface UseLivePricesResult {
  prices: PriceMap;
  connected: boolean;
}

export function useLivePrices(enabled: boolean): UseLivePricesResult {
  const [prices, setPrices] = useState<PriceMap>({});
  const [connected, setConnected] = useState(true);
  const prevPriceRef = useRef<Partial<Record<CoinId, number>>>({});

  const handleTick = useCallback((update: TickerUpdate) => {
    const coin = COIN_BY_SYMBOL[update.symbol];
    if (!coin) return;
    const prev = prevPriceRef.current[coin.id];
    const direction: LivePrice["direction"] =
      prev !== undefined
        ? update.price > prev
          ? "up"
          : update.price < prev
          ? "down"
          : null
        : null;
    prevPriceRef.current[coin.id] = update.price;

    setPrices((p) => {
      const next: PriceMap = { ...p, [coin.id]: { price: update.price, direction } };
      // Propagate to peg-mirrored coins (e.g. USDT mirrors USDC).
      for (const peg of COIN_LIST) {
        if (peg.pegMirrorOf === coin.id) {
          const prevPeg = prevPriceRef.current[peg.id];
          const dir: LivePrice["direction"] =
            prevPeg !== undefined
              ? update.price > prevPeg ? "up" : update.price < prevPeg ? "down" : null
              : null;
          prevPriceRef.current[peg.id] = update.price;
          next[peg.id] = { price: update.price, direction: dir };
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const socket = new BinanceSocket(handleTick, setConnected);
    socket.connect();
    return () => socket.disconnect();
  }, [enabled, handleTick]);

  return { prices, connected };
}
