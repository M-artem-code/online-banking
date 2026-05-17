import type { TickerUpdate } from "../types/crypto.ts";

interface BinanceTickerMessage {
  stream?: string;
  data?: {
    s?: string;
    c?: string;
    P?: string;
  };
}

export function parseBinanceTickerMessage(raw: string): TickerUpdate | null {
  try {
    const message = JSON.parse(raw) as BinanceTickerMessage;
    const data = message.data;
    if (!data?.s || !data.c || data.P === undefined) return null;

    return {
      symbol: data.s.replace("USDT", ""),
      price: parseFloat(data.c),
      changePercent: parseFloat(data.P),
    };
  } catch {
    return null;
  }
}
