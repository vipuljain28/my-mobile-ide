# My Mobile IDE

A mobile-first software development IDE for iPhone/iPad and Android, built on the open-source **Code - OSS** (VS Code) architecture.

This project is **not** a simple packaging of desktop Visual Studio Code / Electron onto mobile. It is a purpose-built mobile IDE that reuses the appropriate Code - OSS web/workbench/editor architecture and provides a secure remote development runtime.

## Current Status

**Phase 01 — Repository Bootstrap + Code - OSS Baseline** is the active phase.

See:

- [`AI_AGENT_RULES.md`](AI_AGENT_RULES.md) — mandatory rules for AI agents (phase gating, security, engineering standards)
- [`docs/phases/CURRENT_PHASE.md`](docs/phases/CURRENT_PHASE.md)
- [`docs/phases/PHASE-01.md`](docs/phases/PHASE-01.md)
- [`docs/architecture/CODE_OSS_MOBILE_ARCHITECTURE.md`](docs/architecture/CODE_OSS_MOBILE_ARCHITECTURE.md)

## High-Level Architecture

Mobile app (UI) → Code - OSS Web Workbench → Mobile IDE Gateway → Remote Development Runtime

Development workloads (terminal, language servers, build, test, Git, AI assistance) are remote-first. This is required for iOS and is the preferred security model overall.

## Code - OSS Pin

- Upstream: [microsoft/vscode](https://github.com/microsoft/vscode) (Code - OSS)
- Version: **1.137.0**
- Commit: **645f29c**

Licensing: Code - OSS source is MIT. Microsoft’s distributed “Visual Studio Code” product uses a different (proprietary) license and branding. This project uses only the open-source foundation and will independently manage branding, marketplace, and notices.

## Repository Layout

```
my-mobile-ide/
├── AI_AGENT_RULES.md
├── README.md
├── docs/
│   ├── architecture/
│   └── phases/
├── mobile/          # future native shells
├── web/             # future workbench integration
├── gateway/         # future secure gateway
├── runtime/         # future remote runtime
├── agent/           # future controlled AI agent
├── packages/
└── tests/
```

## Development Principles

- One phase at a time (enforced)
- SOLID / KISS / YAGNI / secure-by-default
- Prefer existing Code - OSS abstractions
- Keep project-specific changes isolated
- Clear upstream synchronization strategy

## License

Project license will be finalized after Phase 01 licensing review. Code - OSS portions remain under their original MIT license.
