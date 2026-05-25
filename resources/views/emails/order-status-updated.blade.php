<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#333;max-width:600px;margin:auto;padding:24px">
    <h2>Order Status Updated</h2>
    <p>Hi {{ $order->user->name }}, your order <strong>#{{ $order->id }}</strong> status has been updated.</p>

    <p style="font-size:18px">
        New status: <strong style="text-transform:capitalize">{{ $order->status }}</strong>
    </p>

    <p><strong>Total:</strong> Rs. {{ number_format($order->total, 2) }}</p>
    <p><strong>Shipping to:</strong> {{ $order->shipping_address }}</p>

    <p style="color:#888;font-size:12px">Thank you for shopping with {{ config('app.name') }}.</p>
</body>
</html>
