import { Form, Head, Link } from '@inertiajs/react';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F9F8F6' }}>
            <Head title="Forgot Password — Wood Kala" />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <img src="/logo.png" alt="Wood Kala" className="h-14 w-auto" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: '#E8DDD0' }}>

                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6EE' }}>
                            <KeyRound className="w-6 h-6" style={{ color: '#A67C52' }} />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold mb-1" style={{ color: '#1A1A1A', fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Forgot your password?
                        </h1>
                        <p className="text-sm" style={{ color: '#7A6A5A' }}>
                            No worries. Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Success state */}
                    {status ? (
                        <div className="rounded-xl px-4 py-3.5 text-sm font-medium flex items-start gap-3 mb-4"
                            style={{ background: '#F0FDF4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                            <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{status}</span>
                        </div>
                    ) : null}

                    <Form {...email.form()}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#3D2B1F' }}>
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9A8070' }} />
                                        <input
                                            type="email"
                                            name="email"
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                                            style={{
                                                background: '#FDFCFA',
                                                border: errors.email ? '1px solid #ef4444' : '1px solid #DDD6CC',
                                                color: '#1A1A1A',
                                            }}
                                            onFocus={e => (e.target.style.borderColor = '#A67C52')}
                                            onBlur={e => (e.target.style.borderColor = errors.email ? '#ef4444' : '#DDD6CC')}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-11 rounded-xl text-sm font-semibold tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                    style={{ background: '#A67C52', color: '#fff' }}
                                    onMouseEnter={e => !processing && ((e.target as HTMLElement).style.background = '#8B6340')}
                                    onMouseLeave={e => ((e.target as HTMLElement).style.background = '#A67C52')}
                                >
                                    {processing ? (
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                    ) : null}
                                    {processing ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        )}
                    </Form>
                </div>

                {/* Back to login */}
                <div className="flex justify-center mt-5">
                    <Link href={login()}
                        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                        style={{ color: '#7A6A5A' }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#A67C52')}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = '#7A6A5A')}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
