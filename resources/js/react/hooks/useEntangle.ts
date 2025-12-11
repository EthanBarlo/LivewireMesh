import { useEffect, useState } from "react";
import useWire from "./useWire";

/**
 * Entangle a React state with a Livewire property.
 * 
 * @param key - The Livewire property key to entangle with
 * @param initialValue - The initial value (used as fallback if wire value is undefined)
 * @param live - Whether to sync immediately on change (default: false)
 */
export function useEntangle<T = string>(
    key: string,
    initialValue?: T,
    live: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const wire = useWire();

    // Get value from wire, fall back to initialValue if undefined
    const wireValue = wire.$get(key);
    const resolvedInitial = (wireValue !== undefined ? wireValue : initialValue) as T;

    const [value, setValue] = useState<T>(resolvedInitial);

    // Keep our react state in sync with the livewire property
    useEffect(() => {
        wire.$watch(key, (value) => {
            setValue(value);
        });
    }, [wire, key]);

    // Update the livewire property when our react state changes
    useEffect(() => {
        wire.$set(key, value, live);
    }, [value]);

    return [value, setValue];
}
