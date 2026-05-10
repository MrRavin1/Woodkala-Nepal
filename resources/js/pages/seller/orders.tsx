import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Search, X, ChevronDown, MapPin, Phone, CreditCard, Package } from 'lucide-react';
import SellerLayout from '@/layouts/seller-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { id: number; name: string; slug: string; images: string[] | null }; }
interface Order {
    id: number; total: number; status: string; payment_method: string; payment_status: string;
    shipping_address: string; phone: string; created_at: string;
    user: { name: string; email: string };
    items: OrderItem[];
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_CLS: Record<string, { bg: string; color: string }> = {
    pending:    { bg: '#fef9c3', color: '#854d0e' },
    processing: { bg: '#dbeafe', color: '#1d4ed8' },
    shipped:    { bg: '#ede9fe', color: '#6d28d9' },
    delivered:  { bg: '#dcfce7', color: '#15803d' },
    cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};
const PAY_CLS: Record<string, { bg: string; color: string }> = {
    paid:   { bg: '#dcfce7', color: '#15803d' },
    unpaid: { bg: '#fee2e2', color: '#dc2626' },
};

function OrderRow({ order, expanded, onToggle }: { order: Order; expanded: boolean; onToggle: () => void }) {
    const form = useForm({ status: order.status });
    const s = STATUS_CLS[order.status] ?? { bg: '#f1f5f9', color: '#475569' };
    const p = PAY_CLS[order.payment_status] ?? { bg: '#f1f5f9', color: '#475569' };

    return (
        <>
            <tr
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={onToggle}
            >
                <td className="px-5 py-3 font-semibold text-slate-800">#{order.id}</td>
                <td className="px-5 py-3">
                    <p className="font-medium text-slate-700 text-sm">{order.user.name}</p>
                    <p className="text-xs text-slate-400">{order.user.email}</p>
                </td>
                <td className="px-5 py-3 text-slate-500 text-xs">
                    {order.items.map(i => (
                        <p key={i.id}>
                            <Link
                                href={`/shop/${i.product.slug}`}
                                className="text-amber-700 hover:underline font-medium"
                                onClick={e => e.stopPropagation()}
                            >
                                {i.product.name}
                            </Link>
                            {' '}×{i.quantity}
                        </p>
                    ))}
                </td>
                <td className="px-5 py-3 font-semibold text-slate-800">रू {Number(order.total).toLocaleString()}</td>
                <td className="px-5 py-3 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: p.bg, color: p.color }}>
                        {order.payment_status}
                    </span>
                </td>
                <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
                        value={form.data.status}
                        onChange={e => {
                            form.setData('status', e.target.value);
                            form.patch(`/seller/orders/${order.id}`, { preserveScroll: true });
                        }}
                    >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </td>
                <td className="px-5 py-3">
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </td>
            </tr>

            {expanded && (
                <tr>
                    <td colSpan={8} className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Shipping</p>
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                                    <span>{order.shipping_address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                                    <span>{order.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                                    <span className="uppercase">{order.payment_method}</span>
                                </div>
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Items</p>
                                <div className="space-y-2">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                                {item.product.images?.[0]
                                                    ? <img src={`/storage/${item.product.images[0]}`} alt="" className="w-full h-full object-cover" />
                                                    : <Package className="w-5 h-5 m-2.5 text-slate-400" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/shop/${item.product.slug}`} className="text-sm font-medium text-amber-700 hover:underline truncate block">
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-xs text-slate-400">Qty: {item.quantity} × रू {Number(item.price).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700">रू {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function SellerOrders({ orders }: { orders: Order[] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const filtered = orders.filter(o => {
        const matchStatus  = statusFilter === 'all' || o.status === statusFilter;
        const matchPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;
        const q = search.toLowerCase();
        const matchSearch = !q || o.user.name.toLowerCase().includes(q) || String(o.id).includes(q)
            || o.items.some(i => i.product.name.toLowerCase().includes(q));
        return matchStatus && matchPayment && matchSearch;
    });

    const hasFilters = search || statusFilter !== 'all' || paymentFilter !== 'all';

    return (
        <SellerLayout title="Orders">
            <Head title="Orders — Seller Panel" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} for your products</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400/40"
                            placeholder="Search by order #, customer, product…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <select
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/40"
                        value={paymentFilter}
                        onChange={e => setPaymentFilter(e.target.value)}
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                    {hasFilters && (
                        <button
                            onClick={() => { setSearch(''); setStatusFilter('all'); setPaymentFilter('all'); }}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <X className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 text-sm">
                                {hasFilters ? 'No orders match your filters.' : 'No orders yet. Orders for your products will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
                                        <th className="px-5 py-3">Order</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Items</th>
                                        <th className="px-5 py-3">Total</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Payment</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 w-8" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(o => (
                                        <OrderRow
                                            key={o.id}
                                            order={o}
                                            expanded={expandedId === o.id}
                                            onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {hasFilters && filtered.length > 0 && (
                    <p className="text-xs text-slate-400 text-right">Showing {filtered.length} of {orders.length} orders</p>
                )}
            </div>
        </SellerLayout>
    );
}
