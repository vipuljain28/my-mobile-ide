# PHASE 03 — Workspace + Filesystem Bridge

## Goal

Connect the web workbench to a secure remote workspace/filesystem.

## Implement

- [x] Workspace discovery
- [x] Open/close workspace
- [x] Directory listing
- [x] Read file
- [x] Write file
- [x] Create file
- [x] Rename
- [x] Delete
- [x] Change notifications
- [x] Path normalization
- [x] Traversal protection
- [x] Authorization

## Do NOT implement

- Unrestricted shell
- AI

## Status

**COMPLETE**

## Acceptance Criteria

- [x] Workspace discovery and open/close
- [x] Full set of filesystem operations
- [x] Change notifications working
- [x] Path normalization enforced
- [x] Traversal protection verified (negative tests)
- [x] Authorization checks on every operation
- [x] No workspace escape possible from client-supplied paths

## How to test

```bash
cd packages/workspace-bridge
node --test test/*.test.js
```
