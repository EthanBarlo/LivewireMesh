import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import path from 'path';
import { glob } from 'glob';
import { livewireMeshPlugin } from './vendor/ethanbarlo/livewiremesh/resources/js/vite-plugin';

// Auto-discover LivewireMesh components
const livewireComponents = glob.sync('resources/js/livewire/**/*.{tsx,jsx}');

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.ts',
                ...livewireComponents,
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(),
        livewireMeshPlugin({
            componentsDir: 'resources/js/livewire',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@livewiremesh': path.resolve(__dirname, 'vendor/ethanbarlo/livewiremesh/resources/js'),
        },
    },
    server: {
        cors: true,
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
