<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Services\ProductService;

class DeleteProductAction
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    public function execute(Product $product): void
    {
        $this->productService->delete($product);
    }
}