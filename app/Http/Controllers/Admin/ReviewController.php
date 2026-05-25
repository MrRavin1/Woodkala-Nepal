<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/reviews/index', [
            'reviews' => Review::with(['user', 'product'])->latest()->get(),
        ]);
    }

    public function update(\Illuminate\Http\Request $request, Review $review)
    {
        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
        $review->update($request->only('rating', 'comment'));
        return back()->with('success', 'Review updated.');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted.');
    }
}
