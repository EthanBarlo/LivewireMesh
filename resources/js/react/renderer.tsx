import React from "react";
import { createRoot, hydrateRoot, Root } from "react-dom/client";
import LivewireContext from "./contexts/LivewireContext";
import { LivewireComponent, MeshRenderer } from "../types";
import { isPrerendered, debugLog } from "../utils";

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

        // Check if the component was prerendered on the server
        const wasPrerendered = isPrerendered(livewireComponent.el);
        debugLog(
            `renderer | ${componentName}`,
            wasPrerendered ? "Hydrating prerendered content" : "Client-side rendering"
        );

        let root: Root;

        // Create the React element tree
        const createReactElement = (
            livewireComponent: LivewireComponent,
            props: any
        ) => (
            <React.StrictMode>
                <LivewireContext.Provider value={livewireComponent}>
                    <MeshComponent {...props} />
                </LivewireContext.Provider>
            </React.StrictMode>
        );

        if (wasPrerendered && root_element.innerHTML.trim() !== "") {
            // Use hydrateRoot for prerendered content
            // This attaches event listeners without re-rendering the DOM
            root = hydrateRoot(
                root_element,
                createReactElement(livewireComponent, props),
                {
                    onRecoverableError: (error, errorInfo) => {
                        // Log hydration errors but don't crash
                        console.warn(
                            `LivewireMesh hydration warning for ${componentName}:`,
                            error,
                            errorInfo
                        );
                    },
                }
            );
        } else {
            // Use createRoot for client-side rendering
            root = createRoot(root_element);
            root.render(createReactElement(livewireComponent, props));
        }

        // Creating a function to allow updating props while maintaining the same root
        // This preserves any component state during updates
        const updateProps = (
            livewireComponent: LivewireComponent,
            props: any
        ) => {
            root.render(createReactElement(livewireComponent, props));
        };

        return {
            componentName,
            props,
            updateProps,
            cleanup: () => {
                root.unmount();
            },
        };
    },
} as MeshRenderer;
