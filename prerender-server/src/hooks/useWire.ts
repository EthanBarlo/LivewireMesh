import { useContext } from "react";
import { ServerLivewireContext } from "../ServerLivewireContext";
import type { MockWire } from "../types";

/**
 * Server-side version of useWire hook.
 * Returns the mock wire from ServerLivewireContext.
 */
export default function useWire(): MockWire {
  const livewire = useContext(ServerLivewireContext);
  
  if (!livewire) {
    throw new Error(
      "useWire must be used within ServerLivewireContext. " +
      "This error typically means the component is being rendered outside of the prerender server."
    );
  }
  
  return livewire.$wire;
}
