<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get()
            ->filter(fn($i) => $i->product !== null);

        $total = $items->sum(fn($i) => $i->product->price * $i->quantity);

        $trending = Product::with('category')
            ->where('is_active', true)
            ->whereNotIn('id', $items->pluck('product_id'))
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('shop/cart', [
            'items'    => $items,
            'total'    => $total,
            'trending' => $trending,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id', 'quantity' => 'integer|min:1']);

        $qty = $request->get('quantity', 1);

        $product = Product::findOrFail($request->product_id);
        if ($product->seller_id === auth()->id()) {
            return back()->withErrors(['product' => 'You cannot add your own product to cart.']);
        }

        $item = CartItem::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->increment('quantity', $qty);
        } else {
            CartItem::create([
                'user_id'    => auth()->id(),
                'product_id' => $request->product_id,
                'quantity'   => $qty,
            ]);
        }

        return back()->with('success', 'Added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        abort_if($cartItem->user_id !== auth()->id(), 403);
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);
        return back();
    }

    public function destroy(CartItem $cartItem)
    {
        abort_if($cartItem->user_id !== auth()->id(), 403);
        $cartItem->delete();
        return back()->with('success', 'Item removed.');
    }
}
