<?php

use App\Mail\OrderConfirmed;
use App\Mail\OrderStatusUpdated;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

// ─── Helpers ────────────────────────────────────────────────────────────────

function buyer(): User
{
    return User::factory()->create(['role' => 'buyer']);
}

function seller(): User
{
    return User::factory()->create(['role' => 'seller', 'seller_status' => 'approved']);
}

function orderFor(User $user, string $status = 'pending', string $paymentStatus = 'unpaid'): Order
{
    $order = Order::factory()->create([
        'user_id'        => $user->id,
        'status'         => $status,
        'payment_status' => $paymentStatus,
    ]);
    OrderItem::factory()->create(['order_id' => $order->id]);
    return $order;
}

// ════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ════════════════════════════════════════════════════════════════════════════

describe('Checkout', function () {

    it('redirects to cart when cart is empty', function () {
        $this->actingAs(buyer())
            ->get(route('checkout.index'))
            ->assertRedirect(route('cart.index'));
    });

    it('places a COD order and clears cart', function () {
        Mail::fake();
        $buyer    = buyer();
        $category = Category::factory()->create();
        $product  = Product::factory()->create(['category_id' => $category->id, 'stock' => 5, 'price' => 200]);
        CartItem::factory()->create(['user_id' => $buyer->id, 'product_id' => $product->id, 'quantity' => 2]);

        $this->actingAs($buyer)
            ->post(route('checkout.store'), [
                'shipping_address' => '123 Main St',
                'phone'            => '9800000001',
                'payment_method'   => 'cod',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', ['user_id' => $buyer->id, 'status' => 'pending']);
        $this->assertDatabaseMissing('cart_items', ['user_id' => $buyer->id]);
        expect(Product::find($product->id)->stock)->toBe(3);
        Mail::assertSent(OrderConfirmed::class);
    });

    it('blocks checkout when cart contains own product', function () {
        $seller  = seller();
        $product = Product::factory()->create(['seller_id' => $seller->id, 'stock' => 5]);
        CartItem::factory()->create(['user_id' => $seller->id, 'product_id' => $product->id]);

        $this->actingAs($seller)
            ->post(route('checkout.store'), [
                'shipping_address' => '123 Main St',
                'phone'            => '9800000001',
                'payment_method'   => 'cod',
            ])
            ->assertSessionHasErrors('cart');
    });

    it('fails checkout when stock is insufficient', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 1]);
        CartItem::factory()->create(['user_id' => $buyer->id, 'product_id' => $product->id, 'quantity' => 5]);

        $this->actingAs($buyer)
            ->post(route('checkout.store'), [
                'shipping_address' => '123 Main St',
                'phone'            => '9800000001',
                'payment_method'   => 'cod',
            ])
            ->assertStatus(500); // DB transaction throws exception

        $this->assertDatabaseMissing('orders', ['user_id' => $buyer->id]);
        expect(Product::find($product->id)->stock)->toBe(1); // stock unchanged
    });

    it('validates required checkout fields', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 5]);
        CartItem::factory()->create(['user_id' => $buyer->id, 'product_id' => $product->id]);

        $this->actingAs($buyer)
            ->post(route('checkout.store'), [])
            ->assertSessionHasErrors(['shipping_address', 'phone', 'payment_method']);
    });

    it('places a buy-now order', function () {
        Mail::fake();
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 3, 'price' => 500]);

        $this->actingAs($buyer)
            ->post(route('checkout.buy-now'), [
                'product_id'     => $product->id,
                'quantity'       => 1,
                'payment_method' => 'cod',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', ['user_id' => $buyer->id]);
        expect(Product::find($product->id)->stock)->toBe(2);
    });

    it('blocks buy-now for own product', function () {
        $seller  = seller();
        $product = Product::factory()->create(['seller_id' => $seller->id, 'stock' => 5]);

        $this->actingAs($seller)
            ->post(route('checkout.buy-now'), [
                'product_id'     => $product->id,
                'quantity'       => 1,
                'payment_method' => 'cod',
            ])
            ->assertSessionHasErrors('product');
    });
});

// ════════════════════════════════════════════════════════════════════════════
// BUYER – Order viewing & cancellation
// ════════════════════════════════════════════════════════════════════════════

describe('Buyer order management', function () {

    it('lists own orders', function () {
        $buyer = buyer();
        orderFor($buyer);
        orderFor(buyer()); // another buyer's order

        $this->actingAs($buyer)
            ->get(route('orders.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('orders', 1));
    });

    it('views own order detail', function () {
        $buyer = buyer();
        $order = orderFor($buyer);

        $this->actingAs($buyer)
            ->get(route('orders.show', $order))
            ->assertOk();
    });

    it('cannot view another buyer\'s order', function () {
        $order = orderFor(buyer());

        $this->actingAs(buyer())
            ->get(route('orders.show', $order))
            ->assertForbidden();
    });

    it('cancels a pending order and restores stock', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 5]);
        $order   = Order::factory()->create(['user_id' => $buyer->id, 'status' => 'pending', 'payment_status' => 'unpaid']);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => 2]);

        $this->actingAs($buyer)
            ->patch(route('orders.cancel', $order))
            ->assertRedirect();

        expect($order->fresh()->status)->toBe('cancelled');
        expect(Product::find($product->id)->stock)->toBe(7); // 5 + 2 restored
    });

    it('cancels a processing order and restores stock', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 3]);
        $order   = Order::factory()->create(['user_id' => $buyer->id, 'status' => 'processing', 'payment_status' => 'unpaid']);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => 1]);

        $this->actingAs($buyer)->patch(route('orders.cancel', $order));

        expect($order->fresh()->status)->toBe('cancelled');
        expect(Product::find($product->id)->stock)->toBe(4);
    });

    it('does not restore stock when cancelling a paid order', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 5]);
        $order   = Order::factory()->create(['user_id' => $buyer->id, 'status' => 'pending', 'payment_status' => 'paid']);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => 2]);

        $this->actingAs($buyer)->patch(route('orders.cancel', $order));

        expect($order->fresh()->status)->toBe('cancelled');
        expect(Product::find($product->id)->stock)->toBe(5); // unchanged
    });

    it('cannot cancel a shipped order', function () {
        $buyer = buyer();
        $order = orderFor($buyer, 'shipped');

        $this->actingAs($buyer)
            ->patch(route('orders.cancel', $order))
            ->assertStatus(422);
    });

    it('cannot cancel another buyer\'s order', function () {
        $order = orderFor(buyer(), 'pending');

        $this->actingAs(buyer())
            ->patch(route('orders.cancel', $order))
            ->assertForbidden();
    });

    it('reorders items into cart', function () {
        $buyer   = buyer();
        $product = Product::factory()->create(['stock' => 10]);
        $order   = Order::factory()->create(['user_id' => $buyer->id]);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => 2]);

        $this->actingAs($buyer)
            ->post(route('orders.reorder', $order))
            ->assertRedirect(route('cart.index'));

        $this->assertDatabaseHas('cart_items', ['user_id' => $buyer->id, 'product_id' => $product->id]);
    });
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN – Order management
// ════════════════════════════════════════════════════════════════════════════

describe('Admin order management', function () {

    it('lists all orders', function () {
        Order::factory()->count(3)->create();

        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get(route('admin.orders.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('orders'));
    });

    it('updates order status and sends email', function () {
        Mail::fake();
        $admin = User::factory()->create(['role' => 'admin']);
        $order = orderFor(buyer());

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), ['status' => 'shipped'])
            ->assertRedirect();

        expect($order->fresh()->status)->toBe('shipped');
        Mail::assertQueued(OrderStatusUpdated::class);
    });

    it('validates status value on admin update', function () {
        $admin = User::factory()->create(['role' => 'admin']);
        $order = orderFor(buyer());

        $this->actingAs($admin)
            ->patch(route('admin.orders.update', $order), ['status' => 'invalid'])
            ->assertSessionHasErrors('status');
    });
});

// ════════════════════════════════════════════════════════════════════════════
// SELLER – Order management
// ════════════════════════════════════════════════════════════════════════════

describe('Seller order management', function () {

    it('views orders containing own products', function () {
        $s       = seller();
        $product = Product::factory()->create(['seller_id' => $s->id]);
        $order   = Order::factory()->create();
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id]);

        // unrelated order
        orderFor(buyer());

        $this->actingAs($s)
            ->get(route('seller.orders'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('orders', 1));
    });

    it('updates status of order containing own product', function () {
        $s       = seller();
        $product = Product::factory()->create(['seller_id' => $s->id]);
        $order   = Order::factory()->create(['status' => 'pending']);
        OrderItem::factory()->create(['order_id' => $order->id, 'product_id' => $product->id]);

        $this->actingAs($s)
            ->patch(route('seller.orders.update', $order), ['status' => 'processing'])
            ->assertRedirect();

        expect($order->fresh()->status)->toBe('processing');
    });

    it('cannot update order that does not contain own products', function () {
        $s     = seller();
        $order = orderFor(buyer()); // no products from $s

        $this->actingAs($s)
            ->patch(route('seller.orders.update', $order), ['status' => 'shipped'])
            ->assertForbidden();
    });
});
