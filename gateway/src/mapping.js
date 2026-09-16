export class MappingError extends Error {
  constructor(message) {
    super(message);
    this.name = "MappingError";
    this.code = "MAPPING";
  }
}

export class WorkspaceRuntimeMap {
  constructor() {
    this.wsToRt = new Map();
  }

  bind(workspaceId, runtimeId) {
    if (!workspaceId || !runtimeId) throw new MappingError("workspaceId and runtimeId required");
    this.wsToRt.set(workspaceId, runtimeId);
    return { workspaceId, runtimeId };
  }

  unbind(workspaceId) {
    this.wsToRt.delete(workspaceId);
    return { workspaceId, runtimeId: null };
  }

  runtimeFor(workspaceId) {
    return this.wsToRt.get(workspaceId) || null;
  }

  list() {
    return [...this.wsToRt.entries()].map(([workspaceId, runtimeId]) => ({ workspaceId, runtimeId }));
  }
}
