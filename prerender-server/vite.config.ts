import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite configuration for building the prerender server.
 * Bundles everything EXCEPT react/react-dom (uses host's versions).
 */
export default defineConfig({
  build: {
    ssr: true,
    target: "node18",
    outDir: "dist",
    rollupOptions: {
      input: {
        "prerender-server": resolve(__dirname, "src/server.ts"),
      },
      output: {
        format: "esm",
        entryFileNames: "[name].mjs",
      },
    },
    minify: false,
    sourcemap: true,
  },
  ssr: {
    // Bundle everything except react (host provides it)
    noExternal: true,
    external: [
      "react",
      "react-dom",
      "react-dom/server",
    ],
  },
});
