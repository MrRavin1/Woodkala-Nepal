<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerManagementController extends Controller
{
    public function index()
    {
        $sellers = User::whereIn('role', ['seller', 'pending_seller'])
            ->withCount('products')
            ->latest()
            ->get();

        $sellerIds = $sellers->pluck('id');

        $revenues = OrderItem::whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
            ->rightJoin('products', 'order_items.product_id', '=', 'products.id')
            ->whereIn('products.seller_id', $sellerIds)
            ->selectRaw('products.seller_id, COALESCE(SUM(order_items.price * order_items.quantity), 0) as total')
            ->groupBy('products.seller_id')
            ->pluck('total', 'seller_id');

        $orderCounts = OrderItem::rightJoin('products', 'order_items.product_id', '=', 'products.id')
            ->whereIn('products.seller_id', $sellerIds)
            ->selectRaw('products.seller_id, COUNT(DISTINCT order_items.order_id) as total')
            ->groupBy('products.seller_id')
            ->pluck('total', 'seller_id');

        $sellers->each(function ($seller) use ($revenues, $orderCounts) {
            $seller->total_revenue = $revenues[$seller->id] ?? 0;
            $seller->total_orders  = $orderCounts[$seller->id] ?? 0;
        });

        return Inertia::render('admin/sellers/index', ['sellers' => $sellers]);
    }

    public function payoutHistory(User $user)
    {
        $productIds = $user->products()->pluck('id');

        $revenue = \App\Models\OrderItem::whereIn('product_id', $productIds)
            ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'))
            ->selectRaw('SUM(price * quantity) as total')
            ->value('total') ?? 0;

        $payouts   = Payout::where('seller_id', $user->id)->with('recordedBy:id,name')->latest()->get();
        $totalPaid = $payouts->sum('amount');

        return Inertia::render('admin/sellers/payouts', [
            'seller'     => $user,
            'payouts'    => $payouts,
            'revenue'    => (float) $revenue,
            'total_paid' => (float) $totalPaid,
            'balance'    => (float) $revenue - (float) $totalPaid,
        ]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $request->validate(['seller_status' => 'required|in:pending,approved,suspended']);
        if ($request->seller_status === 'approved') {
            $user->update(['seller_status' => 'approved', 'role' => 'seller']);
            $user->products()->update(['is_active' => true]);
        } elseif ($request->seller_status === 'suspended') {
            $user->update(['seller_status' => 'suspended', 'role' => 'customer']);
            $user->products()->update(['is_active' => false]);
        } else {
            $user->update(['seller_status' => 'pending', 'role' => 'pending_seller']);
            $user->products()->update(['is_active' => false]);
        }
        $user->notify(new \App\Notifications\SellerStatusChanged($request->seller_status));
        return back()->with('success', 'Seller status updated.');
    }

    public function recordPayout(Request $request, User $user)
    {
        $request->validate([
            'amount'      => 'required|numeric|min:0.01',
            'payout_note' => 'nullable|string|max:255',
        ]);

        Payout::create([
            'seller_id'   => $user->id,
            'amount'      => $request->amount,
            'note'        => $request->payout_note,
            'recorded_by' => auth()->id(),
        ]);

        return back()->with('success', 'Payout recorded.');
    }
}
