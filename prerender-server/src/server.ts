import express, { Request, Response, NextFunction } from "express";
import { renderToString } from "react-dom/server";
import React from "react";
import type { RenderRequest, RenderResponse, ComponentRegistry } from "./types";
import { createMockLivewireComponent } from "./mockLivewire";
import { ServerLivewireContext } from "./ServerLivewireContext";

// Component registry - will be populated by the build process or dynamic imports
const componentRegistry: ComponentRegistry = {};

/**
 * Register a component for server-side rendering.
 * This should be called during server initialization.
 */
export const registerComponent = (name: string, component: React.ComponentType<any>): void => {
  componentRegistry[name] = component;
};

/**
 * Get all registered component names.
 */
export const getRegisteredComponents = (): string[] => {
  return Object.keys(componentRegistry);
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

const PORT = process.env.PRERENDER_PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 LivewireMesh Prerender Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Render endpoint: POST http://localhost:${PORT}/render`);
});

export { app, componentRegistry };
