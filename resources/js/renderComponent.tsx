import { LivewireComponent, RenderedComponent } from "./types";
import { getComponent, getProps, getRenderer } from "./utils";

export default function renderComponent(
    livewireComponent: LivewireComponent,
    componentName: string
): RenderedComponent {
    const { renderer, component } = getComponent(componentName);
    const renderComponent = getRenderer(renderer);

    const props = getProps(livewireComponent.el);
    return renderComponent(componentName, livewireComponent, component, props);
}
