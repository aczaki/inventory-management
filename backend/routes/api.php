<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\ProductSupplierController;
use App\Http\Controllers\Api\InventoryStockController;
use App\Http\Controllers\Api\InventoryTransactionController;


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);

    Route::post(
        'products/{id}/restore',
        [ProductController::class, 'restore']
    )->withTrashed();

    Route::apiResource('categories', CategoryController::class);

    Route::post(
        'categories/{id}/restore',
        [CategoryController::class, 'restore']
    );

    Route::apiResource('suppliers', SupplierController::class);

    Route::post(
        'suppliers/{id}/restore',
        [SupplierController::class, 'restore']
    );

    // Product Supplier Routes
    Route::get(
    'products/{product}/suppliers',
    [ProductSupplierController::class, 'index']
    );

    Route::post(
        'products/{product}/suppliers',
        [ProductSupplierController::class, 'store']
    );

    Route::put(
        'products/{product}/suppliers/{supplier}',
        [ProductSupplierController::class, 'update']
    );

    Route::delete(
        'products/{product}/suppliers/{supplier}',
        [ProductSupplierController::class, 'destroy']
    );

    // Inventory Stock Routes
    Route::get(
    'inventory/stocks/{product}/{warehouse}',
    [InventoryStockController::class, 'show']
    );

    Route::post(
        'inventory/stocks/in',
        [InventoryStockController::class, 'stockIn']
    );

    Route::post(
        'inventory/stocks/out',
        [InventoryStockController::class, 'stockOut']
    );

    Route::post(
        'inventory/stocks/adjustment',
        [InventoryStockController::class, 'adjustment']
    );

    // Inventory Transaction Routes
    Route::prefix('inventory')->group(function () {
        Route::get(
            '/transactions',
            [InventoryTransactionController::class, 'index']
        );

        Route::get(
            '/transactions/{inventoryTransaction}',
            [InventoryTransactionController::class, 'show']
        );
    });
});


