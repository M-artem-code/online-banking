import {
  closeAddMenu,
  getMenuRevealDuration,
  openAddMenu,
  readMenuTiming,
} from "./addMenuAnimation.ts";
import {
  ACTIVE_ADD_COIN_ID,
  buildAddMenu,
  markAddMenuOptionAdded,
} from "./addMenuOptions.ts";
import { resetCoinRows } from "./coinRows.ts";
import { readCssTimeMs } from "../../core/timing.ts";

const SOLANA_ID = "sol";

function createSolanaRow(): HTMLElement {
  const row = document.createElement("li");
  row.className = "crypto-row crypto-row--right";
  row.dataset.coin = SOLANA_ID;
  row.innerHTML = `
    <span class="crypto-row__icon" aria-hidden="true"></span>
    <span class="crypto-row__name">Solana</span>
    <span class="crypto-row__price text-price" data-price>—</span>
  `;
  return row;
}

function initSmoothOptionHover(list: Element): () => void {
  const listEl = list as HTMLElement;
  let activeOption: HTMLElement | null = null;

  const setHoverOption = (option: HTMLElement): void => {
    const item = option.closest<HTMLElement>(".crypto-hub__add-item");
    if (!item) return;

    activeOption = option;
    listEl.style.setProperty("--crypto-hub-add-hover-y", `${item.offsetTop}px`);
    listEl.style.setProperty("--crypto-hub-add-hover-opacity", "1");
  };

  const clearHoverOption = (): void => {
    activeOption = null;
    listEl.style.setProperty("--crypto-hub-add-hover-opacity", "0");
  };

  listEl.addEventListener("pointermove", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLElement>(
      ".crypto-hub__add-option",
    );
    if (!option || !listEl.contains(option)) return;
    if (option !== activeOption) setHoverOption(option);
  });

  listEl.addEventListener("pointerleave", clearHoverOption);

  listEl.addEventListener("focusin", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLElement>(
      ".crypto-hub__add-option",
    );
    if (option) setHoverOption(option);
  });

  listEl.addEventListener("focusout", (e) => {
    const nextFocus = e.relatedTarget;
    if (!(nextFocus instanceof Node) || !listEl.contains(nextFocus)) {
      clearHoverOption();
    }
  });

  listEl.addEventListener("scroll", () => {
    if (activeOption) setHoverOption(activeOption);
  });

  return clearHoverOption;
}

function moveSolanaToRight(): boolean {
  const existingRow = document.querySelector<HTMLElement>(
    `.crypto-row[data-coin="${SOLANA_ID}"]`,
  );
  const rightList = document.getElementById("crypto-list-right");
  const hub = document.querySelector<HTMLElement>(".crypto-hub");
  if (!rightList || existingRow) return false;

  const animatedRows = [
    ...document.querySelectorAll<HTMLElement>(".crypto-list .crypto-row"),
  ];
  const sourceRow = document.querySelector<HTMLElement>(
    '.crypto-row[data-coin="ada"]',
  );
  const firstRects = new Map(
    animatedRows.map((animatedRow) => [
      animatedRow,
      animatedRow.getBoundingClientRect(),
    ]),
  );

  const row = createSolanaRow();
  rightList.append(row);
  hub?.classList.add("crypto-hub--solana-added");

  animatedRows.forEach((animatedRow) => {
    const firstRect = firstRects.get(animatedRow);
    if (!firstRect) return;

    const lastRect = animatedRow.getBoundingClientRect();
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

    animatedRow.classList.add("crypto-row--moving");
    animatedRow.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
  });

  const sourceRect = sourceRow?.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const startX = sourceRect ? sourceRect.left - rowRect.left : -220;
  const startY = sourceRect ? sourceRect.top - rowRect.top : -10;

  row.classList.add("crypto-row--moving");
  row.style.opacity = "0.12";
  row.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
  row.setAttribute("data-placement", "right");

  // Force the inverse transforms to apply before animating everything home.
  void rightList.offsetWidth;

  requestAnimationFrame(() => {
    animatedRows.forEach((animatedRow) => {
      if (!animatedRow.classList.contains("crypto-row--moving")) return;
      animatedRow.style.transform = "translate3d(0, 0, 0)";
    });
    row.style.opacity = "1";
    row.style.transform = "translate3d(0, 0, 0)";
  });

  window.setTimeout(
    () => {
      [...animatedRows, row].forEach((animatedRow) => {
        animatedRow.classList.remove("crypto-row--moving");
        animatedRow.style.transform = "";
        animatedRow.style.opacity = "";
      });
    },
    readCssTimeMs("--crypto-solana-move-duration", 820, row) + 80,
  );

  return true;
}

export function initAddCryptoUi(): void {
  const root = document.getElementById("crypto-add");
  const btn = document.getElementById("btn-add-crypto");
  const menu = document.getElementById("crypto-add-menu");
  if (!root || !btn || !menu) return;

  const list = menu.querySelector(".crypto-hub__add-list");
  if (!list) return;

  buildAddMenu(list);

  resetCoinRows();

  let closeTimer: ReturnType<typeof window.setTimeout> | null = null;
  const clearHoverOption = initSmoothOptionHover(list);
  const itemCount = list.querySelectorAll(".crypto-hub__add-item").length;

  const setOpen = (open: boolean): void => {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    root.classList.toggle("crypto-hub__add--open", open);
    btn.classList.toggle("crypto-hub__add-btn--open", open);
    btn.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));

    if (open) {
      clearHoverOption();
      openAddMenu(menu, list);
      return;
    }

    clearHoverOption();
    closeAddMenu(menu, list);
    const { panelMs } = readMenuTiming();
    closeTimer = window.setTimeout(
      () => {
        closeTimer = null;
      },
      Math.max(panelMs, getMenuRevealDuration(itemCount)),
    );
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!root.classList.contains("crypto-hub__add--open"));
  });

  list.addEventListener("click", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-add-coin]",
    );
    if (!option) return;

    const coinId = option.dataset.addCoin;
    if (!coinId) return;

    e.stopPropagation();
    if (coinId !== ACTIVE_ADD_COIN_ID) return;
    if (!moveSolanaToRight()) return;

    clearHoverOption();
    markAddMenuOptionAdded(coinId);
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target as Node)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}
