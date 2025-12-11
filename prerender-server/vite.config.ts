import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Vite configuration for building the prerender server.
 * This bundles the server code for production use.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    // Build for Node.js environment
    ssr: true,
    target: "node18",
    outDir: "dist",
    rollupOptions: {
      input: {
        server: resolve(__dirname, "src/server.ts"),
      },
      output: {
        format: "esm",
        entryFileNames: "[name].js",
      },
      // Don't bundle Node.js built-ins or dependencies
      external: [
        "express",
        "react",
        "react-dom",
        "react-dom/server",
        /^node:/,
      ],
    },
    // Don't minify for easier debugging
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      // Allow imports from the main package's resources
      "@components": resolve(__dirname, "../resources/js/react"),
    },
  },
});
