"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useIntro } from "./IntroProvider";
import { CryptoSocket } from "@/services/cryptoSocket";
import { COINS, COIN_BY_SYMBOL } from "@/config/coins";
import { formatPrice } from "@/utils/formatPrice";
import type { TickerUpdate } from "@/types/crypto";

const ADDABLE_COIN_IDS = ["usdc", "bnb", "usdt", "sol"];
const ACTIVE_ADD_COIN_ID = "sol";

export function CryptoHub() {
  const { introComplete } = useIntro();
  const [prices, setPrices] = useState<Record<string, { price: number; direction: "up" | "down" | null }>>({});
  const [connected, setConnected] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [solanaAdded, setSolanaAdded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const socketRef = useRef<CryptoSocket | null>(null);
  const prevPricesRef = useRef<Record<string, number>>({});

  const handleTick = useCallback((update: TickerUpdate) => {
    const coin = COIN_BY_SYMBOL[update.symbol];
    if (!coin) return;
    const prevPrice = prevPricesRef.current[coin.id];
    const direction = prevPrice !== undefined
      ? update.price > prevPrice ? "up" : update.price < prevPrice ? "down" : null
      : null;
    prevPricesRef.current[coin.id] = update.price;
    setPrices((prev) => ({ ...prev, [coin.id]: { price: update.price, direction } }));

    if (update.symbol === "USDC") {
      prevPricesRef.current["usdt"] = update.price;
      setPrices((prev) => ({ ...prev, usdt: { price: update.price, direction } }));
    }
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    const socket = new CryptoSocket(handleTick, setConnected);
    socketRef.current = socket;
    socket.connect();
    return () => socket.disconnect();
  }, [introComplete, handleTick]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleAddCrypto = useCallback(() => {
    setAddMenuOpen((prev) => !prev);
  }, []);

  const handleSelectSolana = useCallback(() => {
    setSolanaAdded(true);
    setAddMenuOpen(false);
  }, []);

  const leftCoins = COINS.filter((c) => c.column === "left");
  const rightCoins = COINS.filter((c) => c.column === "right" && c.id !== "sol");

  return (
    <section
      id="crypto"
      className={`crypto-hub section${isAnimated ? " is-animated" : ""}${!connected ? " crypto-hub--reconnecting" : ""}${solanaAdded ? " crypto-hub--solana-added" : ""}`}
      data-component="crypto-hub"
      aria-label="Live cryptocurrency markets"
      ref={sectionRef}
    >
      <CryptoLines />

      <div className="crypto-hub__layout container">
        <div className="crypto-hub__col crypto-hub__col--left">
          <ul className="crypto-list crypto-list--left" id="crypto-list-left" role="list">
            {leftCoins.map((coin) => (
              <CryptoRow key={coin.id} coin={coin} side="left" priceData={prices[coin.id]} />
            ))}
          </ul>
        </div>

        <div className="crypto-hub__center">
          <div className="crypto-hub__rings-wrap">
            <div className="crypto-hub__rings" aria-hidden="true">
              <div className="crypto-hub__rings-rotator">
                <img className="crypto-hub__ring crypto-hub__ring--1" src="/figma/border/Ellipse1.png" srcSet="/figma/border/Ellipse1.png 1x, /figma/border/Ellipse1@2x.png 2x" alt="" width="594" height="594" />
                <img className="crypto-hub__ring crypto-hub__ring--2" src="/figma/border/Ellipse2.png" srcSet="/figma/border/Ellipse2.png 1x, /figma/border/Ellipse2@2x.png 2x" alt="" width="672" height="672" />
                <img className="crypto-hub__ring crypto-hub__ring--3" src="/figma/border/Ellipse3.png" srcSet="/figma/border/Ellipse3.png 1x, /figma/border/Ellipse3@2x.png 2x" alt="" width="764" height="764" />
              </div>
            </div>
            <div className="crypto-hub__center-ui">
              <h2 className="crypto-hub__heading text-display">Online Banking</h2>
              <div className={`crypto-hub__add${addMenuOpen ? " crypto-hub__add--open" : ""}`} id="crypto-add">
                <button
                  type="button"
                  className="crypto-hub__add-btn"
                  id="btn-add-crypto"
                  aria-haspopup="listbox"
                  aria-expanded={addMenuOpen}
                  aria-controls="crypto-add-menu"
                  onClick={handleAddCrypto}
                >
                  <span className="crypto-hub__add-label">Add a Cryptocurrency</span>
                  <span className="crypto-hub__add-chevron" aria-hidden="true"></span>
                </button>
                <div
                  id="crypto-add-menu"
                  className={`crypto-hub__add-menu${addMenuOpen ? " crypto-hub__add-menu--visible" : ""}`}
                  role="listbox"
                  aria-label="Add a cryptocurrency"
                  aria-hidden={!addMenuOpen}
                >
                  <ul className="crypto-hub__add-list" role="presentation">
                    {ADDABLE_COIN_IDS.map((coinId) => {
                      const coin = COINS.find((c) => c.id === coinId)!;
                      const isActive = coinId === ACTIVE_ADD_COIN_ID;
                      const isAdded = coinId === "sol" && solanaAdded;
                      return (
                        <li key={coinId} className={`crypto-hub__add-item${addMenuOpen ? " crypto-hub__add-item--revealed" : ""}${isAdded ? " crypto-hub__add-item--added" : ""}`}>
                          <button
                            type="button"
                            className={`crypto-hub__add-option${!isActive ? " crypto-hub__add-option--inactive" : " crypto-hub__add-option--selected"}${isAdded ? " crypto-hub__add-option--added" : ""}`}
                            data-add-coin={coinId}
                            onClick={isActive && !isAdded ? handleSelectSolana : undefined}
                            disabled={!isActive || isAdded}
                          >
                            <span className={`crypto-hub__add-option-icon crypto-hub__add-option-icon--${coinId}`}></span>
                            <span className="crypto-hub__add-option-label">{coin.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="crypto-hub__col crypto-hub__col--right">
          <ul className="crypto-list crypto-list--right" id="crypto-list-right" role="list">
            {rightCoins.map((coin) => (
              <CryptoRow key={coin.id} coin={coin} side="right" priceData={prices[coin.id]} />
            ))}
            {solanaAdded && (
              <CryptoRow coin={COINS.find((c) => c.id === "sol")!} side="right" priceData={prices["sol"]} />
            )}
          </ul>
        </div>

        <div id="crypto-grid" className="crypto-grid crypto-hub__live-grid" aria-live="polite"></div>
      </div>
    </section>
  );
}

function CryptoRow({
  coin,
  side,
  priceData,
}: {
  coin: { id: string; name: string; decimals: number };
  side: "left" | "right";
  priceData?: { price: number; direction: "up" | "down" | null };
}) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevDirection = useRef<"up" | "down" | null>(null);

  useEffect(() => {
    if (priceData?.direction && priceData.direction !== prevDirection.current) {
      setFlash(priceData.direction);
      prevDirection.current = priceData.direction;
      const timer = setTimeout(() => setFlash(null), 900);
      return () => clearTimeout(timer);
    }
  }, [priceData]);

  const priceText = priceData ? formatPrice(priceData.price, coin.decimals) : "—";
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

function CryptoLines() {
  return (
    <div className="crypto-hub__lines" aria-hidden="true">
      <svg className="crypto-hub__line-svg crypto-hub__line-svg--tl" viewBox="0 0 460 209" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="crypto-hub__line-path" pathLength={1} d="M0.85011 208.024C0.850114 190.024 0.0623536 123.198 0.850116 93.5246C1.06243 85.5275 4.58025 81.3485 7.35009 78.0246C9.85005 75.0246 63.1835 28.5246 88.8501 6.02463C90.3501 4.70971 96.3501 0.124633 104.35 0.524633C112.35 0.924633 344.35 0.6913 459.35 0.524633" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--tl-start" cx="0.85" cy="208.024" r="5.5" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--tl-end" cx="459.35" cy="0.524633" r="5.5" />
      </svg>

      <svg className="crypto-hub__line-svg crypto-hub__line-svg--br" viewBox="0 0 614 287" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="crypto-hub__line-path" pathLength={1} d="M613 0.00732422C612.5 34.5073 613 105.007 613 113.507C613 121.597 608.238 127.007 605 130.507C586.5 150.507 548.8 191.307 546 194.507C543.2 197.707 537.5 201.507 531 201.507C462.833 201.174 326.1 200.707 316.5 201.507C306.9 202.307 302.3 209.507 299.5 213.007C282.167 234.674 247.5 276.607 245.5 279.007C243.5 281.407 239 286.007 229 286.007H0" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--br-start" cx="613" cy="0.00732422" r="5.5" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--br-end" cx="0" cy="286.007" r="5.5" />
      </svg>
    </div>
  );
}
