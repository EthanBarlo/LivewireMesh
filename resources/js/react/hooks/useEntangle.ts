import { useEffect, useState } from "react";
import useWire from "./useWire";

export function useEntangle<T = string>(
    key: string,
    live: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const wire = useWire();

    const [value, setValue] = useState<T>(wire.$get(key));

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
