import express, { Request, Response, NextFunction } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import path from "path";
import { pathToFileURL } from "url";
import type { RenderRequest, RenderResponse, ComponentRegistry } from "./types";
import { createMockLivewireComponent } from "./mockLivewire";
import { ServerLivewireContext } from "./ServerLivewireContext";

// Component registry - populated from the components entry file
let componentRegistry: ComponentRegistry = {};

/**
 * Register a component for server-side rendering.
 */
export const registerComponent = (name: string, component: React.ComponentType<any>): void => {
  componentRegistry[name] = component;
};

/**
 * Register multiple components at once.
 */
export const registerComponents = (components: ComponentRegistry): void => {
  componentRegistry = { ...componentRegistry, ...components };
};

/**
 * Get all registered component names.
 */
export const getRegisteredComponents = (): string[] => {
  return Object.keys(componentRegistry);
};

/**
 * Clear all registered components.
 */
export const clearComponents = (): void => {
  componentRegistry = {};
};

const app = express();
app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    registeredComponents: getRegisteredComponents(),
  });
});

/**
 * Render endpoint - accepts component name and props, returns HTML
 */
app.post("/render", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { component, props } = req.body as RenderRequest;

    if (!component) {
      const response: RenderResponse = {
        html: "",
        error: "Missing required field: component",
      };
      res.status(400).json(response);
      return;
    }

    const Component = componentRegistry[component];

    if (!Component) {
      const response: RenderResponse = {
        html: "",
        error: `Component "${component}" not found. Registered components: ${getRegisteredComponents().join(", ") || "none"}`,
      };
      res.status(404).json(response);
      return;
    }

    // Create mock Livewire component for context
    const mockLivewire = createMockLivewireComponent(component, props || {});

    // Render the component to HTML string with mock context
    const html = renderToString(
      React.createElement(
        ServerLivewireContext.Provider,
        { value: mockLivewire },
        React.createElement(Component, props || {})
      )
    );

    const response: RenderResponse = { html };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Error handling middleware
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Prerender error:", err);
  const response: RenderResponse = {
    html: "",
    error: err.message || "Internal server error",
  };
  res.status(500).json(response);
});

/**
 * Load components from an entry file.
 * The file should export a `components` object or default export mapping component names to React components.
 * 
 * @example
 * // prerender.config.ts
 * import Counter from './resources/js/components/Counter';
 * 
 * export const components = {
 *   'resources/js/components/Counter.tsx': Counter,
 * };
 */
async function loadComponentsFromFile(entryPath: string): Promise<void> {
  const absolutePath = path.isAbsolute(entryPath) 
    ? entryPath 
    : path.resolve(process.cwd(), entryPath);
  
  console.log(`📦 Loading components from: ${absolutePath}`);
  
  try {
    const entryUrl = pathToFileURL(absolutePath).href;
    const entry = await import(entryUrl);
    
    if (entry.components && typeof entry.components === "object") {
      registerComponents(entry.components);
      console.log(`✅ Loaded ${Object.keys(entry.components).length} components from 'components' export`);
    } else if (entry.default && typeof entry.default === "object") {
      registerComponents(entry.default);
      console.log(`✅ Loaded ${Object.keys(entry.default).length} components from default export`);
    } else {
      console.warn("⚠️  Entry file does not export 'components' or default object");
      console.warn("   Expected format:");
      console.warn("   export const components = { 'path/to/Component.tsx': Component };");
    }
  } catch (error) {
    console.error(`❌ Failed to load components: ${error}`);
    throw error;
  }
}

/**
 * Start the prerender server.
 */
export async function startServer(options?: { 
  port?: number; 
  componentsEntry?: string;
}): Promise<void> {
  const PORT = options?.port || Number(process.env.PRERENDER_PORT) || 3001;
  const ENTRY_PATH = options?.componentsEntry || process.env.PRERENDER_COMPONENTS || process.argv[2];

  if (ENTRY_PATH) {
    await loadComponentsFromFile(ENTRY_PATH);
  } else {
    console.log("ℹ️  No components entry file provided.");
    console.log("   Pass a file path as argument or set PRERENDER_COMPONENTS env var.");
    console.log("   Example: npx tsx server.ts ./prerender.config.ts");
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 LivewireMesh Prerender Server`);
    console.log(`   Port: ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Render: POST http://localhost:${PORT}/render`);
    console.log(`   Components: ${getRegisteredComponents().length}`);
    if (getRegisteredComponents().length > 0) {
      getRegisteredComponents().forEach(name => {
        console.log(`     • ${name}`);
      });
    }
    console.log("");
  });
}

// Auto-start if run directly
const isMainModule = process.argv[1]?.includes("server");
if (isMainModule) {
  startServer().catch(console.error);
}

export { app, componentRegistry, loadComponentsFromFile };
