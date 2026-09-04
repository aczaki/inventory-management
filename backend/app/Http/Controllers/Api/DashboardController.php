<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\InventoryStock;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalProducts = Product::count();

        $totalStock = InventoryStock::sum('quantity');

        $totalWarehouses = Warehouse::count();

        $lowStockProducts = Product::whereHas('inventoryStocks', function ($query) {
            $query->whereColumn(
                'quantity',
                '<=',
                'products.minimum_stock'
            );
        })
        ->with('inventoryStocks')
        ->get();

        $stockIn = InventoryTransaction::where('type', 'in')
            ->count();

        $stockOut = InventoryTransaction::where('type', 'out')
            ->count();

        $recentTransactions = InventoryTransaction::with([
            'warehouse',
            'customer',
            'user',
        ])
        ->latest()
        ->limit(10)
        ->get();

        $stockByWarehouse = InventoryStock::with('warehouse')
            ->selectRaw('warehouse_id, SUM(quantity) as total_stock')
            ->groupBy('warehouse_id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data retrieved successfully',
            'data' => [
                'summary' => [
                    'total_products' => $totalProducts,
                    'total_stock' => $totalStock,
                    'low_stock' => $lowStockProducts->count(),
                    'total_warehouses' => $totalWarehouses,
                ],

                'stock_movement' => [
                    'stock_in' => $stockIn,
                    'stock_out' => $stockOut,
                ],

                'low_stock_products' => $lowStockProducts,

                'recent_transactions' => $recentTransactions,

                'stock_by_warehouse' => $stockByWarehouse,
            ],
        ]);
    }
}