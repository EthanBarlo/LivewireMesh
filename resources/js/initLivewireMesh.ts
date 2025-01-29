import renderComponent from "./renderComponent";
import {
    getComponentName,
    getProps,
    getRenderedComponent,
    setRenderedComponent,
} from "./utils";

export default async function initLivewireMesh(
    Livewire: any,
    config: Config
) {
    const { renderers, maxRenderAttempts = 1, renderDelay = 0 } = config;

    // Initialize the LivewireMesh global object
    // Which tracks the activly rendered components and their props
    window.Mesh = {
        components: {},
        renderedComponents: {},
        config: {
            renderDelay,
            maxRenderAttempts,
            renderers: Object.fromEntries(renderers.map(r => [r.type, r.renderComponent])),
        },
    };


    // Hook into Livewire component initialization
    Livewire.hook("component.init", async ({ component, cleanup }) => {
        const componentName = getComponentName(component.el);

        if (!componentName) {
            return; // Not a LivewireMesh component
        }

        let renderAttempts = 0;
        while(renderAttempts < maxRenderAttempts){
            try {
                const renderedComponent = await renderComponent(component, componentName);
                setRenderedComponent(component.id, renderedComponent);
                cleanup(() => renderedComponent.cleanup());
                break;
            } catch (e) {
                renderAttempts++;
                await new Promise(resolve => setTimeout(resolve, renderDelay));
            }
        }

        try {
            const renderedComponent = await renderComponent(component, componentName);
            setRenderedComponent(component.id, renderedComponent);
            cleanup(() => renderedComponent.cleanup());
        } catch (e) {
            throw new Error("Error rendering LivewireMesh component: " + e);
        }
    });

    // Hook into Livewire component updates
    Livewire.hook("morph.updated", ({ el, component }) => {
        try {
            const rendered = getRenderedComponent(component.id);
            let props = getProps(component.el);

            // Return if props have not changed
            if(JSON.stringify(props) ===  JSON.stringify(rendered.props)){
                return;
            }

            rendered.updateProps(component, props);
            rendered.props = props;
        } catch (e) {
            return; // Not a LivewireMesh component - silently ignore
        }
    });
}