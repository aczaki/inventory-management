<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSupplier extends Model
{
    protected $table = 'product_suppliers';

    protected $fillable = [
        'product_id',
        'supplier_id',
        'supplier_sku',
        'last_purchase_price',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'last_purchase_price' => 'decimal:2',
            'is_primary' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}