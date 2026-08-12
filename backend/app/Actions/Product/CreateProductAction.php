<?php

namespace App\Actions\Product;

use App\DTOs\Product\ProductData;
use App\Models\Product;
use App\Services\ProductService;

class CreateProductAction
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    public function execute(ProductData $data): Product
    {
        return $this->productService->store($data);
    }
}