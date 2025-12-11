import type { ComponentType } from "react";

export interface RenderRequest {
  component: string;
  props: Record<string, unknown>;
}

export interface RenderResponse {
  html: string;
  error?: string;
}

export interface ComponentRegistry {
  [key: string]: ComponentType<any>;
}

export interface PrerenderConfig {
  port: number;
  componentsPath: string;
}

/**
 * Mock Wire interface for server-side rendering.
 * These methods are no-ops on the server since there's no Livewire instance.
 */
export interface MockWire {
  $parent: null;
  $el: null;
  $id: string;
  $get: (key: string) => unknown;
  $set: (key: string, value: unknown, live?: boolean) => void;
  $toggle: (key: string, live?: boolean) => void;
  $call: (method: string, ...args: unknown[]) => Promise<unknown>;
  $watch: (key: string, callback: (value: unknown) => void) => void;
  $refresh: () => Promise<void>;
  $commit: () => void;
  $on: (event: string, callback: (...args: unknown[]) => void) => void;
  $dispatch: (event: string, params: object) => void;
  $dispatchTo: (component: string, event: string, params: object) => void;
  $dispatchSelf: (event: string, params: object) => void;
}

/**
 * Mock Livewire component for server-side rendering.
 */
export interface MockLivewireComponent {
  el: null;
  id: string;
  name: string;
  $wire: MockWire;
  snapshot: {
    data: Record<string, unknown>;
    memo: {
      id: string;
      name: string;
      errors: Record<string, string[]>;
    };
  };
}
