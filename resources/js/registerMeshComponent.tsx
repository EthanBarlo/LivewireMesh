import { debugLog } from "./utils";

export default function registerMeshComponent(renderer: string, name: string, component: any) {
    debugLog("registering component", { renderer, name, component });

    if(!window.Mesh){
        throw new Error("LivewireMesh is not initialized")
    }

    window.Mesh.components[name] = {
        renderer,
        component
    };
}