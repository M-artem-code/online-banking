import { readCssTimeMs } from "../../core/timing.ts";

const MENU_TRANSITION_MS = 280;
const MENU_ITEM_MS = 460;
const MENU_STAGGER_MS = 72;
const MENU_SCROLL_MS = 1800;

export function readMenuTiming(): {
  itemMs: number;
  staggerMs: number;
  panelMs: number;
  panelCloseMs: number;
  panelGrowMs: number;
  scrollMs: number;
} {
  return {
    itemMs: readCssTimeMs("--crypto-hub-add-menu-item-duration", MENU_ITEM_MS),
    staggerMs: readCssTimeMs("--crypto-hub-add-menu-stagger", MENU_STAGGER_MS),
    panelMs: readCssTimeMs("--crypto-hub-add-menu-duration", MENU_TRANSITION_MS),
    panelCloseMs: readCssTimeMs(
      "--crypto-hub-add-menu-close-duration",
      640,
    ),
    panelGrowMs: readCssTimeMs("--crypto-hub-add-menu-panel-duration", 3000),
    scrollMs: readCssTimeMs(
      "--crypto-hub-add-menu-scroll-duration",
      MENU_SCROLL_MS,
    ),
  };
}

export function getMenuRevealDuration(itemCount: number): number {
  const { itemMs, staggerMs, panelGrowMs, scrollMs } = readMenuTiming();
  if (itemCount <= 0) return 0;

  const visibleSlots = readVisibleSlots();
  const revealMs = itemMs + (itemCount - 1) * staggerMs;
  const scrollSteps = Math.max(0, itemCount - visibleSlots);
  const scrollEnd = scrollSteps > 0 ? scrollMs : 0;

  return Math.max(revealMs, scrollEnd, panelGrowMs);
}

function readVisibleSlots(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--crypto-hub-add-visible-options")
    .trim();
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4;
}

let scrollRaf: number | null = null;

/** Плавный разгон и торможение — без рывка в начале/конце */
function easeInOutSmooth(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function stopListScroll(): void {
  if (scrollRaf !== null) {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = null;
  }
}

function animateListScroll(
  list: HTMLElement,
  targetTop: number,
  durationMs: number,
): void {
  stopListScroll();

  const maxTop = Math.max(0, list.scrollHeight - list.clientHeight);
  const nextTop = Math.min(maxTop, Math.max(0, targetTop));
  const startTop = list.scrollTop;
  const delta = nextTop - startTop;

  if (Math.abs(delta) < 1) return;

  const start = performance.now();

  const step = (now: number): void => {
    const progress = Math.min(1, (now - start) / durationMs);
    list.scrollTop = startTop + delta * easeInOutSmooth(progress);

    if (progress < 1) {
      scrollRaf = requestAnimationFrame(step);
      return;
    }

    scrollRaf = null;
  };

  scrollRaf = requestAnimationFrame(step);
}

function startContinuousListScroll(list: HTMLElement): void {
  const { scrollMs } = readMenuTiming();
  animateListScroll(list, 0, scrollMs);
}

const revealTimers: ReturnType<typeof window.setTimeout>[] = [];

function clearRevealTimers(): void {
  revealTimers.forEach((id) => window.clearTimeout(id));
  revealTimers.length = 0;
  stopListScroll();
}

function resetMenuItemReveal(list: Element): void {
  clearRevealTimers();
  const listEl = list as HTMLElement;
  listEl.scrollTop = 0;

  list
    .querySelectorAll<HTMLElement>(".crypto-hub__add-item")
    .forEach((item) => {
      item.classList.remove("crypto-hub__add-item--revealed");
    });
}

function scheduleMenuReveal(menu: HTMLElement, list: Element): void {
  const listEl = list as HTMLElement;
  const items = [
    ...list.querySelectorAll<HTMLElement>(".crypto-hub__add-item"),
  ];
  const { staggerMs } = readMenuTiming();
  const visibleSlots = readVisibleSlots();
  const scrollSteps = Math.max(0, items.length - visibleSlots);

  items.forEach((item, index) => {
    const fromBottom = items.length - 1 - index;
    const delay = fromBottom * staggerMs;

    revealTimers.push(
      window.setTimeout(() => {
        if (!menu.classList.contains("crypto-hub__add-menu--visible")) return;
        item.classList.add("crypto-hub__add-item--revealed");
      }, delay),
    );
  });

  if (scrollSteps > 0) {
    requestAnimationFrame(() => {
      if (!menu.classList.contains("crypto-hub__add-menu--visible")) return;
      startContinuousListScroll(listEl);
    });
  }

  revealTimers.push(
    window.setTimeout(
      () => {
        menu.classList.remove("crypto-hub__add-menu--revealing");
      },
      getMenuRevealDuration(items.length) + 48,
    ),
  );
}

export function openAddMenu(menu: HTMLElement, list: Element): void {
  const listEl = list as HTMLElement;

  resetMenuItemReveal(list);
  menu.classList.remove(
    "crypto-hub__add-menu--visible",
    "crypto-hub__add-menu--revealing",
    "crypto-hub__add-menu--closing",
  );

  requestAnimationFrame(() => {
    listEl.scrollTop = listEl.scrollHeight;

    requestAnimationFrame(() => {
      menu.classList.add(
        "crypto-hub__add-menu--visible",
        "crypto-hub__add-menu--revealing",
      );
      scheduleMenuReveal(menu, list);
    });
  });
}

export function closeAddMenu(menu: HTMLElement, list: Element): number {
  clearRevealTimers();

  const { panelCloseMs } = readMenuTiming();

  menu.classList.remove("crypto-hub__add-menu--revealing");
  menu.classList.add("crypto-hub__add-menu--closing");

  revealTimers.push(
    window.setTimeout(() => {
      menu.classList.remove(
        "crypto-hub__add-menu--visible",
        "crypto-hub__add-menu--closing",
      );
      list
        .querySelectorAll<HTMLElement>(".crypto-hub__add-item")
        .forEach((item) => {
          item.classList.remove("crypto-hub__add-item--revealed");
        });
    }, panelCloseMs + 48),
  );

  return panelCloseMs;
}
