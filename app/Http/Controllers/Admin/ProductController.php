<?php

namespace App\Http\Controllers\Admin;

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
        return Inertia::render('admin/products/index', [
            'products'   => Product::with('category')->latest()->get(),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'seller_id'   => 'nullable|exists:users,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'images'      => 'nullable|array',
            'images.*'    => 'image|max:2048',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['slug'] = $this->uniqueSlug($data['slug'], Product::class);
        $data['seller_id'] = $data['seller_id'] ?? auth()->id();

        if ($request->hasFile('images')) {
            $data['images'] = collect($request->file('images'))
                ->map(fn($file) => $file->store('products', 'public'))
                ->toArray();
        }

        Product::create($data);
        return back()->with('success', 'Product created.');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $base = $data['slug'];
        $data['slug'] = $this->uniqueSlug($base, Product::class, $product->id);

        if ($request->hasFile('images')) {
            $data['images'] = collect($request->file('images'))
                ->map(fn($file) => $file->store('products', 'public'))
                ->toArray();
        }

        $product->update($data);
        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $hasActiveOrders = $product->orderItems()
            ->whereHas('order', fn($q) => $q->whereNotIn('status', ['delivered', 'cancelled']))
            ->exists();

        if ($hasActiveOrders) {
            return back()->withErrors(['product' => 'Cannot delete a product with active orders.']);
        }

        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    private function uniqueSlug(string $base, string $model, ?int $excludeId = null): string
    {
        $slug = $base;
        $i = 1;
        while ($model::where('slug', $slug)->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }
}
