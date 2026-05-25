import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ShoppingBag, Package, CheckCircle, Clock, Heart, ChevronRight, RotateCcw } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Stats { total_orders: number; total_spent: number; delivered: number; pending: number; }
interface Order { id: number; total: number; status: string; created_at: string; items: { id: number }[]; }
interface WishlistItem { id: number; product: { id: number; name: string; slug: string; price: number; images: string[] | null; category: { name: string } }; }

const STATUS_CLS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function StatCard({ icon, label, value, sub, delay }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; delay: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
                {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
            </div>
        </motion.div>
    );
}

export default function BuyerDashboard({ stats, recent, wishlist }: { stats: Stats; recent: Order[]; wishlist: WishlistItem[] }) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;
    const reorderForm = useForm({});

    return (
        <ShopLayout>
            <Head title="My Dashboard — Wood Kala" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* Welcome */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="serif text-3xl font-bold">Welcome back, {auth.user.name.split(' ')[0]}</h1>
                    <p className="text-muted-foreground mt-1">Here's a summary of your activity.</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={stats.total_orders} delay={0} />
                    <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Delivered" value={stats.delivered} delay={0.07} />
                    <StatCard icon={<Clock className="w-5 h-5" />} label="In Progress" value={stats.pending} delay={0.14} />
                    <StatCard icon={<Package className="w-5 h-5" />} label="Total Spent" value={`रू ${Number(stats.total_spent).toLocaleString()}`} delay={0.21} />
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Recent Orders */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="lg:col-span-3 glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg">Recent Orders</h2>
                            <Link href="/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View all <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        {recent.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground text-sm">No orders yet.</div>
                        ) : (
                            <div className="space-y-2">
                                {recent.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent transition-colors group">
                                        <Link href={`/orders/${order.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <Package className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm">Order #{order.id}</p>
                                                <p className="text-xs text-muted-foreground">{order.items.length} item(s) · {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </Link>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLS[order.status] ?? STATUS_CLS.pending}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <p className="text-sm font-bold text-primary hidden sm:block">रू {Number(order.total).toLocaleString()}</p>
                                            <button onClick={() => reorderForm.post(`/orders/${order.id}/reorder`)}
                                                title="Reorder" className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Wishlist preview */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
                        className="lg:col-span-2 glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Wishlist
                            </h2>
                            <Link href="/wishlist" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View all <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        {wishlist.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground text-sm">
                                <Heart className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                                No saved items yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {wishlist.map(item => (
                                    <Link key={item.id} href={`/shop/${item.product.slug}`}
                                        className="group rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors">
                                        <div className="aspect-square bg-muted overflow-hidden">
                                            {item.product.images?.[0]
                                                ? <img src={imgSrc(item.product.images) ?? ''} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&h=200&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-40" />
                                            }
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-primary font-bold">रू {Number(item.product.price).toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quick links */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { href: '/shop', label: 'Browse Shop', icon: <ShoppingBag className="w-5 h-5" /> },
                        { href: '/orders', label: 'My Orders', icon: <Package className="w-5 h-5" /> },
                        { href: '/wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
                        { href: '/settings/profile', label: 'Profile', icon: <CheckCircle className="w-5 h-5" /> },
                    ].map(link => (
                        <Link key={link.href} href={link.href}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group">
                            <span className="text-primary group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </ShopLayout>
    );
}
