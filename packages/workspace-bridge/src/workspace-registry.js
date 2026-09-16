/**
 * Workspace discovery and open/close.
 */

import fs from "node:fs";
import path from "node:path";
import { ForbiddenError } from "./auth.js";

export class WorkspaceNotFoundError extends Error {
  constructor(id) {
    super(`Workspace not found: ${id}`);
    this.name = "WorkspaceNotFoundError";
    this.code = "WORKSPACE_NOT_FOUND";
  }
}

export class WorkspaceRegistry {
  constructor(rootsDir) {
    this.rootsDir = path.resolve(rootsDir);
    /** @type {Map<string, { id: string, root: string, openedBy: Set<string> }>} */
    this.open = new Map();
  }

  discover() {
    if (!fs.existsSync(this.rootsDir)) {
      fs.mkdirSync(this.rootsDir, { recursive: true });
    }
    const entries = fs.readdirSync(this.rootsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => ({
        id: e.name,
        name: e.name,
        root: path.join(this.rootsDir, e.name),
        open: this.open.has(e.name),
      }));
  }

  resolveRoot(workspaceId) {
    if (typeof workspaceId !== "string" || !/^[a-zA-Z0-9._-]+$/.test(workspaceId)) {
      throw new ForbiddenError("Invalid workspace id");
    }
    const root = path.resolve(this.rootsDir, workspaceId);
    const parent = this.rootsDir.endsWith(path.sep) ? this.rootsDir : this.rootsDir + path.sep;
    if (root !== this.rootsDir && !root.startsWith(parent)) {
      throw new ForbiddenError("Workspace id escapes roots directory");
    }
    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
      throw new WorkspaceNotFoundError(workspaceId);
    }
    return fs.realpathSync(root);
  }

  openWorkspace(workspaceId, sessionId) {
    const root = this.resolveRoot(workspaceId);
    let rec = this.open.get(workspaceId);
    if (!rec) {
      rec = { id: workspaceId, root, openedBy: new Set() };
      this.open.set(workspaceId, rec);
    }
    rec.openedBy.add(sessionId);
    return { id: workspaceId, root, open: true };
  }

  closeWorkspace(workspaceId, sessionId) {
    const rec = this.open.get(workspaceId);
    if (!rec) return { id: workspaceId, open: false };
    rec.openedBy.delete(sessionId);
    if (rec.openedBy.size === 0) {
      this.open.delete(workspaceId);
    }
    return { id: workspaceId, open: this.open.has(workspaceId) };
  }

  requireOpen(workspaceId) {
    const rec = this.open.get(workspaceId);
    if (!rec) {
      throw new ForbiddenError("Workspace is not open");
    }
    return rec;
  }
}
