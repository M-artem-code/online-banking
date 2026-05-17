import { readCssTimeMs } from "../../core/timing.ts";

const REVEAL_MS = 320;

function getRow(coinId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `.crypto-row[data-coin="${coinId}"]`,
  );
}

function isRowVisible(row: HTMLElement): boolean {
  return !row.classList.contains("crypto-row--hidden");
}

function clearRowInlineSize(row: HTMLElement): void {
  row.style.height = "";
  row.style.maxHeight = "";
  row.style.minHeight = "";
}

function getRowTransitionMs(row: HTMLElement): number {
  return readCssTimeMs("--crypto-hub-row-transition-duration", 380, row);
}

function collapseRow(row: HTMLElement): void {
  row.classList.remove("crypto-row--revealing", "crypto-row--instant");
  row.classList.add("crypto-row--leaving");

  let done = false;
  const finish = (): void => {
    if (done) return;
    done = true;
    row.removeEventListener("transitionend", onTransitionEnd);
    window.clearTimeout(fallback);
    row.classList.add("crypto-row--hidden");
    row.classList.remove("crypto-row--leaving");
    clearRowInlineSize(row);
    row.setAttribute("aria-hidden", "true");
  };

  const onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== row) return;
    if (
      event.propertyName === "height" ||
      event.propertyName === "max-height"
    ) {
      finish();
    }
  };

  row.addEventListener("transitionend", onTransitionEnd);
  const fallback = window.setTimeout(finish, getRowTransitionMs(row) + 50);
}

function expandRow(row: HTMLElement): void {
  clearRowInlineSize(row);
  row.classList.add("crypto-row--instant");
  row.classList.remove("crypto-row--hidden", "crypto-row--leaving");
  row.removeAttribute("aria-hidden");

  requestAnimationFrame(() => {
    row.classList.remove("crypto-row--instant");
    row.classList.add("crypto-row--revealing");

    window.setTimeout(() => {
      row.classList.remove("crypto-row--revealing");
    }, REVEAL_MS);
  });
}

function setRowVisible(row: HTMLElement, visible: boolean): void {
  if (visible) {
    if (!isRowVisible(row)) expandRow(row);
    return;
  }

  if (isRowVisible(row)) collapseRow(row);
}

export function resetCoinRows(hiddenCoinIds: readonly string[] = []): void {
  const hiddenCoins = new Set(hiddenCoinIds);

  document
    .querySelectorAll<HTMLElement>(".crypto-row[data-coin]")
    .forEach((row) => {
      row.classList.remove(
        "crypto-row--hidden",
        "crypto-row--leaving",
        "crypto-row--revealing",
        "crypto-row--instant",
      );
      clearRowInlineSize(row);
      const coinId = row.dataset.coin;
      const hidden = coinId !== undefined && hiddenCoins.has(coinId);

      row.classList.toggle("crypto-row--hidden", hidden);
      if (hidden) {
        row.setAttribute("aria-hidden", "true");
        return;
      }

      row.removeAttribute("aria-hidden");
    });
}

export function addCoinRow(coinId: string): boolean {
  const row = getRow(coinId);
  if (!row) return false;
  if (isRowVisible(row)) return false;

  setRowVisible(row, true);
  return true;
}

export function toggleCoinRow(coinId: string): boolean | null {
  const row = getRow(coinId);
  if (!row) return null;

  const nextVisible = !isRowVisible(row);
  setRowVisible(row, nextVisible);
  return nextVisible;
}
