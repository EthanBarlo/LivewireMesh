import type { MockLivewireComponent, MockWire } from "./types";

/**
 * Creates a mock Wire instance for server-side rendering.
 * All methods are no-ops since there's no actual Livewire instance on the server.
 * The mock provides the same interface so components don't throw errors during prerendering.
 */
const createMockWire = (componentName: string, initialData: Record<string, unknown>): MockWire => {
  // Store for $get/$set operations during prerender
  const data = { ...initialData };

  return {
    $parent: null,
    $el: null,
    $id: `prerender-${componentName}-${Date.now()}`,

    $get: (key: string): unknown => {
      // Return from initial props/data
      return data[key];
    },

    $set: (key: string, value: unknown, _live?: boolean): void => {
      // Store locally (won't persist to server during prerender)
      data[key] = value;
      console.warn(
        `[Prerender] $wire.$set("${key}") called during server render. Value stored locally but won't sync to Livewire until hydration.`
      );
    },

    $toggle: (key: string, _live?: boolean): void => {
      data[key] = !data[key];
      console.warn(
        `[Prerender] $wire.$toggle("${key}") called during server render. Value toggled locally but won't sync to Livewire until hydration.`
      );
    },

    $call: async (method: string, ..._args: unknown[]): Promise<unknown> => {
      console.warn(
        `[Prerender] $wire.$call("${method}") called during server render. This is a no-op until hydration.`
      );
      return undefined;
    },

    $watch: (key: string, _callback: (value: unknown) => void): void => {
      console.warn(
        `[Prerender] $wire.$watch("${key}") called during server render. Watcher will be registered after hydration.`
      );
    },

    $refresh: async (): Promise<void> => {
      console.warn(
        `[Prerender] $wire.$refresh() called during server render. This is a no-op until hydration.`
      );
    },

    $commit: (): void => {
      console.warn(
        `[Prerender] $wire.$commit() called during server render. This is a no-op until hydration.`
      );
    },

    $on: (event: string, _callback: (...args: unknown[]) => void): void => {
      console.warn(
        `[Prerender] $wire.$on("${event}") called during server render. Event listener will be registered after hydration.`
      );
    },

    $dispatch: (event: string, _params: object): void => {
      console.warn(
        `[Prerender] $wire.$dispatch("${event}") called during server render. This is a no-op until hydration.`
      );
    },

    $dispatchTo: (component: string, event: string, _params: object): void => {
      console.warn(
        `[Prerender] $wire.$dispatchTo("${component}", "${event}") called during server render. This is a no-op until hydration.`
      );
    },

    $dispatchSelf: (event: string, _params: object): void => {
      console.warn(
        `[Prerender] $wire.$dispatchSelf("${event}") called during server render. This is a no-op until hydration.`
      );
    },
  };
};

/**
 * Creates a mock Livewire component for server-side rendering.
 * This provides the context that React components expect when using hooks like useWire().
 */
export const createMockLivewireComponent = (
  componentName: string,
  props: Record<string, unknown>
): MockLivewireComponent => {
  const id = `prerender-${componentName}-${Date.now()}`;

  return {
    el: null,
    id,
    name: componentName,
    $wire: createMockWire(componentName, props),
    snapshot: {
      data: props,
      memo: {
        id,
        name: componentName,
        errors: {},
      },
    },
  };
};
