# Mobile Shell Technology Selection (Phase 02)

## Decision

**Selected: Capacitor (Ionic)** with a Vite + TypeScript web shell hosting the Code - OSS web workbench in a WebView/iframe.

## Options considered

| Option | Fit for Code - OSS web workbench | Cross-platform | Complexity for POC | Notes |
|--------|----------------------------------|----------------|--------------------|-------|
| **Capacitor** | Excellent — designed to wrap web apps | iOS + Android from one web codebase | Low | Native plugins for lifecycle, network, secure storage |
| React Native WebView | Good | Yes | Medium | Extra RN layer; workbench still WebView |
| Flutter WebView | Good | Yes | Medium–High | Dart toolchain; less natural for TS/Code - OSS |
| Native WKWebView / Android WebView only | Good | Two separate codebases | High | Duplicate lifecycle/auth code |

## Why Capacitor

1. **Architecture alignment** — The product is remote-first; the mobile app is primarily a client UI. Capacitor’s WebView shell matches that model.
2. **Code - OSS is web** — `workbench.web.main.ts` targets browsers. Embedding that surface is natural in a WebView.
3. **Single shared shell logic** — Auth gate, loading/error/reconnect, and navigation live in one TypeScript codebase for iOS and Android.
4. **Native capabilities without forking** — `@capacitor/app`, `@capacitor/network`, `@capacitor/preferences` cover Phase 02 lifecycle and session needs.
5. **KISS / YAGNI** — Avoids introducing Flutter/Dart or a full React Native UI for a POC whose value is “workbench loads in a mobile shell.”

## POC workbench source

Phase 02 loads **https://vscode.dev** (Microsoft’s hosted web workbench, built from Code - OSS lineage) inside the shell iframe/WebView to prove integration without vendoring a multi-gigabyte local Code - OSS build.

Later phases will:

- Host a project-controlled Code - OSS web build (pinned 1.137.0)
- Route through the Mobile IDE Gateway
- Replace vscode.dev with the project workbench URL

## Explicit non-goals of this choice

- Not packaging desktop Electron VS Code onto mobile
- Not running unrestricted local Node/compilers on iOS
- Not Android-only architecture

## Build targets

- **Web**: `npm run dev` / `npm run build` (Vite)
- **iOS**: Capacitor iOS project → Xcode
- **Android**: Capacitor Android project → Android Studio / Gradle
