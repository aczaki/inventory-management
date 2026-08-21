<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\ProductSupplierController;


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
});


