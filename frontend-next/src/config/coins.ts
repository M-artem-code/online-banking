export type CoinColumn = "left" | "right";

export interface CoinConfig {
  id: string;
  symbol: string;
  name: string;
  stream: string;
  column: CoinColumn;
  decimals: number;
}

export const COINS: CoinConfig[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", stream: "btcusdt", column: "left", decimals: 2 },
  { id: "eth", symbol: "ETH", name: "Ethereum", stream: "ethusdt", column: "left", decimals: 2 },
  { id: "ada", symbol: "ADA", name: "Cardano", stream: "adausdt", column: "left", decimals: 4 },
  { id: "xrp", symbol: "XRP", name: "XRP", stream: "xrpusdt", column: "left", decimals: 4 },
  { id: "usdc", symbol: "USDC", name: "USD Coin", stream: "usdcusdt", column: "left", decimals: 4 },
  { id: "bnb", symbol: "BNB", name: "Binance Coin", stream: "bnbusdt", column: "right", decimals: 2 },
  { id: "night", symbol: "NIGHT", name: "Midnight", stream: "nightusdt", column: "right", decimals: 4 },
  { id: "doge", symbol: "DOGE", name: "Dogecoin", stream: "dogeusdt", column: "right", decimals: 4 },
  { id: "sui", symbol: "SUI", name: "Sui", stream: "suiusdt", column: "right", decimals: 4 },
  { id: "usdt", symbol: "USDT", name: "Tether", stream: "usdcusdt", column: "right", decimals: 4 },
  { id: "sol", symbol: "SOL", name: "Solana", stream: "solusdt", column: "right", decimals: 2 },
];

export const COIN_BY_SYMBOL: Record<string, CoinConfig> = {};
for (const coin of COINS) {
  COIN_BY_SYMBOL[coin.symbol] = coin;
}

export function coinIconUrl(id: string): string {
  return `/icons/crypto/${id}.svg`;
}
