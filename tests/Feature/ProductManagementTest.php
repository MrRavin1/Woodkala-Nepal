<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

// ─── Helpers ────────────────────────────────────────────────────────────────

function approvedSeller(): User
{
    return User::factory()->create([
        'role'          => 'seller',
        'seller_status' => 'approved',
    ]);
}

function adminUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

// ════════════════════════════════════════════════════════════════════════════
// SELLER – Product CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('Seller product management', function () {

    it('lists only own products', function () {
        $seller = approvedSeller();
        $own    = Product::factory()->create(['seller_id' => $seller->id]);
        $other  = Product::factory()->create(); // different seller

        $this->actingAs($seller)
            ->get(route('seller.products'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('products', 1)
                ->where('products.0.id', $own->id)
            );
    });

    it('creates a product when seller is approved', function () {
        $seller   = approvedSeller();
        $category = Category::factory()->create();

        $this->actingAs($seller)
            ->post(route('seller.products.store'), [
                'category_id' => $category->id,
                'name'        => 'Oak Shelf',
                'price'       => 299.99,
                'stock'       => 10,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('products', [
            'name'      => 'Oak Shelf',
            'seller_id' => $seller->id,
        ]);
    });

    it('blocks product creation when seller is not approved', function () {
        $seller   = User::factory()->create(['role' => 'seller', 'seller_status' => 'pending']);
        $category = Category::factory()->create();

        $this->actingAs($seller)
            ->post(route('seller.products.store'), [
                'category_id' => $category->id,
                'name'        => 'Blocked Product',
                'price'       => 100,
                'stock'       => 5,
            ])
            ->assertSessionHasErrors('product');

        $this->assertDatabaseMissing('products', ['name' => 'Blocked Product']);
    });

    it('validates required fields on store', function () {
        $seller = approvedSeller();

        $this->actingAs($seller)
            ->post(route('seller.products.store'), [])
            ->assertSessionHasErrors(['category_id', 'name', 'price', 'stock']);
    });

    it('updates own product', function () {
        $seller  = approvedSeller();
        $product = Product::factory()->create(['seller_id' => $seller->id]);
        $cat     = Category::factory()->create();

        $this->actingAs($seller)
            ->post(route('seller.products.update', $product), [
                'category_id' => $cat->id,
                'name'        => 'Updated Name',
                'price'       => 150,
                'stock'       => 20,
                'is_active'   => true,
            ])
            ->assertRedirect();

        expect($product->fresh()->name)->toBe('Updated Name');
    });

    it('cannot update another seller\'s product', function () {
        $seller  = approvedSeller();
        $product = Product::factory()->create(); // owned by someone else

        $this->actingAs($seller)
            ->post(route('seller.products.update', $product), [
                'category_id' => $product->category_id,
                'name'        => 'Hijacked',
                'price'       => 1,
                'stock'       => 1,
            ])
            ->assertForbidden();
    });

    it('deletes own product with no active orders', function () {
        $seller  = approvedSeller();
        $product = Product::factory()->create(['seller_id' => $seller->id]);

        $this->actingAs($seller)
            ->delete(route('seller.products.destroy', $product))
            ->assertRedirect();

        $this->assertModelMissing($product);
    });

    it('cannot delete product with active orders', function () {
        $seller  = approvedSeller();
        $product = Product::factory()->create(['seller_id' => $seller->id]);

        $order = Order::factory()->create(['status' => 'pending']);
        OrderItem::factory()->create(['product_id' => $product->id, 'order_id' => $order->id]);

        $this->actingAs($seller)
            ->delete(route('seller.products.destroy', $product))
            ->assertSessionHasErrors('product');

        $this->assertModelExists($product);
    });

    it('cannot delete another seller\'s product', function () {
        $seller  = approvedSeller();
        $product = Product::factory()->create();

        $this->actingAs($seller)
            ->delete(route('seller.products.destroy', $product))
            ->assertForbidden();
    });

    it('redirects unauthenticated users away from seller routes', function () {
        $this->get(route('seller.products'))->assertRedirect();
    });
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN – Product CRUD
// ════════════════════════════════════════════════════════════════════════════

describe('Admin product management', function () {

    it('lists all products', function () {
        Product::factory()->count(3)->create();

        $this->actingAs(adminUser())
            ->get(route('admin.products.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('products', 3));
    });

    it('creates a product', function () {
        $admin    = adminUser();
        $category = Category::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.products.store'), [
                'category_id' => $category->id,
                'name'        => 'Admin Product',
                'price'       => 500,
                'stock'       => 15,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('products', ['name' => 'Admin Product']);
    });

    it('generates a unique slug on store', function () {
        $category = Category::factory()->create();
        $admin    = adminUser();

        Product::factory()->create(['slug' => 'oak-table']);

        $this->actingAs($admin)
            ->post(route('admin.products.store'), [
                'category_id' => $category->id,
                'name'        => 'Oak Table',
                'price'       => 200,
                'stock'       => 5,
            ]);

        $this->assertDatabaseHas('products', ['slug' => 'oak-table-1']);
    });

    it('updates a product', function () {
        $admin   = adminUser();
        $product = Product::factory()->create();
        $cat     = Category::factory()->create();

        $this->actingAs($admin)
            ->put(route('admin.products.update', $product), [
                'category_id' => $cat->id,
                'name'        => 'Admin Updated',
                'price'       => 999,
                'stock'       => 3,
                'is_active'   => false,
            ])
            ->assertRedirect();

        expect($product->fresh())
            ->name->toBe('Admin Updated')
            ->is_active->toBeFalse();
    });

    it('deletes a product with no active orders', function () {
        $admin   = adminUser();
        $product = Product::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.products.destroy', $product))
            ->assertRedirect();

        $this->assertModelMissing($product);
    });

    it('cannot delete product with active orders', function () {
        $admin   = adminUser();
        $product = Product::factory()->create();

        $order = Order::factory()->create(['status' => 'processing']);
        OrderItem::factory()->create(['product_id' => $product->id, 'order_id' => $order->id]);

        $this->actingAs($admin)
            ->delete(route('admin.products.destroy', $product))
            ->assertSessionHasErrors('product');

        $this->assertModelExists($product);
    });

    it('redirects non-admin away from admin product routes', function () {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $this->actingAs($buyer)
            ->get(route('admin.products.index'))
            ->assertRedirect('/shop');
    });
});
