"use client";

import { useEffect, useRef, useState } from "react";
import type { Coin } from "../model/types";
import { formatPrice } from "@/shared/lib/format-price";

export type CoinSide = "left" | "right";

interface CoinRowProps {
  coin: Coin;
  side: CoinSide;
  price?: number;
  direction?: "up" | "down" | null;
}

export function CoinRow({ coin, side, price, direction }: CoinRowProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevDir = useRef<"up" | "down" | null>(null);

  useEffect(() => {
    if (direction && direction !== prevDir.current) {
      setFlash(direction);
      prevDir.current = direction;
      const t = setTimeout(() => setFlash(null), 900);
      return () => clearTimeout(t);
    }
  }, [direction]);

  const priceText = price !== undefined ? formatPrice(price, coin.decimals) : "—";
  const flashClass = flash ? ` crypto-row__price--flash-${flash}` : "";

  if (side === "left") {
    return (
      <li className="crypto-row crypto-row--left" data-coin={coin.id}>
        <span className={`crypto-row__price text-price${flashClass}`} data-price>{priceText}</span>
        <span className="crypto-row__name">{coin.name}</span>
        <span className="crypto-row__icon" aria-hidden="true"></span>
      </li>
    );
  }

  return (
    <li className="crypto-row crypto-row--right" data-coin={coin.id}>
      <span className="crypto-row__icon" aria-hidden="true"></span>
      <span className="crypto-row__name">{coin.name}</span>
      <span className={`crypto-row__price text-price${flashClass}`} data-price>{priceText}</span>
    </li>
  );
}
