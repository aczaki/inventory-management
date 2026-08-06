<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $purchasePrice = fake()->numberBetween(10000, 500000);

        return [
            'category_id' => Category::factory(),
            'unit_id' => Unit::factory(),

            'sku' => fake()->unique()->numerify('PRD#####'),

            'barcode' => fake()->optional()->ean13(),

            'name' => fake()->words(3, true),

            'description' => fake()->sentence(),

            'default_purchase_price' => $purchasePrice,

            'selling_price' => $purchasePrice + fake()->numberBetween(5000, 50000),

            'minimum_stock' => fake()->numberBetween(5, 30),

            'image' => null,

            'status' => 'active',
        ];
    }
}