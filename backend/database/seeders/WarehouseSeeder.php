<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        Warehouse::factory()->create([
            'code' => 'WH001',
            'name' => 'Gudang Utama',
        ]);

        Warehouse::factory()->create([
            'code' => 'WH002',
            'name' => 'Gudang Cabang',
        ]);
    }
}