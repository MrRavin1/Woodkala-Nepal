<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function khalti(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $user = auth()->user();

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://a.khalti.com/api/v2/epayment/initiate/', [
            'return_url'        => route('payment.khalti.verify', $order->id),
            'website_url'       => config('app.url'),
            'amount'            => (int) ($order->total * 100),
            'purchase_order_id' => (string) $order->id,
            'purchase_order_name' => 'Wood Kala Order #' . $order->id,
            'customer_info'     => [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $order->phone,
            ],
        ]);

        if ($response->successful() && $response->json('payment_url')) {
            return redirect($response->json('payment_url'));
        }

        Log::error('Khalti initiation failed', ['order_id' => $order->id, 'body' => $response->json()]);

        return Inertia::render('shop/payment-khalti', [
            'order' => $order,
            'error' => $response->json('detail') ?? 'Could not initiate Khalti payment.',
        ]);
    }

    public function khaltiVerify(Request $request, Order $order)
    {
        abort_if(auth()->check() && $order->user_id !== auth()->id(), 403);

        $pidx = $request->query('pidx');

        if (! $pidx) {
            return Inertia::render('shop/payment-khalti', ['order' => $order, 'error' => 'Payment was cancelled.']);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret'),
        ])->post('https://a.khalti.com/api/v2/epayment/lookup/', ['pidx' => $pidx]);

        $status = $response->json('status');

        if ($response->successful() && $status === 'Completed') {
            $order->update(['payment_status' => 'paid', 'payment_ref' => $pidx, 'status' => 'processing']);
            return Inertia::render('shop/payment-khalti', ['order' => $order->fresh(), 'success' => true]);
        }

        Log::error('Khalti verification failed', ['order_id' => $order->id, 'body' => $response->json()]);

        $msg = match($status) {
            'Pending', 'Initiated' => 'Payment is still pending.',
            'Refunded'             => 'Payment was refunded.',
            'Expired'              => 'Payment session expired. Please try again.',
            'User canceled'        => 'Payment was cancelled.',
            default                => 'Payment verification failed.',
        };

        return Inertia::render('shop/payment-khalti', ['order' => $order, 'error' => $msg]);
    }

    public function esewa(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $amount      = number_format($order->total, 2, '.', '');
        $taxAmount   = '0';
        $totalAmount = $amount;
        $transactionUuid = $order->id . '-' . Str::uuid();
        $productCode = config('services.esewa.product_code');
        $successUrl  = route('payment.esewa.verify', $order->id);
        $failureUrl  = route('payment.esewa.failure', $order->id);

        // HMAC-SHA256 signature: "total_amount,transaction_uuid,product_code"
        $message   = "total_amount={$totalAmount},transaction_uuid={$transactionUuid},product_code={$productCode}";
        $signature = base64_encode(hash_hmac('sha256', $message, config('services.esewa.secret'), true));

        // Store uuid on order so we can verify later
        $order->update(['payment_ref' => $transactionUuid]);

        $baseUrl = config('services.esewa.url');

        return Inertia::render('shop/payment-esewa', [
            'order'           => $order,
            'formData'        => [
                'amount'           => $amount,
                'tax_amount'       => $taxAmount,
                'total_amount'     => $totalAmount,
                'transaction_uuid' => $transactionUuid,
                'product_code'     => $productCode,
                'product_service_charge' => '0',
                'product_delivery_charge' => '0',
                'success_url'      => $successUrl,
                'failure_url'      => $failureUrl,
                'signed_field_names' => 'total_amount,transaction_uuid,product_code',
                'signature'        => $signature,
            ],
            'esewaUrl' => $baseUrl . '/api/epay/main/v2/form',
        ]);
    }

    public function esewaVerify(Request $request, Order $order)
    {
        // eSewa sends base64-encoded JSON in ?data=
        $data = $request->query('data');
        if (! $data) {
            return redirect()->route('payment.esewa.failure', $order->id);
        }

        $decoded = json_decode(base64_decode($data), true);
        $status  = $decoded['status'] ?? '';

        if ($status !== 'COMPLETE') {
            return Inertia::render('shop/payment-esewa', [
                'order' => $order,
                'error' => 'Payment was not completed. Status: ' . $status,
            ]);
        }

        // Verify signature from eSewa response
        $totalAmount     = $decoded['total_amount'] ?? '';
        $transactionUuid = $decoded['transaction_uuid'] ?? '';
        $productCode     = $decoded['product_code'] ?? '';
        $receivedSig     = $decoded['signature'] ?? '';

        $message  = "transaction_code={$decoded['transaction_code']},status={$status},total_amount={$totalAmount},transaction_uuid={$transactionUuid},product_code={$productCode},signed_field_names={$decoded['signed_field_names']}";
        $expected = base64_encode(hash_hmac('sha256', $message, config('services.esewa.secret'), true));

        if (! hash_equals($expected, $receivedSig)) {
            Log::error('eSewa signature mismatch', ['order_id' => $order->id, 'decoded' => $decoded]);
            return Inertia::render('shop/payment-esewa', [
                'order' => $order,
                'error' => 'Payment verification failed (signature mismatch).',
            ]);
        }

        $order->update([
            'payment_status' => 'paid',
            'payment_ref'    => $decoded['transaction_code'],
            'status'         => 'processing',
        ]);

        return Inertia::render('shop/payment-esewa', ['order' => $order->fresh(), 'success' => true]);
    }

    public function esewaFailure(Order $order)
    {
        return Inertia::render('shop/payment-esewa', [
            'order' => $order,
            'error' => 'Payment failed or was cancelled.',
        ]);
    }
}
