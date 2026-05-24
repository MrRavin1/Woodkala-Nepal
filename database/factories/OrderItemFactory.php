<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id'   => \App\Models\Order::factory(),
            'product_id' => \App\Models\Product::factory(),
            'quantity'   => 1,
            'price'      => fake()->randomFloat(2, 100, 5000),
        ];
    }
}
