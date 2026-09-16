export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION";
  }
}

export function requireObject(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("JSON object required");
  }
  return body;
}

export function requireString(obj, key, { min = 1, max = 256, pattern } = {}) {
  const v = obj[key];
  if (typeof v !== "string") throw new ValidationError(`${key} must be a string`);
  const s = v.trim();
  if (s.length < min || s.length > max) {
    throw new ValidationError(`${key} length must be ${min}-${max}`);
  }
  if (pattern && !pattern.test(s)) {
    throw new ValidationError(`${key} has invalid format`);
  }
  return s;
}

export const WORKSPACE_ID = /^[a-zA-Z0-9._-]+$/;
export const RUNTIME_ID = /^[a-zA-Z0-9._-]+$/;
