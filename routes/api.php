<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/profile',  [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);

    Route::get('/cart',               [CartController::class, 'index']);
    Route::post('/cart',              [CartController::class, 'store']);
    Route::patch('/cart/{cartItem}',  [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);

    Route::get('/orders',                   [OrderController::class, 'index']);
    Route::post('/orders',                  [OrderController::class, 'store']);
    Route::get('/orders/{order}',           [OrderController::class, 'show']);
    Route::patch('/orders/{order}/cancel',  [OrderController::class, 'cancel']);

    Route::post('/reviews',            [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    Route::middleware('seller')->prefix('seller')->group(function () {
        Route::get('/products',              [SellerController::class, 'products']);
        Route::post('/products',             [SellerController::class, 'store']);
        Route::patch('/products/{product}',  [SellerController::class, 'update']);
        Route::delete('/products/{product}', [SellerController::class, 'destroy']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users',                       [AdminController::class, 'users']);

        Route::get('/categories',                  [AdminController::class, 'categories']);
        Route::post('/categories',                 [AdminController::class, 'storeCategory']);
        Route::patch('/categories/{category}',     [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{category}',    [AdminController::class, 'destroyCategory']);

        Route::get('/products',                    [AdminController::class, 'products']);
        Route::post('/products',                   [AdminController::class, 'storeProduct']);
        Route::patch('/products/{product}',        [AdminController::class, 'updateProduct']);
        Route::delete('/products/{product}',       [AdminController::class, 'destroyProduct']);

        Route::get('/orders',                      [AdminController::class, 'orders']);
        Route::patch('/orders/{order}',            [AdminController::class, 'updateOrder']);
    });
});
