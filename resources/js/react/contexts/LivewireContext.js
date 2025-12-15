import { createContext, useContext } from "react";
const LivewireContext = createContext(null);
export default LivewireContext;
export function useLivewireComponent() {
    const livewire = useContext(LivewireContext);
    if (!livewire) {
        throw new Error("useLivewire must be used within the LivewireContext");
    }
    return livewire;
}
