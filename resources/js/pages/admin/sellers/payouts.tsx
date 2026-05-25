import { Head, Link } from '@inertiajs/react';
import { Wallet, ArrowLeft, TrendingUp, BadgeDollarSign, Scale } from 'lucide-react';
import SellerLayout from '@/layouts/seller-layout';

interface Payout {
    id: number;
    amount: string;
    note: string | null;
    created_at: string;
    recorded_by: { name: string } | null;
}

interface Seller { id: number; name: string; shop_name: string | null; email: string; }

const fmt = (n: number) => `Rs. ${n.toLocaleString('en-NP', { minimumFractionDigits: 2 })}`;

export default function SellerPayouts({ seller, payouts, revenue, total_paid, balance }: {
    seller: Seller; payouts: Payout[]; revenue: number; total_paid: number; balance: number;
}) {
    return (
        <SellerLayout title="Payout History">
            <Head title={`Payouts — ${seller.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/sellers" className="p-2 rounded-xl hover:bg-[#F5F0EB] transition-colors" style={{ color: '#6B5B4E' }}>
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{seller.name}</h1>
                        <p className="text-xs" style={{ color: '#9A8070' }}>{seller.shop_name || seller.email}</p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Revenue',   value: fmt(revenue),    icon: TrendingUp,      color: '#A67C52', bg: '#FDF0E6' },
                        { label: 'Total Paid Out',  value: fmt(total_paid), icon: BadgeDollarSign, color: '#15803d', bg: '#dcfce7' },
                        { label: 'Pending Balance', value: fmt(balance),    icon: Scale,           color: balance >= 0 ? '#1d4ed8' : '#dc2626', bg: balance >= 0 ? '#dbeafe' : '#fee2e2' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#fff', border: '1px solid #E8DDD0' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                                <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div>
                                <p className="text-xs font-medium" style={{ color: '#9A8070' }}>{label}</p>
                                <p className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E8DDD0' }}>
                    <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: '#E8DDD0' }}>
                        <Wallet className="w-4 h-4" style={{ color: '#A67C52' }} />
                        <h2 className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Payout Records</h2>
                        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#FDF0E6', color: '#A67C52' }}>
                            {payouts.length} transactions
                        </span>
                    </div>

                    {payouts.length === 0 ? (
                        <div className="py-16 text-center" style={{ color: '#9A8070' }}>
                            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No payouts recorded yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: '#FDF9F5', color: '#9A8070' }}>
                                    <th className="px-6 py-3 text-left font-medium">#</th>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Amount</th>
                                    <th className="px-6 py-3 text-left font-medium">Note</th>
                                    <th className="px-6 py-3 text-left font-medium">Recorded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((p, i) => (
                                    <tr key={p.id} className="border-t" style={{ borderColor: '#F0EAE2' }}>
                                        <td className="px-6 py-3 font-medium" style={{ color: '#6B5B4E' }}>{i + 1}</td>
                                        <td className="px-6 py-3" style={{ color: '#6B5B4E' }}>
                                            {new Date(p.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3 font-semibold" style={{ color: '#15803d' }}>
                                            {fmt(parseFloat(p.amount))}
                                        </td>
                                        <td className="px-6 py-3" style={{ color: '#6B5B4E' }}>{p.note ?? '—'}</td>
                                        <td className="px-6 py-3" style={{ color: '#6B5B4E' }}>{p.recorded_by?.name ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
