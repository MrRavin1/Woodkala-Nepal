import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import SellerLayout from '@/layouts/seller-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { name: string }; }
interface Order {
    id: number; total: number; status: string; payment_method: string;
    payment_status: string; created_at: string;
    user: { name: string; email: string }; items: OrderItem[];
}
interface Paginated { data: Order[]; links: { url: string | null; label: string; active: boolean }[]; }

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];
const STATUS_STYLE: Record<string, { background: string; color: string }> = {
    pending:    { background: '#FEF9C3', color: '#854d0e' },
    processing: { background: '#EFF6FF', color: '#1d4ed8' },
    shipped:    { background: '#F5F3FF', color: '#6d28d9' },
    delivered:  { background: '#F0FDF4', color: '#15803d' },
    cancelled:  { background: '#FEF2F2', color: '#dc2626' },
};

function OrderRow({ order }: { order: Order }) {
    return (
        <tr style={{ borderBottom: '1px solid #F0EDE8' }}>
            <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">#{order.id}</td>
            <td className="px-4 py-3">
                <p className="text-sm font-medium text-[#1A1A1A]">{order.user.name}</p>
                <p className="text-xs text-[#9A8070]">{order.user.email}</p>
            </td>
            <td className="px-4 py-3">
                {order.items.map(i => <p key={i.id} className="text-xs text-[#6B5B4E]">{i.product.name} × {i.quantity}</p>)}
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-[#A67C52]">रू {Number(order.total).toLocaleString()}</td>
            <td className="px-4 py-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize" style={STATUS_STYLE[order.payment_status] ?? { background: '#F5F5F5', color: '#666' }}>
                    {order.payment_method} · {order.payment_status}
                </span>
            </td>
            <td className="px-4 py-3">
                <select
                    className="h-8 px-2 rounded-lg text-xs border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52]"
                    defaultValue={order.status}
                    onChange={e => router.patch(`/admin/orders/${order.id}`, { status: e.target.value }, { preserveScroll: true })}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </td>
            <td className="px-4 py-3 text-xs text-[#9A8070]">{new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
    );
}

export default function OrdersIndex({ orders }: { orders: Paginated }) {
    useEffect(() => {
        const interval = setInterval(() => router.reload({ only: ['orders'] }), 10000);
        return () => clearInterval(interval);
    }, []);
    return (
        <SellerLayout title="Orders">
            <Head title="Orders" />
            <div className="space-y-5">
                <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Orders</h1>
                <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['ID','Customer','Items','Total','Payment','Status','Date'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left" style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0
                                ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#9A8070]">No orders yet.</td></tr>
                                : orders.data.map(o => <OrderRow key={o.id} order={o} />)
                            }
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex gap-1 justify-center flex-wrap">
                    {orders.links.map((link, i) => (
                        <button key={i} disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                            className="px-3 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40"
                            style={link.active ? { background: '#A67C52', color: '#fff', borderColor: '#A67C52' } : { borderColor: '#E8DDD0', color: '#6B5B4E' }}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            </div>
        </SellerLayout>
    );
}
