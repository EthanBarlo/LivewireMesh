<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('components.layouts.app')]
#[Title('LivewireMesh Demo')]
class DemoPage extends Component
{
    public function render()
    {
        return view('livewire.demo-page');
    }
}
