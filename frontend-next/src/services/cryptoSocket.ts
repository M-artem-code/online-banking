import type { TickerUpdate } from "@/types/crypto";
import { COINS } from "@/config/coins";

function parseBinanceTicker(data: { s?: string; c?: string; P?: string }): TickerUpdate | null {
  const rawSymbol = data.s;
  const rawPrice = data.c;
  const rawChange = data.P;
  if (!rawSymbol || !rawPrice) return null;
  const symbol = rawSymbol.replace("USDT", "");
  const price = parseFloat(rawPrice);
  const changePercent = rawChange ? parseFloat(rawChange) : 0;
  if (isNaN(price)) return null;
  return { symbol, price, changePercent };
}

export type TickHandler = (update: TickerUpdate) => void;
export type StatusHandler = (connected: boolean) => void;

export class CryptoSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private attempts = 0;
  private maxAttempts = 8;
  private disposed = false;

  constructor(
    private onTick: TickHandler,
    private onStatus: StatusHandler
  ) {}

  connect(): void {
    if (this.disposed) return;
    const streams = COINS.filter((c) => c.id !== "sol" && c.id !== "night")
      .map((c) => `${c.stream}@ticker`)
      .join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.attempts = 0;
      this.onStatus(true);
    };

    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const ticker = parseBinanceTicker(msg.data || msg);
        if (ticker) this.onTick(ticker);
      } catch { /* ignore parse errors */ }
    };

    this.ws.onclose = () => {
      this.onStatus(false);
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    this.disposed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.disposed || this.attempts >= this.maxAttempts) return;
    const delay = Math.min(1000 * Math.pow(2, this.attempts), 30000);
    this.attempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}
