<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_products'  => Product::count(),
                'total_orders'    => Order::count(),
                'total_users'     => User::whereNotIn('role', ['admin'])->count(),
                'total_revenue'   => Order::where('payment_status', 'paid')->sum('total'),
                'pending_orders'  => Order::where('status', 'pending')->count(),
                'pending_sellers' => User::where('seller_status', 'pending')->count(),
            ],
            'recent_orders' => Order::with('user')
                ->latest()
                ->take(5)
                ->get(['id', 'user_id', 'total', 'status', 'payment_status', 'payment_method', 'created_at']),
        ]);
    }
}
