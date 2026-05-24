<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::factory(),
            'seller_id'   => User::factory()->create(['role' => 'seller'])->id,
            'name'        => fake()->words(3, true),
            'slug'        => fake()->unique()->slug(),
            'price'       => fake()->randomFloat(2, 100, 10000),
            'stock'       => fake()->numberBetween(1, 100),
            'is_active'   => true,
        ];
    }
}
