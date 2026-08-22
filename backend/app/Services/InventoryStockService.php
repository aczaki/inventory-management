<?php

namespace App\Services;

use App\Models\InventoryStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryStockService
{
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
        int $quantity
    ): InventoryStock {
        if ($quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => [
                    'Quantity stock in harus lebih besar dari 0.',
                ],
            ]);
        }

        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity
        ) {
            $stock = InventoryStock::query()
                ->where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->first();

            if ($stock) {
                $stock->increment(
                    'quantity',
                    $quantity
                );

                return $stock->fresh();
            }

            return InventoryStock::create([
                'product_id' => $productId,
                'warehouse_id' => $warehouseId,
                'quantity' => $quantity,
            ]);
        });
    }

    public function stockOut(
        int $productId,
        int $warehouseId,
        int $quantity
    ): InventoryStock {
        if ($quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => [
                    'Quantity stock out harus lebih besar dari 0.',
                ],
            ]);
        }

        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity
        ) {
            $stock = InventoryStock::query()
                ->where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                throw ValidationException::withMessages([
                    'quantity' => [
                        'Stock product di warehouse belum tersedia.',
                    ],
                ]);
            }

            if ($stock->quantity < $quantity) {
                throw ValidationException::withMessages([
                    'quantity' => [
                        'Stock tidak mencukupi.',
                    ],
                ]);
            }

            $stock->decrement(
                'quantity',
                $quantity
            );

            return $stock->fresh();
        });
    }

    public function adjustment(
        int $productId,
        int $warehouseId,
        int $quantity
    ): InventoryStock {
        if ($quantity < 0) {
            throw ValidationException::withMessages([
                'quantity' => [
                    'Quantity adjustment tidak boleh negatif.',
                ],
            ]);
        }

        return DB::transaction(function () use (
            $productId,
            $warehouseId,
            $quantity
        ) {
            return InventoryStock::updateOrCreate(
                [
                    'product_id' => $productId,
                    'warehouse_id' => $warehouseId,
                ],
                [
                    'quantity' => $quantity,
                ]
            );
        });
    }
}