export const GATEWAY_CONFIG = {
  host: process.env.MMI_GW_HOST || "127.0.0.1",
  port: Number(process.env.MMI_GW_PORT || 8443),
  sessionTtlMs: Number(process.env.MMI_SESSION_TTL_MS || 30 * 60 * 1000),
  rateLimitWindowMs: 60_000,
  rateLimitMax: Number(process.env.MMI_RATE_LIMIT || 120),
  maxBodyBytes: 1_048_576,
};
