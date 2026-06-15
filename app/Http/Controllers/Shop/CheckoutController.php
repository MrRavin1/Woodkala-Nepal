<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmed;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function buyNow(Request $request)
    {
        $request->validate([
            'product_id'     => 'required|exists:products,id',
            'quantity'       => 'integer|min:1',
            'payment_method' => 'in:esewa,khalti,cod',
        ]);

        $user = auth()->user();
        $product = \App\Models\Product::findOrFail($request->product_id);

        if ($product->seller_id === $user->id) {
            return back()->withErrors(['product' => 'You cannot buy your own product.']);
        }

        $qty = $request->get('quantity', 1);

        $order = DB::transaction(function () use ($user, $product, $qty, $request) {
            $product = \App\Models\Product::lockForUpdate()->findOrFail($product->id);
            if ($product->stock < $qty) {
                throw new \Exception('Insufficient stock.');
            }
            $order = Order::create([
                'user_id'          => $user->id,
                'total'            => $product->price * $qty,
                'shipping_address' => $user->address ?? 'To be confirmed',
                'phone'            => $user->phone ?? 'To be confirmed',
                'payment_method'   => $request->get('payment_method', 'khalti'),
                'payment_status'   => 'unpaid',
                'status'           => 'pending',
            ]);
            $order->items()->create([
                'product_id' => $product->id,
                'quantity'   => $qty,
                'price'      => $product->price,
            ]);
            $product->decrement('stock', $qty);
            return $order;
        });

        Mail::to($user->email)->send(new OrderConfirmed($order->load('items.product', 'user')));

        $order->user->notify(new \App\Notifications\OrderPlaced($order));

        if ($request->get('payment_method', 'khalti') === 'esewa') {
            return Inertia::location(route('payment.esewa', $order->id));
        }
        if ($request->get('payment_method', 'khalti') === 'cod') {
            return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully!');
        }
        return Inertia::location(route('payment.khalti', $order->id));
    }

    public function index()
    {
        $items = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get()
            ->filter(fn($i) => $i->product !== null);

        if ($items->isEmpty()) return redirect()->route('cart.index');

        return Inertia::render('shop/checkout', [
            'items' => $items,
            'total' => $items->sum(fn($i) => $i->product->price * $i->quantity),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone'            => 'required|string',
            'payment_method'   => 'required|in:esewa,khalti,cod',
        ]);

        $items = CartItem::with('product')->where('user_id', auth()->id())->get();
        if ($items->isEmpty()) return back()->withErrors(['cart' => 'Cart is empty.']);

        $ownProduct = $items->first(fn($i) => $i->product->seller_id === auth()->id());
        if ($ownProduct) {
            return back()->withErrors(['cart' => 'Your cart contains your own product. Please remove it before checkout.']);
        }

        $total = $items->sum(fn($i) => $i->product->price * $i->quantity);

        $order = DB::transaction(function () use ($request, $items, $total) {
            $order = Order::create([
                'user_id'          => auth()->id(),
                'total'            => $total,
                'shipping_address' => $request->shipping_address,
                'phone'            => $request->phone,
                'payment_method'   => $request->payment_method,
                'payment_status'   => 'unpaid',
                'status'           => 'pending',
            ]);

            foreach ($items as $item) {
                $lockedProduct = \App\Models\Product::lockForUpdate()->findOrFail($item->product_id);
                if ($lockedProduct->stock < $item->quantity) {
                    throw new \Exception("Insufficient stock for: {$lockedProduct->name}");
                }
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $lockedProduct->price,
                ]);
                $lockedProduct->decrement('stock', $item->quantity);
            }

            CartItem::where('user_id', auth()->id())->delete();

            return $order;
        });

        Mail::to(auth()->user()->email)->send(new OrderConfirmed($order->load('items.product', 'user')));

        $order->user->notify(new \App\Notifications\OrderPlaced($order));

        if ($request->payment_method === 'khalti') {
            return Inertia::location(route('payment.khalti', $order->id));
        }

        if ($request->payment_method === 'esewa') {
            return Inertia::location(route('payment.esewa', $order->id));
        }

        return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully!');
    }
}
