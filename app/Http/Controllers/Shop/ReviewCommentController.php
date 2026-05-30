<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\ReviewComment;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewCommentController extends Controller
{
    public function store(Request $request, Review $review)
    {
        $request->validate(['body' => 'required|string|max:500']);

        $review->comments()->create([
            'user_id' => auth()->id(),
            'body'    => $request->body,
        ]);

        $comment = $review->comments()->with('user', 'review.product')->latest()->first();
        if ($review->user_id !== auth()->id()) {
            $review->user->notify(new \App\Notifications\NewReviewComment($comment));
        }

        return back()->with('success', 'Comment posted.');
    }

    public function destroy(ReviewComment $comment)
    {
        abort_if($comment->user_id !== auth()->id(), 403);
        $comment->delete();
        return back()->with('success', 'Comment deleted.');
    }
}
