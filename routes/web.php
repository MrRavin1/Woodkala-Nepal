<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister'    => Features::enabled(Features::registration()),
        'featured'       => Product::with('category')->where('is_active', true)->latest()->take(8)->get(),
        'categories'     => Category::withCount('products')->get(),
        'total_products' => Product::where('is_active', true)->count(),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->isAdmin() || $user->isSeller()) {
            return redirect('/seller/dashboard');
        }
        return redirect('/shop');
    })->name('dashboard');

    Route::post('/notifications/{id}/read', function (string $id) {
        auth()->user()->notifications()->where('id', $id)->update(['read_at' => now()]);
        return response()->noContent();
    })->name('notifications.read');

    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->noContent();
    })->name('notifications.read-all');
});

require __DIR__.'/settings.php';

Route::get('/auth/google', [\App\Http\Controllers\Auth\GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\GoogleController::class, 'callback']);

Route::middleware('auth')->group(function () {
    Route::get('/email/verify-otp', [\App\Http\Controllers\Auth\OtpController::class, 'show'])->name('otp.show');
    Route::post('/email/verify-otp', [\App\Http\Controllers\Auth\OtpController::class, 'verify'])->name('otp.verify');
    Route::post('/email/resend-otp', [\App\Http\Controllers\Auth\OtpController::class, 'send'])->name('otp.send');
});

