# Code - OSS Mobile Architecture Baseline

**Phase 01 document.** This is the architectural baseline for My Mobile IDE. It is intentionally high-level and research-oriented. Implementation of mobile shell, gateway, runtime, etc. belongs to later phases.

## 1. High-Level Architecture (Target)

```
┌───────────────────────────────────────────────┐
│              iOS / Android App                │
│  Mobile UI / Navigation / Auth / Storage      │
│  Native Lifecycle / Notifications / Files     │
└───────────────────────┬───────────────────────┘
                        │ HTTPS / WSS
                        ▼
┌───────────────────────────────────────────────┐
│            Code - OSS Web Workbench            │
│  Editor / Explorer / Search / Problems        │
│  Command UI / Workbench Services / Contribs   │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│             Mobile IDE Gateway                │
│  AuthZ / Sessions / Workspace / File /        │
│  Terminal / LSP / Git / Build / AI Agent API  │
│  Audit / Rate Limiting                        │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│        Remote Development Runtime              │
│  Workspace / Toolchains / Git / LSPs          │
│  Build-Test / Sandboxed Processes / Cache     │
└───────────────────────────────────────────────┘
```

**Core principle:** The mobile device primarily provides the IDE client/UI. Heavy workloads (terminal, language servers, compilation, tests, Git, package install, AI-assisted work) are remote-first. This is required for iOS and is the preferred model for a secure, consistent cross-platform product.

## 2. Code - OSS Upstream Pin

| Item | Value |
|------|--------|
| Repository | https://github.com/microsoft/vscode (Code - OSS) |
| Pinned version | 1.137.0 |
| Pinned commit | `645f29c` (tag `1.137.0`, released ~2026-09-08) |
| License of Code - OSS source | MIT |

Pinning strategy:

- Prefer official release tags for reproducibility.
- Record both version and full commit SHA.
- Future upgrades must be explicit (documented procedure in Phase 09).

## 3. Relevant Code - OSS Areas (Research Focus)

### 3.1 Web / Browser Workbench

Primary entry points and layout (as of the pinned generation):

```
src/vs/workbench/
├── api/
├── browser/
├── common/
├── contrib/
├── electron-browser/          (desktop-specific — avoid for mobile)
├── services/
├── test/
├── workbench.common.main.ts
├── workbench.desktop.main.ts  (desktop)
├── workbench.web.main.ts      ← primary interest for web/mobile shell
└── workbench.web.main.internal.ts
```

Key research topics for later phases:

- How the web workbench is bootstrapped (`workbench.web.main.ts` and related).
- Service abstractions and dependency injection used by the workbench.
- Contribution points (commands, views, editors, etc.).
- Browser-specific vs common vs electron-browser separation.
- How remote connections are modelled in the web product.

### 3.2 Server / Remote Development

```
src/vs/server/
├── node/
└── test/
```

Also examine:

- Remote agent / server architecture used by VS Code’s own remote development.
- How file system, terminal, and extension host are exposed over the remote protocol.
- Authentication and connection lifecycle abstractions.

**Guideline:** Prefer existing Code - OSS abstractions. Avoid inventing parallel systems unless a documented reason exists (mobile constraints, security boundary, or licensing).

## 4. Licensing & Branding Boundaries

| Aspect | Code - OSS (microsoft/vscode) | Microsoft Visual Studio Code product |
|--------|-------------------------------|--------------------------------------|
| License | MIT | Microsoft Software License (proprietary) |
| Telemetry / Marketplace | Configurable / absent by default in pure OSS builds | Microsoft endpoints and terms |
| Branding / Icons / Name | Neutral / configurable via `product.json` | “Visual Studio Code”, Microsoft trademarks |
| Extensions Marketplace | Must not use Microsoft’s marketplace under its terms for non-Microsoft distributions | Official marketplace |

**Project policy (Phase 01):**

- Build exclusively on the MIT-licensed Code - OSS source.
- Never copy Microsoft proprietary assets, icons, or product name.
- Independently review third-party dependency licenses before any distribution.
- Maintain clear notices and a trademark/branding policy (to be finalized in Phase 09).
- Do not assume that “VS Code” and “Code - OSS” are interchangeable for licensing or distribution purposes.

## 5. Research & Build Procedure (Reproducible)

To study the pinned Code - OSS baseline:

```bash
# Clone at the pinned commit (shallow is fine for research)
git clone --depth 1 --branch 1.137.0 https://github.com/microsoft/vscode.git code-oss-1.137.0
# or
git clone https://github.com/microsoft/vscode.git
cd vscode
git checkout 645f29c
```

Recommended study order for mobile IDE work:

1. `README.md` + licensing files.
2. `product.json` and how product identity is configured.
3. `src/vs/workbench/workbench.web.main.ts` and the web bootstrap path.
4. Workbench service interfaces (especially file, workspace, remote, extension).
5. `src/vs/server` and any remote-agent related code.
6. Build scripts (`package.json`, gulp, etc.) — note that a full build is heavy; research can be source-only.

**Do not** vendor the entire Code - OSS tree into this repository in Phase 01. Pin + document only. Integration strategy will be decided in later phases (likely a controlled submodule, package, or selective reuse).

## 6. Separation of Concerns (Project Layout)

Suggested top-level layout (may evolve after Phase 01 analysis):

```
my-mobile-ide/
├── README.md
├── AI_AGENT_RULES.md
├── docs/
│   ├── architecture/
│   │   └── CODE_OSS_MOBILE_ARCHITECTURE.md   ← this file
│   └── phases/
│       ├── CURRENT_PHASE.md
│       └── PHASE-01.md … PHASE-09.md
├── mobile/          # native shells (Phase 02+)
├── web/             # web workbench integration / customizations
├── gateway/         # secure API boundary (Phase 04+)
├── runtime/         # remote development runtime (later)
├── agent/           # controlled AI agent (Phase 07)
├── packages/        # shared libraries
└── tests/
```

Project-specific code should stay outside upstream Code - OSS sources wherever possible. Changes to upstream code (if any) must be isolated and documented for easy re-application on upgrade.

## 7. Security Baseline Notes

Even in Phase 01, the following are non-negotiable design constraints for all later work:

- Least privilege and explicit authorization at the gateway.
- Path traversal protection on every filesystem operation.
- No unrestricted process execution exposed to the client.
- Secrets never hardcoded or logged.
- All remote communication over authenticated, encrypted channels.
- Client-side authorization is never trusted.

## 8. Open Questions (Documented, Not Implemented)

These belong to later phases; they are recorded here only for awareness:

- Exact mobile shell technology (Capacitor, React Native WebView, Flutter WebView, native WKWebView/Android WebView, etc.).
- Whether to embed a full Code - OSS build or a thinner workbench subset.
- Runtime isolation technology (containers, VMs, process sandboxes).
- Extension trust model for mobile.

---

*This document is the Phase 01 architecture baseline. Future phases may extend it; they must not contradict the remote-first, secure-by-default, Code - OSS-reuse principles stated here.*
