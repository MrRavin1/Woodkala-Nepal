<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            return redirect('/login');
        }

        if (!$request->user()->isAdmin()) {
            return redirect('/shop')->with('error', 'Access denied.');
        }

        return $next($request);
    }
}
