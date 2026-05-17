import { CryptoSocket } from "../../services/cryptoSocket.ts";
import {
  initCryptoRows,
  setConnectionStatus,
  updateCryptoRow,
} from "./cryptoCards.ts";

export function initCryptoLive(): void {
  initCryptoRows();

  const socket = new CryptoSocket(
    (update) => updateCryptoRow(update, true),
    (connected) => setConnectionStatus(connected),
  );

  socket.connect();
  window.addEventListener("beforeunload", () => socket.disconnect());
}
