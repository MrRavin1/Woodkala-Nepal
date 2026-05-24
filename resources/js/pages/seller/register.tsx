import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Store, Package, TrendingUp, Truck, CheckCircle2, Building2, CreditCard, User, ChevronRight, ChevronLeft, ShieldCheck, Clock } from 'lucide-react';

const INPUT = 'w-full h-11 bg-muted border border-border rounded-xl px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground';
const LABEL = 'text-sm font-semibold block mb-1.5';

const STEPS = [
    { title: 'Shop Info',     icon: Store,     desc: 'Basic shop details' },
    { title: 'Bank Account',  icon: Building2, desc: 'Payment information' },
    { title: 'Identity',      icon: ShieldCheck, desc: 'Verify your identity' },
];

const BANKS = [
    'Nepal Bank Limited', 'Rastriya Banijya Bank', 'Agriculture Development Bank',
    'Nabil Bank', 'Nepal Investment Mega Bank', 'Standard Chartered Bank Nepal',
    'Himalayan Bank', 'Nepal SBI Bank', 'Nepal Bangladesh Bank', 'Everest Bank',
    'Bank of Kathmandu', 'Citizens Bank International', 'Prime Commercial Bank',
    'Sunrise Bank', 'NIC Asia Bank', 'Machhapuchchhre Bank', 'Kumari Bank',
    'Laxmi Sunrise Bank', 'Siddhartha Bank', 'Global IME Bank', 'Sanima Bank',
    'Mega Bank Nepal', 'Civil Bank', 'Century Commercial Bank', 'Prabhu Bank',
];

const slide = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

function PendingApprovalScreen() {
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/seller/approval-status');
                const data = await res.json();
                if (data.approved) {
                    setApproved(true);
                    clearInterval(interval);
                    setTimeout(() => { window.location.href = '/seller/dashboard'; }, 1500);
                }
            } catch {}
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card rounded-2xl p-10 text-center space-y-4">
            {approved ? (
                <>
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-green-700">Account Approved!</h2>
                    <p className="text-muted-foreground text-sm">Redirecting you to your seller dashboard...</p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-[#FDF0E6] flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-[#A67C52]" />
                    </div>
                    <h2 className="text-xl font-bold">Application Under Review</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Your seller application has been submitted. Our admin team will review your details and approve your account shortly.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52] animate-pulse" />
                        Checking for approval automatically...
                    </div>
                    <div className="bg-muted rounded-xl p-4 text-xs text-left space-y-1">
                        <p className="font-semibold">What happens next?</p>
                        <p>• Admin reviews your shop info, bank details & ID</p>
                        <p>• Once approved, you can start listing products</p>
                        <p>• This page will automatically redirect you</p>
                    </div>
                    <Link href="/shop" className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
                        ← Continue browsing as buyer
                    </Link>
                </>
            )}
        </div>
    );
}

export default function SellerRegister({ pendingApproval = false }: { pendingApproval?: boolean }) {
    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const [regImage, setRegImage] = useState<File | null>(null);

    const form = useForm({
        // Step 1
        shop_name: '', shop_description: '', phone: '',
        shop_registration_number: '',
        // Step 2
        bank_name: '', bank_account_number: '', bank_account_name: '', bank_branch: '',
        // Step 3
        id_type: 'citizenship', id_number: '',
    });

    function go(next: number) {
        setDir(next > step ? 1 : -1);
        setStep(next);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.transform(data => ({ ...data, shop_registration_image: regImage }));
        form.post('/seller/register', { forceFormData: true });
    }

    // Per-step required field check
    const step1Valid = form.data.shop_name.trim() && form.data.phone.trim();
    const step2Valid = form.data.bank_name && form.data.bank_account_number.trim() && form.data.bank_account_name.trim();
    const step3Valid = form.data.id_number.trim();

    return (
        <>
            <Head title="Set Up Your Shop — Wood Kala" />
            <div className="min-h-screen flex bg-background">

                {/* Left panel */}
                <div className="hidden lg:flex w-[400px] shrink-0 bg-[#1A1A1A] flex-col justify-between p-10 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&q=80"
                        alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#C49A6C] to-[#8B6340] rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Wood Kala</p>
                            <p className="text-[#C49A6C] text-[10px] font-semibold uppercase tracking-widest">Seller Panel</p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-xs font-bold text-[#C49A6C] uppercase tracking-widest mb-3">Almost there!</p>
                            <h2 className="text-3xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Set up your shop<br />and start selling.
                            </h2>
                            <p className="text-white/50 text-sm mt-3 leading-relaxed">
                                Reach buyers across all 77 districts of Nepal.
                            </p>
                        </div>

                        {/* Step indicators */}
                        <div className="space-y-3">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const done = i < step;
                                const active = i === step;
                                return (
                                    <div key={s.title} className={`flex items-center gap-3 transition-all ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-30'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-emerald-500' : active ? 'bg-[#C49A6C]' : 'bg-white/10'}`}>
                                            {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{s.title}</p>
                                            <p className="text-white/40 text-xs">{s.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { icon: Package,    text: 'Free product listing' },
                                { icon: TrendingUp, text: '0% commission on first 10 orders' },
                                { icon: Truck,      text: 'Nationwide delivery support' },
                            ].map(b => {
                                const Icon = b.icon;
                                return (
                                    <div key={b.text} className="flex items-center gap-2.5 text-sm text-white/50">
                                        <Icon className="w-3.5 h-3.5 text-[#C49A6C] shrink-0" />
                                        {b.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <p className="relative z-10 text-white/20 text-xs">© 2026 Wood Kala Nepal</p>
                </div>

                {/* Right: Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-lg">

                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Store className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <p className="font-bold">Wood Kala Seller Panel</p>
                        </div>

                        {/* Pending approval screen */}
                        {pendingApproval ? (
                            <PendingApprovalScreen />
                        ) : (
                        <>
                        {/* Progress bar */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                {STEPS.map((s, i) => (
                                    <div key={s.title} className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {i < step ? '✓' : i + 1}
                                        </div>
                                        <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</span>
                                        {i < STEPS.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-2 transition-colors ${i < step ? 'bg-emerald-500' : 'bg-border'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-8 overflow-hidden">
                            <form onSubmit={submit}>
                                <AnimatePresence mode="wait" custom={dir}>
                                    {/* ── Step 1: Shop Info ── */}
                                    {step === 0 && (
                                        <motion.div key="step1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
                                            <div>
                                                <h2 className="serif text-xl font-bold">Shop Information</h2>
                                                <p className="text-muted-foreground text-sm mt-1">Tell buyers about your shop</p>
                                            </div>

                                            <div>
                                                <label className={LABEL}>Shop Name <span className="text-destructive">*</span></label>
                                                <input className={INPUT} value={form.data.shop_name} onChange={e => form.setData('shop_name', e.target.value)}
                                                    placeholder="e.g. Himalayan Wood Works" />
                                                {form.errors.shop_name && <p className="text-destructive text-xs mt-1">{form.errors.shop_name}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Phone Number <span className="text-destructive">*</span></label>
                                                <input className={INPUT} value={form.data.phone} onChange={e => form.setData('phone', e.target.value)}
                                                    placeholder="98XXXXXXXX" />
                                                {form.errors.phone && <p className="text-destructive text-xs mt-1">{form.errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Shop Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                                                <textarea className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-all placeholder:text-muted-foreground"
                                                    rows={3} value={form.data.shop_description} onChange={e => form.setData('shop_description', e.target.value)}
                                                    placeholder="Tell buyers about your craft and speciality..." />
                                            </div>

                                            <div>
                                                <label className={LABEL}>Shop Registration Number <span className="text-muted-foreground font-normal">(optional)</span></label>
                                                <input className={INPUT} value={form.data.shop_registration_number}
                                                    onChange={e => form.setData('shop_registration_number', e.target.value)}
                                                    placeholder="e.g. 123456/078/079" />
                                                {form.errors.shop_registration_number && <p className="text-destructive text-xs mt-1">{form.errors.shop_registration_number}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Shop Registration Document <span className="text-muted-foreground font-normal">(optional)</span></label>
                                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted hover:border-primary/50 transition-colors">
                                                    <input type="file" accept="image/*" className="hidden"
                                                        onChange={e => setRegImage(e.target.files?.[0] ?? null)} />
                                                    {regImage ? (
                                                        <span className="text-sm text-foreground font-medium">{regImage.name}</span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Click to upload image (JPG, PNG — max 2MB)</span>
                                                    )}
                                                </label>
                                                {form.errors.shop_registration_image && <p className="text-destructive text-xs mt-1">{form.errors.shop_registration_image}</p>}
                                            </div>

                                            <button type="button" disabled={!step1Valid} onClick={() => go(1)}
                                                className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-40">
                                                Continue <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* ── Step 2: Bank Account ── */}
                                    {step === 1 && (
                                        <motion.div key="step2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
                                            <div>
                                                <h2 className="serif text-xl font-bold">Bank Account Details</h2>
                                                <p className="text-muted-foreground text-sm mt-1">Required for receiving payments</p>
                                            </div>

                                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-2.5">
                                                <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Your bank details are encrypted and used only for transferring your earnings. We never share this information.
                                                </p>
                                            </div>

                                            <div>
                                                <label className={LABEL}>Bank Name <span className="text-destructive">*</span></label>
                                                <select className={INPUT} value={form.data.bank_name} onChange={e => form.setData('bank_name', e.target.value)}>
                                                    <option value="">Select your bank</option>
                                                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                                {form.errors.bank_name && <p className="text-destructive text-xs mt-1">{form.errors.bank_name}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Account Number <span className="text-destructive">*</span></label>
                                                <input className={INPUT} value={form.data.bank_account_number} onChange={e => form.setData('bank_account_number', e.target.value)}
                                                    placeholder="e.g. 0701234567890" />
                                                {form.errors.bank_account_number && <p className="text-destructive text-xs mt-1">{form.errors.bank_account_number}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Account Holder Name <span className="text-destructive">*</span></label>
                                                <input className={INPUT} value={form.data.bank_account_name} onChange={e => form.setData('bank_account_name', e.target.value)}
                                                    placeholder="Full name as on bank account" />
                                                {form.errors.bank_account_name && <p className="text-destructive text-xs mt-1">{form.errors.bank_account_name}</p>}
                                            </div>

                                            <div>
                                                <label className={LABEL}>Branch <span className="text-muted-foreground font-normal">(optional)</span></label>
                                                <input className={INPUT} value={form.data.bank_branch} onChange={e => form.setData('bank_branch', e.target.value)}
                                                    placeholder="e.g. Kathmandu Main Branch" />
                                            </div>

                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => go(0)}
                                                    className="h-11 px-5 border border-border rounded-xl font-semibold flex items-center gap-2 hover:bg-accent transition text-sm">
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button type="button" disabled={!step2Valid} onClick={() => go(2)}
                                                    className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-40">
                                                    Continue <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── Step 3: Identity Verification ── */}
                                    {step === 2 && (
                                        <motion.div key="step3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
                                            <div>
                                                <h2 className="serif text-xl font-bold">Identity Verification</h2>
                                                <p className="text-muted-foreground text-sm mt-1">Required by Nepal government regulations</p>
                                            </div>

                                            <div className="bg-[#1A1A1A] border border-[#C49A6C]/30 rounded-xl p-3 flex gap-2.5">
                                                <ShieldCheck className="w-4 h-4 text-[#C49A6C] shrink-0 mt-0.5" />
                                                <p className="text-xs text-white/80 leading-relaxed">
                                                    Identity verification helps build trust with buyers and is required for payouts above रू 50,000.
                                                </p>
                                            </div>

                                            <div>
                                                <label className={LABEL}>ID Type <span className="text-destructive">*</span></label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { value: 'citizenship', label: 'Citizenship' },
                                                        { value: 'passport',    label: 'Passport' },
                                                        { value: 'license',     label: "Driver's License" },
                                                    ].map(opt => (
                                                        <button key={opt.value} type="button"
                                                            onClick={() => form.setData('id_type', opt.value)}
                                                            className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${form.data.id_type === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40'}`}>
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className={LABEL}>
                                                    {form.data.id_type === 'citizenship' ? 'Citizenship Number' :
                                                     form.data.id_type === 'passport' ? 'Passport Number' : 'License Number'}
                                                    <span className="text-destructive"> *</span>
                                                </label>
                                                <input className={INPUT} value={form.data.id_number} onChange={e => form.setData('id_number', e.target.value)}
                                                    placeholder={
                                                        form.data.id_type === 'citizenship' ? 'e.g. 12-34-56-78901' :
                                                        form.data.id_type === 'passport' ? 'e.g. A1234567' : 'e.g. 12-345-6789'
                                                    } />
                                                {form.errors.id_number && <p className="text-destructive text-xs mt-1">{form.errors.id_number}</p>}
                                            </div>

                                            {/* Summary */}
                                            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-xs">
                                                <p className="font-semibold text-sm mb-2">Review your details</p>
                                                {[
                                                    { label: 'Shop', value: form.data.shop_name },
                                                    { label: 'Phone', value: form.data.phone },
                                                    { label: 'Reg. No.', value: form.data.shop_registration_number },
                                                    { label: 'Bank', value: form.data.bank_name },
                                                    { label: 'Account', value: form.data.bank_account_number ? `****${form.data.bank_account_number.slice(-4)}` : '' },
                                                ].map(r => r.value && (
                                                    <div key={r.label} className="flex justify-between">
                                                        <span className="text-muted-foreground">{r.label}</span>
                                                        <span className="font-medium">{r.value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => go(1)}
                                                    className="h-11 px-5 border border-border rounded-xl font-semibold flex items-center gap-2 hover:bg-accent transition text-sm">
                                                    <ChevronLeft className="w-4 h-4" /> Back
                                                </button>
                                                <motion.button type="submit" disabled={form.processing || !step3Valid}
                                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                                    className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-40 shadow-sm">
                                                    {form.processing ? 'Activating...' : <><Store className="w-4 h-4" /> Activate Seller Account</>}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/shop" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                ← Continue browsing as buyer
                            </Link>
                        </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

SellerRegister.layout = (page: React.ReactNode) => page;
