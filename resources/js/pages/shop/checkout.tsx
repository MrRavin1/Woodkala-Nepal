import { imgSrc } from '@/lib/img';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, Wallet, CheckCircle2, Lock } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface CartItem { id: number; quantity: number; product: { name: string; price: number; images: string[] | null }; }

const PAYMENT_METHODS = [
    { value: 'cod',    label: 'Cash on Delivery', icon: Truck,       desc: 'Pay when your order arrives',    color: 'text-emerald-600' },
    { value: 'khalti', label: 'Khalti',            icon: Wallet,      desc: 'Pay via Khalti digital wallet',  color: 'text-purple-600' },
    { value: 'esewa',  label: 'eSewa',             icon: CreditCard,  desc: 'Pay via eSewa digital wallet',   color: 'text-green-600' },
];

export default function Checkout({ items, total }: { items: CartItem[]; total: number }) {
    const { auth } = usePage<{ auth: { user: { address: string | null; phone: string | null } } }>().props;
    const form = useForm({ shipping_address: auth.user?.address ?? '', phone: auth.user?.phone ?? '', payment_method: 'cod' });

    return (
        <ShopLayout>
            <Head title="Checkout — Wood Kala" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="serif text-3xl font-bold mb-8">Checkout</motion.h1>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Form */}
                    <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onSubmit={e => { e.preventDefault(); form.post('/checkout'); }}
                        className="md:col-span-3 space-y-6">

                        {/* Shipping */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Truck className="w-5 h-5 text-primary" /> Shipping Details
                            </h2>
                            <div>
                                <label className="text-sm font-medium block mb-1.5">Phone Number</label>
                                <input className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                    value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} placeholder="98XXXXXXXX" required />
                                {form.errors.phone && <p className="text-destructive text-xs mt-1">{form.errors.phone}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1.5">Delivery Address</label>
                                <textarea className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none" rows={3}
                                    value={form.data.shipping_address} onChange={e => form.setData('shipping_address', e.target.value)}
                                    placeholder="Street, City, District..." required />
                                {form.errors.shipping_address && <p className="text-destructive text-xs mt-1">{form.errors.shipping_address}</p>}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="glass-card rounded-2xl p-6 space-y-3">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                            </h2>
                            {PAYMENT_METHODS.map(m => {
                                const Icon = m.icon;
                                const selected = form.data.payment_method === m.value;
                                return (
                                    <motion.label key={m.value} whileTap={!m.disabled ? { scale: 0.99 } : {}}
                                        className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'} ${m.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <input type="radio" name="payment_method" value={m.value} disabled={m.disabled}
                                            checked={selected} onChange={() => !m.disabled && form.setData('payment_method', m.value)} className="sr-only" />
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{m.label}</p>
                                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                                        </div>
                                        <AnimatePresence>
                                            {selected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.label>
                                );
                            })}

                            {/* Khalti info */}
                            <AnimatePresence>
                                {form.data.payment_method === 'khalti' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden">
                                        <div className="rounded-xl p-4 mt-2" style={{ background: '#F5F0FF', border: '1px solid #DDD6FE' }}>
                                            <p className="text-sm font-semibold mb-1" style={{ color: '#6d28d9' }}>Khalti Payment</p>
                                            <p className="text-xs" style={{ color: '#7c3aed' }}>
                                                You'll be redirected to Khalti's secure payment page after placing your order.
                                                Test credentials: <span className="font-mono font-bold">9800000000</span> / MPIN: <span className="font-mono font-bold">1111</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* eSewa info */}
                            <AnimatePresence>
                                {form.data.payment_method === 'esewa' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden">
                                        <div className="rounded-xl p-4 mt-2" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                            <p className="text-sm font-semibold mb-1 text-green-700">eSewa Payment</p>
                                            <p className="text-xs text-green-700">
                                                You'll be redirected to eSewa's secure payment page.
                                                Test ID: <span className="font-mono font-bold">9806800002</span> / Password: <span className="font-mono font-bold">Nepal@123</span> / MPIN: <span className="font-mono font-bold">1122</span>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button type="submit" disabled={form.processing}
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            className="w-full h-13 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg disabled:opacity-60 py-4">
                            <Lock className="w-4 h-4" />
                            {form.processing ? 'Placing Order...' : 'Place Order Securely'}
                        </motion.button>

                        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                            <Lock className="w-3 h-3" /> Your payment info is encrypted and secure
                        </p>
                    </motion.form>

                    {/* Summary */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-2">
                        <div className="glass-card rounded-2xl p-5 space-y-4 sticky top-20">
                            <h2 className="font-bold text-lg">Order Summary</h2>
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-accent rounded-xl overflow-hidden shrink-0">
                                            {item.product.images?.[0]
                                                ? <img src={imgSrc(item.product.images) ?? ''} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30 text-lg">🪑</div>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">रू {(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>रू {Number(total).toLocaleString()}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="text-green-600">Free</span></div>
                                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                                    <span>Total</span><span className="text-primary">रू {Number(total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ShopLayout>
    );
}
