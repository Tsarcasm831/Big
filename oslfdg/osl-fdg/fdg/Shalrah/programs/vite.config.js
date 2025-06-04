import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./",
  resolve: { alias: { "@": path.resolve(__dirname) } },
  build: {
    outDir: "dist",
  },
  server: {
    open: true,
    port: 3000
  }
});
