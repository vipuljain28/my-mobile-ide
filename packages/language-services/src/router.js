const ROUTES = [
  { language: "javascript", serverId: "builtin-javascript", match: (p) => /\.(js|mjs|cjs|jsx)$/i.test(p) },
];

export function routeDocument(path) {
  const rel = String(path || "");
  for (const r of ROUTES) {
    if (r.match(rel)) return { language: r.language, serverId: r.serverId };
  }
  return { language: "plaintext", serverId: null };
}

export function supportedLanguages() {
  return ["javascript"];
}
