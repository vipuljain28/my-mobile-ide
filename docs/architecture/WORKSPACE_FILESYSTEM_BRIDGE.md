# Workspace + Filesystem Bridge (Phase 03)

## Purpose

Secure remote workspace and filesystem operations for the mobile IDE client.

The mobile device does **not** get unrestricted host filesystem access.
All paths are resolved inside an authorized workspace root.

## Components

```
packages/workspace-bridge/
  src/paths.js              # normalize + traversal protection
  src/auth.js               # session token required
  src/workspace-registry.js # discover / open / close
  src/filesystem.js         # list read write create rename delete
  src/events.js             # in-process change notifications
  src/service.js            # authorized facade
  src/server.js             # minimal HTTP API (not Phase 04 gateway)
```

Workspaces live under `runtime/workspaces/<id>/`.

## Security rules

- Every operation requires a session token.
- Workspace ids are restricted to `[a-zA-Z0-9._-]`.
- Client paths are normalized; `..`, absolute paths, URIs, and null bytes are rejected.
- Resolved paths (including symlink targets) must stay inside the workspace root.
- Workspace root itself cannot be deleted.

Negative cases covered by tests:

- `../../etc/passwd`
- `/etc/passwd`
- `file:///etc/passwd`
- symlink pointing outside the workspace
- unauthenticated requests

## Out of scope (later phases)

- Full gateway auth, HTTPS/WSS, rate limiting (Phase 04)
- Terminal / Git / build (Phase 06)
- AI (Phase 07)

## Run

```bash
cd packages/workspace-bridge
node --test test/*.test.js
node src/server.js   # http://127.0.0.1:8787
```
