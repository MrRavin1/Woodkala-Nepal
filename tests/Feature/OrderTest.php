<?php

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

function buyer(): User
{
    return User::factory()->create(['role' => 'customer', 'email_verified_at' => now()]);
}

function product(int $stock = 10): Product
{
    $cat = Category::firstOrCreate(['name' => 'Test', 'slug' => 'test']);
    return Product::factory()->create(['category_id' => $cat->id, 'price' => 500, 'stock' => $stock, 'is_active' => true]);
}

test('buyer can checkout with cod', function () {
    $buyer = buyer();
    $prod  = product();
    CartItem::factory()->create(['user_id' => $buyer->id, 'product_id' => $prod->id, 'quantity' => 2]);

    $this->actingAs($buyer)->post(route('checkout.store'), [
        'shipping_address' => 'Kathmandu',
        'phone'            => '9800000000',
        'payment_method'   => 'cod',
    ])->assertRedirect();

    expect(Order::where('user_id', $buyer->id)->exists())->toBeTrue();
    expect($prod->fresh()->stock)->toBe(8);
    expect(CartItem::where('user_id', $buyer->id)->count())->toBe(0);
});

test('checkout fails when stock is insufficient', function () {
    $buyer = buyer();
    $prod  = product(stock: 1);
    CartItem::factory()->create(['user_id' => $buyer->id, 'product_id' => $prod->id, 'quantity' => 5]);

    $this->actingAs($buyer)->post(route('checkout.store'), [
        'shipping_address' => 'Kathmandu',
        'phone'            => '9800000000',
        'payment_method'   => 'cod',
    ])->assertStatus(500); // transaction throws exception

    expect(Order::where('user_id', $buyer->id)->exists())->toBeFalse();
    expect($prod->fresh()->stock)->toBe(1); // unchanged
});

test('buyer can cancel pending order and stock is restored', function () {
    $buyer = buyer();
    $prod  = product();
    $order = Order::factory()->create([
        'user_id'        => $buyer->id,
        'status'         => 'pending',
        'payment_status' => 'unpaid',
    ]);
    $order->items()->create(['product_id' => $prod->id, 'quantity' => 3, 'price' => 500]);
    $prod->decrement('stock', 3);

    $this->actingAs($buyer)->patch(route('orders.cancel', $order))->assertRedirect();

    expect($order->fresh()->status)->toBe('cancelled');
    expect($prod->fresh()->stock)->toBe(10);
});

test('buyer cannot cancel delivered order', function () {
    $buyer = buyer();
    $order = Order::factory()->create(['user_id' => $buyer->id, 'status' => 'delivered']);

    $this->actingAs($buyer)->patch(route('orders.cancel', $order))->assertStatus(422);
});

test('buyer cannot cancel another users order', function () {
    $buyer = buyer();
    $order = Order::factory()->create(['status' => 'pending']);

    $this->actingAs($buyer)->patch(route('orders.cancel', $order))->assertForbidden();
});
