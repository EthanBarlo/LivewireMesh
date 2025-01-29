<?php

namespace EthanBarlo\LivewireMesh;

use Livewire\Component as LivewireComponent;

abstract class MeshComponent extends LivewireComponent
{
    abstract public function component(): string;

    abstract public function props(): array;

    public function render()
    {
        return view('mesh::livewire.component');
    }
}
