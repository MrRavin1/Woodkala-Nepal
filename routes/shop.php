<?php

use App\Http\Controllers\Shop\BuyerDashboardController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\ShopController;
use App\Http\Controllers\Shop\WishlistController;
use Illuminate\Support\Facades\Route;

// Public shop routes
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/seller/{user}', [ShopController::class, 'seller'])->name('shop.seller');
Route::get('/shop/{product:slug}', [ShopController::class, 'show'])->name('shop.show');

// Auth required
Route::middleware(['auth', 'verified'])->group(function () {
    // Buyer dashboard
    Route::get('/dashboard/buyer', [BuyerDashboardController::class, 'index'])->name('buyer.dashboard');

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/buy-now', [CheckoutController::class, 'buyNow'])->name('checkout.buy-now');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}/reorder', [OrderController::class, 'reorder'])->name('orders.reorder');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::patch('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Payment initiate (auth required)
    Route::get('/payment/khalti/{order}', [PaymentController::class, 'khalti'])->name('payment.khalti');
    Route::get('/payment/esewa/{order}', [PaymentController::class, 'esewa'])->name('payment.esewa');
});

// Payment verify — outside auth so gateway redirects always land here
Route::get('/payment/khalti/{order}/verify', [PaymentController::class, 'khaltiVerify'])->name('payment.khalti.verify');
Route::get('/payment/esewa/{order}/verify', [PaymentController::class, 'esewaVerify'])->name('payment.esewa.verify');
Route::get('/payment/esewa/{order}/failure', [PaymentController::class, 'esewaFailure'])->name('payment.esewa.failure');
