<?php

use App\Models\User;

function customer(): User
{
    return User::factory()->create(['role' => 'customer', 'email_verified_at' => now()]);
}

function admin(): User
{
    return User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
}

function pendingSeller(): User
{
    return User::factory()->create([
        'role'          => 'pending_seller',
        'seller_status' => 'pending',
        'email_verified_at' => now(),
        'shop_name'     => 'Test Shop',
        'bank_name'     => 'Test Bank',
        'bank_account_number' => '1234567890',
        'bank_account_name'   => 'Test User',
        'id_type'       => 'citizenship',
        'id_number'     => 'ID-001',
        'phone'         => '9800000000',
    ]);
}

// --- Seller Registration ---

test('guest is redirected from seller register page', function () {
    $this->get(route('seller.register'))->assertRedirect(route('login'));
});

test('customer can view seller registration form', function () {
    $this->actingAs(customer())->get(route('seller.register'))->assertOk();
});

test('pending seller sees pending approval page', function () {
    $user = pendingSeller();
    $this->actingAs($user)->get(route('seller.register'))->assertOk();
});

test('approved seller is redirected to dashboard', function () {
    $user = User::factory()->create(['role' => 'seller', 'email_verified_at' => now()]);
    $this->actingAs($user)->get(route('seller.register'))->assertRedirect(route('seller.dashboard'));
});

test('customer can submit seller registration', function () {
    $user = customer();

    $this->actingAs($user)->post(route('seller.register.store'), [
        'shop_name'          => 'My Wood Shop',
        'phone'              => '9800000001',
        'bank_name'          => 'Himalayan Bank',
        'bank_account_number'=> '9876543210',
        'bank_account_name'  => 'Test Owner',
        'id_type'            => 'passport',
        'id_number'          => 'P-12345',
    ])->assertRedirect(route('seller.register'));

    expect($user->fresh()->role)->toBe('pending_seller')
        ->and($user->fresh()->seller_status)->toBe('pending')
        ->and($user->fresh()->shop_name)->toBe('My Wood Shop');
});

test('registration fails with missing required fields', function () {
    $this->actingAs(customer())
        ->post(route('seller.register.store'), [])
        ->assertSessionHasErrors(['shop_name', 'phone', 'bank_name', 'bank_account_number', 'bank_account_name', 'id_type', 'id_number']);
});

// --- Admin Approval / Rejection ---

test('admin can approve a pending seller', function () {
    $seller = pendingSeller();

    $this->actingAs(admin())
        ->patch(route('admin.sellers.status', $seller), ['seller_status' => 'approved'])
        ->assertRedirect();

    expect($seller->fresh()->role)->toBe('seller')
        ->and($seller->fresh()->seller_status)->toBe('approved');
});

test('admin can suspend a seller', function () {
    $seller = pendingSeller();

    $this->actingAs(admin())
        ->patch(route('admin.sellers.status', $seller), ['seller_status' => 'suspended'])
        ->assertRedirect();

    expect($seller->fresh()->role)->toBe('customer')
        ->and($seller->fresh()->seller_status)->toBe('suspended');
});

test('admin can reset seller back to pending', function () {
    $seller = User::factory()->create(['role' => 'seller', 'seller_status' => 'approved', 'email_verified_at' => now()]);

    $this->actingAs(admin())
        ->patch(route('admin.sellers.status', $seller), ['seller_status' => 'pending'])
        ->assertRedirect();

    expect($seller->fresh()->role)->toBe('pending_seller')
        ->and($seller->fresh()->seller_status)->toBe('pending');
});

test('admin rejects invalid status value', function () {
    $seller = pendingSeller();

    $this->actingAs(admin())
        ->patch(route('admin.sellers.status', $seller), ['seller_status' => 'invalid'])
        ->assertSessionHasErrors('seller_status');
});

test('non-admin cannot update seller status', function () {
    $seller = pendingSeller();

    $this->actingAs(customer())
        ->patch(route('admin.sellers.status', $seller), ['seller_status' => 'approved'])
        ->assertRedirect();
});

test('approved seller can access seller dashboard', function () {
    $seller = User::factory()->create(['role' => 'seller', 'seller_status' => 'approved', 'email_verified_at' => now()]);

    $this->actingAs($seller)->get(route('seller.dashboard'))->assertOk();
});

test('pending seller is redirected away from seller dashboard', function () {
    $this->actingAs(pendingSeller())->get(route('seller.dashboard'))->assertRedirect();
});
