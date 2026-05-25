<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusUpdated;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

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
        Mail::to($order->user->email)->queue(new OrderStatusUpdated($order->load('user')));
        return back()->with('success', 'Order status updated.');
    }
}
