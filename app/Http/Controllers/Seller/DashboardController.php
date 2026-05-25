<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $seller = auth()->user();
        $productIds = $seller->products()->pluck('id');

        return Inertia::render('seller/dashboard', [
            'stats' => [
                'total_products'  => $seller->products()->count(),
                'active_products' => $seller->products()->where('is_active', true)->count(),
                'total_orders'    => \App\Models\OrderItem::whereIn('product_id', $productIds)->distinct('order_id')->count(),
                'total_revenue'   => \App\Models\OrderItem::whereIn('product_id', $productIds)
                    ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
                    ->selectRaw('SUM(price * quantity) as total')->value('total') ?? 0,
            ],
            'recent_products' => $seller->products()->with('category')->latest()->take(5)->get(),
        ]);
    }

    public function orders()
    {
        $productIds = auth()->user()->products()->pluck('id');

        $orders = \App\Models\Order::with([
                'user:id,name,email',
                'items' => fn($q) => $q->whereIn('product_id', $productIds),
                'items.product:id,name,slug,images',
            ])
            ->whereHas('items', fn($q) => $q->whereIn('product_id', $productIds))
            ->latest()->get();

        return Inertia::render('seller/orders', ['orders' => $orders]);
    }

    public function profile()
    {
        return Inertia::render('seller/profile', ['seller' => auth()->user()]);
    }

    public function updateProfile(\Illuminate\Http\Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'phone'              => 'nullable|string|max:20',
            'shop_name'          => 'nullable|string|max:255',
            'shop_description'   => 'nullable|string|max:1000',
            'bank_name'          => 'nullable|string|max:255',
            'bank_account_number'=> 'nullable|string|max:50',
            'bank_account_name'  => 'nullable|string|max:255',
            'bank_branch'        => 'nullable|string|max:255',
        ]);

        auth()->user()->update($data);
        return back()->with('success', 'Profile updated successfully.');
    }

    public function payouts()
    {
        $seller     = auth()->user();
        $productIds = $seller->products()->pluck('id');

        $revenue = \App\Models\OrderItem::whereIn('product_id', $productIds)
            ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
            ->selectRaw('SUM(price * quantity) as total')
            ->value('total') ?? 0;

        $payouts = \App\Models\Payout::where('seller_id', $seller->id)
            ->with('recordedBy:id,name')
            ->latest()
            ->get();

        $totalPaid = $payouts->sum('amount');

        return Inertia::render('seller/payouts', [
            'payouts'    => $payouts,
            'revenue'    => (float) $revenue,
            'total_paid' => (float) $totalPaid,
            'balance'    => (float) $revenue - (float) $totalPaid,
        ]);
    }

    public function updateOrder(\Illuminate\Http\Request $request, \App\Models\Order $order)
    {
        $productIds = auth()->user()->products()->pluck('id');
        abort_unless($order->items()->whereIn('product_id', $productIds)->exists(), 403);

        $request->validate(['status' => 'required|in:pending,processing,shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Order status updated.');
    }
}
