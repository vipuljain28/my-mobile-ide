# PHASE 02 — Mobile Shell + Code - OSS Web Workbench POC

## Goal

Prove Code - OSS web workbench can be presented through an iOS/Android mobile shell.

## Tasks

- Select mobile shell technology
- Create iOS project
- Create Android project
- Integrate web workbench
- Basic navigation
- Lifecycle handling
- Loading/error/reconnect states
- Basic authentication boundary
- Smoke tests

## Do NOT implement

- Real remote workspace
- Terminal
- Git
- LSP
- AI

## Status

Not started. Do not implement until `CURRENT_PHASE.md` is advanced by a human.

## Acceptance Criteria (when started)

- [ ] Mobile shell technology selected and justified
- [ ] iOS project created and builds
- [ ] Android project created and builds
- [ ] Code - OSS web workbench loads inside the mobile shell
- [ ] Basic navigation works
- [ ] Lifecycle (foreground/background, suspend/resume) handled
- [ ] Loading, error, and reconnect UI states present
- [ ] Basic authentication boundary present (no real backend required yet)
- [ ] Smoke tests pass on device or simulator/emulator

## Notes

Remote-first design remains mandatory. The shell is a client; heavy work stays remote.
