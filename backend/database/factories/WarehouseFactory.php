<?php

namespace Database\Factories;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->numerify('WH###'),
            'name' => 'Gudang ' . fake()->city(),
            'address' => fake()->address(),
            'description' => fake()->sentence(),
            'status' => 'active',
        ];
    }
}