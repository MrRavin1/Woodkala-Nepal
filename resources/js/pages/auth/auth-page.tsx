import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useCallback, useContext, createContext, ReactNode } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, HelpCircle } from 'lucide-react';
import { request as forgotRoute } from '@/routes/password';

const PHOTO = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=90';

// ── CONSTANTS ──
const C = {
    primary:   '#A67C52',
    primaryDk: '#8B6340',
    bg:        '#F9F8F6',
    card:      '#FFFFFF',
    border:    '#DDD6CC',
    muted:     '#7A6A5A',
    subtle:    '#F0EDE8',
    text:      '#1A1A1A',
    serif:     "'Playfair Display', serif",
} as const;

const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    GOOGLE_AUTH: '/auth/google',
    FORGOT_PASSWORD: forgotRoute(),
    HOME: '/',
    TERMS: '/',
    PRIVACY: '/',
} as const;

const FIELD_NAMES = {
    EMAIL: 'email',
    PASSWORD: 'password',
    PASSWORD_CONFIRM: 'password_confirmation',
    NAME: 'name',
    REMEMBER: 'remember',
    TERMS: 'terms',
} as const;

// ── CONTEXT ──
const ThemeContext = createContext(C);

const useTheme = () => useContext(ThemeContext);

// ── STYLE UTILITIES ──
const createInputStyle = (hasError: boolean, theme = C) => ({
    background: theme.card,
    border: `1.5px solid ${hasError ? '#ef4444' : theme.border}`,
    color: theme.text,
});

const tabButtonStyle = (isActive: boolean, theme = C) => ({
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    fontSize: '0.875rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ...(isActive
        ? { background: theme.card, color: theme.primary, boxShadow: '0 1px 6px rgba(44,31,20,0.1)' }
        : { background: 'transparent', color: theme.muted }),
});

const buttonGradientStyle = (theme = C) => ({
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDk})`,
    color: '#FDFCFA',
    boxShadow: '0 4px 14px rgba(166,124,82,0.35)',
});

// ── COMPONENTS ──
interface FieldProps {
    icon: React.ElementType;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    name?: string;
    required?: boolean;
    error?: string;
}

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, name, required = false, error }: FieldProps) {
    const theme = useTheme();
    const [show, setShow] = useState(false);
    const isPwd = type === 'password';

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    const toggleShow = useCallback(() => {
        setShow(s => !s);
    }, []);

    return (
        <div>
            <div className="relative">
                <Icon
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: theme.muted }}
                />
                <input
                    name={name}
                    required={required}
                    type={isPwd ? (show ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className="input-gold w-full h-12 rounded-xl pl-10 pr-10 text-sm outline-none transition-all"
                    style={createInputStyle(!!error, theme)}
                />
                {isPwd && (
                    <button
                        type="button"
                        onClick={toggleShow}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: theme.muted }}
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
        </div>
    );
}

interface SocialBtnProps {
    icon: string;
    label: string;
    href?: string;
}

function SocialBtn({ icon, label, href }: SocialBtnProps) {
    const theme = useTheme();
    const cls = "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium transition-all";
    const style = { border: `1.5px solid ${theme.border}`, color: theme.muted, background: theme.bg };

    const handleClick = useCallback(() => {
        if (href) window.location.href = href;
    }, [href]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = theme.primary;
        e.currentTarget.style.color = theme.primary;
    }, [theme]);

    const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.color = theme.muted;
    }, [theme]);

    return (
        <button
            type="button"
            className={cls}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            disabled={!href}
        >
            <span className="font-bold text-base">{icon}</span> {label}
        </button>
    );
}

interface LoginFormProps {
    onSwitch: () => void;
    canResetPassword: boolean;
    status?: string;
}

function LoginForm({ onSwitch, canResetPassword, status }: LoginFormProps) {
    const theme = useTheme();
    const form = useForm({ email: '', password: '', remember: false });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        form.post(ROUTES.LOGIN, { onFinish: () => form.reset(FIELD_NAMES.PASSWORD) });
    }, [form]);

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: theme.serif, color: theme.text }}>
                        Welcome back.
                    </h2>
                    <p className="text-sm mt-1" style={{ color: theme.muted }}>Sign in to your account</p>
                </div>

                {status && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                        {status}
                    </div>
                )}
                {form.errors.email && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                        {form.errors.email}
                    </div>
                )}

                <Field
                    icon={Mail}
                    type="email"
                    name={FIELD_NAMES.EMAIL}
                    placeholder="Email address"
                    value={form.data.email}
                    onChange={v => form.setData(FIELD_NAMES.EMAIL, v)}
                    required
                />

                <div className="space-y-1">
                    <Field
                        icon={Lock}
                        type="password"
                        name={FIELD_NAMES.PASSWORD}
                        placeholder="Password"
                        value={form.data.password}
                        onChange={v => form.setData(FIELD_NAMES.PASSWORD, v)}
                        required
                    />
                    {canResetPassword && (
                        <div className="text-right">
                            <Link
                                href={ROUTES.FORGOT_PASSWORD}
                                className="text-xs hover:underline"
                                style={{ color: theme.primary }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded"
                        style={{ accentColor: theme.primary }}
                        checked={form.data.remember}
                        onChange={e => form.setData(FIELD_NAMES.REMEMBER, e.target.checked)}
                    />
                    <span className="text-sm" style={{ color: theme.muted }}>Keep me signed in</span>
                </label>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="pulse-gold w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                    style={buttonGradientStyle(theme)}
                >
                    {form.processing ? 'Signing in…' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: theme.border }} />
                <span className="text-xs" style={{ color: theme.muted }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: theme.border }} />
            </div>

            <div className="flex gap-3">
                <SocialBtn icon="G" label="Google" href={ROUTES.GOOGLE_AUTH} />
            </div>

            <p className="text-center text-sm pt-1" style={{ color: theme.muted }}>
                Don't have an account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: theme.primary }}>
                    Create Account
                </button>
            </p>
        </div>
    );
}

interface RegisterFormProps {
    onSwitch: () => void;
}

function RegisterForm({ onSwitch }: RegisterFormProps) {
    const theme = useTheme();
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        form.post(ROUTES.REGISTER, {
            onFinish: () => form.reset(FIELD_NAMES.PASSWORD, FIELD_NAMES.PASSWORD_CONFIRM),
        });
    }, [form]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: theme.serif, color: theme.text }}>
                    Create account.
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.muted }}>Join Wood Kala in seconds</p>
            </div>

            {form.errors.email && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {form.errors.email}
                </div>
            )}

            <Field
                icon={User}
                name={FIELD_NAMES.NAME}
                placeholder="Full name"
                value={form.data.name}
                onChange={v => form.setData(FIELD_NAMES.NAME, v)}
                required
                error={form.errors.name}
            />

            <Field
                icon={Mail}
                type="email"
                name={FIELD_NAMES.EMAIL}
                placeholder="Email address"
                value={form.data.email}
                onChange={v => form.setData(FIELD_NAMES.EMAIL, v)}
                required
                error={form.errors.email}
            />

            <Field
                icon={Lock}
                type="password"
                name={FIELD_NAMES.PASSWORD}
                placeholder="Password (min. 8 chars)"
                value={form.data.password}
                onChange={v => form.setData(FIELD_NAMES.PASSWORD, v)}
                required
                error={form.errors.password}
            />

            <Field
                icon={Lock}
                type="password"
                name={FIELD_NAMES.PASSWORD_CONFIRM}
                placeholder="Confirm password"
                value={form.data.password_confirmation}
                onChange={v => form.setData(FIELD_NAMES.PASSWORD_CONFIRM, v)}
                required
                error={form.errors.password_confirmation}
            />

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded mt-0.5 shrink-0"
                    style={{ accentColor: theme.primary }}
                    checked={form.data.terms}
                    onChange={e => form.setData(FIELD_NAMES.TERMS, e.target.checked)}
                    required
                />
                <span className="text-sm" style={{ color: theme.muted }}>
                    I agree to the{' '}
                    <Link href={ROUTES.TERMS} className="hover:underline" style={{ color: theme.primary }}>
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href={ROUTES.PRIVACY} className="hover:underline" style={{ color: theme.primary }}>
                        Privacy Policy
                    </Link>
                </span>
            </label>

            <button
                type="submit"
                disabled={form.processing}
                className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                style={buttonGradientStyle(theme)}
            >
                {form.processing ? 'Creating…' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-sm pt-1" style={{ color: theme.muted }}>
                Already have an account?{' '}
                <button type="button" onClick={onSwitch} className="font-semibold hover:underline" style={{ color: theme.primary }}>
                    Sign In
                </button>
            </p>
        </form>
    );
}

// ── MAIN PAGE ──
type Tab = 'login' | 'register';
interface AuthPageProps {
    status?: string;
    canResetPassword?: boolean;
    defaultTab?: Tab;
}

export default function AuthPage({ status, canResetPassword = true, defaultTab = 'login' }: AuthPageProps) {
    const [tab, setTab] = useState<Tab>(defaultTab);
    const [key, setKey] = useState(0);

    const switchTab = useCallback((t: Tab) => {
        setTab(t);
        setKey(k => k + 1);
    }, []);

    const headerStyle = {
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
        boxShadow: '0 1px 8px rgba(44,31,20,0.06)',
        flexShrink: 0,
    };

    const footerStyle = {
        borderTop: `1px solid ${C.border}`,
        background: C.card,
        flexShrink: 0,
    };

    return (
        <>
            <Head title={tab === 'login' ? 'Sign In — Wood Kala' : 'Create Account — Wood Kala'}>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
                <style>{`
                    #auth-img-panel { display: block; }
                    @media (max-width: 1023px) { #auth-img-panel { display: none !important; } }
                `}</style>
            </Head>

            <ThemeContext.Provider value={C}>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", background: C.bg }}>

                    {/* ── HEADER ── */}
                    <header style={headerStyle}>
                        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                            <Link href={ROUTES.HOME} className="flex items-center">
                                <img src="/logo.png" alt="Wood Kala" className="h-14 w-auto" />
                            </Link>
                            <Link href={ROUTES.HOME} className="flex items-center gap-1.5 text-sm transition-colors hover:underline" style={{ color: C.muted }}>
                                <HelpCircle className="w-4 h-4" /> Help
                            </Link>
                        </div>
                    </header>

                    {/* ── MAIN ── */}
                    <main style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>

                        {/* Left: image panel — desktop only */}
                        <div id="auth-img-panel" style={{
                            width: '50%',
                            flexShrink: 0,
                            position: 'sticky',
                            top: 0,
                            alignSelf: 'flex-start',
                            height: 'calc(100vh - 65px)',
                            overflow: 'hidden',
                        }}>
                            <img src={PHOTO} alt="Wood Kala furniture" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(44,31,20,0.2) 0%, rgba(44,31,20,0.1) 40%, rgba(44,31,20,0.7) 100%)' }} />
                            <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
                                <p style={{ fontFamily: C.serif, fontSize: '2.1rem', lineHeight: 1.3, fontWeight: 700, color: 'white' }}>
                                    {tab === 'login' ? '"Welcome back."' : '"Crafted with care,\nbuilt to last."'}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: 8 }}>
                                    Nepal's premium handcrafted furniture marketplace
                                </p>
                                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                    {[
                                        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&h=120&fit=crop&q=70',
                                        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=120&h=120&fit=crop&q=70',
                                        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&h=120&fit=crop&q=70',
                                    ].map((src, i) => (
                                        <div key={i} style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.25)' }}>
                                            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: form panel */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: C.bg }}>

                            {/* Form area */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
                                <div style={{ width: '100%', maxWidth: 500 }}>

                                    {/* Tab switcher */}
                                    <div style={{ display: 'flex', background: C.subtle, borderRadius: 12, padding: 4, marginBottom: 28 }}>
                                        {(['login', 'register'] as Tab[]).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => switchTab(t)}
                                                style={tabButtonStyle(tab === t, C)}
                                            >
                                                {t === 'login' ? 'Sign In' : 'Create Account'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Card */}
                                    <div style={{
                                        background: C.card,
                                        borderRadius: 16,
                                        padding: '44px',
                                        boxShadow: '0 4px 40px rgba(44,31,20,0.09)',
                                        border: `1px solid ${C.border}`,
                                    }}>
                                        <div key={key}>
                                            {tab === 'login'
                                                ? <LoginForm onSwitch={() => switchTab('register')} canResetPassword={canResetPassword} status={status} />
                                                : <RegisterForm onSwitch={() => switchTab('login')} />
                                            }
                                        </div>
                                    </div>

                                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: C.muted, marginTop: 24 }}>
                                        © 2026 Wood Kala Nepal ·{' '}
                                        <Link href={ROUTES.HOME} style={{ color: C.primary }}>Back to shop</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ── FOOTER ── */}
                    <footer style={footerStyle}>
                        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-5 text-xs" style={{ color: C.muted }}>
                                {['Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
                                    <Link key={l} href={ROUTES.HOME} className="hover:underline" style={{ color: C.muted }}>
                                        {l}
                                    </Link>
                                ))}
                            </div>
                            <p className="text-xs" style={{ color: C.muted }}>© 2026 Wood Kala Nepal</p>
                        </div>
                    </footer>
                </div>
            </ThemeContext.Provider>
        </>
    );
}

AuthPage.layout = (page: ReactNode) => page;
