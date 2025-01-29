<?php

namespace EthanBarlo\LivewireMesh;

use EthanBarlo\LivewireMesh\Commands\LivewireMeshCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class LivewireMeshServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('livewiremesh')
            ->hasConfigFile()
            ->hasViews()
            ->hasCommand(LivewireMeshCommand::class);
    }
}
