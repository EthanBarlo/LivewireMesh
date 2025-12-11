/**
 * LivewireMesh Prerender Configuration
 * 
 * This file exports all React components that should be available
 * for server-side prerendering.
 * 
 * The component keys must match exactly what your MeshComponent's
 * component() method returns.
 */

import Counter from "./resources/js/components/Counter.server";

export const components = {
  "resources/js/components/Counter.tsx": Counter,
};

export default components;
