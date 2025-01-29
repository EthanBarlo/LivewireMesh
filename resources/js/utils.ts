export function getComponentName(el: HTMLElement){
    return el.dataset.meshComponent;
}

export function getProps(el: HTMLElement){
    let props = el.dataset.meshProps
    if (props) {
        try {
            props = JSON.parse(props)
        } catch (e) {
            console.error('Failed to parse data-mesh-props:', e)
        }
    }
    return props;
}

export function getComponent(name: string){
    const component = window.Mesh?.components[name];
    if(!component){
        throw new Error(`LivewireMesh component "${name}" not found`)
    }
    return component;
}

export function setRenderedComponent(livewire_id: string, renderedComponent: RenderedComponent){
    if(!window.Mesh){
        throw new Error("LivewireMesh is not initialized")
    }
    window.Mesh.renderedComponents[livewire_id] = renderedComponent;
}

export function getRenderedComponent(livewire_id: string){
    const renderedComponent = window.Mesh?.renderedComponents[livewire_id];
    if(!renderedComponent){
        throw new Error(`LivewireMesh rendered component "${livewire_id}" not found`)
    }
    return renderedComponent;
}

export function getRenderer(type: string){
    const renderer = window.Mesh?.config.renderers[type];
    if(!renderer){
        throw new Error(`LivewireMesh renderer for "${type}" not found`)
    }
    return renderer;
}