@assets
    @vite($this->component())
@endassets

<div data-mesh-component="{{ $this->component() }}" data-mesh-props="{{ json_encode($this->props()) }}">
    <div wire:ignore class="mesh-root"></div>
</div>
