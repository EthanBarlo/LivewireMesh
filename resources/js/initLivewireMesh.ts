import renderComponent from "./renderComponent";
import { Config } from "./types";
import {
    debugLog,
    getComponentName,
    getProps,
    getRenderedComponent,
    setRenderedComponent,
} from "./utils";

export default async function initLivewireMesh(Livewire: any, config: Config) {
    const {
        renderers,
        maxRenderAttempts = 100,
        renderDelay = 50,
        debug,
    } = config;

    // Initialize the LivewireMesh global object
    // Which tracks the activly rendered components and their props
    window.Mesh = {
        components: {},
        renderedComponents: {},
        config: {
            renderDelay,
            maxRenderAttempts,
            renderers: Object.fromEntries(
                renderers.map((r) => [r.type, r.renderComponent])
            ),
            debug,
        },
    };

    debugLog("Initialized LivewireMesh", window.Mesh.config);

    // Hook into Livewire component initialization
    Livewire.hook("component.init", async ({ component, cleanup }) => {
        const componentName = getComponentName(component.el);

        if (!componentName) {
            return; // Not a LivewireMesh component
        }
        debugLog("component.init | " + componentName, { component });

        debugLog("component.init | " + componentName, "Rendering component");
        let renderAttempts = 0;
        while (renderAttempts < maxRenderAttempts) {
            try {
                const renderedComponent = await renderComponent(
                    component,
                    componentName
                );
                setRenderedComponent(component.id, renderedComponent);
                cleanup(() => renderedComponent.cleanup());
                break;
            } catch (e) {
                renderAttempts++;
                debugLog(
                    "component.init | " + componentName,
                    "Rendering component (attempt " + renderAttempts + ")"
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    });

    // Hook into Livewire component updates
    Livewire.hook("morph.updated", ({ el, component }) => {
        try {
            const rendered = getRenderedComponent(component.id);
            let props = getProps(component.el);

            // Return if props have not changed
            if (JSON.stringify(props) === JSON.stringify(rendered.props)) {
                return;
            }

            rendered.updateProps(component, props);
            rendered.props = props;
        } catch (e) {
            return; // Not a LivewireMesh component - silently ignore
        }
    });
}
