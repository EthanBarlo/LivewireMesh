export type CleanupCallback = () => void;

export type ComponentsMap = {
    [key: string]: {
        renderer: string;
        component: any;
    };
};

export interface LivewireSnapshot {
    // The serialized state of the component (public properties)
    data: Record<string, any>;

    // Long-standing information about the component
    memo: {
        // The component's unique ID
        id: string;

        // The component's name (e.g., 'counter')
        name: string;

        // The URI, method, and locale of the web page that the
        // component was originally loaded on
        path: string;
        method: string;
        locale: string;

        // A list of any nested "child" components
        // Keyed by internal template ID with component ID as values
        children: Record<string, [string, string]>;

        // Whether or not this component was "lazy loaded"
        lazyLoaded: boolean;

        // A list of any validation errors thrown during the last request
        errors: Record<string, string[]>;

        // Additional memo properties that may be added by features
        [key: string]: any;
    };

    // A securely encrypted hash of this snapshot
    checksum: string;
}

export type LivewireComponent = {
    el: HTMLElement;
    id: string;
    name: string;
    effects: any;
    canonical: any;
    ephemeral: any;
    reactive: any;
    $wire: Wire;
    children: any[];
    snapshot: LivewireSnapshot;
    shapshotEncoded: string;
};

export type Wire = {
    $parent: Wire | null;
    $el: HTMLElement;
    $id: string;
    $get: (key: string) => any;
    $set: (key: string, value: any, live: boolean) => void;
    $toggle: (key: string, live: boolean) => void;
    $call: (method: string, ...args: any[]) => Promise<any>;
    $watch: (key: string, callback: (value: any) => void) => void;
    $refresh: () => Promise<void>;
    $commit: () => void;
    $on: (event: string, callback: (...args: any[]) => void) => void;
    $hook: (event: string, callback: (...args: any[]) => void) => void;
    $dispatch: (event: string, params: object) => void;
    $dispatchTo: (component: string, event: string, params: object) => void;
    $dispatchSelf: (event: string, params: object) => void;
    $upload: (
        name: string,
        file: File,
        finish: (response: any) => void,
        error: (response: any) => void,
        progress: (event: { detail: { progress: number } }) => void
    ) => Promise<void>;
    $uploadMultiple: (
        name: string,
        files: File[],
        finish: (response: any) => void,
        error: (response: any) => void,
        progress: (event: { detail: { progress: number } }) => void
    ) => Promise<void>;
    $removeUpload: (
        name: string,
        tmpFilename: string,
        finish: (response: any) => void,
        error: (response: any) => void
    ) => Promise<void>;
    __instance: LivewireComponent;
};

export type Config = {
    renderers: MeshRenderer[];
    maxRenderAttempts: number | undefined;
    renderDelay: number | undefined;
    debug: boolean | undefined;
};

export type RenderedComponent = {
    componentName: string;
    props: any;
    updateProps: (livewireComponent: LivewireComponent, props: any) => void;
    cleanup: CleanupCallback;
};

export type RenderFunction = (
    componentName: string,
    livewireComponent: LivewireComponent,
    MeshComponent: any,
    props: any
) => RenderedComponent;

export type MeshRenderer = {
    type: string;
    renderComponent: RenderFunction;
};

declare global {
    interface Window {
        Mesh:
            | {
                  components: ComponentsMap;
                  renderedComponents: {
                      [key: string]: RenderedComponent;
                  };
                  config: Omit<Config, "renderers"> & {
                      renderers: {
                          [key: string]: RenderFunction;
                      };
                  };
              }
            | undefined;
    }
}
