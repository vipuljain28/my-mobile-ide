import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { normalizeRelativePath, resolveWorkspacePath, PathEscapeError, InvalidPathError } from "../src/paths.js";

test("normalize empty and dot", () => {
  assert.equal(normalizeRelativePath(""), "");
  assert.equal(normalizeRelativePath("."), "");
  assert.equal(normalizeRelativePath("  src/a.ts  "), "src/a.ts");
});

test("normalize rejects absolute and uri", () => {
  assert.throws(() => normalizeRelativePath("/etc/passwd"), PathEscapeError);
  assert.throws(() => normalizeRelativePath("C:\\Windows\\System32"), PathEscapeError);
  assert.throws(() => normalizeRelativePath("file:///etc/passwd"), PathEscapeError);
});

test("normalize rejects traversal", () => {
  assert.throws(() => normalizeRelativePath("../etc/passwd"), PathEscapeError);
  assert.throws(() => normalizeRelativePath("foo/../../etc/passwd"), PathEscapeError);
  assert.throws(() => normalizeRelativePath("foo/../../../etc/passwd"), PathEscapeError);
});

test("normalize rejects null byte", () => {
  assert.throws(() => normalizeRelativePath("foo\0bar"), InvalidPathError);
});

test("resolve stays inside workspace", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mmi-ws-"));
  const resolved = resolveWorkspacePath(root, "src/a.ts");
  assert.ok(resolved.startsWith(root));
  fs.rmSync(root, { recursive: true });
});

test("resolve blocks ../../etc/passwd", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mmi-ws-"));
  assert.throws(() => resolveWorkspacePath(root, "../../etc/passwd"), PathEscapeError);
  assert.throws(() => resolveWorkspacePath(root, "/etc/passwd"), PathEscapeError);
  fs.rmSync(root, { recursive: true });
});

test("resolve blocks symlink escape when present", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mmi-ws-"));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "mmi-out-"));
  fs.writeFileSync(path.join(outside, "secret"), "nope");
  const link = path.join(root, "escape");
  try {
    fs.symlinkSync(outside, link);
    assert.throws(() => resolveWorkspacePath(root, "escape/secret"), PathEscapeError);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});
