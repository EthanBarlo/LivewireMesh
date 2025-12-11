import { useContext } from "react";
import { ServerLivewireContext } from "../ServerLivewireContext";
import type { MockLivewireComponent } from "../types";

/**
 * Server-side version of useLivewireComponent hook.
 * Returns the mock Livewire component from ServerLivewireContext.
 */
export function useLivewireComponent(): MockLivewireComponent {
  const livewire = useContext(ServerLivewireContext);
  
  if (!livewire) {
    throw new Error(
      "useLivewireComponent must be used within ServerLivewireContext. " +
      "This error typically means the component is being rendered outside of the prerender server."
    );
  }
  
  return livewire;
}

export default useLivewireComponent;
