<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed — Wood Kala</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EA;padding:40px 16px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#2C1810;padding:36px 40px;border-radius:16px 16px 0 0;">
                            <img src="{{ config('app.url') }}/logo.png" alt="Wood Kala Nepal" style="height:56px;width:auto;display:block;margin:0 auto;" />
                        </td>
                    </tr>

                    <!-- Success Banner -->
                    <tr>
                        <td style="background:#4A7C59;padding:28px 40px;text-align:center;">
                            <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
                                <tr>
                                    <td style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:50%;text-align:center;vertical-align:middle;">
                                        <span style="font-size:24px;line-height:48px;">✓</span>
                                    </td>
                                </tr>
                            </table>
                            <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#FFFFFF;">Order Confirmed!</h2>
                            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);">Your order has been placed successfully.</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#FFFFFF;padding:36px 40px;">

                            <p style="margin:0 0 24px;font-size:15px;color:#4A3728;line-height:1.6;">
                                Hi <strong>{{ $order->user->name }}</strong>,<br>
                                Thank you for your purchase! We're preparing your order with care.
                            </p>

                            <!-- Order Meta -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#FDF9F5;border:1px solid #E8DDD0;border-radius:12px;padding:20px 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:50%;padding-bottom:12px;">
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Order Number</p>
                                                    <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">#{{ $order->id }}</p>
                                                </td>
                                                <td style="width:50%;padding-bottom:12px;text-align:right;">
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Date</p>
                                                    <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">{{ $order->created_at->format('M d, Y') }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Payment</p>
                                                    <p style="margin:0;font-size:14px;font-weight:600;color:#1A1A1A;">{{ strtoupper($order->payment_method) }}</p>
                                                </td>
                                                <td style="text-align:right;">
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Status</p>
                                                    <span style="display:inline-block;background:#D1FAE5;color:#065F46;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;text-transform:capitalize;">{{ $order->payment_status }}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Items -->
                            <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#9A8070;font-weight:600;">Order Items</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8DDD0;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                                <tr style="background:#FDF9F5;">
                                    <td style="padding:10px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#7A6A5A;">Product</td>
                                    <td style="padding:10px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#7A6A5A;text-align:center;">Qty</td>
                                    <td style="padding:10px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#7A6A5A;text-align:right;">Amount</td>
                                </tr>
                                @foreach($order->items as $item)
                                <tr style="border-top:1px solid #F0EDE8;">
                                    <td style="padding:14px 16px;font-size:14px;color:#1A1A1A;font-weight:500;">{{ $item->product->name ?? 'N/A' }}</td>
                                    <td style="padding:14px 16px;font-size:14px;color:#6B5B4E;text-align:center;">{{ $item->quantity }}</td>
                                    <td style="padding:14px 16px;font-size:14px;color:#1A1A1A;font-weight:600;text-align:right;">रू {{ number_format($item->price * $item->quantity, 2) }}</td>
                                </tr>
                                @endforeach
                                <tr style="border-top:2px solid #E8DDD0;background:#FDF9F5;">
                                    <td colspan="2" style="padding:14px 16px;font-size:15px;font-weight:700;color:#1A1A1A;">Total</td>
                                    <td style="padding:14px 16px;font-size:16px;font-weight:700;color:#A67C52;text-align:right;">रू {{ number_format($order->total, 2) }}</td>
                                </tr>
                            </table>

                            <!-- Shipping -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#FDF9F5;border:1px solid #E8DDD0;border-left:4px solid #A67C52;border-radius:0 12px 12px 0;padding:16px 20px;">
                                        <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;font-weight:600;">Shipping Address</p>
                                        <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.5;">{{ $order->shipping_address }}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}/orders/{{ $order->id }}"
                                           style="display:inline-block;background:#A67C52;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;letter-spacing:0.05em;">
                                            Track Your Order →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#2C1810;padding:28px 40px;border-radius:0 0 16px 16px;text-align:center;">
                            <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.6);">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/9779815069169" style="color:#C49A6C;text-decoration:none;">+977 9815069169</a></p>
                            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);">© {{ date('Y') }} Wood Kala Nepal · Kathmandu, Nepal · Mon–Sat 9am–6pm</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
