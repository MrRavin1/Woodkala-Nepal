<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(): array { return ['database']; }

    public function toArray(): array
    {
        return [
            'type'    => 'order_status',
            'title'   => 'Order Status Updated',
            'body'    => "Order #{$this->order->id} is now " . ucfirst($this->order->status) . '.',
            'url'     => "/orders/{$this->order->id}",
            'order_id'=> $this->order->id,
            'status'  => $this->order->status,
        ];
    }
}
