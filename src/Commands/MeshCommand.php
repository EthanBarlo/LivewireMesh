<?php

namespace EthanBarlo\LivewireMesh\Commands;

use Illuminate\Console\Command;

class LivewireMeshCommand extends Command
{
    public $signature = 'livewiremesh';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
