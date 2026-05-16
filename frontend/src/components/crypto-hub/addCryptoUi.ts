/** Minimal UI for "Add a Cryptocurrency" — no backend, visual state only. */

const ADD_OPTIONS = [
  { id: 'usdc', name: 'USD Coin' },
  { id: 'bnb', name: 'Binance Coin' },
  { id: 'usdt', name: 'Tether' },
  { id: 'sol', name: 'Solana' },
] as const

const MENU_TRANSITION_MS = 520

export function initAddCryptoUi(): void {
  const root = document.getElementById('crypto-add')
  const btn = document.getElementById('btn-add-crypto')
  const menu = document.getElementById('crypto-add-menu')
  if (!root || !btn || !menu) return

  const list = menu.querySelector('.crypto-hub__add-list')
  if (!list) return

  if (list.children.length === 0) {
    list.innerHTML = ADD_OPTIONS.map(
      (coin) => `
        <li class="crypto-hub__add-item" role="presentation">
          <button
            type="button"
            class="crypto-hub__add-option"
            role="option"
            data-add-coin="${coin.id}"
          >
            <span class="crypto-hub__add-option-icon crypto-hub__add-option-icon--${coin.id}" aria-hidden="true"></span>
            <span class="crypto-hub__add-option-label">${coin.name}</span>
          </button>
        </li>
      `,
    ).join('')
  }

  let closeTimer: ReturnType<typeof window.setTimeout> | null = null

  const setOpen = (open: boolean): void => {
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      closeTimer = null
    }

    root.classList.toggle('crypto-hub__add--open', open)
    btn.classList.toggle('crypto-hub__add-btn--open', open)
    btn.setAttribute('aria-expanded', String(open))
    menu.setAttribute('aria-hidden', String(!open))

    if (open) {
      menu.classList.add('crypto-hub__add-menu--visible')
      return
    }

    menu.classList.remove('crypto-hub__add-menu--visible')
    closeTimer = window.setTimeout(() => {
      closeTimer = null
    }, MENU_TRANSITION_MS)
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    setOpen(!root.classList.contains('crypto-hub__add--open'))
  })

  list.addEventListener('click', (e) => {
    const option = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-add-coin]')
    if (!option) return

    const coinId = option.dataset.addCoin
    if (!coinId) return

    document
      .querySelectorAll('.crypto-row[data-coin]')
      .forEach((row) => row.classList.remove('crypto-row--added'))

    document
      .querySelector(`.crypto-row[data-coin="${coinId}"]`)
      ?.classList.add('crypto-row--added')

    list.querySelectorAll('.crypto-hub__add-option').forEach((el) => {
      el.classList.toggle('crypto-hub__add-option--selected', el === option)
      el.setAttribute('aria-selected', String(el === option))
    })

    setOpen(false)
  })

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target as Node)) setOpen(false)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}
