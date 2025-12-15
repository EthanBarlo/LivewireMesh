import { WireBase, LivewireComponentBase } from "../../types";
declare global {
    var __LIVEWIRE_SSR_CONTEXT__: LivewireComponentBase | undefined;
}
/**
 * Hook to access the Livewire wire instance.
 * Works in both client and server (prerender) environments.
 *
 * During SSR, checks globalThis.__LIVEWIRE_SSR_CONTEXT__ first (set by prerender server).
 * This avoids React context identity issues between bundled server and component code.
 */
export default function useWire<T>(): WireBase & T;
//# sourceMappingURL=useWire.d.ts.map