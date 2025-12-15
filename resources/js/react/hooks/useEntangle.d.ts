/**
 * Entangle a React state with a Livewire property.
 * Works in both client and server (prerender) environments.
 *
 * @param key - The Livewire property key to entangle with
 * @param initialValue - The initial value (used as fallback if wire value is undefined)
 * @param live - Whether to sync immediately on change (default: false)
 */
export declare function useEntangle<T = string>(key: string, initialValue?: T, live?: boolean): [T, React.Dispatch<React.SetStateAction<T>>];
export default useEntangle;
//# sourceMappingURL=useEntangle.d.ts.map