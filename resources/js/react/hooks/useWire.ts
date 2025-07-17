import { useLivewireComponent } from "../contexts/LivewireContext";

export default function useWire<T>() {
    const { $wire } = useLivewireComponent();
    return $wire as Wire & T;
}
