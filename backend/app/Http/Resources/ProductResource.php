<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'sku' => $this->sku,

            'barcode' => $this->barcode,

            'name' => $this->name,

            'description' => $this->description,

            'default_purchase_price' => (float) $this->default_purchase_price,

            'selling_price' => (float) $this->selling_price,

            'minimum_stock' => $this->minimum_stock,

            'status' => $this->status,

            'image' => $this->image,

            'image_url' => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],

            'unit' => [
                'id' => $this->unit?->id,
                'name' => $this->unit?->name,
                'code' => $this->unit?->code,
            ],

            'created_at' => $this->created_at?->toISOString(),

            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}