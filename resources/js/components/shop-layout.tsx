import { Link, usePage, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Search, User, Eye, EyeOff, ArrowRight, Bell, Settings, LogOut, Package, Heart, LayoutDashboard } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';
import { request as forgotRoute } from '@/routes/password';
import { register as registerRoute } from '@/routes';
import AIChatbot from '@/components/ai-chatbot';
import { ToastProvider, useToast } from '@/components/toast';

interface Props { children: React.ReactNode; }
type DrawerTab = 'login' | 'register';

/* ── Shared input ── */
function OakInput({ icon: Icon, type = 'text', placeholder, value, onChange, name, required = false }: {
    icon?: React.ElementType; type?: string; placeholder: string;
    value: string; onChange: (v: string) => void; name?: string; required?: boolean;
}) {
    const [show, setShow] = useState(false);
    const isPass = type === 'password';
    return (
        <div className="relative">
            {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />}
            <input name={name} type={isPass ? (show ? 'text' : 'password') : type}
                placeholder={placeholder} required={required} value={value}
                onChange={e => onChange(e.target.value)}
                className={`input-oak w-full h-11 bg-white border border-border text-foreground placeholder:text-muted-foreground rounded-lg text-sm transition-all ${Icon ? 'pl-10' : 'pl-4'} pr-10`} />
            {isPass && (
                <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}

/* ── Auth Drawer ── */
function AuthDrawer({ open, onClose, defaultTab }: { open: boolean; onClose: () => void; defaultTab: DrawerTab }) {
    const [tab, setTab] = useState<DrawerTab>(defaultTab);
    const [key, setKey] = useState(0);
    useEffect(() => { setTab(defaultTab); }, [defaultTab]);
    useEffect(() => { setKey(k => k + 1); }, [tab]);
    useEffect(() => {
        if (!open) return;
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative drawer-enter w-full max-w-[420px] h-full flex flex-col bg-[#F9F8F6] border-l border-border shadow-2xl overflow-y-auto">
                {/* Photo header */}
                <div className="relative h-48 shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                        alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
                    <div className="absolute inset-0 flex items-end justify-between p-6">
                        <div>
                            <p className="serif text-2xl font-bold text-white italic">
                                {tab === 'login' ? '"Welcome back."' : '"Join Wood Kala."'}
                            </p>
                            <p className="text-white/60 text-xs mt-1">Handcrafted furniture from Nepal</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="flex border-b border-border shrink-0">
                    {(['login', 'register'] as DrawerTab[]).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`flex-1 py-3.5 text-sm font-medium tracking-wide transition-all ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                            {t === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-6" key={key}>
                    {tab === 'login'
                        ? <DrawerLoginForm onSuccess={onClose} onForgot={onClose} />
                        : <DrawerRegisterForm onSuccess={onClose} />
                    }
                </div>

                {/* Social */}
                <div className="px-6 pb-6 space-y-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DrawerLoginForm({ onSuccess, onForgot }: { onSuccess: () => void; onForgot: () => void }) {
    const form = useForm({ email: '', password: '', remember: false });
    return (
        <div className="slide-left space-y-4">
        <form onSubmit={e => { e.preventDefault(); form.post('/login', { onSuccess }); }} className="space-y-4">
            {form.errors.email && <p className="text-destructive text-sm">{form.errors.email}</p>}
            <OakInput type="email" name="email" placeholder="Email address" value={form.data.email} onChange={v => form.setData('email', v)} required />
            <div className="space-y-1">
                <OakInput type="password" name="password" placeholder="Password" value={form.data.password} onChange={v => form.setData('password', v)} required />
                <div className="text-right">
                    <Link href={forgotRoute()} onClick={onForgot} className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="rem" className="accent-primary w-4 h-4" checked={form.data.remember} onChange={e => form.setData('remember', e.target.checked)} />
                <label htmlFor="rem" className="text-sm text-muted-foreground cursor-pointer">Keep me signed in</label>
            </div>
            <button type="submit" disabled={form.processing}
                className="pulse-oak w-full h-11 bg-primary text-primary-foreground font-medium tracking-widest text-sm uppercase hover:bg-[#8B6340] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {form.processing ? <Spinner /> : null}
                {form.processing ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
        <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
        </div>
        <button type="button" onClick={() => { window.location.href = '/auth/google'; }}
            className="w-full h-11 border border-border rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-accent transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
        </button>
        </div>
    );
}

function DrawerRegisterForm({ onSuccess }: { onSuccess: () => void }) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    return (
        <form onSubmit={e => { e.preventDefault(); form.post('/register', { onSuccess }); }} className="slide-right space-y-4">
            {form.errors.email && <p className="text-destructive text-sm">{form.errors.email}</p>}
            <OakInput name="name" placeholder="Full name" value={form.data.name} onChange={v => form.setData('name', v)} required />
            <OakInput type="email" name="email" placeholder="Email address" value={form.data.email} onChange={v => form.setData('email', v)} required />
            <OakInput type="password" name="password" placeholder="Password (min. 8 chars)" value={form.data.password} onChange={v => form.setData('password', v)} required />
            <OakInput type="password" name="password_confirmation" placeholder="Confirm password" value={form.data.password_confirmation} onChange={v => form.setData('password_confirmation', v)} required />
            <button type="submit" disabled={form.processing}
                className="w-full h-11 bg-primary text-primary-foreground font-medium tracking-widest text-sm uppercase hover:bg-[#8B6340] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {form.processing ? <Spinner /> : null}
                {form.processing ? 'Creating...' : 'Create Account'}
            </button>
        </form>
    );
}

/* ── User Dropdown ── */
function UserDropdown({ name, scrolled }: { name: string; scrolled: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                style={{ background: '#A67C52' }}>
                <User className="w-3.5 h-3.5" />
                {name.split(' ')[0]}
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">Buyer Account</p>
                    </div>
                    <div className="py-1">
                        {[
                            { href: '/dashboard/buyer',        icon: LayoutDashboard, label: 'My Dashboard' },
                            { href: '/orders',                 icon: Package,  label: 'My Orders' },
                            { href: '/wishlist',               icon: Heart,    label: 'Wishlist' },
                            { href: '/settings/profile',       icon: Settings, label: 'Profile Settings' },
                            { href: '/settings/notifications', icon: Bell,     label: 'Notifications' },
                        ].map(item => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="border-t border-border py-1">
                        <Link href="/logout" method="post" as="button"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}


export default function ShopLayout({ children }: Props) {
    return (
        <ToastProvider>
            <ShopLayoutInner>{children}</ShopLayoutInner>
        </ToastProvider>
    );
}

function ShopLayoutInner({ children }: Props) {
    const { auth, cart_count, wishlist_count, flash } = usePage<{
        auth: { user: { name: string; role: string } | null };
        cart_count: number;
        wishlist_count: number;
        flash: { success?: string; error?: string };
    }>().props;
    const { toast } = useToast();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerTab, setDrawerTab] = useState<DrawerTab>('login');

    useEffect(() => {
        if (flash?.success) toast(flash.success, 'success');
        if (flash?.error) toast(flash.error, 'error');
    }, [flash]);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    function openAuth(tab: DrawerTab) { setDrawerTab(tab); setDrawerOpen(true); }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (search.trim()) router.get('/shop', { search }, { preserveState: false });
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col sans">
            {/* ── Navbar ── */}
            <header className={`sticky top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`} style={{ background: 'rgba(248,250,247,0.97)', borderColor: '#E5E7EB', backdropFilter: 'blur(12px)' }}>
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center gap-6" style={{ height: '68px' }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <img src="/logo.png"
                            alt="Wood-कला" className="h-14 w-auto object-contain" />
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-1 flex-1">
                        {[
                            { href: '/shop', label: 'All Products' },
                            { href: '/shop?category=living-room', label: 'Living Room' },
                            { href: '/shop?category=bedroom', label: 'Bedroom' },
                            { href: '/shop?category=office', label: 'Office' },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href}
                                className="relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#EDE8E1] group"
                                style={{ color: '#374151' }}>
                                {label}
                                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#A67C52] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="hidden lg:flex">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9A8070' }} />
                                <input
                                    className="pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all w-48 focus:w-64 focus:ring-2"
                                    style={{ background: '#F0EDE8', border: '1px solid #DDD6CC', color: '#1A1A1A' }}
                                    placeholder="Search furniture..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </form>

                        <Link href="/cart" className="relative p-2.5 rounded-xl transition-colors hover:bg-[#EDE8E1]" style={{ color: '#3D2B1F' }}>
                            <ShoppingCart className="w-5 h-5" />
                            {cart_count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#A67C52] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                    {cart_count > 99 ? '99+' : cart_count}
                                </span>
                            )}
                        </Link>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative p-2.5 rounded-xl transition-colors hover:bg-[#EDE8E1]" style={{ color: '#3D2B1F' }} aria-label="Wishlist">
                            <Heart className="w-5 h-5" />
                            {wishlist_count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                    {wishlist_count > 99 ? '99+' : wishlist_count}
                                </span>
                            )}
                        </Link>

                        {auth.user ? (
                            <>
                                {(auth.user.role === 'seller' || auth.user.role === 'admin') && (
                                    <Link href="/seller/dashboard"
                                        className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all border"
                                        style={{ borderColor: '#A67C52', color: '#A67C52' }}>
                                        Seller Centre
                                    </Link>
                                )}
                                {auth.user.role === 'buyer' && (
                                    <Link href="/seller/register"
                                        className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all border"
                                        style={{ borderColor: '#A67C52', color: '#A67C52' }}>
                                        Become a Seller
                                    </Link>
                                )}
                                {auth.user.role === 'pending_seller' && (
                                    <Link href="/seller/register"
                                        className="px-4 py-2.5 text-sm font-medium rounded-xl transition-all border"
                                        style={{ borderColor: '#A67C52', color: '#A67C52' }}>
                                        Approval Pending
                                    </Link>
                                )}
                                <UserDropdown name={auth.user.name} scrolled={scrolled} />
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/seller/login"
                                    className="px-4 py-2.5 text-sm font-medium rounded-xl transition-colors hover:bg-[#EDE8E1]"
                                    style={{ color: '#3D2B1F' }}>
                                    Sell
                                </Link>
                                <button onClick={() => openAuth('login')}
                                    className="px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors hover:bg-[#EDE8E1]"
                                    style={{ color: '#3D2B1F', borderColor: '#DDD6CC' }}>
                                    Login
                                </button>
                                <button onClick={() => openAuth('register')}
                                    className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all text-white"
                                    style={{ background: '#A67C52' }}>
                                    Create Account
                                </button>
                            </div>
                        )}

                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 rounded-xl transition-colors hover:bg-[#EDE8E1]" style={{ color: '#3D2B1F' }}>
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t px-5 py-4 space-y-1" style={{ background: '#FDFCFA', borderColor: '#E8DDD0' }}>
                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9A8070' }} />
                                <input className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none" style={{ background: '#F0EDE8' }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </form>
                        {auth.user ? (
                            [
                                { href: '/shop', label: 'All Products' },
                                { href: '/dashboard', label: 'Dashboard' },
                                { href: '/orders', label: 'My Orders' },
                                { href: '/cart', label: 'Cart' },
                                ...(auth.user.role === 'seller' ? [{ href: '/seller/dashboard', label: 'Seller Centre' }] : []),
                            ].map(({ href, label }) => (
                                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                                    className="block py-3 px-3 text-base font-medium rounded-xl hover:bg-[#EDE8E1] transition-colors"
                                    style={{ color: '#3D2B1F' }}>
                                    {label}
                                </Link>
                            ))
                        ) : (
                            <>
                                {[
                                    { href: '/shop', label: 'All Products' },
                                    { href: '/shop?category=living-room', label: 'Living Room' },
                                    { href: '/shop?category=bedroom', label: 'Bedroom' },
                                    { href: '/shop?category=office', label: 'Office' },
                                ].map(l => (
                                    <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                                        className="block py-3 px-3 text-base font-medium rounded-xl hover:bg-[#EDE8E1] transition-colors"
                                        style={{ color: '#3D2B1F' }}>
                                        {l.label}
                                    </Link>
                                ))}
                                <button onClick={() => { setMenuOpen(false); openAuth('login'); }} className="w-full text-left py-3 px-3 text-base font-medium rounded-xl hover:bg-[#EDE8E1]" style={{ color: '#3D2B1F' }}>Login</button>
                                <button onClick={() => { setMenuOpen(false); openAuth('register'); }} className="w-full text-left py-3 px-3 text-base font-semibold rounded-xl text-white" style={{ background: '#A67C52' }}>Create Account</button>
                            </>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-border mt-20 py-12 px-6 bg-[#F5F0EB] text-[#4A3F35]">
                <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <img src="/logo.png" alt="Wood Kala Nepal" className="h-8 w-auto" />
                        </div>
                        <p className="text-sm leading-relaxed">Premium handcrafted furniture by skilled Nepali artisans. Timeless quality, delivered nationwide.</p>
                    </div>
                    <div>
                        <p className="text-[#2A1F14] font-semibold text-sm mb-3 uppercase tracking-widest">Collection</p>
                        {['Living Room', 'Bedroom', 'Office', 'Custom Orders'].map(l => (
                            <Link key={l} href="/shop" className="block text-sm py-1 hover:text-[#2A1F14] transition-colors">{l}</Link>
                        ))}
                    </div>
                    <div>
                        <p className="text-[#2A1F14] font-semibold text-sm mb-3 uppercase tracking-widest">Account</p>
                        {auth.user
                            ? [{ l: 'Dashboard', h: '/dashboard' }, { l: 'Orders', h: '/orders' }, { l: 'Settings', h: '/settings/profile' }].map(i => (
                                <Link key={i.h} href={i.h} className="block text-sm py-1 hover:text-[#2A1F14] transition-colors">{i.l}</Link>
                            ))
                            : [{ l: 'Sign In', fn: () => openAuth('login') }, { l: 'Create Account', fn: () => openAuth('register') }].map(i => (
                                <button key={i.l} onClick={i.fn} className="block text-sm py-1 hover:text-[#2A1F14] transition-colors">{i.l}</button>
                            ))
                        }
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#D9CFC4] text-xs text-center">
                    © 2026 Wood Kala Nepal · Developed by Rabin Karki · BSc(Hons) Computer Science
                </div>
            </footer>

            {/* Auth Drawer */}
            <AuthDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} defaultTab={drawerTab} />

            {/* WhatsApp floating button */}
            <a href="https://wa.me/977980000000?text=Hello%2C%20I%27m%20interested%20in%20a%20custom%20furniture%20inquiry%20from%20Wood%20Kala%20Nepal."
                target="_blank" rel="noopener noreferrer"
                className="fixed bottom-24 right-6 z-[190] w-13 h-13 flex items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                style={{ background: '#25D366', width: 52, height: 52 }}
                aria-label="WhatsApp inquiry">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            </a>

            {/* AI Chatbot */}
            <AIChatbot />
        </div>
    );
}
