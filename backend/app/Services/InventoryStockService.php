<?php

namespace App\Services;

use App\Models\InventoryStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Services\InventoryTransactionService;

class InventoryStockService
{
    public function __construct(
        protected InventoryTransactionService $transactionService
    ) {
    }

    public function getStock(
        int $productId,
        int $warehouseId
    ): InventoryStock {
        return InventoryStock::query()
            ->where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->firstOrFail();
    }

    public function stockIn(
    int $productId,
    int $warehouseId,
    int $quantity,
    array $transactionData = []
    ): InventoryStock {
        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity,
            $transactionData
        ) {
            $stock = InventoryStock::query()
                ->where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                $stock = InventoryStock::create([
                    'product_id' => $productId,
                    'warehouse_id' => $warehouseId,
                    'quantity' => 0,
                ]);
            }

            $stock->increment('quantity', $quantity);

            $this->transactionService->create([
                'type' => 'in',
                'warehouse_id' => $warehouseId,
                'customer_id' => $transactionData['customer_id'] ?? null,
                'user_id' => $transactionData['user_id'] ?? auth()->id(),
                'reference_type' => 'purchase',
                'reference_number' => $transactionData['reference_number'] ?? null,
                'notes' => $transactionData['notes'] ?? null,
                'transaction_date' => $transactionData['transaction_date'] ?? now(),
            ]);

            return $stock->fresh();
        });
    }

    public function stockOut(
    int $productId,
    int $warehouseId,
    int $quantity,
    array $transactionData = []
    ): InventoryStock {
        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity,
            $transactionData
        ) {
            $stock = InventoryStock::query()
                ->where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                throw new \RuntimeException(
                    'Stock produk di warehouse tersebut belum tersedia.'
                );
            }

            if ($stock->quantity < $quantity) {
                throw new \RuntimeException(
                    'Stock tidak mencukupi.'
                );
            }

            $stock->decrement('quantity', $quantity);

            $this->transactionService->create([
                'type' => 'out',
                'warehouse_id' => $warehouseId,
                'customer_id' => $transactionData['customer_id'] ?? null,
                'user_id' => $transactionData['user_id'] ?? auth()->id(),
                'reference_type' => 'sales',
                'reference_number' => $transactionData['reference_number'] ?? null,
                'notes' => $transactionData['notes'] ?? null,
                'transaction_date' => $transactionData['transaction_date'] ?? now(),
            ]);

            return $stock->fresh();
        });
    }

    public function adjustment(
    int $productId,
    int $warehouseId,
    int $quantity,
    array $transactionData = []
    ): InventoryStock {
        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity,
            $transactionData
        ) {
            $stock = InventoryStock::query()
                ->where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                $stock = InventoryStock::create([
                    'product_id' => $productId,
                    'warehouse_id' => $warehouseId,
                    'quantity' => 0,
                ]);
            }

            $stock->update([
                'quantity' => $quantity,
            ]);

            $this->transactionService->create([
                'type' => 'adjustment',
                'warehouse_id' => $warehouseId,
                'customer_id' => $transactionData['customer_id'] ?? null,
                'user_id' => $transactionData['user_id'] ?? auth()->id(),
                'reference_type' => $transactionData['reference_type'] ?? 'adjustment',
                'reference_number' => $transactionData['reference_number'] ?? null,
                'notes' => $transactionData['notes'] ?? null,
                'transaction_date' => $transactionData['transaction_date'] ?? now(),
            ]);

            return $stock->fresh();
        });
    }
}