export function readCssTimeMs(
  token: string,
  fallbackMs: number,
  root: Element = document.documentElement,
): number {
  const raw = getComputedStyle(root).getPropertyValue(token).trim();
  if (!raw) return fallbackMs;

  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallbackMs;
  if (raw.endsWith("ms")) return value;
  if (raw.endsWith("s")) return value * 1000;
  return value || fallbackMs;
}
