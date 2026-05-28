import { COIN_LIST } from "@/entities/coin";

export interface TickerUpdate {
  symbol: string;
  price: number;
  changePercent: number;
}

export type TickHandler = (update: TickerUpdate) => void;
export type StatusHandler = (connected: boolean) => void;

function parseTicker(data: { s?: string; c?: string; P?: string }): TickerUpdate | null {
  const sym = data.s;
  const priceRaw = data.c;
  if (!sym || !priceRaw) return null;
  const symbol = sym.replace("USDT", "");
  const price = parseFloat(priceRaw);
  const changePercent = data.P ? parseFloat(data.P) : 0;
  if (isNaN(price)) return null;
  return { symbol, price, changePercent };
}

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30_000;
const MAX_RECONNECT_ATTEMPTS = 8;

export class BinanceSocket {
  private ws: WebSocket | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private attempts = 0;
  private disposed = false;

  constructor(private onTick: TickHandler, private onStatus: StatusHandler) {}

  connect(): void {
    if (this.disposed) return;
    const streams = COIN_LIST
      .filter((c) => c.stream && !c.pegMirrorOf)
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
        const ticker = parseTicker(msg.data || msg);
        if (ticker) this.onTick(ticker);
      } catch {
        /* ignore */
      }
    };
    this.ws.onclose = () => {
      this.onStatus(false);
      this.scheduleReconnect();
    };
    this.ws.onerror = () => this.ws?.close();
  }

  disconnect(): void {
    this.disposed = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.disposed || this.attempts >= MAX_RECONNECT_ATTEMPTS) return;
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** this.attempts, RECONNECT_MAX_MS);
    this.attempts++;
    this.timer = setTimeout(() => this.connect(), delay);
  }
}
