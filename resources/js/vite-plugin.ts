import { Plugin, ResolvedConfig } from "vite";
import fs from "fs";
import path from "path";
import { glob } from "glob";

export interface LivewireMeshPluginOptions {
  /**
   * Directory containing LivewireMesh React components.
   * @default 'resources/js/livewire'
   */
  componentsDir?: string;

  /**
   * File extensions to look for.
   * @default ['.tsx', '.jsx']
   */
  extensions?: string[];

  /**
   * Output directory for prerender assets (relative to project root).
   * @default 'public/build/mesh'
   */
  prerenderOutputDir?: string;
}

/**
 * Vite plugin for LivewireMesh that:
 * - Auto-discovers React components in the specified directory
 * - Generates client-side registration code
 * - Generates server bundle configuration for prerendering
 */
export function livewireMeshPlugin(options: LivewireMeshPluginOptions = {}): Plugin {
  const {
    componentsDir = "resources/js/livewire",
    extensions = [".tsx", ".jsx"],
    prerenderOutputDir = "public/build/mesh",
  } = options;

  let config: ResolvedConfig;
  let componentFiles: string[] = [];

  // Virtual module ID for auto-generated component registrations
  const virtualModuleId = "virtual:livewiremesh-components";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "livewiremesh",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async buildStart() {
      // Discover components
      const patterns = extensions.map((ext) => path.join(config.root, componentsDir, `**/*${ext}`));

      componentFiles = [];
      for (const pattern of patterns) {
        const files = await glob(pattern, { nodir: true });
        componentFiles.push(...files);
      }

      if (componentFiles.length > 0) {
        console.log(`\n📦 LivewireMesh: Found ${componentFiles.length} component(s)`);
        componentFiles.forEach((file) => {
          const relativePath = path.relative(config.root, file);
          const componentName = getComponentName(relativePath, componentsDir);
          console.log(`   • ${componentName} → ${relativePath}`);
        });
        console.log("");

        // In dev mode, generate the raw config for use with tsx
        // In build mode, we bundle it properly in writeBundle
        if (config.command === "serve") {
          const devConfigPath = path.join(config.root, prerenderOutputDir, "prerender.config.js");
          const devConfigDir = path.dirname(devConfigPath);
          if (!fs.existsSync(devConfigDir)) {
            fs.mkdirSync(devConfigDir, { recursive: true });
          }
          const serverConfig = generateServerConfig(componentFiles, config.root, componentsDir, devConfigDir);
          fs.writeFileSync(devConfigPath, serverConfig);
          console.log(`📦 LivewireMesh: Generated ${prerenderOutputDir}/prerender.config.js for dev mode\n`);
        }
      }
    },

    // Generate prerender config and copy server bundle after build completes
    async writeBundle() {
      if (componentFiles.length > 0 && config.command === "build") {
        const outputDir = path.join(config.root, prerenderOutputDir);

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // First write the raw config (used as input for bundling)
        const tempConfigPath = path.join(config.root, ".prerender-temp.js");
        const tempConfig = generateServerConfig(componentFiles, config.root, componentsDir, config.root);
        fs.writeFileSync(tempConfigPath, tempConfig);

        // Bundle the config with components using Vite
        try {
          const { build } = await import("vite");
          await build({
            configFile: false,
            root: config.root,
            publicDir: false, // Don't copy public dir
            build: {
              ssr: true,
              outDir: outputDir,
              emptyOutDir: false,
              copyPublicDir: false,
              rollupOptions: {
                input: { "prerender.config": tempConfigPath },
                output: { format: "esm", entryFileNames: "[name].mjs" },
              },
              minify: false,
            },
            resolve: {
              // Copy aliases from the main config
              alias: config.resolve?.alias || {},
            },
            ssr: {
              noExternal: true,
              external: ["react", "react-dom", "react-dom/server"],
            },
            logLevel: "silent",
          });
          console.log(`📦 LivewireMesh: Built ${prerenderOutputDir}/prerender.config.mjs\n`);
        } finally {
          // Clean up temp file
          if (fs.existsSync(tempConfigPath)) {
            fs.unlinkSync(tempConfigPath);
          }
        }

        copyPrerenderServer(config.root, outputDir);
      }
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Generate the registration code for all discovered components
        return generateClientRegistrationCode(componentFiles, config.root, componentsDir);
      }
    },

    // Add component files to the Vite build
    config(userConfig) {
      return {
        optimizeDeps: {
          include: ["react", "react-dom"],
        },
      };
    },
  };
}

/**
 * Get the component name from a file path.
 * resources/js/livewire/react-counter.tsx → react-counter
 */
function getComponentName(filePath: string, componentsDir: string): string {
  const relativePath = filePath.replace(/\\/g, "/");
  const dirPath = componentsDir.replace(/\\/g, "/");
  
  // Remove the components directory prefix
  let name = relativePath;
  if (name.startsWith(dirPath + "/")) {
    name = name.slice(dirPath.length + 1);
  }
  
  // Remove extension
  name = name.replace(/\.(tsx|jsx|ts|js)$/, "");
  
  return name;
}

/**
 * Get the full component path for registration.
 * react-counter → resources/js/livewire/react-counter.tsx
 */
function getFullComponentPath(filePath: string, root: string): string {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

/**
 * Generate the client-side registration code.
 */
function generateClientRegistrationCode(
  files: string[],
  root: string,
  componentsDir: string
): string {
  if (files.length === 0) {
    return "// No LivewireMesh components found\nexport {};";
  }

  const imports: string[] = [];
  const registrations: string[] = [];

  files.forEach((file, index) => {
    const fullPath = getFullComponentPath(file, root);
    const componentName = getComponentName(fullPath, componentsDir);
    const varName = `Component${index}`;

    imports.push(`import ${varName} from "/${fullPath}";`);
    registrations.push(`  registerMeshComponent("react", "${componentName}", ${varName});`);
  });

  return `
// Auto-generated by LivewireMesh Vite plugin
import registerMeshComponent from "@livewiremesh/registerMeshComponent";

${imports.join("\n")}

// Register all components
${registrations.join("\n")}

export {};
`.trim();
}

/**
 * Generate the server config for prerendering.
 */
function generateServerConfig(
  files: string[],
  root: string,
  componentsDir: string,
  configDir: string
): string {
  if (files.length === 0) {
    return "// No LivewireMesh components found\nexport const components = {};";
  }

  const imports: string[] = [];
  const componentEntries: string[] = [];

  files.forEach((file, index) => {
    const fullPath = getFullComponentPath(file, root);
    const componentName = getComponentName(fullPath, componentsDir);
    const varName = `Component${index}`;

    // Calculate relative path from config directory to the component file
    const absoluteComponentPath = path.join(root, fullPath);
    let relativePath = path.relative(configDir, absoluteComponentPath).replace(/\\/g, "/");

    // Ensure the path starts with ./ or ../
    if (!relativePath.startsWith(".")) {
      relativePath = "./" + relativePath;
    }

    imports.push(`import ${varName} from "${relativePath}";`);
    componentEntries.push(`  "${componentName}": ${varName},`);
  });

  return `// Auto-generated by LivewireMesh Vite plugin
// This file is used by the prerender server

${imports.join("\n")}

export const components = {
${componentEntries.join("\n")}
};

export default components;
`;
}

/**
 * Copy the prerender server bundle to the output directory.
 */
function copyPrerenderServer(root: string, outputDir: string): void {
  // Try to find the prerender server bundle in common locations
  const possiblePaths = [
    // Installed via npm/composer in vendor
    path.join(root, "vendor/ethanbarlo/livewiremesh/prerender-server/dist/prerender-server.mjs"),
    // Local development (monorepo)
    path.join(__dirname, "../../prerender-server/dist/prerender-server.mjs"),
  ];

  let serverBundlePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      serverBundlePath = p;
      break;
    }
  }

  if (!serverBundlePath) {
    console.warn("⚠️  LivewireMesh: Prerender server bundle not found. Run 'npm run build' in prerender-server directory first.");
    return;
  }

  const destPath = path.join(outputDir, "prerender-server.mjs");
  fs.copyFileSync(serverBundlePath, destPath);

  // Also copy sourcemap if it exists
  const sourcemapPath = serverBundlePath + ".map";
  if (fs.existsSync(sourcemapPath)) {
    fs.copyFileSync(sourcemapPath, destPath + ".map");
  }

  console.log(`📦 LivewireMesh: Copied prerender-server.mjs to ${path.relative(root, destPath)}\n`);
}

export default livewireMeshPlugin;
