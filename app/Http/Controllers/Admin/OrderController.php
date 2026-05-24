<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::with(['user:id,name,email', 'items.product:id,name'])
                ->latest()
                ->paginate(50)
                ->withQueryString(),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);
        return back()->with('success', 'Order status updated.');
    }
}
