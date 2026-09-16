/**
 * Authorized filesystem operations confined to an open workspace.
 */

import fs from "node:fs";
import path from "node:path";
import { resolveWorkspacePath, InvalidPathError } from "./paths.js";

export class NotFoundError extends Error {
  constructor(p) {
    super(`Not found: ${p}`);
    this.name = "NotFoundError";
    this.code = "NOT_FOUND";
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.code = "CONFLICT";
  }
}

function relativeFromRoot(root, abs) {
  const rel = path.relative(root, abs);
  return rel === "" ? "" : rel.split(path.sep).join("/");
}

export class WorkspaceFileSystem {
  constructor(workspace, events) {
    this.workspace = workspace;
    this.events = events;
  }

  resolve(rel) {
    return resolveWorkspacePath(this.workspace.root, rel);
  }

  list(rel = "") {
    const abs = this.resolve(rel);
    if (!fs.existsSync(abs)) throw new NotFoundError(rel);
    const stat = fs.statSync(abs);
    if (!stat.isDirectory()) {
      throw new InvalidPathError("Not a directory");
    }
    const entries = fs.readdirSync(abs, { withFileTypes: true }).map((e) => {
      const childAbs = path.join(abs, e.name);
      let size = 0;
      let isDir = e.isDirectory();
      try {
        const st = fs.statSync(childAbs);
        size = st.size;
        isDir = st.isDirectory();
      } catch {
        /* ignore broken symlink metadata */
      }
      return {
        name: e.name,
        path: relativeFromRoot(this.workspace.root, childAbs),
        type: isDir ? "directory" : "file",
        size,
      };
    });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    return { path: relativeFromRoot(this.workspace.root, abs), entries };
  }

  readFile(rel) {
    const abs = this.resolve(rel);
    if (!fs.existsSync(abs)) throw new NotFoundError(rel);
    if (fs.statSync(abs).isDirectory()) {
      throw new InvalidPathError("Cannot read a directory as a file");
    }
    const buf = fs.readFileSync(abs);
    return {
      path: relativeFromRoot(this.workspace.root, abs),
      encoding: "utf8",
      content: buf.toString("utf8"),
      size: buf.length,
    };
  }

  writeFile(rel, content) {
    const abs = this.resolve(rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      throw new ConflictError("Cannot write to a directory");
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content ?? "", "utf8");
    const ev = this.events.emitChange(this.workspace.id, { type: "write", path: relativeFromRoot(this.workspace.root, abs) });
    return { path: relativeFromRoot(this.workspace.root, abs), event: ev };
  }

  createFile(rel, content = "") {
    const abs = this.resolve(rel);
    if (fs.existsSync(abs)) throw new ConflictError("Already exists");
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
    const ev = this.events.emitChange(this.workspace.id, { type: "create", path: relativeFromRoot(this.workspace.root, abs) });
    return { path: relativeFromRoot(this.workspace.root, abs), event: ev };
  }

  createDirectory(rel) {
    const abs = this.resolve(rel);
    if (fs.existsSync(abs)) throw new ConflictError("Already exists");
    fs.mkdirSync(abs, { recursive: true });
    const ev = this.events.emitChange(this.workspace.id, { type: "mkdir", path: relativeFromRoot(this.workspace.root, abs) });
    return { path: relativeFromRoot(this.workspace.root, abs), event: ev };
  }

  rename(fromRel, toRel) {
    const fromAbs = this.resolve(fromRel);
    const toAbs = this.resolve(toRel);
    if (!fs.existsSync(fromAbs)) throw new NotFoundError(fromRel);
    if (fs.existsSync(toAbs)) throw new ConflictError("Destination already exists");
    fs.mkdirSync(path.dirname(toAbs), { recursive: true });
    fs.renameSync(fromAbs, toAbs);
    const ev = this.events.emitChange(this.workspace.id, {
      type: "rename",
      path: relativeFromRoot(this.workspace.root, fromAbs),
      to: relativeFromRoot(this.workspace.root, toAbs),
    });
    return {
      from: relativeFromRoot(this.workspace.root, fromAbs),
      to: relativeFromRoot(this.workspace.root, toAbs),
      event: ev,
    };
  }

  delete(rel) {
    const abs = this.resolve(rel);
    if (!fs.existsSync(abs)) throw new NotFoundError(rel);
    if (abs === this.workspace.root) {
      throw new InvalidPathError("Cannot delete the workspace root");
    }
    fs.rmSync(abs, { recursive: true, force: false });
    const ev = this.events.emitChange(this.workspace.id, { type: "delete", path: relativeFromRoot(this.workspace.root, abs) });
    return { path: relativeFromRoot(this.workspace.root, abs), event: ev };
  }
}
