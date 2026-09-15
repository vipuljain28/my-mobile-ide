# My Mobile IDE

A mobile-first software development IDE for iPhone/iPad and Android, built on the open-source **Code - OSS** (VS Code) architecture.

This project is **not** a simple packaging of desktop Visual Studio Code / Electron onto mobile. It is a purpose-built mobile IDE that reuses the appropriate Code - OSS web/workbench/editor architecture and provides a secure remote development runtime.

## Current Status

**Phase 02 — Mobile Shell + Code - OSS Web Workbench POC** — **COMPLETE**

See:

- [`AI_AGENT_RULES.md`](AI_AGENT_RULES.md)
- [`docs/phases/CURRENT_PHASE.md`](docs/phases/CURRENT_PHASE.md)
- [`docs/phases/PHASE-02.md`](docs/phases/PHASE-02.md)
- [`docs/architecture/MOBILE_SHELL_TECHNOLOGY.md`](docs/architecture/MOBILE_SHELL_TECHNOLOGY.md)
- [`mobile/README.md`](mobile/README.md)

## High-Level Architecture

Mobile app (UI) → Code - OSS Web Workbench → Mobile IDE Gateway → Remote Development Runtime

## Code - OSS Pin

- Upstream: [microsoft/vscode](https://github.com/microsoft/vscode) (Code - OSS)
- Version: **1.137.0**
- Commit: **645f29c**

## Mobile shell (Phase 02)

- **Technology:** Capacitor + Vite + TypeScript
- **POC workbench:** https://vscode.dev loaded in WebView/iframe
- **Run web POC:** `cd mobile && npm install && npm run dev`
- **Native setup:** `cd mobile && ./scripts/setup-native.sh`
- **Smoke:** `cd mobile && npm run smoke`

## Repository Layout

```
my-mobile-ide/
├── AI_AGENT_RULES.md
├── README.md
├── docs/
│   ├── architecture/
│   └── phases/
├── mobile/          # Capacitor shell (Phase 02 COMPLETE)
├── web/
├── gateway/
├── runtime/
├── agent/
├── packages/
└── tests/
```

## License

Project license will be finalized after licensing review. Code - OSS portions remain under their original MIT license.
