const ALLOWED_SERVERS = new Set(["builtin-javascript"]);

export class LspLifecycleError extends Error {
  constructor(message, code = "LSP") {
    super(message);
    this.name = "LspLifecycleError";
    this.code = code;
  }
}

export class LspLifecycle {
  constructor() {
    this.servers = new Map();
    for (const id of ALLOWED_SERVERS) {
      this.servers.set(id, { id, status: "stopped", startedAt: null });
    }
  }

  list() {
    return [...this.servers.values()].map((s) => ({ ...s }));
  }

  start(serverId) {
    if (!ALLOWED_SERVERS.has(serverId)) {
      throw new LspLifecycleError(`Server not allowlisted: ${serverId}`, "CAPABILITY_DENIED");
    }
    const rec = this.servers.get(serverId);
    rec.status = "running";
    rec.startedAt = Date.now();
    return { ...rec };
  }

  stop(serverId) {
    if (!ALLOWED_SERVERS.has(serverId)) {
      throw new LspLifecycleError(`Server not allowlisted: ${serverId}`, "CAPABILITY_DENIED");
    }
    const rec = this.servers.get(serverId);
    rec.status = "stopped";
    rec.startedAt = null;
    return { ...rec };
  }

  requireRunning(serverId) {
    const rec = this.servers.get(serverId);
    if (!rec || rec.status !== "running") {
      throw new LspLifecycleError("Language server is not running", "LSP_NOT_RUNNING");
    }
    return rec;
  }
}
