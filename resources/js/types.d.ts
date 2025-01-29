type CleanupCallback = () => void;

type ComponentsMap = {
    [key: string]: {
        renderer: string;
        component: any;
    }
}

type LivewireComponent = {
    el: HTMLElement;
    id: string;
    name: string;
    effects: any;
    canonical: any;
    ephemeral: any;
    reactive: any;
    $wire: Wire;
    children: any[];
    snapshot: any;
    shapshotEncoded: string;
}

type Wire = {
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
    $dispatch: (event: string, params: object) => void;
    $dispatchTo: (component: string, event: string, params: object) => void;
    $dispatchSelf: (event: string, params: object) => void;
    $upload: (name: string, file:File, finish: (response: any) => void, error: (response: any) => void, progress: (event: { detail: { progress: number } } ) => void) => Promise<void>;
    $uploadMultiple: (name: string, files: File[], finish: (response: any) => void, error: (response: any) => void, progress: (event: { detail: { progress: number } } ) => void) => Promise<void>;
    $removeUpload: (name: string, tmpFilename: string, finish: (response: any) => void, error: (response: any) => void) => Promise<void>;
    __instance: () => LivewireComponent;
}

interface Window {
    Mesh: {
        components: ComponentsMap;
        renderedComponents: {
            [key: string]: RenderedComponent
        };
        config: Omit<Config, 'renderers'> & {
            renderers: {
                [key: string]: RenderFunction
            };
        }
    } | undefined;
}

type Config = {
    renderers: MeshRenderer[];
    maxRenderAttempts: number | undefined;
    renderDelay: number | undefined;
}

type RenderedComponent = {
    componentName: string;
    props: any;
    updateProps: (livewireComponent: LivewireComponent, props: any) => void;
    cleanup: CleanupCallback;
}

type RenderFunction = (componentName: string, livewireComponent: LivewireComponent, MeshComponent: any, props: any) => RenderedComponent;

type MeshRenderer = {
    type: string;
    renderComponent: RenderFunction;
}