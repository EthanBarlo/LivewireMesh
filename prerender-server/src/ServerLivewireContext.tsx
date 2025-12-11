import { createContext } from "react";
import type { MockLivewireComponent } from "./types";

/**
 * Server-side Livewire context for prerendering.
 * This mirrors the client-side LivewireContext but uses mock types.
 * 
 * During prerendering, components receive a mock Livewire component
 * that provides no-op implementations of all Livewire methods.
 * After hydration, the real LivewireContext takes over.
 */
export const ServerLivewireContext = createContext<MockLivewireComponent | null>(null);

export default ServerLivewireContext;
