import { debugLog } from "./utils";

// Queue for components registered before Mesh is initialized
const pendingRegistrations: Array<{ renderer: string; name: string; component: any }> = [];

export default function registerMeshComponent(renderer: string, name: string, component: any) {
    debugLog("registering component", { renderer, name, component });

    if (!window.Mesh) {
        // Queue the registration for later
        pendingRegistrations.push({ renderer, name, component });
        debugLog("queued component registration (Mesh not yet initialized)", { name });
        return;
    }

    window.Mesh.components[name] = {
        renderer,
        component,
    };
}

/**
 * Process any pending component registrations.
 * Called by initLivewireMesh after Mesh is initialized.
 */
export function processPendingRegistrations() {
    if (!window.Mesh) return;

    while (pendingRegistrations.length > 0) {
        const { renderer, name, component } = pendingRegistrations.shift()!;
        debugLog("processing queued registration", { name });
        window.Mesh.components[name] = {
            renderer,
            component,
        };
    }
}