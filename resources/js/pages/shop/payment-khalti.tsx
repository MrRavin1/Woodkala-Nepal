import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Order { id: number; total: number; status: string; payment_status: string; }

export default function PaymentKhalti({ order, error, success }: { order: Order; error?: string; success?: boolean }) {
    // No error and no success = unexpected landing — auto-retry
    useEffect(() => {
        if (!error && !success) {
            const t = setTimeout(() => { window.location.href = `/payment/khalti/${order.id}`; }, 3000);
            return () => clearTimeout(t);
        }
    }, [error, success]);

    return (
        <ShopLayout>
            <Head title="Khalti Payment — Wood Kala" />
            <div className="max-w-sm mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border p-8 space-y-5"
                    style={{ borderColor: '#E0D8CC', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                >
                    {success ? (
                        <>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-green-50">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Payment Successful!
                                </h1>
                                <p className="text-sm mt-1 text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: '#6B8F5E' }}>
                                रू {Number(order.total).toLocaleString()}
                            </p>
                            <p className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                                <Sparkles className="w-4 h-4 shrink-0" /> Your order is now being processed!
                            </p>
                            <Link
                                href={`/orders/${order.id}`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition hover:brightness-110"
                                style={{ background: '#6B8F5E' }}
                            >
                                View Order
                            </Link>
                        </>
                    ) : error ? (
                        <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-red-50">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Payment Failed
                                </h1>
                                <p className="text-sm mt-1 text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
                            <p className="text-2xl font-bold" style={{ color: '#6B8F5E' }}>
                                रू {Number(order.total).toLocaleString()}
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`/payment/khalti/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition hover:brightness-110"
                                    style={{ background: '#5C2D91' }}
                                >
                                    <RefreshCw className="w-4 h-4" /> Retry with Khalti
                                </a>
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border-2 transition hover:bg-muted"
                                    style={{ borderColor: '#E0D8CC', color: '#2D1F0E' }}
                                >
                                    <ArrowLeft className="w-4 h-4" /> View Order
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 mx-auto"
                            />
                            <div>
                                <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2D1F0E' }}>
                                    Redirecting to Khalti
                                </h1>
                                <p className="text-sm mt-1 text-muted-foreground">Order #{order.id} · रू {Number(order.total).toLocaleString()}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Taking too long?{' '}
                                <a href={`/payment/khalti/${order.id}`} className="font-semibold" style={{ color: '#5C2D91' }}>
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
