<?php

namespace App\DTOs\Product;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

readonly class ProductData
{
    public function __construct(
        public int $categoryId,
        public int $unitId,
        public string $sku,
        public ?string $barcode,
        public string $name,
        public ?string $description,
        public float $defaultPurchasePrice,
        public float $sellingPrice,
        public int $minimumStock,
        public string $status,
        public ?UploadedFile $image,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            categoryId: (int) $request->category_id,
            unitId: (int) $request->unit_id,
            sku: $request->sku,
            barcode: $request->barcode,
            name: $request->name,
            description: $request->description,
            defaultPurchasePrice: (float) $request->default_purchase_price,
            sellingPrice: (float) $request->selling_price,
            minimumStock: (int) $request->minimum_stock,
            status: $request->status,
            image: $request->file('image'),
        );
    }

    public function toArray(): array
    {
        return [
            'category_id' => $this->categoryId,
            'unit_id' => $this->unitId,
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'name' => $this->name,
            'description' => $this->description,
            'default_purchase_price' => $this->defaultPurchasePrice,
            'selling_price' => $this->sellingPrice,
            'minimum_stock' => $this->minimumStock,
            'status' => $this->status,
            'image' => $this->image,
        ];
    }
}