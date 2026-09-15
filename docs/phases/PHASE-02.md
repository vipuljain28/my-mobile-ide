# PHASE 02 — Mobile Shell + Code - OSS Web Workbench POC

## Goal

Prove Code - OSS web workbench can be presented through an iOS/Android mobile shell.

## Tasks

- [x] Select mobile shell technology → **Capacitor** (see `docs/architecture/MOBILE_SHELL_TECHNOLOGY.md`)
- [x] Create shared web shell (Vite + TypeScript)
- [x] Capacitor iOS / Android project scaffolding
- [x] Integrate web workbench (vscode.dev POC host)
- [x] Basic navigation (auth → loading → workbench / error)
- [x] Lifecycle handling (`@capacitor/app`)
- [x] Loading / error / reconnect states
- [x] Basic authentication boundary (POC token + Preferences)
- [x] Smoke tests (`npm run smoke`)

## Do NOT implement

- Real remote workspace
- Terminal
- Git
- LSP
- AI

## Status

**IN PROGRESS** — shell implemented; native project generation depends on `npx cap add ios|android` after dependency install.

## Acceptance Criteria

- [x] Mobile shell technology selected and justified
- [x] Shared web shell created (iOS/Android via Capacitor)
- [ ] iOS project created and builds (requires macOS + Xcode; scaffold via `npx cap add ios`)
- [ ] Android project created and builds (requires Android SDK; scaffold via `npx cap add android`)
- [x] Code - OSS compatible web workbench loads inside the shell (vscode.dev)
- [x] Basic navigation works
- [x] Lifecycle (foreground/background) handled
- [x] Loading, error, and reconnect UI states present
- [x] Basic authentication boundary present
- [x] Smoke tests pass (web build + structure)

## Notes

Remote-first design remains mandatory. The shell is a client; heavy work stays remote.

## How to run

```bash
cd mobile
npm install
npm run build
npm run smoke
npm run dev          # browser POC
npx cap add android  # once
npx cap add ios      # once (macOS)
npx cap sync
npx cap open android
npx cap open ios
```
