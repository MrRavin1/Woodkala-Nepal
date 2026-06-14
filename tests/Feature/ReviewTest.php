<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;

test('buyer can submit a review', function () {
    $buyer   = User::factory()->create(['role' => 'customer', 'email_verified_at' => now()]);
    $cat     = Category::firstOrCreate(['name' => 'Test', 'slug' => 'test']);
    $product = Product::factory()->create(['category_id' => $cat->id]);
    $order   = Order::factory()->create(['user_id' => $buyer->id, 'status' => 'delivered']);
    $order->items()->create(['product_id' => $product->id, 'quantity' => 1, 'price' => $product->price]);

    $this->actingAs($buyer)
        ->post(route('reviews.store'), ['product_id' => $product->id, 'rating' => 5, 'comment' => 'Great!'])
        ->assertRedirect();

    expect(Review::where('user_id', $buyer->id)->where('product_id', $product->id)->exists())->toBeTrue();
});

test('seller cannot review own product', function () {
    $seller  = User::factory()->create(['role' => 'seller', 'email_verified_at' => now()]);
    $cat     = Category::firstOrCreate(['name' => 'Test', 'slug' => 'test']);
    $product = Product::factory()->create(['category_id' => $cat->id, 'seller_id' => $seller->id]);

    $this->actingAs($seller)
        ->post(route('reviews.store'), ['product_id' => $product->id, 'rating' => 5])
        ->assertSessionHasErrors('product');
});

test('buyer can delete own review', function () {
    $buyer  = User::factory()->create(['role' => 'customer', 'email_verified_at' => now()]);
    $cat    = Category::firstOrCreate(['name' => 'Test', 'slug' => 'test']);
    $prod   = Product::factory()->create(['category_id' => $cat->id]);
    $review = Review::factory()->create(['user_id' => $buyer->id, 'product_id' => $prod->id]);

    $this->actingAs($buyer)->delete(route('reviews.destroy', $review))->assertRedirect();

    expect(Review::find($review->id))->toBeNull();
});

test('buyer cannot delete another users review', function () {
    $buyer  = User::factory()->create(['role' => 'customer', 'email_verified_at' => now()]);
    $review = Review::factory()->create();

    $this->actingAs($buyer)->delete(route('reviews.destroy', $review))->assertForbidden();
});
