# Mobile Shell (Phase 02)

Capacitor + Vite + TypeScript shell that hosts the Code - OSS web workbench.

## Prerequisites

- Node.js 20+
- For iOS builds: macOS + Xcode + CocoaPods
- For Android builds: Android Studio + SDK 24+

## Scripts

```bash
npm install
npm run dev          # web shell at http://localhost:5173
npm run build        # production web assets → dist/
npm run cap:sync     # copy web assets into native projects
npm run cap:ios      # open iOS project in Xcode (macOS)
npm run cap:android  # open Android project in Android Studio
npm run smoke        # automated smoke checks (web)
```

## First-time native setup

```bash
npm install
npm run build
npx cap add ios      # requires macOS
npx cap add android
npx cap sync
```

## Auth (POC)

Any non-empty token is accepted and stored via Capacitor Preferences (device) or sessionStorage (web). Real authentication arrives in Phase 04.

## Workbench

Loads `https://vscode.dev` in an iframe/WebView as a Phase 02 integration proof. Project-hosted Code - OSS build comes later.

## Out of scope (this phase)

Remote workspace, terminal, Git, LSP, AI agent, production gateway.
