<?php

namespace EthanBarlo\LivewireMesh;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Livewire\Component as LivewireComponent;

abstract class MeshComponent extends LivewireComponent
{
    abstract public function component(): string;

    abstract public function props(): array;

    /**
     * Whether to prerender this specific component.
     * Override in child classes to disable prerendering for specific components.
     */
    public function shouldPrerender(): bool
    {
        return config('livewiremesh.prerender.enabled', false);
    }

    /**
     * Get prerendered HTML from the Node.js prerender server.
     * Returns empty string if prerendering fails or is disabled.
     */
    public function getPrerenderHtml(): string
    {
        if (! $this->shouldPrerender()) {
            return '';
        }

        $componentName = $this->component();
        $props = $this->props();

        // Check cache first
        if (config('livewiremesh.prerender.cache.enabled', false)) {
            $cacheKey = $this->getPrerenderCacheKey($componentName, $props);
            $cached = Cache::get($cacheKey);

            if ($cached !== null) {
                return $cached;
            }
        }

        try {
            $html = $this->fetchPrerenderHtml($componentName, $props);

            // Cache the result
            if (config('livewiremesh.prerender.cache.enabled', false) && $html !== '') {
                $ttl = config('livewiremesh.prerender.cache.ttl', 3600);
                Cache::put($cacheKey, $html, $ttl);
            }

            return $html;
        } catch (\Exception $e) {
            Log::warning('LivewireMesh prerender failed', [
                'component' => $componentName,
                'error' => $e->getMessage(),
            ]);

            $fallback = config('livewiremesh.prerender.fallback', 'empty');

            if ($fallback === 'error') {
                throw $e;
            }

            return '';
        }
    }

    /**
     * Fetch prerendered HTML from the Node.js server.
     */
    protected function fetchPrerenderHtml(string $componentName, array $props): string
    {
        $serverUrl = config('livewiremesh.prerender.server_url', 'http://localhost:3001');
        $timeout = config('livewiremesh.prerender.timeout', 5);

        $response = Http::timeout($timeout)
            ->post("{$serverUrl}/render", [
                'component' => $componentName,
                'props' => $props,
            ]);

        if (! $response->successful()) {
            $error = $response->json('error', 'Unknown error');
            throw new \RuntimeException("Prerender server error: {$error}");
        }

        return $response->json('html', '');
    }

    /**
     * Generate a cache key for prerendered HTML.
     */
    protected function getPrerenderCacheKey(string $componentName, array $props): string
    {
        $propsHash = md5(json_encode($props));

        return "livewiremesh:prerender:{$componentName}:{$propsHash}";
    }

    public function render()
    {
        return view()->file($this->getMeshViewPath());
    }

    /**
     * Returns the path to a unique Blade view file for this MeshComponent class.
     * Livewire deduplicates '@assets' by view file, so this ensures each MeshComponent
     * instance gets its own view and assets are loaded correctly for every component type.
     */
    protected function getMeshViewPath(): string
    {
        $componentClass = str_replace('\\', '_', static::class);
        $viewFile = storage_path("framework/views/mesh-{$componentClass}.blade.php");

        if (! file_exists($viewFile)) {
            // Copy the MeshComponent view file from the package's published view path
            $packageViewPath = base_path('vendor/ethanbarlo/livewiremesh/resources/views/livewire/component.blade.php');
            file_put_contents(
                $viewFile,
                file_get_contents($packageViewPath)
            );
        }

        return $viewFile;
    }
}
