export type CleanupCallback = () => void;
export type ComponentsMap = {
    [key: string]: {
        renderer: string;
        component: any;
    };
};
export interface LivewireSnapshot {
    data: Record<string, any>;
    memo: {
        id: string;
        name: string;
        path: string;
        method: string;
        locale: string;
        children: Record<string, [string, string]>;
        lazyLoaded: boolean;
        errors: Record<string, string[]>;
        [key: string]: any;
    };
    checksum: string;
}
/**
 * Base Livewire component interface that works for both client and server (prerender) environments.
 * Server implementations may have null el and omit some properties.
 */
export type LivewireComponentBase = {
    el: HTMLElement | null;
    id: string;
    name: string;
    $wire: WireBase;
    snapshot: {
        data: Record<string, any>;
        memo: {
            id: string;
            name: string;
            errors: Record<string, string[]>;
            [key: string]: any;
        };
        checksum?: string;
    };
    effects?: any;
    canonical?: any;
    ephemeral?: any;
    reactive?: any;
    children?: any[];
    shapshotEncoded?: string;
};
/**
 * Full LivewireComponent type for client-side usage (extends LivewireComponentBase with required client-only properties).
 */
export type LivewireComponent = LivewireComponentBase & {
    el: HTMLElement;
    effects: any;
    canonical: any;
    ephemeral: any;
    reactive: any;
    $wire: Wire;
    children: any[];
    snapshot: LivewireSnapshot;
    shapshotEncoded: string;
};
/**
 * Base Wire interface that works for both client and server (prerender) environments.
 * Server implementations may have null $parent and $el, and may omit some methods.
 */
export type WireBase = {
    $parent: WireBase | null;
    $el: HTMLElement | null;
    $id: string;
    $get: (key: string) => any;
    $set: (key: string, value: any, live?: boolean) => void;
    $toggle: (key: string, live?: boolean) => void;
    $call: (method: string, ...args: any[]) => Promise<any>;
    $watch: (key: string, callback: (value: any) => void) => void;
    $refresh: () => Promise<void>;
    $commit: () => void;
    $on: (event: string, callback: (...args: any[]) => void) => void;
    $hook?: (event: string, callback: (...args: any[]) => void) => void;
    $dispatch: (event: string, params: object) => void;
    $dispatchTo: (component: string, event: string, params: object) => void;
    $dispatchSelf: (event: string, params: object) => void;
    $upload?: (name: string, file: File, finish: (response: any) => void, error: (response: any) => void, progress: (event: {
        detail: {
            progress: number;
        };
    }) => void) => Promise<void>;
    $uploadMultiple?: (name: string, files: File[], finish: (response: any) => void, error: (response: any) => void, progress: (event: {
        detail: {
            progress: number;
        };
    }) => void) => Promise<void>;
    $removeUpload?: (name: string, tmpFilename: string, finish: (response: any) => void, error: (response: any) => void) => Promise<void>;
    __instance?: LivewireComponent;
};
/**
 * Full Wire type for client-side usage (extends WireBase with required client-only properties).
 */
export type Wire = WireBase & {
    $parent: Wire | null;
    $el: HTMLElement;
    $hook: (event: string, callback: (...args: any[]) => void) => void;
    $upload: (name: string, file: File, finish: (response: any) => void, error: (response: any) => void, progress: (event: {
        detail: {
            progress: number;
        };
    }) => void) => Promise<void>;
    $uploadMultiple: (name: string, files: File[], finish: (response: any) => void, error: (response: any) => void, progress: (event: {
        detail: {
            progress: number;
        };
    }) => void) => Promise<void>;
    $removeUpload: (name: string, tmpFilename: string, finish: (response: any) => void, error: (response: any) => void) => Promise<void>;
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
export type RenderFunction = (componentName: string, livewireComponent: LivewireComponent, MeshComponent: any, props: any) => RenderedComponent;
export type MeshRenderer = {
    type: string;
    renderComponent: RenderFunction;
};
declare global {
    interface Window {
        Mesh: {
            components: ComponentsMap;
            renderedComponents: {
                [key: string]: RenderedComponent;
            };
            config: Omit<Config, "renderers"> & {
                renderers: {
                    [key: string]: RenderFunction;
                };
            };
        } | undefined;
    }
}
//# sourceMappingURL=types.d.ts.map