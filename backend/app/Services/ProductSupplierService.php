<?php

namespace App\Services;

use App\DTOs\ProductSupplier\ProductSupplierData;
use App\Models\Product;
use App\Models\ProductSupplier;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductSupplierService
{
    public function getSuppliers(
        Product $product
    ): Collection {
        return $product
            ->suppliers()
            ->get();
    }

    public function attach(
        Product $product,
        Supplier $supplier,
        ProductSupplierData $data
    ): ProductSupplier {
        return DB::transaction(function () use (
            $product,
            $supplier,
            $data
        ) {
            $exists = ProductSupplier::query()
                ->where('product_id', $product->id)
                ->where('supplier_id', $supplier->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'supplier_id' => [
                        'Supplier sudah terhubung dengan product ini.',
                    ],
                ]);
            }

            if ($data->isPrimary) {
                $this->removePrimary(
                    $product->id
                );
            }

            return ProductSupplier::create([
                'product_id' => $product->id,
                'supplier_id' => $supplier->id,
                'supplier_sku' => $data->supplierSku,
                'last_purchase_price' =>
                    $data->lastPurchasePrice,
                'is_primary' => $data->isPrimary,
            ]);
        });
    }

    public function update(
        Product $product,
        Supplier $supplier,
        ProductSupplierData $data
    ): ProductSupplier {
        return DB::transaction(function () use (
            $product,
            $supplier,
            $data
        ) {
            $pivot = ProductSupplier::query()
                ->where('product_id', $product->id)
                ->where('supplier_id', $supplier->id)
                ->firstOrFail();

            if ($data->isPrimary) {
                $this->removePrimary(
                    $product->id,
                    $pivot->id
                );
            }

            $pivot->update([
                'supplier_sku' => $data->supplierSku,
                'last_purchase_price' =>
                    $data->lastPurchasePrice,
                'is_primary' => $data->isPrimary,
            ]);

            return $pivot->fresh();
        });
    }

    public function detach(
        Product $product,
        Supplier $supplier
    ): void {
        ProductSupplier::query()
            ->where('product_id', $product->id)
            ->where('supplier_id', $supplier->id)
            ->delete();
    }

    protected function removePrimary(
        int $productId,
        ?int $exceptId = null
    ): void {
        $query = ProductSupplier::query()
            ->where('product_id', $productId)
            ->where('is_primary', true);

        if ($exceptId !== null) {
            $query->where('id', '!=', $exceptId);
        }

        $query->update([
            'is_primary' => false,
        ]);
    }
}