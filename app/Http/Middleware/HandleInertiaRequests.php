<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'cart_count' => $request->user()
                ? \App\Models\CartItem::where('user_id', $request->user()->id)->sum('quantity')
                : 0,
            'wishlist_count' => $request->user()
                ? \App\Models\Wishlist::where('user_id', $request->user()->id)->count()
                : 0,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'notifications' => $request->user()
                ? $request->user()->unreadNotifications->take(15)->map(fn($n) => [
                    'id'         => $n->id,
                    'type'       => $n->data['type'] ?? '',
                    'title'      => $n->data['title'] ?? '',
                    'body'       => $n->data['body'] ?? '',
                    'url'        => $n->data['url'] ?? null,
                    'created_at' => $n->created_at->diffForHumans(),
                ])
                : [],
            'unread_count' => $request->user()
                ? $request->user()->unreadNotifications->count()
                : 0,
        ];
    }
}
