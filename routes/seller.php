<?php

use App\Http\Controllers\Seller\DashboardController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Seller auth page — accessible to guests AND logged-in buyers
Route::get('/seller/login', function () {
    // Already logged in → send straight to seller registration
    if (auth()->check()) {
        return redirect()->route('seller.register');
    }
    return Inertia::render('auth/seller-auth-page', ['defaultTab' => 'login']);
})->name('seller.login');

// Seller registration (any logged-in user)
Route::middleware(['auth'])->group(function () {
    Route::get('/seller/register', [RegisterController::class, 'show'])->name('seller.register');
    Route::post('/seller/register', [RegisterController::class, 'store'])->name('seller.register.store');
    Route::get('/seller/approval-status', fn () => response()->json([
        'approved' => auth()->user()->seller_status === 'approved' && auth()->user()->role === 'seller',
    ]))->name('seller.approval-status');
});

// Seller panel (seller role only)
Route::middleware(['auth', 'verified', 'seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/payouts', [DashboardController::class, 'payouts'])->name('payouts');
    Route::get('/orders', [DashboardController::class, 'orders'])->name('orders');
    Route::patch('/orders/{order}', [DashboardController::class, 'updateOrder'])->name('orders.update');
    Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
    Route::patch('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');
});
