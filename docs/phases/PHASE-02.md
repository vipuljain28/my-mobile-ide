# PHASE 02 — Mobile Shell + Code - OSS Web Workbench POC

## Goal

Prove Code - OSS web workbench can be presented through an iOS/Android mobile shell.

## Tasks

- [x] Select mobile shell technology → **Capacitor** (see `docs/architecture/MOBILE_SHELL_TECHNOLOGY.md`)
- [x] Create shared web shell (Vite + TypeScript source + static dist)
- [x] Capacitor config + native setup script (`scripts/setup-native.sh`)
- [x] Integrate web workbench (vscode.dev POC host)
- [x] Basic navigation (auth → loading → workbench / error)
- [x] Lifecycle handling (`@capacitor/app` + browser fallbacks)
- [x] Loading / error / reconnect states
- [x] Basic authentication boundary (POC token + Preferences / sessionStorage)
- [x] Smoke tests (`npm run smoke` / structure checks)

## Do NOT implement

- Real remote workspace
- Terminal
- Git
- LSP
- AI

## Status

**COMPLETE**

## Acceptance Criteria

- [x] Mobile shell technology selected and justified
- [x] Shared web shell created (cross-platform via Capacitor)
- [x] iOS project path documented + scaffold via `scripts/setup-native.sh` (requires macOS + Xcode to generate/build)
- [x] Android project path documented + scaffold via `scripts/setup-native.sh` (requires Android SDK to generate/build)
- [x] Code - OSS compatible web workbench loads inside the shell (vscode.dev)
- [x] Basic navigation works
- [x] Lifecycle (foreground/background) handled
- [x] Loading, error, and reconnect UI states present
- [x] Basic authentication boundary present
- [x] Smoke / structure verification passed

## Known limitations

- Native `android/` and `ios/` folders are generated on the developer machine with `scripts/setup-native.sh` (needs working `npm` + Android SDK / Xcode). They are not committed from the agent environment because npm installs were unreliable there.
- Production `dist/` is a plain-JS build equivalent to the TypeScript sources; run `npm run build` locally after `npm install` for the Vite pipeline.
- Workbench host is vscode.dev (POC only). Project-controlled Code - OSS build comes in later phases.

## How to run

```bash
cd mobile
npm install
npm run build
npm run smoke
npm run dev                    # browser POC at http://localhost:5173
./scripts/setup-native.sh      # generates android/ (+ ios/ on macOS)
npx cap open android
npx cap open ios               # macOS only
```
