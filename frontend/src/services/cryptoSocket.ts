import { COINS } from '../config/coins.ts'

export interface TickerUpdate {
  symbol: string
  price: number
  changePercent: number
}

type TickHandler = (update: TickerUpdate) => void
type StatusHandler = (connected: boolean) => void

const STREAMS = COINS.map((c) => `${c.stream}@ticker`).join('/')
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`

export class CryptoSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 8
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private onTick: TickHandler
  private onStatus: StatusHandler

  constructor(onTick: TickHandler, onStatus: StatusHandler) {
    this.onTick = onTick
    this.onStatus = onStatus
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(WS_URL)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.onStatus(true)
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as {
          stream?: string
          data?: {
            s?: string
            c?: string
            P?: string
          }
        }
        const data = message.data
        if (!data?.s || !data.c || data.P === undefined) return

        const symbol = data.s.replace('USDT', '')
        this.onTick({
          symbol,
          price: parseFloat(data.c),
          changePercent: parseFloat(data.P),
        })
      } catch {
        /* ignore malformed messages */
      }
    }

    this.ws.onclose = () => {
      this.onStatus(false)
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.reconnectAttempts = this.maxReconnectAttempts
    this.ws?.close()
    this.ws = null
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
    this.reconnectAttempts += 1

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }
}
