import { createContext, useContext, useEffect, useState } from "react";
import useWire from "../hooks/useWire";
import useEntangle from "../hooks/useWire";
import { LivewireComponent } from "../../types";

const LivewireContext = createContext<LivewireComponent | null>(null);

export default LivewireContext;

export function useLivewireComponent() {
    const livewire = useContext(LivewireContext);
    if (!livewire) {
        throw new Error("useLivewire must be used within the LivewireContext");
    }

    return livewire;
}

export { useWire, useEntangle };
