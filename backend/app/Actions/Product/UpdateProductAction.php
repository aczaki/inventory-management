<?php

namespace App\Actions\Product;

use App\DTOs\Product\ProductData;
use App\Models\Product;
use App\Services\ProductService;

class UpdateProductAction
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    public function execute(
        Product $product,
        ProductData $data
    ): Product {
        return $this->productService->update(
            $product,
            $data
        );
    }
}