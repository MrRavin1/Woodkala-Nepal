<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function users()
    {
        return response()->json(User::where('role', 'customer')->withCount('orders')->latest()->get());
    }

    public function categories()
    {
        return response()->json(Category::withCount('products')->latest()->get());
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255', 'description' => 'nullable|string']);
        $data['slug'] = Str::slug($data['name']);
        return response()->json(Category::create($data), 201);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate(['name' => 'required|string|max:255', 'description' => 'nullable|string']);
        $data['slug'] = Str::slug($data['name']);
        $category->update($data);
        return response()->json($category);
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function products()
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    public function storeProduct(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'material'    => 'nullable|string',
            'dimensions'  => 'nullable|string',
            'images'      => 'nullable|array',
        ]);
        $data['slug']      = Str::slug($data['name']) . '-' . Str::random(4);
        $data['seller_id'] = auth()->id();
        return response()->json(Product::create($data), 201);
    }

    public function updateProduct(Request $request, Product $product)
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
        $product->update($data);
        return response()->json($product);
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function orders()
    {
        return response()->json(Order::with(['user', 'items.product'])->latest()->get());
    }

    public function updateOrder(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return response()->json($order);
    }
}
