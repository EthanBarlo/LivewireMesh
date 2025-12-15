import { useEffect, useState } from "react";
import useWire from "./useWire";
/**
 * Entangle a React state with a Livewire property.
 * Works in both client and server (prerender) environments.
 *
 * @param key - The Livewire property key to entangle with
 * @param initialValue - The initial value (used as fallback if wire value is undefined)
 * @param live - Whether to sync immediately on change (default: false)
 */
export function useEntangle(key, initialValue, live = false) {
    const wire = useWire();
    const isServer = typeof window === "undefined";
    // Get value from wire, fall back to initialValue if undefined
    const wireValue = wire.$get(key);
    const resolvedInitial = (wireValue !== undefined ? wireValue : initialValue);
    const [value, setValue] = useState(resolvedInitial);
    // Keep our react state in sync with the livewire property
    // Skip on server (prerender) - effects don't run during SSR
    useEffect(() => {
        if (isServer)
            return;
        wire.$watch(key, (value) => {
            setValue(value);
        });
    }, [wire, key, isServer]);
    // Update the livewire property when our react state changes
    // Skip on server (prerender) - effects don't run during SSR
    useEffect(() => {
        if (isServer)
            return;
        wire.$set(key, value, live);
    }, [value, wire, key, live, isServer]);
    return [value, setValue];
}
export default useEntangle;
