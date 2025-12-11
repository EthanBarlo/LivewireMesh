@assets
    @vite($this->getResolvedComponent())
@endassets

@php
    $prerenderHtml = $this->getPrerenderHtml();
    $isPrerendered = !empty($prerenderHtml);
@endphp

<div 
    data-mesh-component="{{ $this->component() }}" 
    data-mesh-props="{{ json_encode($this->props()) }}"
    @if($isPrerendered) data-mesh-prerendered="true" @endif
>
    <div wire:ignore class="mesh-root">{!! $prerenderHtml !!}</div>
</div>
