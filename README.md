# Livewire Mesh

[![Latest Version on Packagist](https://img.shields.io/packagist/v/ethanbarlo/livewiremesh.svg?style=flat-square)](https://packagist.org/packages/ethanbarlo/livewiremesh)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/ethanbarlo/livewiremesh/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/ethanbarlo/livewiremesh/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/ethanbarlo/livewiremesh/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/ethanbarlo/livewiremesh/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/ethanbarlo/livewiremesh.svg?style=flat-square)](https://packagist.org/packages/ethanbarlo/livewiremesh)

LivewireMesh is a powerful package that enables seamless integration of React components within Laravel Livewire applications. Inspired by [MingleJS](https://github.com/ijpatricio/mingle), LivewireMesh takes the concept further by building directly into Livewire's core functionality rather than relying on AlpineJS as an intermediary.

## Key Features

- **Native Livewire Integration**: Built directly on top of Livewire's hooks system for better performance and reliability
- **Reactive Props**: React components automatically update when Livewire properties change
- **Two-way Data Binding**: Use the `useEntangle` hook to create bidirectional bindings between React state and Livewire properties
- **Live/Deferred Updates**: Choose between live or deferred updates when using entangled properties
- **Direct Wire Access**: Access Livewire methods and properties directly through the `useWire` hook


## Installation

You can install the package via composer:

```bash
composer require ethanbarlo/livewiremesh
```

## Documentation
A full documentation and demo site is in the works.


## Example Usage: React-Controlled Inputs

LivewireMesh allows you to create React components that can be used as Livewire form inputs using `wire:model`. Here's how to create a custom React Select component that integrates seamlessly with Livewire:

1. Generic Livewire Controlled Page
`Controller`
```php
use Livewire\Component;

class UserProfile extends Component
{
    public ?string $country = null;

    public function save()
    {
        $this->validate([
            'country' => 'required|string'
        ]);
    }

    public function countries(): array
    {
        return [
            ['value' => 'us', 'label' => 'United States'],
            ['value' => 'uk', 'label' => 'United Kingdom'],
            ['value' => 'ca', 'label' => 'Canada'],
        ];
    }

    public function render()
    {
        return view('livewire.user-profile');
    }
}
```

`View`
```blade
<div>
    <form wire:submit.prevent="save">
        <div>
            <label>Select your country:</label>
            <livewire:react-select wire:model="country" :options="$this->countries()" />
            @error('country')
                <div class="text-red-500 text-sm mt-1">{{ $message }}</div>
            @enderror
        </div>
        <button type="submit">Save</button>
    </form>
</div>
```
* One thing to note, is that you can use either 'wire:model' or 'wire:model.live'. Without needing to make any changes to the LivewireMesh component.


2. The LivewireMesh / React component

`Controller`
```php
use EthanBarlo\LivewireMesh\MeshComponent;
use Livewire\Attributes\Modelable;

class ReactSelect extends MeshComponent
{
    #[Modelable]
    public string $value = '';

    public function __construct(
        public array $options
    ) {}

    public function component(): string
    {
        return 'resources/js/components/ReactSelect/index.ts';
    }

    public function props(): array
    {
        return [
            'options' => $this->options,
        ];
    }
}
```

`View`
```tsx
import { useEntangle } from '@livewiremesh/react/contexts/LivewireContext';
import Select, { type SelectOption } from 'custom-select-component'; // Example

interface IReactSelect{
    options: SelectOption[];
}
const ReactSelect: React.FC<IReactSelect> = ({ options }) => {
    const [value, setValue] = useEntangle<string>('value');

    return (
        <Select value={value} onChange={setValue} options={options} />
    );
}
```

This example demonstrates how LivewireMesh enables you to:
- Use React components as form inputs with `wire:model`
- Handle two-way data binding between React and Livewire
- Create reusable React components that work seamlessly within Livewire forms
- Maintain a reactive connection between your React state and Livewire properties



## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Testing

```bash
composer test
```

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Ethan Barlow](https://github.com/EthanBarlo)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
