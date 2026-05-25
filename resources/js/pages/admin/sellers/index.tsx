import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { useState } from 'react';
import { Store, CreditCard, X, BadgeCheck, Ban, Clock, ShieldCheck } from 'lucide-react';

interface Seller {
    id: number; name: string; email: string; phone: string | null;
    role: string;
    shop_name: string | null; shop_description: string | null;
    shop_registration_number: string | null; shop_registration_image: string | null;
    bank_name: string | null; bank_account_number: string | null;
    bank_account_name: string | null; bank_branch: string | null;
    id_type: string | null; id_number: string | null;
    seller_status: string | null; products_count: number;
    total_revenue: number; total_orders: number; created_at: string;
}

const STATUS_STYLE: Record<string, { background: string; color: string; icon: React.ElementType }> = {
    approved:  { background: '#F0FDF4', color: '#15803d', icon: BadgeCheck },
    pending:   { background: '#FEF9C3', color: '#854d0e', icon: Clock },
    suspended: { background: '#FEF2F2', color: '#dc2626', icon: Ban },
};

function PayoutModal({ seller, onClose }: { seller: Seller; onClose: () => void }) {
    const form = useForm({ amount: '', payout_note: '' });
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E8DDD0] shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>Record Payout</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F0EB]" style={{ color: '#6B5B4E' }}><X className="w-4 h-4" /></button>
                </div>
                <div className="rounded-xl p-4 space-y-2" style={{ background: '#FDF9F5', border: '1px solid #E8DDD0' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A8070' }}>Bank Details</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><p className="text-xs text-[#9A8070]">Bank</p><p className="font-medium text-[#1A1A1A]">{seller.bank_name || '—'}</p></div>
                        <div><p className="text-xs text-[#9A8070]">Branch</p><p className="font-medium text-[#1A1A1A]">{seller.bank_branch || '—'}</p></div>
                        <div><p className="text-xs text-[#9A8070]">Account Name</p><p className="font-medium text-[#1A1A1A]">{seller.bank_account_name || '—'}</p></div>
                        <div><p className="text-xs text-[#9A8070]">Account No.</p><p className="font-medium text-[#1A1A1A]">{seller.bank_account_number || '—'}</p></div>
                    </div>
                </div>
                <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: '#FDF0E6' }}>
                    <span className="text-sm font-medium" style={{ color: '#6B5B4E' }}>Total Revenue</span>
                    <span className="font-bold" style={{ color: '#A67C52' }}>रू {Number(seller.total_revenue).toLocaleString()}</span>
                </div>
                <form onSubmit={e => { e.preventDefault(); form.patch(`/admin/sellers/${seller.id}/payout`, { onSuccess: onClose }); }} className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Amount (Rs.) *</label>
                        <input type="number" min="0.01" step="0.01" required
                            className="w-full h-10 px-3 rounded-lg text-sm border border-[#E8DDD0] bg-white outline-none focus:border-[#A67C52]"
                            value={form.data.amount} onChange={e => form.setData('amount', e.target.value)}
                            placeholder="e.g. 15000" />
                        {form.errors.amount && <p className="text-xs text-red-500 mt-1">{form.errors.amount}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Note</label>
                        <input className="w-full h-10 px-3 rounded-lg text-sm border border-[#E8DDD0] bg-white outline-none focus:border-[#A67C52]"
                            value={form.data.payout_note} onChange={e => form.setData('payout_note', e.target.value)}
                            placeholder="e.g. March payout" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm border border-[#E8DDD0] text-[#6B5B4E] hover:bg-[#F5F0EB]">Cancel</button>
                        <button type="submit" disabled={form.processing} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#A67C52' }}>
                            Record Payout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SellersIndex({ sellers }: { sellers: Seller[] }) {
    const [payoutSeller, setPayoutSeller] = useState<Seller | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const statusForm = useForm({ seller_status: '' });

    function changeStatus(seller: Seller, status: string) {
        statusForm.setData('seller_status', status);
        statusForm.patch(`/admin/sellers/${seller.id}/status`, { preserveScroll: true });
    }

    const approved  = sellers.filter(s => s.seller_status === 'approved').length;
    const pending   = sellers.filter(s => s.seller_status === 'pending' || !s.seller_status).length;
    const suspended = sellers.filter(s => s.seller_status === 'suspended').length;

    return (
        <SellerLayout title="Sellers">
            <Head title="Sellers" />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Seller Management</h1>
                    <div className="flex gap-2 text-xs font-medium">
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#15803d' }}>{approved} Approved</span>
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#FEF9C3', color: '#854d0e' }}>{pending} Pending</span>
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#FEF2F2', color: '#dc2626' }}>{suspended} Suspended</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    {sellers.length === 0 && (
                        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-10 text-center text-sm" style={{ color: '#9A8070' }}>No sellers yet.</div>
                    )}
                    {sellers.map(seller => {
                        const status = seller.seller_status || 'pending';
                        const S = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
                        const StatusIcon = S.icon;
                        const isExpanded = expandedId === seller.id;
                        return (
                            <div key={seller.id} className="bg-white rounded-2xl border border-[#E8DDD0] p-5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FDF0E6' }}>
                                            <Store className="w-5 h-5" style={{ color: '#A67C52' }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{seller.name}</p>
                                                {seller.role === 'pending_seller' && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FEF9C3', color: '#854d0e' }}>AWAITING REVIEW</span>
                                                )}
                                            </div>
                                            <p className="text-xs" style={{ color: '#A67C52' }}>{seller.shop_name || 'No shop name'}</p>
                                            <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>{seller.email} · {seller.phone || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: S.background, color: S.color }}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </span>
                                        {status !== 'approved' && (
                                            <button onClick={() => changeStatus(seller, 'approved')}
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                                style={{ background: '#F0FDF4', color: '#15803d' }}>
                                                ✓ Approve
                                            </button>
                                        )}
                                        {status !== 'suspended' && (
                                            <button onClick={() => changeStatus(seller, 'suspended')}
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                                style={{ background: '#FEF2F2', color: '#dc2626' }}>
                                                ✕ Suspend
                                            </button>
                                        )}
                                        {status === 'suspended' && (
                                            <button onClick={() => changeStatus(seller, 'pending')}
                                                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                                style={{ background: '#FEF9C3', color: '#854d0e' }}>
                                                ↺ Reinstate
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Identity info for pending review */}
                                {(seller.id_type || seller.id_number) && (
                                    <div className="mt-3">
                                        <button onClick={() => setExpandedId(isExpanded ? null : seller.id)}
                                            className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#A67C52' }}>
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            {isExpanded ? 'Hide' : 'View'} Identity & Bank Details
                                        </button>
                                        {isExpanded && (
                                            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl p-4 text-xs" style={{ background: '#FDF9F5', border: '1px solid #E8DDD0' }}>
                                                <div><p className="text-[#9A8070]">ID Type</p><p className="font-medium capitalize">{seller.id_type || '—'}</p></div>
                                                <div><p className="text-[#9A8070]">ID Number</p><p className="font-medium">{seller.id_number || '—'}</p></div>
                                                <div><p className="text-[#9A8070]">Bank</p><p className="font-medium">{seller.bank_name || '—'}</p></div>
                                                <div><p className="text-[#9A8070]">Account No.</p><p className="font-medium">{seller.bank_account_number || '—'}</p></div>
                                                <div><p className="text-[#9A8070]">Account Name</p><p className="font-medium">{seller.bank_account_name || '—'}</p></div>
                                                <div><p className="text-[#9A8070]">Branch</p><p className="font-medium">{seller.bank_branch || '—'}</p></div>
                                                {seller.shop_registration_number && (
                                                    <div><p className="text-[#9A8070]">Reg. Number</p><p className="font-medium">{seller.shop_registration_number}</p></div>
                                                )}
                                                {seller.shop_registration_image && (
                                                    <div className="col-span-2">
                                                        <p className="text-[#9A8070] mb-1">Registration Document</p>
                                                        <a href={`/storage/${seller.shop_registration_image}`} target="_blank" rel="noopener noreferrer">
                                                            <img src={`/storage/${seller.shop_registration_image}`} alt="Registration document"
                                                                className="max-h-48 rounded-lg border border-[#E8DDD0] object-contain" />
                                                        </a>
                                                    </div>
                                                )}
                                                {seller.shop_description && (
                                                    <div className="col-span-2"><p className="text-[#9A8070]">Shop Description</p><p className="font-medium">{seller.shop_description}</p></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Products', value: seller.products_count },
                                        { label: 'Orders',   value: seller.total_orders },
                                        { label: 'Revenue',  value: `रू ${Number(seller.total_revenue).toLocaleString()}` },
                                    ].map(s => (
                                        <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#FDF9F5' }}>
                                            <p className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{s.value}</p>
                                            <p className="text-xs" style={{ color: '#9A8070' }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6B5B4E' }}>
                                        <CreditCard className="w-3.5 h-3.5" style={{ color: '#A67C52' }} />
                                        {seller.bank_name
                                            ? <span>{seller.bank_name} · {seller.bank_account_number}</span>
                                            : <span className="italic" style={{ color: '#9A8070' }}>No bank details added</span>
                                        }
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={`/admin/sellers/${seller.id}/payouts`}
                                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E8DDD0] transition-all"
                                            style={{ color: '#6B5B4E' }}>
                                            Payout History
                                        </a>
                                        {seller.seller_status === 'approved' && (
                                            <button onClick={() => setPayoutSeller(seller)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                                                style={{ background: '#A67C52' }}>
                                                <CreditCard className="w-3.5 h-3.5" /> Record Payout
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {payoutSeller && <PayoutModal seller={payoutSeller} onClose={() => setPayoutSeller(null)} />}
        </SellerLayout>
    );
}
