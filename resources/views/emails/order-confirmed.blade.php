<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;color:#333;max-width:600px;margin:auto;padding:24px">
    <h2>Order Confirmed 🎉</h2>
    <p>Hi {{ $order->user->name }}, your order has been placed successfully.</p>

    <table width="100%" cellpadding="8" style="border-collapse:collapse;margin:16px 0">
        <tr style="background:#f5f5f5">
            <th align="left">Product</th>
            <th align="right">Qty</th>
            <th align="right">Price</th>
        </tr>
        @foreach($order->items as $item)
        <tr style="border-top:1px solid #eee">
            <td>{{ $item->product->name ?? 'N/A' }}</td>
            <td align="right">{{ $item->quantity }}</td>
            <td align="right">Rs. {{ number_format($item->price * $item->quantity, 2) }}</td>
        </tr>
        @endforeach
        <tr style="border-top:2px solid #ccc;font-weight:bold">
            <td colspan="2">Total</td>
            <td align="right">Rs. {{ number_format($order->total, 2) }}</td>
        </tr>
    </table>

    <p><strong>Payment:</strong> {{ strtoupper($order->payment_method) }} — {{ $order->payment_status }}</p>
    <p><strong>Shipping to:</strong> {{ $order->shipping_address }}</p>
    <p style="color:#888;font-size:12px">Thank you for shopping with {{ config('app.name') }}.</p>
</body>
</html>
