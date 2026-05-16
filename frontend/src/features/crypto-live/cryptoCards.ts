import { COIN_BY_SYMBOL, COINS } from '../../config/coins.ts'
import { formatPrice } from '../../utils/formatPrice.ts'
import type { TickerUpdate } from '../../services/cryptoSocket.ts'

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
  const priceEl = priceElements.get(symbol)
  if (!coin || !priceEl) return

  const prevPrice = parseFloat(priceEl.dataset.value ?? '0')
  const isUp = price >= prevPrice

  priceEl.textContent = formatPrice(price, coin.decimals)
  priceEl.dataset.value = String(price)
  priceEl.classList.remove('crypto-row__price--flash-up', 'crypto-row__price--flash-down')
  void priceEl.offsetWidth
  priceEl.classList.add(isUp ? 'crypto-row__price--flash-up' : 'crypto-row__price--flash-down')
}

export function setConnectionStatus(connected: boolean): void {
  document.querySelector('.crypto-hub')?.classList.toggle('crypto-hub--reconnecting', !connected)
}
