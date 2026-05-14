@php
    $meshComponentPath = $this->component();
    try {
        $meshAssetUrl = app(\Illuminate\Foundation\Vite::class)->asset($meshComponentPath);
    } catch (\Throwable $e) {
        $meshAssetUrl = null;
    }
@endphp

@assets
    @vite($meshComponentPath)
@endassets

<div
    data-mesh-component="{{ $meshComponentPath }}"
    data-mesh-props="{{ json_encode($this->props()) }}"
    @if ($meshAssetUrl) data-mesh-asset="{{ $meshAssetUrl }}" @endif
>
    <div wire:ignore class="mesh-root"></div>
</div>
