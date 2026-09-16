/**
 * Authorized workspace + filesystem facade.
 * Every method requires a session token.
 */

import { SessionStore } from "./auth.js";
import { WorkspaceRegistry } from "./workspace-registry.js";
import { WorkspaceFileSystem } from "./filesystem.js";
import { WorkspaceEvents } from "./events.js";

export class WorkspaceService {
  constructor(rootsDir) {
    this.sessions = new SessionStore();
    this.registry = new WorkspaceRegistry(rootsDir);
    this.events = new WorkspaceEvents();
  }

  login(token) {
    return this.sessions.create(token);
  }

  logout(token) {
    this.sessions.revoke(token);
  }

  discover(token) {
    this.sessions.require(token);
    return this.registry.discover();
  }

  open(token, workspaceId) {
    const session = this.sessions.require(token);
    return this.registry.openWorkspace(workspaceId, session.id);
  }

  close(token, workspaceId) {
    const session = this.sessions.require(token);
    return this.registry.closeWorkspace(workspaceId, session.id);
  }

  fs(token, workspaceId) {
    this.sessions.require(token);
    const ws = this.registry.requireOpen(workspaceId);
    return new WorkspaceFileSystem(ws, this.events);
  }

  subscribe(token, workspaceId, listener) {
    this.sessions.require(token);
    this.registry.requireOpen(workspaceId);
    return this.events.subscribe(workspaceId, listener);
  }
}
