<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryTransactionResource;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;

class InventoryTransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = InventoryTransaction::query()
            ->with([
                'warehouse',
                'customer',
                'user',
            ])
            ->when(
                $request->filled('type'),
                fn ($query) => $query->where(
                    'type',
                    $request->input('type')
                )
            )
            ->when(
                $request->filled('warehouse_id'),
                fn ($query) => $query->where(
                    'warehouse_id',
                    $request->integer('warehouse_id')
                )
            )
            ->when(
                $request->filled('customer_id'),
                fn ($query) => $query->where(
                    'customer_id',
                    $request->integer('customer_id')
                )
            )
            ->when(
                $request->filled('reference_type'),
                fn ($query) => $query->where(
                    'reference_type',
                    $request->input('reference_type')
                )
            )
            ->latest('transaction_date')
            ->latest('id')
            ->paginate(
                $request->integer('per_page', 15)
            );

        return InventoryTransactionResource::collection(
            $transactions
        );
    }

    public function show(InventoryTransaction $inventoryTransaction)
    {
        $inventoryTransaction->load([
            'warehouse',
            'customer',
            'user',
        ]);

        return new InventoryTransactionResource(
            $inventoryTransaction
        );
    }
}