<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductSupplier;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductSupplierFactory extends Factory
{
    protected $model = ProductSupplier::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'supplier_id' => Supplier::factory(),

            'supplier_sku' => fake()->numerify('SUPSKU#####'),

            'last_purchase_price' => fake()->numberBetween(10000, 500000),

            'is_primary' => true,
        ];
    }
}