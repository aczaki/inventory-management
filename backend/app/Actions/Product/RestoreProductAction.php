<?php

namespace App\Actions\Product;

use App\Models\Product;
use App\Services\ProductService;

class RestoreProductAction
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    public function execute(int $id): Product
    {
        return $this->productService->restore($id);
    }
}