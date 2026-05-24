import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Order { id: number; total: number; status: string; payment_status: string; }

export default function PaymentEsewa({
    order, error, success, formData, esewaUrl,
}: {
    order: Order;
    error?: string;
    success?: boolean;
    formData?: Record<string, string>;
    esewaUrl?: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);

    // Auto-submit to eSewa when formData is present
    useEffect(() => {
        if (formData && esewaUrl && !error && !success) {
            formRef.current?.submit();
        }
    }, []);

    return (
        <ShopLayout>
            <Head title="eSewa Payment — Wood Kala" />
            <div className="max-w-sm mx-auto px-4 py-20 text-center">

                {/* Hidden eSewa form — auto-submitted */}
                {formData && esewaUrl && !error && !success && (
                    <form ref={formRef} method="POST" action={esewaUrl} className="hidden">
                        {Object.entries(formData).map(([k, v]) => (
                            <input key={k} type="hidden" name={k} value={v} />
                        ))}
                    </form>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border p-8 space-y-5"
                    style={{ borderColor: '#E0D8CC', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

                    {success ? (
                        <>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-green-50">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold">Payment Successful!</h1>
                                <p className="text-sm mt-1 text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">रू {Number(order.total).toLocaleString()}</p>
                            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">🎉 Your order is now being processed!</p>
                            <Link href={`/orders/${order.id}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-700 transition">
                                View Order
                            </Link>
                        </>
                    ) : error ? (
                        <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-red-50">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Payment Failed</h1>
                                <p className="text-sm mt-1 text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
                            <p className="text-2xl font-bold text-green-600">रू {Number(order.total).toLocaleString()}</p>
                            <div className="flex flex-col gap-2">
                                <a href={`/payment/esewa/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition"
                                    style={{ background: '#60BB46' }}>
                                    <RefreshCw className="w-4 h-4" /> Retry with eSewa
                                </a>
                                <Link href={`/orders/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border-2 hover:bg-muted transition"
                                    style={{ borderColor: '#E0D8CC' }}>
                                    <ArrowLeft className="w-4 h-4" /> View Order
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 rounded-full border-4 mx-auto"
                                style={{ borderColor: '#d1fae5', borderTopColor: '#60BB46' }}
                            />
                            <div>
                                <h1 className="text-xl font-bold">Redirecting to eSewa</h1>
                                <p className="text-sm mt-1 text-muted-foreground">
                                    Order #{order.id} · रू {Number(order.total).toLocaleString()}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Taking too long?{' '}
                                <a href={`/payment/esewa/${order.id}`} className="font-semibold" style={{ color: '#60BB46' }}>
                                    Click here
                                </a>
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </ShopLayout>
    );
}
