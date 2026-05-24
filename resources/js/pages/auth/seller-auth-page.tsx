import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye, EyeOff, Mail, Lock, User, Store, ArrowRight,
    Package, TrendingUp, Truck, ShieldCheck, Star, Users, BarChart3, CheckCircle2
} from 'lucide-react';
import { request as forgotRoute } from '@/routes/password';

type Tab = 'login' | 'register';

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, name, required = false, error }: {
    icon: React.ElementType; type?: string; placeholder: string;
    value: string; onChange: (v: string) => void; name?: string; required?: boolean; error?: string;
}) {
    const [show, setShow] = useState(false);
    const isPwd = type === 'password';
    return (
        <div>
            <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                    name={name} required={required}
                    type={isPwd ? (show ? 'text' : 'password') : type}
                    placeholder={placeholder} value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full h-12 bg-white border text-slate-800 placeholder:text-slate-400 rounded-lg pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-400' : 'border-stone-200 focus:border-[#A67C52] focus:ring-[#A67C52]/20'}`}
                />
                {isPwd && (
                    <button type="button" onClick={() => setShow(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function LoginForm({ onSwitch, canResetPassword, status }: { onSwitch: () => void; canResetPassword: boolean; status?: string }) {
    const form = useForm({ email: '', password: '', remember: false });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
            onSuccess: () => { window.location.href = '/seller/register'; },
        });
    }
    return (
        <form onSubmit={submit} className="space-y-5">
            {status && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">{status}</div>}
            {form.errors.email && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{form.errors.email}</div>}

            <div className="grid grid-cols-1 gap-4">
                <Field icon={Mail} type="email" name="email" placeholder="Email address" value={form.data.email} onChange={v => form.setData('email', v)} required />
                <div>
                    <Field icon={Lock} type="password" name="password" placeholder="Password" value={form.data.password} onChange={v => form.setData('password', v)} required />
                    {canResetPassword && (
                        <div className="text-right mt-1.5">
                            <Link href={forgotRoute()} className="text-xs hover:underline" style={{ color: '#A67C52' }}>Forgot password?</Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#A67C52' }}
                        checked={form.data.remember} onChange={e => form.setData('remember', e.target.checked)} />
                    <span className="text-sm text-slate-500">Keep me signed in</span>
                </label>
            </div>

            <button type="submit" disabled={form.processing}
                className="w-full h-12 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 shadow-md"
                style={{ background: 'linear-gradient(135deg, #A67C52, #8B6340)' }}>
                {form.processing ? 'Signing in…' : 'Sign In to Seller Centre'}
            </button>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#E8DDD0' }} />
                <span className="text-xs" style={{ color: '#9A8070' }}>or</span>
                <div className="flex-1 h-px" style={{ background: '#E8DDD0' }} />
            </div>

            <button type="button" onClick={() => { window.location.href = '/auth/google'; }}
                className="w-full h-12 border rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all hover:bg-stone-50"
                style={{ borderColor: '#E8DDD0', color: '#2C1F14' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
            </button>

            <p className="text-center text-sm text-slate-500">
                Don't have a seller account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: '#A67C52' }}>Register free</button>
            </p>
        </form>
    );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/register', {
            onFinish: () => form.reset('password', 'password_confirmation'),
            onSuccess: () => { window.location.href = '/seller/register'; },
        });
    }
    return (
        <form onSubmit={submit} className="space-y-5">
            {form.errors.email && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                    {form.errors.email.includes('already') ? (
                        <span>
                            This email is already registered.{' '}
                            <button type="button" onClick={onSwitch} className="font-semibold underline">
                                Sign in instead
                            </button>
                        </span>
                    ) : form.errors.email}
                </div>
            )}

            {/* Two-column layout for name + email */}
            <div className="grid grid-cols-2 gap-4">
                <Field icon={User} name="name" placeholder="Full name" value={form.data.name} onChange={v => form.setData('name', v)} required error={form.errors.name} />
                <Field icon={Mail} type="email" name="email" placeholder="Email address" value={form.data.email} onChange={v => form.setData('email', v)} required />
            </div>
            {/* Two-column layout for passwords */}
            <div className="grid grid-cols-2 gap-4">
                <Field icon={Lock} type="password" name="password" placeholder="Password" value={form.data.password} onChange={v => form.setData('password', v)} required error={form.errors.password} />
                <Field icon={Lock} type="password" name="password_confirmation" placeholder="Confirm password" value={form.data.password_confirmation} onChange={v => form.setData('password_confirmation', v)} required />
            </div>

            <button type="submit" disabled={form.processing}
                className="w-full h-12 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 shadow-md"
                style={{ background: 'linear-gradient(135deg, #A67C52, #8B6340)' }}>
                {form.processing ? 'Creating account…' : <><span>Create Seller Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#E8DDD0' }} />
                <span className="text-xs" style={{ color: '#9A8070' }}>or</span>
                <div className="flex-1 h-px" style={{ background: '#E8DDD0' }} />
            </div>

            <button type="button" onClick={() => { window.location.href = '/auth/google'; }}
                className="w-full h-12 border rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all hover:bg-stone-50"
                style={{ borderColor: '#E8DDD0', color: '#2C1F14' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
            </button>

            <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: '#A67C52' }}>Sign in</button>
            </p>
        </form>
    );
}

const STATS = [
    { value: '10,000+', label: 'Active Buyers' },
    { value: '77',      label: 'Districts Reached' },
    { value: '500+',    label: 'Sellers Onboard' },
    { value: '0%',      label: 'Commission (first 10 orders)' },
];

const FEATURES = [
    { icon: Store,       title: 'Free Shop Setup',    desc: 'Your own storefront, no upfront cost' },
    { icon: Package,     title: 'Easy Listings',       desc: 'Add products with photos in minutes' },
    { icon: TrendingUp,  title: 'Sales Analytics',     desc: 'Track orders, revenue & growth' },
    { icon: Truck,       title: 'Delivery Support',    desc: 'Nationwide logistics handled for you' },
    { icon: ShieldCheck, title: 'Secure Payments',     desc: 'Khalti & bank transfer, always on time' },
    { icon: BarChart3,   title: 'Grow Your Reach',     desc: 'Featured listings & promotions available' },
];

const STEPS = [
    { n: '01', title: 'Create Account',   desc: 'Register with your email in 30 seconds' },
    { n: '02', title: 'Set Up Your Shop', desc: 'Add shop name, description & phone' },
    { n: '03', title: 'List Products',    desc: 'Upload photos, set prices & publish' },
    { n: '04', title: 'Start Earning',    desc: 'Receive orders & get paid directly' },
];

type Props = { status?: string; canResetPassword?: boolean; defaultTab?: Tab; };

export default function SellerAuthPage({ status, canResetPassword = true, defaultTab = 'register' }: Props) {
    const [tab, setTab] = useState<Tab>(defaultTab);
    const [animKey, setAnimKey] = useState(0);
    function switchTab(t: Tab) { setTab(t); setAnimKey(k => k + 1); }

    return (
        <>
            <Head title="Seller Centre — Wood Kala Nepal">
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen" style={{ background: '#F9F8F6', fontFamily: "'Inter', sans-serif" }}>

                {/* ══ NAV ══ */}
                <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ background: '#FDFCFA', borderColor: '#E8DDD0' }}>
                    <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="Wood Kala" className="h-14 w-auto" />
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: '#EDE8E1', color: '#A67C52' }}>Seller Centre</span>
                        </Link>
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/" className="transition-colors" style={{ color: '#7A6A5A' }}>Back to Shop</Link>
                            <Link href="/login" className="transition-colors" style={{ color: '#7A6A5A' }}>Buyer Login</Link>
                        </div>
                    </div>
                </nav>

                {/* ══ HERO + AUTH (full-width split) ══ */}
                <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C1F14 0%, #3D2B1F 40%, #5C3D2E 70%, #A67C52 100%)' }}>
                    <img
                        src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1800&q=80"
                        alt="Woodworking workshop"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    {/* Warm wood grain texture overlay */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(105deg, transparent, transparent 2px, rgba(166,124,82,0.15) 2px, rgba(166,124,82,0.15) 4px)' }} />
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(166,124,82,0.25) 0%, transparent 70%)' }} />

                    <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-[1fr_520px] gap-16 items-start">

                        {/* Left: Branding */}
                        <div className="space-y-10 pt-4">
                            <div className="inline-flex items-center gap-2 border text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full" style={{ background: 'rgba(166,124,82,0.2)', borderColor: 'rgba(166,124,82,0.4)', color: '#D4A574' }}>
                                <Star className="w-3 h-3" style={{ fill: '#D4A574', color: '#D4A574' }} />
                                Nepal's #1 Woodcraft Marketplace
                            </div>

                            <div>
                                <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.15]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Grow Your<br />
                                    <span style={{ color: '#D4A574' }}>Woodcraft</span><br />
                                    Business With Us
                                </h1>
                                <p className="text-lg mt-5 leading-relaxed max-w-lg" style={{ color: '#C4B09A' }}>
                                    Join hundreds of Nepali artisans already selling on Wood Kala. Free setup, zero commission on your first 10 orders, nationwide reach.
                                </p>
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {['Free to Join', 'No Hidden Fees', 'Secure Payments', 'Dedicated Support'].map(b => (
                                    <div key={b} className="flex items-center gap-2 text-sm" style={{ color: '#C4B09A' }}>
                                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#D4A574' }} />
                                        {b}
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                {STATS.map(s => (
                                    <div key={s.label} className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(166,124,82,0.25)' }}>
                                        <p className="text-2xl font-bold" style={{ color: '#D4A574' }}>{s.value}</p>
                                        <p className="text-xs mt-1 leading-snug" style={{ color: '#9A8070' }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Auth panel — wide, web-style */}
                        <div className="rounded-2xl shadow-2xl overflow-hidden w-full" style={{ background: '#FDFCFA', boxShadow: '0 25px 60px rgba(44,31,20,0.5)' }}>

                            {/* Tab bar */}
                            <div className="flex border-b" style={{ background: '#F5F0EA', borderColor: '#E8DDD0' }}>
                                {(['register', 'login'] as Tab[]).map(t => (
                                    <button key={t} onClick={() => switchTab(t)}
                                        className={`flex-1 py-4 text-sm font-semibold transition-all border-b-2 ${
                                            tab === t
                                                ? 'bg-white'
                                                : 'border-transparent hover:bg-white/60'
                                        }`}
                                        style={tab === t
                                            ? { borderBottomColor: '#A67C52', color: '#A67C52' }
                                            : { color: '#9A8070' }
                                        }>
                                        {t === 'register' ? '✦ Register Free' : 'Sign In'}
                                    </button>
                                ))}
                            </div>

                            {/* Form heading */}
                            <div className="px-8 pt-7 pb-2">
                                {tab === 'register' ? (
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C1F14' }}>Start selling today</h2>
                                        <p className="text-sm mt-1" style={{ color: '#7A6A5A' }}>Create your account — it takes less than a minute</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C1F14' }}>Welcome back, Seller</h2>
                                        <p className="text-sm mt-1" style={{ color: '#7A6A5A' }}>Sign in to manage your shop and orders</p>
                                    </div>
                                )}
                            </div>

                            {/* Form body */}
                            <div className="px-8 pb-7 pt-4" key={animKey}>
                                {tab === 'login'
                                    ? <LoginForm onSwitch={() => switchTab('register')} canResetPassword={canResetPassword} status={status} />
                                    : <RegisterForm onSwitch={() => switchTab('login')} />
                                }
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-4 border-t text-center" style={{ background: '#F5F0EA', borderColor: '#E8DDD0' }}>
                                <p className="text-xs" style={{ color: '#9A8070' }}>
                                    By continuing, you agree to our{' '}
                                    <Link href="/" className="hover:underline" style={{ color: '#A67C52' }}>Terms</Link> &{' '}
                                    <Link href="/" className="hover:underline" style={{ color: '#A67C52' }}>Privacy Policy</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ HOW IT WORKS ══ */}
                <section className="py-20" style={{ background: '#F5F0EA' }}>
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A67C52' }}>Simple Process</p>
                            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C1F14' }}>Start selling in 4 easy steps</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {STEPS.map((s, i) => (
                                <div key={s.n} className="relative rounded-2xl p-7 border shadow-sm hover:shadow-md transition-shadow" style={{ background: '#FDFCFA', borderColor: '#E8DDD0' }}>
                                    {i < STEPS.length - 1 && (
                                        <div className="hidden lg:block absolute top-9 -right-3 z-10">
                                            <ArrowRight className="w-5 h-5" style={{ color: '#C4A882' }} />
                                        </div>
                                    )}
                                    <div className="w-11 h-11 text-white rounded-xl flex items-center justify-center font-bold text-sm mb-5" style={{ background: '#A67C52' }}>
                                        {s.n}
                                    </div>
                                    <p className="font-bold mb-1.5" style={{ color: '#2C1F14' }}>{s.title}</p>
                                    <p className="text-sm leading-relaxed" style={{ color: '#7A6A5A' }}>{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ FEATURES ══ */}
                <section className="py-20" style={{ background: '#FDFCFA' }}>
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#A67C52' }}>Everything You Need</p>
                            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2C1F14' }}>Powerful tools for your business</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FEATURES.map(f => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.title} className="flex gap-5 p-6 rounded-2xl border hover:shadow-md transition-all group" style={{ borderColor: '#E8DDD0' }}>
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ background: '#EDE8E1' }}>
                                            <Icon className="w-5 h-5" style={{ color: '#A67C52' }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold" style={{ color: '#2C1F14' }}>{f.title}</p>
                                            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#7A6A5A' }}>{f.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══ CTA ══ */}
                <section className="py-16" style={{ background: 'linear-gradient(135deg, #A67C52, #8B6340)' }}>
                    <div className="max-w-3xl mx-auto px-8 text-center space-y-6">
                        <Users className="w-12 h-12 mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }} />
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Join 500+ sellers already growing with Wood Kala
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Free to start. No credit card required.</p>
                        <button
                            onClick={() => { switchTab('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-xl transition-all shadow-lg text-sm"
                            style={{ background: '#FDFCFA', color: '#A67C52' }}>
                            <Store className="w-4 h-4" /> Register as a Seller — It's Free
                        </button>
                    </div>
                </section>

                {/* ══ FOOTER ══ */}
                <footer className="py-8" style={{ background: '#2C1F14' }}>
                    <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="Wood Kala" className="h-8 w-auto" />
                            <span className="text-white font-semibold">Seller Centre</span>
                        </div>
                        <p className="text-sm" style={{ color: '#7A6A5A' }}>© 2026 Wood Kala Nepal. All rights reserved.</p>
                        <Link href="/" className="text-sm transition-colors" style={{ color: '#9A8070' }}>← Back to main site</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}

SellerAuthPage.layout = (page: React.ReactNode) => page;
