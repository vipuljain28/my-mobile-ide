export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = "UNAUTHORIZED";
  }
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

export class SessionManager {
  constructor({ ttlMs }) {
    this.ttlMs = ttlMs;
    this.sessions = new Map();
  }

  login(credential) {
    if (typeof credential !== "string" || credential.trim().length < 8) {
      throw new UnauthorizedError("Invalid credentials");
    }
    const id = randomToken();
    const now = Date.now();
    const rec = { id, createdAt: now, expiresAt: now + this.ttlMs };
    this.sessions.set(id, rec);
    return { sessionId: id, expiresAt: rec.expiresAt };
  }

  require(sessionId) {
    if (typeof sessionId !== "string" || !sessionId) {
      throw new UnauthorizedError("Session required");
    }
    const rec = this.sessions.get(sessionId);
    if (!rec) throw new UnauthorizedError("Invalid session");
    if (Date.now() >= rec.expiresAt) {
      this.sessions.delete(sessionId);
      throw new UnauthorizedError("Session expired");
    }
    return rec;
  }

  logout(sessionId) {
    this.sessions.delete(sessionId);
  }
}
