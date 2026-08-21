<?php

namespace App\DTOs\ProductSupplier;

use Illuminate\Http\Request;

readonly class ProductSupplierData
{
    public function __construct(
        public ?int $supplierId,
        public ?string $supplierSku,
        public float $lastPurchasePrice,
        public bool $isPrimary,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            supplierId: $request->input('supplier_id'),
            supplierSku: $request->input('supplier_sku'),
            lastPurchasePrice: (float) $request->input(
                'last_purchase_price'
            ),
            isPrimary: (bool) $request->input('is_primary'),
        );
    }

    public function toArray(): array
    {
        return [
            'supplier_sku' => $this->supplierSku,
            'last_purchase_price' => $this->lastPurchasePrice,
            'is_primary' => $this->isPrimary,
        ];
    }
}