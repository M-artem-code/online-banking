import { parseBinanceTickerMessage } from "../adapters/binanceTicker.ts";
import { COINS } from "../config/coins.ts";
import type { TickerUpdate } from "../types/crypto.ts";

type TickHandler = (update: TickerUpdate) => void;
type StatusHandler = (connected: boolean) => void;

const STREAMS = COINS.map((c) => `${c.stream}@ticker`).join("/");
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`;

export class CryptoSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 8;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private onTick: TickHandler;
  private onStatus: StatusHandler;

  constructor(onTick: TickHandler, onStatus: StatusHandler) {
    this.onTick = onTick;
    this.onStatus = onStatus;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatus(true);
    };

    this.ws.onmessage = (event) => {
      const update = parseBinanceTickerMessage(event.data as string);
      if (!update) return;

      this.onTick(update);
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
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}
