<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ProductSupplier\ProductSupplierData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductSupplierRequest;
use App\Http\Requests\UpdateProductSupplierRequest;
use App\Http\Resources\ProductSupplierResource;
use App\Models\Product;
use App\Models\Supplier;
use App\Services\ProductSupplierService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProductSupplierController extends Controller
{
    public function __construct(
        protected ProductSupplierService $service
    ) {
    }

    public function index(
        Product $product
    ): JsonResponse {
        $suppliers = $this->service
            ->getSuppliers($product);

        return ApiResponse::success(
            ProductSupplierResource::collection(
                $suppliers
            ),
            'Product suppliers retrieved successfully.'
        );
    }

    public function store(
        StoreProductSupplierRequest $request,
        Product $product
    ): JsonResponse {
        $supplier = Supplier::findOrFail(
            $request->integer('supplier_id')
        );

        $data = ProductSupplierData::fromRequest(
            $request
        );

        $productSupplier = $this->service->attach(
            $product,
            $supplier,
            $data
        );

        $productSupplier->load('supplier');

        return ApiResponse::success(
            ProductSupplierResource::make(
                $productSupplier
            ),
            'Supplier attached to product successfully.',
            201
        );
    }

    public function update(
        UpdateProductSupplierRequest $request,
        Product $product,
        Supplier $supplier
    ): JsonResponse {
        $data = ProductSupplierData::fromRequest(
            $request
        );

        $productSupplier = $this->service->update(
            $product,
            $supplier,
            $data
        );

        $productSupplier->load('supplier');

        return ApiResponse::success(
            ProductSupplierResource::make(
                $productSupplier
            ),
            'Product supplier updated successfully.'
        );
    }

    public function destroy(
        Product $product,
        Supplier $supplier
    ): JsonResponse {
        $this->service->detach(
            $product,
            $supplier
        );

        return ApiResponse::success(
            null,
            'Supplier detached from product successfully.'
        );
    }
}