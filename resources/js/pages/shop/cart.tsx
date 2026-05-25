import { imgSrc } from '@/lib/img';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, RotateCcw, Flame } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Product    { id: number; name: string; slug: string; price: number; images: string[] | null; category?: { name: string }; }
interface CartItem   { id: number; quantity: number; product: Product; }

const CART_LS_KEY = 'woodkala_cart_preview';

function Thumb({ images, name }: { images: string[] | null; name: string }) {
    return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted shrink-0">
            {images?.[0]
                ? <img src={imgSrc(images) ?? ''} alt={name} className="w-full h-full object-cover" />
                : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop&q=60" alt="furniture" className="w-full h-full object-cover opacity-50" />
            }
        </div>
    );
}

function QtyControl({ item }: { item: CartItem }) {
    const form = useForm({ quantity: item.quantity });
    function change(qty: number) {
        form.setData('quantity', qty);
        form.patch(`/cart/${item.id}`, { preserveScroll: true });
    }
    return (
        <div className="flex items-center bg-muted rounded-xl overflow-hidden border border-border">
            <button onClick={() => change(Math.max(1, item.quantity - 1))}
                className="px-3 py-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 text-sm font-bold min-w-[2.5rem] text-center">{item.quantity}</span>
            <button onClick={() => change(item.quantity + 1)}
                className="px-3 py-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export default function Cart({ items, total, trending = [] }: { items: CartItem[]; total: number; trending?: Product[] }) {
    const removeForm = useForm({});
    const { auth } = usePage<{ auth: { user: unknown } }>().props;

    // Persist cart preview to localStorage for guest users
    useEffect(() => {
        if (!auth.user && items.length === 0) return;
        const preview = items.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, qty: i.quantity }));
        localStorage.setItem(CART_LS_KEY, JSON.stringify(preview));
    }, [items]);

    return (
        <ShopLayout>
            <Head title="Cart — Wood Kala" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="serif text-3xl font-bold mb-8">Shopping Cart</motion.h1>

                <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }} className="space-y-10">
                            <div className="wood-card py-16 flex flex-col items-center gap-5 text-center">
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl">
                                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&q=80" alt="empty cart" className="w-full h-full object-cover" />
                                </motion.div>
                                <div>
                                    <p className="serif text-2xl font-bold">Your cart is empty</p>
                                    <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                                        But these trending pieces are flying off the shelves right now!
                                    </p>
                                </div>
                                <Link href="/shop"
                                    className="pulse-oak inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold hover:brightness-110 transition shadow-lg">
                                    <ShoppingBag className="w-4 h-4" /> Start Browsing
                                </Link>
                            </div>

                            {trending.length > 0 && (
                                <div>
                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4"><Flame className="w-3.5 h-3.5" /> Trending Right Now</p>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {trending.map((p, i) => (
                                            <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                                                <Link href={`/shop/${p.slug}`}
                                                    className="flex-1 min-w-[140px] group block rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                                                    <div className="aspect-square bg-muted overflow-hidden">
                                                        {p.images?.[0]
                                                            ? <img src={imgSrc(p.images) ?? ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop&q=60" alt="furniture" className="w-full h-full object-cover opacity-50" />
                                                        }
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-xs font-semibold truncate">{p.name}</p>
                                                        <p className="text-primary font-bold text-sm mt-0.5">रू {Number(p.price).toLocaleString()}</p>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-3 gap-8 items-start">

                            {/* ── Left: Items ── */}
                            <div className="lg:col-span-2 space-y-3">
                                <AnimatePresence>
                                    {items.map(item => (
                                        <motion.div key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="wood-card p-4 sm:p-5 flex gap-4 items-center group">
                                            <Thumb images={item.product.images} name={item.product.name} />
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="font-semibold truncate">{item.product.name}</p>
                                                <p className="text-primary font-bold">रू {Number(item.product.price).toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground hidden sm:block">
                                                    Subtotal: <span className="font-semibold text-foreground">रू {(item.product.price * item.quantity).toLocaleString()}</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3 shrink-0">
                                                <QtyControl item={item} />
                                                <button
                                                    onClick={() => removeForm.delete(`/cart/${item.id}`, { preserveScroll: true })}
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* ── Right: Sticky Summary ── */}
                            <div className="space-y-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="glass-card rounded-2xl p-6 space-y-5 sticky top-24">
                                    <h2 className="serif font-bold text-lg">Order Summary</h2>

                                    <div className="space-y-2.5 text-sm">
                                        {items.map(i => (
                                            <div key={i.id} className="flex justify-between text-muted-foreground">
                                                <span className="truncate max-w-[150px]">{i.product.name} ×{i.quantity}</span>
                                                <span className="font-medium text-foreground">रू {(i.product.price * i.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-border pt-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Subtotal</span>
                                            <span>रू {Number(total).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Delivery</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                                            <span>Total</span>
                                            <motion.span key={total} initial={{ scale: 1.15, color: '#A67C52' }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}
                                                className="text-primary">
                                                रू {Number(total).toLocaleString()}
                                            </motion.span>
                                        </div>
                                    </div>

                                    <Link href="/checkout"
                                        className="pulse-oak w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 transition shadow-lg">
                                        Checkout <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <Link href="/shop" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                                        ← Continue Shopping
                                    </Link>

                                    {/* Trust badges */}
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                                        {[
                                            { icon: <Truck className="w-3.5 h-3.5" />, label: 'Free Delivery' },
                                            { icon: <Shield className="w-3.5 h-3.5" />, label: 'Secure Pay' },
                                            { icon: <RotateCcw className="w-3.5 h-3.5" />, label: 'Easy Returns' },
                                        ].map(b => (
                                            <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                                                <div className="text-primary">{b.icon}</div>
                                                <p className="text-[10px] text-muted-foreground leading-tight">{b.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {trending.length > 0 && (
                                    <div className="wood-card p-4 space-y-3">
                                        <p className="text-xs font-semibold text-primary uppercase tracking-widest">You Might Also Like</p>
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {trending.map(p => (
                                                <Link key={p.id} href={`/shop/${p.slug}`}
                                                    className="flex-1 min-w-[90px] group block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all">
                                                    <div className="aspect-square bg-muted overflow-hidden">
                                                        {p.images?.[0]
                                                            ? <img src={imgSrc(p.images) ?? ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                            : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop&q=60" alt="furniture" className="w-full h-full object-cover opacity-50" />
                                                        }
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-[10px] font-semibold truncate">{p.name}</p>
                                                        <p className="text-primary font-bold text-xs">रू {Number(p.price).toLocaleString()}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ShopLayout>
    );
}
