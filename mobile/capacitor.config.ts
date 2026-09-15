import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mymobileide.app",
  appName: "My Mobile IDE",
  webDir: "dist",
  server: {
    // Allow loading the remote workbench (vscode.dev) inside the WebView
    allowNavigation: ["vscode.dev", "*.vscode.dev", "github.com", "*.github.com"],
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
    limitsNavigationsToAppBoundDomains: false,
  },
};

export default config;
