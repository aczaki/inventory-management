<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSupplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'supplier_id',
        'supplier_sku',
        'last_purchase_price',
        'is_primary',
    ];

    protected $casts = [
        'last_purchase_price' => 'decimal:2',
        'is_primary' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}