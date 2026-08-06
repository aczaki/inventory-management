<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'address',
        'description',
        'status',
    ];

    public function inventoryStocks()
    {
        return $this->hasMany(InventoryStock::class);
    }

    public function transactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}