<?php

namespace EthanBarlo\LivewireMesh\Tests;

use EthanBarlo\LivewireMesh\LivewireMeshServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    protected function getPackageProviders($app)
    {
        return [
            LivewireMeshServiceProvider::class,
        ];
    }

    public function getEnvironmentSetUp($app) {}
}
