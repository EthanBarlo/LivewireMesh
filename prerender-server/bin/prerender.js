#!/usr/bin/env node

/**
 * LivewireMesh Prerender Server CLI
 *
 * Usage:
 *   npx livewiremesh-prerender                           # Uses default: public/build/prerender.config.js
 *   npx livewiremesh-prerender ./custom-config.js        # Uses custom config path
 *
 * Or with tsx (for TypeScript configs):
 *   npx tsx ./vendor/ethanbarlo/livewiremesh/prerender-server/src/server.ts
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, "../src/server.ts");
const componentsEntry = process.argv[2] || "public/build/prerender.config.js";

// Use tsx to run the TypeScript server with the components entry
const child = spawn("npx", ["tsx", serverPath, componentsEntry], {
  stdio: "inherit",
  shell: true,
});

child.on("error", (error) => {
  console.error("Failed to start prerender server:", error.message);
  process.exit(1);
});

child.on("close", (code) => {
  process.exit(code || 0);
});
