<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('seller/products', [
            'products'   => auth()->user()->products()->with('category')->latest()->get(),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->seller_status !== 'approved') {
            return back()->withErrors(['product' => 'Your seller account must be approved before adding products.']);
        }

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'images'      => 'nullable|array',
            'images.*'    => 'image|max:2048',
        ]);

        $data['slug']      = Str::slug($data['name']) . '-' . Str::random(5);
        $data['seller_id'] = auth()->id();

        if ($request->hasFile('images')) {
            $data['images'] = collect($request->file('images'))
                ->map(fn($f) => $f->store('products', 'public'))
                ->toArray();
        }

        Product::create($data);
        return back()->with('success', 'Product added.');
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->seller_id !== auth()->id(), 403);

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'is_active'   => 'boolean',
            'images'      => 'nullable|array',
            'images.*'    => 'image|max:2048',
        ]);

        if ($request->hasFile('images')) {
            $data['images'] = collect($request->file('images'))
                ->map(fn($f) => $f->store('products', 'public'))
                ->toArray();
        }

        $product->update($data);
        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        abort_if($product->seller_id !== auth()->id(), 403);

        $hasActiveOrders = $product->orderItems()
            ->whereHas('order', fn($q) => $q->whereNotIn('status', ['delivered', 'cancelled']))
            ->exists();

        if ($hasActiveOrders) {
            return back()->withErrors(['product' => 'Cannot delete a product with active orders.']);
        }

        $product->delete();
        return back()->with('success', 'Product deleted.');
    }
}
