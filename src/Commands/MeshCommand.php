<?php

namespace EthanBarlo\Mesh\Commands;

use Illuminate\Console\Command;

class MeshCommand extends Command
{
    public $signature = 'livewiremesh';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
