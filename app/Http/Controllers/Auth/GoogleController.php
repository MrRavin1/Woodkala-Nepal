<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        $referer = request()->headers->get('referer', '');
        if ($referer && !str_contains($referer, '/login') && !str_contains($referer, '/register')) {
            session(['url.intended' => $referer]);
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $googleUser->getName(),
                'password'          => bcrypt(Str::random(24)),
                'role'              => 'customer',
                'email_verified_at' => now(),
                'is_google_user'    => true,
            ]
        );

        Auth::login($user, remember: true);

        return redirect('/shop');
    }
}
