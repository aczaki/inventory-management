<?php

namespace App\Http\Controllers\Api;

use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\RestoreProductAction;
use App\Actions\Product\UpdateProductAction;
use App\DTOs\Product\ProductData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected CreateProductAction $createProductAction,
        protected UpdateProductAction $updateProductAction,
        protected DeleteProductAction $deleteProductAction,
        protected RestoreProductAction $restoreProductAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->paginate(
            $request->only([
                'search',
                'category_id',
                'status',
                'sort_by',
                'sort_direction',
                'per_page',
            ])
        );

        return ApiResponse::success(
            ProductResource::collection($products),
            'Products retrieved successfully.'
        );
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = ProductData::fromRequest($request);

        $product = $this->createProductAction->execute($data);

        return ApiResponse::success(
            ProductResource::make($product),
            'Product created successfully.',
            201
        );
    }

    public function show(Product $product): JsonResponse
    {
        $product = $this->productService->find($product);

        return ApiResponse::success(
            ProductResource::make($product),
            'Product retrieved successfully.'
        );
    }

    public function update(
        UpdateProductRequest $request,
        Product $product
    ): JsonResponse {
        $data = ProductData::fromRequest($request);

        $product = $this->updateProductAction->execute(
            $product,
            $data
        );

        return ApiResponse::success(
            ProductResource::make($product),
            'Product updated successfully.'
        );
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->deleteProductAction->execute($product);

        return ApiResponse::success(
            null,
            'Product deleted successfully.'
        );
    }

    public function restore(int $id): JsonResponse
    {
        $product = $this->restoreProductAction->execute($id);

        return ApiResponse::success(
            ProductResource::make($product),
            'Product restored successfully.'
        );
    }
}