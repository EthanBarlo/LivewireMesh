import { createContext, useContext, useEffect, useState } from "react";

const LivewireContext = createContext<LivewireComponent | null>(null);

export default LivewireContext;

export function useLivewireComponent() {
    const livewire = useContext(LivewireContext);
    if (!livewire) {
        throw new Error("useLivewire must be used within the LivewireContext");
    }

    return livewire;
}

export function useWire<T>() {
    const { $wire } = useLivewireComponent();
    return $wire as Wire & T;
}

export function useEntangle(key: string, live: boolean = false) {
    const wire = useWire();

    const [value, setValue] = useState(wire.$get(key));

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
