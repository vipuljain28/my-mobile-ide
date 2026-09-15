# PHASE 04 — Remote Development Gateway

## Goal

Create the secure service boundary between the mobile IDE and development runtime.

## Implement

- Authentication
- Authorization
- Sessions
- HTTPS/WSS
- Runtime lifecycle abstraction
- Workspace/runtime mapping
- Audit logging
- Rate limiting
- Request validation

## Principle

The gateway is a security boundary.

Do NOT expose unrestricted runtime/process access to clients.

## Status

Not started. Do not implement until `CURRENT_PHASE.md` is advanced by a human.

## Acceptance Criteria (when started)

- [ ] Authentication and authorization implemented
- [ ] Session management with expiry
- [ ] HTTPS and WSS only
- [ ] Runtime lifecycle abstraction in place
- [ ] Workspace ↔ runtime mapping
- [ ] Audit logging for security-relevant events
- [ ] Rate limiting
- [ ] Request validation on all endpoints
- [ ] No unrestricted process or host access exposed to clients
