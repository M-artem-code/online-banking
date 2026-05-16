import { COINS, type CoinConfig } from '../../config/coins.ts'
import { formatChange, formatPrice } from '../../utils/formatPrice.ts'
import type { TickerUpdate } from '../../services/cryptoSocket.ts'

const cardElements = new Map<string, { price: HTMLElement; change: HTMLElement; status: HTMLElement }>()

export function renderCryptoGrid(container: HTMLElement): void {
  container.innerHTML = COINS.map((coin) => createCardHtml(coin)).join('')

  COINS.forEach((coin) => {
    const card = container.querySelector(`[data-coin="${coin.id}"]`)
    if (!card) return

    const price = card.querySelector('.crypto-card__price') as HTMLElement
    const change = card.querySelector('.crypto-card__change') as HTMLElement
    const status = card.querySelector('.crypto-card__status') as HTMLElement
    cardElements.set(coin.symbol, { price, change, status })
  })
}

function createCardHtml(coin: CoinConfig): string {
  return `
    <article class="crypto-card" data-coin="${coin.id}">
      <div class="crypto-card__header">
        <span class="crypto-card__icon" style="background:${coin.color}22;color:${coin.color}">${coin.symbol.slice(0, 3)}</span>
        <div>
          <div class="crypto-card__symbol">${coin.symbol}</div>
          <div class="crypto-card__pair">${coin.name} / USDT</div>
        </div>
      </div>
      <p class="crypto-card__price" data-price>—</p>
      <p class="crypto-card__change" data-change>—</p>
      <p class="crypto-card__status" data-status>Connecting…</p>
    </article>
  `
}

export function updateCryptoCard(update: TickerUpdate, connected: boolean): void {
  const els = cardElements.get(update.symbol)
  if (!els) return

  const prevPrice = parseFloat(els.price.dataset.value ?? '0')
  const isUp = update.price >= prevPrice

  els.price.textContent = formatPrice(update.price)
  els.price.dataset.value = String(update.price)
  els.price.classList.remove('crypto-card__price--flash-up', 'crypto-card__price--flash-down')
  void els.price.offsetWidth
  els.price.classList.add(isUp ? 'crypto-card__price--flash-up' : 'crypto-card__price--flash-down')

  const changeClass =
    update.changePercent >= 0 ? 'crypto-card__change--up' : 'crypto-card__change--down'
  els.change.textContent = formatChange(update.changePercent)
  els.change.className = `crypto-card__change ${changeClass}`

  els.status.textContent = connected ? 'Live' : 'Reconnecting…'
  els.status.className = `crypto-card__status ${connected ? 'crypto-card__status--connected' : ''}`
}

export function setConnectionStatus(connected: boolean): void {
  cardElements.forEach((els) => {
    els.status.textContent = connected ? 'Live' : 'Reconnecting…'
    els.status.className = `crypto-card__status ${connected ? 'crypto-card__status--connected' : ''}`
  })
}
