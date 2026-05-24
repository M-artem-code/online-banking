import type { Coin, CoinId } from "./types";

/** Single source of truth for every cryptocurrency the UI knows about. */
export const ALL_COINS: Record<CoinId, Coin> = {
  btc:   { id: "btc",   symbol: "BTC",   name: "Bitcoin",      stream: "btcusdt",  decimals: 2 },
  eth:   { id: "eth",   symbol: "ETH",   name: "Ethereum",     stream: "ethusdt",  decimals: 2 },
  ada:   { id: "ada",   symbol: "ADA",   name: "Cardano",      stream: "adausdt",  decimals: 4 },
  xrp:   { id: "xrp",   symbol: "XRP",   name: "XRP",          stream: "xrpusdt",  decimals: 4 },
  usdc:  { id: "usdc",  symbol: "USDC",  name: "USD Coin",     stream: "usdcusdt", decimals: 4 },
  bnb:   { id: "bnb",   symbol: "BNB",   name: "Binance Coin", stream: "bnbusdt",  decimals: 2 },
  night: { id: "night", symbol: "NIGHT", name: "Midnight",     stream: null,       decimals: 4 },
  doge:  { id: "doge",  symbol: "DOGE",  name: "Dogecoin",     stream: "dogeusdt", decimals: 4 },
  sui:   { id: "sui",   symbol: "SUI",   name: "Sui",          stream: "suiusdt",  decimals: 4 },
  usdt:  { id: "usdt",  symbol: "USDT",  name: "Tether",       stream: null,       decimals: 4, pegMirrorOf: "usdc" },
  sol:   { id: "sol",   symbol: "SOL",   name: "Solana",       stream: "solusdt",  decimals: 2 },
  matic: { id: "matic", symbol: "MATIC", name: "Polygon",      stream: "maticusdt", decimals: 4 },
  avax:  { id: "avax",  symbol: "AVAX",  name: "Avalanche",    stream: "avaxusdt", decimals: 2 },
  dot:   { id: "dot",   symbol: "DOT",   name: "Polkadot",     stream: "dotusdt",  decimals: 4 },
  link:  { id: "link",  symbol: "LINK",  name: "Chainlink",    stream: "linkusdt", decimals: 4 },
  trx:   { id: "trx",   symbol: "TRX",   name: "TRON",         stream: "trxusdt",  decimals: 4 },
};

export const COIN_LIST: Coin[] = Object.values(ALL_COINS);

export const COIN_IDS: CoinId[] = Object.keys(ALL_COINS) as CoinId[];

/** Reverse-lookup by Binance ticker symbol (e.g. "BTC" → btc coin). */
export const COIN_BY_SYMBOL: Record<string, Coin> = COIN_LIST.reduce(
  (acc, coin) => {
    acc[coin.symbol] = coin;
    return acc;
  },
  {} as Record<string, Coin>
);

export function getCoin(id: CoinId): Coin {
  return ALL_COINS[id];
}

export function coinIconUrl(id: CoinId): string {
  return `/icons/crypto/${id}.svg`;
}
