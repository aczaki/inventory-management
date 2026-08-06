<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['code' => 'PCS', 'name' => 'Pieces'],
            ['code' => 'BOX', 'name' => 'Box'],
            ['code' => 'PACK', 'name' => 'Pack'],
            ['code' => 'KG', 'name' => 'Kilogram'],
            ['code' => 'GRAM', 'name' => 'Gram'],
            ['code' => 'LITER', 'name' => 'Liter'],
            ['code' => 'METER', 'name' => 'Meter'],
            ['code' => 'ROLL', 'name' => 'Roll'],
            ['code' => 'SET', 'name' => 'Set'],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['code' => $unit['code']],
                [
                    'name' => $unit['name'],
                    'description' => null,
                ]
            );
        }
    }
}