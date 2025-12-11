/**
 * No-op stub for registerMeshComponent during server-side rendering.
 * Components call this when loaded, but on the server we don't need to register them
 * since the prerender server loads components directly via the prerender.config.ts.
 */
export default function registerMeshComponent(
  _renderer: string,
  _name: string,
  _component: any
): void {
  // No-op on server - registration is handled by prerender.config.ts
}
