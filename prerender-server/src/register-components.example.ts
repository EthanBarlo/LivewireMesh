/**
 * Example: How to register your React components with the prerender server.
 * 
 * Create a file like this in your Laravel project (e.g., prerender-server/src/register-components.ts)
 * and import it in your server entry point.
 * 
 * USAGE:
 * 1. Copy this file to your project and rename it to `register-components.ts`
 * 2. Import your React components
 * 3. Register them with the prerender server
 * 4. Import this file in your server entry point
 */

import { registerComponent } from "./server";

// Example: Import your React components
// import MyCounter from "../../resources/js/components/MyCounter";
// import MyForm from "../../resources/js/components/MyForm";
// import Dashboard from "../../resources/js/components/Dashboard";

// Register components with the exact same name used in your MeshComponent's component() method
// registerComponent("resources/js/components/MyCounter.tsx", MyCounter);
// registerComponent("resources/js/components/MyForm.tsx", MyForm);
// registerComponent("resources/js/components/Dashboard.tsx", Dashboard);

/**
 * Alternative: Dynamic component registration using glob imports (Vite feature)
 * 
 * This approach automatically registers all components matching a pattern.
 * Uncomment and modify the path to match your component structure.
 */

/*
const componentModules = import.meta.glob("../../resources/js/components/*.tsx", {
  eager: true,
}) as Record<string, { default: React.ComponentType<any> }>;

Object.entries(componentModules).forEach(([path, module]) => {
  // Convert path to component name (e.g., "../../resources/js/components/MyCounter.tsx" -> "resources/js/components/MyCounter.tsx")
  const componentName = path.replace("../../", "");
  registerComponent(componentName, module.default);
});
*/

console.log("📦 Component registration example loaded. Replace with your actual components.");
