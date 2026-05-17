import { COINS } from "../../config/coins.ts";

export const ADDABLE_COIN_IDS = ["usdc", "bnb", "usdt", "sol"] as const;
export const ACTIVE_ADD_COIN_ID = "sol";

export function buildAddMenu(list: Element): void {
  const addableCoins = ADDABLE_COIN_IDS.map((coinId) =>
    COINS.find((coin) => coin.id === coinId),
  ).filter((coin) => coin !== undefined);

  list.innerHTML = addableCoins
    .map(
      (coin) => {
        const isActive = coin.id === ACTIVE_ADD_COIN_ID;
        const inactiveClass = isActive ? "" : " crypto-hub__add-option--inactive";

        return `
        <li class="crypto-hub__add-item" role="presentation">
          <button
            type="button"
            class="crypto-hub__add-option crypto-hub__add-option--selected${inactiveClass}"
            role="option"
            data-add-coin="${coin.id}"
            aria-selected="false"
          >
            <span class="crypto-hub__add-option-icon crypto-hub__add-option-icon--${coin.id}" aria-hidden="true"></span>
            <span class="crypto-hub__add-option-label">${coin.name}</span>
          </button>
        </li>
      `;
      },
    )
    .join("");
}

export function markAddMenuOptionAdded(coinId: string): void {
  const option = document.querySelector<HTMLButtonElement>(
    `.crypto-hub__add-option[data-add-coin="${coinId}"]`,
  );
  if (!option) return;

  const item = option.closest<HTMLElement>(".crypto-hub__add-item");
  if (!item) return;

  option.classList.add("crypto-hub__add-option--added");
  item.classList.add("crypto-hub__add-item--added");

  let removed = false;
  const removeItem = (): void => {
    if (removed) return;

    removed = true;
    item.removeEventListener("transitionend", onTransitionEnd);
    item.remove();
  };

  const onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === item && event.propertyName === "opacity") removeItem();
  };

  item.addEventListener("transitionend", onTransitionEnd);
  window.setTimeout(removeItem, 720);
}
