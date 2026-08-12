<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'unit_id',
        'sku',
        'barcode',
        'name',
        'description',
        'default_purchase_price',
        'selling_price',
        'minimum_stock',
        'image',
        'status',
    ];

    protected $casts = [
        'default_purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function suppliers()
    {
        return $this->belongsToMany(
            Supplier::class,
            'product_suppliers',
            'product_id',
            'supplier_id'
        );
    }

    public function stocks()
    {
        return $this->hasMany(InventoryStock::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
    
    public function supplierMasters()
    {
        return $this->belongsToMany(
            Supplier::class,
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