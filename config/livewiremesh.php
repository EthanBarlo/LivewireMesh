<?php

// config for EthanBarlo/LivewireMesh
return [

    /*
    |--------------------------------------------------------------------------
    | Components Directory
    |--------------------------------------------------------------------------
    |
    | The directory where LivewireMesh React components are located.
    | When using short component names (e.g., 'react-counter'), they will
    | be resolved to this directory.
    |
    */

    'components_dir' => env('LIVEWIREMESH_COMPONENTS_DIR', 'resources/js/livewire'),

    /*
    |--------------------------------------------------------------------------
    | Component Extension
    |--------------------------------------------------------------------------
    |
    | The file extension used for React components.
    |
    */

    'component_extension' => env('LIVEWIREMESH_COMPONENT_EXT', '.tsx'),

    /*
    |--------------------------------------------------------------------------
    | Prerender Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the Node.js prerender server for server-side rendering of
    | React components. When enabled, components will be prerendered on the
    | server and sent with the initial HTML response for instant visibility.
    |
    */

    'prerender' => [
        // Enable or disable prerendering globally
        'enabled' => env('LIVEWIREMESH_PRERENDER_ENABLED', false),

        // URL of the Node.js prerender server
        'server_url' => env('LIVEWIREMESH_PRERENDER_URL', 'http://localhost:3001'),

        // Timeout for prerender requests in seconds
        'timeout' => env('LIVEWIREMESH_PRERENDER_TIMEOUT', 5),

        // Cache prerendered HTML (requires Laravel cache to be configured)
        'cache' => [
            'enabled' => env('LIVEWIREMESH_PRERENDER_CACHE', false),
            'ttl' => env('LIVEWIREMESH_PRERENDER_CACHE_TTL', 3600), // seconds
        ],

        // Fallback behavior when prerender fails
        // Options: 'empty' (show nothing until JS loads), 'error' (throw exception)
        'fallback' => env('LIVEWIREMESH_PRERENDER_FALLBACK', 'empty'),
    ],

];
