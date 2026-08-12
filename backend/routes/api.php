<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);

    Route::post(
        'products/{id}/restore',
        [ProductController::class, 'restore']
    )->withTrashed();
});