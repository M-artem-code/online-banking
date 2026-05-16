export function query<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector(selector)
}

export function queryAll<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll(selector))
}

export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string
    attrs?: Record<string, string>
    text?: string
  },
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (options?.className) el.className = options.className
  if (options?.text) el.textContent = options.text
  if (options?.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      el.setAttribute(key, value)
    }
  }
  return el
}
