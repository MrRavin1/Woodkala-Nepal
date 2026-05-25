<?php

namespace App\Notifications;

use App\Models\ReviewComment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewReviewComment extends Notification
{
    use Queueable;

    public function __construct(public ReviewComment $comment) {}

    public function via(): array { return ['database']; }

    public function toArray(): array
    {
        return [
            'type'      => 'review_comment',
            'title'     => 'New Comment on Your Review',
            'body'      => "{$this->comment->user->name} commented: \"{$this->comment->body}\"",
            'url'       => "/shop/{$this->comment->review->product->slug}",
            'review_id' => $this->comment->review_id,
        ];
    }
}
