<?php

namespace EthanBarlo\LivewireMesh\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \EthanBarlo\Mesh\Mesh
 */
class LivewireMesh extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \EthanBarlo\LivewireMesh\LivewireMesh::class;
    }
}
