import { defineConfig } from "vite";

export default defineConfig({
  // Relative base required for Capacitor file:// / local server loading
  base: "./",
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
