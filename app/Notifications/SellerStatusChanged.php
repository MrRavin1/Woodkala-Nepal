<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SellerStatusChanged extends Notification
{
    use Queueable;

    public function __construct(public string $status) {}

    public function via(): array { return ['database']; }

    public function toArray(): array
    {
        $messages = [
            'approved'  => ['title' => 'Shop Approved!',   'body' => 'Congratulations! Your seller account has been approved. Start listing products.', 'url' => '/seller/dashboard'],
            'rejected'  => ['title' => 'Application Rejected', 'body' => 'Your seller application was not approved. Contact support for details.', 'url' => '/seller/register'],
            'suspended' => ['title' => 'Account Suspended', 'body' => 'Your seller account has been suspended. Contact support.', 'url' => '/seller/dashboard'],
        ];

        $msg = $messages[$this->status] ?? ['title' => 'Account Update', 'body' => "Your seller status is now: {$this->status}.", 'url' => '/seller/dashboard'];

        return array_merge($msg, ['type' => 'seller_status', 'status' => $this->status]);
    }
}
