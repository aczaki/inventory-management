<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Elektronik',
            'Laptop',
            'Monitor',
            'Keyboard',
            'Mouse',
            'Printer',
            'Networking',
            'Storage',
            'Aksesoris',
            'Office',
        ]);

        return [
            'parent_id' => null,
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(),
        ];
    }
}