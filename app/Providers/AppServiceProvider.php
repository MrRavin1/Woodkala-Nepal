<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->instance(LoginResponse::class, new class implements LoginResponse {
            public function toResponse($request)
            {
                $user = auth()->user();
                $referer = $request->headers->get('referer', '');
                $isSellerLogin = str_contains($referer, 'seller');

                if ($isSellerLogin) {
                    if ($user->isAdmin() || $user->isSeller()) {
                        return redirect('/seller/dashboard');
                    }
                    auth()->logout();
                    $request->session()->invalidate();
                    return redirect('/seller/login')->withErrors([
                        'email' => 'This account does not have seller access.',
                    ]);
                }

                return redirect('/shop');
            }
        });

        $this->app->instance(RegisterResponse::class, new class implements RegisterResponse {
            public function toResponse($request)
            {
                $user = auth()->user();
                $referer = $request->headers->get('referer', '');

                if (str_contains($referer, 'seller')) {
                    return redirect('/seller/register');
                }

                // Send OTP
                $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $user->forceFill([
                    'otp_code'       => $otp,
                    'otp_expires_at' => now()->addMinutes(10),
                ])->save();

                \Illuminate\Support\Facades\Mail::raw(
                    "Your Wood Kala verification code is: {$otp}\n\nThis code expires in 10 minutes.",
                    fn ($m) => $m->to($user->email)->subject('Your Wood Kala Verification Code')
                );

                return redirect('/email/verify-otp');
            }
        });
    }

    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }
        Request::setTrustedProxies(['*'], Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO);
        $this->configureDefaults();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
