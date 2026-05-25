import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1400
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});
