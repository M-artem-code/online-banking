import { COIN_BY_SYMBOL, COINS } from '../../config/coins.ts'
import { formatPrice } from '../../utils/formatPrice.ts'
import type { TickerUpdate } from '../../types/crypto.ts'

const priceElements = new Map<string, HTMLElement>()

export function initCryptoRows(): void {
  priceElements.clear()

  COINS.forEach((coin) => {
    const row = document.querySelector(`.crypto-row[data-coin="${coin.id}"]`)
    const priceEl = row?.querySelector('[data-price]') as HTMLElement | null
    if (!priceEl) return

    priceElements.set(coin.symbol, priceEl)
    priceEl.textContent = '—'
    priceEl.dataset.value = ''
  })
}

export function updateCryptoRow(update: TickerUpdate, _connected: boolean): void {
  setRowPrice(update.symbol, update.price)

  // Binance has no USDT/USDT pair — mirror USDC/USDT for the Tether peg row
  if (update.symbol === 'USDC') {
    setRowPrice('USDT', update.price)
  }
}

function setRowPrice(symbol: string, price: number): void {
  const coin = COIN_BY_SYMBOL.get(symbol)
  let priceEl = priceElements.get(symbol)
  if (!coin) return

  if (!priceEl || !priceEl.isConnected) {
    const row = document.querySelector(`.crypto-row[data-coin="${coin.id}"]`)
    const nextPriceEl = row?.querySelector('[data-price]') as HTMLElement | null
    if (!nextPriceEl) return

    priceEl = nextPriceEl
    priceElements.set(symbol, priceEl)
  }

  const prevRaw = priceEl.dataset.value
  const prevPrice =
    prevRaw === undefined || prevRaw === '' ? null : parseFloat(prevRaw)

  priceEl.textContent = formatPrice(price, coin.decimals)
  priceEl.dataset.value = String(price)

  if (prevPrice === null) return

  if (price > prevPrice) {
    priceEl.classList.remove('crypto-row__price--flash-down')
    void priceEl.offsetWidth
    priceEl.classList.add('crypto-row__price--flash-up')
    return
  }

  if (price < prevPrice) {
    priceEl.classList.remove('crypto-row__price--flash-up')
    void priceEl.offsetWidth
    priceEl.classList.add('crypto-row__price--flash-down')
  }
}

export function setConnectionStatus(connected: boolean): void {
  document.querySelector('.crypto-hub')?.classList.toggle('crypto-hub--reconnecting', !connected)
}
