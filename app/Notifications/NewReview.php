<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewReview extends Notification
{
    use Queueable;

    public function __construct(public Review $review) {}

    public function via(): array { return ['database']; }

    public function toArray(): array
    {
        return [
            'type'       => 'new_review',
            'title'      => 'New Review',
            'body'       => "{$this->review->user->name} left a {$this->review->rating}★ review on \"{$this->review->product->name}\".",
            'url'        => "/seller/reviews",
            'review_id'  => $this->review->id,
        ];
    }
}
