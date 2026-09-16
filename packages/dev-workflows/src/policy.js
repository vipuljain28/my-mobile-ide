import path from "node:path";

export class PolicyError extends Error {
  constructor(message) {
    super(message);
    this.name = "PolicyError";
    this.code = "POLICY_DENIED";
  }
}

export const GIT_SUBCOMMANDS = new Set([
  "status", "diff", "log", "add", "commit", "checkout", "branch", "rev-parse",
]);

export const JOB_COMMANDS = {
  "npm:test": { argv: ["npm", "test"], kind: "test" },
  "npm:build": { argv: ["npm", "run", "build"], kind: "build" },
  "node:test": { argv: ["node", "--test"], kind: "test" },
};

export function assertWorkspaceBound(cwd, workspaceRoot) {
  if (!cwd || !workspaceRoot) throw new PolicyError("Workspace cwd required");
  const resolvedCwd = path.resolve(cwd);
  const root = path.resolve(workspaceRoot);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolvedCwd !== root && !resolvedCwd.startsWith(prefix)) {
    throw new PolicyError("cwd escapes workspace");
  }
}

export function authorizeGit(args) {
  if (!Array.isArray(args) || args[0] !== "git") throw new PolicyError("Only git argv allowed");
  const sub = args[1];
  if (!GIT_SUBCOMMANDS.has(sub)) throw new PolicyError(`Git subcommand not allowed: ${sub}`);
  for (const a of args.slice(2)) {
    if (typeof a !== "string") throw new PolicyError("Invalid argument");
    if (a.startsWith("--exec-path") || a.includes("$(") || a.includes("`") || a.includes(";")) {
      throw new PolicyError("Unsafe git argument");
    }
  }
  return args.slice();
}

export function authorizeJob(jobId) {
  const spec = JOB_COMMANDS[jobId];
  if (!spec) throw new PolicyError(`Job not allowlisted: ${jobId}`);
  return { jobId, ...spec, argv: spec.argv.slice() };
}

export function authorizeTerminal(argv) {
  if (!Array.isArray(argv) || argv.length === 0) throw new PolicyError("argv required");
  if (argv[0] === "git") return authorizeGit(argv);
  if (argv[0] === "npm" && argv[1] === "test") return ["npm", "test"];
  if (argv[0] === "npm" && argv[1] === "run" && argv[2] === "build") return ["npm", "run", "build"];
  if (argv[0] === "node" && argv[1] === "--test") return ["node", "--test"];
  if (argv[0] === "echo" && argv.length === 2 && !String(argv[1]).startsWith("-")) return ["echo", argv[1]];
  throw new PolicyError(`Command not allowlisted: ${argv.join(" ")}`);
}
