export class AuditLog {
  constructor({ now = () => Date.now() } = {}) {
    this.now = now;
    this.entries = [];
  }

  record(event) {
    const entry = {
      at: this.now(),
      type: event.type,
      sessionId: event.sessionId ? hashHint(event.sessionId) : null,
      ip: event.ip || null,
      workspaceId: event.workspaceId || null,
      runtimeId: event.runtimeId || null,
      path: event.path || null,
      result: event.result || "ok",
      reason: event.reason || null,
    };
    this.entries.push(entry);
    return entry;
  }

  list() {
    return this.entries.slice();
  }
}

function hashHint(token) {
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(16).padStart(8, "0")}`;
}
