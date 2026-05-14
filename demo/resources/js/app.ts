import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import initLivewireMesh from '@livewiremesh/initLivewireMesh';
import reactRenderer from '@livewiremesh/react/renderer';

// Initialize LivewireMesh with configuration
initLivewireMesh(Livewire, {
    renderers: [reactRenderer],
    debug: true,
});

// Start Livewire (which also starts Alpine)
Livewire.start();
