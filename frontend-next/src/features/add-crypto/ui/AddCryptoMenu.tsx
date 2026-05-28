"use client";

import { useCallback, useMemo } from "react";
import { useCryptoStore } from "../model/store";
import { useAddMenu } from "../model/use-add-menu";
import { ALL_COINS, COIN_IDS, type CoinId } from "@/entities/coin";

const ITEM_STAGGER_MS = 60;

export function AddCryptoMenu() {
  const { phase, isOpen, isClosing, toggle, close } = useAddMenu();
  const leftCoins = useCryptoStore((s) => s.leftCoins);
  const rightCoins = useCryptoStore((s) => s.rightCoins);
  const addCoin = useCryptoStore((s) => s.addCoin);

  const addable = useMemo<CoinId[]>(() => {
    const displayed = new Set<CoinId>([...leftCoins, ...rightCoins]);
    return COIN_IDS.filter((id) => !displayed.has(id));
  }, [leftCoins, rightCoins]);

  const handleSelect = useCallback(
    (id: CoinId) => {
      addCoin(id);
      close();
    },
    [addCoin, close]
  );

  const containerClasses = [
    "crypto-hub__add",
    isOpen ? "crypto-hub__add--open" : "",
    isClosing ? "crypto-hub__add--closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const menuClasses = [
    "crypto-hub__add-menu",
    isOpen ? "crypto-hub__add-menu--visible" : "",
    isClosing ? "crypto-hub__add-menu--closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} id="crypto-add">
      <button
        type="button"
        className="crypto-hub__add-btn"
        id="btn-add-crypto"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="crypto-add-menu"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <span className="crypto-hub__add-label">Add a Cryptocurrency</span>
        <span className="crypto-hub__add-chevron" aria-hidden="true"></span>
      </button>
      <div
        id="crypto-add-menu"
        className={menuClasses}
        role="listbox"
        aria-label="Add a cryptocurrency"
        aria-hidden={phase !== "open"}
      >
        <ul className="crypto-hub__add-list" role="presentation">
          {addable.length === 0 && (
            <li className="crypto-hub__add-empty">All cryptocurrencies added</li>
          )}
          {addable.map((id, idx) => {
            const coin = ALL_COINS[id];
            // Reverse stagger on closing: last item disappears first.
            const delay = isClosing
              ? (addable.length - 1 - idx) * ITEM_STAGGER_MS
              : idx * ITEM_STAGGER_MS;
            return (
              <li
                key={id}
                className={[
                  "crypto-hub__add-item",
                  isOpen ? "crypto-hub__add-item--revealed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <button
                  type="button"
                  className="crypto-hub__add-option crypto-hub__add-option--selected"
                  data-add-coin={coin.id}
                  onClick={() => handleSelect(coin.id)}
                  disabled={!isOpen}
                >
                  <span className={`crypto-hub__add-option-icon crypto-hub__add-option-icon--${coin.id}`}></span>
                  <span className="crypto-hub__add-option-label">{coin.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
