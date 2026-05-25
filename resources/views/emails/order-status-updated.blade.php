<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Update — Wood Kala</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;">

@php
    $statusConfig = [
        'processing'  => ['bg' => '#DBEAFE', 'color' => '#1E40AF', 'label' => 'Processing'],
        'shipped'     => ['bg' => '#FEF3C7', 'color' => '#92400E', 'label' => 'Shipped'],
        'delivered'   => ['bg' => '#D1FAE5', 'color' => '#065F46', 'label' => 'Delivered'],
        'cancelled'   => ['bg' => '#FEE2E2', 'color' => '#991B1B', 'label' => 'Cancelled'],
        'pending'     => ['bg' => '#F3F4F6', 'color' => '#374151', 'label' => 'Pending'],
    ];
    $s = $statusConfig[$order->status] ?? ['bg' => '#F3F4F6', 'color' => '#374151', 'label' => ucfirst($order->status)];
    $isDelivered  = $order->status === 'delivered';
    $isCancelled  = $order->status === 'cancelled';
    $isShipped    = $order->status === 'shipped';
    $bannerBg     = $isCancelled ? '#991B1B' : ($isDelivered ? '#4A7C59' : '#A67C52');
    $icon         = $isCancelled ? '✕' : ($isDelivered ? '✓' : '↻');
@endphp

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

                    <!-- Status Banner -->
                    <tr>
                        <td style="background:{{ $bannerBg }};padding:28px 40px;text-align:center;">
                            <table cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
                                <tr>
                                    <td style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:50%;text-align:center;vertical-align:middle;">
                                        <span style="font-size:22px;line-height:48px;color:#fff;">{{ $icon }}</span>
                                    </td>
                                </tr>
                            </table>
                            <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#FFFFFF;">Order Status Updated</h2>
                            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);">Your order #{{ $order->id }} has a new update.</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#FFFFFF;padding:36px 40px;">

                            <p style="margin:0 0 24px;font-size:15px;color:#4A3728;line-height:1.6;">
                                Hi <strong>{{ $order->user->name }}</strong>,<br>
                                Here's the latest update on your order.
                            </p>

                            <!-- Status Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#FDF9F5;border:1px solid #E8DDD0;border-radius:12px;padding:24px;text-align:center;">
                                        <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#9A8070;font-weight:600;">Current Status</p>
                                        <span style="display:inline-block;background:{{ $s['bg'] }};color:{{ $s['color'] }};font-size:16px;font-weight:700;padding:8px 24px;border-radius:24px;letter-spacing:0.05em;">
                                            {{ $s['label'] }}
                                        </span>
                                        @if($isShipped)
                                        <p style="margin:12px 0 0;font-size:13px;color:#6B5B4E;">Your order is on its way! Expect delivery within 2–5 business days.</p>
                                        @elseif($isDelivered)
                                        <p style="margin:12px 0 0;font-size:13px;color:#065F46;">Your order has been delivered. We hope you love it!</p>
                                        @elseif($isCancelled)
                                        <p style="margin:12px 0 0;font-size:13px;color:#991B1B;">Your order has been cancelled. Contact us if you have questions.</p>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <!-- Order Meta -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="background:#FDF9F5;border:1px solid #E8DDD0;border-radius:12px;padding:20px 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width:50%;">
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Order Number</p>
                                                    <p style="margin:0;font-size:15px;font-weight:700;color:#1A1A1A;">#{{ $order->id }}</p>
                                                </td>
                                                <td style="width:50%;text-align:right;">
                                                    <p style="margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#9A8070;">Order Total</p>
                                                    <p style="margin:0;font-size:15px;font-weight:700;color:#A67C52;">रू {{ number_format($order->total, 2) }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
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
                                            View Order Details →
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
