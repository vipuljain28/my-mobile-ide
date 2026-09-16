export class RuntimeError extends Error {
  constructor(message, code = "RUNTIME") {
    super(message);
    this.name = "RuntimeError";
    this.code = code;
  }
}

export class RuntimeManager {
  constructor() {
    this.runtimes = new Map();
  }

  ensure(runtimeId) {
    if (!/^[a-zA-Z0-9._-]+$/.test(runtimeId)) {
      throw new RuntimeError("Invalid runtime id", "VALIDATION");
    }
    if (!this.runtimes.has(runtimeId)) {
      this.runtimes.set(runtimeId, { id: runtimeId, status: "stopped", startedAt: null });
    }
    return this.runtimes.get(runtimeId);
  }

  start(runtimeId) {
    const r = this.ensure(runtimeId);
    r.status = "running";
    r.startedAt = Date.now();
    return { ...r };
  }

  stop(runtimeId) {
    const r = this.ensure(runtimeId);
    r.status = "stopped";
    r.startedAt = null;
    return { ...r };
  }

  status(runtimeId) {
    return { ...this.ensure(runtimeId) };
  }

  list() {
    return [...this.runtimes.values()].map((r) => ({ ...r }));
  }
}
