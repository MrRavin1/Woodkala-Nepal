<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) abort(403);
        return response()->json($order->load('items.product'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone'            => 'required|string',
            'payment_method'   => 'required|in:cod,khalti',
        ]);

        $items = CartItem::with('product')->where('user_id', $request->user()->id)->get();
        if ($items->isEmpty()) return response()->json(['message' => 'Cart is empty'], 422);

        $total = $items->sum(fn($i) => $i->quantity * $i->product->price);

        $order = DB::transaction(function () use ($request, $items, $total) {
            $order = Order::create([
                'user_id'          => $request->user()->id,
                'total'            => $total,
                'status'           => 'pending',
                'payment_method'   => $request->payment_method,
                'payment_status'   => 'unpaid',
                'shipping_address' => $request->shipping_address,
                'phone'            => $request->phone,
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price,
                ]);
                $item->product->decrement('stock', $item->quantity);
            }

            CartItem::where('user_id', $request->user()->id)->delete();
            return $order;
        });

        return response()->json($order->load('items.product'), 201);
    }

    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) abort(403);
        if (! in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Order cannot be cancelled'], 422);
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items()->with('product')->get() as $item) {
                $item->product?->increment('stock', $item->quantity);
            }
            $order->update(['status' => 'cancelled']);
        });

        return response()->json($order->fresh());
    }
}
