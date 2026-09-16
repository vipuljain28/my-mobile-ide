import path from "node:path";

export class AgentPolicyError extends Error {
  constructor(message, code = "AGENT_DENIED") {
    super(message);
    this.name = "AgentPolicyError";
    this.code = code;
  }
}

export const PHASE_WRITE_PREFIXES = {
  1: ["docs/", "README.md", "AI_AGENT_RULES.md", ".gitignore"],
  2: ["mobile/"],
  3: ["packages/workspace-bridge/", "runtime/workspaces/"],
  4: ["gateway/"],
  5: ["packages/language-services/", "mobile/src/editorUx.ts"],
  6: ["packages/dev-workflows/"],
  7: ["packages/ai-agent/", "agent/"],
  8: ["tests/", "docs/"],
  9: ["docs/", "mobile/"],
};

export const PROTECTED_FILES = new Set([
  "docs/phases/CURRENT_PHASE.md",
  "AI_AGENT_RULES.md",
]);

export const ALLOWED_TOOLS = new Set([
  "read_file", "search_code", "list_files", "write_file", "edit_file",
  "create_file", "delete_file", "run_test", "run_typecheck", "run_lint",
  "run_build", "git_diff", "git_status", "plan", "stop",
]);

export function parseCurrentPhase(markdown) {
  const m = String(markdown || "").match(/\*\*PHASE\s+0?(\d+)/i);
  if (!m) throw new AgentPolicyError("Cannot determine current phase");
  return Number(m[1]);
}

export function normalizeRepoPath(p) {
  const raw = String(p || "").replace(/\\/g, "/").trim();
  if (!raw) throw new AgentPolicyError("Path required");
  if (raw.includes("\0") || raw.startsWith("/") || /^[a-zA-Z]:/.test(raw)) {
    throw new AgentPolicyError("Absolute paths are not allowed");
  }
  const norm = path.posix.normalize(raw);
  if (norm.startsWith("..") || norm.split("/").includes("..")) {
    throw new AgentPolicyError("Path traversal is not allowed");
  }
  return norm.replace(/^\.\//, "");
}

export function canWrite(phase, repoPath) {
  const p = normalizeRepoPath(repoPath);
  if (PROTECTED_FILES.has(p)) return false;
  const prefixes = PHASE_WRITE_PREFIXES[phase] || [];
  return prefixes.some((pre) => (pre.endsWith("/") ? p.startsWith(pre) : p === pre));
}
