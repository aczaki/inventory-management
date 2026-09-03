<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'business_name',
        'contact_person',
        'email',
        'phone',
        'address',
    ];

    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}