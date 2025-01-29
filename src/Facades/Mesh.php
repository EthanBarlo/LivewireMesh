<?php

namespace EthanBarlo\Mesh\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \EthanBarlo\Mesh\Mesh
 */
class Mesh extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \EthanBarlo\Mesh\Mesh::class;
    }
}
