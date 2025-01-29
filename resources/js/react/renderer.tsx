import React from "react";
import { createRoot } from "react-dom/client";
import LivewireContext from "./contexts/LivewireContext";

export default {
    type: "react",
    renderComponent: (
        componentName,
        livewireComponent,
        MeshComponent,
        props
    ) => {
        const root_element = livewireComponent.el.querySelector(".mesh-root");

        if (!root_element) {
            throw new Error("LivewireMesh root element not found");
        }

        const root = createRoot(root_element);

        // Creating a function here to allow us to update the props
        // While maintaining the same root element thus maintaining any state
        const renderComponent = (
            livewireComponent: LivewireComponent,
            props: any
        ) => {
            root.render(
                <React.StrictMode>
                    <LivewireContext.Provider value={livewireComponent}>
                        <MeshComponent {...props} />
                    </LivewireContext.Provider>
                </React.StrictMode>
                
            );
        };

        // Initial render
        renderComponent(livewireComponent, props);

        return {
            componentName,
            props,
            updateProps: renderComponent,
            cleanup: () => {
                root.unmount();
            },
        };
    },
} as MeshRenderer;
