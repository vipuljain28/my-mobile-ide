export class WsSecurityError extends Error {
  constructor(message) {
    super(message);
    this.name = "WsSecurityError";
    this.code = "WS_DENIED";
  }
}

const DEFAULT_ORIGINS = ["https://127.0.0.1", "https://localhost", "capacitor://localhost"];

export function assertWsHandshake({ origin, sessionId, allowedOrigins = DEFAULT_ORIGINS }) {
  if (!sessionId) throw new WsSecurityError("Session required for WSS");
  if (origin && !allowedOrigins.some((o) => origin === o || origin.startsWith(o))) {
    throw new WsSecurityError("Origin not allowed");
  }
  return true;
}
