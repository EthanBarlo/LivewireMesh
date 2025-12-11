#!/usr/bin/env node

/**
 * LivewireMesh Prerender Server CLI
 * 
 * Usage:
 *   npx livewiremesh-prerender ./prerender.config.ts
 *   
 * Or with tsx (for TypeScript configs):
 *   npx tsx ./vendor/ethanbarlo/livewiremesh/prerender-server/src/server.ts ./prerender.config.ts
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, "../src/server.ts");
const componentsEntry = process.argv[2];

if (!componentsEntry) {
  console.error("Usage: livewiremesh-prerender <components-entry-file>");
  console.error("Example: livewiremesh-prerender ./prerender.config.ts");
  process.exit(1);
}

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
