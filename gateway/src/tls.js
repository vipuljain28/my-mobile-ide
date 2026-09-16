import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function loadTlsCredentials() {
  const certPath = process.env.MMI_TLS_CERT;
  const keyPath = process.env.MMI_TLS_KEY;
  if (certPath && keyPath) {
    return {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      ephemeral: false,
    };
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mmi-tls-"));
  const key = path.join(dir, "key.pem");
  const cert = path.join(dir, "cert.pem");
  execFileSync("openssl", [
    "req", "-x509", "-newkey", "rsa:2048",
    "-keyout", key, "-out", cert,
    "-days", "1", "-nodes",
    "-subj", "/CN=localhost",
  ], { stdio: "ignore" });
  return {
    cert: fs.readFileSync(cert),
    key: fs.readFileSync(key),
    ephemeral: true,
    dir,
  };
}
