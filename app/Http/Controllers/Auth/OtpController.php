<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function show(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect('/shop');
        }
        return Inertia::render('auth/verify-otp');
    }

    public function send(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect('/shop');
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'otp_code'       => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ])->save();

        Mail::raw("Your Wood Kala verification code is: {$otp}\n\nThis code expires in 10 minutes.", function ($m) use ($user) {
            $m->to($user->email)->subject('Your Wood Kala Verification Code');
        });

        return back()->with('status', 'otp-sent');
    }

    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);

        $user = $request->user();

        if (
            ! $user->otp_code ||
            ! $user->otp_expires_at ||
            now()->isAfter($user->otp_expires_at) ||
            $user->otp_code !== $request->code
        ) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'otp_code'          => null,
            'otp_expires_at'    => null,
        ])->save();

        return redirect('/shop');
    }
}
