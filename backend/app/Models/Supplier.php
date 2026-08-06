<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'email',
        'phone',
        'address',
        'contact_person',
        'status',
    ];

    public function productSuppliers()
    {
        return $this->hasMany(ProductSupplier::class);
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_suppliers'
        )
        ->withPivot([
            'supplier_sku',
            'last_purchase_price',
            'is_primary',
        ])
        ->withTimestamps();
    }
}