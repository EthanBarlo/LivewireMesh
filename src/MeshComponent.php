<?php

namespace EthanBarlo\LivewireMesh;

use Livewire\Component as LivewireComponent;

abstract class MeshComponent extends LivewireComponent
{
    abstract public function component(): string;

    abstract public function props(): array;

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
        $packageViewPath = base_path('vendor/ethanbarlo/livewiremesh/resources/views/livewire/component.blade.php');

        // Refresh when the package view is newer than the cached copy so
        // package updates propagate without a manual cache clear.
        if (! file_exists($viewFile) || filemtime($packageViewPath) > filemtime($viewFile)) {
            file_put_contents(
                $viewFile,
                file_get_contents($packageViewPath)
            );
        }

        return $viewFile;
    }
}
