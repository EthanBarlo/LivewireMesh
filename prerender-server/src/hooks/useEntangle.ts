import { useState } from "react";
import useWire from "./useWire";

/**
 * Server-side version of useEntangle hook.
 * 
 * During SSR, this returns the initial value and provides a no-op setter.
 * The real interactivity happens after hydration.
 * 
 * @param key - The Livewire property key to entangle with
 * @param initialValue - The initial value to use during SSR (required for proper prerendering)
 * @param live - Whether to sync immediately (ignored during SSR)
 */
export function useEntangle<T = string>(
  key: string,
  initialValue: T,
  _live: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const wire = useWire();
  
  // Try to get value from wire data first, fall back to initialValue
  const wireValue = wire.$get(key);
  const resolvedValue = (wireValue !== undefined ? wireValue : initialValue) as T;
  
  // During SSR, we just return the resolved value
  const [value] = useState<T>(resolvedValue);
  
  // No-op setter for SSR - real updates happen after hydration
  const setValue: React.Dispatch<React.SetStateAction<T>> = () => {
    // No-op during SSR
  };
  
  return [value, setValue];
}

export default useEntangle;
