<?php

namespace App\Livewire;

use EthanBarlo\LivewireMesh\MeshComponent;
use Livewire\Attributes\Modelable;

class ReactCounter extends MeshComponent
{
    #[Modelable]
    public int $count = 0;

    public function component(): string
    {
        return 'resources/js/components/Counter.tsx';
    }

    public function props(): array
    {
        return [
            'initialCount' => $this->count,
        ];
    }
}
