<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit']);
    Route::resource('products', ProductController::class)->except(['show', 'create', 'edit']);
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::patch('users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('sellers', [\App\Http\Controllers\Admin\SellerManagementController::class, 'index'])->name('sellers.index');
    Route::patch('sellers/{user}/status', [\App\Http\Controllers\Admin\SellerManagementController::class, 'updateStatus'])->name('sellers.status');
    Route::patch('sellers/{user}/payout', [\App\Http\Controllers\Admin\SellerManagementController::class, 'recordPayout'])->name('sellers.payout');
    Route::get('sellers/{user}/payouts', [\App\Http\Controllers\Admin\SellerManagementController::class, 'payoutHistory'])->name('sellers.payouts');
    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::patch('reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});
