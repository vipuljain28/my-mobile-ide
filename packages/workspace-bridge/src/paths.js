/**
 * Path normalization and workspace-escape prevention.
 * All client-supplied paths MUST pass through resolveWorkspacePath.
 */

import path from "node:path";
import { realpathSync, existsSync } from "node:fs";

export class PathEscapeError extends Error {
  constructor(message) {
    super(message);
    this.name = "PathEscapeError";
    this.code = "PATH_ESCAPE";
  }
}

export class InvalidPathError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPathError";
    this.code = "INVALID_PATH";
  }
}

export function normalizeRelativePath(input) {
  if (typeof input !== "string") {
    throw new InvalidPathError("Path must be a string");
  }
  if (input.includes("\0")) {
    throw new InvalidPathError("Path contains null byte");
  }

  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed === ".") {
    return "";
  }

  if (path.isAbsolute(trimmed) || /^[a-zA-Z]:[\\/]/.test(trimmed) || trimmed.startsWith("\\\\")) {
    throw new PathEscapeError("Absolute paths are not allowed");
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    throw new PathEscapeError("URI-style paths are not allowed");
  }

  const posix = trimmed.replace(/\\/g, "/");
  const normalized = path.posix.normalize(posix);

  if (normalized.startsWith("..") || normalized.split("/").includes("..")) {
    throw new PathEscapeError("Path traversal is not allowed");
  }

  return normalized === "." ? "" : normalized.replace(/^\/+/, "");
}

export function resolveWorkspacePath(workspaceRoot, relativePath) {
  if (!workspaceRoot || !path.isAbsolute(workspaceRoot)) {
    throw new InvalidPathError("Workspace root must be an absolute path");
  }

  const rel = normalizeRelativePath(relativePath);
  const rootReal = existsSync(workspaceRoot)
    ? realpathSync(workspaceRoot)
    : path.resolve(workspaceRoot);

  const candidate = rel ? path.resolve(rootReal, rel) : rootReal;
  const rootWithSep = rootReal.endsWith(path.sep) ? rootReal : rootReal + path.sep;

  if (candidate !== rootReal && !candidate.startsWith(rootWithSep)) {
    throw new PathEscapeError("Resolved path escapes the workspace");
  }

  if (existsSync(candidate)) {
    const real = realpathSync(candidate);
    if (real !== rootReal && !real.startsWith(rootWithSep)) {
      throw new PathEscapeError("Symlink target escapes the workspace");
    }
    return real;
  }

  const parent = path.dirname(candidate);
  if (existsSync(parent)) {
    const parentReal = realpathSync(parent);
    if (parentReal !== rootReal && !parentReal.startsWith(rootWithSep)) {
      throw new PathEscapeError("Parent path escapes the workspace");
    }
  } else if (parent !== rootReal && !parent.startsWith(rootWithSep)) {
    throw new PathEscapeError("Parent path escapes the workspace");
  }

  return candidate;
}
