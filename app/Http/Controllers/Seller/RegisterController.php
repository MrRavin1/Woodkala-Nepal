<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        if ($user->isSeller()) {
            return redirect()->route('seller.dashboard');
        }
        if ($user->role === 'pending_seller') {
            return Inertia::render('seller/register', ['pendingApproval' => true]);
        }
        return Inertia::render('seller/register', ['pendingApproval' => false]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shop_name'                 => 'required|string|max:255',
            'shop_description'          => 'nullable|string|max:1000',
            'phone'                     => 'required|string|max:20',
            'shop_registration_number'  => 'nullable|string|max:100',
            'shop_registration_image'   => 'nullable|image|max:2048',
            'bank_name'                 => 'required|string|max:255',
            'bank_account_number'       => 'required|string|max:30',
            'bank_account_name'         => 'required|string|max:255',
            'bank_branch'               => 'nullable|string|max:255',
            'id_type'                   => 'required|in:citizenship,passport,license',
            'id_number'                 => 'required|string|max:50',
            'id_image'                  => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('shop_registration_image')) {
            $imagePath = $request->file('shop_registration_image')->store('shop-registrations', 'public');
        }

        $idImagePath = null;
        if ($request->hasFile('id_image')) {
            $idImagePath = $request->file('id_image')->store('id-documents', 'public');
        }

        auth()->user()->update([
            'role'                      => 'pending_seller',
            'shop_name'                 => $request->shop_name,
            'shop_description'          => $request->shop_description,
            'phone'                     => $request->phone,
            'shop_registration_number'  => $request->shop_registration_number,
            'shop_registration_image'   => $imagePath,
            'bank_name'                 => $request->bank_name,
            'bank_account_number'       => $request->bank_account_number,
            'bank_account_name'         => $request->bank_account_name,
            'bank_branch'               => $request->bank_branch,
            'id_type'                   => $request->id_type,
            'id_number'                 => $request->id_number,
            'id_image'                  => $idImagePath,
            'seller_status'             => 'pending',
        ]);

        return redirect()->route('seller.register')->with('pending', true);
    }
}
