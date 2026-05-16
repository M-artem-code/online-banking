export interface CoinConfig {
  id: string
  symbol: string
  name: string
  stream: string
  color: string
}

export const COINS: CoinConfig[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', stream: 'btcusdt', color: '#f7931a' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', stream: 'ethusdt', color: '#627eea' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', stream: 'solusdt', color: '#9945ff' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', stream: 'bnbusdt', color: '#f3ba2f' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', stream: 'xrpusdt', color: '#23292f' },
]
