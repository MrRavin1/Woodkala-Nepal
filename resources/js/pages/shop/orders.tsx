import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface OrderItem { id: number; product: { name: string; images: string[] | null } | null; }
interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; created_at: string; items: OrderItem[]; }

const STATUS: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    pending:    { label: 'Pending',    bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
    processing: { label: 'Processing', bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
    shipped:    { label: 'Shipped',    bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
    delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
    cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
};

export default function Orders({ orders }: { orders: Order[] }) {
    return (
        <ShopLayout>
            <Head title="My Orders — Wood Kala" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="serif text-3xl font-bold mb-2">My Orders</motion.h1>
                <p className="text-muted-foreground text-sm mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

                {orders.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="wood-card py-20 text-center space-y-4">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                            <Package className="w-16 h-16 mx-auto text-muted-foreground/40" />
                        </motion.div>
                        <p className="serif text-xl font-bold">No orders yet</p>
                        <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition">
                            <ShoppingBag className="w-4 h-4" /> Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order, i) => {
                            const s = STATUS[order.status] ?? STATUS.pending;
                            return (
                                <motion.div key={order.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                                    <Link href={`/orders/${order.id}`}
                                        className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300 group">

                                        {/* Product image stack */}
                                        <div className="flex -space-x-2 shrink-0">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white bg-muted shadow-sm"
                                                    style={{ zIndex: 3 - idx }}>
                                                    {item.product?.images?.[0]
                                                        ? <img src={`/storage/${item.product.images[0]}`} alt="" className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-primary/40" />
                                                          </div>
                                                    }
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-12 h-12 rounded-xl border-2 border-white bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-sm">Order #{order.id}</p>
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                                                    {s.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                {order.items.map(i => i.product?.name).filter(Boolean).join(', ')}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {' · '}{order.payment_method.toUpperCase()}
                                                {' · '}<span className={order.payment_status === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                                                    {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Price + arrow */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <p className="font-bold text-primary">रू {Number(order.total).toLocaleString()}</p>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
