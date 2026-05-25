import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Store, User, Phone, CreditCard, Building2, Camera } from 'lucide-react';
import SellerLayout from '@/layouts/seller-layout';

interface Seller {
    name: string; email: string; phone: string | null;
    shop_name: string | null; shop_description: string | null;
    bank_name: string | null; bank_account_number: string | null;
    bank_account_name: string | null; bank_branch: string | null;
    avatar: string | null;
}

export default function SellerProfile({ seller }: { seller: Seller }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const avatarSrc = preview ?? (seller.avatar ? `/storage/${seller.avatar}` : null);

    const form = useForm({
        name: seller.name ?? '',
        phone: seller.phone ?? '',
        shop_name: seller.shop_name ?? '',
        shop_description: seller.shop_description ?? '',
        bank_name: seller.bank_name ?? '',
        bank_account_number: seller.bank_account_number ?? '',
        bank_account_name: seller.bank_account_name ?? '',
        bank_branch: seller.bank_branch ?? '',
        avatar: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.patch('/seller/profile', { forceFormData: true });
    }

    const inputCls = "w-full h-10 px-3 rounded-lg text-sm outline-none border border-[#E8DDD0] bg-white focus:border-[#A67C52] transition-colors";
    const textareaCls = "w-full px-3 py-2.5 rounded-lg text-sm outline-none border border-[#E8DDD0] bg-white focus:border-[#A67C52] transition-colors resize-none";

    return (
        <SellerLayout title="Shop Profile">
            <Head title="Shop Profile — Wood Kala" />
            <div className="max-w-2xl space-y-5">

                {/* Avatar */}
                <section className="bg-white rounded-2xl border border-[#E8DDD0] p-5">
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
                                style={{ background: '#A67C52' }}>
                                {avatarSrc ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" /> : seller.name[0].toUpperCase()}
                            </div>
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                                style={{ background: '#A67C52' }}>
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                onChange={e => {
                                    const f = e.target.files?.[0];
                                    if (f) { setPreview(URL.createObjectURL(f)); form.setData('avatar', f); }
                                }} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{seller.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>{seller.email}</p>
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="text-xs mt-2 font-medium hover:underline" style={{ color: '#A67C52' }}>
                                {avatarSrc ? 'Change photo' : 'Upload photo'} — JPG, PNG up to 2MB
                            </button>
                        </div>
                    </div>
                </section>

                {/* Personal Info */}
                <section className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E8DDD0]">
                        <User className="w-4 h-4 text-[#A67C52]" />
                        <h2 className="font-semibold text-sm">Personal Information</h2>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Full Name</label>
                            <input className={inputCls} value={form.data.name} onChange={e => form.setData('name', e.target.value)} />
                            {form.errors.name && <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Email</label>
                            <input className={inputCls + ' opacity-60 cursor-not-allowed'} value={seller.email} disabled />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A8070]" />
                                <input className={inputCls + ' pl-9'} value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} placeholder="98XXXXXXXX" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Shop Info */}
                <section className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E8DDD0]">
                        <Store className="w-4 h-4 text-[#A67C52]" />
                        <h2 className="font-semibold text-sm">Shop Information</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Shop Name</label>
                            <input className={inputCls} value={form.data.shop_name} onChange={e => form.setData('shop_name', e.target.value)} placeholder="e.g. Himalayan Wood Works" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Shop Description</label>
                            <textarea className={textareaCls} rows={3} value={form.data.shop_description} onChange={e => form.setData('shop_description', e.target.value)} placeholder="Tell buyers about your shop..." />
                        </div>
                    </div>
                </section>

                {/* Bank Details */}
                <section className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E8DDD0]">
                        <CreditCard className="w-4 h-4 text-[#A67C52]" />
                        <h2 className="font-semibold text-sm">Bank Details</h2>
                        <span className="ml-auto text-xs text-[#9A8070]">For payouts</span>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Bank Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A8070]" />
                                <input className={inputCls + ' pl-9'} value={form.data.bank_name} onChange={e => form.setData('bank_name', e.target.value)} placeholder="e.g. NIC Asia Bank" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Branch</label>
                            <input className={inputCls} value={form.data.bank_branch} onChange={e => form.setData('bank_branch', e.target.value)} placeholder="e.g. Kathmandu" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Account Name</label>
                            <input className={inputCls} value={form.data.bank_account_name} onChange={e => form.setData('bank_account_name', e.target.value)} placeholder="Account holder name" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#7A6A5A] mb-1.5">Account Number</label>
                            <input className={inputCls} value={form.data.bank_account_number} onChange={e => form.setData('bank_account_number', e.target.value)} placeholder="XXXXXXXXXXXXXXXX" />
                        </div>
                    </div>
                </section>

                {/* Save */}
                <button type="button" onClick={submit} disabled={form.processing}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                    style={{ background: '#A67C52' }}>
                    {form.processing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </SellerLayout>
    );
}
