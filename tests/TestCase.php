<?php

namespace EthanBarlo\Mesh\Tests;

use EthanBarlo\Mesh\MeshServiceProvider;
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
            MeshServiceProvider::class,
        ];
    }

    public function getEnvironmentSetUp($app) {}
}
