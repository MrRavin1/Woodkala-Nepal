<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderPlaced extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(): array { return ['database']; }

    public function toArray(): array
    {
        return [
            'type'    => 'order_placed',
            'title'   => 'Order Confirmed',
            'body'    => "Your order #{$this->order->id} has been placed successfully.",
            'url'     => "/orders/{$this->order->id}",
            'order_id'=> $this->order->id,
        ];
    }
}
