export type CoinId =
  | "btc" | "eth" | "ada" | "xrp" | "usdc"
  | "bnb" | "night" | "doge" | "sui" | "usdt" | "sol"
  | "matic" | "avax" | "dot" | "link" | "trx";

export interface Coin {
  id: CoinId;
  symbol: string;
  name: string;
  /** Binance combined-stream key. `null` = no live price feed (e.g. Midnight). */
  stream: string | null;
  /** Decimal places for USD price formatting. */
  decimals: number;
  /** Coins peg-mirrored from another stream (USDT mirrors USDC). */
  pegMirrorOf?: CoinId;
}
