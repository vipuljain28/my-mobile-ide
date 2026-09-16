# PHASE 05 — Editor + Language Services + Extensions

## Goal

Make the IDE useful for real development.

## Implement

- [x] LSP lifecycle
- [x] Diagnostics
- [x] Completion
- [x] Hover
- [x] Navigation
- [x] Language server routing
- [x] Controlled extension capability model
- [x] Mobile editor UX improvements

Start with at least one supported programming language. → JavaScript

## Do NOT

- Create unrestricted extension execution

## Status

**COMPLETE**

## Acceptance Criteria

- [x] LSP lifecycle managed through the gateway/runtime
- [x] Diagnostics, completion, hover, and navigation working for at least one language
- [x] Language server routing in place
- [x] Controlled extension capability model (no unrestricted execution)
- [x] Mobile-specific editor UX improvements applied

## How to test

```bash
cd packages/language-services
node --test test/*.test.js
```
