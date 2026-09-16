export const ALLOWED_CAPABILITIES = Object.freeze([
  "editor.diagnostics",
  "editor.completion",
  "editor.hover",
  "editor.navigation",
  "editor.syntax",
  "ui.theme",
]);

export const DENIED_CAPABILITIES = Object.freeze([
  "runtime.exec",
  "runtime.shell",
  "fs.unrestricted",
  "network.unrestricted",
  "process.spawn",
]);

export class CapabilityError extends Error {
  constructor(message) {
    super(message);
    this.name = "CapabilityError";
    this.code = "CAPABILITY_DENIED";
  }
}

export function assertAllowed(capability) {
  if (DENIED_CAPABILITIES.includes(capability) || !ALLOWED_CAPABILITIES.includes(capability)) {
    throw new CapabilityError(`Capability not allowed: ${capability}`);
  }
  return capability;
}

export function registerExtension({ id, name, capabilities }) {
  if (!id || !/^[a-zA-Z0-9._-]+$/.test(id)) {
    throw new CapabilityError("Invalid extension id");
  }
  const granted = [];
  for (const cap of capabilities || []) {
    granted.push(assertAllowed(cap));
  }
  return Object.freeze({ id, name: name || id, capabilities: granted, restricted: true });
}
