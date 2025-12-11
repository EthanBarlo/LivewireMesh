# Installation Guide

This guide walks you through setting up LivewireMesh in an existing Laravel Livewire application.

## Prerequisites

- Laravel 10+ with Livewire 3.5+
- Node.js and npm
- Vite (Laravel's default bundler)

## 1. Install the Package

```bash
composer require ethanbarlo/livewiremesh
```

## 2. Configure Manual Livewire Bundling

LivewireMesh requires you to manually bundle Livewire and Alpine so that the mesh initialization can hook into Livewire's lifecycle.

### Update Your Layout

In your main layout file (e.g., `resources/views/components/layouts/app.blade.php`):

1. Add `@vite()` directive in the `<head>` to load your JavaScript
2. Replace `@livewireScripts` with `@livewireScriptConfig`

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ $title ?? 'My App' }}</title>

        @livewireStyles
        @vite(['resources/css/app.css', 'resources/js/app.ts'])
    </head>
    <body>
        {{ $slot }}

        @livewireScriptConfig
    </body>
</html>
```

> **Note:** `@livewireScriptConfig` tells Livewire that you're manually bundling its assets, preventing automatic script injection.

## 3. Install JavaScript Dependencies

Add the required dependencies for React and TypeScript:

```bash
npm install react react-dom @vitejs/plugin-react
npm install -D typescript @types/react @types/react-dom
```

## 4. Configure TypeScript

Create a `tsconfig.json` in your project root with path aliases for LivewireMesh:

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "strict": true,
        "jsx": "react-jsx",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "allowImportingTsExtensions": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["resources/js/*"],
            "@livewiremesh/*": ["vendor/ethanbarlo/livewiremesh/resources/js/*"]
        }
    },
    "include": [
        "resources/js/**/*.ts",
        "resources/js/**/*.tsx",
        "vendor/ethanbarlo/livewiremesh/resources/js/**/*.ts",
        "vendor/ethanbarlo/livewiremesh/resources/js/**/*.tsx"
    ],
    "exclude": ["node_modules"]
}
```

## 5. Configure Vite

Update your `vite.config.js` to include the React plugin and path aliases:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.ts',
                // Add your React component entry points here
                // 'resources/js/components/MyComponent.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@livewiremesh': path.resolve(__dirname, 'vendor/ethanbarlo/livewiremesh/resources/js'),
        },
    },
});
```

## 6. Initialize LivewireMesh

Rename `resources/js/app.js` to `resources/js/app.ts` and initialize LivewireMesh:

```typescript
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import initLivewireMesh from '@livewiremesh/initLivewireMesh';
import reactRenderer from '@livewiremesh/react/renderer';

// Initialize LivewireMesh with configuration
initLivewireMesh(Livewire, {
    renderers: [reactRenderer],
    maxRenderAttempts: 100,
    renderDelay: 50,
    debug: false, // Set to true for development
});

// Start Livewire (which also starts Alpine)
Livewire.start();
```

## 7. Create Your First Mesh Component

### PHP Component

Create a Livewire component that extends `MeshComponent`:

```php
<?php

namespace App\Livewire;

use EthanBarlo\LivewireMesh\MeshComponent;
use Livewire\Attributes\Modelable;

class MyReactComponent extends MeshComponent
{
    #[Modelable]
    public string $value = '';

    public function component(): string
    {
        return 'resources/js/components/MyReactComponent.tsx';
    }

    public function props(): array
    {
        return [
            'value' => $this->value,
        ];
    }
}
```

### React Component

Create the corresponding React component at `resources/js/components/MyReactComponent.tsx`:

```tsx
import React from "react";
import { useWire } from "@livewiremesh/react/contexts/LivewireContext";
import registerMeshComponent from "@livewiremesh/registerMeshComponent";

interface MyReactComponentProps {
    value: string;
}

const MyReactComponent: React.FC<MyReactComponentProps> = ({ value }) => {
    const $wire = useWire();

    return (
        <div>
            <p>Value: {value}</p>
            <button onClick={() => $wire.$set('value', 'new value', true)}>
                Update Value
            </button>
        </div>
    );
};

// Register the component with LivewireMesh
registerMeshComponent("react", "resources/js/components/MyReactComponent.tsx", MyReactComponent);

export default MyReactComponent;
```

### Add to Vite Config

Don't forget to add the component to your Vite input array:

```javascript
input: [
    'resources/css/app.css',
    'resources/js/app.ts',
    'resources/js/components/MyReactComponent.tsx',
],
```

### Use in Blade

```blade
<livewire:my-react-component wire:model.live="someValue" />
```

## Available Hooks

LivewireMesh provides several hooks for interacting with Livewire from React:

### `useWire()`

Access the Livewire `$wire` object directly:

```tsx
import { useWire } from "@livewiremesh/react/contexts/LivewireContext";

const MyComponent = () => {
    const $wire = useWire();

    // Call Livewire methods
    $wire.$call('methodName', arg1, arg2);

    // Set properties
    $wire.$set('property', value, live);

    // Get properties
    const value = $wire.$get('property');

    // Refresh the component
    $wire.$refresh();
};
```

### `useEntangle()`

Create two-way bindings between React state and Livewire properties:

```tsx
import { useEntangle } from "@livewiremesh/react/contexts/LivewireContext";

const MyComponent = () => {
    // Live updates (syncs immediately)
    const [value, setValue] = useEntangle<string>('value');

    // Deferred updates (syncs on next Livewire request)
    const [value, setValue] = useEntangle<string>('value', false);

    return (
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};
```

## Troubleshooting

### Component not rendering

1. Ensure your React component is registered with `registerMeshComponent()`
2. Check that the component path in `component()` matches exactly
3. Verify the component is added to Vite's input array
4. Check browser console for errors

### Livewire not starting

1. Ensure you're using `@livewireScriptConfig` instead of `@livewireScripts`
2. Verify `Livewire.start()` is called in your app.ts
3. Check that Livewire ESM import path is correct

### TypeScript errors

1. Ensure tsconfig.json paths are configured correctly
2. Run `npm install` to ensure all type definitions are installed

## Demo Application

For a complete working example, see the `/demo` directory in the repository. To run the demo:

```bash
cd demo
composer install
npm install
npm run dev

# In another terminal
php artisan serve
```

Visit `http://localhost:8000` to see the demo.
