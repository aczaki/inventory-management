<?php

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    protected $model = Unit::class;

    public function definition(): array
    {
        return [
            'code' => fake()->unique()->randomElement([
                'PCS',
                'BOX',
                'PACK',
                'KG',
                'GRAM',
                'LITER',
                'METER',
                'ROLL',
                'SET',
            ]),
            'name' => fake()->word(),
            'description' => fake()->optional()->sentence(),
        ];
    }
}