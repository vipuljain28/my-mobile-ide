/**
 * Phase 02 smoke checks — structure + optional build.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) console.log(`  PASS  ${name}`);
  else {
    console.error(`  FAIL  ${name}${detail ? " — " + detail : ""}`);
    failed += 1;
  }
}

console.log("Phase 02 smoke tests\n");

const required = [
  "index.html",
  "src/main.ts",
  "src/config.ts",
  "src/storage.ts",
  "src/lifecycle.ts",
  "src/ui.ts",
  "src/styles.css",
  "capacitor.config.ts",
  "vite.config.ts",
  "package.json",
];

for (const f of required) {
  check(`exists ${f}`, existsSync(join(root, f)));
}

const html = readFileSync(join(root, "index.html"), "utf8");
check("auth screen markup", html.includes('id="auth-screen"'));
check("loading screen markup", html.includes('id="loading-screen"'));
check("error screen markup", html.includes('id="error-screen"'));
check("workbench iframe", html.includes('id="workbench-frame"'));

const config = readFileSync(join(root, "src/config.ts"), "utf8");
check("workbench URL configured", config.includes("WORKBENCH_URL"));

const main = readFileSync(join(root, "src/main.ts"), "utf8");
check("load timeout handling", main.includes("WORKBENCH_LOAD_TIMEOUT_MS"));
check("sign-out path", main.includes("signOut"));

const cap = readFileSync(join(root, "capacitor.config.ts"), "utf8");
check("appId set", cap.includes("com.mymobileide.app"));
check("webDir is dist", cap.includes('webDir: "dist"'));

const viteBin = join(root, "node_modules", ".bin", "vite");
if (existsSync(viteBin)) {
  console.log("\nRunning production build…");
  const build = spawnSync("npm", ["run", "build"], {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });
  check("vite build exit 0", build.status === 0, (build.stderr || "").slice(0, 200));
  check("dist/index.html produced", existsSync(join(root, "dist/index.html")));
} else {
  console.log("\n(skip build — run npm install first)");
  console.log("  WARN  vite missing — install deps then re-run smoke");
}

console.log("");
if (failed > 0) {
  console.error(`${failed} smoke check(s) failed`);
  process.exit(1);
}
console.log("All smoke checks passed");
