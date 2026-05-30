<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::put('settings/set-password', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
        $request->user()->update([
            'password'       => bcrypt($request->password),
            'is_google_user' => false,
        ]);
        return back()->with('success', 'Password set successfully.');
    })->middleware('throttle:6,1')->name('user-password.set');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    Route::inertia('settings/notifications', 'settings/notifications')->name('notifications.edit');
    Route::inertia('settings/addresses', 'settings/addresses')->name('addresses.edit');
    Route::get('settings/analytics', function () {
        $user = auth()->user();
        return inertia('settings/analytics', [
            'analytics' => [
                'total_orders'   => $user->orders()->count(),
                'wishlist_items' => $user->wishlist()->count(),
                'total_spent'    => $user->orders()->whereNotIn('status', ['cancelled'])->sum('total'),
                'delivered'      => $user->orders()->where('status', 'delivered')->count(),
            ],
        ]);
    })->name('analytics.edit');
});
