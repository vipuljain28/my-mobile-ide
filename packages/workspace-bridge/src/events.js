/**
 * In-process change notifications for a workspace.
 * Phase 04 may stream these over WSS.
 */

import { EventEmitter } from "node:events";

export class WorkspaceEvents {
  constructor() {
    this.bus = new EventEmitter();
    this.bus.setMaxListeners(100);
  }

  emitChange(workspaceId, event) {
    const payload = {
      workspaceId,
      type: event.type,
      path: event.path,
      to: event.to ?? null,
      at: Date.now(),
    };
    this.bus.emit("change", payload);
    this.bus.emit(`change:${workspaceId}`, payload);
    return payload;
  }

  subscribe(workspaceId, listener) {
    const ev = `change:${workspaceId}`;
    this.bus.on(ev, listener);
    return () => this.bus.off(ev, listener);
  }

  subscribeAll(listener) {
    this.bus.on("change", listener);
    return () => this.bus.off("change", listener);
  }
}
