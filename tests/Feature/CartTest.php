<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

function makeProduct(array $attrs = []): Product
{
    $category = Category::firstOrCreate(['name' => 'Test', 'slug' => 'test']);
    return Product::factory()->create(array_merge([
        'category_id' => $category->id,
        'price'       => 1000,
        'stock'       => 10,
        'is_active'   => true,
    ], $attrs));
}

test('guest cannot access cart', function () {
    $this->get(route('cart.index'))->assertRedirect(route('login'));
});

test('buyer can add product to cart', function () {
    $buyer   = User::factory()->create(['role' => 'customer']);
    $product = makeProduct();

    $this->actingAs($buyer)
        ->post(route('cart.store'), ['product_id' => $product->id, 'quantity' => 2])
        ->assertRedirect();

    expect(CartItem::where('user_id', $buyer->id)->where('product_id', $product->id)->value('quantity'))->toBe(2);
});

test('adding same product increments quantity', function () {
    $buyer   = User::factory()->create(['role' => 'customer']);
    $product = makeProduct();

    $this->actingAs($buyer)->post(route('cart.store'), ['product_id' => $product->id, 'quantity' => 1]);
    $this->actingAs($buyer)->post(route('cart.store'), ['product_id' => $product->id, 'quantity' => 3]);

    expect(CartItem::where('user_id', $buyer->id)->where('product_id', $product->id)->value('quantity'))->toBe(4);
});

test('seller cannot add own product to cart', function () {
    $seller  = User::factory()->create(['role' => 'seller']);
    $product = makeProduct(['seller_id' => $seller->id]);

    $this->actingAs($seller)
        ->post(route('cart.store'), ['product_id' => $product->id])
        ->assertSessionHasErrors('product');
});

test('buyer can remove cart item', function () {
    $buyer = User::factory()->create(['role' => 'customer']);
    $item  = CartItem::factory()->create(['user_id' => $buyer->id]);

    $this->actingAs($buyer)->delete(route('cart.destroy', $item))->assertRedirect();

    expect(CartItem::find($item->id))->toBeNull();
});

test('buyer cannot delete another users cart item', function () {
    $buyer = User::factory()->create(['role' => 'customer']);
    $other = CartItem::factory()->create();

    $this->actingAs($buyer)->delete(route('cart.destroy', $other))->assertForbidden();
});
