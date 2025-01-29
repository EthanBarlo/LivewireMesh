export default function registerMeshComponent(renderer: string, name: string, component: any) {
    if(!window.Mesh){
        throw new Error("LivewireMesh is not initialized")
    }

    window.Mesh.components[name] = {
        renderer,
        component
    };
}