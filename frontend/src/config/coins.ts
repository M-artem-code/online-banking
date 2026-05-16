export type CoinColumn = 'left' | 'right'

export interface CoinConfig {
  id: string
  symbol: string
  name: string
  stream: string
  color: string
  column: CoinColumn
  decimals: number
}

export const COINS: CoinConfig[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    stream: 'btcusdt',
    color: '#f7931a',
    column: 'left',
    decimals: 2,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    stream: 'ethusdt',
    color: '#627eea',
    column: 'left',
    decimals: 2,
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    stream: 'solusdt',
    color: '#9945ff',
    column: 'left',
    decimals: 2,
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    stream: 'xrpusdt',
    color: '#23292f',
    column: 'left',
    decimals: 3,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    stream: 'usdcusdt',
    color: '#2775ca',
    column: 'left',
    decimals: 4,
  },
  {
    id: 'bnb',
    symbol: 'BNB',
    name: 'Binance Coin',
    stream: 'bnbusdt',
    color: '#f3ba2f',
    column: 'right',
    decimals: 2,
  },
  {
    id: 'night',
    symbol: 'NIGHT',
    name: 'Midnight',
    stream: 'nightusdt',
    color: '#1a1a2e',
    column: 'right',
    decimals: 5,
  },
  {
    id: 'doge',
    symbol: 'DOGE',
    name: 'Dogecoin',
    stream: 'dogeusdt',
    color: '#c2a633',
    column: 'right',
    decimals: 4,
  },
  {
    id: 'sui',
    symbol: 'SUI',
    name: 'Sui',
    stream: 'suiusdt',
    color: '#6fbcf0',
    column: 'right',
    decimals: 3,
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    stream: 'usdcusdt',
    color: '#26a17b',
    column: 'right',
    decimals: 3,
  },
]

export const COIN_BY_SYMBOL = new Map(COINS.map((coin) => [coin.symbol, coin]))
