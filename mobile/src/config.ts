/**
 * Phase 02 configuration for the mobile shell.
 *
 * The workbench URL points at a public Code - OSS compatible web workbench
 * (vscode.dev) for the POC. Later phases will host a project-controlled
 * workbench build and connect through the Mobile IDE Gateway.
 */

export const APP_NAME = "My Mobile IDE";

/** Public web workbench used for Phase 02 integration proof. */
export const WORKBENCH_URL = "https://vscode.dev";

/** Preference keys (Capacitor Preferences / localStorage fallback). */
export const STORAGE_KEYS = {
  sessionToken: "mmi.sessionToken",
} as const;

/** How long to wait for the workbench iframe to load before error state. */
export const WORKBENCH_LOAD_TIMEOUT_MS = 45_000;

/**
 * POC auth: any non-empty token is accepted.
 * Phase 04 will replace this with real gateway authentication.
 */
export function isValidPocToken(token: string): boolean {
  return token.trim().length > 0;
}
