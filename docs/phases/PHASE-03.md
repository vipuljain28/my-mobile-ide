# PHASE 03 — Workspace + Filesystem Bridge

## Goal

Connect the web workbench to a secure remote workspace/filesystem.

## Implement

- Workspace discovery
- Open/close workspace
- Directory listing
- Read file
- Write file
- Create file
- Rename
- Delete
- Change notifications
- Path normalization
- Traversal protection
- Authorization

## Security is critical

Prevent:

- `../../etc/passwd`
- and equivalent workspace escape attacks

## Do NOT implement

- Unrestricted shell
- AI

## Status

Not started. Do not implement until `CURRENT_PHASE.md` is advanced by a human.

## Acceptance Criteria (when started)

- [ ] Workspace discovery and open/close
- [ ] Full set of filesystem operations (list/read/write/create/rename/delete)
- [ ] Change notifications working
- [ ] Path normalization enforced
- [ ] Traversal protection verified (negative tests)
- [ ] Authorization checks on every operation
- [ ] No workspace escape possible from client-supplied paths
