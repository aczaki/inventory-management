<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SupplierController;


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
});


