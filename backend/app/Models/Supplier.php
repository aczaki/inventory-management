<?php

namespace App\Models;

use Database\Factories\SupplierFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'code',
    'name',
    'email',
    'phone',
    'address',
    'contact_person',
    'status',
])]
class Supplier extends Model
{
    /** @use HasFactory<SupplierFactory> */
    use HasFactory;
    use SoftDeletes;

    protected function casts(): array
    {
        return [];
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_suppliers',
            'supplier_id',
            'product_id'
        )->withPivot([
            'supplier_sku',
            'last_purchase_price',
            'is_primary',
        ]);
    }
}