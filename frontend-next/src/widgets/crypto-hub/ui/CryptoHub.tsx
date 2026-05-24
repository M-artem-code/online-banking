"use client";

import { useRef, type CSSProperties } from "react";
import { useIntro } from "@/features/intro-sequence";
import { useLivePrices } from "@/features/crypto-live-prices";
import { useCryptoStore, AddCryptoMenu } from "@/features/add-crypto";
import { CoinRow, getCoin } from "@/entities/coin";
import { useIntersectionOnce } from "@/shared/lib/use-intersection-once";
import { CryptoLines } from "./CryptoLines";
import { CryptoRings } from "./CryptoRings";

type CryptoHubStyle = CSSProperties & {
  "--crypto-row-count-left"?: number;
  "--crypto-row-count-right"?: number;
};

export function CryptoHub() {
  const { introComplete } = useIntro();
  const sectionRef = useRef<HTMLElement>(null);
  const isAnimated = useIntersectionOnce(sectionRef, { threshold: 0.25 });

  const leftCoins = useCryptoStore((s) => s.leftCoins);
  const rightCoins = useCryptoStore((s) => s.rightCoins);
  const { prices, connected } = useLivePrices(introComplete);

  const sectionClasses = [
    "crypto-hub section",
    isAnimated ? "is-animated" : "",
    !connected ? "crypto-hub--reconnecting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style: CryptoHubStyle = {
    "--crypto-row-count-left": leftCoins.length,
    "--crypto-row-count-right": rightCoins.length,
  };

  return (
    <section
      id="crypto"
      className={sectionClasses}
      data-component="crypto-hub"
      aria-label="Live cryptocurrency markets"
      ref={sectionRef}
      style={style}
    >
      <CryptoLines />

      <div className="crypto-hub__layout container">
        <div
          className="crypto-hub__col crypto-hub__col--left"
          data-count={leftCoins.length}
        >
          <ul className="crypto-list crypto-list--left" id="crypto-list-left" role="list">
            {leftCoins.map((id) => (
              <CoinRow
                key={id}
                coin={getCoin(id)}
                side="left"
                price={prices[id]?.price}
                direction={prices[id]?.direction}
              />
            ))}
          </ul>
        </div>

        <div className="crypto-hub__center">
          <div className="crypto-hub__rings-wrap">
            <CryptoRings />
            <div className="crypto-hub__center-ui">
              <h2 className="crypto-hub__heading text-display">Online Banking</h2>
              <AddCryptoMenu />
            </div>
          </div>
        </div>

        <div
          className="crypto-hub__col crypto-hub__col--right"
          data-count={rightCoins.length}
        >
          <ul className="crypto-list crypto-list--right" id="crypto-list-right" role="list">
            {rightCoins.map((id) => (
              <CoinRow
                key={id}
                coin={getCoin(id)}
                side="right"
                price={prices[id]?.price}
                direction={prices[id]?.direction}
              />
            ))}
          </ul>
        </div>

        <div id="crypto-grid" className="crypto-grid crypto-hub__live-grid" aria-live="polite"></div>
      </div>
    </section>
  );
}
