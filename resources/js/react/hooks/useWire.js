import { useLivewireComponent } from "../contexts/LivewireContext";
/**
 * Hook to access the Livewire wire instance.
 * Works in both client and server (prerender) environments.
 *
 * During SSR, checks globalThis.__LIVEWIRE_SSR_CONTEXT__ first (set by prerender server).
 * This avoids React context identity issues between bundled server and component code.
 */
export default function useWire() {
    const isServer = typeof window === "undefined";
    // During SSR, use global context if available (avoids context identity issues)
    if (isServer && globalThis.__LIVEWIRE_SSR_CONTEXT__) {
        return globalThis.__LIVEWIRE_SSR_CONTEXT__.$wire;
    }
    // Client-side or fallback: use React context
    const { $wire } = useLivewireComponent();
    return $wire;
}
