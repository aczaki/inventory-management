<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'product_id' => $this->product_id,

            'supplier_id' => $this->supplier_id,

            'supplier_sku' => $this->supplier_sku,

            'last_purchase_price' =>
                $this->last_purchase_price,

            'is_primary' => $this->is_primary,

            'supplier' => SupplierResource::make(
                $this->whenLoaded('supplier')
            ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}