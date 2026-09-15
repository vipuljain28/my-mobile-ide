# PHASE 07 — AI Engineering Agent

## Goal

Integrate a controlled AI coding agent.

## Agent Flow

```
User requirement
       ↓
Requirement analysis
       ↓
Current phase policy
       ↓
Plan
       ↓
Controlled tools
       ↓
Implementation
       ↓
Tests
       ↓
Validation
       ↓
Completion report
       ↓
STOP
```

## Requirements

The phase restriction must be enforced by software, not merely by an LLM prompt.

The agent should have:

- Allowed tools
- Allowed paths
- Allowed commands
- Current-phase policy
- Approval boundaries
- Test requirements
- Diff validation
- Stop condition

The agent MUST NOT be able to start the next project phase.

Test the agent against attempts to bypass phase restrictions.

## Example Tool Policy

Agent requests: `write_file("/gateway/auth.ts")`

Policy checks:

- Is PHASE-04 active? YES
- Is /gateway allowed? YES
- Is write operation allowed? YES
- Is file within workspace? YES
→ ALLOW

If the agent attempts to modify a Phase 07 AI file during Phase 03:

→ DENY

This policy must be enforced by the system.

## Suggested Tool Model (later implementation)

- read_file
- search_code
- list_files
- write_file
- edit_file
- create_file
- delete_file
- run_test
- run_typecheck
- run_lint
- run_build
- git_diff
- git_status

Each tool must be checked against: current_phase, allowed_paths, allowed_operations, allowed_commands, workspace, user_authorization.

## Status

Not started. Do not implement until `CURRENT_PHASE.md` is advanced by a human.
