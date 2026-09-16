/**
 * Phase 03 authorization boundary.
 * Every filesystem operation requires a valid session.
 * Phase 04 will replace this with gateway sessions / HTTPS.
 */

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.code = "UNAUTHORIZED";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.code = "FORBIDDEN";
  }
}

export class SessionStore {
  constructor() {
    /** @type {Map<string, { id: string, createdAt: number }>} */
    this.sessions = new Map();
  }

  create(token) {
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new UnauthorizedError("Token required");
    }
    const id = token.trim();
    this.sessions.set(id, { id, createdAt: Date.now() });
    return { id };
  }

  require(token) {
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new UnauthorizedError("Token required");
    }
    const session = this.sessions.get(token.trim());
    if (!session) {
      throw new UnauthorizedError("Invalid or expired session");
    }
    return session;
  }

  revoke(token) {
    this.sessions.delete(token);
  }
}
