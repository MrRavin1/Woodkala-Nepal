<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('shop/orders', [
            'orders' => Order::with('items.product')
                ->where('user_id', auth()->id())
                ->latest()
                ->get(),
        ]);
    }

    public function show(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        return Inertia::render('shop/order-detail', [
            'order' => $order->load('items.product'),
        ]);
    }

    public function cancel(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        abort_if(!in_array($order->status, ['pending', 'processing']), 422, 'Order cannot be cancelled.');

        $order->update(['status' => 'cancelled']);

        // Only restore stock for unpaid orders
        if ($order->payment_status !== 'paid') {
            foreach ($order->items()->with('product')->get() as $item) {
                if (!$item->product) continue;

                $item->product->increment('stock', $item->quantity);

                $cart = CartItem::where('user_id', auth()->id())
                    ->where('product_id', $item->product_id)
                    ->first();

                if ($cart) {
                    $cart->increment('quantity', $item->quantity);
                } else {
                    CartItem::create([
                        'user_id'    => auth()->id(),
                        'product_id' => $item->product_id,
                        'quantity'   => $item->quantity,
                    ]);
                }
            }
        }

        return redirect()->route('cart.index')->with('success', 'Order cancelled. Items have been returned to your cart.');
    }

    public function reorder(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        foreach ($order->items()->with('product')->get() as $item) {
            if (!$item->product || $item->product->stock < 1) continue;

            $qty = min($item->quantity, $item->product->stock);

            $cart = CartItem::where('user_id', auth()->id())
                ->where('product_id', $item->product_id)
                ->first();

            if ($cart) {
                $newQty = min($cart->quantity + $qty, $item->product->stock);
                $cart->update(['quantity' => $newQty]);
            } else {
                CartItem::create(['user_id' => auth()->id(), 'product_id' => $item->product_id, 'quantity' => $qty]);
            }
        }

        return redirect()->route('cart.index')->with('success', 'Items added to cart.');
    }
}
