<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryStock;
use App\Models\InventoryTransaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Inventory Report
     */
    public function inventory(Request $request)
    {
        $stocks = InventoryStock::query()
            ->with([
                'product',
                'warehouse',
            ])
            ->when(
                $request->filled('warehouse_id'),
                fn ($query) => $query->where(
                    'warehouse_id',
                    $request->integer('warehouse_id')
                )
            )
            ->when(
                $request->filled('product_id'),
                fn ($query) => $query->where(
                    'product_id',
                    $request->integer('product_id')
                )
            )
            ->get();

        $data = $stocks->map(function ($stock) {
            $quantity = (int) $stock->quantity;
            $minimumStock = (int) $stock->product->minimum_stock;

            if ($quantity <= 0) {
                $status = 'out_of_stock';
            } elseif ($quantity <= $minimumStock) {
                $status = 'low_stock';
            } else {
                $status = 'safe';
            }

            return [
                'product_id' => $stock->product_id,
                'sku' => $stock->product->sku,
                'product_name' => $stock->product->name,
                'warehouse_id' => $stock->warehouse_id,
                'warehouse_name' => $stock->warehouse->name,
                'quantity' => $quantity,
                'minimum_stock' => $minimumStock,
                'stock_status' => $status,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Inventory report retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Transaction Report
     */
    public function transactions(Request $request)
    {
        $transactions = InventoryTransaction::query()
            ->with([
                'warehouse',
                'customer',
                'user',
            ])
            ->when(
                $request->filled('start_date'),
                fn ($query) => $query->whereDate(
                    'transaction_date',
                    '>=',
                    $request->input('start_date')
                )
            )
            ->when(
                $request->filled('end_date'),
                fn ($query) => $query->whereDate(
                    'transaction_date',
                    '<=',
                    $request->input('end_date')
                )
            )
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
            ->get();

        $data = $transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'transaction_number' => $transaction->transaction_number,
                'type' => $transaction->type,
                'warehouse' => $transaction->warehouse?->name,
                'customer' => $transaction->customer?->business_name,
                'user' => $transaction->user?->name,
                'reference_type' => $transaction->reference_type,
                'reference_number' => $transaction->reference_number,
                'notes' => $transaction->notes,
                'transaction_date' => $transaction->transaction_date,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Transaction report retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Stock Movement Report
     */
    public function stockMovement(Request $request)
    {
        $transactions = InventoryTransaction::query()
            ->when(
                $request->filled('start_date'),
                fn ($query) => $query->whereDate(
                    'transaction_date',
                    '>=',
                    $request->input('start_date')
                )
            )
            ->when(
                $request->filled('end_date'),
                fn ($query) => $query->whereDate(
                    'transaction_date',
                    '<=',
                    $request->input('end_date')
                )
            )
            ->when(
                $request->filled('warehouse_id'),
                fn ($query) => $query->where(
                    'warehouse_id',
                    $request->integer('warehouse_id')
                )
            );

        $stockIn = (clone $transactions)
            ->where('type', 'in')
            ->count();

        $stockOut = (clone $transactions)
            ->where('type', 'out')
            ->count();

        $adjustment = (clone $transactions)
            ->where('type', 'adjustment')
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'Stock movement report retrieved successfully',
            'data' => [
                'stock_in' => $stockIn,
                'stock_out' => $stockOut,
                'adjustment' => $adjustment,
            ],
        ]);
    }

    /**
     * Stock by Warehouse Report
     */
    public function stockByWarehouse()
    {
        $stocks = InventoryStock::query()
            ->with('warehouse')
            ->selectRaw(
                'warehouse_id, SUM(quantity) as total_stock'
            )
            ->groupBy('warehouse_id')
            ->get();

        $data = $stocks->map(function ($stock) {
            return [
                'warehouse_id' => $stock->warehouse_id,
                'warehouse_name' => $stock->warehouse->name,
                'total_stock' => (int) $stock->total_stock,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock by warehouse report retrieved successfully',
            'data' => $data,
        ]);
    }
}