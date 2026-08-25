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
        protected InventoryStockService $inventoryStockService
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
        $stock = $this->inventoryStockService->stockIn(
            productId: $request->integer('product_id'),
            warehouseId: $request->integer('warehouse_id'),
            quantity: $request->integer('quantity'),
            transactionData: [
                'reference_type' => 'stock_in',
                'reference_number' => $request->input('reference_number'),
                'notes' => $request->input('notes'),
            ],
        );

        return response()->json([
            'message' => 'Stock berhasil ditambahkan.',
            'data' => new InventoryStockResource($stock),
        ]);
    }

   public function stockOut(
    StockOutRequest $request
    ): JsonResponse {
        $stock = $this->inventoryStockService->stockOut(
            productId: $request->integer('product_id'),
            warehouseId: $request->integer('warehouse_id'),
            quantity: $request->integer('quantity'),
            transactionData: [
                'customer_id' => $request->input('customer_id'),
                'reference_type' => 'stock_out',
                'reference_number' => $request->input('reference_number'),
                'notes' => $request->input('notes'),
            ],
        );

        return response()->json([
            'message' => 'Stock berhasil dikeluarkan.',
            'data' => new InventoryStockResource($stock),
        ]);
    }

    public function adjustment(
    StockAdjustmentRequest $request
    ): JsonResponse {
        $stock = $this->inventoryStockService->adjustment(
            productId: $request->integer('product_id'),
            warehouseId: $request->integer('warehouse_id'),
            quantity: $request->integer('quantity'),
            transactionData: [
                'reference_type' => 'adjustment',
                'reference_number' => $request->input('reference_number'),
                'notes' => $request->input('notes'),
            ],
        );

        return response()->json([
            'message' => 'Stock berhasil disesuaikan.',
            'data' => new InventoryStockResource($stock),
        ]);
    }
}