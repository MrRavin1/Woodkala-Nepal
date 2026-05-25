<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);
        if ($request->in_stock)  $query->where('stock', '>', 0);
        if ($request->sort === 'price_asc')   $query->orderBy('price');
        elseif ($request->sort === 'price_desc') $query->orderByDesc('price');
        elseif ($request->sort === 'rating')  $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating');
        elseif ($request->sort === 'popular') $query->withCount('orderItems')->orderByDesc('order_items_count');
        else $query->latest();

        return Inertia::render('shop/index', [
            'products'   => $query->paginate(12)->withQueryString(),
            'categories' => Category::all(['id', 'name', 'slug']),
            'filters'    => $request->only(['category', 'search', 'min_price', 'max_price', 'sort', 'in_stock']),
        ]);
    }

    public function seller(\App\Models\User $user)
    {
        abort_unless($user->role === 'seller' && $user->seller_status === 'approved', 404);

        $products = $user->products()
            ->with('category')
            ->where('is_active', true)
            ->latest()
            ->get();

        $avgRating = \App\Models\Review::whereIn('product_id', $user->products()->pluck('id'))
            ->avg('rating');

        return Inertia::render('shop/seller-profile', [
            'seller'     => $user->only('id', 'name', 'shop_name', 'shop_description', 'avatar', 'created_at'),
            'products'   => $products,
            'avg_rating' => round($avgRating ?? 0, 1),
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'reviews.user', 'seller']);

        $related = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        $wishlisted = auth()->check()
            ? Wishlist::where('user_id', auth()->id())->where('product_id', $product->id)->exists()
            : false;

        return Inertia::render('shop/show', [
            'product'     => $product,
            'avg_rating'  => round($product->reviews->avg('rating'), 1),
            'user_review' => auth()->check()
                ? $product->reviews->firstWhere('user_id', auth()->id())
                : null,
            'related'     => $related,
            'wishlisted'  => $wishlisted,
        ]);
    }

    // Helper used in views: resolve image src
    public static function imgSrc(?array $images, int $idx = 0): ?string
    {
        $img = $images[$idx] ?? null;
        if (!$img) return null;
        // External URL
        if (str_starts_with($img, 'http')) return $img;
        // Local storage
        return '/storage/' . $img;
    }
}
