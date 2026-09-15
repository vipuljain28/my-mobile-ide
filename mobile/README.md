# Mobile Shell (Phase 02) — COMPLETE

Capacitor + Vite + TypeScript shell that hosts the Code - OSS web workbench.

## Quick start

```bash
npm install
npm run build
npm run smoke
npm run dev                 # http://localhost:5173
./scripts/setup-native.sh   # add android (+ ios on macOS)
npx cap open android
```

## What this phase delivers

| Feature | Status |
|---------|--------|
| Capacitor shell technology | Selected & documented |
| Auth gate (POC token) | Yes |
| Loading / error / reconnect UI | Yes |
| Workbench host (vscode.dev) | Yes |
| Lifecycle + network awareness | Yes |
| Static production `dist/` | Yes |
| Native project generation | Via `setup-native.sh` |

## Prerequisites

- Node.js 20+
- Android Studio + SDK (for Android)
- macOS + Xcode (for iOS)

## Out of scope

Remote workspace, terminal, Git, LSP, AI agent, production gateway.
