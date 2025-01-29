<?php

namespace EthanBarlo\Mesh;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;
use EthanBarlo\Mesh\Commands\MeshCommand;

class MeshServiceProvider extends PackageServiceProvider
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
            ->hasMigration('create_livewiremesh_table')
            ->hasCommand(MeshCommand::class);
    }
}
