<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockAdjustmentRequest;
use App\Http\Requests\StockInRequest;
use App\Http\Requests\StockOutRequest;
use App\Http\Resources\InventoryStockResource;
use App\Models\InventoryStock;
use App\Services\InventoryStockService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class InventoryStockController extends Controller
{
    public function __construct(
        protected InventoryStockService $service
    ) {
    }

    public function show(
        int $product,
        int $warehouse
    ): JsonResponse {
        $stock = $this->service->getStock(
            $product,
            $warehouse
        );

        $stock->load([
            'product',
            'warehouse',
        ]);

        return ApiResponse::success(
            InventoryStockResource::make($stock),
            'Stock retrieved successfully.'
        );
    }

    public function stockIn(
        StockInRequest $request
    ): JsonResponse {
        $stock = $this->service->stockIn(
            $request->integer('product_id'),
            $request->integer('warehouse_id'),
            $request->integer('quantity')
        );

        $stock->load([
            'product',
            'warehouse',
        ]);

        return ApiResponse::success(
            InventoryStockResource::make($stock),
            'Stock added successfully.'
        );
    }

    public function stockOut(
        StockOutRequest $request
    ): JsonResponse {
        $stock = $this->service->stockOut(
            $request->integer('product_id'),
            $request->integer('warehouse_id'),
            $request->integer('quantity')
        );

        $stock->load([
            'product',
            'warehouse',
        ]);

        return ApiResponse::success(
            InventoryStockResource::make($stock),
            'Stock reduced successfully.'
        );
    }

    public function adjustment(
        StockAdjustmentRequest $request
    ): JsonResponse {
        $stock = $this->service->adjustment(
            $request->integer('product_id'),
            $request->integer('warehouse_id'),
            $request->integer('quantity')
        );

        $stock->load([
            'product',
            'warehouse',
        ]);

        return ApiResponse::success(
            InventoryStockResource::make($stock),
            'Stock adjusted successfully.'
        );
    }
}